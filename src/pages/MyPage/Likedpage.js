import { useState, useEffect } from "react";
import styles from "../../style/Likedpage.module.css"
import Sidebar from "../../components/template/Sidebar"
import axios from "axios";

function Likedpage(){
    const [click, setClick] = useState(1);
    const [project, setProject] = useState([]);

    /*✅ 작성한 글 GET */
    const fetchPost = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get('/api/users/me/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    useEffect(() => {
        fetchPost();
        }, []);

    /*✅ 좋아요한 글 GET */
    const fetchlikes = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get('/api/users/me/likes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };
    
    /*✅ 지원한 글 GET */
    const fetchapply = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get('/api/users/me/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(res.data.data);
        console.log(res.data.data);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    const ProjectCard=({title, content, stacklist})=>{
        return(
            <div className={styles.project_card} 
                        style={{display:"flex", flexDirection:"column", width:"900px", height:"130px", boxSizing:"border-box", border: "1px solid rgba(0,0,0,0.15)", 
                        borderRadius:"10px", padding: "20px 30px", gap:"5px"}}>
                            <p style={{fontSize:"20px", fontWeight:"500"}}>{title}</p>
                            <div className={styles.ellipsis_2_lines} style={{color:"rgba(0,0,0,0.7)"}}>
                                {content} </div>
                            <div style={{display:"flex", gap:"10px", fontSize:"15px", color:"rgba(0,0,0,0.5)"}}>
                              {stacklist?.map((item, index)=>
                              <div>#{item}</div>
                            )}</div>   
            </div>    
        )
    }

    return(
        <div className={styles.wrapper}>
            {/*Sidebar*/}
            <Sidebar title="MY PAGE" dataarray={["MY PROFILE",  "내 활동"]} link={["/Mypage", "/Likedpage"]}></Sidebar>
            
            <div className={styles.innerbox} >
                    <div className={styles.header}>
                        <p style={{fontSize:"24px", fontWeight:"700", marginBottom:"25px"}}>내 활동</p>
                        <div style={{display:"flex", justifyContent:"left", alignItem:"center"}}>
                                <p onClick={() => {setClick(1); fetchPost();}} className={click===1 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>작성한 글</p>
                                <p onClick={() => {setClick(2); fetchlikes();}} className={click===2 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>지원한 글</p>
                                <p onClick={() => {setClick(3); fetchapply();}} className={click===3 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>좋아요</p>
                                <p style={{width:"730px", borderBottom:"1px solid rgba(0,0,0,0.2)"}}></p>
                        </div>
                    </div>
                    <div className={styles.body}> 
                        {project?.map((item, key)=>(
                            <ProjectCard key={key} title={item.title} content={item.content} stacklist={item.stackList}/>
                        ))}
                    </div>
            </div>
        </div>
    )
} 
export default Likedpage;