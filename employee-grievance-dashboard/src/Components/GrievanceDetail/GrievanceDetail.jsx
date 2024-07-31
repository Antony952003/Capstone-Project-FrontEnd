import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { FaUserCircle, FaAngleLeft } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import apiClient from "../../ApiClient/apiClient";
import SolverPopup from "../SolverPopup/SolverPopup";
import "./GrievanceDetail.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GrievanceDetail() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [grievance, setGrievance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  function formatDate(dateString) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date(dateString);

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedDate = `${month} ${day} ${year}, ${hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;

    return formattedDate;
  }

  useEffect(() => {
    const fetchGrievanceDetails = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:7091/api/Grievance/GetGrievanceById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setGrievance(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch grievance:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchGrievanceDetails();
  }, [id, auth]);

  const handleAssignSolver = async (solverId) => {
    try {
      await apiClient.post(
        `http://localhost:7091/api/Admin/AssignOpenGrievances`,
        { grievanceId: id, solverId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setGrievance((prevGrievance) => ({
        ...prevGrievance,
        solverId,
      }));
    } catch (error) {
      console.error(
        "Failed to assign solver:",
        error.response?.data?.message || error.message
      );
    }
  };

  const closeGrievance = async (force) => {
    try {
      await apiClient.put(
        `http://localhost:7091/api/Grievance/CloseGrievance`,
        {
          grievanceId: id,
          forceClose: force,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(`Grievance id : ${id} has been closed successfully !!`);
      location.reload();
    } catch (error) {
      if (!force && grievance.status != "Closed") {
        toast.error(
          <>
            {error.response?.data?.message || error.message}
            <button
              onClick={() => closeGrievance(true)}
              className="force-close-btn"
              style={{
                width: "100%",
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            >
              Force Close Grievance
            </button>
          </>
        );
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
      console.error(
        "Closing Grievance error :",
        error.response?.data?.message || error.message
      );
    }
  };

  if (!grievance) {
    return <div>Loading...</div>;
  }

  const viewGrievanceHistory = () => {
    navigate(`/grievancehistory/${grievance.grievanceId}`);
  };

  return (
    <>
      <div className="grievance-detail-container">
        {showPopup && (
          <SolverPopup
            grievanceType={grievance.type}
            onClose={() => setShowPopup(false)}
            onAssign={handleAssignSolver}
          />
        )}
        <div className="grievance-detail-card">
          {/* Existing GrievanceDetail content */}
          <div className="employee-info">
            <div className="employee-image">
              {grievance.employeeImage !== "string" ? (
                <img src={grievance.employeeImage} alt="" />
              ) : (
                <FaUserCircle />
              )}
            </div>
            <div className="employee-name">{grievance.employeeName}</div>
          </div>
          <div className="grievanceid">
            GrievanceId : <span>{grievance.grievanceId}</span>
          </div>
          <div className="grievance-title">{grievance.title}</div>
          <div className="date-solver">
            <div className="date-created">
              Raised on {formatDate(grievance.dateRaised)}
            </div>
            <div className="solver-div">
              {grievance.solverId != null ? (
                <>
                  <p>SolverId : {grievance.solverId}</p>
                  <p>SolverName : {grievance.solverName}</p>
                </>
              ) : (
                <>Solver : Not Assigned</>
              )}
            </div>
          </div>
          <div className="grievance-detail-description">
            <p>{grievance.description}</p>
          </div>
          <div className="status-type">
            <div className="status">
              <p>
                Status : <span>{grievance.status}</span>
              </p>
            </div>
            <div className="type">
              <div className="priority">Priority : {grievance.priority}</div>

              <p>
                Type : <span>{grievance.type}</span>
              </p>
            </div>
          </div>
          {grievance.documentUrls.length != 0 && (
            <>
              <p className="attached-documents">Attached Documents*</p>
              <div className="document-container">
                {grievance.documentUrls.map((document) => {
                  return (
                    <div key={document} className="document">
                      {document}
                      <IoMdDownload />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="grievance-action-buttons">
            <button
              onClick={() => navigate("/dashboard")}
              className="gbtn go-dashboard"
            >
              <FaAngleLeft /> Go To Dashboard
            </button>
            {(grievance.status === "Open" ||
              grievance.status === "Escalated") && (
              <button
                className="gbtn assign-solver"
                onClick={() => setShowPopup(true)}
              >
                Assign Solver
              </button>
            )}
            <button
              className="gbtn view-history"
              onClick={viewGrievanceHistory}
            >
              View Grievance History
            </button>
            <button
              className="gbtn close-grievance"
              onClick={() => closeGrievance(false)}
            >
              Close Grievance
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default GrievanceDetail;
