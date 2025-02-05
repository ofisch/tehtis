import React from "react";
import { motion } from "framer-motion";
import "../style/Login.css";

interface LoginComponentProps {
  handleRegister: () => void;
}

export const LoginComponent: React.FC<LoginComponentProps> = ({
  handleRegister,
}) => {
  return (
    <>
      <div className="login-box">
        <div className="login-box-content" key="login">
          <h1>Tehtis</h1>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            Kirjaudu sisään jatkaaksesi
          </motion.h3>
          <form action="">
            <motion.div
              className="textbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <input type="text" placeholder="Sähköposti" name="email" />
            </motion.div>
            <motion.div
              className="textbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <input type="password" placeholder="Salasana" name="password" />
            </motion.div>
            <motion.button
              className="btn"
              type="submit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Kirjaudu sisään
            </motion.button>
          </form>
          <motion.div
            className="no-account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <p>Eikö sinulla ole tiliä?</p>
            <a onClick={handleRegister} className="register-link">
              Rekisteröidy
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
