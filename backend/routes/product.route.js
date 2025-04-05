import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, newCollection } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts)
router.get("/newcollection", newCollection)
router.post("/createproduct", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.get("/categpory/:category", getProductsByCategory)


export default router