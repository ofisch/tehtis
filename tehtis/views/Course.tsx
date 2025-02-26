import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { NavComponent } from "../components/NavComponent";
import "../style/root.css";
import { CourseComponent } from "../components/CourseComponent";
import { AssignmentForm } from "../components/AssignmentForm";
import { AddMembersForm } from "../components/AddMembersForm";
import { RemoveMembersForm } from "../components/RemoveMembersForm";
import { useAuth } from "../context/AuthContext";

export const Course = () => {
  const { id } = useParams(); // haetaan kurssin ID osoitteesta
  const { user } = useAuth();
  const [course, setCourse] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  const navigate = useNavigate();

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

  const onFileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(
        `http://localhost:3000/upload/course/${id}`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // Ensures session cookies are sent
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      alert("Tiedosto lähetetty onnistuneesti!");
      getCourseFiles(id!);
      console.log(data);
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Tiedoston lähetys epäonnistui!");
    }
  };

  const [courseFiles, setCourseFiles] = useState<any[]>([]);

  const getCourseFiles = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/files/course/${id}`);
      const data = await response.json();
      setCourseFiles(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching course files", error);
    }
  };

  useEffect(() => {
    if (id) {
      getCourseFiles(id);
    }
  }, [id]); // Fetch course info whenever the id changes

  const deleteCourseFile = async (fileId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/delete-file/${fileId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      alert("Tiedosto poistettu onnistuneesti!");
      getCourseFiles(id!);
    } catch (error) {
      console.error("Error deleting file", error);
      alert("Tiedoston poisto epäonnistui!");
    }
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
          onFileSubmit={onFileSubmit}
          courseFiles={courseFiles}
          deleteCourseFile={deleteCourseFile}
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
