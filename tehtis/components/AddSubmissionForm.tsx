import React, { useState } from "react";
import { FormTextEditorComponent } from "./FormTextEditorComponent";
import "../style/root.css";
import "../style/assignmentform.css";
import { useAuth } from "../context/AuthContext";
import { form } from "framer-motion/client";
import { defaultStyles, FileIcon } from "react-file-icon";

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

  const [files, setFiles] = useState<File[]>([]);

  console.log("assignmentId", assignmentId);
  console.log("description", description);
  console.log("studentId", user?.id);

  const addNewFile = (event: React.FormEvent) => {
    event.preventDefault();
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      const file = (fileInput as HTMLInputElement).files?.[0];
      if (file) {
        setFiles([...files, file]);
      }
    }
  };

  const uploadFiles = async (submissionId: number) => {
    for (const file of files) {
      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const response = await fetch(
          `http://localhost:3000/upload/submission/${submissionId}`,
          {
            method: "POST",
            body: fileData,
          }
        );

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        console.log(`File ${file.name} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        alert(`Tiedoston ${file.name} lataus epäonnistui!`);
      }
    }
  };

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

      const submissionId = result.submissionId; // ✅ You'll need this!

      // Now upload the files after successful submission
      await uploadFiles(submissionId);

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
        <form onSubmit={handleSubmit} className="submissionform">
          <h2 style={{ margin: "0" }}>Lisää palautus</h2>

          <p style={{ margin: "0", padding: "0", fontStyle: "italic" }}>
            Palautusta voi muokata lisäämisen jälkeen.
          </p>

          <div style={{ maxHeight: "5em" }}>
            <FormTextEditorComponent
              content={description}
              setContent={setDescription}
            />
          </div>

          {files.length > 0 && (
            <div className="file-container">
              <ul>
                {files.length > 0 &&
                  files.map((file, index) => {
                    const extension = file.name.split(".").pop();
                    const style =
                      defaultStyles[extension as keyof typeof defaultStyles] ||
                      {};

                    return (
                      <li>
                        <FileIcon extension={extension} {...style} />
                        <p>
                          {" "}
                          {file.name.length > 5
                            ? `${file.name.substring(0, 7)}...`
                            : file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                        >
                          Poista
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {files.length > 0 ? (
            <form className="file-form">
              <label className="file-label">
                <h3>Liitä tiedosto palautukseen</h3>
                <input type="file" name="file" required />
                <button
                  type="button"
                  style={{ padding: "0.5em" }}
                  onClick={addNewFile}
                >
                  Lähetä
                </button>
              </label>
            </form>
          ) : (
            <form style={{ marginTop: "6em" }} className="file-form">
              <label className="file-label">
                <h3>Liitä tiedosto palautukseen</h3>
                <input type="file" name="file" required />
                <button
                  type="button"
                  style={{ padding: "0.5em" }}
                  onClick={addNewFile}
                >
                  Lähetä
                </button>
              </label>
            </form>
          )}

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
