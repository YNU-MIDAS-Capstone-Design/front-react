import React, { useState } from "react";
import styles from "./AlarmButton.module.css";
import NotificationModal from "./NotificationModal";
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
// import ChatModal from "./ChatModal";

const AlarmButton = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("notification");

  if (!isOpen) return null;

  return (
    <div className={styles.bottomPanel}>
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
