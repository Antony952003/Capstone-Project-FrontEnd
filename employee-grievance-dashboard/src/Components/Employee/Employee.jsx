import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "./Employee.css";
import apiClient from "../../ApiClient/apiClient";
import AOS from "aos";
import "aos/dist/aos.css";
import { PacmanLoader } from "react-spinners";

const Employees = () => {
  const { auth } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/Admin/GetAllEmployees", {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        });
        setEmployees(response.data);
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
      fetchEmployees();
    }
  }, [auth]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleRowClick = (employeeId) => {
    navigate(`/employees/${employeeId}`);
  };

  return (
    <div className="employees content-container">
      <h2 data-aos="fade-down">All Employees</h2>
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
          <table data-aos="fade-right" className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.userId}
                  onClick={() => handleRowClick(employee.userId)}
                >
                  <td>{employee.userId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                  <td>{formatDate(employee.dob)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Employees;
