// src/Components/MainLayout/MainLayout.js

import React, { useContext } from "react";
import Navbar from "../Navbar/Navbar";
import "./MainLayout.css"; // Import the CSS file

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="main-content">{children}</div>
    </>
  );
};

export default MainLayout;
