import React, { useContext, useEffect, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaCircleUser } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";

function Sidebar({ onChangeView }) {
  const navigate = useNavigate();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { logout, auth } = useContext(AuthContext);
  const [userrole, setUserRole] = useState("");

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    if (auth != null) {
      setUserRole(auth.user.role);
    }
  }, [auth]);

  return (
    <>
      <div className={`sidebar-container ${isSidebarVisible ? "active" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isSidebarVisible ? "<" : ">"}
        </button>
        <p id="dashboard-head">DASHBOARD</p>
        {userrole === "Admin" && (
          <>
            <ul>
              <li
                onClick={() => {
                  onChangeView("approvalRequests");
                }}
              >
                Approval Requests
              </li>
              <li onClick={() => onChangeView("employees")}>
                View All Employees
              </li>
              <li onClick={() => onChangeView("solvers")}>View All Solvers</li>
              <li onClick={() => onChangeView("grievances")}>Grievances</li>
              <li onClick={() => navigate(`/editprofile/${auth.user.userId}`)}>
                Edit Profile
              </li>
            </ul>
          </>
        )}
        {userrole === "Employee" && (
          <>
            <ul>
              {auth?.user?.isApproved == false && (
                <li onClick={() => onChangeView("requestApproval")}>
                  Request Approval
                </li>
              )}
              {auth?.user?.isApproved == true && (
                <li onClick={() => onChangeView("requestApproval")}>
                  View Request Status
                </li>
              )}
              <li
                onClick={() => {
                  var approveError =
                    "Your Account is not yet Approved to Raise or Manage grievances !!";
                  if (auth.user.isApproved == false) {
                    toast.error(<>{approveError}</>);
                  } else {
                    onChangeView("grievances");
                  }
                }}
              >
                My Grievances
              </li>
              <li
                onClick={() => {
                  var approveError =
                    "Your Account is not yet Approved to Raise or Manage grievances !!";
                  if (auth.user.isApproved == false) {
                    toast.error(<>{approveError}</>);
                  } else {
                    onChangeView("raiseGrievance");
                  }
                }}
              >
                Raise Grievance
              </li>
              <li onClick={() => navigate(`/editprofile/${auth.user.userId}`)}>
                Edit Profile
              </li>
              <li>Help & Support</li>
            </ul>
          </>
        )}
        {userrole === "Solver" && (
          <>
            <ul>
              {auth?.user?.isApproved == false && (
                <li onClick={() => onChangeView("requestApproval")}>
                  Request Approval
                </li>
              )}
              {auth?.user?.isApproved == true && (
                <li onClick={() => onChangeView("requestApproval")}>
                  View Request Status
                </li>
              )}
              <li
                onClick={() => {
                  var approveError =
                    "Your Account is not yet Approved make a approval request !!";
                  if (auth.user.isApproved == false) {
                    toast.error(<>{approveError}</>);
                  } else {
                    onChangeView("grievances");
                  }
                }}
              >
                Assigned Grievances
              </li>
              <li onClick={() => onChangeView("viewrating")}>View Reviews</li>
              <li onClick={() => navigate(`/editprofile/${auth.user.userId}`)}>
                Edit Profile
              </li>
              <li>Help & Support</li>
            </ul>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default Sidebar;
