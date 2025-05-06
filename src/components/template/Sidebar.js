import { useState } from "react"
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css"

{/*title : 페이지명, dataarray : 사이드바에 들어갈 페이지명, link : click => 이동할 페이지 주소들*/}
const Sidebar = ({title, dataarray, link})=>{
    const [click, setclick] = useState(dataarray[0]);

    return(        
        <div className={styles.bar}>
            <p className={styles.title}>{title}</p>
            <div className={styles.Navbox}>
                {dataarray.map((data, key)=>
                    <NavLink to={link[key]} onClick={()=>{setclick(data); }} 
                    className={`${styles.data} ${click===data ? styles.click : ""}`}>{data}</NavLink>
                )}
            </div>
        </div>
    )
}

export default Sidebar;

