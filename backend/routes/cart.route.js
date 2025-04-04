import express from "express";
import { addToCart, getCart, removeAllFromCart } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/getcart", protectRoute, getCart)
router.post("/addtocart", protectRoute, addToCart)
router.delete("/:id", protectRoute, removeAllFromCart)

export default router