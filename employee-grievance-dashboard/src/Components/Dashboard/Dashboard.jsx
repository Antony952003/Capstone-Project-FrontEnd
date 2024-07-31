import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Content from "../Content/Content";
import ApprovalRequests from "../ApprovalRequest/ApprovalRequest";
import Employees from "../Employee/Employee"; // Import the new Employees component
import Solvers from "../Solver/Solver";
import Grievances from "../Grievances/Grievances";
import EditProfile from "../EditProfile/EditProfile";
import HomePage from "../Home/HomePage";

const Dashboard = () => {
  const { auth, logout, currentView, setCurrentView } = useContext(AuthContext);

  return (
    <>
      {/* <Navbar onChangeView={handleViewChange} /> */}
      <div className="dashboard-container">
        <Sidebar onChangeView={setCurrentView} />
        {currentView === "solvers" && <Solvers />}
        {currentView === "approvalRequests" && <ApprovalRequests />}
        {currentView === "employees" && <Employees />}
        {currentView === "content" && <HomePage />}
        {currentView === "grievances" && <Grievances />}
      </div>
    </>
  );
};

export default Dashboard;
