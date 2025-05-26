import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom";
import Sidebar from "../../components/template/Sidebar"
import styles from "../../style/Mypage.module.css"
import profile from "../../assets/profile.jpg"
import git from "../../assets/github-brands.svg"
import axios from 'axios'

function Userpage(){
    const[user, setuser] = useState({}); //user info 관리
    const { nickname } = useParams();
    
    const images = require.context('../../assets/stack', false, /\.png$/);

    /*✅ 사용자 정보 GET */
    useEffect(() => {
        const fetchUser = async () => {
          const token = localStorage.getItem('accessToken');
          if (!token) {
            console.warn("로그인을 먼저 하세요.");
            return;
          }
          try {
            const res = await axios.get(`/api/users/${nickname}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(res.data);
            setuser(res.data);
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

    /* ✅ GitUrl */
    const GitUser=(gitUrl)=>{
      if (typeof gitUrl === 'string') {
        const match = gitUrl.match(/\/([^/]+)$/);
        const result = match ? match[1] : null;
        return(result);
      } else {
        console.warn('URL이 문자열이 아닙니다:', gitUrl);
        return("");
      }
    }

    return(
        <div className={styles.wrapper}>
            {/*User info*/}
            <div className={styles.innerbox}>

                {/*User info-left*/}
                <div className={styles.profilebox}>

                    {/*User img, name*/}
                    <div className={styles.profileImgbox}>
                        <img className={styles.profileImg} src = {user.profileImageUrl || profile} alt="profile"></img>
                    </div>
                    <p className={styles.nickname}>{user.nickname}</p>

                    {/*User info-right*/}
                    <div className={styles.profilebox_left} style={{boxShadow:"0 1px 8px 0 #0000001a,0 1px 8px -3px #0000001a", padding: "8px 0", borderRadius:"20px"}}>
                        {/*User Team*/}
                        {/*<div className={styles.profilebox_left_section}>
                            <div style={{display:"flex", gap: "14px"}}>
                                <p style={{fontWeight:"500"}}>TEAM</p>
                                <p>{(user.teams?.length)}</p>
                            </div>
                            <div className={styles.Imgsection}>
                                {user.teams?.map((item, key)=><div key={key} className={styles.TeamImg} style={{backgroundColor: handlebgColor(item)}}></div>)}
                            </div>
                        </div>*/}
                        
                        {/*User Email*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Email</p>
                            <div style={{display:"flex", height:"36px", boxSizing:"border-box", paddingTop:"8px"}}>{user.email}</div>
                        </div>

                        {/*User MBTI*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500", display:"flex", justifyContent:"space-between"}}>MBTI</p>
                            <div style={{display:"flex", alignItems:"center"}}>
                                <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden"}}> 
                                  {user.mbti}</div>
                            </div>
                        </div>

                        {/*User Job*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Job</p>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden", margin: "0"}}> 
                                  {user.job} </div>
                            </div>
                        </div>

                        {/*User Locate*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Locate</p>
                            <div style={{display:"flex",alignItems:"center", gap: "3px"}}>
                                <p className={styles.inputbox} style={{padding:"6px", paddingLeft:"0", overflow:"hidden", height:"22.4px"}}>{user.location}</p> 
                            </div>
                        </div>
                    </div>
                </div>

                {/*User info-right*/}
                <div className={styles.profilebox}>
                    {/*User Tech Stack*/}
                    <div className={styles.profilebox_section}>
                      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                        <p className={styles.title}>TECH STACK</p>
                      </div>
                        <div className={styles.line}></div>
                        <div className={styles.stack} style={{marginBottom:"60px"}}>
                              {user.techStacks?.map((item, key)=>{
                              let imgSrc;
                              try{
                                imgSrc = images(`./${item}.png`);
                              }catch (e) {
                                imgSrc = '';
                              }
                              return(
                                <div key={key} className={`${styles.stack_btn}`} >
                                  <img alt="" src={imgSrc} style={{width:"23px", height:"23px", marginRight:"5px"}}/>
                                      {item==="C_SHARP" ? "C#" : item==="C_PLUS" ? "C+" : item==="HTML" ? "HTML5" : item==="CSS" ? "CSS3" : item}
                                </div>
                              ) })}
                            
                        </div>
                    </div>

                    {/*User BIO*/}
                    <div className={styles.profilebox_section} style={{height:"170px", marginBottom:"30px"}}>
                        <p className={styles.title}>BIO</p>
                        <div className={styles.line}></div>
                        <p className={styles.inputbox} style={{width: "100%", height:"100px", padding:"3px"}}>{user.bio}</p>
                    </div>

                    {/*User PORTPOLIO*/}
                    <div className={styles.profilebox_section} style={{height:"160px", marginBottom:"30px"}}>
                        <p className={styles.title}>PORTFOLIO</p>
                        <div className={styles.line}></div>
                        <div style={{display:"flex", gap:"10px"}}>
                            <p style={{display:"flex", alignItems:"center", fontWeight:"500", marginLeft:"3px"}}>GitHub</p>
                            <p style={{display:"flex", alignItems:"center", marginBottom:"3px"}} >|</p>
                            <div style={{display:"flex",alignItems:"center"}}>
                                <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden"}}> 
                                  <img src={git} alt="" style={{width:"20px", height:"20px"}}/> 
                                  <p style={{display:"flex", alignItems:"center", marginBottom:"3px"}}> {GitUser(user.sns)} </p>
                                  </div>
                            </div>
                        </div>
                    </div>

                    {/*User Team*/}
                    <div className={styles.profilebox_section} style={{marginBottom:"30px"}}>
                        <p className={styles.title}>TEAM</p>
                        <div className={styles.line}></div>
                        <div style={{display:"flex", flexWrap: "wrap"}}>
                        {user.teams?.map((item, key)=>
                            <div key={key} style={{display:"flex", alignItems:"center", width: "50%"}}>
                                {item.imageUrl.startsWith('hsl(')
                                 ? <div style={{backgroundColor: item.imageUrl, width: "50px", minWidth:"50px", height:"50px", borderRadius: "12px", marginBottom:"12px"}}></div>
                                 : item.imageUrl.startsWith('http') 
                                 ? <img src={item.imageUrl} alt="미리보기" style={{width: "50px", minWidth:"50px", height:"50px", borderRadius: "12px", marginBottom:"12px"}}></img> 
                                 : <div style={{backgroundColor: getbgColor(), width: "50px", minWidth:"50px", height:"50px", borderRadius: "12px", marginBottom:"12px"}}></div>}
                                <p style={{marginBottom:"12.5px", marginLeft:"15px", maxwidth:"200px", height:"25px", color:"rgba(0,0,0,0.7)", fontWeight:"500",overflow:"hidden",whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
                                  {item.teamName}</p>
                            </div>)}
                            </div>
                    </div>
                </div>

            </div>
        </div>
    );
} export default Userpage;