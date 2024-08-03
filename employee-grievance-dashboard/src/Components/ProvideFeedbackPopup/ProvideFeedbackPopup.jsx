// src/components/ProvideFeedbackPopup/ProvideFeedbackPopup.js
import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../ApiClient/apiClient";
import "./ProvideFeedbackPopup.css";
import { ToastContainer, toast } from "react-toastify";

const ProvideFeedbackPopup = ({ solutionId, onClose, onFeedbackProvided }) => {
  const { auth } = useContext(AuthContext);
  const [comments, setComments] = useState("");

  const handleFeedbackSubmit = async () => {
    const feedback = {
      SolutionId: solutionId,
      EmployeeId: auth.user.userId,
      Comments: comments,
      DateProvided: new Date().toISOString(),
    };

    try {
      await apiClient.post("/Feedback/provide-feedback", feedback, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      onFeedbackProvided();
      toast.success(
        `Feedback for the solution Id : ${solutionId} has been submitted succesfully !!`
      );
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to provide feedback:",
        error.response?.data?.message || error.message
      );
      toast.error(
        `Error in submitting feedback ${error.response?.data?.details} !!`
      );
    }
  };

  return (
    <div className="feedback-popup-overlay">
      <div className="feedback-popup">
        <h2>Provide Feedback</h2>
        <textarea
          placeholder="Enter your feedback..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <button onClick={handleFeedbackSubmit}>Submit Feedback</button>
        <button onClick={onClose}>Cancel</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProvideFeedbackPopup;
