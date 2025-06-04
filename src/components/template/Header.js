import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Devmatch from "../../assets/DevMatch.png"

const Header = () => {
  const { token, logoutAuth } = useAuth();
  
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo}>
          <img src={Devmatch} style={{width: "130px", height:"58px", marginTop : "10px"}}></img>
        </Link>
        <div className={styles.items}>
          <Link to="/project" className={styles.noUnderline}>
            Project
          </Link>
          <Link to="/team" className={styles.noUnderline}>
            Community
          </Link>
          <Link to="/mypage" className={styles.noUnderline}>
            Mypage
          </Link>
          {token? (<div className={styles.noUnderline} onClick={logoutAuth}>Logout</div>) 
          :(<>
          <Link to="/login" className={styles.noUnderline}>
            Login
          </Link>
          <Link to="/register" className={styles.noUnderline}>
            Join
          </Link>
          </>)
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
