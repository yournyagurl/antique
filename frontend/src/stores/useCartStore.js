import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { get } from "mongoose";

export const useCartStore = create((set) => ({
    cart: [],
    loading: false,
    error: null,
    total: 0,
    subtotal: 0,


    fetchCart: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("cart/getcart");
            set({ cart: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred while fetching cart");
        }
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
			toast.error(error.response.data.message || "An error occurred");
		}
	},
    removeFromCart: async (productId) => {
		await axios.delete(`/cart/removefromcart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},


      calculateTotals: () => {
        const { cart } = get();
      
        // Sum all item prices (assuming quantity is 1 for now)
        const subtotal = cart.reduce((total, item) => {
          const quantity = item.quantity || 1;
          return total + item.price * quantity;
        }, 0);
      
        // Sum all delivery prices (default to 0 if not defined)
        const deliveryTotal = cart.reduce((total, item) => {
          return total + (item.deliveryPrice || 0);
        }, 0);
      
        // Final total = items + delivery
        const total = subtotal + deliveryTotal;
      
        // Update state
        set({ subtotal, deliveryTotal, total });
      }
      
      
      
}));