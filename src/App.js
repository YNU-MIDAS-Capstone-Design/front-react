import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Template from "./components/template/Template";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Mypage from "./pages/MyPage/Mypage";
import Likedpage from "./pages/MyPage/Likedpage";
import TeamList from "./pages/Community/TeamList";
import Post from "./pages/Post";
import CreatePost from "./pages/CreatePost";
import Team from "./pages/Community/Team"
import Project from "./pages/Project";
import Userpage from "./pages/MyPage/UserPage";
import MbtiTest from "./pages/Userstyle/MbtiTest";
import UserStyle from "./pages/Userstyle/UserStyle";
import Teamboard from "./pages/Community/Teamboard";
import Whiteboard from './pages/Community/Whiteboard'; 
import MemberManagement from './pages/Developers/MemberManagement'


function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Template이 필요한 페이지들 */}
        <Route element={<Template />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Userstyle" element={<UserStyle />} />
          <Route path="/mbtitest" element={<MbtiTest />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/Likedpage" element={<Likedpage />} />
          <Route path="/community/teamlist" element={<TeamList />} />
          <Route path="/Post/:projectId" element={<Post />} />
          <Route path="/CreatePost" element={<CreatePost />} />
          <Route path="/CreatePost/edit/:projectId" element={<CreatePost />} />
          <Route path="/project" element={<Project />} />
          <Route path="/team" element={<Team />} />
          <Route path="/user/:nickname" element={<Userpage />} />
          <Route path="/whiteboard/:teamId" element={<Whiteboard />} />
          <Route path="/teamboard" element={<Teamboard />} />
        </Route>

        {/* ❌ Template 없이 표시할 페이지 */}
        <Route path="/Developer" element={<MemberManagement />} />
      </Routes>
    </Router>

  );
}

export default App;
