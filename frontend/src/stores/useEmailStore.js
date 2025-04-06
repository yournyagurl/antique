import { create } from "zustand";
import axios from "../lib/axios"; // Make sure this is preconfigured axios
import toast from "react-hot-toast";

export const useEmailStore = create((set) => ({
  email: null,
  loading: false,
  error: null,

  sendEnquiry: async (enquiryData) => {
    set({ loading: true, error: null });
  
    try {
      // Make the POST request with the enquiry data
      const response = await axios.post("/email/send-enquiry", enquiryData); // Adjust the path if needed
  
      // Set state to indicate success and return response data
      set({ email: response.data, loading: false });
      toast.success("Enquiry sent successfully!");
      return { success: true, message: response.data.message || "Enquiry sent successfully!" };
      
    } catch (error) {
      console.error("Enquiry error:", error);
      
      // If error.response exists, get the error message
      const errorMessage = error.response?.data?.message || "Failed to send enquiry";
      
      // Set the error state and return the error message
      set({ error: errorMessage, loading: false });
      return { success: false, message: errorMessage };
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
