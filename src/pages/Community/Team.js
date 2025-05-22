import { useState, useEffect, useRef, useCallback } from "react"
import Sidebar from "../../components/template/Sidebar"
import style_mypage from "../../style/Mypage.module.css"
import style_member from "../../style/Member.module.css"
import styles from "../../style/Team.module.css"
import Member from "./Member";
import axios from "axios"

function Team(){
    const[me, setme] = useState();
    const[team, setteam] = useState([]); // 팀 전체 정보
    const[teamName, setteamName] = useState([]); // 팀 이름 정보
    const[modal, ismodal] = useState(false); 
    
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
        const teamNames = res.data.myTeams.map(team => team.team_name);
        setteamName(teamNames);
        console.log(res.data.myTeams);
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

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
        setme(res.data.nickname);
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

    /*✅ 팀 생성 POST */
    const CreateTeam = async (newName, color) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.post(`/api/myteams/team/create`, 
          { teamName: newName,  teamColor: color},
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        await fetchTeam(); //팀 전체 reRendering
        ismodal(false);  // 폼 제출 후 모달 닫기
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /*✅ 팀 생성 event */
    const inputRef = useRef();
    const handleSubmit = (e, color) =>{
      e.preventDefault();
      if (!inputRef.current) {
        console.warn("input이 렌더링되지 않았습니다.");
        return;
      }
      //입력 유무 검사
      const newTeamName = inputRef.current.value.trim();
      if (!newTeamName) {
        alert("팀 이름을 입력해주세요.");
        return;
      }

      //중복 검사
      const isDuplicate = team.some(t => t.team_name === newTeamName);
      if (isDuplicate) {
        alert("이미 존재하는 팀 이름입니다. 다른 이름을 입력해주세요.");
        return;
      }
    
      CreateTeam(newTeamName, color);
    };

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

    /* ✅ team 배열 업데이트 (콜백) */
    const updateTeamName = useCallback((teamId, newName, img) => {
      setteam(prev =>
        prev.map(t => {
          if (t.team_id !== teamId) return t;

          // team_name, team_image 모두 바뀌지 않으면 객체 유지
          if (t.team_name === newName && (!img || t.team_image === img)) return t;

          // 그렇지 않으면 새로운 객체 반환
          return {
            ...t,
            team_name: newName,
            ...(img && { team_image: img }),
          };
        })
      );
    }, []);
    
    /* ✅ teamName 배열 업데이트 (콜백) */
    const deleteTeamName = (updatedTeamNames) => {
      setteamName(updatedTeamNames); 
    };


    //>> Component
    /* ✅ 팀 생성  */
    const Teamcard_create=()=>{
      return(
          <div onClick={()=>{ismodal(()=>!modal)}} className={`${style_member.Teamcard} ${styles.Team_create}`}>
              <i class="fas fa-plus"></i>
          </div>
      )
    }

    /* ✅ 팀 생성 모달 */
    const Team_create_modal=()=>{
      const back_color = getbgColor();
      return(
        <div className={styles.modalOuter} onClick={()=>{ismodal(()=>!modal); console.log(modal);}}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{display:"flex", width:"85%"}}>
              <p style={{fontSize:"24px", fontWeight:"600", marginLeft:"8px", marginRight:"20px"}}>팀 생성</p>
              <div className={`${styles.late} ${modal? styles.show:""}`} style={{display:"flex", alignItems: "end", fontSize:"15px", color:"rgba(0,0,0,0.5)", paddingBottom:"3px"}}>1. 팀 생성 후 2. 팀원 모집을 완료하세요.</div></div>
            <div style={{width:"85%", height:"0.8px", backgroundColor:"rgba(0,0,0,0.15)"}}></div>
            <div style={{display:"flex", width:"85%", justifyContent:"left"}}>
              
            <div className={styles.Team_img} style={{backgroundColor: back_color}}></div>

            <div style={{width:"280px", marginLeft:"10px"}}>
              <p style={{fontSize:"18px", color:"rgba(0,0,0,0.9)", fontWeight:"500", marginTop:"5px"}}>팀 이름</p>
              <p style={{fontSize:"15px", color:"rgba(0,0,0,0.5)", marginBottom:"10px"}}>팀을 대표하는 이름을 선택하세요.</p>
              <form onSubmit={(e)=>handleSubmit(e, back_color)} style={{width:"100%"}}>
                <input ref={inputRef} type="text"  className={styles.modal_input}/>
                <div style={{width:"100%", display:"flex", justifyContent:"end"}}>
                  <input type="submit" value="SAVE" className={styles.modal_submit} style={{color:"rgba(255, 255, 255, 0.95)"}}/>
                </div>
              </form>
            </div>
            </div>
          </div>
        </div>
      )
    }


    return(
        <div className={style_mypage.wrapper}>
            {/*Sidebar*/}
            <Sidebar title="Community" dataarray={["MY TEAM", "TEAM CHAT", "TEAM BOARD"]} link={["/Team", "/", "/"]}></Sidebar>
            
            <div className={style_mypage.innerbox} style={{flexDirection:"column"}}>
                {team.filter(item => item !== undefined && item !== null)
                  .map((item, key) => (
                    <Member key={key} Team={item} onTeamNameChange={updateTeamName} deleteTeamNameChange={deleteTeamName} teamName = {teamName} me={me}/>
                ))}
                <Teamcard_create/>
                {modal ? <Team_create_modal/> : ""}
            </div>
        </div>
    )
}

export default Team;