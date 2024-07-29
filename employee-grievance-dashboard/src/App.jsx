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
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees/:id" element={<EmployeeDetail />} />
      <Route path="/solvers/:id" element={<SolverDetail />} />
    </Routes>
  );
};

export default App;
