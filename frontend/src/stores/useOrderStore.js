import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    error: null,
    fetchOrders: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/orders/getorders");
            set({ orders: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    placeOrder: async (orderData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/orders/placeorder", orderData);
            set({ orders: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "An error occurred");
        }
    },
}));