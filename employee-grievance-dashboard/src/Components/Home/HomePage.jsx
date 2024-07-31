import React, { useEffect } from "react";
import { Chart, registerables } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import "./HomePage.css";
import AOS from "aos";
import "aos/dist/aos.css";

Chart.register(...registerables);

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);
  const pieData = {
    labels: ["Pending Grievances", "Closed Grievances", "Open Grievances"],
    datasets: [
      {
        data: [10, 15, 5],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const barData = {
    labels: ["HR", "Adminstration", "IT", "Facilities"],
    datasets: [
      {
        label: "Average Rating",
        data: [3.5, 4.2, 3.8, 4.0],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="homepage-container">
      <div className="homepage-header" data-aos="fade-up">
        <p className="home-head">
          Welcome to <span className="colored">S</span>olution{" "}
          <span className="colored">S</span>
          pheres
        </p>
        <p className="home-quote">" Seamless Solutions for Every Concern "</p>
      </div>
      <div className="home-center">
        <div className="submit-grievance" data-aos="fade-right">
          <h3 id="home-subhead">Submit Your Grievance</h3>
          <p className="about-app">
            <span className="keyword">
              <span className="colored">S</span>olution{" "}
              <span className="colored">S</span>pheres
            </span>{" "}
            is an advanced grievance management platform that simplifies the
            process of submitting, tracking, and resolving employee complaints.
            The app ensures transparent communication between employees and
            administrators, promoting timely resolutions and feedback. By
            leveraging technology,{" "}
            <span className="keyword">
              <span className="colored">S</span>olution{" "}
              <span className="colored">S</span>pheres
            </span>{" "}
            enhances workplace harmony and efficiency.
          </p>
        </div>
        <div className="home-image">
          <img
            src="https://www.flexiventures.in/wp-content/uploads/2024/01/thumbnail-harmony-in-workspace.jpg"
            alt=""
          />
        </div>
      </div>
      <section className="charts">
        <div className="barchart-part">
          <h3 className="home-chart-heading">
            Solvers' Average Ratings Department Distribution
          </h3>
          <div className="chart-container">
            <Bar data={barData} />
          </div>
        </div>
        <div className="piechart-part">
          <h3 className="home-chart-heading">Grievance Status Distribution</h3>
          <div className="chart-container">
            <Pie data={pieData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
