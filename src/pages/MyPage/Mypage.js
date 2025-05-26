import { useState, useEffect, useRef } from "react"
import Sidebar from "../../components/template/Sidebar"
import styles from "../../style/Mypage.module.css"
import profile from "../../assets/profile.jpg"
import git from "../../assets/github-brands.svg"
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import {job, stack, locate} from '../enum.js'

function Mypage(){
    /* ───────────────────────────────────────────── state ───────────────────────────────────────────── */
    const[loc_click, setloc_click] = useState(0); //position list click state 관리
    const[stack_click, setstack_click] = useState(0); //stack list click state 관리
    const[job_click, setjob_click] = useState(0); //job list click state 관리
    const[mbti_click, setmbti_click] = useState(0); //job list click state 관리
    const[img_click, setimg_click] = useState(0); //img list click state 관리
    const[edit, setedit]=useState(0); //Edit profile
    const[user, setuser] = useState({}); //user info 관리
    const [uploadImgUrl, setUploadImgUrl] = useState(""); //profile img
    const [selectedFile, setSelectedFile] = useState(null); // 실제 img
    const [selectedLocation, setSelectedLocation] = useState(user.location); //user location
    const [selectedJob, setSelectedJob] = useState(user.job);
    const [selectedmbti, setSelectedmbti] = useState(user.mbti);

    /* ───────────────────────────────────────────── enum & const ───────────────────────────────────────────── */
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
            const res = await axios.get('/api/users/me', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setuser(res.data);
            setSelectedLocation(res.data.location);
            setSelectedJob(res.data.job);
            setSelectedmbti(res.data.mbti);
            setUploadImgUrl(res.data.profileImageUrl ?? ""); 
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

    /*✅ 사용자 정보 Patch, 이미지 PUT */
    const modifyUser = async (e) => {
        e.preventDefault();
        const stack = Array.isArray(user?.techStacks)
        ? user.techStacks.map(item => item.trim()).filter(Boolean)
        : typeof user?.techStacks === 'string'
          ? user.techStacks.split(',').map(item => item.trim()).filter(Boolean)
          : [];
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn("로그인을 먼저 하세요.");
          return;
        }
        const updatedUser = { ...user, location: selectedLocation, techStacks: stack, job: selectedJob, mbti: selectedmbti};
        try {
          const res = await axios.patch('/api/users/me', updatedUser,
            {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (selectedFile) {
            const form = new FormData();
            form.append("imageFile", selectedFile);
            try {
              const imgRes = await axios.put("api/users/me/image", form, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type" : "multipart/form-data",
                },
              });
              setUploadImgUrl(imgRes.data.data.imageUrl);
              setSelectedFile(null);
            } catch(err){
              if (err.response) {
                console.error("서버 응답 에러:", err.response.status, err.response.data);
              } else {
                console.error("요청 자체 실패:", err.message);
              }
            }
            
          }

          setedit(()=>!edit);
          console.log(res.data);

        } catch (err) {
          if (err.response) {
            console.error("서버 응답 에러:", err.response.status, err.response.data);
          } else {
            console.error("요청 자체 실패:", err.message);
          }
        }
      };

    /*✅ 이미지 Delete */
    const handleImageDelete = async (e) => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }

      try {
        const res = await axios.delete('/api/users/me/image', 
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log(res.data);
        setSelectedFile(null);
        setUploadImgUrl("");
        setuser({ ...user, profileImageUrl: null });
        setedit(()=>!edit);
        setimg_click(!img_click);

      } catch (err) {
        if (err.response) {
          console.error("서버 응답 에러:", err.response.status, err.response.data);
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /* ✅ 이미지 로드 */
    const onchangeImageUpload = (e)=> {
        const {files} = e.target;
        const uploadFile = files[0];
        if (!uploadFile) return;
        setSelectedFile(uploadFile);

        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = ()=> {
          setUploadImgUrl(reader.result);
          setimg_click(!img_click); };
      }

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

    const GitUrl=(Gituser)=>{
      const url = "https://github.com/";
      const result = url + Gituser;
      return(result);
    }

    /* ✅ MBTI */
    const getOppositeMBTI = () => {
      if (selectedmbti===null) return '';

      const oppositeMap = {
        E: 'I',
        I: 'E',
        N: 'S',
        S: 'N',
        T: 'F',
        F: 'T',
        J: 'P',
        P: 'J',
      };

      return selectedmbti
        .toUpperCase()
        .split('')
        .map(char => oppositeMap[char] || char)
        .join('');
    };

    const handleMbtiToggle = (selected) => {
      const mbtiIndexMap = {
        E: 0,
        I: 0,
        N: 1,
        S: 1,
        T: 2,
        F: 2,
        J: 3,
        P: 3,
      };

      const index = mbtiIndexMap[selected];
      const updatedMbti = selectedmbti
        .split('')
        .map((char, i) => (i === index ? selected : char))
        .join('');

      setSelectedmbti(updatedMbti);
    };
    
    const inputRef = useRef(null);
    return(
        <div className={styles.wrapper}>
            {/*Sidebar*/}
            <Sidebar title="MY PAGE" dataarray={["MY PROFILE", "내 활동"]} link={["/Mypage", "/Likedpage"]}></Sidebar>
            
            {/*User info*/}
            <form onSubmit={(e)=>{setstack_click(0); setjob_click(0); setloc_click(0); setimg_click(0); setmbti_click(0); modifyUser(e)}} className={styles.innerbox}>

                {/*User info-left*/}
                <div className={styles.profilebox}>

                    {/*User img, name*/}
                    <div className={styles.profileImgbox}>
                        <img className={styles.profileImg} src = {uploadImgUrl || user.profileImageUrl || profile} alt="profile"></img>
                        <input type="file" accept="image/*" ref={inputRef} onChange={onchangeImageUpload} style={{display:"none"}}></input>
                        <i onClick={()=>setimg_click(!img_click)} className={`${!edit ? "" : "fas fa-pen fa-2x"}`}></i>
                    
                      {!img_click ? "" : user.profileImageUrl ? 
                          <div className={styles.imgbutton_pos} style={{color:"rgba(0,0,0,0.6)", border:"1px solid rgba(0,0,0,0.2)", borderRadius: "6px"}}> 
                            <div onClick={handleImageDelete} className={styles.img_btn} style={{borderBottom: "1px solid rgba(0,0,0,0.2)"}}>삭제</div>
                            <div onClick={() => inputRef.current.click()} className={styles.img_btn}>변경</div>
                          </div>
                         : 
                          <div className={styles.imgbutton_pos}>
                            <div onClick={() => inputRef.current.click()} className={styles.img_btn} 
                            style={{color:"rgba(0,0,0,0.6)", border:"1px solid rgba(0,0,0,0.2)", borderRadius: "6px"}}>업로드</div>
                            <div style={{height:"30px"}}></div>
                          </div>}
                    </div>
                    <p className={styles.nickname}>{user.nickname}</p>

                    {/*User info edit button*/}
                    {!edit ? 
                    <div onClick={()=>{setedit(()=>!edit)}} className={styles.profileEdit} >Edit Profile</div>:
                    <button type="submit" className={`${styles.profileEdit} ${styles.profileEdit_save}`} >Save</button>}

                    {/*User info-right*/}
                    <div className={styles.profilebox_left}>
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
                            <p style={{fontWeight:"500", display:"flex", justifyContent:"space-between"}}>MBTI
                              {edit ? <i className={mbti_click ? "fas fa-caret-down xl" : "fas fa-caret-up xl"} onClick={()=>setmbti_click(!mbti_click)} 
                                    style={{marginLeft:"2px", cursor:"pointer", marginTop:"2.5px", marginRight:"5px", ...(mbti_click ? {color:"rgb(73, 119, 236)"} : {opacity:"0.6"}) }}></i> : ""}
                            </p>
                            <div style={{display:"flex", alignItems:"center"}}>
                                {!edit ? <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden"}}> 
                                  {user.mbti}</div> : 
                                  <div style={{display:"flex", flexDirection:"column", width:"100%", gap:"6px"}}>
                                    <div style={{display:"flex", width:"100%", gap:"5px", justifyContent: "center", alignContent: "center"}}>
                                      {selectedmbti && Array.from(selectedmbti).map((char, index)=>{
                                      return (
                                        <div key={index} className={styles.mbti_btn} onClick={()=>setmbti_click(1)}>{char}</div>
                                      )
                                    })}</div>
                                    {mbti_click ? <div style={{display:"flex", width:"100%", gap:"5px", justifyContent: "center", alignContent: "center"}}>
                                      {Array.from(getOppositeMBTI()).map((char, index)=>{
                                      return (
                                        <div key={index} className={styles.mbti_btn_unset} onClick={()=>handleMbtiToggle(char)}>{char}</div>
                                      )
                                    })}</div>:""}
                                    </div>
                                  }
                            </div>
                        </div>

                        {/*User Job*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Job</p>
                            <div style={{display:"flex",alignItems:"center"}}>
                                {!edit ? <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden", margin: "0"}}> 
                                  {user.job}</div> : 
                                  <div style={{marginBottom:"-20px"}}>
                                    <div onClick={()=>{setjob_click(!job_click);}} className={`${styles.loc_drop} ${styles.Dropdown} `} style={job_click ? {color: "rgba(0,0,0,0.6)", border: "2px solid rgb(73, 119, 236)", cursor: "pointer"} : {color: "rgba(0,0,0,0.6)", cursor: "pointer"}}>
                                        <div ></div>
                                        {selectedJob === null ? `직업` : `${selectedJob}`}
                                        <i className={job_click ? "fas fa-caret-down xl" : "fas fa-caret-up xl"} style={{...(job_click ? {color:"rgb(73, 119, 236)"} : {})}}></i>
                                    </div>
                                    <ul className={`${styles.loc_ul} ${!job_click ? styles.hidden : `${styles.Dropdown} ${styles.visible}`}`}>
                                      {job.map((item, key)=> 
                                      <li key={key} className={styles.DropList} onClick={()=>{setjob_click(!job_click); setSelectedJob(item); }}>{item}</li> )}
                                    </ul>
                                  </div>}
                            </div>
                        </div>

                        {/*User Locate*/}
                        <div className={styles.profilebox_left_section}>
                            <p style={{fontWeight:"500"}}>Locate</p>
                            <div style={{display:"flex",alignItems:"center", gap: "3px"}}>
                                {!edit ? <p className={styles.inputbox} style={{padding:"6px", paddingLeft:"0", overflow:"hidden", height:"22.4px"}}>{user.location}</p> 
                                : <div style={{marginBottom:"-20px"}}>
                                    <div onClick={()=>{setloc_click(!loc_click);}} className={`${styles.loc_drop} ${styles.Dropdown} `} style={loc_click ? {color: "rgba(0,0,0,0.6)", border: "2px solid rgb(73, 119, 236)", cursor: "pointer"} : {color: "rgba(0,0,0,0.6)", cursor: "pointer"}}>
                                        <div ></div>
                                        {selectedLocation === null ? `시/도` : `${selectedLocation}`}
                                        <i className={loc_click ? "fas fa-caret-down xl" : "fas fa-caret-up xl"} style={{...(loc_click ? {color:"rgb(73, 119, 236)"} : {})}}></i>
                                    </div>
                                    <ul className={`${styles.loc_ul} ${!loc_click ? styles.hidden : `${styles.Dropdown} ${styles.visible}`}`}>
                                      {locate.map((item, key)=> 
                                      <li key={key} className={styles.DropList} onClick={()=>{setloc_click(!loc_click); setSelectedLocation(item); }}>{item}</li> )}
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
                                  {edit ?
                                  <FontAwesomeIcon icon={faXmark} style={{marginLeft: "-3px",marginRight:"4px", fontSize:"0.9rem", opacity:"0.8"}}/> 
                                   : ""}
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
                    </div>

                    {/*User BIO*/}
                    <div className={styles.profilebox_section} style={{height:"170px", marginBottom:"30px"}}>
                        <p className={styles.title}>BIO</p>
                        <div className={styles.line}></div>
                        {!edit ? <p className={styles.inputbox} style={{width: "100%", height:"100px", padding:"3px"}}>{user.bio}</p> : 
                        <textarea className={styles.inputbox_click} style={{width: "100%", height:"100px", padding:"3px 6px"}}
                        value={user.bio} onChange={(e) => setuser({ ...user, bio: e.target.value })}></textarea>}
                    </div>

                    {/*User PORTPOLIO*/}
                    <div className={styles.profilebox_section} style={{height:"160px", marginBottom:"30px"}}>
                        <p className={styles.title}>PORTFOLIO</p>
                        <div className={styles.line}></div>
                        <div style={{display:"flex", gap:"10px"}}>
                            <p style={{display:"flex", alignItems:"center", fontWeight:"500", marginLeft:"3px"}}>GitHub</p>
                            <p style={{display:"flex", alignItems:"center", marginBottom:"3px"}} >|</p>
                            <div style={{display:"flex",alignItems:"center"}}>
                                {!edit ? <div className={styles.inputbox} style={{display:"flex", alignItems:"center", gap:"6px", padding:"6px", paddingLeft:"0", overflow:"hidden"}}> 
                                  <img src={git} alt="" style={{width:"20px", height:"20px"}}/> 
                                  <p style={{display:"flex", alignItems:"center", marginBottom:"3px"}}> {GitUser(user.sns)} </p>
                                  </div> : 
                                  <> 
                                    <input style={{padding:"6px", overflow:"hidden", width:"40%", background: 'transparent', 
                                    color:"rgba(0,0,0,0.6)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "8px 0 0 8px"}} 
                                    type="text" value="github.com/" readOnly/>
                                    <input className={styles.inputbox_click}
                                    style={{padding:"6px", overflow:"hidden", width: "60%", borderRadius: "0 8px 8px 0"}} type="text" value={GitUser(user.sns)} 
                                    onChange={(e) => setuser({ ...user, sns: GitUrl(e.target.value) })} /> 
                                  </>}
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

            </form>
        </div>
    )
}

export default Mypage;