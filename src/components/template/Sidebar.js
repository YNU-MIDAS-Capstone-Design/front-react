import { useState } from "react"
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css"

{/*title : 페이지명, dataarray : 사이드바에 들어갈 페이지명, link : click => 이동할 페이지 주소들*/}
const Sidebar = ({title, dataarray, link})=>{

    return(        
        <div className={styles.bar}>
            <p className={styles.title}>{title}</p>
            <div className={styles.Navbox}>
            {dataarray.map((data, key) => (
                <NavLink
                key={key}
                to={link[key]}
                className={({ isActive }) =>
                    `${styles.data} ${isActive ? styles.click : ""}`
                }
                >
                {data}
                </NavLink>
            ))}
            </div>
        </div>
    )
}

export default Sidebar;

