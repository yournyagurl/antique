import Product from "../models/product.model.js"
import { notifySubscribers } from "../controllers/email.controller.js";
import multer from "multer";
import cloudinary from "../lib/cloudinary.js";

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


const storage = multer.memoryStorage(); // Store files in memory (you can also use diskStorage)
const upload = multer({ storage }).array('images'); // 'images' is the field name for the file input
export const createProduct = async (req, res) => {
    // Use multer to handle the file upload
    upload(req, res, async (err) => {
      if (err) {
        console.error("Multer upload error:", err);
        return res.status(500).json({ message: "Error uploading files", error: err.message });
      }
  
      try {
        const { name, description, price, category } = req.body;
  
        // Array to hold image URLs from Cloudinary
        let imageUrls = [];
  
        // Check if files were uploaded
        if (req.files && req.files.length > 0) {
          const uploadPromises = req.files.map((file) =>
            new Promise((resolve, reject) => {
              // Upload each file to Cloudinary
              cloudinary.uploader.upload_stream(
                {
                  folder: 'products', // Cloudinary folder where images will be stored
                  public_id: file.originalname.replace(/\s+/g, "_"), // Optional: Set a custom public_id
                  resource_type: 'auto', // Automatically detect file type (image, video, etc.)
                },
                (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    imageUrls.push(result.secure_url); // Store the secure URL of the uploaded image
                    resolve(result);
                  }
                }
              ).end(file.buffer); // End the stream and start uploading the file
            })
          );
  
          // Wait for all uploads to finish
          await Promise.all(uploadPromises);
        }
  
        // Create a new product with the Cloudinary image URLs
        const product = await Product.create({
          name,
          description,
          price,
          image: imageUrls, // Store the image URLs from Cloudinary in the database
          category,
        });
  
        // Notify subscribers about the new product

        await notifySubscribers(product);


        res.status(201).json({
          message: "Product created successfully",
          product,
        });
      } catch (error) {
        console.error("Create product error:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
      }
    });
  };
  


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

