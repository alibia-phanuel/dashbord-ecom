import axios, { type AxiosInstance } from "axios";

// 🛠️ Create Axios instance with base URL from environment
const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
