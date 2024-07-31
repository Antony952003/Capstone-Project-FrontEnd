import React from "react";
import { FaCircleUser } from "react-icons/fa6";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { auth, logout, currentView, setCurrentView } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div
        className="nav-left"
        onClick={() => {
          setCurrentView("content");
          navigate("/dashboard");
        }}
      >
        <h2 className="nav-head">
          <span className="colored">S</span>olution{" "}
          <span className="colored">S</span>
          pheres
        </h2>
      </div>
      <div className="nav-right">
        <button
          onClick={() => (auth != null ? logout() : navigate("/login"))}
          className="btn logout-btn"
        >
          {auth != null ? "Logout" : "SignIn"}
        </button>
        {auth?.user.userImage == "string" ? (
          <FaCircleUser className="user-icon" />
        ) : (
          <div className="userimage user-icon-navbar">
            <img src={auth?.user.userImage} alt="" />
          </div>
        )}
        <p className="username">Hey {auth?.user.name}!!</p>
      </div>
    </nav>
  );
}

export default Navbar;
