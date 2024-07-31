import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "date-fns";
import "./EmployeeDetail.css";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../ApiClient/apiClient";

const EmployeeDetail = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [grievanceType, setGrievanceType] = useState("");
  const [showGrievanceField, setShowGrievanceField] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Confirmation state for delete
  const [showConfirmDisapprove, setShowConfirmDisapprove] = useState(false); // Confirmation state for disapprove
  const [showConfirmAssignrole, setShowConfirmAssignrole] = useState(false); // Confirmation state for role assignment
  const [actionToConfirm, setActionToConfirm] = useState(""); // State to track which action to confirm

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:7091/api/Admin/GetEmployeeById?employeeid=${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setEmployee(response.data);
        setNewRole(response.data.role);
        if (response.data.role === "Solver") {
          setShowGrievanceField(true);
        }
      } catch (error) {
        console.error(
          "Failed to fetch employee:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (auth) {
      fetchEmployee();
    }
  }, [auth, id]);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setNewRole(selectedRole);
    if (selectedRole === "Solver") {
      setShowGrievanceField(true);
    } else {
      setShowGrievanceField(false);
      setGrievanceType("");
    }
  };

  const handleGrievanceTypeChange = (e) => {
    setGrievanceType(e.target.value);
  };

  const handleRoleAssignment = async () => {
    if (newRole === employee.role) {
      alert("The selected role is the same as the existing role.");
      return;
    }
    if (newRole === "Solver" && !grievanceType) {
      alert("Please select a grievance type for Solver.");
      return;
    }
    setActionToConfirm("assignRole");
    setShowConfirmAssignrole(true);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleDeleteEmployee = () => {
    setActionToConfirm("delete");
    setShowConfirmDelete(true);
  };

  const handleDisapproveEmployee = () => {
    setActionToConfirm("disapprove");
    setShowConfirmDisapprove(true);
  };

  const confirmAction = async () => {
    if (actionToConfirm === "delete") {
      try {
        await apiClient.post(
          `http://localhost:7091/api/Admin/DeleteUserById?id=${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        toast.success("Employee deleted successfully!", {
          className: "toast-success",
        });
        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Failed to delete employee:",
          error.response?.data?.message || error.message
        );
      }
      setShowConfirmDelete(false);
    } else if (actionToConfirm === "disapprove") {
      try {
        await apiClient.post(
          `http://localhost:7091/api/Admin/DisApproveUserById?id=${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        toast.success("Employee disapproved successfully!");
        setEmployee((prevEmployee) => ({ ...prevEmployee, approved: false }));
      } catch (error) {
        console.error(
          "Failed to disapprove employee:",
          error.response?.data?.message || error.message
        );
      }
      setShowConfirmDisapprove(false);
    } else if (actionToConfirm === "assignRole") {
      try {
        await apiClient.post(
          `http://localhost:7091/api/Admin/AssignRoleToUser`,
          {
            userId: id,
            role: newRole,
            grievanceType: newRole === "Solver" ? grievanceType : null,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        toast.success(`Employee assigned role ${newRole} successfully!`);
        setEmployee((prevEmployee) => ({ ...prevEmployee, role: newRole }));
        if (newRole === "Solver") {
          setEmployee((prevEmployee) => ({ ...prevEmployee, grievanceType }));
        }
      } catch (error) {
        console.error(
          "Failed to assign role:",
          error.response?.data?.message || error.message
        );
      }
      setShowConfirmAssignrole(false);
    }
    setActionToConfirm(""); // Reset action
  };

  const cancelAction = () => {
    setShowConfirmDelete(false);
    setShowConfirmDisapprove(false);
    setShowConfirmAssignrole(false);
    setActionToConfirm(""); // Reset action
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="employee-detail">
      {(showConfirmDelete ||
        showConfirmDisapprove ||
        showConfirmAssignrole) && <div className="overlay"></div>}
      <h2>Employee Details</h2>
      <div className="user-image">
        {employee.userImage != "string" ? (
          <img src={employee.userImage} alt="" />
        ) : (
          <FaCircleUser className="user-icon" />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">ID:</span>
        <span className="detail-value">{employee.userId}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Name:</span>
        <span className="detail-value">{employee.name}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Email:</span>
        <span className="detail-value">{employee.email}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Role:</span>
        <span className="detail-value">{employee.role}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Date of Birth:</span>
        <span className="detail-value">{formatDate(employee.dob)}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Approved:</span>
        <span className="detail-value">
          {employee.isApproved ? "Yes" : "No"}
        </span>
      </div>
      <div className="role-assignment">
        <div className="assign-role-field">
          <label htmlFor="role">Assign New Role:</label>
          <select id="role" value={newRole} onChange={handleRoleChange}>
            <option value="Solver">Solver</option>
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        {showGrievanceField && (
          <div className="grievance-type">
            <label htmlFor="grievanceType">Grievance Type:</label>
            <select
              id="grievanceType"
              value={grievanceType}
              onChange={handleGrievanceTypeChange}
            >
              <option value="">Select Grievance Type</option>
              <option value="Technical">IT</option>
              <option value="HR">HR</option>
              <option value="ProjectManagement">Project Management</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        )}
        <button onClick={handleRoleAssignment}>Assign Role</button>
      </div>
      <div className="approve-btns">
        <button className="delete-button" onClick={handleDeleteEmployee}>
          Delete Employee
        </button>
        <button
          className="disapprove-button"
          onClick={handleDisapproveEmployee}
        >
          Disapprove Employee
        </button>
      </div>
      <div className="go-back">
        <button className="go-back-button" onClick={handleGoBack}>
          <IoIosArrowBack /> Go Back to Dashboard
        </button>
      </div>
      {/* Confirmation Dialog for Deleting Employee */}
      {showConfirmDelete && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this employee?</p>
          <button onClick={confirmAction}>Confirm</button>
          <button onClick={cancelAction}>Cancel</button>
        </div>
      )}
      {/* Confirmation Dialog for Deleting Employee */}
      {showConfirmAssignrole && (
        <div className="confirmation-dialog">
          <p>
            Are you sure you want to assign {newRole} role with specialization
            of {grievanceType} to this Employee?
          </p>
          <button className="approved-button" onClick={confirmAction}>
            Confirm
          </button>
          <button onClick={cancelAction}>Cancel</button>
        </div>
      )}

      {/* Confirmation Dialog for Disapproving Employee */}
      {showConfirmDisapprove && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to disapprove this employee?</p>
          <button onClick={confirmAction}>Confirm</button>
          <button onClick={cancelAction}>Cancel</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeDetail;
