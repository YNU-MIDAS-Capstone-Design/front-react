import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./components/template/Template";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserStyle from './pages/UserStyle';

function App() {
    return (
        <Router>
            <Template>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/Userstyle" element={<UserStyle />} />
                </Routes>
            </Template>
        </Router>
    );
}

export default App;
