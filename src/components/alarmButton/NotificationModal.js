import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationModal.module.css";
import axios from "axios";

const NotificationModal = () => {
  const token = localStorage.getItem("accessToken");
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    axios.get(`/api/notifications`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res)=>{
      setNotification(res.data);
    })
    .catch(()=>{
      alert("오류가 발생했습니다.");
    })
  }, [token])
  
  const handleNotificationClick =(id)=> {
    axios.post(`api/notifications/${id}/read`, null,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(()=>{
      navigate(`/Likedpage`);
    })
    .catch(()=>{
      alert("잠시 기다려주세요.");
    })
  };
  return(
    <>
      <div className={styles.notificationSection}>
          <h3>알림</h3>
          <ul className={styles.notificationList}>
            {notification.length > 0? (
              notification.map((item, index)=>(
                <li key={item.id} className={`${styles.notification} ${item.read ? styles.read : styles.unread}`} onClick={()=>handleNotificationClick(item.id)}>
                  <div className={styles.row}>
                    <span key={item.id} className={styles.type}>
                      {item.type ==="APPLY" && "지원 알림"}
                      {item.type ==="COMMENT" && "댓글 알림"}
                      {item.type ==="LIKE" && "좋아요 알림"}
                    </span>
                    <span key={item.id} className={styles.date}>{item.createdAt.split("T")[0]}</span>
                  </div>
                  <div key={item.id} className={styles.message}>{item.message}</div>
                </li>
              ))
            ):(
              <li>알림이 없습니다.</li>
            )}
          </ul>
      </div>
    </>
  )
}

export default NotificationModal;