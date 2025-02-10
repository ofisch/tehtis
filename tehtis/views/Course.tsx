import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { NavComponent } from "../components/NavComponent";
import "../style/root.css";
import { CourseComponent } from "../components/CourseComponent";
import { AssignmentForm } from "../components/AssignmentForm";

export const Course = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const getCourseInfo = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/course-info/${id}`);
      const data = await response.json();
      console.log(data);
      setCourse(data);
    } catch (error) {
      console.error("Error fetching course info", error);
    }
  };

  const getCourseMembers = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/course-members/${id}`
      );
      const data = await response.json();
      console.log("testii: ", data);
      setMembers(data);
      console.log("members: ", members);
    } catch (error) {
      console.error("Error fetching course members", error);
    }
  };

  const getCourseAssignments = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/course-assignments/${id}`
      );
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error("Error fetching course assignments", error);
    }
  };

  useEffect(() => {
    if (id) {
      getCourseInfo(id);
      getCourseMembers(id);
      getCourseAssignments(id);
    }
  }, [id]); // Fetch course info whenever the id changes

  const [assignmentBox, setAssignmentBox] = useState(false);

  const toggleAssignmentBox = () => {
    setAssignmentBox(!assignmentBox);
  };

  return (
    <>
      <div className="container">
        <div className="nav-background"></div>
        <NavComponent />
        <CourseComponent
          course={course}
          members={members}
          assignments={assignments}
          toggleAssignmentBox={toggleAssignmentBox}
        />

        {assignmentBox && (
          <AssignmentForm
            toggleAssignmentBox={toggleAssignmentBox}
            courseId={parseInt(id || "0")}
            onAssignmentAdded={() => getCourseAssignments(id!)}
          />
        )}
      </div>
    </>
  );
};
