import React from "react";
import "../style/Dashboard.css";
import "../style/root.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

interface Course {
  name: string;
  description: string;
}

interface DashboardComponentProps {
  courses: any[];
  user: { id: number; email: string } | null;
}

export const DashboardComponent: React.FC<DashboardComponentProps> = ({
  courses,
  user,
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
          Hei {user?.email}! Tämä on etusivu. Täältä löydät listan kursseista,
          joihin olet osallistunut.
        </p>

        <div className="courses">
          <h2>Kurssit</h2>
          <div className="course-list">
            {courses.map((course) => {
              return (
                <Link to={`/course/${course.id}`} key={course.id}>
                  <div className="course">
                    <h3>{course.name}</h3>
                    <p>{course.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
};
