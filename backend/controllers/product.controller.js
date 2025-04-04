import Product from "../models/product.model.js"
import { v2 as cloudinary } from "cloudinary";

export const getAllProducts = async (req, res) => {
    try {

        const products = await Product.find({});
        res.json(products);
        
    } catch (error) {

        console.log("Error fetching products", error);
        res.status(500).json({message: "Error fetching products", error});
        
    }
}

export const newCollection = async (req, res) => {
    let products = await ProductModel.find({});
    let newCollection = products.slice(1).slice(-4);
    console.log("new collection fetched");
    res.send(newCollection);
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, images = [], category } = req.body;

        let imageUrls = [];

        if (Array.isArray(images) && images.length > 0) {
            const uploadPromises = images.map(img =>
                cloudinary.uploader.upload(img, {
                    folder: "products"
                })
            );

            const uploadedResponses = await Promise.all(uploadPromises);
            imageUrls = uploadedResponses.map(resp => resp.secure_url);
        }

        const product = await Product.create({
            name,
            description,
            price,
            images: imageUrls, // Make sure your model accepts this as an array
            category
        });

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ✅ Loop through and delete all images in the images array
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map((url) => {
                const publicId = url.split("/").pop().split(".")[0];
                return cloudinary.uploader.destroy(`products/${publicId}`);
            });

            try {
                await Promise.all(deletePromises);
            } catch (error) {
                console.error("Error deleting images from Cloudinary:", error);
                // Optional: Continue even if some deletions fail
            }
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
    }

