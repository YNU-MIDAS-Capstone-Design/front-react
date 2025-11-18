import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./ProjectManagement.module.css"

function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProjects = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
            try {
                const res = await axios.get("/api/admin/posts", {
                headers: { Authorization: `Bearer ${token}` },
                });
                // 백엔드 응답 형식에 맞게 안전하게 파싱
                const list = Array.isArray(res.data.posts)
                ? res.data.posts.map((p) => ({
                    id: p.id,
                    title: p.title,                    
                    }))
                : [];
                setProjects(list);
            } catch (err) {
                console.error("프로젝트 목록 조회 실패:", err);
                setProjects([]);
            }
            };

            fetchProjects();
    }, []);

    const handleProjectClick = (projectId) => {
        navigate(`/Developer/project/${projectId}`);
    };

    const handleDelete = async (projectId) => {
        const token = localStorage.getItem("accessToken");
        try {
            await axios.delete(`/api/admin/posts/${projectId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
            } catch (err) {
            console.error("삭제 실패:", err);
        }
    };
    
    return (
        <div style={{display:"flex", backgroundColor:"#F5F5F5"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div style={{width:"1260px", height:"fit-content",  boxShadow: "0 1px 5px 0 #0000001a, 0 1px 2px -1px #0000001a", borderRadius:"16px", backgroundColor:"white", padding:"10px 30px", boxSizing:"border-box", color:"#1C2A53"}}>
                    <h2>게시물 관리</h2>
                    <div style={{display:"flex", flexDirection:"column", width:"100%", marginTop:"30px", borderRadius:"8px"}}>
                        <div className={styles.listbox} style={{height:"50px", borderTop:"none", color: "#8E95A9", backgroundColor:"#F8F8F8"}}>
                            <div className={styles.listitem}>글 제목</div>
                            <div className={styles.listitem} style={{display: "flex", justifyContent: "flex-end"}}>삭제</div>
                        </div>
                        {projects.map((p) => (
                            <div key={p.id} className={styles.listbox} style={{height:"65px"}}>
                                <div className={styles.listitem} style={{cursor: "pointer"}} onClick={() => handleProjectClick(p.id)}>{p.title}</div>
                                <div className={styles.listitem} style={{ color: "#3B82F6", cursor: "pointer", display: "flex", justifyContent: "flex-end"}} onClick={() => handleDelete(p.id)}> 삭제 </div>
                            </div>
                        ))}
                        {/* 데이터 없을 때 */}
                        {projects.length === 0 && (
                            <div style={{ textAlign: "center", marginTop: "30px", color: "#999"}}>
                                불러올 게시물이 없습니다.
                            </div>
                        )}
                    </div>
                </div>
            </div> 
        </div>
    )
    
}

export default ProjectManagement;