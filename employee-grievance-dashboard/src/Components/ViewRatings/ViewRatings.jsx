import React, { useContext, useEffect, useState } from "react";
import apiClient from "../../ApiClient/apiClient";
import "./ViewRatings.css";
import { FaCircleUser } from "react-icons/fa6";
import { AuthContext } from "../../contexts/AuthContext";

function ViewRatings() {
  const [ratings, setRatings] = useState([]);
  const { auth } = useContext(AuthContext);
  var [errormessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await apiClient.get(
          `/Ratings/GetAllSolverRatings?solverid=${auth?.user?.userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (response.data.length === 0)
          setErrorMessage("No reviews are given yet !!");
        setRatings(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch ratings:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchRatings();
  }, [auth]);

  return (
    <div className="view-ratings-container">
      <h2 className="rating-header-r">Reviews</h2>
      {ratings.length === 0 ? (
        <p className="nogrievances">{errormessage}</p>
      ) : (
        <div className="ratings-cards">
          {ratings.map((rating, index) => (
            <div key={index} className="rating-card">
              <div className="employee-info-r">
                {rating.employeeImage !== "DefaultImage" ? (
                  <img
                    src={rating.employeeImage}
                    alt={rating.employeeName}
                    className="employee-image-r"
                  />
                ) : (
                  <FaCircleUser className="employee-image-r" />
                )}
                <p className="employee-name-r">{rating.employeeName}</p>
              </div>
              <div className="rating-mid">
                <div className="grievance-title-r">
                  Grievance :{" "}
                  <span className="red">{rating.grievanceTitle}</span>
                </div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`star ${i < rating.rating ? "filled" : ""}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="comment">Comment : {rating.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewRatings;
