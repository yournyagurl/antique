import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductsByCategory, newCollection } from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/getallproducts", getAllProducts)
router.get("/newcollection", newCollection)
router.post("/createproduct", createProduct);
router.delete("/:id", deleteProduct);
router.get("/categpory/:category", getProductsByCategory)



export default router