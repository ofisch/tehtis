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
  user: { id: number; role: string; email: string } | null;
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
          {user?.role === "teacher" && (
            <button type="button">Lisää kurssi</button>
          )}
          <div className="course-list">
            {courses.length > 0 ? (
              courses.map((course) => {
                return (
                  <Link to={`/course/${course.id}`} key={course.id}>
                    <div className="course">
                      <h2>{course.name}</h2>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          backgroundColor: "aliceblue",
                          borderRadius: "5px",
                          padding: "5px",
                        }}
                        dangerouslySetInnerHTML={{ __html: course.description }}
                      />
                    </div>
                  </Link>
                );
              })
            ) : (
              <p>Ei kursseja tällä hetkellä.</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};
