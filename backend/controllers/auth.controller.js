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
            res.status(401).json({message: "Invalid email or password"});
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