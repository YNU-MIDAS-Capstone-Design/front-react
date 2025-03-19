import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <Link to="/" className={styles.logo}>
          Dev Match
        </Link>
        <div className={styles.items}>
          <Link to="/project" className={styles.noUnderline}>
            Project
          </Link>
          <Link to="/community/teamlist" className={styles.noUnderline}>
            Community
          </Link>
          <Link to="/login" className={styles.noUnderline}>
            Login
          </Link>
          <Link to="/register" className={styles.noUnderline}>
            Join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
