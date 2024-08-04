import React, { createContext, useState, useEffect } from "react";
import apiClient from "../ApiClient/apiClient"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage on initial render
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setAuth(JSON.parse(user));
    }
  }, []);

  // useEffect(() => {
  //   const refreshToken = async () => {
  //     var token = localStorage.getItem("user");
  //     token = JSON.parse(token);
  //     console.log(token);
  //     if (token) {
  //       try {
  //         const response = await apiClient.post("/Auth/refresh-token", {
  //           token: token.refreshToken,
  //         });
  //         const newAccessToken = response.data.accessToken;
  //         setAuth((prev) => ({ ...prev, accessToken: newAccessToken })); // Update the auth state
  //         localStorage.setItem("accessToken", newAccessToken);
  //       } catch (error) {
  //         console.error("Error refreshing token:", error);
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("refreshToken");
  //         // navigate("/login");
  //       }
  //     }
  //   };
  //   refreshToken();
  // }, [navigate]);

  const [currentView, setCurrentView] = useState("content");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const setLoadingWithDelay = (delay) => {
    return new Promise((resolve) => setTimeout(resolve, delay));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/Auth/login", { email, password });
      const delay = setLoadingWithDelay(1000); // Minimum 3 seconds delay
      await Promise.all([delay]);

      console.log(response.data);

      // Extract data from the response
      const { accessToken, refreshToken } = response.data;

      // Update the auth context
      setAuth(response.data);

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("accessToken", accessToken); // Correct usage
      localStorage.setItem("refreshToken", refreshToken); // Correct usage
      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return "Login failed";
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, phone, dob, password, userImage) => {
    setLoading(true);
    try {
      const response = await apiClient.post("/Auth/register", {
        name,
        email,
        phone,
        dob,
        password,
        userImage,
      });
      const delay = setLoadingWithDelay(3000); // Minimum 3 seconds delay
      await Promise.all([delay]);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      toast.success("Registered Successfully !!");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      toast.error(`Error in register ${error.response?.data?.details}`);
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await apiClient.post(
        `/Auth/CheckUsernameAvailablity?name=${username}`
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
      const response = await apiClient.post(
        `/Auth/CheckUsermailAvailablity?mail=${mail}`
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setCurrentView("content");
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
        setAuth,
        currentView,
        setCurrentView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
