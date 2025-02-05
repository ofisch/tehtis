import React from "react";
import "../style/Dashboard.css";
import "../style/root.css";
import { DashboardComponent } from "../components/DashboardComponent";

export const Dashboard = () => {
  // mockup-dataa kurssilistaan
  const courses = {
    course1: {
      name: "Kurssi 1",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque est saepe cum voluptate voluptates fugiat harum omnis fugit dignissimos aperiam? Eos iure quae minima beatae tempore, minus nostrum eum commodi!n",
    },
    course2: {
      name: "Kurssi 2",
      description: "Course description",
    },
    course3: {
      name: "Kurssi 3",
      description: "Course description",
    },
    course4: {
      name: "Kurssi 4",
      description: "Course description",
    },
  };

  return (
    <>
      <div className="container">
        <DashboardComponent courses={courses} />
      </div>
    </>
  );
};
