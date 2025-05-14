import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./components/template/Template";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserStyle from "./pages/UserStyle";
import Mypage from "./pages/MyPage/Mypage";
import Likedpage from "./pages/MyPage/Likedpage";
import TeamList from "./pages/Community/TeamList";
import Post from "./pages/Post";
import CreatePost from "./pages/CreatePost";
import Team from "./pages/Community/Team"
import Project from "./pages/Project";


function App() {
  return (
    <Router>
      <Template>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Userstyle" element={<UserStyle />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Likedpage" element={<Likedpage />} />
          <Route path="/community/teamlist" element={<TeamList />} />
          <Route path="/Post" element={<Post />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Template>
    </Router>
  );
}

export default App;
