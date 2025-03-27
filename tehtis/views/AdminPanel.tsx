import React, { useEffect, useState } from "react";
import "../style/root.css";
import "../style/AdminPanel.css";
import { NavComponent } from "../components/NavComponent";
import { useAuth } from "../context/AuthContext";

interface User {
  id: string;
  role: string;
  firstname: string;
  lastname: string;
}

export const AdminPanel = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  // haetaan käyttäjiä hakusanalla
  useEffect(() => {
    if (!searchTerm) return;

    const searchForUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL}/search-users/${encodeURIComponent(
            searchTerm
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data: User[] = await response.json();

        setSearchResults(data);
      } catch (error) {
        console.error("Error searching for users", error);
      }
    };

    searchForUsers();
  }, [searchTerm]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_URL}/update-role/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      setSearchResults((prevResults) =>
        prevResults.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role", error);
    }
  };

  return (
    <>
      {user?.role == "admin" && (
        <div className="container">
          <NavComponent />
          <div className="adminpanel-content">
            <h1>Hallintapaneeli</h1>

            <h2>Hallinnoi käyttäjien rooleja</h2>
            <input
              type="text"
              placeholder="Hae käyttäjiä"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              spellCheck="false"
            />
            {searchResults.length > 0 && (
              <div className="">
                <ul>
                  {searchResults
                    .filter((user) => user.role !== "admin")
                    .map((user) => (
                      <li key={user.id}>
                        <h4>{`${user.firstname} ${user.lastname}`}</h4>
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value)
                          }
                        >
                          <option value="student">oppilas</option>
                          <option value="teacher">opettaja</option>
                        </select>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
