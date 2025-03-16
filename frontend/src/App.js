import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserStyle from "./pages/UserStyle";
import Home from "./pages/Home";
import TeamList from "./pages/Community/TeamList";

function App() {
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/userstyle" element={<UserStyle />} />
            <Route path="/community" element={<TeamList />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    </Router>
    );
}

export default App;
