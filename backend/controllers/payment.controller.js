import { stripe } from "../lib/stripe.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
    try {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
  }

  let totalAmount = 0;

  const lineItems = products.map((product) => {
      const amount =  Math.round(product.price + product.deliveryPrice) * 100; // Convert to cents
      totalAmount += amount;

      return {
          price_data: {
              currency: "gbp",
              product_data: {
                  name: product.name,
                  images: [product.image[0]],
              },
              unit_amount: amount,
          },
      };
  });

  const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
  });

  res.json({ url: session.url });

} catch (error) {
  
  console.error("Create checkout session error:", error);
  res.status(500).json({ message: "Something went wrong" }, error.message);

}

}

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const products = JSON.parse(session.metadata.products);
            const userId = session.metadata.userId;

            const newOrder = new Order({
                user: userId,
                products: products.map(product => ({
                    product: product.id,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: session.id
            });

            const savedOrder = await newOrder.save();

            // Fetch the user to get their email
            const user = await User.findById(userId);
            if (!user || !user.email) {
                return res.status(400).json({ message: "User email not found" });
            }

            // Send confirmation email
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const productListHtml = products.map(p => `
                <li>${p.name} - $${p.price.toFixed(2)}</li>
            `).join('');

            const mailOptions = {
                from: `"Your Store" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'Order Confirmation',
                html: `
                    <h2>Hi ${user.name},</h2>
                    <p>Thanks for your order! 🎉</p>
                    <p><strong>Order Total:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
                    <h3>Items:</h3>
                    <ul>${productListHtml}</ul>
                    <p>We’ll notify you when your order ships.</p>
                    <p>Order ID: ${savedOrder._id}</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return res.status(200).json({ message: "Order created and confirmation email sent." });
        } else {
            return res.status(400).json({ message: "Payment not completed." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error processing payment",
            error: error.message
        });
    }
};