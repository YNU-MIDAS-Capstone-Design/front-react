import { useState, useEffect, useRef } from "react"
import styles from "../../style/Member.module.css"
import profile from "../../assets/profile.jpg"
import axios from "axios";

function Member(props){
    const[click, setclick] = useState(0);
    const[click_pos, setclick_pos]=useState(0);
    const[modify, setmodify] = useState(0);
    const[addMember, setaddMember] = useState(0);
    const[bgColor, setbgColor] = useState("");
    const[member, setmember] = useState([]); // team 별 멤버 관리
    const[new_member, set_new_member] = useState([]); //새 멤버 추가
    const { Team, onTeamNameChange, deleteTeamNameChange, teamName, me} = props; // ✅ 본인 team 및 전체 team_name 변경 콜백 함수.
    const my_pos = ["백엔드", "프론트", "디자이너", "모바일", "인공지능", "게임"];

    /*✅ 팀 멤버 GET */
    const  getMemberlist=()=>{
        const fetchUser = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
              console.warn("로그인을 먼저 하세요.");
              return;
            }
            try {
              const res = await axios.get(`/api/myteams/team/${Team.team_id}/member`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setmember(res.data.members);
              console.log(res.data);
            } catch (err) {
              if (err.response) {
                console.error("서버 응답 에러:", err.response.status, err.response.data);
              } else {
                console.error("요청 자체 실패:", err.message);
              }
            }
          };
        
          fetchUser();
    }

    /* ✅ 팀 이름 POST */
    const modifyTeam = async (newName) => {
        const token = localStorage.getItem('accessToken');
        const encodedTeamName = encodeURIComponent(Team.team_id);
        if (!token) {
          console.warn("로그인을 먼저 하세요.");
          return;
        }
        try {
          const res = await axios.post(`/api/myteams/team/name/${encodedTeamName}`, 
            { teamName: newName },
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          onTeamNameChange(Team.team_id, newName);
          console.log(res.data);
        } catch (err) {
          if (err.response) {
            console.error("서버 응답 에러:", err.response.status, err.response.data);
          } else {
            console.error("요청 자체 실패:", err.message);
          }
        }
      };

    /* ✅ 포지션 POST */
    const modifyPos = async (newPos, member_id) => {
      const token = localStorage.getItem('accessToken');
      const encodedMemberId = encodeURIComponent(member_id);
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.post(`/api/myteams/team/member/position/${encodedMemberId}`, 
          { team_role: newPos },
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setclick_pos(-1);
        getMemberlist();
      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /* ✅ 멤버 POST */
    const add_member = async (e) => {
      e.preventDefault(); // 폼 제출 막기

      const token = localStorage.getItem('accessToken');
      const encodedTeamId = encodeURIComponent(Team.team_id);
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }

      const existingNicknames = member.map(m => m.name); // 현재 팀원 닉네임 리스트
      let successList = [];
      let failList = [];
      let duplicateList = [];

      for (const nickname of new_member) {
        if (existingNicknames.includes(nickname)) {
          duplicateList.push(nickname);
          continue;
        }

        try {
          const res = await axios.post(
            `/api/myteams/team/${encodedTeamId}/member/create`,
            { nickname },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`${nickname} 추가됨`, res.data);
          successList.push(nickname);
        } catch (err) {
          console.error(`${nickname} 추가 실패`);
          if (err.response) {
            console.error("서버 응답 에러:", err.response.status, err.response.data);
          } else {
            console.error("요청 자체 실패:", err.message);
          }
          failList.push(nickname);
        }
      }

      // 사용자에게 결과 알림
      if (failList.length > 0) {
       alert(`${failList.join(", ")}은(는) 존재하지 않는 사용자입니다.`);
      }

      if (successList.length > 0) {
        setaddMember(false);
        set_new_member([]);
        getMemberlist(); // 새로고침
      }
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
  
    /* ✅팀 이미지 update */
    useEffect(()=>{
        const savedbgColor = localStorage.getItem(`bgColor-${Team.team_name}`);
        if(savedbgColor) {
            setbgColor(savedbgColor);
        } else{
            const newbgColor = getbgColor();
            localStorage.setItem(`bgColor-${Team.team_name}`, newbgColor);
            setbgColor(newbgColor);
        }
    }, []);

    /* ✅ 클릭 이벤트 막기 */
    const preventClick = (e) => {
        e.preventDefault();       
        e.stopPropagation();
    };

    /* ✅ 팀 이름 수정 event */
    const inputRef = useRef();
    const handleSubmit = (e, data) =>{
      e.preventDefault();
      const newTeamName = inputRef.current.value.trim();

      //입력 유무 검사
      if (!newTeamName) {
        alert("팀 이름을 입력해주세요.");
        return;
      }

      //중복 검사
      const isDuplicate = teamName.some(name => name === newTeamName && name !== data);
      if (isDuplicate) {
        alert("이미 존재하는 팀 이름입니다. 다른 이름을 입력해주세요.");
        return;
      }

      //팀 이름 변경 및 유지
      const value = localStorage.getItem(`bgColor-${Team.team_name}`);
      if (value !== null) {
        localStorage.setItem(`bgColor-${newTeamName}`, value);
        localStorage.removeItem(`bgColor-${Team.team_name}`);  
      }

      // 기존 팀 이름 삭제 후 새로운 팀 이름 추가
      const updatedTeamNames = teamName.filter(name => name !== data);
      updatedTeamNames.push(newTeamName);
      deleteTeamNameChange(updatedTeamNames);

      modifyTeam(newTeamName);
      setmodify(!modify);
    }

    //>> Component
    /* ✅ 팀 카드  */
    const Teamcard=()=>{
        return (
        <>
        {modify ? modify_Teamname_modal() : ""}        
        <div onClick={(e)=>{if(modify){preventClick(e);} else {setclick(!click); getMemberlist(); setclick_pos(-1); } }} className={styles.Teamcard}>
            <div className={styles.Teamimg} style={{backgroundColor: bgColor}}></div>
            <div className={styles.Teamdata}>
                <p>{Team.team_name}</p>
            <div className={styles.rolebadge}>{Team.owner ? "owner" : "member"}</div>
            <div className={styles.TeamSet} onClick={(e) => {e.stopPropagation();}}>
                {Team.owner&& <i onClick={(e) => {setclick_pos(-1); Team.owner ? setmodify(!modify) : e.preventDefault()}} className="fas fa-pen fa-xl" style={{height:"20px", width:"20px", opacity:"0.4"}}/>}
            </div>
            </div>
        </div>
        </>
)
    }

    /* ✅ 팀원 추가 모달  */
    const AddTeammember =()=>{
      const[nickname, setNickname] = useState(""); // 멤버 nickname

      return(
        <div className={styles.modalOuter} onClick={()=>{setaddMember(!addMember); set_new_member([]);}}>
          <div onClick={(e) => e.stopPropagation()}>
            <form className={`${styles.modalcard} ${styles.modal}`} onSubmit={add_member}>

            {/*<div style={{display:"flex", justifyContent:"center", alignItems:"center", width:"100%", paddingBottom:"25px"}}>
              <div style={{width:"80px", height:"80px", borderRadius:"15px", backgroundColor: bgColor}}></div>
              <p style={{fontWeight:"700", fontSize:"24px", margin:"0 30px"}}>{Team.team_name}</p>
            </div>*/}

            <p style={{width:"90%", fontSize:"24px", marginBottom:"10px", fontWeight:"700"}}>팀원 모집</p>
            <div style={{display:"flex", alignItems:"center", width:"90%", marginBottom:"30px", marginLeft:"10px"}}>
              <i class="fas fa-user-plus" style={{opacity:"0.4", marginRight:"10px", fontSize:"1.2em", marginTop:"4px"}}></i>
              <div>
                <p style={{fontSize:"15px", color:"rgba(0,0,0,0.5)"}}>닉네임으로 팀원을 추가하세요.</p>
              </div>
            </div>
            <div style={{width:"100%", textAlign:"center", marginBottom:"5px"}}>
              <input type="text" className={styles.modal_input} value={nickname} onChange={(e)=>setNickname(e.target.value)} ></input>
              <span style={{marginLeft:"8px"}} 
                onClick = {()=>{ 
                  const trimmed = nickname.trim(); 
                  const isAlreadyAdded = new_member.includes(trimmed); 
                  const isAlreadyInTeam = member.some((m) => m.name === trimmed);
                  if (!trimmed) return; 
                  if (isAlreadyAdded || isAlreadyInTeam) {alert("이미 추가된 팀원이거나 팀에 있는 사용자입니다."); return;} 
                  set_new_member((prev) => [...prev, trimmed]); setNickname("");}}> 
                <i className="fas fa-plus" style={{opacity:"0.4"}}></i> </span>
            </div>
            <div style={{display:"flex", width:"75%", textAlign:"center", marginBottom:"15px", gap:"8px", color:"rgba(0,0,0,0.5)"}}>
              {new_member.map((item, key)=>{
                  {console.log(new_member)}
                  return <p key={key}> {item} </p>
                })}
            </div>
            {/*<div style={{width:"70%", border:"1px solid rgba(0,0,0,0.3)", overflow:"hidden", borderRadius:"6px"}}>
              <div style={{textAlign:"center", padding:"5px", fontWeight: "500", color:"rgba(0,0,0,0.5)", borderBottom:"1px solid rgba(0,0,0,0.3)"}}>MEMBER LIST</div>
              <ul style={{width:"100%", boxSizing:"border-box"}}>
                {new_member.map((item, index) => (
                <li key={index} style={{ fontSize: "14px", color: "#444" }}>{item}</li>
              ))}
              </ul>
            </div>*/}

            <button type="submit" className={styles.modal_save} style={{width:"80%", textAlign:"center", padding:"8px 0"}}>모집완료</button>
            <div style={{fontSize:"14px", color:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", marginTop:"10px"}}>※ 팀원 추가 후 모집 완료해주세요.</div>
            </form>
          </div>
        </div>
      )
    }


    /* ✅ 멤버 리스트 */
    const Membercomponent=({name, position, role, member_id})=>{
        return (
          <>
          { addMember ? <AddTeammember /> : "" }   
          <li className={styles.Memberlistset}>
              <div className={styles.Memberlistset_left}>
                  <img className={styles.Memberimg} src = {profile} alt="memberprofile"></img>
                  <p className={styles.Memberimgdata}>{name}</p>
                  {me == name && position != null ? 
                    <div onClick={()=>{if(click_pos==-1) {setclick_pos(true)} else setclick_pos(!click_pos)}} className={styles.Memberimgdata} style={{marginLeft:"25px", textAlign:"center"}}>
                      <span className={styles.button} style={{fontSize:"14px"}}>{position}</span>
                    </div> : 
                    <><p className={styles.Memberimgdata} style={{textAlign:"center", marginLeft:"25px"}}>{position}</p></>
                    }

                  {me == name && position == null ? 
                  <div onClick={()=>{if(click_pos==-1) {setclick_pos(true)} else setclick_pos(!click_pos)}} className={styles.add_button} style={{marginLeft:"-66px"}}>
                    <i className="fas fa-plus fa-xs" style={{opacity:"0.5"}}></i>
                    <div style={{fontSize:"14px", marginBottom:"1px"}}> 추가</div></div>:""}
                    
                  {me == name ? <div className={click_pos == -1 ? styles.hidden : click_pos ? styles.click_pos : styles.unclick_pos} style={{display:"flex", gap:"10px", marginLeft:"10px"}}> 
                    {my_pos.map((item, key)=>
                    (item != position)&&<div key={key} onClick={()=>{modifyPos(item, member_id); setclick_pos(!click_pos)}} className={styles.add_button} style={{fontSize:"14px"}}>{item}</div>)}
                    </div> : ""}
              </div>
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", width:"70px"}}>
                <div className={styles.rolebadge}>{role}</div> </div>
          </li>
          </>)
    }

    /* ✅ 팀 이름 수정 모달  */
    const modify_Teamname_modal=()=>{
      return(
        <div className={styles.modalOuter} onClick={()=>{setmodify(!modify);}}>
        <div className={`${styles.Teamcard} ${styles.modal}`} style={{position:"relative", width:"620px"}} onClick={(e) => e.stopPropagation()}>
          <div className={styles.Teamimg} style={{backgroundColor: bgColor}}></div>
          <form onSubmit={(e)=>handleSubmit(e, Team.team_name)}>
            <input ref={inputRef} type="text" style={{fontWeight:"700", fontSize:"24px", marginLeft:"20px"}} defaultValue={Team.team_name}/>
            <button type="submit" className={styles.modal_submit} >SAVE</button>
          </form>
          </div>
        </div>
      )
    }

    return(
        <section>
            {/*TEAM CARD*/}
            <Teamcard />
            
            {/*MEMBER LIST*/}
            <ul className={`${styles.Memberlist} ${click==0 ? styles.hidden : styles.visible}`}>
                {/*MEMBER LIST - HEADER*/}  
                <li className={styles.Memberheader}>
                    <div style={{display:"flex"}}>
                        <p className={styles.Memberimgdata}>NAME</p>
                        <p className={styles.Memberimgdata} style={{marginLeft:"30px"}}>POSITION</p>
                    </div>
                        <p style={{width:"70px", marginRight:"15px", textAlign:"center"}}>ROLE</p>
                </li>
                {/*MEMBER LIST - DATA*/}
                {member.map((item, key)=>
                    <><Membercomponent key={key} name={item.name} position={item.team_role} role={item.owner?"owner":"member"} member_id={item.member_id}></Membercomponent>
                  </>
                )}
                {member.length === 1?
                    <div onClick={()=>{setaddMember(!addMember); setclick_pos(-1);}} className={styles.add_team}>
                      <i class="fas fa-user-plus fa-lg" style={{opacity:"0.4", marginRight:"10px"}}></i>
                      <p style={{marginBottom:"2px"}}>팀원을 모집하세요.</p>
                    </div> : ""}
                {member.length != 1 && Team.owner? 
                <div onClick={()=>{setaddMember(!addMember); setclick_pos(-1);}} className={styles.add_team} style={{height:"60px"}}> <i className="fas fa-plus fa-sm" style={{opacity:"0.5", marginRight:"5px"}}></i></div>
                : ""}
            </ul>
        </section>
    )
}

export default Member;