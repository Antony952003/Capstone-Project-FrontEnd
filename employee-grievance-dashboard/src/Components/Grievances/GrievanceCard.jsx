import React from "react";
import { useNavigate } from "react-router-dom";

function GrievanceCard({ grievance, index }) {
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
  return (
    <div
      onClick={() => navigate(`/grievances/${grievance.grievanceId}`)}
      className={`card-container animated ${
        grievance.priority === "High" && "high"
      }
      ${index % 2 == 0 ? "left" : "right"}
      ${grievance.priority === "Low" && "low"}
      ${grievance.priority === "Moderate" && "moderate"}`}
    >
      <div className="user-info">
        <div className="grievance-user-image">
          <img src={grievance.employeeImage} alt="" />
        </div>
        <p>{grievance.employeeName}</p>
      </div>
      <div className="grievance-title">{grievance.title}</div>
      <div className="createdOn">
        Created On {formatDate(grievance.dateRaised)}
      </div>
      <div className="type-status">
        <p className="grievance-type">Type : {grievance.type}</p>
        <p className="grievance-status">
          Status : <span className="green">{grievance.status}</span>
        </p>
      </div>
      <div className="grievance-description">
        <p>{grievance.description}</p>
      </div>
    </div>
  );
}

export default GrievanceCard;
