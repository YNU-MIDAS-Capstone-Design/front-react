import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../postSideBar/AuthPostSideBar.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import classNames from "classnames";
import axios from "axios";

const AuthPostSideBar = ({ isAuthor, token , projectId}) => {
  const [modalType, setModalType] = useState(""); // 모달 타입: 'share', 'volunteer'
  const [selectedUser, setSelectedUser] = useState(""); // addUser용
  const [active, setActive] = useState("");
  const [volunteered , setVolunteered] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    axios.get(`/api/users/me/applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      const appliedProjects = res.data.data; // 배열
      const isApplied = appliedProjects.some((project) => {
        return String(project.project_id) === String(projectId);
      });
      setVolunteered(isApplied); // true or false 설정
    })
    .catch((err) => {
      console.error("지원 상태 확인 실패", err);
    });

    axios.get(`/api/users/me/likes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res)=>{
      const likedProjects = res.data.data; // 배열
      const isLiked = likedProjects.some((project) => {
        return String(project.project_id) === String(projectId);
      });
      setActive(isLiked); // true or false 설정
    })
    .catch((err)=>{
      console.error("다시 시도해주세요.", err);
    })
  }, [projectId, volunteered]);

  const toggleLike = () => {
    const token = localStorage.getItem("accessToken");
    axios.post(`/api/project/${projectId}/like`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(()=>{
        setActive((prev)=>!prev);
      })
      .catch((err) => {
        const code = err.response.data.code;
        if(code === "VF" || code === "DBE") alert("오류 발생. 다시 시도해 주세요.");
        else if (code === "NB") alert("이미 삭제된 프로젝트 입니다.");
        else if (code === "NU" || code === "AF") {
          alert("다시 로그인 하세요.");
          localStorage.removeItem("accessToken");
        }
    });
  }

  const toggleVolunteer = () =>{
    axios.post(`/api/project/${projectId}/apply`,{},{
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(()=>{
        if (volunteered === false) alert("지원 완료!");
        else alert("지원 취소");
        setVolunteered((prev)=>!prev);
        console.log("지원 확인");
      })
      .catch(()=>{
        console.log("보내는 토큰:", token);
        console.log("지원 안됨");
      })
  }

  const toggleCancel =()=>{
    axios.delete(`/api/project/${projectId}/cancel`,{
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(()=>{
      if(volunteered) setVolunteered((prev)=>!prev);
    })
    .catch((err)=>{
      console.log(err.response.status);
    })
  }

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
        if(volunteered) toggleCancel();
        else toggleVolunteer();
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
        return volunteered
        ? <p>이 프로젝트 지원을 취소하시겠습니까?</p> 
        : <p>이 프로젝트에 지원하시겠습니까?</p>;
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
          </div>
        ) : (
          <div className={styles.menu}>
            <button className={styles.button} onClick={() => openModal("share")}>공유</button>
            <button className={styles.button} onClick={() => openModal("volunteer")}>{volunteered ? "지원 취소": "지원"}</button>
            <button className= {classNames(styles.starButton, {[styles.active]:active})} onClick={toggleLike}> ★ </button>
          </div>
        )}
      </aside>

      <Modal open={!!modalType} onClose={closeModal}>
        <Box className={styles.modalBox}>
          <h2>
            {{
              share: "공유하기",
              volunteer: "지원하기",
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
