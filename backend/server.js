import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



import authRoutes from "./routes/auth.route.js";


import { connectDb } from "./lib/db.js";

dotenv.config();
const app = express();

app.use (express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);




app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT = " + process.env.PORT);

    // db connection
    connectDb();
})  