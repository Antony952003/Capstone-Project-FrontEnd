import React from "react";
import "./ConfirmationPopup.css";

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup">
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button className="confirm-btn-g" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-btn-g" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
