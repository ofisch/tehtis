import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TextEditorComponent } from "./TextEditorComponent";

interface EditSubmissionFormProps {
  submissionId: number;
  description: string;
  toggleEditBox: () => void;
}

export const EditSubmissionForm = ({
  submissionId,
  description,
  toggleEditBox,
}: EditSubmissionFormProps) => {
  const { user } = useAuth();
  const [newDescription, setNewDescription] = useState(description);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/update-submission/${submissionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: newDescription,
          }),
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      alert("Palautus päivitetty onnistuneesti!");
      toggleEditBox();
    } catch (error) {
      console.error("Error updating submission", error);
      alert("Palautuksen päivittäminen epäonnistui!");
    }
  };

  return (
    <>
      <div className="back-shadow">
        <form onSubmit={handleSubmit} className="assignmentform">
          <h2>Muokkaa palautusta</h2>

          <label>Kuvaus</label>
          <div className="" style={{ height: "20em" }}>
            <TextEditorComponent
              content={newDescription}
              setContent={setNewDescription}
            />
          </div>
          <div className="buttons">
            <button
              className="cancel-button"
              type="button"
              onClick={toggleEditBox}
            >
              Peruuta
            </button>
            <button type="submit">Tallenna</button>
          </div>
        </form>
      </div>
    </>
  );
};
