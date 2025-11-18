import Devmatch from "../../assets/DevMatch.png"
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faFile, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../../contexts/AuthContext";

function Sidebar(){
    const { token, logoutAuth } = useAuth();

    return (
        <div style={{position:"fixed" ,display:"flex", flexDirection:"column", alignItems:"center", height:"100vh", width:"150px", backgroundColor:"#3B82F6"}}>
            <Link to="/">
                <img alt="logo" src={Devmatch} style={{width: "130px", height:"58px", margin : "0 10px 50px 10px"}}></img>
            </Link>
            <NavLink to="/Developer" end style={({ isActive}) => ({width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor: isActive ? "#7EE7F5" : "white", marginBottom:"20px"})}>
                <FontAwesomeIcon icon={faUser} style={{fontSize: "1.6rem", color:"#3B82F6"}} /> 
            </NavLink>
            <NavLink to="/Developer/ProjectManagement" style={({isActive}) => ({width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor: isActive ? "#7EE7F5" : "white", marginBottom:"20px"})}>
                <FontAwesomeIcon icon={faFile} style={{fontSize: "1.6rem", color:"#3B82F6"}} /> 
            </NavLink>
            <div style={{width: "60px", height:"60px", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"10px", backgroundColor:"white", marginTop: "auto", cursor:"pointer"}}>
                <FontAwesomeIcon icon={faXmarkCircle} style={{fontSize: "1.6rem", color:"#3B82F6"}}
                onClick={logoutAuth} /> 
            </div>
        </div>
    )
}
export default Sidebar;