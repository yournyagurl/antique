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
      const products = await Product.find({ _id: { $in: req.user.cartItems } });
      res.json(products);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Failed to load cart items' });
    }
  };


export const removeAllFromCart = async (req, res) => {
    try{
        const { productId } = req.body;
        const user = req.user;

        if(!productId) {
            user.cartItems = [];
        }
        else {
            user.cartItems = user.cartItems.filter(item => item.product.toString() !== productId);
        }

        await user.save();

        return res.status(200).json({ message: "Products removed from cart." }, user.cartItems);
    } catch (error) {
        console.error("Remove from cart error: Controller", error);
        res.status(500).json({ message: "Internal server error." });
    }
}