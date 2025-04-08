import Order from "../models/order.model.js"; // Import the order model
import Product from "../models/product.model.js"; // Import the product model
import Stripe from "stripe"; // Stripe for handling payments
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // Import nodemailer

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Nodemailer setup (remains the same)
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your email service provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOrderConfirmationEmail = async (order, userEmail) => {
    try {
        const productDetails = await Promise.all(
            order.products.map(async (item) => {
                const product = await Product.findById(item.product);
                return `${product?.name} (Price: £${item.price})`;
            })
        );

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Order Confirmation',
            html: `
                <p>Dear ${order.shippingInfo.firstName} ${order.shippingInfo.lastName},</p>
                <p>Thank you for your order!</p>
                <p>Your order details are as follows:</p>
                <ul>
                    ${productDetails.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
                <p>Total Amount: £${order.totalAmount}</p>
                <p>Shipping Address:</p>
                <p>${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                <p>${order.shippingInfo.address}</p>
                <p>${order.shippingInfo.city}, ${order.shippingInfo.postcode}</p>
                <p>${order.shippingInfo.country}</p>
                <p>Your order will be processed and shipped soon.</p>
                <p>Sincerely,<br>Stokes Antiques and Collectibles</p>
            `,
        }; 

        const info = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
    }
};

export const placeOrder = async (req, res) => {
    console.log("Received /payment/place-order request:", req.body); // Log the incoming request

    try {
        const { products, shippingInfo, totalAmount } = req.body;
        const userId = req.user._id;

        const lineItems = [];
        let calculatedProductTotal = 0;
        let backendTotalAmount = 0;
        let orderDeliveryPrice = 0;

        for (const item of products) {
            const product = await Product.findById(item.product);
            console.log("Product:", product);
            console.log("Item:", item);

            if (!product) {
                console.log("Product not found:", item.product);
                return res.status(400).json({ message: `Product not found: ${item.product}` });
            }
            if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
                console.log("Invalid quantity:", item);
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
            calculatedProductTotal += product.price * item.quantity;

            if (product.deliveryPrice > orderDeliveryPrice) {
                orderDeliveryPrice = product.deliveryPrice;
            }
        }

        if (orderDeliveryPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: "gbp",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: orderDeliveryPrice * 100,
                },
                quantity: 1,
            });
        }

        backendTotalAmount = calculatedProductTotal + orderDeliveryPrice;

        if (isNaN(backendTotalAmount)) {
            console.error("backendTotalAmount is NaN. Products:", products, "Order Delivery Price:", orderDeliveryPrice);
            return res.status(500).json({ message: "Error calculating total amount" });
        }

        if (backendTotalAmount !== totalAmount) {
            console.log("Total amount mismatch:", backendTotalAmount, totalAmount);
            return res.status(400).json({
                message: "Total amount mismatch",
                calculatedTotal: backendTotalAmount,
                receivedTotal: totalAmount,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/confirmorder`,
            cancel_url: `${process.env.CLIENT_URL}/order/cancel`,
            client_reference_id: userId.toString(),
        });

        console.log("Stripe Session created:", session);

        const newOrder = new Order({
            user: userId,
            products: await Promise.all(products.map(async (item) => ({
                product: item.product,
                price: (await Product.findById(item.product))?.price || 0,
            }))),
            totalAmount: backendTotalAmount,
            stripeSessionId: session.id,
            shippingInfo,
        });

        console.log("New Order object created:", newOrder);

        await newOrder.save();

        // Send order confirmation email using the email from shippingInfo
        sendOrderConfirmationEmail(newOrder, newOrder.shippingInfo.email);

        console.log("Order saved. Sending URL:", session.url);
        return res.json({ url: session.url });

    } catch (error) {
        console.error("Error in placeOrder:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
      const userId = req.user._id;

      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Failed to fetch user orders" });
    }
  };