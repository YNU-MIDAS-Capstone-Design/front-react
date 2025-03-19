"use client";
import React from "react";
import styles from "../../style/Community.module.css"; // 스타일 가져오기
import { NavLink } from "react-router-dom";

const TeamList = () => {
  return (
    <>
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
            />
            <TeamMemberCard
              name="NAME"
              role="member"
              tags="#STACK #STACK"
              dateIconUrl="https://cdn.builder.io/api/v1/image/assets/TEMP/103cc1a00f60d8b901a4b38e22e3ecfb61f172a4"
            />
          </div>
        </section>
      </main>
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
