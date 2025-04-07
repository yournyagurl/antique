import Order from "../models/order.model.js"; // Import the order model
import Product from "../models/product.model.js"; // Import the product model
import Stripe from "stripe"; // Stripe for handling payments
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const placeOrder = async (req, res) => {
    console.log("Received /payment/place-order request:", req.body); // Log the incoming request

    try {
        const { products, shippingInfo, totalAmount } = req.body;
        const userId = req.user._id;

        const lineItems = [];
        let calculatedTotalAmount = 0;

        for (let item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                console.log("Product not found:", item.product); // Log if product not found
                return res.status(400).json({ message: `Product not found: ${item.product}` });
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                console.log("Invalid quantity:", item); // Log invalid quantity
                return res.status(400).json({ message: `Invalid quantity for product: ${product.name}` });
            }
            lineItems.push({
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: product.price * 100,
                },
                quantity: item.quantity,
            });
            calculatedTotalAmount += product.price * item.quantity;
        }

        if (calculatedTotalAmount !== totalAmount) {
            console.log("Total amount mismatch:", calculatedTotalAmount, totalAmount); // Log amount mismatch
            return res.status(400).json({ message: "Total amount mismatch" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/myorders`,
            cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
            client_reference_id: userId.toString(),
        });

        console.log("Stripe Session created:", session); // Log the session object

        const newOrder = new Order({
            user: userId,
            products: await Promise.all(products.map(async (item) => ({
                product: item.product,
                price: (await Product.findById(item.product))?.price || 0,
            }))),
            totalAmount,
            stripeSessionId: session.id,
            shippingInfo,
        });

        console.log("New Order object created:", newOrder); // Log the order object

        await newOrder.save();

        console.log("Order saved. Sending URL:", session.url); // Log before sending the URL
        return res.json({ url: session.url }); // Explicitly return the JSON response

    } catch (error) {
        console.error("Error in placeOrder:", error); // Log the full error
        return res.status(500).json({ message: "Internal server error", error: error.message }); // Include error message in response
    }
};

export const getUserOrders = async (req, res) => {
	try {
	  const userId = req.user._id; // Assuming your authentication middleware adds user info to req.user
  
	  const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }); // Find orders by user, sort by most recent
  
	  res.status(200).json(orders);
	} catch (error) {
	  console.error("Error fetching user orders:", error);
	  res.status(500).json({ message: "Failed to fetch user orders" });
	}
  };
  

