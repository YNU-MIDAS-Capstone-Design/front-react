import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import styles from "../style/Home.module.css";
import axios from "axios";
import banner1 from "../assets/banner11.png";
import banner2 from "../assets/banner22.png";
import StackFilter from "../components/template/StackFilter";
import SearchBar from "../components/template/Homesearch";
import AlarmButton from "../components/alarmButton/AlarmButton";
const images = require.context("../assets/stack", false, /\.png$/);

const banners = [
  { image: banner1, projectId: 3 },
  { image: banner2, projectId: 1 },
];

const dummyData = {
  recent: [
    {
      project_id: 1,
      title: "AI 쇼핑몰 프로젝트",
      description:
        "AI 추천 알고리즘을 기반으로 한 스마트 쇼핑몰 웹 프로젝트의 팀원을 모집합니다.",
      stackList: ["Python", "Django", "AI"],
    },
    {
      project_id: 2,
      title: "Spring Boot API 서버 개발",
      description:
        "Spring Boot를 활용한 쇼핑몰 백엔드 API 서버를 개발할 팀원을 찾습니다.",
      stackList: ["Java", "Spring", "MySQL"],
    },
    {
      project_id: 3,
      title: "React UI/UX 개선",
      description:
        "React 기반의 UI/UX 개선 프로젝트를 함께할 프론트엔드 개발자를 모집합니다.",
      stackList: ["React"],
    },
    {
      project_id: 4,
      title: "영화 추천 시스템 개발",
      description:
        "머신러닝 기반 개인화 영화 추천 웹 애플리케이션을 만들 팀원을 찾습니다.",
      stackList: ["Python", "Flask", "AI", "BigData"],
    },
    {
      project_id: 5,
      title: "실시간 채팅 웹앱",
      description:
        "WebSocket 기반 실시간 채팅 웹앱 프로젝트에 참여할 인원을 모집합니다.",
      stackList: ["Spring"],
    },
    {
      project_id: 6,
      title: "게임 커뮤니티 플랫폼",
      description:
        "게임 유저를 위한 커뮤니티 플랫폼 웹 프로젝트 팀원을 모집합니다.",
      stackList: ["React", "Spring", "MongoDB"],
    },
  ],
  popular: [
    {
      project_id: 6,
      title: "게임 커뮤니티 플랫폼",
      description:
        "게임 유저를 위한 커뮤니티 플랫폼 웹 프로젝트 팀원을 모집합니다.",
      stackList: ["React", "Spring", "MongoDB"],
    },
    {
      project_id: 9,
      title: "헬스케어 웹 플랫폼",
      description:
        "운동 기록 관리 및 분석 웹 플랫폼 프로젝트입니다. 헬스케어에 관심 있는 분을 찾습니다.",
      stackList: ["React", "Nodejs", "MySQL"],
    },
    {
      project_id: 4,
      title: "영화 추천 시스템 개발",
      description:
        "머신러닝 기반 개인화 영화 추천 웹 애플리케이션을 만들 팀원을 찾습니다.",
      stackList: ["Python", "Flask", "AI", "BigData"],
    },
    {
      project_id: 10,
      title: "여행 커뮤니티 웹 서비스",
      description: "여행 후기 공유 및 동행 매칭 서비스 개발 프로젝트입니다.",
      stackList: ["React", "Spring", "AWS"],
    },
    {
      project_id: 1,
      title: "AI 쇼핑몰 프로젝트",
      description:
        "AI 추천 알고리즘을 기반으로 한 스마트 쇼핑몰 웹 프로젝트의 팀원을 모집합니다.",
      stackList: ["Python", "Django", "AI"],
    },
    {
      project_id: 8,
      title: "데이터 시각화 대시보드",
      description:
        "차트와 그래프를 포함한 웹 기반 데이터 대시보드 개발자를 모집합니다.",
      stackList: ["Spring", "BigData"],
    },
  ],
  recommend: [
    {
      project_id: 1,
      title: "AI 쇼핑몰 프로젝트",
      description:
        "AI 추천 알고리즘을 기반으로 한 스마트 쇼핑몰 웹 프로젝트의 팀원을 모집합니다.",
      stackList: ["Python", "Django", "AI"],
    },
    {
      project_id: 2,
      title: "Spring Boot API 서버 개발",
      description:
        "Spring Boot를 활용한 쇼핑몰 백엔드 API 서버를 개발할 팀원을 찾습니다.",
      stackList: ["Java", "Spring", "MySQL"],
    },
    {
      project_id: 3,
      title: "React UI/UX 개선",
      description:
        "React 기반의 UI/UX 개선 프로젝트를 함께할 프론트엔드 개발자를 모집합니다.",
      stackList: ["React"],
    },
    {
      project_id: 4,
      title: "영화 추천 시스템 개발",
      description:
        "머신러닝 기반 개인화 영화 추천 웹 애플리케이션을 만들 팀원을 찾습니다.",
      stackList: ["Python", "Flask", "AI", "BigData"],
    },
    {
      project_id: 5,
      title: "실시간 채팅 웹앱",
      description:
        "WebSocket 기반 실시간 채팅 웹앱 프로젝트에 참여할 인원을 모집합니다.",
      stackList: ["Spring"],
    },
    {
      project_id: 6,
      title: "게임 커뮤니티 플랫폼",
      description:
        "게임 유저를 위한 커뮤니티 플랫폼 웹 프로젝트 팀원을 모집합니다.",
      stackList: ["React", "Spring", "MongoDB"],
    },
  ],
};

const Home = () => {
  const [data, setData] = useState({ popular: [], recommend: [], recent: [] });
  const [favorites, setFavorites] = useState({});

  const [slideState, setSlideState] = useState({
    popular: 0,
    recommend: 0,
    recent: 0,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isHidden, setIsHidden] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = banners.length;

  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedStacks, setSelectedStacks] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notiCount, setNotiCount] = useState({ count: 0 });

  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const toggleAlarm = () => {
    setIsAlarmOpen((prev) => !prev);
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1단계: 홈 데이터 불러오기
        const res = await axios.get("/api/home", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.code === "SU") {
          setData({
            recent: res.data.recent || [],
            popular: res.data.popular || [],
            recommend: res.data.recommend || [],
          });

          // 2단계: 좋아요 데이터 불러오기
          const likeRes = await axios.get("/api/users/me/likes", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const likedIds = likeRes.data.data.map((item) => item.project_id);

          // 3단계: 좋아요 상태 초기화 (섹션별 key로 관리)
          const initialFavorites = {};
          ["recent", "popular", "recommend"].forEach((section) => {
            res.data[section]?.forEach((project) => {
              initialFavorites[`${section}-${project.project_id}`] =
                likedIds.includes(project.project_id);
            });
          });

          setFavorites(initialFavorites);
        } else {
          setErrorMessage(`[${res.data.code}] ${res.data.message}`);
        }
      } catch (err) {
        console.warn("백엔드 연동 실패. 더미 데이터를 사용합니다.");
        setData(dummyData);

        const isBackendError =
          err.response?.data?.code && err.response?.data?.message;
        if (isBackendError) {
          const { code, message } = err.response.data;
          setErrorMessage(`[${code}] ${message}`);
        } else {
          setErrorMessage("");
        }
      }

      alarmCount();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight =
        document.querySelector(`.${styles.Banner}`)?.offsetHeight || 0;
      const scrollThreshold = bannerHeight * 0.6;
      setIsHidden(window.scrollY < scrollThreshold);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3500);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const toggleFavorite = async (section, index) => {
    const job = data[section][index];
    const projectId = job.project_id;

    try {
      await axios.post(`/api/project/${projectId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const key = `${section}-${projectId}`;
      setFavorites((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    } catch (err) {
      console.error("좋아요 요청 실패", err);
    }
  };

  const nextJobSectionSlide = (key) => {
    const max = Math.ceil(data[key].length / 3);
    setSlideState((prev) => ({ ...prev, [key]: (prev[key] + 1) % max }));
  };

  const prevJobSectionSlide = (key) => {
    const max = Math.ceil(data[key].length / 3);
    setSlideState((prev) => ({ ...prev, [key]: (prev[key] - 1 + max) % max }));
  };

  const alarmCount = () => {
    axios
      .get(`/api/notifications/unread-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data.count);
        setNotiCount(res.data.count);
      })
      .catch(() => {
        // console.err("오류가 발생했습니다.");
      });
  };

  const renderSection = (title, key) => {
    const max = Math.ceil(data[key].length / 3);
    const jobsToShow = data[key].slice(
      slideState[key] * 3,
      slideState[key] * 3 + 3
    );

    const handleProjectClick = (projectId) => {
      navigate(`/Post/${Number(projectId)}`);
    };

    return (
      <section className={styles.popularJobListings}>
        <header className={styles.sectionHeader}>
          <div className={styles.indicatorContainer}>
            <div className={styles.blueIndicator}></div>
          </div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.jobSlideButtons}>
            <button
              className={classNames(styles.jobArrow, styles.leftJobArrow)}
              onClick={() => prevJobSectionSlide(key)}
              disabled={max <= 1}
            >
              ◀
            </button>
            <button
              className={classNames(styles.jobArrow, styles.rightJobArrow)}
              onClick={() => nextJobSectionSlide(key)}
              disabled={max <= 1}
            >
              ▶
            </button>
          </div>
        </header>

        <div className={styles.jobListingsContainer}>
          {jobsToShow.map((job, index) => (
            <div
              key={job.project_id}
              className={styles.jobCard}
              onClick={() => handleProjectClick(job.project_id)}
            >
              <button
                className={classNames(styles.starButton, {
                  [styles.active]: favorites[`${key}-${job.project_id}`],
                })}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(key, index + slideState[key] * 3);
                }}
              >
                ★
              </button>

              <h3 className={styles.jobTitle}>{job.title}</h3>
              <p className={styles.jobDescription}>{job.content}</p>
              <div
                className={styles.stackList}
                style={{
                  display: "flex",
                  flexWrap: "nowrap",
                  alignItems: "center",
                }}
              >
                {job.stackList?.slice(0, 3).map((stack, i) => {
                  let imgSrc;
                  try {
                    imgSrc = images(`./${stack}.png`);
                  } catch (e) {
                    imgSrc = "";
                  }
                  return (
                    <span key={i} className={styles.roleTagWithImage}>
                      {imgSrc && (
                        <img
                          src={imgSrc}
                          alt={stack}
                          className={styles.stackIcon}
                        />
                      )}
                      {stack}
                    </span>
                  );
                })}
                {job.stackList?.length > 3 && (
                  <span className={styles.roleTagWithImage}>
                    +{job.stackList.length - 3}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className={styles.HomeContainer}>
      {/* 배너 */}
      <section className={styles.Banner}>
        <div
          className={styles.SliderTrack}
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${banners.length * 100}%`,
          }}
        >
          {banners.map((banner, index) => (
            <img
              key={index}
              src={banner.image}
              alt={`배너 이미지 ${index + 1}`}
              className={styles.bannerImage}
              onClick={() => navigate(`/Post/${banner.projectId}`)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
        <nav className={styles.slideNav}>
          <div className={styles.slideDots}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={classNames(styles.dotButton, {
                  [styles.active]: currentSlide === index,
                })}
              >
                ●
              </button>
            ))}
          </div>
        </nav>
        <button
          className={styles.arrowButton + " " + styles.leftArrow}
          onClick={prevSlide}
        >
          ◀
        </button>
        <button
          className={styles.arrowButton + " " + styles.rightArrow}
          onClick={nextSlide}
        >
          ▶
        </button>
      </section>

      {/* 검색바 */}
      <div className={styles.searchBar}>
        <button
          className={styles.filterButton}
          onClick={() => setIsSearchOpen(true)}
        >
          기술 검색 ▾
        </button>
        <SearchBar
          keyword={searchKeyword}
          setKeyword={setSearchKeyword}
          onSearch={() => {
            const params = new URLSearchParams();

            if (searchKeyword.trim()) {
              params.append("keyword", searchKeyword.trim());
            }

            selectedStacks.forEach((stack) => {
              params.append("stacks", stack);
            });

            params.append("search", "1");

            navigate(`/project?${params.toString()}`);
          }}
        />
      </div>

      {/* 스택 필터 모달 */}
      {isSearchOpen && (
        <StackFilter
          selectedStacks={selectedStacks}
          setSelectedStacks={setSelectedStacks}
          onClose={() => setIsSearchOpen(false)}
          onApply={() => {
            setIsSearchOpen(false);
            const params = new URLSearchParams();
            selectedStacks.forEach((stack) => {
              params.append("stacks", stack);
            });
            params.append("search", "1");
            navigate(`/project?${params.toString()}`);
          }}
        />
      )}

      {/* 하단 모집 버튼 */}
      <Link to="/CreatePost">
        <button
          className={classNames(styles.Match2, styles.fixed, {
            [styles.hidden]: isHidden,
          })}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            마음에 드는 프로젝트가 없다면?
          </span>
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>
            모집하기!
          </span>
        </button>
      </Link>

      {/* 알람 버튼 */}
      <div className={styles.alarmWrapper}>
        <button className={styles.alarmButton} onClick={toggleAlarm}></button>
        {notiCount > 0 && <div className={styles.badge}>{notiCount}</div>}
      </div>
      <AlarmButton isOpen={isAlarmOpen} onClose={() => setIsAlarmOpen(false)} />

      {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

      {/* 프로젝트 섹션 */}
      {renderSection("인기 구인글", "popular")}
      {renderSection("추천 구인글", "recommend")}
      {renderSection("최근 구인글", "recent")}
    </div>
  );
};

export default Home;
