import styles from "../style/Register.module.css";
import naverLogo from "../assets/naver.png";
import kakaoLogo from "../assets/kakao.png";
import googleLogo from "../assets/google.png";

const Register = () => {
    return(
        <>
        <div className={styles.wrapper}>
            <div style={{fontWeight: "bold", fontSize: "36px"}}>회원가입</div>
            <div className={styles.registerBox}>
                <div className={styles.infoBox}>
                    <div className={styles.infoItem }>Name</div>
                    <div className={styles.infoItem }>Email or PhoneNumber</div>
                    <div className={styles.infoItem }>Password</div>
                </div>
                <button className={styles.create}>Create Account</button>
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