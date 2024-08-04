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
import ProvideSolutionPopup from "../ProvideSolutionPopup/ProvideSolutionPopup";
import { PacmanLoader } from "react-spinners";
import ConfirmationPopup from "../ConfirmationPopup/ConfirmationPopup";
import EscalateGrievancePopup from "../EscalateGrievance/EscalateGrievancePopup";
import RatingPopup from "../RatingPopup/RatingPopup";

function GrievanceDetail() {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [grievance, setGrievance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSolutionPopup, setShowSolutionPopup] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showEscalatePopup, setShowEscalatePopup] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false); // Add this line
  const [rating, setRating] = useState(0); // Add this line
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  const documentname = (url) => {
    const urlObject = new URL(url);

    const pathname = urlObject.pathname;

    const documentName = decodeURIComponent(
      pathname.substring(pathname.lastIndexOf("/") + 1)
    );
    return documentName;
  };

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
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/Grievance/GetGrievanceById?id=${id}`,
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
      } finally {
        setLoading(false);
      }
    };
    fetchGrievanceDetails();
  }, [id, auth]);

  const handleAssignSolver = async (solverId) => {
    setLoading(true);

    try {
      await apiClient.post(
        `/Admin/AssignOpenGrievances`,
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
      toast.success(`Grievance has been assigned to ${grievance?.solverId}`);
      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to assign solver:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProvideRating = async () => {
    setLoading(true);

    try {
      const response = await apiClient.post(
        `/Ratings/ProvideRating`,
        {
          ratingId: 0,
          grievanceId: id,
          solverId: grievance.solverId,
          ratingValue: rating,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(`Rating has been submitted successfully!`);
      setShowRatingPopup(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(
        "Failed to submit rating:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResolveGrievance = async () => {
    setLoading(true);

    try {
      const response = await apiClient.put(
        `/Grievance/ResolveGrievance?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(`Grievance id : ${id} has been resolved successfully !!`);
      setTimeout(() => {
        location.reload();
      }, 4000);
      setShowConfirmationPopup(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.error(
        "Resolving Grievance error :",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const closeGrievance = async (force) => {
    setLoading(true);

    try {
      await apiClient.put(
        `/Grievance/CloseGrievance`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleEscalateGrievance = async (reason) => {
    setLoading(true);

    try {
      await apiClient.post(
        `/Grievance/EscalateGrievance`,
        { grievanceId: id, reason: reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toast.success(`Grievance has been escalated successfully`);
      setTimeout(() => {
        location.reload();
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to escalate grievance:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (!grievance) {
    return (
      <div className="grievance-detail-loader">
        <PacmanLoader
          color="#007bff"
          cssOverride={{}}
          loading
          margin={0}
          speedMultiplier={1}
        />
      </div>
    );
  }

  const viewGrievanceHistory = () => {
    navigate(`/grievancehistory/${grievance.grievanceId}`);
  };

  const handleProvideSolution = () => {
    setShowSolutionPopup(true);
  };
  const handlesolverdetail = () => {
    navigate(`/solvers/${grievance.solverId}`);
  };
  const handleemployeedetail = () => {
    navigate(`/employees/${grievance.employeeId}`);
  };

  return (
    <>
      <div className="grievance-detail-container">
        {showEscalatePopup && (
          <EscalateGrievancePopup
            onClose={() => setShowEscalatePopup(false)}
            onConfirm={(reason) => handleEscalateGrievance(reason)}
          />
        )}
        {showPopup && (
          <SolverPopup
            grievanceType={grievance.type}
            onClose={() => setShowPopup(false)}
            onAssign={handleAssignSolver}
          />
        )}
        {showSolutionPopup && (
          <ProvideSolutionPopup
            grievanceId={grievance.grievanceId}
            onClose={() => setShowSolutionPopup(false)}
            onSolutionProvided={() => setGrievance(null)}
          />
        )}
        {showConfirmationPopup && (
          <ConfirmationPopup
            message="Are you sure you want to resolve this grievance?"
            onConfirm={handleResolveGrievance}
            onCancel={() => setShowConfirmationPopup(false)}
          />
        )}
        {showRatingPopup && (
          <RatingPopup
            solvername={grievance.solverName}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            onClose={() => setShowRatingPopup(false)}
            onSubmit={handleProvideRating}
          />
        )}
        {loading ? (
          <div className="grievance-detail-loader">
            <PacmanLoader
              color="#007bff"
              cssOverride={{}}
              loading
              margin={0}
              speedMultiplier={1}
            />
          </div>
        ) : (
          <div className="grievance-detail-card">
            {/* Existing GrievanceDetail content */}
            <div className="employee-info">
              <div className="employee-image">
                {grievance.employeeImage !== "DefaultImage" ? (
                  <img src={grievance.employeeImage} alt="" />
                ) : (
                  <FaUserCircle />
                )}
              </div>
              <div className="employee-name">
                {" "}
                {auth?.user?.role === "Solver" ? (
                  <a onClick={handleemployeedetail}>{grievance.employeeName}</a>
                ) : (
                  <>{grievance.employeeName}</>
                )}
              </div>
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
                    <p>
                      SolverName :{" "}
                      {auth?.user?.role === "Employee" ? (
                        <a
                          style={{
                            textDecoration: "underline",
                          }}
                          onClick={handlesolverdetail}
                        >
                          {grievance.solverName}
                        </a>
                      ) : (
                        <>{grievance.solverName}</>
                      )}
                    </p>
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
                      <a
                        key={document}
                        className="document"
                        href={document}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {documentname(document)}
                        <IoMdDownload />
                      </a>
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
                (grievance.status === "Escalated" &&
                  auth.user.role === "Admin")) && (
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
              {auth.user.role === "Admin" && grievance.status != "Closed" && (
                <button
                  className="gbtn close-grievance"
                  onClick={() => closeGrievance(false)}
                >
                  Close Grievance
                </button>
              )}
              {auth.user.role === "Solver" &&
                grievance.status != "Resolved" &&
                grievance.status != "Closed" &&
                grievance.status != "Escalated" && (
                  <button
                    className="gbtn assign-solver"
                    onClick={handleProvideSolution}
                  >
                    Provide Solution
                  </button>
                )}
              {auth.user.role === "Solver" &&
                grievance.status != "Resolved" &&
                grievance.status != "Closed" &&
                grievance.status != "Escalated" && (
                  <button
                    className="gbtn resolve"
                    onClick={() => setShowConfirmationPopup(true)}
                  >
                    Resolve Grievance
                  </button>
                )}
              {auth.user.role === "Solver" &&
                grievance.status != "Resolved" &&
                grievance.status != "Closed" &&
                grievance.status != "Escalated" && (
                  <button
                    className="gbtn escalate"
                    onClick={() => setShowEscalatePopup(true)}
                  >
                    Escalate Grievance
                  </button>
                )}
              {grievance.status === "Closed" &&
                auth.user.role === "Employee" && (
                  <button
                    className="gbtn rate-solver"
                    onClick={() => setShowRatingPopup(true)}
                  >
                    Rate Solver
                  </button>
                )}
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default GrievanceDetail;
