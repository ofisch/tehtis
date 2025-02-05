import React, { useState } from "react";
import "../style/Login.css";
import { RegisterComponent } from "../components/RegisterComponent"; // Ensure this path is correct
import { AnimatePresence } from "framer-motion";
import { LoginComponent } from "../components/LoginComponent";

export const Login = () => {
  const [toggleRegister, setToggleRegister] = useState(false);

  const handleRegister = () => {
    setToggleRegister(!toggleRegister);
  };

  return (
    <>
      <div className="container">
        <div className="login-box">
          <AnimatePresence mode="wait">
            {/*näytetään joko kirjautumis- tai rekisteröitymisnäkymä*/}
            {toggleRegister ? (
              <RegisterComponent handleRegister={handleRegister} />
            ) : (
              <LoginComponent handleRegister={handleRegister} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
