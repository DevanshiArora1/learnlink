import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,  // important for JWT cookies
});

// Add token (if saved) to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("learnlink_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
