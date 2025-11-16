import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex",minHeight: "100vh"}}>
      <Sidebar />
      <div style={{ flex: 1, backgroundColor:"#F5F5F5", display:"flex", marginLeft: "150px", justifyContent: "center", alignItems:"center",overflowY: "auto", overflowX:"auto"}}>
        <Outlet />
      </div>
    </div>
  );
}
