import React from "react";
import "../style/root.css";
import "../style/course.css";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";

export const CourseComponent = ({
  course,
  members,
  assignments,
  toggleAssignmentBox,
  toggleAddMembersBox,
}: {
  course: { name: string; description: string };
  members: { id: number; name: string; email: string }[];
  assignments: { id: number; title: string; description: string }[];
  toggleAssignmentBox: () => void;
  toggleAddMembersBox: () => void;
}) => {
  return (
    <motion.div
      className="course-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.3 }}
    >
      <header className="course-header">
        <h1>{course.name}</h1>
        <p>{course.description}</p>
        <div className="course-actions">
          <button className="add-course-button" onClick={toggleAssignmentBox}>
            <FaPlus />
            <span>Lisää tehtävä</span>
          </button>
          <button className="add-members-button" onClick={toggleAddMembersBox}>
            <FaUserPlus />
            <span>Lisää osallistujia</span>
          </button>
        </div>
      </header>

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
            <strong>{assignment.title}</strong> - {assignment.description}{" "}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
