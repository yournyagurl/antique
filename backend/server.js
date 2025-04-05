import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import emailRoutes from "./routes/email.routes.js";
import cartRoutes from "./routes/cart.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";


import { connectDb } from "./lib/db.js";

dotenv.config();
const app = express();

app.use (express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("api/analytics", analyticsRoutes);


app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT = " + process.env.PORT);

    // db connection
    connectDb();
})  