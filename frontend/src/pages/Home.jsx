import React, { useState, useEffect } from "react";
import classNames from "classnames";
import styles from "../style/Home.module.css";
import Header from "../components/template/Header";
import banner1 from "../assets/banner.png";
import banner2 from "../assets/banner3.jpg";

const banners = [banner1, banner2];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = banners.length;

  // ✅ 각 섹션별 즐겨찾기 상태 분리 (객체 사용)
  const [favorites, setFavorites] = useState({
    job: Array(3).fill(false),
    algo: Array(3).fill(false),
    recent: Array(3).fill(false),
  });

  const [isHidden, setIsHidden] = useState(true);
  const [jobSlide, setJobSlide] = useState(0);
  const [algoSlide, setAlgoSlide] = useState(0);
  const [recentSlide, setRecentSlide] = useState(0);

  // ✅ 스크롤 감지해서 Match 고정 + 하단 Match 추가
  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = document.querySelector(
        `.${styles.Banner}`
      ).offsetHeight;
      const scrollThreshold = bannerHeight * 0.6;

      if (window.scrollY > bannerHeight) {
        setIsHidden(false);
      } else if (window.scrollY < scrollThreshold) {
        setIsHidden(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ 배너 슬라이드 기능
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // ✅ 구인글 슬라이드 기능 (3개씩 이동)
  const jobSlides = [
    ["프론트엔드 개발자 모집", "백엔드 개발자 모집", "UI/UX 디자이너 모집"],
    ["데이터 엔지니어 모집", "AI 연구원 모집", "머신러닝 엔지니어 모집"],
    ["모바일 앱 개발자 모집", "QA 엔지니어 모집", "프로덕트 매니저 모집"],
  ];
  const totalJobSlides = jobSlides.length;

  const nextJobSlide = () => {
    setJobSlide((prev) => (prev + 1) % totalJobSlides);
  };

  const prevJobSlide = () => {
    setJobSlide((prev) => (prev - 1 + totalJobSlides) % totalJobSlides);
  };

  // ✅ 추천 알고리즘 구인글 슬라이드
  const algoSlides = [
    ["데이터 엔지니어 모집", "AI 연구원 모집", "머신러닝 엔지니어 모집"],
    ["프론트엔드 개발자 모집", "백엔드 개발자 모집", "UI/UX 디자이너 모집"],
  ];
  const totalAlgoSlides = algoSlides.length;

  const nextAlgoSlide = () => {
    setAlgoSlide((prev) => (prev + 1) % totalAlgoSlides);
  };

  const prevAlgoSlide = () => {
    setAlgoSlide((prev) => (prev - 1 + totalAlgoSlides) % totalAlgoSlides);
  };

  // ✅ 최근 구인글 슬라이드
  const recentSlides = [
    ["모바일 앱 개발자 모집", "QA 엔지니어 모집", "프로덕트 매니저 모집"],
    ["데이터 엔지니어 모집", "AI 연구원 모집", "머신러닝 엔지니어 모집"],
  ];
  const totalRecentSlides = recentSlides.length;

  const nextRecentSlide = () => {
    setRecentSlide((prev) => (prev + 1) % totalRecentSlides);
  };

  const prevRecentSlide = () => {
    setRecentSlide(
      (prev) => (prev - 1 + totalRecentSlides) % totalRecentSlides
    );
  };

  // ✅ 즐겨찾기(★) 버튼 상태 변경 (각 섹션별로 저장)
  const toggleFavorite = (section, index) => {
    setFavorites((prev) => ({
      ...prev,
      [section]: prev[section].map((fav, i) => (i === index ? !fav : fav)),
    }));
  };

  return (
    <>
    <Header />
      <div className={styles.HomeContainer}>
      
        <section className={styles.Banner}>
          <div
            className={styles.SliderTrack}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${totalSlides * 100}%`,
            }}
          >
            {banners.map((banner, index) => (
              <img
                key={index}
                src={banner}
                alt={`배너 이미지 ${index + 1}`}
                className={styles.bannerImage}
              />
            ))}
          </div>

          {/* ✅ 배너 네비게이션 (도트 버튼) */}
          <nav className={styles.slideNav}>
            <div className={styles.slideDots}>
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={classNames(styles.dotButton, {
                    [styles.active]: currentSlide === index,
                  })}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index ? "true" : "false"}
                >●</button>
              ))}
            </div>
          </nav>

          {/* ✅ 좌우 화살표 버튼 */}
          <button
            className={`${styles.arrowButton} ${styles.leftArrow}`}
            onClick={prevSlide}
          >
            ◀
          </button>
          <button
            className={`${styles.arrowButton} ${styles.rightArrow}`}
            onClick={nextSlide}
          >
            ▶
          </button>
        </section>

        {/* ✅ 프로젝트 추천 (배너 아래) */}
        <button className={styles.Match}>
          나에게 꼭 맞는 프로젝트 추천받기!
        </button>

        <button
          className={classNames(styles.Match, styles.fixed, {
            [styles.hidden]: isHidden,
          })}
        >
          나에게 꼭 맞는 프로젝트 추천받기!
        </button>

        {/* Alarm 버튼 */}
        <button className={styles.alarmButton}></button>

        {/* ✅ 구인글 슬라이드 */}
        {[
          {
            title: "인기 구인글",
            slides: jobSlides,
            slideState: jobSlide,
            prevFunc: prevJobSlide,
            nextFunc: nextJobSlide,
            section: "job",
          },
          {
            title: "추천 알고리즘 구인글",
            slides: algoSlides,
            slideState: algoSlide,
            prevFunc: prevAlgoSlide,
            nextFunc: nextAlgoSlide,
            section: "algo",
          },
          {
            title: "최근 구인글",
            slides: recentSlides,
            slideState: recentSlide,
            prevFunc: prevRecentSlide,
            nextFunc: nextRecentSlide,
            section: "recent",
          },
        ].map((section, sectionIndex) => (
          <section key={sectionIndex} className={styles.popularJobListings}>
            <header className={styles.sectionHeader}>
              <div className={styles.indicatorContainer}>
                <div className={styles.blueIndicator}></div>
              </div>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.jobSlideButtons}>
                <button
                  className={classNames(styles.jobArrow, styles.leftJobArrow)}
                  onClick={section.prevFunc}
                >
                  ◀
                </button>
                <button
                  className={classNames(styles.jobArrow, styles.rightJobArrow)}
                  onClick={section.nextFunc}
                >
                  ▶
                </button>
              </div>
            </header>

            {/* 구인글 카드 목록 (슬라이드) */}
            <div className={styles.jobListingsContainer}>
              {section.slides[section.slideState].map((title, index) => (
                <div key={index} className={styles.jobCard}>
                  <button
                    className={classNames(styles.starButton, {
                      [styles.active]: favorites[section.section][index],
                    })}
                    onClick={() => toggleFavorite(section.section, index)}
                  >
                    ★
                  </button>
                  <h3 className={styles.jobTitle}>{title}</h3>
                  <p className={styles.jobDescription}>직무 관련 설명</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default Home;
