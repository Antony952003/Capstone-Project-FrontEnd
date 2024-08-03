// src/components/EscalateGrievancePopup/EscalateGrievancePopup.jsx
import React, { useState } from "react";
import "./EscalateGrievancePopup.css";

function EscalateGrievancePopup({ onClose, onConfirm }) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="escalate-grievance-popup">
      <div className="escalate-popup-content">
        <h3>Confirm Escalation</h3>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for escalation"
          rows="4"
        ></textarea>
        <div className="escalate-popup-buttons">
          <button onClick={handleConfirm} className="confirm-button">
            Confirm
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EscalateGrievancePopup;
