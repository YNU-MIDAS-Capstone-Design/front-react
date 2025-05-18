import { useState, useEffect } from "react"
import Sidebar from "../../components/template/Sidebar"
import styles from "../../style/Mypage.module.css"
import profile from "../../assets/profile.jpg"
import git from "../../assets/github-brands.svg"
import axios from 'axios'

function Mypage(){
    const[click, setclick] = useState(0); //position list click state 관리
    const[stack_click, setstack_click] = useState(0); //position list click state 관리
    const[edit, setedit]=useState(0); //Edit profile
    const[user, setuser] = useState([]); //user info 관리
    const [selectedLocation, setSelectedLocation] = useState(user.location); //user location
    const stack =[

      //백엔드
      "Nodejs",
      "Java",
      "Spring",
      "Express",
      "Django",
      "Flask",
      "NestJS",
      "MySQL",
      "MongoDB",
      "Docker",
      "AWS",
      
      //프론트
      "JavaScript",
      "HTML",
      "CSS",
      "React",
      "Vue",
      
      //디자이너
      "Figma",
      "Illustrator",
      "Adobe_XD",
      
      //모바일 앱
      "Android",
      "Kotlin",
      "Swift",
      "Flutter",
      
      //인공지능
      "Python",
      "AI",
      "BigData",
      
      //게임+기타
      "Unity",
      "UnrealEngine",
      "C_SHARP",  //C#
      "C_PLUS",   //C++
      "IoT",
      "security"
    ];
    const locate=['경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도'];

    const images = require.context('../../assets/stack', false, /\.png$/);


    useEffect(() => {
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
            setuser(res.data);
            setSelectedLocation(res.data.location);
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
      }, [edit]);

    const modifyUser = async (e) => {
        e.preventDefault();
        console.log(typeof(user.techStacks));
        const stack = typeof user.techStacks === 'string'
        ? user.techStacks.split(',').map(item => item.trim()).filter(Boolean)
        : Array.isArray(user.techStacks)
        ? user.techStacks.map(item => item.trim()).filter(Boolean)
        : [];
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn("로그인을 먼저 하세요.");
          return;
        }
        const updatedUser = { ...user, location: selectedLocation, techStacks: stack}; //user location 반영
        console.log(updatedUser);
        try {
          const res = await axios.patch('/api/users/me', updatedUser,
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setedit(()=>!edit);
          console.log(res.data);
        } catch (err) {
          if (err.response) {
            setedit(()=>!edit)
            console.error("서버 응답 에러:", err.response.status, err.response.data);
          } else {
            setedit(()=>!edit)
            console.error("요청 자체 실패:", err.message);
          }
        }
      };

    const [uploadImgUrl, setUploadImgUrl] = useState("");

    const onchangeImageUpload = (e)=> {
        const {files} = e.target;
        const uploadFile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = ()=> {
        setUploadImgUrl(reader.result);
    } }

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

    const handlebgColor=(Team_name)=>{
        const savedbgColor = localStorage.getItem(`bgColor-${Team_name}`);
        if(!savedbgColor) {
            const newbgColor = getbgColor();
            localStorage.setItem(`bgColor-${Team_name}`, newbgColor);
        }
        return localStorage.getItem(`bgColor-${Team_name}`);
    }

    const GitUser=(gitUrl)=>{
      if (typeof gitUrl === 'string') {
        const match = gitUrl.match(/\/([^\/]+)$/);
        const result = match ? match[1] : null;
        return(result);
      } else {
        console.warn('URL이 문자열이 아닙니다:', gitUrl);
        return("");
      }
    }

    const GitUrl=(Gituser)=>{
      const url = "https://github.com/";
      const result = url + Gituser;
      return(result);
    }

    return(
        <div className={styles.wrapper}>
            {/*Sidebar*/}
            <Sidebar title="MY PAGE" dataarray={["MY PROFILE", "내 활동"]} link={["/Mypage", "/Likedpage"]}></Sidebar>
            
            {/*User info*/}
            <form onSubmit={(e)=>{setstack_click(0); modifyUser(e)}} className={styles.innerbox}>

                {/*User info-left*/}
                <div className={styles.profilebox}>

                    {/*User img, name*/}
                    <div className={styles.profileImgbox}>
                        <img className={styles.profileImg} src = {uploadImgUrl=="" ? profile : uploadImgUrl} alt="profile"></img>
                        <input type="file" accept="image/*" onChange={onchangeImageUpload} style={edit==0 ? {visibility:"hidden"} : {visibility:"visible"}}></input>
                        <i className={`${edit==0 ? "" : "fas fa-pen fa-2x"}`}></i>
                    </div>

                    <p className={styles.nickname}>{user.nickname}</p>

                    {/*User info edit button*/}
                    {edit==0 ? 
                    <div onClick={()=>{setedit(()=>!edit)}} className={styles.profileEdit} >Edit Profile</div>:
                    <button type="submit" className={`${styles.profileEdit} ${styles.profileEdit_save}`} >Save</button>}

                    <div className={styles.profilebox_left}>
                        <div className={styles.profilebox_left_section}>
                            <div style={{display:"flex", gap: "14px"}}>
                                <p style={{fontWeight:"500"}}>TEAM</p>
                                <p>{(user.teams?.length)}</p>
                            </div>
                            <div className={styles.Imgsection}>
                                {user.teams?.map((item, key)=><div key={key} className={styles.TeamImg} style={{backgroundColor: handlebgColor(item)}}></div>)}
                            </div>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Email</p>
                            <p>{user.email}</p>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>GitHub</p>
                            <div style={{display:"flex",alignItems:"center"}}>
                                {edit==0? <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden"}}> 
                                  <img src={git} style={{width:"20px", height:"20px"}}/> {GitUser(user.sns)}</div> : 
                                  <> 
                                    <input style={{padding:"6px", overflow:"hidden", width:"55%", background: 'transparent', 
                                    color:"rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "8px 0 0 8px"}} 
                                    type="text" value="github.com/" readOnly/>
                                    <input className={styles.inputbox_click}
                                    style={{padding:"6px", overflow:"hidden", width: "45%", borderRadius: "0 8px 8px 0"}} type="text" value={GitUser(user.sns)} 
                                    onChange={(e) => setuser({ ...user, sns: GitUrl(e.target.value) })} /> 
                                  </>}
                            </div>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Locate</p>
                            <div style={{display:"flex",alignItems:"center", gap: "3px"}}>
                                {edit==0? <p className={styles.inputbox} style={{padding:"6px", paddingLeft:"0", overflow:"hidden", height:"22.4px"}}>{user.location}</p> : 
                                <div>
                                  <div onClick={()=>{setclick(!click);}} className={`${styles.loc_drop} ${styles.Dropdown} `} style={click ? {color: "rgba(0,0,0,0.6)", border: "2px solid rgb(73, 119, 236)", cursor: "pointer"} : {color: "rgba(0,0,0,0.6)", cursor: "pointer"}}>
                                      <div ></div>
                                      {selectedLocation == null ? `시/도` : `${selectedLocation}`}
                                      <i className={click ? "fas fa-caret-down xl" : "fas fa-caret-up xl"} ></i>
                                  </div>
                                  <ul className={`${styles.loc_ul} ${click==0 ? styles.hidden : `${styles.Dropdown} ${styles.visible}`}`}>
                                    {locate.map((item, key)=> 
                                    <li key={key} className={styles.DropList} onClick={()=>{setclick(!click); setSelectedLocation(item); }}>{item}</li> )}
                                  </ul>
                                </div> }
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
                        <div onClick={()=>{setstack_click(!stack_click)}} style={{width:"50px", height:"100%", cursor:"pointer", textAlign:"center"}}>
                          <i className={!edit ? "" : stack_click ? "fas fa-caret-down" : "fas fa-caret-up"} style={{fontSize:"1.2rem"}}></i>
                        </div>
                      </div>
                        <div className={styles.line}></div>
                        <div className={styles.stack}>
                              {user.techStacks?.map((item, key)=>{
                              let imgSrc;
                              try{
                                imgSrc = images(`./${item}.png`);
                              }catch (e) {
                                imgSrc = '';
                              }
                              return(
                                <div key={key} className={`${styles.stack_btn}`} 
                                  onClick={()=>{
                                    if(edit) {
                                      const updatedStacks = user.techStacks.filter(i => i !== item);
                                      setuser({...user, techStacks: updatedStacks});
                                    }
                                  } }>
                                  {edit ? <p style={{marginLeft: "-3px",marginRight:"4px", fontSize:"1rem", opacity:"0.8"}}>X</p> : ""}
                                  <img alt="" src={imgSrc} style={{width:"23px", height:"23px", marginRight:"5px"}}/>
                                      {item==="C_SHARP" ? "C#" : item==="C_PLUS" ? "C+" : item==="HTML" ? "HTML5" : item==="CSS" ? "CSS3" : item}
                                </div>
                              ) })}
                            
                        </div>
                       
                        <div className={edit && stack_click ? `${styles.MiddleBox}` : `${styles.MiddleBox} ${styles.hidden}`}>
                                        {stack
                                        .filter(item => !user.techStacks?.includes(item))
                                        .map((item, key)=>{
                                            let imgSrc;
                                            try{
                                              imgSrc = images(`./${item}.png`);
                                            }catch (e) {
                                              imgSrc = '';
                                            }
                                            return <div key={key}
                                            onClick={()=>{
                                              if(edit){
                                                const updatedStacks = [...(user.techStacks || []), item];
                                                setuser({...user, techStacks: updatedStacks});
                                              }
                                            }}
                                            className={`${styles.Button}`}>
                                            <img alt="" src={imgSrc} style={{width:"23px", height:"23px", marginLeft:"-5px", marginRight:"5px"}}/>
                                            {item==="C_SHARP" ? "C#" : item==="C_PLUS" ? "C+" : item==="HTML" ? "HTML5" : item==="CSS" ? "CSS3" : item}</div>}  )}
                        </div>
                        

                    {/*User Styles*/}
                    </div>
                    <div className={styles.profilebox_section} style={{height:"170px", marginBottom:"30px"}}>
                        <p className={styles.title}>BIO</p>
                        <div className={styles.line}></div>
                        {edit==0?<p className={styles.inputbox} style={{width: "100%", height:"100px", padding:"3px"}}>{user.bio}</p> : 
                        <textarea className={styles.inputbox_click} style={{width: "100%", height:"100px", padding:"3px 6px"}}
                        value={user.bio} onChange={(e) => setuser({ ...user, bio: e.target.value })}></textarea>}
                    </div>

                    {/*User Profile*/}
                    <div className={styles.profilebox_section} style={{marginBottom:"30px"}}>
                        <p className={styles.title}>TEAM</p>
                        <div className={styles.line}></div>
                        <div style={{display:"flex", flexWrap: "wrap"}}>
                        {user.teams?.map((item, key)=>
                            <div style={{display:"flex", alignItems:"center", width: "50%"}}>
                                <div key={key} style={{backgroundColor: handlebgColor(item), width: "50px", minWidth:"50px", height:"50px", borderRadius: "12px", marginBottom:"12px"}}></div>
                                <p style={{marginBottom:"12.5px", marginLeft:"15px", maxwidth:"200px", height:"25px", color:"rgba(0,0,0,0.7)", fontWeight:"500",overflow:"hidden",whiteSpace:"nowrap", textOverflow:"ellipsis"}}>{item}</p>
                            </div>)}
                            </div>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default Mypage;