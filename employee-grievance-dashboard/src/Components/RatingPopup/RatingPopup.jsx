import React from "react";
import { FaStar } from "react-icons/fa";
import "./RatingPopup.css";

const RatingPopup = ({
  solvername,
  rating,
  setRating,
  comment,
  setComment,
  onClose,
  onSubmit,
}) => {
  const handleStarClick = (value) => {
    setRating(value);
  };

  return (
    <div className="rating-popup-overlay">
      <div className="rating-popup">
        <h2>Rate Solver</h2>
        <p className="rating-description">
          How did u like {solvername}'s work, Would love to know your opinion!!
        </p>
        <div className="stars">
          {[...Array(5)].map((_, index) => {
            const value = index + 1;
            return (
              <FaStar
                key={value}
                size={30}
                color={value <= rating ? "#ffc107" : "#e4e5e9"}
                onClick={() => handleStarClick(value)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
        </div>
        <textarea
          placeholder="Leave a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
        />
        <div className="rating-popup-buttons">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={onSubmit} className="submit-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPopup;
