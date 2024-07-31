import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import "./Grievances.css";
import GrievanceCard from "./GrievanceCard";
import apiClient from "../../ApiClient/apiClient";

function Grievances() {
  const [grievances, setGrievances] = useState([]);
  const [filteredGrievances, setFilteredGrievances] = useState([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchAllGrievances();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [typeFilter, statusFilter, priorityFilter, grievances]);

  const fetchAllGrievances = async () => {
    try {
      const response = await apiClient.get(`/Grievance/GetAllGrievances`, {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log(response.data);
      setGrievances(response.data);
    } catch (error) {
      console.error(
        "Failed to get all grievances:",
        error.response?.data?.message || error.message
      );
    }
  };

  const applyFilters = () => {
    let filtered = grievances;

    if (typeFilter) {
      filtered = filtered.filter((grievance) => grievance.type === typeFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(
        (grievance) => grievance.status === statusFilter
      );
    }
    if (priorityFilter) {
      filtered = filtered.filter(
        (grievance) => grievance.priority === priorityFilter
      );
    }

    setFilteredGrievances(filtered);
  };

  return (
    <div className="grievances">
      <h3>Grievances</h3>
      <div className="filters">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Grievance Type</option>
          <option value="HR">HR</option>
          <option value="IT">IT</option>
          <option value="Facilities">Facilities</option>
          <option value="ProjectManagement">ProjectManagement</option>
          <option value="Administration">Administration</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Open">Open</option>
          <option value="Resolved">Resolved</option>
          <option value="InProgress">InProgress</option>
          <option value="Closed">Closed</option>
          <option value="Escalated">Escalated</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Moderate">Moderate</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className="risk-legend">
        <div className="low-l">
          <span> </span>
          <p>Low Priority</p>
        </div>
        <div className="moderate-l">
          <span> </span>
          <p>Moderate Priority</p>
        </div>
        <div className="high-l">
          <span> </span>
          <p>High Priority</p>
        </div>
      </div>
      <div className="grievance-container">
        {filteredGrievances.length > 0 ? (
          filteredGrievances.map((grievance, index) => (
            <GrievanceCard
              key={grievance.grievanceId}
              grievance={grievance}
              index={index}
            />
          ))
        ) : (
          <p className="nogrievances">No Grievances For Applied Filter !!</p>
        )}
      </div>
    </div>
  );
}

export default Grievances;
