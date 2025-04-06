import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development"
      ? "http://localhost:5000/api" // your local backend port
      : "https://antique-ej8u.onrender.com/api", // your production API
    withCredentials: true,
  });
  
export default axiosInstance