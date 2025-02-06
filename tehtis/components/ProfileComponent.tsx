import React from "react";

import { motion } from "framer-motion";

interface User {
  id: number;
  email: string;
}

interface ProfileComponentProps {
  user: User;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({ user }) => {
  return (
    <>
      <motion.div
        className="profile-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      >
        <h1>Profiili</h1>
        <p>Tämä on profiilisivu. Täältä löydät tietoja omasta profiilistasi.</p>
        <div className="profile-info">
          <div className="username">
            <label>Käyttäjänimi</label>
            <h2>matti</h2>
          </div>

          <div className="email">
            <label>Sähköposti</label>
            <h3>{user?.email}</h3>
          </div>

          <div className="student-id">
            <label>Oppilastunnus</label>
            <h3>038379578312</h3>
          </div>
        </div>
      </motion.div>
    </>
  );
};
