import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "../views/Login";
import { Test } from "../views/Test";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Test />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};
