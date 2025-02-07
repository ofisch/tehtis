import React from "react";
import "../style/Login.css";
import { motion } from "framer-motion";

interface RegisterComponentProps {
  toggleRegister: () => void;
  username: string;
  email: string;
  password: string;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleRegister: (e: React.FormEvent) => void;
  isPending: boolean;
}

export const RegisterComponent: React.FC<RegisterComponentProps> = ({
  toggleRegister,
  username,
  email,
  password,
  setUsername,
  setEmail,
  setPassword,
  handleRegister,
  isPending,
}) => {
  return (
    <>
      <div className="login-box">
        <div className="login-box-content">
          <h1>Tehtis</h1>
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            Uusi käyttäjä
          </motion.h3>
          <form onSubmit={handleRegister}>
            <motion.div
              className="textbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="Käyttäjänimi"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </motion.div>
            <motion.div
              className="textbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="Sähköposti"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            <motion.div
              className="textbox"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <input
                type="password"
                placeholder="Salasana"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
            {/*<p>{username + " " + email + " " + password}</p>*/}
            <motion.button
              className="btn"
              type="submit"
              disabled={
                isPending || username == "" || email == "" || password == ""
              }
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              Rekisteröidy
            </motion.button>
          </form>
          <motion.div
            className="no-account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.3 }}
          >
            <p>Onko sinulla jo tili?</p>
            <a className="register-link" onClick={toggleRegister}>
              Kirjaudu
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};
