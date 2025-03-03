import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/courseform.css";
import { desc } from "framer-motion/client";

interface AddCourseFormProps {
  toggleAddCourseBox: () => void;
  user: { id: number; role: string; firstname: string; email: string } | null;
}

export const AddCourseForm: React.FC<AddCourseFormProps> = ({
  toggleAddCourseBox,
  user,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/add-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          description: "kurssin kuvaus",
          ownerId: user?.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Kurssi luotu:", result);
        console.log("kurssin data: ", result.data);
        setName("");
        toggleAddCourseBox();
      } else {
        alert("Kurssin luonti epäonnistui.");
      }
    } catch (error) {
      console.error("Virhe kurssin luonnissa:", error);
    }
  };

  return (
    <div className="back-shadow">
      <form className="add-course-form" onSubmit={handleSubmit}>
        <h2>
          Luo uusi kurssi <span></span>
        </h2>
        <div className="add-course-form-content">
          <label>
            <span>Otsikko:</span>

            <input
              className="assignment-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              spellCheck="false"
            />
          </label>

          <div className="buttons">
            <button className="cancel-button" onClick={toggleAddCourseBox}>
              Peruuta
            </button>
            <button type="submit">Luo kurssi</button>
          </div>
        </div>
      </form>
    </div>
  );
};
