// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Template from './components/template/Template';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import UserStyle from './pages/UserStyle';
import Mypage from './pages/Mypage';
import TeamList from './pages/Community/TeamList';
import Post from './pages/Post';
import CreatePost from './pages/CreatePost';
import Project from './pages/Project';
import EmailCheckTest from './pages/EmailCheckTest';
import Whiteboard from './pages/Whiteboard';  // 화이트보드 페이지 추가

function App() {
  return (
      <Router>
        <Template>
          <Routes>
            <Route path="/test" element={<EmailCheckTest />} />
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Userstyle" element={<UserStyle />} />
            <Route path="/Mypage" element={<Mypage />} />
            <Route path="/community/teamlist" element={<TeamList />} />
            <Route path="/Post" element={<Post />} />
            <Route path="/CreatePost" element={<CreatePost />} />
            <Route path="/project" element={<Project />} />

            <Route path="/whiteboard/:boardId" element={<Whiteboard />} />
          </Routes>
        </Template>
      </Router>
  );
}

export default App;
