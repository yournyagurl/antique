import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controllers/analytics.controller.js";


const router = express.Router();


router.get("/", protectRoute, adminRoute, async (req, res) => {
    try {
        const analyticsData = await getAnalyticsData();
        const startDate = new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        const dailySalesData = await getDailySalesData(startDate, endDate);

        res.json({ analyticsData, dailySalesData });
    } catch (error) {
        
        console.log("Error fetching analytics data:", error.message);
        res.status(500).json({ message: "Something went wrong" });

    }
} )

export default router