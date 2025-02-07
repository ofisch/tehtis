import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import { NavComponent } from "../components/NavComponent";
import "../style/root.css";

export const Course = () => {
  const { id } = useParams(); // Get the course ID from the URL
  const [course, setCourse] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);

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

  useEffect(() => {
    if (id) {
      getCourseInfo(id);
      getCourseMembers(id);
    }
  }, [id]); // Fetch course info whenever the id changes

  return (
    <>
      <div className="container">
        <div className="nav-background"></div>
        <NavComponent />
        <div className="course-content">
          <h1>Kurssin nimi: {course.name}</h1>
          <p>Kurssin kuvaus: {course.description}</p>
          <ul>
            <h3>kurssille osallistuvat</h3>
            {members.map((member: any) => {
              return (
                <li key={member.id}>{member.name + " " + member.email}</li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};
