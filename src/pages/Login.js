import styles from "../style/Login.module.css";
import naverLogo from "../assets/naver.png";
import kakaoLogo from "../assets/kakao.png";
import googleLogo from "../assets/google.png";

const Login = () => {
    return(
        <>
        <div className={styles.wrapper}>
            <div style={{fontWeight: "bold", fontSize: "36px"}}>로그인</div>
            <div className={styles.loginBox}>
                <div className={styles.infoBox}>
                    <div className={styles.infoItem }>Name</div>
                    <div className={styles.infoItem }>Password</div>
                </div>
                <button className={styles.loginBtn}>Login</button>
                <div className={styles.socialLogin}>
                    login with Social Account
                    <div className={styles.logoBox}>
                        <img src = {naverLogo} alt="Naver Logo" className={styles.logo}/>
                        <img src = {kakaoLogo} alt="kakao Logo" className={styles.logo}/>
                        <img src = {googleLogo} alt="google Logo" className={styles.logo}/>
                    </div>
                    Forgot your password
                    <a href="/login" className={styles.loginLink}>Find Password</a>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login