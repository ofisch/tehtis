import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/assignmentform.css";

interface Course {
  name: string;
  // Add other properties of the course object here
}

interface AddMembersFormProps {
  course: Course;
  toggleAddMembersBox: () => void;
}

export const AddMembersForm: React.FC<AddMembersFormProps> = ({
  course,
  toggleAddMembersBox,
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
    }
  }, [searchTerm]);

  return (
    <>
      <div className="back-shadow">
        <form className="add-members-form">
          <h2>
            Lisää osallistujia kurssille <span>{course.name}</span>
          </h2>

          <label>
            <span>Hae osallistujia:</span>
            <input
              className="assignment-input"
              type="text"
              placeholder="Etsi osallistujaa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              spellCheck="false"
            />
          </label>

          <div className="search-results">
            <ul>
              {searchResults.map((user) => (
                <li key={user.id}>
                  <h4>{user.name}</h4>
                  <button>Lisää</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="users-to-add">
            <h3>Lisättävät käyttäjät</h3>
            <ul>
              <li>tähän</li>
              <li>lisättävät</li>
              <li>käyttäjät</li>
            </ul>
          </div>

          <div className="buttons">
            <button className="cancel-button" onClick={toggleAddMembersBox}>
              Peruuta
            </button>
            <button type="submit">Lisää osallistuja(t)</button>
          </div>
        </form>
      </div>
    </>
  );
};
