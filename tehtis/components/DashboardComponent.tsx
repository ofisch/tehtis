import React from "react";
import "../style/Dashboard.css";
import "../style/root.css";
import { motion } from "framer-motion";

interface Course {
  name: string;
  description: string;
}

interface DashboardComponentProps {
  courses: { [key: string]: Course };
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({
  courses,
}) => {
  return (
    <>
      <motion.div
        className="dashboard-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, delay: 0.3 }}
      >
        <h1>Etusivu</h1>
        <p>
          Tämä on etusivu. Täältä löydät listan kursseista, joihin olet
          osallistunut.
        </p>

        <div className="courses">
          <h2>Kurssit</h2>
          <div className="course-list">
            {Object.keys(courses).map((key) => {
              return (
                <div className="course" key={key}>
                  <h3>{courses[key].name}</h3>
                  <p>{courses[key].description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};
