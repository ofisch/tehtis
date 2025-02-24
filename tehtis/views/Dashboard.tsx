import React, { useEffect } from "react";
import "../style/Dashboard.css";
import "../style/root.css";
import "../style/Course.css";
import { DashboardComponent } from "../components/DashboardComponent";
import { NavComponent } from "../components/NavComponent";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { join } from "path";

export const Dashboard = () => {
  const { loggedIn, user } = useAuth();
  const navigate = useNavigate();

  console.log("User:", user);
  console.log("role:", user?.role);
  console.log("Logged in:", loggedIn);

  const [courses, setCourses] = React.useState<any[]>([]);

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const getCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching courses", error);
    }
  };

  const getMyCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/my-courses", {
        credentials: "include", // Important for session-based authentication
      });
      const data = await response.json();
      console.log("My courses:", data);
      setCourses(data);
    } catch (error) {
      console.error("Error fetching my courses", error);
    }
  };

  const joinCourse = async (courseId: number) => {
    try {
      const response = await fetch("http://localhost:3000/join-course", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      console.log("join course: ", data);
    } catch (error) {
      console.error("Error joining course", error);
    }
  };

  // mockup-dataa kurssilistaan
  /*const courses = {
    course1: {
      name: "Menetelmäopinnot, suomen kieli ja viestintä, syksy ",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque est saepe cum voluptate voluptates fugiat harum omnis fugit dignissimos aperiam? Eos iure quae minima beatae tempore, minus nostrum eum commodi!n",
    },
    course2: {
      name: "Kansantaloustieteen perusteet (uusi versio, käytä ...",
      description: "Course description",
    },
    course3: {
      name: "Elements of AI",
      description:
        "The Elements of AI koostuu ilmaisista verkkokursseista, jotka ovat tehneet MinnaLearn ja Helsingin yliopisto yhteistyössä. Tavoitteenamme on rohkaista ihan jokaista ikään ja taustaan katsomatta oppimaan tekoälyn perusteet: mitä tekoäly on, mitä sillä voi (ja ei voi) tehdä ja miten luoda tekoälymenetelmiä. Kurssit koostuvat teoriaosuuksista ja käytännön harjoituksista, ja voit suorittaa ne omaan tahtiisi.",
    },
    course4: {
      name: "Syväsukellus moderniin websovelluskehitykseen",
      description:
        "Ota haltuusi React, Redux, Node.js, MongoDB, GraphQL ja TypeScript! Kurssilla tutustutaan JavaScriptilla tapahtuvaan moderniin websovelluskehitykseen. Pääpaino on React-kirjaston avulla toteutettavissa single page -sovelluksissa, ja niitä tukevissa Node.js:llä toteutetuissa REST-rajapinnoissa.",
    },
  };*/

  // odotetaan istunnon latautumista, jos käyttäjä ei ole kirjautunut, ohjataan login-sivulle
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (!loggedIn) {
      timerId = setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      getMyCourses();
    }
    return () => clearTimeout(timerId);
  }, [user]);

  return (
    <>
      <div className="container">
        <div className="nav-background"></div>
        <NavComponent />
        <DashboardComponent courses={courses} user={user} />
      </div>
    </>
  );
};
