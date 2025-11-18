import styles from "./MemberManagement.module.css"
import Sidebar from "./SideBar";
import { useEffect, useState } from "react";
import axios from "axios";

function MemberManagement(){
    const[user, setuser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            console.warn("로그인을 먼저 하세요.");
            return;
          }
          try {
            const res = await axios.get('/api/admin/users', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setuser(res.data.users);
            console.log(res.data.users);
          } catch (err) {
            if (err.response) {
              console.error("서버 응답 에러:", err.response.status, err.response.data);
            } else {
              console.error("요청 자체 실패:", err.message);
            }
          }
        };
      
        fetchUser();
      }, []);

    const ListItem = ({user_id, nickname, email, bio, location, sns, mbti, job})=>{
        return (
        <div className={styles.listbox} style={{height:"65px"}}>
            <div className={styles.listitemnone}>{user_id}</div>
            <div className={styles.listitem} data-tooltip={nickname} style={{cursor:"pointer"}}>
              <span className={styles.ellipsis}>{nickname}</span></div>
            <div className={styles.listitem} style={{width:"240px", cursor:"pointer"}} data-tooltip={email}>
              <span className={styles.ellipsis}>{email}</span></div>
            <div className={styles.listitem} data-tooltip={bio} style={{cursor:"pointer"}}>
              <span className={styles.ellipsis}>{bio}</span></div>
            <div className={styles.listitemnone}>{location}</div>
            <div className={styles.listitem} data-tooltip={sns} style={{cursor:"pointer"}}>
              <span className={styles.ellipsis}>{sns}</span>
              </div>
            <div className={styles.listitemnone}>{mbti}</div>
            <div className={styles.listitemnone}>{job}</div>
        </div>);
    };

    return (
        <div style={{display:"flex", backgroundColor:"#F5F5F5"}}>
           <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div style={{width:"1260px", height:"fit-content",  boxShadow: "0 1px 5px 0 #0000001a, 0 1px 2px -1px #0000001a", borderRadius:"16px", backgroundColor:"white", padding:"10px 30px", boxSizing:"border-box", color:"#1C2A53"}}>
                    <h2>회원관리</h2>
                    <div style={{display:"flex", flexDirection:"column", width:"100%", marginTop:"30px", borderRadius:"8px"}}>
                        <div className={styles.listbox} style={{height:"50px", borderTop:"none", color: "#8E95A9", backgroundColor:"#F8F8F8"}}>
                            <div className={styles.listitem}>user_id</div>
                            <div className={styles.listitem}>nickname</div>
                            <div className={styles.listitem} style={{width:"240px"}}>email</div>
                            <div className={styles.listitem}>bio</div>
                            <div className={styles.listitem}>location</div>
                            <div className={styles.listitem}>sns</div>
                            <div className={styles.listitem}>mbti</div>
                            <div className={styles.listitem}>job</div>
                        </div>

                        {user.map((item, index)=>(
                            <ListItem key={index} user_id={item.user_id} nickname={item.nickname} 
                            email={item.email} bio={item.bio} location={item.location} sns={item.sns}
                            mbti={item.mbti} job={item.job}/>))}
                    </div>
                </div>
            </div> 
        </div>
    )

}
export default MemberManagement;