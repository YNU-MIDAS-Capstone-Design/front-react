import { useState } from "react"
import styles from "./Sidebar.module.css"

const Sidebar = ({title, dataarray})=>{
    const [click, setclick] = useState(dataarray[0]);

    return(
        <div className={styles.bar}>
            <p className={styles.title}>{title}</p>
            {dataarray.map((data, key)=>
                <p key={key} onClick={()=>setclick(data)}
                className={`${styles.data} ${click===data ? styles.click : ""}`}>{data}</p>
            )}
        </div>
    )
}

export default Sidebar;

