import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./Dashboard.css";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Content from "../Content/Content";
import ApprovalRequests from "../ApprovalRequest/ApprovalRequest";
import Employees from "../Employee/Employee"; // Import the new Employees component

const Dashboard = () => {
  const { auth, logout } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState("content");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <>
      <Navbar onChangeView={handleViewChange} />
      <div className="dashboard-container">
        <Sidebar onChangeView={handleViewChange} />
        {currentView === "approvalRequests" && <ApprovalRequests />}
        {currentView === "employees" && <Employees />}
        {currentView === "content" && <Content />}
      </div>
    </>
  );
};

export default Dashboard;
