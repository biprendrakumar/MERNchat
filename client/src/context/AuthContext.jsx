import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../lib/axios.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("chatapp_token");
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }
      const res = await axiosInstance.get("/auth/check-auth");
      setAuthUser(res.data);
    } catch (error) {
      console.error("Check auth failed:", error.message);
      localStorage.removeItem("chatapp_token");
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (formData) => {
    const res = await axiosInstance.post("/auth/signup", formData);
    const { token, ...user } = res.data;
    localStorage.setItem("chatapp_token", token);
    setAuthUser(user);
    return user;
  };

  const login = async (formData) => {
    const res = await axiosInstance.post("/auth/login", formData);
    const { token, ...user } = res.data;
    localStorage.setItem("chatapp_token", token);
    setAuthUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("chatapp_token");
    setAuthUser(null);
  };

  const updateProfile = async (formData) => {
    const res = await axiosInstance.put("/auth/update-profile", formData);
    setAuthUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{ authUser, isCheckingAuth, signup, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
