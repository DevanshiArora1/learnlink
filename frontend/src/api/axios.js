import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// REGISTER
export const registerUser = async (data) => {
  const res = await API.post("/api/auth/register", data);
  return res.data;
};

// LOGIN
export const loginUser = async (data) => {
  const res = await API.post("/api/auth/login", data);
  return res.data;
};

export default API;

