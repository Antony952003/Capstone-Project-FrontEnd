import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./Components/Navbar/Navbar";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </>
);
