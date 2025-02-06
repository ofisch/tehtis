import React, { useEffect, useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import { AnimatePresence } from "framer-motion";
import { RegisterComponent } from "../components/RegisterComponent";
import { LoginComponent } from "../components/LoginComponent";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [toggleRegister, setToggleRegister] = useState(false);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

  // tarkistetaan sessio, kun komponentti latautuu
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Session:", data);
        if (data.loggedIn) {
          setLoggedIn(true);
          login({ id: data.userId, email: data.email }); // säilötään käyttäjän sessio
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    checkSession();
  }, [navigate, login]);

  // haetaan kaikki käyttäjät debuggaamista varten
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const [isPending, startTransition] = useTransition();

  // login-funktio, joka lähettää POST-pyynnön backendiin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
          login({ id: data.userId, email });
          setLoggedIn(true);
          navigate("/dashboard");
        } else {
          alert(data.error || "Invalid credentials");
        }
      } catch (error) {
        alert("An error occurred while logging in");
        console.error(error);
      }
    });
  };

  const handleRegister = () => {
    setToggleRegister(!toggleRegister);
  };

  return (
    <>
      <div className="container">
        <div className="login-box">
          <AnimatePresence mode="wait">
            {toggleRegister ? (
              <RegisterComponent handleRegister={handleRegister} />
            ) : (
              <LoginComponent
                email={email}
                password={password}
                setEmail={setEmail}
                setPassword={setPassword}
                handleLogin={handleLogin}
                handleRegister={handleRegister}
                isPending={isPending}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
