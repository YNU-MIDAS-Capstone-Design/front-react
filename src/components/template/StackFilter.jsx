import React from "react";
import styles from "./StackFilter.module.css";

const STACKS = [
  // 백엔드
  "Nodejs", "Java", "Spring", "Express", "Django", "Flask", "NestJS",
  "MySQL", "MongoDB", "Docker", "AWS",

  // 프론트
  "JavaScript", "HTML", "CSS", "React", "Vue",

  // 디자이너
  "Figma", "Illustrator", "Adobe_XD",

  // 모바일 앱
  "Android", "Kotlin", "Swift", "Flutter",

  // 인공지능
  "Python", "AI", "BigData",

  // 게임 + 기타
  "Unity", "UnrealEngine", "C_SHARP", "C_PLUS", "IoT", "security"
];

const StackFilterModal = ({
  selectedStacks,
  setSelectedStacks,
  onClose,
  onApply,
}) => {
  const toggleStack = (stack) => {
    setSelectedStacks((prev) =>
      prev.includes(stack)
        ? prev.filter((item) => item !== stack)
        : [...prev, stack]
    );
  };

  const clearStacks = () => setSelectedStacks([]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
      <div className={styles.closeButtonWrapper}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
        <div className={styles.modalHeader}>
          <h2>기술</h2>
        </div>
        

        <div className={styles.stackGrid}>
          {STACKS.map((stack) => (
            <button
              key={stack}
              className={`${styles.stackTag} ${
                selectedStacks.includes(stack) ? styles.active : ""
              }`}
              onClick={() => toggleStack(stack)}
            >
              {stack}
            </button>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button onClick={clearStacks} className={styles.resetButton}>
            ↺ 초기화
          </button>
          <button onClick={onApply} className={styles.applyButton}>
            적용
          </button>
        </div>
      </div>
    </div>
  );
};

export default StackFilterModal;
