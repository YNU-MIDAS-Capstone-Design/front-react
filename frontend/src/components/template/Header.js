import styles from "./Header.module.css"
import mapDisplay from "../../assets/mapDisplay.png"
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from "react-router-dom";

const Header = () =>{
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
            <Link to="/" className={styles.logo}>
            Dev Match
            </Link>
                <div className={styles.items}>
                    <div>Project</div>
                    <Link to="/community" className={styles.link}>Community</Link>
                    <Link to="/login" className={styles.link}>Login</Link>
                    <div>Join</div>
                </div>
            </div>
            <div className={styles.bottom}>
                <div className = {styles.circle}>
                    <img src = {mapDisplay} style={{width: "40.59px", height: "58px"}}/>
                </div>
                <div className = {styles.ellipse}>
                    <MenuIcon/>
                    <div>기술 검색</div>
                </div>
                <div className={styles.ellipse} style={{width:"950px"}}>
                    프로젝트 검색
                </div>
            </div>
        </div>
    )
}

export default Header