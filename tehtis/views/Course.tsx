import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams

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
      <h1>Kurssin tiedot</h1>
      <p>Tässä näkymässä näytetään kurssin tiedot.</p>
      <div className="course">
        <h3>{course.name}</h3>
        <p>{course.description}</p>
        <h3>jäsenet</h3>
        <ul>
          {members.map((member: any) => {
            return <li key={member.id}>{member.name + " " + member.email}</li>;
          })}
        </ul>
      </div>
    </>
  );
};
