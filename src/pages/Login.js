import styles from "../style/Login.module.css";
import naverLogo from "../assets/naver.png";
import kakaoLogo from "../assets/kakao.png";
import googleLogo from "../assets/google.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
          alert("이미 로그인되어 있습니다.");
          navigate("/"); // 홈으로 리디렉션
        }
    }, []);
      
    const [info, setInfo] = useState ({
        nickname:"",
        password:"" 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({
          ...prev,
          [name]: value,
        }));
    };

    const login =()=>{
        console.log(info);
        axios.post("/api/auth/login",info,{
            headers: {
              'Content-Type': 'application/json'
            }   
          })
          .then((res=>{
            const token = res.data.token;
            localStorage.setItem("accessToken", token);
            alert("로그인 되었습니다");
            navigate("/");
          }))
          .catch((err)=>{
            if (err.response?.status === 400){
                setErrorMessage("로그인 시간이 만료되었습니다. 다시 로그인해주세요.");
            }
            else if (err.response?.status === 401) {
                setErrorMessage("로그인 정보가 잘못되었습니다. 다시 시도해주세요.");
              }
            else{
                setErrorMessage("죄송합니다. 다시 시도해주세요.")
            }
          })
    }

    return(
        <>
        <div className={styles.wrapper}>
            <div style={{fontWeight: "bold", fontSize: "36px"}}>로그인</div>
            <div className={styles.loginBox}>
                <div className={styles.infoBox}>
                    <input type="text" name="nickname" value={info.nickname} className={styles.infoItem} placeholder="NickName" onChange={handleChange}/>
                    <input type="password" name="password" value={info.password} className={styles.infoItem}placeholder="Password" onChange={handleChange}/>
                </div>
                <button className={styles.loginBtn} onClick={(e)=>(login(e))}>Login</button>
                {errorMessage && (
                    <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
                )}
                <div className={styles.socialLogin}>
                    login with Social Account
                    <div className={styles.logoBox}>
                        <img src = {naverLogo} alt="Naver Logo" className={styles.logo}/>
                        <img src = {kakaoLogo} alt="kakao Logo" className={styles.logo}/>
                        <img src = {googleLogo} alt="google Logo" className={styles.logo}/>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login