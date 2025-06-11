import React, { useState, useEffect } from "react";
import styles from "./AlarmButton.module.css";
import NotificationModal from "./NotificationModal";
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

// import ChatModal from "./ChatModal";

const AlarmButton = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("notification");
  const [shouldRender, setShouldRender] = useState(false); //modal 제거
  const [animateClass, setAnimateClass] = useState(""); //fadein,out 적용

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimateClass(styles.modalopen);
    } else {
      setAnimateClass(styles.modalclose);
      setTimeout(() => {
        setShouldRender(false);
      }, 300); // fadein, fadeout 적용
    }
  }, [isOpen]);

  if (!shouldRender) return null; //fadeout 후 DOM 제거

  return (
    <div className={`${styles.bottomPanel} ${animateClass}`}>
      <div className={styles.tabContent}>
        {activeTab === "notification" && <NotificationModal />}
        {/* {activeTab === "chat" && <ChatBubbleOutlineRoundedIcon />} */}
      </div>
      {/* <div className={styles.tabButtons}>
        <button
          className={`${styles.tabButton} ${activeTab === "notification" ? styles.active : ""}`}
          onClick={() => setActiveTab("notification")}
        >
          <NotificationsNoneOutlinedIcon/>
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === "chat" ? styles.active : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          <ChatBubbleOutlineRoundedIcon/>
        </button>
      </div> */}
    </div>
  );
};

export default AlarmButton;
