import { redis } from "../lib/redis.js"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
const generateToken = (userId) => {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
        throw new Error("JWT secrets not defined in environment variables");
      }
      
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })

    return {accessToken, refreshToken}
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60) // 7 DAYS
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevent xss attack, cross site scripting attack
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",  // prevents CSRF attack
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const signup  = async (req, res,) => {
    const { name, email, password } = req.body
    const userExists = await User.findOne({ email })

    if (userExists) {
        return res.status(400).send("User already exists")
    }
    const user = await User.create({
        name,
        email,
        password
    })

    // authenticate 
    const {accessToken, refreshToken} = generateToken(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({user : { _id: user._id, name: user.name, email: user.email, role: user.role}}, "User created successfully")
    }

export const login  = async (req, res,) => {
    try {
        console.log("here runs the login");
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log("here runs the login2");
        if (user && (await user.comparePassword(password))) {
            const {accessToken, refreshToken} = generateToken(user._id);
            console.log("here runs the login3");
            await storeRefreshToken(user._id, refreshToken);

            setCookies(res, accessToken, refreshToken);

            res.status(200).json({
                message: "Login successful",
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role
                }
              });
              
        }
        else {
            res.status(400).json({message: "Invalid email or password"});
        }
    } catch (error) {
        console.error("Login error:", error);
  res.status(500).json({ message: "Internal server error" });
    }
    }

export const logout  = async (req, res,) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        res.status(500).json({message: "Logout failed", error});
    }
    }

    export const refreshToken = async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
    
            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token provided" });
            }
    
            let decoded;
            try {
                decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Refresh token expired" });
                }
                return res.status(401).json({ message: "Invalid refresh token" });
            }
    
            const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
    
            if (refreshToken !== storedToken) {
                return res.status(401).json({ message: "Invalid refresh token" });
            }
    
            const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "15m"
            });
    
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000
            });
    
            res.status(200).json({ message: "Refresh token successful" });
        } catch (error) {
            res.status(500).json({ message: "Refresh token failed", error });
        }
    };
    

// TODO: implement get profile

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};