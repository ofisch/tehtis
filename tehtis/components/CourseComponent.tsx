import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/course.css";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { TiUserDelete } from "react-icons/ti";
import { TextEditorComponent } from "./TextEditorComponent";

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
}: {
  course: { name: string; description: string };
  members: { id: number; name: string; email: string }[];
  assignments: { id: number; title: string; description: string }[];
  toggleAssignmentBox: () => void;
  toggleAddMembersBox: () => void;
  toggleRemoveMembersBox: () => void;
  onFileSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  courseFiles: { id: number; filename: string; path: string }[];
  deleteCourseFile: (id: number) => void;
}) => {
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
        `http://localhost:3000/update-course/${course.id}`,
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

        <div className="course-actions">
          <button className="add-course-button" onClick={toggleAssignmentBox}>
            <FaPlus />
            <span>Lisää tehtävä</span>
          </button>
          <button className="add-members-button" onClick={toggleAddMembersBox}>
            <FaUserPlus />
            <span>Lisää osallistujia</span>
          </button>
          <button
            className="delete-members-button"
            onClick={toggleRemoveMembersBox}
          >
            <TiUserDelete /> <span>Poista osallistujia</span>
          </button>
        </div>

        <div className="course-subheader">
          <div className="course-description">
            {/* tekstieditori */}
            {toggleEdit && (
              <TextEditorComponent
                content={editorContent}
                setContent={setEditorContent}
              />
            )}

            {/* näytetään editorilla kirjoitettu sisältö */}
            {!toggleEdit && (
              <div className="saved-content">
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
              </div>
            )}

            {toggleEdit ? (
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
            )}
          </div>

          <div className="file-section">
            <div className="course-files">
              <h3>Tiedostot</h3>
              {courseFiles.length > 0 ? (
                <ul>
                  {courseFiles.map((file) => (
                    <li key={file.id}>
                      <a href={`http://localhost:3000/${file.path}`} download>
                        {file.filename}
                      </a>
                      <button onClick={() => deleteCourseFile(file.id)}>
                        Poista
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Ei tiedostoja</p>
              )}
            </div>
            <form className="file-form" onSubmit={onFileSubmit}>
              <label className="file-label">
                <h3>Lisää tiedosto kursille</h3>
                <input type="file" name="file" required />
                <button type="submit">Lähetä</button>
              </label>
            </form>
          </div>
        </div>
      </header>

      <ul className="course-members">
        <h3>Osallistujat</h3>
        {members.map((member) => (
          <li className="member" key={member.id}>
            <h4 className="member-name">{member.name}</h4>
            <p className="member-email">{member.email}</p>
          </li>
        ))}
      </ul>
      <h3>Tehtävät</h3>
      <ul>
        {assignments.map((assignment) => (
          <li key={assignment.id}>
            <strong>{assignment.title}</strong> - {assignment.description}{" "}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};
