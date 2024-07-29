import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function Content() {
  const { auth } = useContext(AuthContext);
  return (
    <div className="content-container">
      <h4>
        Welcome {auth?.user.role} {auth?.user.name}
      </h4>
    </div>
  );
}

export default Content;
