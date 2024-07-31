import React, { useContext, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCircleUser } from "react-icons/fa6";

function Sidebar({ onChangeView }) {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { logout, auth } = useContext(AuthContext);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  return (
    <>
      <div className={`sidebar-container ${isSidebarVisible ? "active" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarVisible ? "<" : ">"}
        </button>
        <p id="dashboard-head">DASHBOARD</p>
        <ul>
          <li
            onClick={() => {
              onChangeView("approvalRequests");
            }}
          >
            Approval Requests
          </li>
          <li onClick={() => onChangeView("employees")}>View All Employees</li>
          <li onClick={() => onChangeView("solvers")}>View All Solvers</li>
          <li onClick={() => onChangeView("grievances")}>Grievances</li>
          <li onClick={() => navigate(`/editprofile/${auth.user.userId}`)}>
            Edit Profile
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
