import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "../src/Components/Login/Login";
import Register from "../src/Components/Register/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import EmployeeDetail from "./Components/EmployeeDetail/EmployeeDetail";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import SolverDetail from "./Components/SolverDetail/SolverDetail";
import GrievanceDetail from "./Components/GrievanceDetail/GrievanceDetail";
import GrievanceHistory from "./Components/GrievanceHistory/GrievanceHistory";
import Navbar from "./Components/Navbar/Navbar";
import MainLayout from "./Components/MainLayout/MainLayout";
import EditProfile from "./Components/EditProfile/EditProfile";

const App = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={auth ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <MainLayout>
            <EmployeeDetail />
          </MainLayout>
        }
      />
      <Route
        path="/grievances/:id"
        element={
          <MainLayout>
            <GrievanceDetail />
          </MainLayout>
        }
      />
      <Route
        path="/solvers/:id"
        element={
          <MainLayout>
            <SolverDetail />
          </MainLayout>
        }
      />
      <Route
        path="/grievancehistory/:grievanceId"
        element={
          <MainLayout>
            <GrievanceHistory />
          </MainLayout>
        }
      />
      <Route
        path="/editprofile/:id"
        element={
          <MainLayout>
            <EditProfile />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default App;
