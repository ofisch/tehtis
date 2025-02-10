import React from "react";
import "../style/root.css";
import "../style/course.css";
import { motion } from "framer-motion";

export const CourseComponent = ({
  course,
  members,
  assignments,
}: {
  course: { name: string; description: string };
  members: { id: number; name: string; email: string }[];
  assignments: { id: number; name: string; description: string }[];
}) => {
  return (
    <motion.div
      className="course-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.3 }}
    >
      <h1>{course.name}</h1>
      <p>{course.description}</p>
      <ul className="course-members">
        <h3>osallistujat</h3>
        {members.map((member: any) => {
          return (
            <li className="member" key={member.id}>
              <h4 className="member-name">{member.name}</h4>
              <p className="member-email">{member.email}</p>
            </li>
          );
        })}
      </ul>
      <h3>Tehtävät</h3>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <strong>{assignment.name}</strong> - {assignment.description}{" "}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
