// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  const setLoadingWithDelay = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:7091/api/Auth/login",
        { email, password }
      );
      const delay = setLoadingWithDelay(3000); // Minimum 3 seconds delay
      await Promise.all([response, delay]);
      setAuth(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, dob, password, userImage) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:7091/api/Auth/register", {
        name,
        email,
        phone,
        dob,
        password,
        userImage,
      });
      const delay = setLoadingWithDelay(3000); // Minimum 3 seconds delay
      await Promise.all([delay]);
      navigate("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:7091/api/Auth/CheckUsernameAvailablity?name=${username}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Username check failed:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const checkUsermailAvailability = async (mail) => {
    try {
      const response = await axios.post(
        `http://localhost:7091/api/Auth/CheckUsermailAvailablity?mail=${mail}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Usermail check failed:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        register,
        checkUsernameAvailability,
        checkUsermailAvailability,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
