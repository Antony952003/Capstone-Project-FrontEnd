import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import apiClient from "../../ApiClient/apiClient";
import PieChart from "../PieChart/PieChart";
import "./Content.css";

function Content() {
  const { auth } = useContext(AuthContext);
  const [grievances, setGrievances] = useState([]);
  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      const response = await apiClient.get("/Grievance/GetAllGrievances", {
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      setGrievances(response.data);
    };
    if (auth != null) {
      fetchData();
    }
  }, [auth]);
  return (
    <div className="content-container">
      {/* <h4>
        Welcome {auth?.user.role} {auth?.user.name}
      </h4> */}
      {/* <div className="piechart-container">
        <h5 className="piechart-head">Grievance Status Distribution</h5>
        <PieChart data={grievances} />
      </div> */}
    </div>
  );
}

export default Content;
