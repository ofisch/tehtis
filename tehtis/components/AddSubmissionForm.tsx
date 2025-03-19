import React, { useState } from "react";
import { TextEditorComponent } from "./TextEditorComponent";
import "../style/root.css";
import "../style/assignmentform.css";
import { useAuth } from "../context/AuthContext";
import { form } from "framer-motion/client";

interface AddSubmissionFormProps {
  assignmentId: number;
  toggleSubmissionBox: () => void;
}

export const AddSubmissionForm = ({
  assignmentId,
  toggleSubmissionBox,
}: AddSubmissionFormProps) => {
  const { user } = useAuth();
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("assignmentId", assignmentId.toString());
    formData.append("description", description);
    formData.append("firstname", user?.firstname || "");
    formData.append("lastname", user?.lastname || "");
    formData.append("studentId", user?.id?.toString() || "");

    try {
      const response = await fetch("http://localhost:3000/submit-assignment", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      alert("Palautus lisätty onnistuneesti!");
      toggleSubmissionBox();
    } catch (error) {
      console.error("Error adding submission", error);
      alert("Palautuksen lisääminen epäonnistui!");
    }
  };

  return (
    <>
      <div className="back-shadow">
        <form onSubmit={handleSubmit} className="assignmentform">
          <h2>Lisää palautus</h2>

          <label>Kuvaus</label>
          <div className="" style={{ height: "20em" }}>
            <TextEditorComponent
              content={description}
              setContent={setDescription}
            />
          </div>
          <div className="buttons">
            <button
              className="cancel-button"
              type="button"
              onClick={toggleSubmissionBox}
            >
              Peruuta
            </button>
            <button type="submit">Lisää palautus</button>
          </div>
        </form>
      </div>
    </>
  );
};
