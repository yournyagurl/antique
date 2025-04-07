import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { placeOrder, getUserOrders} from "../controllers/payment.controller.js";


const router = express.Router();


router.post('/place-order', protectRoute, placeOrder)
router.get('/myorder', protectRoute, getUserOrders)


export default router