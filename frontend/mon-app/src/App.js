import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import FavoriteList from "./components/FavoriteList";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/favorites">Favorites</Link> |{" "}
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/favorites" element={<FavoriteList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
