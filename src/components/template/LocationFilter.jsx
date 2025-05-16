import React from "react";
import styles from "./StackFilter.module.css";

const REGIONS = [
  "경기도",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
];

const LocationFilter = ({
  selectedRegions,
  setSelectedRegions,
  onClose,
  onApply,
}) => {
  const toggleRegion = (region) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((item) => item !== region)
        : [...prev, region]
    );
  };

  const clearRegions = () => setSelectedRegions([]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
      <div className={styles.closeButtonWrapper}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
    </div>
        <div className={styles.modalHeader}>
          <h2>지역</h2>
        </div>

        <div className={styles.stackGrid}>
          {REGIONS.map((region) => (
            <button
              key={region}
              className={`${styles.stackTag} ${
                selectedRegions.includes(region) ? styles.active : ""
              }`}
              onClick={() => toggleRegion(region)}
            >
              {region}
            </button>
          ))}
        </div>

        <div className={styles.actionButtons}>
          <button onClick={clearRegions} className={styles.resetButton}>
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

export default LocationFilter;
