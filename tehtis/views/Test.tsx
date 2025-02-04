import React from "react";
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const navigate = useNavigate();

  return (
    <div style={{ margin: "auto" }}>
      <h1>Test</h1>

      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};
