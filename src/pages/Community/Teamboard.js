import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/template/Sidebar"
import style_mypage from "../../style/Mypage.module.css"
import styles from "../../style/Teamboard.module.css"


function Teamboard(){
    const[team, setteam] = useState([]); // 팀 전체 정보
    const[me, setme] = useState();
    const navigate = useNavigate();

    const handleTeamClick = (team_id) => {
      navigate(`/whiteboard/${team_id}`, { state: { me } });
    }

    
    /*✅ 유저 정보 GET */
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get('/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setme(res.data);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /*✅ 팀 페이지 GET */
    const fetchTeam = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get('/api/myteams/team', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setteam(res.data.myTeams);
        console.log(res.data.myTeams);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    useEffect(() => {
          fetchTeam();
          fetchUser();
        }, []);

    /* ✅ 팀 이미지 색상 */
    const getbgColor = () => {
      const hueRanges = [
        [180, 200], // 하늘색
        [200, 240], // 파랑
      ];
    
      const [minHue, maxHue] = hueRanges[Math.floor(Math.random() * hueRanges.length)];
    
      const h = Math.floor(Math.random() * (maxHue - minHue)) + minHue;
      const s = Math.floor(Math.random() * 20) + 60; // 채도 
      const l = Math.floor(Math.random() * 20) + 75; // 밝기
    
      return `hsl(${h}, ${s}%, ${l}%)`;
    };

    return(
            <div className={style_mypage.wrapper}>
                {/*Sidebar*/}
                <Sidebar title="Community" dataarray={["MY TEAM", "TEAM BOARD"]} link={["/Team", "/Teamboard"]}></Sidebar>
                <div className={style_mypage.innerbox} style={{flexDirection:"column", marginTop:"18px"}}>
                  <div style={{width:"1000px", height:"50px", display:"flex", alignItems:"center", marginBottom:"10px", marginLeft:"10px"}}>
                      <p style={{fontSize:"24px", fontWeight:"700", marginRight:"20px"}}>TEAM BOARD</p>
                  </div>
                  <div style={{width:"1000px", display:"flex", alignItems:"center", gap:"50px", margin: "20px", flexWrap:"wrap"}}>
                    {team?.map((item, index) => {
                            return (
                                <div key={index} onClick={() => handleTeamClick(item.team_id)} className={styles.outerBoxStyle}>
                                  <div className={styles.baseBoxStyle}>
                                    {!item.team_image.startsWith('http') && !item.team_image.startsWith('hsl(') ? 
                                      <div className={styles.imgStyle} style={{backgroundColor: getbgColor()}}/>
                                      : item.team_image.startsWith('hsl(')
                                          ? <div className={styles.imgStyle} style={{backgroundColor: item.team_image}}/>
                                          : (<img src={item.team_image} alt="미리보기" className={styles.imgStyle}/>
                                    )} 
                                  </div>
                                  <div style={{height:"58px", display:"flex", alignItems: "center", fontSize:"16px", fontWeight:"500", padding:"0 12px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis", }}> {item.team_name} </div>                         
                                </div>
                            );
                        })}
                   </div>
                </div>
            </div>
        )
} export default Teamboard;