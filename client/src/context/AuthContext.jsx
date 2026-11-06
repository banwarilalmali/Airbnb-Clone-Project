import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  loginUser,
  signupUser,
  getCurrentUser,
  logoutUser,
} from "../services/authService";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
} from "../utils/helpers";

const AuthContext = createContext();

const safeParseUser = (raw) => {
  if (raw == null) return null;
  if (typeof raw === "object") return raw;
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : null;
  } catch {
    return null;
  }
};

const ensureCanonicalUser = (u) => {
  if (!u || typeof u !== "object") return null;
  const next = { ...u };
  if (next._id == null && next.id != null) next._id = next.id;
  return next;
};

/** Accepts { token, user } OR { token, name, email, ... } OR a bare user object (e.g. /auth/me). */
const normalizeUserFromResponse = (data) => {
  if (!data || typeof data !== "object") return null;
  if (data.user && typeof data.user === "object") {
    return ensureCanonicalUser({ ...data.user });
  }

  const { token: _t, password: _p, message: _m, ...rest } = data;
  if (rest._id || rest.id || rest.name || rest.email) {
    return ensureCanonicalUser({ ...rest });
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = useCallback(() => {
    removeLocalStorage("token");
    removeLocalStorage("user");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const persistSession = useCallback((token, nextUser) => {
    if (token) setLocalStorage("token", token);
    if (nextUser && typeof nextUser === "object") {
      setLocalStorage("user", nextUser);
    }
  }, []);

  const loadUser = useCallback(async () => {
    const token =
      typeof localStorage.getItem === "function"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      removeLocalStorage("user");
      setUser(null);
      setLoading(false);
      return;
    }

    const stored = getLocalStorage("user");
    const optimistic = safeParseUser(stored) || (stored && typeof stored === "object" ? stored : null);
    if (optimistic) setUser(optimistic);

    try {
      const data = await getCurrentUser();
      const current =
        normalizeUserFromResponse(data) ||
        (data && typeof data === "object" ? ensureCanonicalUser(data) : null);
      if (current && typeof current === "object") {
        setUser(current);
        setLocalStorage("user", current);
      } else {
        clearAuthStorage();
      }
    } catch {
      clearAuthStorage();
    } finally {
      setLoading(false);
    }
  }, [clearAuthStorage]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (formData) => {
    const data = await loginUser(formData);
    const token = data?.token;
    const currentUser = normalizeUserFromResponse(data);

    if (!token) {
      throw new Error("Token missing from response");
    }
    if (!currentUser) {
      throw new Error("User payload missing from response");
    }

    persistSession(token, currentUser);
    setUser(currentUser);
    return data;
  };

  const signup = async (formData) => {
    try {
      const data = await signupUser(formData);
      return data;
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      clearAuthStorage();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
