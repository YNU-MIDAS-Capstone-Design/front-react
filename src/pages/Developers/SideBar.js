import Devmatch from "../../assets/DevMatch.png"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFile, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

function Sidebar(){
    return (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", height:"100vh", width:"150px", backgroundColor:"#3B82F6", padding:"25px 0", boxSizing:"border-box", marginRight:"50px"}}>
            <Link to="/">
                <img alt="logo" src={Devmatch} style={{width: "130px", height:"58px", margin : "0 10px 50px 10px"}}></img>
            </Link>
            <Link to="/Developer" style={{width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor:"#7EE7F5", marginBottom:"20px"}}>
                <FontAwesomeIcon icon={faUser} style={{fontSize: "1.6rem", color:"#3B82F6"}} /> 
            </Link>
            <div style={{width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor:"white", marginBottom:"20px"}}>
                <FontAwesomeIcon icon={faFile} style={{fontSize: "1.6rem", color:"#3B82F6"}} /> 
            </div>
            <div style={{width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor:"white", marginTop: "auto"}}>
                <FontAwesomeIcon icon={faXmarkCircle} style={{fontSize: "1.6rem", color:"#3B82F6"}} /> 
            </div>
        </div>
    )
}
export default Sidebar;