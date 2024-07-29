import React from "react";
import { IoMdArrowDropright } from "react-icons/io";

function Sidebar({ onChangeView }) {
  return (
    <>
      <div className="sidebar-container">
        <p id="dashboard-head">DASHBOARD</p>
        <ul>
          <li onClick={() => onChangeView("approvalRequests")}>
            Approval Requests
          </li>
          <li onClick={() => onChangeView("employees")}>View All Employees</li>
          <li>View All Solvers</li>
          <li>Assign Grievances</li>
          <li>Edit Profile</li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
