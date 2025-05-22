import styles from "./StackFilter.module.css";

const SingleSelectFilter = ({
  title,
  options,
  selectedOption,
  setSelectedOption,
  onClose,
  onApply,
}) => {
  const toggleOption = (option) => {
    setSelectedOption((prev) => (prev === option ? "" : option));
  };

  const clearOption = () => setSelectedOption("");

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.closeButtonWrapper}>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
        </div>

        <div className={styles.stackGrid}>
          {options.map((option) => (
            <button
              key={option}
              className={`${styles.stackTag} ${
                selectedOption === option ? styles.active : ""
              }`}
              onClick={() => toggleOption(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button onClick={clearOption} className={styles.resetButton}>
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

export default SingleSelectFilter;
