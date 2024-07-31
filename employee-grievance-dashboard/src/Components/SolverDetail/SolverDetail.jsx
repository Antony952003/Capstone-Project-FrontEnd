import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "date-fns";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../EmployeeDetail/EmployeeDetail.css";
import apiClient from "../../ApiClient/apiClient";

const SolverDetail = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [solver, setSolver] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [grievanceType, setGrievanceType] = useState("");
  const [newGrievanceType, setNewGrievanceType] = useState("");
  const [showGrievanceField, setShowGrievanceField] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDisapprove, setShowConfirmDisapprove] = useState(false);
  const [showConfirmAssignRole, setShowConfirmAssignRole] = useState(false);
  const [showConfirmChangeDepartment, setShowConfirmChangeDepartment] =
    useState(false); // Confirmation state for changing department
  const [actionToConfirm, setActionToConfirm] = useState("");

  useEffect(() => {
    const fetchSolver = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:7091/api/Admin/GetSolverById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        setSolver(response.data);
        setNewRole(response.data.role);
        if (response.data.role === "Solver") {
          setShowGrievanceField(true);
        }
      } catch (error) {
        console.error(
          "Failed to fetch solver:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (auth) {
      fetchSolver();
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
    if (newRole === solver.role) {
      alert("The selected role is the same as the existing role.");
      return;
    }
    if (newRole === "Solver" && !grievanceType) {
      alert("Please select a grievance type for Solver.");
      return;
    }
    setActionToConfirm("assignRole");
    setShowConfirmAssignRole(true);
  };

  const handleDepartmentChange = async () => {
    setActionToConfirm("changeDepartment");
    setShowConfirmChangeDepartment(true);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleDeleteSolver = () => {
    setActionToConfirm("delete");
    setShowConfirmDelete(true);
  };

  const handleDisapproveSolver = () => {
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
        toast.success("Solver deleted successfully!", {
          className: "toast-success",
        });
        navigate("/dashboard");
      } catch (error) {
        console.error(
          "Failed to delete solver:",
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
        toast.success("Solver disapproved successfully!");
        setSolver((prevSolver) => ({ ...prevSolver, approved: false }));
      } catch (error) {
        console.error(
          "Failed to disapprove solver:",
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
        toast.success(`Solver assigned role ${newRole} successfully!`);
        setSolver((prevSolver) => ({ ...prevSolver, role: newRole }));
        if (newRole === "Solver") {
          setSolver((prevSolver) => ({ ...prevSolver, grievanceType }));
        }
      } catch (error) {
        console.error(
          "Failed to assign role:",
          error.response?.data?.message || error.message
        );
      }
      setShowConfirmAssignRole(false);
    } else if (actionToConfirm === "changeDepartment") {
      try {
        await apiClient.put(
          `http://localhost:7091/api/Admin/ChangeDepartmentBySolverId?solverid=${id}&departmenttype=${newGrievanceType}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${auth.accessToken}`,
            },
          }
        );
        toast.success(
          `Solver department changed to ${newGrievanceType} successfully!`
        );
        setSolver((prevSolver) => ({ ...prevSolver, grievanceType }));
        setTimeout(() => {
          location.reload();
        }, 2000);
      } catch (error) {
        console.error(
          "Failed to change department:",
          error.response?.data?.message || error.message
        );
      }
      setShowConfirmChangeDepartment(false);
    }
    setActionToConfirm(""); // Reset action
  };

  const cancelAction = () => {
    setShowConfirmDelete(false);
    setShowConfirmDisapprove(false);
    setShowConfirmAssignRole(false);
    setShowConfirmChangeDepartment(false);
    setActionToConfirm(""); // Reset action
  };

  const handleGoBack = () => {
    navigate("/dashboard");
  };

  if (!solver) return <div>Loading...</div>;

  return (
    <div className="employee-detail">
      {(showConfirmDelete ||
        showConfirmDisapprove ||
        showConfirmAssignRole ||
        showConfirmChangeDepartment) && <div className="overlay"></div>}
      <h2>Solver Details</h2>
      <div className="user-image">
        {solver.userImage != "string" ? (
          <img src={solver.userImage} alt="" />
        ) : (
          <FaCircleUser className="user-icon" />
        )}
      </div>
      <div className="detail-item">
        <span className="detail-label">ID:</span>
        <span className="detail-value">{solver.userId}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Name:</span>
        <span className="detail-value">{solver.name}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Email:</span>
        <span className="detail-value">{solver.email}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Role:</span>
        <span className="detail-value">{solver.role}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Date of Birth:</span>
        <span className="detail-value">{formatDate(solver.dob)}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Approved:</span>
        <span className="detail-value">{solver.isApproved ? "Yes" : "No"}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Active:</span>
        <span className="detail-value">
          {solver.isAvailable ? "NotActive" : "Active"}
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Grievance Department Type:</span>
        <span className="detail-value">{solver.grievanceDepartmentType}</span>
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
          <div className="assign-grievance-field">
            <label htmlFor="grievanceType">Grievance Type:</label>
            <select
              id="grievanceType"
              value={grievanceType}
              onChange={handleGrievanceTypeChange}
            >
              <option value="">Select Grievance Type</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Facilities">Facilities</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
        )}
      </div>
      <div className="actions">
        <div className="btns-firstrow">
          <button className="assign-role-btn" onClick={handleRoleAssignment}>
            Assign Role
          </button>
          <button
            className="disapprove-button"
            onClick={handleDepartmentChange}
          >
            Change Department
          </button>
          <button className="delete-button" onClick={handleDeleteSolver}>
            Delete Solver
          </button>
        </div>
        <div className="btns-secondrow">
          <button
            className="disapprove-button"
            onClick={handleDisapproveSolver}
          >
            Disapprove Solver
          </button>
          <button className="go-back-button" onClick={handleGoBack}>
            <IoIosArrowBack className="back-icon" />
            Go to Dashboard
          </button>
        </div>
      </div>
      {showConfirmDelete && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this solver?</p>
          <button onClick={confirmAction}>Yes</button>
          <button onClick={cancelAction}>No</button>
        </div>
      )}
      {showConfirmDisapprove && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to disapprove this solver?</p>
          <button onClick={confirmAction}>Yes</button>
          <button onClick={cancelAction}>No</button>
        </div>
      )}
      {showConfirmAssignRole && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to assign this role?</p>
          <button onClick={confirmAction}>Yes</button>
          <button onClick={cancelAction}>No</button>
        </div>
      )}
      {showConfirmChangeDepartment && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to change this department?</p>
          <div className="newgrievance-select">
            <label htmlFor="department-select">Select Department:</label>
            <select
              id="department-select"
              value={newGrievanceType}
              onChange={(e) => setNewGrievanceType(e.target.value)}
            >
              <option value="">Select Grievance Type</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Facilities">Facilities</option>
              <option value="Administration">Administration</option>
            </select>
          </div>
          <button className="approve-button" onClick={confirmAction}>
            Confirm
          </button>
          <button className="reject-button" onClick={cancelAction}>
            Cancel
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SolverDetail;
