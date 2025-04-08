import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password }) => {
		set({ loading: true });
		try {
		  const res = await axios.post("/auth/signup", { name, email, password });
		  set({ user: res.data, loading: false });
		  toast.success("Account created successfully!"); // Add toast confirmation
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.message || "An error occurred during signup");
		}
	  },
	  login: async (email, password) => {
		set({ loading: true });
	  
		try {
		  const res = await axios.post("/auth/login", { email, password });
	  
		  // Save the access token and refresh token to localStorage
		  localStorage.setItem('accessToken', res.data.accessToken);
		  localStorage.setItem('refreshToken', res.data.refreshToken);
	  
		  // Update the user state with the login response data
		  set({ user: res.data, loading: false });
	  
		  console.log("Access Token: ", res.data.accessToken);  // Log the access token
		  console.log("Refresh Token: ", res.data.refreshToken);  // Log the refresh token
	  
		} catch (error) {
		  set({ loading: false });
		  toast.error(error.response?.data?.message || "An error occurred during login");
		}
	  },
	  
	  
	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("/auth/profile");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},

	refreshToken: async () => {
		if (get().checkingAuth) return;
	  
		set({ checkingAuth: true });
		try {
		  const response = await axios.post("/auth/refresh-token");
		  const newToken = response.data.accessToken;  // Assuming the response contains the new token
		  // Store the new token in localStorage or cookies
		  localStorage.setItem('accessToken', newToken);
	  
		  set({ checkingAuth: false });
		  return newToken;  // Return the new token
		} catch (error) {
		  set({ user: null, checkingAuth: false });
		  throw error;
		}
	  },
	  
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);