import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus} from "../controllers/payment.controller.js";


const router = express.Router();


router.post('/place-order', protectRoute, placeOrder)
router.get('/myorder', protectRoute, getUserOrders)
router.get('/getallorders', getAllOrders)
router.post('/updatestatus', updateOrderStatus)


export default router