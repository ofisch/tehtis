import React from "react";
import "../style/Login.css";

export const Register = ({ handleRegister }) => {
  return (
    <>
      <div className="login-box">
        <h1>Tehtis</h1>
        <h3>Uusi käyttäjä</h3>
        <form action="">
          <div className="textbox">
            <input type="text" placeholder="Sähköposti" name="email" />
          </div>
          <div className="textbox">
            <input type="password" placeholder="Salasana" name="password" />
          </div>
          <input className="btn" type="submit" value="Rekisteröidy" />
        </form>
        <div className="no-account">
          <p>Onko sinulla jo tili?</p>
          <a className="register-link" onClick={handleRegister}>
            kirjaudu
          </a>
        </div>
      </div>
    </>
  );
};
