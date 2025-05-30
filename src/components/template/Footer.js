import styles from "./Footer.module.css"
import CopyrightIcon from '@mui/icons-material/Copyright';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () =>{
    return(
        <>
        <div className={styles.divider}/>
        <div style={{width:"100%", backgroundColor:"rgba(0,0,0,0.02)"}}>
        <div className={styles.wrapper}>
            <div className={styles.copyRight}>
                <CopyrightIcon/>
                2025 Estatery. | 개인정보 처리방침 | 이용 약관
            </div>
            <div className = {styles.social}>
                <FacebookIcon/>
                <TwitterIcon/>
                <InstagramIcon/>
            </div>
        </div>
        </div>
        </>
    )
}

export default Footer