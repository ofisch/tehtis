import React from "react";
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const navigate = useNavigate();

  return (
    <div>
      Test
      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
};
