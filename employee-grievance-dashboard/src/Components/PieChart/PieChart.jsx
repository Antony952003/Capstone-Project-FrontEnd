// PieChart.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "../Content/Content.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ data }) => {
  console.log(data);
  const pendingCount = data.filter(
    (grievance) => grievance.status === "Pending"
  ).length;
  const closedCount = data.filter(
    (grievance) => grievance.status === "Closed"
  ).length;
  const openCount = data.filter(
    (grievance) => grievance.status === "Open"
  ).length;
  const InprogressCount = data.filter(
    (grievance) => grievance.status === "InProgress"
  ).length;

  const chartData = {
    labels: ["Pending", "Closed", "Open", "InProgress"],
    datasets: [
      {
        data: [pendingCount, closedCount, openCount, InprogressCount],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "green"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Pie data={chartData} className="grievance-piechart" />
    </div>
  );
};

export default PieChart;
