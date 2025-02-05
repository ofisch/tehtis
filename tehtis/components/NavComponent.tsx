import React from "react";

export const NavComponent = () => {
  return (
    <nav>
      <ul>
        <li>
          <h2>Tehtis</h2>
        </li>
        <li>
          <a href="/">Etusivu</a>
        </li>
        <li>
          <a href="/profile">Profiili</a>
        </li>
        <li>
          <a href="/logout">Kirjaudu ulos</a>
        </li>
      </ul>
    </nav>
  );
};
