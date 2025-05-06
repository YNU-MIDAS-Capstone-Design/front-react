import Sidebar from "../components/template/Sidebar"
import styles from "../style/Mypage.module.css"
import profile from "../assets/profile.jpg"
import insta from "../assets/Instagram_icon.png"
import locate from "../assets/locationdot.png"

function Mypage(){

    return(
        <div className={styles.wrapper}>
            <Sidebar title="MY PAGE" dataarray={["MY PROFILE", "좋아요 한 글", "작성한 글"]}></Sidebar>
            <div className={styles.innerbox}>
                <div className={styles.profilebox}>
                    <img className={styles.profileImg} src = {profile} alt="profile"></img>
                    <p className={styles.nickname}>USER NAME</p>
                    <div className={styles.profileEdit}>
                        Edit Profile</div>
                    <div className={styles.profilebox_left}>
                        <div className={styles.profilebox_left_section} style={{display:"flex", gap: "20px"}}>
                            <div style={{display:"flex", gap: "20px"}}>
                                <p>Follow</p>
                                <p>10</p>
                            </div>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <div style={{display:"flex", gap: "28px"}}>
                                <p>TEAM</p>
                                <p>2</p>
                            </div>
                            <div className={styles.Imgsection}>
                                <div className={styles.TeamImg}></div>
                                <div className={styles.TeamImg}></div>
                            </div>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p>E-Mail</p>
                            <p>email@google.com</p>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p>Social</p>
                            <div style={{display:"flex",alignItems:"center", gap: "3px"}}>
                                <img className={styles.PinImg} src={insta} alt="insta"></img>
                                <p>@insta_account</p>
                            </div>
                        </div>
                        <div className={styles.profilebox_left_section}>
                            <p>Locate</p>
                            <div style={{display:"flex",alignItems:"center", gap: "3px"}}>
                                <img className={styles.PinImg} src={locate} alt="locate"></img>
                                <p>대구광역시, 수성구</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profilebox}>
                    <div className={styles.profilebox_section}>
                        <p className={styles.title}>TECH STACK</p>
                        <div className={styles.line}></div>
                        <div className={styles.stack}>
                            <p>#REACT</p>
                            <p>#JS</p>
                            <p>#HTML</p>
                    </div>
                    </div>
                    <div className={styles.profilebox_section}>
                        <p className={styles.title}>STYLES</p>
                        <div className={styles.line}></div>
                        <p>TEXT</p>
                    </div>
                    <div className={styles.profilebox_section}>
                        <p className={styles.title}>PROFILE</p>
                        <div className={styles.line}></div>
                        <p>TEXT</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mypage;