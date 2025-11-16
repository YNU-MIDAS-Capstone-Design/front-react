import styles from "./MemberManagement.module.css"
import Sidebar from "./SideBar";

function MemberManagement(){

    const ListItem = ()=>{
        return (
        <div className={styles.listbox}>
            <div className={styles.listitem}>user_id</div>
            <div className={styles.listitem}>nickname</div>
            <div className={styles.listitem} style={{width:"240px"}}>email</div>
            <div className={styles.listitem}>bio</div>
            <div className={styles.listitem}>location</div>
            <div className={styles.listitem}>sns</div>
            <div className={styles.listitem}>mbti</div>
            <div className={styles.listitem}>job</div>
        </div>);
    };

    return (
        <div style={{display:"flex", alignItems:"flex", backgroundColor:"#F5F5F5"}}>
           {/* <Sidebar></Sidebar> */}
           <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                <div style={{width:"1260px", height:"640px",  boxShadow: "0 1px 5px 0 #0000001a, 0 1px 2px -1px #0000001a", borderRadius:"16px", backgroundColor:"white", padding:"10px 30px", boxSizing:"border-box", color:"#1C2A53"}}>
                    <h2>회원관리</h2>
                    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"500px", marginTop:"30px", borderRadius:"8px"}}>
                        <div className={styles.listbox} style={{height:"50px", borderTop:"none", color: "#8E95A9", backgroundColor:"#F8F8F8"}}>
                            <div className={styles.listitem}>user_id</div>
                            <div className={styles.listitem}>nickname</div>
                            <div className={styles.listitem} style={{width:"240px"}}>email</div>
                            <div className={styles.listitem}>bio</div>
                            <div className={styles.listitem}>location</div>
                            <div className={styles.listitem}>sns</div>
                            <div className={styles.listitem}>mbti</div>
                            <div className={styles.listitem}>job</div>
                        </div>
                        <ListItem/>
                        <ListItem/>
                        <ListItem/>
                    </div>
                </div>
            </div> 
        </div>
    )

}
export default MemberManagement;