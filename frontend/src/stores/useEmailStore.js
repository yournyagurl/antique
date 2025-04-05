import { create } from "zustand";
import axios from "../lib/axios"; // Make sure this is preconfigured axios

export const useEmailStore = create((set) => ({
  email: null,
  loading: false,
  error: null,

  sendEnquiry: async (enquiryData) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post("email/send-enquiry", enquiryData); // Adjust the path if needed
      set({ email: response.data, loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Enquiry error:", error);
      set({ error: error.response?.data?.message || "Failed to send enquiry", loading: false });
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  },

  subscribe: async (email) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post("email/subscribe", { email }); // Adjust endpoint if needed
      set({ email: response.data, loading: false });
      return { success: true, message: response.data.message || "Subscribed successfully!" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Subscription failed";
      set({ loading: false, error: errorMsg });
      return { success: false, message: errorMsg };
    }
  },
}));
