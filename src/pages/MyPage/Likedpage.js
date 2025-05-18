import { useState } from "react";
import styles from "../../style/Likedpage.module.css"
import Sidebar from "../../components/template/Sidebar"

function Likedpage(){
    let [click, setClick] = useState(1);

    const ProjectCard=({title})=>{
        return(
            <div className={styles.project_card} 
                        style={{display:"flex", flexDirection:"column", width:"900px", height:"130px", boxSizing:"border-box", border: "1px solid rgba(0,0,0,0.15)", 
                        borderRadius:"10px", padding: "20px 30px", gap:"5px"}}>
                            <p style={{fontSize:"20px", fontWeight:"500"}}>{title}</p>
                            <div className={styles.ellipsis_2_lines} style={{color:"rgba(0,0,0,0.7)"}}>
                                이 글은 프로젝트에 대한 요약문입니다. 이 글은 프로젝트에 대한 요약문입니다. 
                                이 글은 프로젝트에 대한 요약문입니다. 이 글은 프로젝트에 대한 요약문입니다. 
                                이 글은 프로젝트에 대한 요약문입니다. 이 글은 프로젝트에 대한 요약문입니다.
                                이 글은 프로젝트에 대한 요약문입니다. 이 글은 프로젝트에 대한 요약문입니다.
                                이 글은 프로젝트에 대한 요약문입니다. 이 글은 프로젝트에 대한 요약문입니다.</div>      
            </div>    
        )
    }

    return(
        <div className={styles.wrapper}>
            {/*Sidebar*/}
            <Sidebar title="MY PAGE" dataarray={["MY PROFILE",  "내 활동"]} link={["/Mypage", "/Likedpage"]}></Sidebar>
            
            <div className={styles.innerbox}>
                    <div className={styles.header}>
                        <p style={{fontSize:"24px", fontWeight:"500", marginBottom:"25px"}}>내 활동</p>
                        <div style={{display:"flex", justifyContent:"left", alignItem:"center"}}>
                                <p onClick={() => setClick(1)} className={click===1 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>작성한 글</p>
                                <p onClick={() => setClick(2)} className={click===2 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>지원한 글</p>
                                <p onClick={() => setClick(3)} className={click===3 ? `${styles.active_btn} ${styles.click}` : `${styles.active_btn}`}>좋아요</p>
                                <p style={{width:"730px", borderBottom:"1px solid rgba(0,0,0,0.2)"}}></p>
                        </div>
                    </div>
                    <div className={styles.body}> 
                        <ProjectCard title="프로젝트 1"/>
                        <ProjectCard title="프로젝트 2"/>
                        <ProjectCard title="프로젝트 3"/>
                        <ProjectCard title="프로젝트 4"/>
                    </div>
            </div>
        </div>
    )
} 
export default Likedpage;