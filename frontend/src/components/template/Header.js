import styles from "./Header.module.css"
import mapDisplay from "../../assets/mapDisplay.png"
import MenuIcon from '@mui/icons-material/Menu';

const Header = () =>{
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div className={styles.logo}>Dev Match</div>
                <div className={styles.items}>
                    <div>Project</div>
                    <div>Community</div>
                    <div>Login</div>
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