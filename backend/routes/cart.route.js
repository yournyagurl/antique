import express from "express";
import { addtocart } from "../controllers/cart.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/getcart", protectRoute, getCart)
router.post("/addtocart", protectRoute, addtocart)
router.delete("/:id", protectRoute, removeAllFromCart)

export default router