import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/course.css";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { TiUserDelete } from "react-icons/ti";

import { TextEditorComponent } from "./TextEditorComponent";
import { useAuth } from "../context/AuthContext";
import { defaultStyles, FileIcon } from "react-file-icon";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export const CourseComponent = ({
  course,
  members,
  assignments,
  toggleAssignmentBox,
  toggleAddMembersBox,
  toggleRemoveMembersBox,
  onFileSubmit,
  courseFiles,
  deleteCourseFile,
  addFileToAssignment,
  assignmentFiles,
  deleteAssignmentFile,
  deleteAssignment,
}: {
  course: { id: number; name: string; description: string };
  members: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  }[];
  assignments: { id: number; title: string; description: string }[];
  toggleAssignmentBox: () => void;
  toggleAddMembersBox: () => void;
  toggleRemoveMembersBox: () => void;
  onFileSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  courseFiles: { id: number; filename: string; path: string }[];
  deleteCourseFile: (id: number) => void;
  addFileToAssignment: (
    id: number,
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  assignmentFiles: { [key: number]: any[] };
  deleteAssignmentFile: (id: number, assignmentId: number) => void;
  deleteAssignment: (id: number) => void;
}) => {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add more env variables here if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  const { user } = useAuth();

  const [editorContent, setEditorContent] = useState(course.description);

  // odotetaan vähän aikaa, että saadaan data haettua
  useEffect(() => {
    const timer = setTimeout(() => {
      setEditorContent(course.description);
    }, 500);

    return () => clearTimeout(timer);
  }, [course.description]);

  const [toggleEdit, setToggleEdit] = useState(false);

  const handleEdit = () => {
    setToggleEdit(!toggleEdit);
  };

  console.log("editorContent: ", editorContent);

  // tallennetaan uusi muokattu kuvaus
  const saveNewDescription = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/update-course/${course.id}`,
        {
          method: "POST", // Change this to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: course.name,
            description: editorContent,
          }), // Include 'name' if required
        }
      );
      const data = await response.json();
      console.log("data: ", data);
    } catch (error) {
      console.error("Error updating course description", error);
    }
  };

  const navigate = useNavigate();

  const deleteCourse = async () => {
    if (
      !window.confirm(
        "Poistettua kurssia ei voida palauttaa. Haluatko varmasti poistaa kurssin?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/delete-course/${course.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log("data: ", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  return (
    <motion.div
      className="course-content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, delay: 0.3 }}
    >
      <header className="course-header">
        <h1>{course.name}</h1>
        {user?.role === "teacher" && (
          <div className="course-actions">
            <button className="add-course-button" onClick={toggleAssignmentBox}>
              <FaPlus />
              <span>Lisää tehtävä</span>
            </button>
            <button
              className="add-members-button"
              onClick={toggleAddMembersBox}
            >
              <FaUserPlus />
              <span>Lisää osallistujia</span>
            </button>
            <button
              className="delete-members-button"
              onClick={toggleRemoveMembersBox}
            >
              <TiUserDelete /> <span>Poista osallistujia</span>
            </button>
            <button className="delete-course-button" onClick={deleteCourse}>
              <MdDeleteForever /> <span>Poista kurssi</span>
            </button>
          </div>
        )}

        <div className="course-subheader">
          <div className="course-description">
            {/* tekstieditori */}
            {toggleEdit && (
              <TextEditorComponent
                content={editorContent}
                setContent={setEditorContent}
              />
            )}
            <div className="description-content">
              {/* näytetään editorilla kirjoitettu sisältö */}
              {!toggleEdit && (
                <div className="saved-content">
                  <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                </div>
              )}
            </div>
            {user?.role === "teacher" &&
              (toggleEdit ? (
                <button
                  onClick={() => {
                    handleEdit();
                    saveNewDescription();
                  }}
                  type="button"
                >
                  Tallenna
                </button>
              ) : (
                <button onClick={handleEdit} type="button">
                  Muokkaa
                </button>
              ))}
          </div>

          <div className="file-section">
            <h3>Kurssin liitetiedostot</h3>
            <div className="course-files">
              {courseFiles.length > 0 ? (
                <ul>
                  {courseFiles.map((file) => {
                    const extension =
                      file.filename.split(".").pop()?.toLowerCase() || "";
                    const style =
                      defaultStyles[extension as keyof typeof defaultStyles] ||
                      {};

                    return (
                      <li key={file.id}>
                        <FileIcon extension={extension} {...style} />

                        <a
                          href={`${import.meta.env.VITE_URL}/${file.path}`}
                          download
                        >
                          {file.filename.length > 5
                            ? `${file.filename.substring(0, 7)}...`
                            : file.filename}
                        </a>

                        {user?.role === "teacher" && (
                          <button onClick={() => deleteCourseFile(file.id)}>
                            Poista
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Ei tiedostoja</p>
              )}
            </div>
            {user?.role === "teacher" && (
              <form className="file-form" onSubmit={onFileSubmit}>
                <label className="file-label">
                  <h3>Lisää tiedosto kursille</h3>
                  <input type="file" name="file" required />
                  <button type="submit">Lähetä</button>
                </label>
              </form>
            )}
          </div>
          {user?.role === "teacher" && (
            <ul className="course-members">
              <h3>Osallistujat</h3>
              {members.map((member) => (
                <li className="member" key={member.id}>
                  <h4 className="member-name">{`${member.firstname} ${member.lastname}`}</h4>

                  <p className="member-email">{member.email}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <h2 id="assignments-title">Tehtävät</h2>
      <ul className="assignment-list">
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <div className="assignment">
              <div className="assignment-info">
                <h2>
                  <strong>{assignment.title}</strong>
                </h2>
                <p>
                  <div
                    dangerouslySetInnerHTML={{ __html: assignment.description }}
                  />
                </p>
              </div>

              <div className="assignment-files">
                {assignmentFiles[assignment.id]?.length > 0 && (
                  <h3>Tehtävän liitetiedostot</h3>
                )}
                <ul>
                  {(assignmentFiles[assignment.id] || []).map((file) => {
                    const extension = file.filename.split(".").pop() as string;
                    const style =
                      defaultStyles[extension as keyof typeof defaultStyles] ||
                      {};

                    return (
                      <li key={file.id}>
                        <FileIcon extension={extension} {...style} />
                        <a
                          href={`${import.meta.env.VITE_URL}/${file.path}`}
                          download
                        >
                          {file.filename.length > 5
                            ? `${file.filename.substring(0, 7)}...`
                            : file.filename}
                        </a>
                        {user?.role === "teacher" && (
                          <button
                            type="button"
                            onClick={() =>
                              deleteAssignmentFile(file.id, assignment.id)
                            }
                          >
                            Poista
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {user?.role === "teacher" && (
                <form
                  className="assignment-file-form"
                  onSubmit={(event) =>
                    addFileToAssignment(assignment.id, event)
                  }
                >
                  <label>
                    <h4>Lisää tiedosto tehtävään</h4>
                    <input type="file" name="file" required />
                    <button type="submit">Lähetä</button>
                  </label>
                </form>
              )}
              {user?.role === "teacher" && (
                <button
                  style={{
                    alignSelf: "end",
                    padding: "0.5em",
                    background: "var(--bittersweet)",
                  }}
                  type="button"
                  onClick={() => deleteAssignment(assignment.id)}
                >
                  <span>
                    <MdDeleteForever />
                  </span>

                  <p>Poista</p>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
