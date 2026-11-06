import api from "./api";

/* ================= AUTH SERVICES ================= */

// Signup
export const signupUser = async (data) => {
  try {
    const res = await api.post("/auth/signup", data);

    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed ❌" };
  }
};

// Login
export const loginUser = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed ❌" };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data;
  } catch (error) {
    throw error.response?.data || { message: "Fetch user failed ❌" };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");

    // Clear token
    localStorage.removeItem("token");

    return true;
  } catch (error) {
    localStorage.removeItem("token"); // force logout
    throw error.response?.data || { message: "Logout failed ❌" };
  }
};