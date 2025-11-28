import API from "./api";

// REGISTER user
export const registerUser = async (data) => {
  const res = await API.post("/api/auth/register", data);

  // Save token
  if (res.data?.token) {
    localStorage.setItem("learnlink_token", res.data.token);
  }

  return res.data;
};

// LOGIN user
export const loginUser = async (data) => {
  const res = await API.post("/api/auth/login", data);

  // Save token
  if (res.data?.token) {
    localStorage.setItem("learnlink_token", res.data.token);
  }

  return res.data;
};
