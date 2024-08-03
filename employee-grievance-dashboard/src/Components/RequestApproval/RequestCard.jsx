import React, { useContext, useEffect } from "react";
import "./RequestCard.css";
import Aos from "aos";
import "aos/dist/aos.css";
import { AuthContext } from "../../contexts/AuthContext";

const RequestCard = ({ approvalRequest }) => {
  const { employeeName, reason, requestDate, status } = approvalRequest;
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

  const { auth } = useContext(AuthContext);
  useEffect(() => {
    Aos.init({
      duration: 1200,
      offset: 100,
      easing: "ease-in-out",
    });
  }, [auth]);

  return (
    <div
      data-aos="fade-up"
      className={`request-card ${
        (status == 1 && "Approved") ||
        (status == 0 && "Pending") ||
        (status == 2 && "Rejected")
      }`}
    >
      <h3 className="request-employee-name">{employeeName}</h3>
      <p className="request-reason">
        <strong>Comment :</strong> {reason}
      </p>
      <p className="request-date">
        <strong>Requested Dated:</strong> {formatDate(requestDate)}
      </p>
      <p className="request-status">
        <strong>Status:</strong>{" "}
        <span
          className={
            (status == 1 && "Approved") ||
            (status == 0 && "Pending") ||
            (status == 2 && "Rejected")
          }
        >
          {(status == 1 && "Approved") ||
            (status == 0 && "Pending") ||
            (status == 2 && "Rejected")}
        </span>
      </p>
      {status == 1 && (
        <span className="red">
          * You will now be able to raise grievances and manage them !!
        </span>
      )}
      {status == 2 && (
        <span className="red">
          * You request has been rejected by the Admin try requesting again !!
        </span>
      )}
    </div>
  );
};

export default RequestCard;
