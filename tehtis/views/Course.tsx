import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { NavComponent } from "../components/NavComponent";
import "../style/root.css";
import { CourseComponent } from "../components/CourseComponent";
import { AssignmentForm } from "../components/AssignmentForm";
import { AddMembersForm } from "../components/AddMembersForm";
import { RemoveMembersForm } from "../components/RemoveMembersForm";

export const Course = () => {
  const { id } = useParams(); // haetaan kurssin ID osoitteesta
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

  const [addMembersBox, setAddMembersBox] = useState(false);

  const toggleAddMembersBox = () => {
    setAddMembersBox(!addMembersBox);
  };

  const [removeMembersBox, setRemoveMembersBox] = useState(false);

  const toggleRemoveMembersBox = () => {
    setRemoveMembersBox(!removeMembersBox);
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
          toggleAddMembersBox={toggleAddMembersBox}
          toggleRemoveMembersBox={toggleRemoveMembersBox}
        />

        {assignmentBox && (
          <AssignmentForm
            toggleAssignmentBox={toggleAssignmentBox}
            courseId={parseInt(id || "0")}
            onAssignmentAdded={() => getCourseAssignments(id!)}
          />
        )}

        {addMembersBox && (
          <AddMembersForm
            toggleAddMembersBox={toggleAddMembersBox}
            course={course}
            onMembersAdded={() => getCourseMembers(id!)}
          />
        )}

        {removeMembersBox && (
          <RemoveMembersForm
            toggleRemoveMembersBox={toggleRemoveMembersBox}
            course={course}
            onMembersRemoved={() => getCourseMembers(id!)}
          />
        )}
      </div>
    </>
  );
};
