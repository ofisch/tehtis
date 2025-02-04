import React, { useState } from "react";
import "../style/Login.css";
import { Register } from "../components/Register"; // Ensure this path is correct

export const Login = () => {
  const [toggleRegister, setToggleRegister] = useState(false);

  const handleRegister = () => {
    setToggleRegister(!toggleRegister);
  };

  return (
    <>
      <div className="container">
        {toggleRegister ? (
          <Register handleRegister={handleRegister} />
        ) : (
          <div className="login-box">
            <h1>Tehtis</h1>
            <h3>Kirjaudu sisään jatkaaksesi</h3>
            <form action="">
              <div className="textbox">
                <input type="text" placeholder="Sähköposti" name="email" />
              </div>
              <div className="textbox">
                <input type="password" placeholder="Salasana" name="password" />
              </div>
              <input className="btn" type="submit" value="Kirjaudu sisään" />
            </form>
            <div className="no-account">
              <p>eikö sinulla ole tiliä?</p>
              <a onClick={handleRegister} className="register-link">
                rekisteröidy
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
