import styles from "./NotificationModal.module.css";

const NotificationModal = () => {
    return(
        <>
        <div className={styles.notificationSection}>
                <h3>알림</h3>
                <ul className={styles.notificationList}>
                  <li>user1님이 지원했습니다.</li>
                  <li>user2님이 메시지를 보냈습니다.</li>
                  <li>user3님이 참여를 희망합니다.</li>
                  <li>testesdkdkdkkdksofeijsofjieifjoisefsodidoifoisidfosjdoifjejfsoidjfoisdfjei</li>
                </ul>
              </div>
        </>
    )
}

export default NotificationModal;