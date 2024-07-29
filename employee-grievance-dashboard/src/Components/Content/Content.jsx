import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function Content() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="content-container">
      <h1>
        Welcome {auth?.user.role} {auth?.user.name}
      </h1>
    </div>
  );
}

export default Content;
