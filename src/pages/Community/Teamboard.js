import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/template/Sidebar"
import Whiteboard from "./Whiteboard";
import style_mypage from "../../style/Mypage.module.css"

function Teamboard(){
    const[team, setteam] = useState([]); // 팀 전체 정보
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const[me, setme] = useState();
    
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

     // css style
    const baseBoxStyle = {
      width: "50px",
      height: "50px",
      borderRadius: "15px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      transition: "opacity 0.2s ease",
    };
    const getOpacity = (id) => selectedTeamId === id ? 1 : 0.4;

    

    return(
            <div className={style_mypage.wrapper}>
                {/*Sidebar*/}
                <Sidebar title="Community" dataarray={["MY TEAM", "TEAM BOARD"]} link={["/Team", "/Teamboard"]}></Sidebar>
                <div className={style_mypage.innerbox} style={{flexDirection:"column", marginTop:"15px"}}>
                    <div style={{width:"100%", height:"50px", display:"flex", alignItems:"center", gap:"15px", marginBottom:"10px", marginLeft:"10px"}}>
                        <p style={{fontSize:"24px", fontWeight:"700", marginRight:"20px"}}>TEAM BOARD</p>
                        {team?.map((item, index) => {
                            return (
                                <div key={index} style={{ width: "50px", height: "50px", position: "relative" }}>
                                {!item.team_image.startsWith('http') && !item.team_image.startsWith('hsl(') ? 
                                    <div onClick={() => setSelectedTeamId(item.team_id)}
                                    style={{...baseBoxStyle, backgroundColor: getbgColor(), opacity: getOpacity(item.team_id)}}/>
                                    : item.team_image.startsWith('hsl(')
                                        ? <div onClick={() => setSelectedTeamId(item.team_id)}
                                        style={{ ...baseBoxStyle, backgroundColor: item.team_image, opacity: getOpacity(item.team_id)}}/> 
                                        : (<img src={item.team_image} alt="미리보기" onClick={() => setSelectedTeamId(item.team_id)}
                                        style={{ ...baseBoxStyle, width: "100%", height: "100%", position: "absolute", top: 0, left: 0, 
                                          objectFit: "cover", opacity: getOpacity(item.team_id)}}/>
                                )} </div>
                            );
                        })}

                    </div>

                    {me&&<Whiteboard key={selectedTeamId} teamId={selectedTeamId} me={me} />}
                </div>
            </div>
        )
} export default Teamboard;