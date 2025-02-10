import React from "react";
import "../style/root.css";
import "../style/course.css";

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
    <div className="course-content">
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
    </div>
  );
};
