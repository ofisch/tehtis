import React, { useEffect } from "react";
import "../style/root.css";
import "../style/Profile.css";
import "../style/Dashboard.css";
import { ProfileComponent } from "../components/ProfileComponent";
import { NavComponent } from "../components/NavComponent";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { loggedIn, user } = useAuth();
  console.log("profile.user:", user);
  const navigate = useNavigate();

  console.log("loggedIn:", loggedIn);

  return (
    <>
      <div className="container">
        <div className="nav-background"></div>
        <NavComponent />
        {user && <ProfileComponent user={user} />}
      </div>
    </>
  );
};
