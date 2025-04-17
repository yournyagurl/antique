import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" // your local backend port
      : "https://stokesantiquesandcollectibles.onrender.com/api", // your production API
  withCredentials: true, // Include credentials (cookies) in requests
});

// Request Interceptor (e.g., add authorization headers if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or state (if stored)
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Add the Authorization header if the token is available
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (e.g., refresh token on 401 errors)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token has expired (401), attempt to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Make a request to refresh the token (you can change this logic based on your API)
        const response = await axiosInstance.post("/auth/refresh-token");
        const newToken = response.data.accessToken;

        // Save the new token in localStorage
        localStorage.setItem("accessToken", newToken);

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If the refresh token fails, logout the user
        console.error("Refresh token failed:", refreshError);
        // Optional: Redirect to login page or logout logic
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
