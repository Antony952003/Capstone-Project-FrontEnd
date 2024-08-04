import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "../Employee/Employee.css";
import apiClient from "../../ApiClient/apiClient";
import AOS from "aos";
import "aos/dist/aos.css";
import { PacmanLoader } from "react-spinners";

const Solvers = () => {
  const { auth } = useContext(AuthContext);
  const [solvers, setSolvers] = useState([]);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const [loading, setLoading] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolvers = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/Admin/GetAllSolvers", {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        console.log(response.data);
        setSolvers(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch employees:",
          error.response?.data?.message || error.message
        );
      } finally {
        setLoading(false);
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
      <h2 data-aos="fade-down">All Solvers</h2>
      {loading ? (
        <div className="grievance-detail-loader">
          <PacmanLoader
            color="#007bff"
            cssOverride={{}}
            loading
            margin={0}
            speedMultiplier={1}
          />
        </div>
      ) : (
        <>
          <table className="employees-table" data-aos="fade-right">
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
        </>
      )}

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
