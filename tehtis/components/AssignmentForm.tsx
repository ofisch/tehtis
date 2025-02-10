import React, { useState } from "react";

interface AssignmentFormProps {
  courseId: number;
  onAssignmentAdded: () => void; // Callback to refresh assignments list
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  courseId,
  onAssignmentAdded,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

        onAssignmentAdded(); // Refresh assignment list
      } else {
        alert("Failed to add assignment.");
      }
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Lisää uusi tehtävä</h3>
      <label>
        Otsikko:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Kuvaus:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <br />
      <br />
      <button type="submit">Lisää tehtävä</button>
    </form>
  );
};
