import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/assignmentform.css";
import { FaPlus } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { TiDeleteOutline } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { FaCheck } from "react-icons/fa6";
import { on } from "events";

interface Course {
  name: string;
  id: string;
  // Add other properties of the course object here
}

interface AddMembersFormProps {
  course: Course;
  toggleAddMembersBox: () => void;
  onMembersAdded: () => void;
}

export const AddMembersForm: React.FC<AddMembersFormProps> = ({
  course,
  toggleAddMembersBox,
  onMembersAdded,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  interface User {
    id: string;
    name: string;
    // Add other properties of the user object here
  }

  const [searchResults, setSearchResults] = useState<User[]>([]);

  const searchForUsers = async (searchTerm: string): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:3000/search-users/${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: User[] = await response.json();
      setSearchResults(data);
      console.log("haetaan käyttäjiä: ", data);
    } catch (error) {
      console.error("Error searching for users", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchForUsers(searchTerm);
    } else if (searchTerm.length === 0) {
      searchForUsers("");
    }
  }, [searchTerm]);

  const [usersToAdd, setUsersToAdd] = useState<User[]>([]);

  const handleAddUser = (user: User): void => {
    if (!usersToAdd.some((u) => u.id === user.id)) {
      setUsersToAdd([...usersToAdd, user]);
    }
  };

  const handleDeleteUser = (user: User): void => {
    setUsersToAdd(usersToAdd.filter((u) => u !== user));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/add-member-to-course",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: course.id,
            userIds: usersToAdd.map((user) => user.id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toggleAddMembersBox();
      onMembersAdded();
      const data = await response.json();
      console.log("Käyttäjät lisätty kurssille", data);
    } catch (error) {
      console.error("Error adding users:", error);
    }
  };

  return (
    <>
      <div className="back-shadow">
        <form className="add-members-form" onSubmit={handleSubmit}>
          <h2>
            Lisää osallistujia kurssille <span>{course.name}</span>
          </h2>
          <div className="add-members-form-content">
            <div className="search">
              <label>
                <span>Hae osallistujia</span>
                <input
                  className="add-members-input"
                  type="text"
                  placeholder="Etsi osallistujaa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  spellCheck="false"
                />
              </label>

              {searchResults.length > 0 ? (
                <div className="search-results">
                  <ul>
                    {searchResults.map((user) => (
                      <li key={user.id}>
                        <h4>{user.name}</h4>
                        {usersToAdd.some((u) => u.id === user.id) ? (
                          <button
                            type="button"
                            className="added-button"
                            disabled
                          >
                            <FaCheck /> Lisätty
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddUser(user)}
                          >
                            <FaPlus /> Lisää
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {usersToAdd.length > 0 ? (
              <div className="users-to-add">
                <h2>Lisättävät käyttäjät:</h2>
                <ul>
                  {usersToAdd.map((user) => (
                    <li key={user.id}>
                      <h4>{user.name}</h4>
                      <button onClick={() => handleDeleteUser(user)}>
                        <ImCross /> Poista
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="buttons">
            <button className="cancel-button" onClick={toggleAddMembersBox}>
              Peruuta
            </button>
            <button type="submit">
              {usersToAdd.length > 1
                ? "Lisää osallistujat"
                : "Lisää osallistuja"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
