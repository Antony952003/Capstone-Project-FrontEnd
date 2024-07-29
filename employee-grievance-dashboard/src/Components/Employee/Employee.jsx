import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import "./Employee.css";

const Employees = () => {
  const { auth } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7091/api/Admin/GetAllEmployees",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        console.log(response.data);
        setEmployees(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch employees:",
          error.response?.data?.message || error.message
        );
      }
    };

    if (auth) {
      fetchEmployees();
    }
  }, [auth]);

  return (
    <div className="employees content-container">
      <h2>All Employees</h2>
      <table className="employees-table">
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
            <tr key={employee.userId}>
              <td>{employee.userId}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>{employee.dob}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
