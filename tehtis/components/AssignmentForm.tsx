import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/assignmentform.css";
import { motion } from "framer-motion";
import { div, h2 } from "framer-motion/client";
interface AssignmentFormProps {
  courseId: number;
  onAssignmentAdded: () => void; // Callback to refresh assignments list
  toggleAssignmentBox: () => void;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  courseId,
  onAssignmentAdded,
  toggleAssignmentBox,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // lomakkeen käsittely, lähetetään uuden tehtävän tiedot palvelimelle
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newAssignment = {
      title,
      description,

      courseId,
    };

    try {
      const response = await fetch("http://localhost:3000/add-assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      const result = await response.json();

      if (result.success) {
        alert("Assignment added successfully!");
        console.log("Assignment added:", result);
        setTitle("");
        setDescription("");
        toggleAssignmentBox(); // suljetaan tehtävänlisäyslomake
        onAssignmentAdded(); // päivitetään tehtävälista
      } else {
        alert("Failed to add assignment.");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const [optimisticTitle, setOptimisticTitle] = useState("");

  useEffect(() => {
    setOptimisticTitle(title);
  }, [title]);

  return (
    <>
      <div className="back-shadow">
        <form className="assignmentform" onSubmit={handleSubmit}>
          {optimisticTitle.length > 0 ? (
            <h2>Lisää uusi tehtävä - {optimisticTitle}</h2>
          ) : (
            <h2>Lisää uusi tehtävä</h2>
          )}

          <label>
            <span>Otsikko:</span>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={title !== optimisticTitle}
              required
            />
          </label>

          <label>
            <span>Kuvaus:</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            <span>Tiedostot</span>
            <input type="file" name="file" />
            <p>ei vielä tukea tiedostoille</p>
          </label>
          <div className="buttons">
            <button className="cancel-button" onClick={toggleAssignmentBox}>
              Peruuta
            </button>
            <button type="submit">Lisää tehtävä</button>
          </div>
        </form>
      </div>
    </>
  );
};
