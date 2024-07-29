import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "../Employee/Employee.css";

const Solvers = () => {
  const { auth } = useContext(AuthContext);
  const [solvers, setSolvers] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7091/api/Admin/GetAllSolvers",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        console.log(response.data);
        setSolvers(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch employees:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (auth) {
      fetchSolvers();
    }
  }, [auth]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleRowClick = (solverid) => {
    navigate(`/solvers/${solverid}`);
  };

  const handleMouseEnter = (e) => {
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="employees content-container">
      <h2>All Solvers</h2>
      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Grievance Department</th>
            <th>Date of Birth</th>
          </tr>
        </thead>
        <tbody>
          {solvers.map((solver) => (
            <tr
              key={solver.userId}
              onClick={() => handleRowClick(solver.userId)}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <td>{solver.userId}</td>
              <td>{solver.name}</td>
              <td>{solver.email}</td>
              <td>{solver.role}</td>
              <td>{solver.grievanceDepartmentType}</td>
              <td>{formatDate(solver.dob)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {tooltip.visible && (
        <div
          className="tooltip"
          style={{
            position: "absolute",
            top: `${tooltip.y}px`,
            left: `${tooltip.x + 10}px`, // Slight offset to avoid overlap
            backgroundColor: "#333",
            color: "#fff",
            padding: "5px",
            borderRadius: "3px",
            fontSize: "12px",
            whiteSpace: "nowrap",
          }}
        >
          Click for more info
        </div>
      )}
    </div>
  );
};

export default Solvers;
