import Product from '../models/product.model.js';

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock < 1) {
      return res.status(400).json({ message: "Product is out of stock." });
    }

    const alreadyInCart = user.cartItems.find(
      item => item.product.toString() === productId
    );

    if (alreadyInCart) {
      return res.status(200).json({ message: "Product already in cart." });
    }

    user.cartItems.push({ product: productId });
    await user.save();

    return res.status(200).json({ message: "Product added to cart." }, user.cartItems);
  } catch (error) {
    console.error("Add to cart error: Controller", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getCart = async (req, res) => {
  try {
    // Fetch products where their _id is in the cartItems
    const productIds = req.user.cartItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    // Return the products in the cart
    res.json(products);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Failed to load cart items' });
  }
};


export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    // If no productId, remove all items from the cart
    if (!productId) {
      user.cartItems = [];
    } else {
      // Remove the specific product from the cart
      user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
    }

    // Save the updated user document
    await user.save();

    // Return the updated cart
    return res.status(200).json({ message: "Products removed from cart.", cartItems: user.cartItems });
  } catch (error) {
    console.error("Remove from cart error: Controller", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
