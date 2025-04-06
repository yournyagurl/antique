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
      set({ cart: res.data });
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
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  removeFromCart: async (productId) => {
    await axios.delete(`/cart/removefromcart`, { data: { productId } });
    set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
    get().calculateTotals();
  },

  // Calculate the total shipping fee for all products in the cart
  getTotalShippingFee: () => {
    const { cart } = get();
    return cart.reduce((total, item) => {
      if (item.deliveryPrice && typeof item.deliveryPrice === "number") {
        return total + item.deliveryPrice; // Sum up shipping fees
      }
      return total;
    }, 0);
  },

  // Calculate total and subtotal
  getTotalCartAmount: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * 1, 0);
  },
}));
