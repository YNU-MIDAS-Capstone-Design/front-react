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
import AdminLayout from "./pages/Developers/AdminLayout";
import MemberManagement from './pages/Developers/MemberManagement'
import ProjectManagement from "./pages/Developers/ProjectManagement";

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
        {/* <Route path="/Developer" element={<MemberManagement />} /> */}
        <Route path="/Developer" element={<AdminLayout />}>
          <Route index element={<MemberManagement />} />
          <Route path="ProjectManagement" element={<ProjectManagement />} />
          <Route path="/Developer/project/:projectId" element={<div style={{boxShadow: "0 1px 5px 0 #0000001a, 0 1px 2px -1px #0000001a", borderRadius:"16px", backgroundColor:"white", padding:"10px 50px", boxSizing:"border-box", color:"#1C2A53"}}>
            <Post mode="admin" />
            </div>} />
        </Route>
      </Routes>
    </Router>

  );
}

export default App;
