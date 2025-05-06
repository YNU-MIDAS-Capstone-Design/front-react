import styles from "../style/Register.module.css";
import naverLogo from "../assets/naver.png";
import kakaoLogo from "../assets/kakao.png";
import googleLogo from "../assets/google.png";
import axios from "axios";
import React , { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    password: "",
    bio: null,
    location: null,
    sns: null,
    techStacks: [
      "CSS",
      "HTML"
    ]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const register = () =>{
    axios
      .post('/api/auth/signup',form,{
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((res)=>{
        alert("회원가입 되었습니다!");
        navigate("/login");
      })
      .catch((err)=>{
        if(err.response?.status === 400){
          alert("이메일 형식 오류 입입니다.")
        }
        else if (err.response?.status === 409) {
          const errorCode = err.response.data?.code;
          if (errorCode === "dn") {
            setErrorMessage("이미 사용 중인 닉네임입니다.");
          } else if (errorCode === "de") {
            setErrorMessage("이미 사용 중인 이메일입니다.");
          } else {
            setErrorMessage("중복된 정보가 있습니다.");
          }
        } else {
          setErrorMessage("서버 오류가 발생했습니다.");
        }
      })
  }
  
  return(
      <>
      <div className={styles.wrapper}>
          <div style={{fontWeight: "bold", fontSize: "36px"}}>회원가입</div>
          <div className={styles.registerBox}>
              <div className={styles.infoBox}>
                  <input type = "text" name="nickname" value={form.nickname} placeholder="Enter your name" className={styles.infoItem} onChange={handleChange}/>
                  <input type = "email" name = "email" value={form.email} placeholder = "Email or PhoneNumber" className={styles.infoItem} onChange={handleChange}></input>
                  <input type="password" name="password" value={form.password} placeholder = "password" className={styles.infoItem} onChange={handleChange}></input>
              </div>
              <button className={styles.create} onClick = {(e) => register(e)}>Create Account</button>
              {errorMessage && (
                <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
              )}
              <div className={styles.socialLogin}>
                  Sign up with Social Account
                  <div className={styles.logoBox}>
                      <img src = {naverLogo} alt="Naver Logo" className={styles.logo}/>
                      <img src = {kakaoLogo} alt="kakao Logo" className={styles.logo}/>
                      <img src = {googleLogo} alt="google Logo" className={styles.logo}/>
                  </div>
                  Already have account?
                  <a href="/login" className={styles.loginLink}>Log in</a>
              </div>
          </div>
      </div>
      </>
  )
}

export default Register