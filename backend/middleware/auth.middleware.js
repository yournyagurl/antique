import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // ✅ Make sure this is imported

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = user; // attach user to request


        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        console.error("Protect route error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const adminRoute = (req, res, next) => {
   if(req.user && req.user.role === "admin") {
        next();
   } else {
        res.status(403).json({ message: "Not authorized - Not an admin" });
   }
};

