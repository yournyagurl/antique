import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,
  total: 0,
  subtotal: 0,

  getCartItems: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/cart/getcart");
      set({ cart: res.data.map(item => ({ ...item, quantity: 1 })) }); // Ensure quantity is 1 on fetch
      get().calculateTotals();
    } catch (error) {
      set({ error: error.message });
      toast.error("Failed to load cart items");
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ cart: [], total: 0, subtotal: 0 });
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart/addtocart", { productId: product._id });
      toast.success("Product added to cart");

      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: 1 } : item // Always set quantity to 1 if exists
            )
          : [...prevState.cart, { ...product, quantity: 1 }]; // Set quantity to 1 for new items
        return { cart: newCart };
      });

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/removefromcart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));

      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  getTotalShippingFee: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      if (item.deliveryPrice && typeof item.deliveryPrice === "number") {
        return total + item.deliveryPrice;
      }
      return total;
    }, 0);
  },

  getTotalCartAmount : () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price);
      return total + (isNaN(price) ? 0 : price * 1); // Multiply by 1 since quantity is always 1
    }, 0);
  },

  calculateTotals: () => {
    const subtotal = get().getTotalCartAmount();
    const shippingFee = get().getTotalShippingFee();
    const total = subtotal + shippingFee;
    set({ subtotal, total });
  },
}));