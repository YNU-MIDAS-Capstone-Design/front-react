import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "../postSideBar/AuthPostSideBar.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const AuthPostSideBar = ({ isAuthor }) => {
  const [modalType, setModalType] = useState(""); // 모달 타입: 'share', 'volunteer', 'inquiry', 'addUser'
  const [selectedUser, setSelectedUser] = useState(""); // addUser용

  // 모달 열기
  const openModal = (type, user = "") => {
    setModalType(type);
    if (user) setSelectedUser(user);
  };

  const closeModal = () => {
    setModalType("");
    setSelectedUser("");
  };

  const handleConfirm = () => {
    switch (modalType) {
      case "share":
        console.log("공유하기 실행");
        break;
      case "volunteer":
        console.log("지원하기 실행");
        break;
      case "inquiry":
        console.log("문의하기 실행");
        break;
      case "addUser":
        console.log(`${selectedUser} 추가됨!`);
        break;
      default:
        break;
    }
    closeModal();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "share":
        return <p>이 게시글을 공유하시겠습니까?</p>;
      case "volunteer":
        return <p>이 프로젝트에 지원하시겠습니까?</p>;
      case "inquiry":
        return <p>작성자에게 문의하시겠습니까?</p>;
      case "addUser":
        return <p>정말 <strong>{selectedUser}</strong>님을 추가하시겠습니까?</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <aside className={styles.sidebar}>
        {isAuthor ? (
          <div>
            <div className={styles.authorBar}>
              <span className={styles.title}>지원 현황</span>
              <span className={styles.member} onClick={() => openModal("addUser", "user1")}>
                user1(모집)
              </span>
              <span className={styles.volunteer} onClick={() => openModal("addUser", "user2")}>
                user2
              </span>
            </div>
            <div className={styles.authorBar}>
              <span className={styles.title}>추천 회원</span>
              <span className={styles.member} onClick={() => openModal("addUser", "user1")}>
                user1(모집)
              </span>
              <span className={styles.volunteer} onClick={() => openModal("addUser", "user3")}>
                user3
              </span>
            </div>
          </div>
        ) : (
          <div className={styles.menu}>
            <button className={styles.button} onClick={() => openModal("share")}>공유</button>
            <button className={styles.button} onClick={() => openModal("volunteer")}>지원</button>
            <button className={styles.button} onClick={() => openModal("inquiry")}>문의</button>
          </div>
        )}
      </aside>

      <Modal open={!!modalType} onClose={closeModal}>
        <Box className={styles.modalBox}>
          <h2>
            {{
              share: "공유하기",
              volunteer: "지원하기",
              inquiry: "문의하기",
              addUser: "회원 추가",
            }[modalType]}
          </h2>
          {renderModalContent()}
          <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
            <button onClick={handleConfirm}>확인</button>
            <button onClick={closeModal}>취소</button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

AuthPostSideBar.propTypes = {
  isAuthor: PropTypes.bool.isRequired,
};

export default AuthPostSideBar;
