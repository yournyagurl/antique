import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "https://antique-ej8u.onrender.com" : "/api",
    withCredentials: true,
})

export default axiosInstance