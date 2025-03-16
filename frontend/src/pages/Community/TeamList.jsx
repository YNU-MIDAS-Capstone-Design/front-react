"use client";
import React, { useState } from "react";
import styles from "../../style/Community.module.css"; // 스타일 가져오기
import { NavLink } from "react-router-dom";
import Header from "../../components/template/Header";
import ScheduleModal from "./ScheduleModal";

const TeamList = () => {
  // ✅ 각 팀원의 캘린더 모달 상태 관리
  const [openCalendars, setOpenCalendars] = useState({
    owner: false,
    member: false,
  });

  // ✅ 특정 팀원의 캘린더 열기
  const openCalendar = (role) => {
    setOpenCalendars((prev) => ({ ...prev, [role]: true }));
  };

  // ✅ 특정 팀원의 캘린더 닫기
  const closeCalendar = (role) => {
    setOpenCalendars((prev) => ({ ...prev, [role]: false }));
  };

  return (
    <>
      <Header />
      <main className={styles.communityContainer}>
        {/* ✅ 사이드바 */}
        <aside className={styles.sidebar}>
          <h1 className={styles.sidebarTitle}>Community</h1>
          <nav className={styles.sidebarNav}>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              MY TEAM
            </NavLink>
            <NavLink
              to="/teamchat"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              TEAM CHAT
            </NavLink>
            <NavLink
              to="/teamboard"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              TEAM BOARD
            </NavLink>
          </nav>
        </aside>

        {/* ✅ 메인 컨텐츠 */}
        <section className={styles.teamContent}>
          <h2 className={styles.teamHeading}>MY TEAM</h2>
          <div className={styles.teamCards}>
            <TeamMemberCard
              name="NAME"
              role="owner"
              tags="#STACK #STACK"
              dateIconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/103cc1a00f60d8b901a4b38e22e3ecfb61f172a4"
              openCalendar={() => openCalendar("owner")}
            />
            <TeamMemberCard
              name="NAME"
              role="member"
              tags="#STACK #STACK"
              dateIconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/103cc1a00f60d8b901a4b38e22e3ecfb61f172a4"
              openCalendar={() => openCalendar("member")}
            />
          </div>
        </section>
      </main>

      {/* ✅ 각각의 일정 관리 모달 (owner & member) */}
      <ScheduleModal isOpen={openCalendars.owner} onClose={() => closeCalendar("owner")} />
      <ScheduleModal isOpen={openCalendars.member} onClose={() => closeCalendar("member")} />
    </>
  );
};

/* ✅ 팀 멤버 카드 컴포넌트 */
const TeamMemberCard = ({ name, role, tags, dateIconUrl, openCalendar }) => {
  return (
    <article className={styles.teamCard}>
      <div className={styles.profileImage}></div>
      <div className={styles.cardContent}>
        <header className={styles.cardHeader}>
          <h3 className={styles.memberName}>{name}</h3>
          <span className={styles.memberRole}>{role.toUpperCase()}</span>
        </header>
        <p className={styles.memberTags}>{tags}</p>
      </div>
      <img
        src={dateIconUrl}
        alt="Calendar icon"
        className={styles.dateIcon}
        onClick={openCalendar} // ✅ 클릭 시 해당 팀원의 일정 관리 모달 열기
      />
    </article>
  );
};

export default TeamList;
