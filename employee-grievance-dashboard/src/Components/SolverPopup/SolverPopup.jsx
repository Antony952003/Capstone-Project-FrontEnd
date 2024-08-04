import React, { useState, useEffect } from "react";
import apiClient from "../../ApiClient/apiClient";
import "./SolverPopup.css";
import { AuthContext } from "../../contexts/AuthContext";

function SolverPopup({ grievanceType, onClose, onAssign }) {
  const [solvers, setSolvers] = useState([]);
  const [selectedSolver, setSelectedSolver] = useState(null);

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const response = await apiClient.get(
          `/Admin/GetSolversByType?solvertype=${grievanceType}`
        );
        console.log(response.data);
        setSolvers(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch solvers:",
          error.response?.data?.message || error.message
        );
      }
    };
    fetchSolvers();
  }, [grievanceType]);

  const handleAssign = () => {
    console.log(selectedSolver);
    if (selectedSolver) {
      onAssign(selectedSolver);
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        <h2>Select Solver</h2>
        <div className="solver-list">
          {solvers.length != 0 &&
            solvers.map((solver) => (
              <div key={solver.userId} className="solver-item">
                <input
                  type="radio"
                  id={`solver-${solver.userId}`}
                  name="solver"
                  value={solver.userId}
                  onChange={() => setSelectedSolver(solver.userId)}
                />
                <label htmlFor={`solver-${solver.userId}`}>
                  {solver.name} - {solver.isAvailable ? "Inactive" : "Active"}
                </label>
              </div>
            ))}
          {solvers.length == 0 && (
            <p className="nosolvererror">
              No Solvers for the grievance Type <> </>
              <span className="red">{grievanceType}</span>
            </p>
          )}
        </div>
        <button className="btn orange" onClick={handleAssign}>
          Assign Solver
        </button>
        <button className="btn red" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SolverPopup;
