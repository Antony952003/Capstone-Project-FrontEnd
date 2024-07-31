import React, { useEffect, useState } from "react";
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
import "aos/dist/aos.css";

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
  useEffect(() => {
    AOS.init({
      duration: 1500,
    });
    AOS.refresh();
  }, []);
  const { grievanceId } = useParams();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrievanceHistory = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:7091/api/GrievanceHistory/GetGrievanceHistoryById?grievanceId=${grievanceId}`,
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
      }
    };
    fetchGrievanceHistory();
  }, [grievanceId]);

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
      <button onClick={() => navigate(-1)} className="gbtn go-dashboard">
        <FaArrowLeft /> Go Back
      </button>
      <div className="roadmap-container">
        <h2 className="grievance-history-h2">Grievance History</h2>
        <div className="roadmap">
          {history.map((entry) => (
            <div key={entry.grievanceHistoryId} className="roadmap-item">
              <div className="roadmap-icon">
                {getIconForType(entry.historyType)}
              </div>
              <div className="roadmap-content" data-aos="fade-up">
                <div className="history-title">{entry.statusChange} </div>
                <div className="history-date">
                  {formatDate(entry.dateChanged)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GrievanceHistory;
