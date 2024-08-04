import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaCircle } from "react-icons/fa";
import { BsPersonRaisedHand } from "react-icons/bs";
import { AiOutlineSolution } from "react-icons/ai";
import { MdOutlineClose } from "react-icons/md";
import { FcFeedback } from "react-icons/fc";
import ResolvedIcon from "../../assets/icons/Pictogram_resolved.svg.png";
import { MdAssignmentInd } from "react-icons/md";
import apiClient from "../../ApiClient/apiClient";
import "./GrievanceHistory.css";
import AOS from "aos";
import { ToastContainer, toast } from "react-toastify";
import "aos/dist/aos.css";
import { IoMdDownload } from "react-icons/io";
import { AuthContext } from "../../contexts/AuthContext";
import ProvideFeedbackPopup from "../ProvideFeedbackPopup/ProvideFeedbackPopup";
import { PacmanLoader } from "react-spinners";

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

function GrievanceHistory() {
  const { auth } = useContext(AuthContext);
  const [grievance, setGrievance] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isSolutionPopupOpen, setIsSolutionPopupOpen] = useState(false);
  const [isFeedbackPopupOpen, setIsFeedbackPopupOpen] = useState(false);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const { grievanceId } = useParams();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const documentname = (url) => {
    const urlObject = new URL(url);

    const pathname = urlObject.pathname;

    const documentName = decodeURIComponent(
      pathname.substring(pathname.lastIndexOf("/") + 1)
    );
    return documentName;
  };
  const handleProvideFeedback = () => {
    setIsSolutionPopupOpen(false);
    setShowFeedbackPopup(true);
  };

  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
    AOS.refresh();
  }, []);

  useEffect(() => {
    const fetchGrievanceDetails = async () => {
      try {
        const response = await apiClient.get(
          `/Grievance/GetGrievanceById?id=${grievanceId}`,
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
    const fetchGrievanceHistory = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `/GrievanceHistory/GetGrievanceHistoryById?grievanceId=${grievanceId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setHistory(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch grievance history:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGrievanceDetails();
    fetchGrievanceHistory();
    AOS.init();
    AOS.refresh();
    const roadmapContainer = document.querySelector(".roadmap");
    const handleScroll = () => AOS.refresh();
    roadmapContainer.addEventListener("scroll", handleScroll);
    return () => {
      roadmapContainer.removeEventListener("scroll", handleScroll);
    };
  }, [grievanceId]);

  const handleSolutionClick = async (solutionId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/Solution/solution/${solutionId}`);
      setSelectedSolution(response.data);
      console.log(response.data);
      setIsSolutionPopupOpen(true);
    } catch (error) {
      toast.error("Error fetching solution details");
    } finally {
      setLoading(false);
    }
  };
  const handleFeedbackClick = async (feedbackId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/Feedback/feedback/${feedbackId}`);
      setSelectedFeedback(response.data);
      setIsFeedbackPopupOpen(true);
    } catch (error) {
      toast.error(`Error fetching feedback details`);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = (setPopupState, setSelected) => () => {
    setPopupState(false);
    setSelected(null);
  };

  const getIconForType = (type) => {
    console.log(type);
    switch (type) {
      case "Raised Grievance":
        return (
          <>
            <BsPersonRaisedHand className="green" />
          </>
        );
      case "Assign Grievance":
        return <MdAssignmentInd className="red" />;
      case "Solution":
        return <AiOutlineSolution className="orange" />;
      case "Feedback":
        return <FcFeedback className="lightpink" />;
      case "Resolved":
        return <img src={ResolvedIcon} />;
      case "Escalated":
        return <FaCircle />;
      case "Closed Grievance":
        return <FaCircle className="red" />;
      default:
        return <FaCircle />;
    }
  };

  return (
    <div className="grievance-history-container">
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
        <div className="roadmap-container">
          <div className="grievance-history-header">
            <h2 className="grievance-history-h2">Grievance History</h2>
          </div>
          <div className="roadmap">
            {history.map((entry) => (
              <div
                key={entry.grievanceHistoryId}
                className="roadmap-item"
                onClick={() => {
                  if (entry.historyType === "Solution")
                    handleSolutionClick(entry.relatedEntityId);
                  else if (entry.historyType === "Feedback") {
                    handleFeedbackClick(entry.relatedEntityId);
                  }
                }}
              >
                <div className="roadmap-icon">
                  {getIconForType(entry.historyType)}
                </div>
                {entry.historyType === "Solution" && (
                  <div className="roadmap-content">
                    <div className="history-title">{entry.statusChange} </div>
                    <div className="history-date">
                      {formatDate(entry.dateChanged)}
                    </div>
                  </div>
                )}
                {entry.historyType === "Feedback" && (
                  <div className="roadmap-content">
                    <div className="history-title">{entry.statusChange} </div>
                    <div className="history-date">
                      {formatDate(entry.dateChanged)}
                    </div>
                  </div>
                )}
                {entry.historyType !== "Solution" &&
                  entry.historyType !== "Feedback" && (
                    <div className="roadmap-content">
                      <div className="history-title">{entry.statusChange} </div>
                      <div className="history-date">
                        {formatDate(entry.dateChanged)}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
          <button onClick={() => navigate(-1)} className="gbtn go-back1">
            <FaArrowLeft /> Go Back
          </button>
        </div>
      )}

      {showFeedbackPopup && (
        <ProvideFeedbackPopup
          solutionId={selectedSolution?.solutionId}
          onClose={() => setShowFeedbackPopup(false)}
          onFeedbackProvided={() => {
            setShowFeedbackPopup(false);
            window.location.reload();
          }}
        />
      )}
      {isSolutionPopupOpen && (
        <div
          className="popup-overlay"
          onClick={closePopup(setIsSolutionPopupOpen, setSelectedSolution)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedSolution.solutionTitle}</h3>
            <p>Description: {selectedSolution.description}</p>
            <p>Date Provided: {formatDate(selectedSolution.dateProvided)}</p>
            <p>Solver: {selectedSolution.solverName}</p>
            <ul>
              {selectedSolution.documentUrls?.map((url, index) => (
                <a
                  key={url}
                  className="document"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoMdDownload />

                  {documentname(url)}
                </a>
              ))}
            </ul>
            <div className="provide-feedback-actions-btns">
              {auth?.user?.role === "Employee" &&
                grievance.status != "Resolved" &&
                grievance.status != "Closed" && (
                  <button
                    className="gbtn provide-feeback-btn"
                    onClick={handleProvideFeedback}
                  >
                    Provide Feedback
                  </button>
                )}
              <button
                onClick={closePopup(
                  setIsSolutionPopupOpen,
                  setSelectedSolution
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {isFeedbackPopupOpen && (
        <div
          className="popup-overlay"
          onClick={closePopup(setIsFeedbackPopupOpen, setSelectedFeedback)}
        >
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Feedback for Solution : {selectedFeedback.solutionTitle}</h3>
            <p>Description: {selectedFeedback.comments}</p>
            <p>Date Provided: {formatDate(selectedFeedback.dateProvided)}</p>
            <p>
              Feedback Given By: {selectedFeedback.employeeName} {"->"}{" "}
              {selectedFeedback.solverName}
            </p>
            <div className="provide-feedback-actions-btns">
              <button
                onClick={closePopup(
                  setIsFeedbackPopupOpen,
                  setSelectedFeedback
                )}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default GrievanceHistory;
