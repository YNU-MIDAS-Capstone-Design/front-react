import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import styles from "./Template.module.css";
import { Outlet } from "react-router-dom"; // ✅ 추가

const Template = () => {
  return (
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Outlet />  {/* ✅ 자식 라우트들이 여기에 렌더링됨 */}
        <Footer />
      </main>
    </div>
  );
};

export default Template;
