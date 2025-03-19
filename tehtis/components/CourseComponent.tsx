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
import { AddSubmissionForm } from "./AddSubmissionForm";
import { EditSubmissionForm } from "./EditSubmissionForm";
import { h3 } from "framer-motion/client";

type Submission = {
  id: number;
  studentId: number;
  firstname: string;
  lastname: string;
  description: string;
};

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
    readonly VITE_URL: string;
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

      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting course", error);
    }
  };

  const [addSumbissionBox, setAddSubmissionBox] = useState(false);

  const toggleAddSubmissionBox = () => {
    setAddSubmissionBox(!addSumbissionBox);
  };

  const [currentAssignmentId, setCurrentAssignmentId] = useState(0);

  /*// haetaan tehtävän palautukset
app.get("/submissions/:assignmentId", (req, res) => {
  const { assignmentId } = req.params;
  const submissions = db
    .prepare("SELECT * FROM submissions WHERE assignmentId = ?")
    .all(assignmentId);

  res.json(submissions);
}); */

  const [editBox, setEditBox] = useState(false);

  const toggleEditBox = () => {
    setEditBox(!editBox);
  };

  const getSubmissionsForAssignment = async (assignmentId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/submissions/${assignmentId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting submissions for assignment", error);
    }
  };

  const [submissions, setSubmissions] = useState<
    { id: number; submissions: Submission[] }[]
  >([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissionsData = await Promise.all(
        assignments.map(async (assignment) => {
          const data = await getSubmissionsForAssignment(assignment.id);

          return { id: assignment.id, submissions: data };
        })
      );
      setSubmissions(submissionsData);
    };

    fetchSubmissions();
  }, [assignments]);

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
                  <div
                    dangerouslySetInnerHTML={{
                      __html: editorContent,
                    }}
                  />
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
                <button
                  style={{ marginTop: "1em" }}
                  onClick={handleEdit}
                  type="button"
                >
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
                <div className="assignment-desc">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: assignment.description,
                    }}
                  />
                </div>
              </div>

              {assignmentFiles[assignment.id]?.length > 0 && (
                <div className="assignment-files">
                  <h3>Tehtävän liitetiedostot</h3>
                  <ul>
                    {(assignmentFiles[assignment.id] || []).map((file) => {
                      const extension = file.filename
                        .split(".")
                        .pop() as string;
                      const style =
                        defaultStyles[
                          extension as keyof typeof defaultStyles
                        ] || {};

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
              )}

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
              {(user?.role === "teacher" || user?.role === "student") &&
                submissions.length > 0 && (
                  <>
                    {(submissions.find((item) => item.id === assignment.id)
                      ?.submissions.length || 0) > 0 && (
                      <h3>
                        {user?.role === "teacher"
                          ? "Palautukset"
                          : "Oma palautus"}
                      </h3>
                    )}
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {(
                        submissions.find((item) => item.id === assignment.id)
                          ?.submissions || []
                      )
                        .filter((submission) => {
                          // If user is a student, show only their submission
                          if (user?.role === "student") {
                            return submission.studentId === user.id;
                          }
                          // If teacher, show all submissions
                          return true;
                        })
                        .map((submission) => (
                          <li key={submission.id}>
                            <h3>
                              <span
                                style={{
                                  fontStyle: "italic",
                                  paddingLeft: "0.1em",
                                }}
                              >
                                {submission.firstname} {submission.lastname}
                              </span>
                            </h3>
                            <div
                              style={{
                                background: "var(--aliceblue)",
                                padding: "0.5em",
                                borderRadius: "15px",
                              }}
                              dangerouslySetInnerHTML={{
                                __html: submission.description,
                              }}
                            />
                            <div></div>
                          </li>
                        ))}
                    </ul>
                  </>
                )}

              {user?.role === "student" &&
                (() => {
                  const assignmentSubmissions =
                    submissions.find((item) => item.id === assignment.id)
                      ?.submissions || [];

                  const hasSubmitted = assignmentSubmissions.some(
                    (submission) => submission.studentId === user.id
                  );

                  return !hasSubmitted ? (
                    <button
                      style={{
                        alignSelf: "start",
                        padding: "0.5em",
                        background: "var(--lightgreen)",
                      }}
                      type="button"
                      onClick={() => {
                        toggleAddSubmissionBox();
                        setCurrentAssignmentId(assignment.id);
                      }}
                    >
                      <p>Lisää palautus</p>
                    </button>
                  ) : (
                    <button
                      style={{
                        alignSelf: "start",
                        padding: "0.5em",
                        background: "var(--lightgreen)",
                      }}
                      type="button"
                      onClick={() => {
                        toggleEditBox();
                        setCurrentAssignmentId(assignment.id);
                      }}
                    >
                      <p>Muokkaa palautusta</p>
                    </button>
                  );
                })()}
            </div>
          </li>
        ))}
      </ul>

      {addSumbissionBox && (
        <AddSubmissionForm
          assignmentId={currentAssignmentId}
          toggleSubmissionBox={toggleAddSubmissionBox}
        />
      )}

      {editBox &&
        (() => {
          const submission = submissions
            .find((item) => item.id === currentAssignmentId)
            ?.submissions.find(
              (submission) => submission.studentId === user?.id
            );

          if (!submission?.id) return null;

          return (
            <EditSubmissionForm
              submissionId={submission.id}
              description={submission.description || ""}
              toggleEditBox={toggleEditBox}
            />
          );
        })()}
    </motion.div>
  );
};
