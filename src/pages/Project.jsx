import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../style/Project.module.css";
import axios from "axios";
import SearchBar from "../components/template/SearchBar";
import StackFilter from "../components/template/StackFilter";
import LocationFilter from "../components/template/LocationFilter";

const RoleTag = ({ role }) => <span className={styles.roleTag}>{role}</span>;

const StarButton = ({ isActive, onClick }) => (
  <button
    className={`${styles.starButton} ${isActive ? styles.active : ""}`}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.8478 8.76393L22 9.52786L16.5 14.2361L18.1956 21L12 17.5279L5.80444 21L7.5 14.2361L2 9.52786L9.15224 8.76393L12 2Z"
        fill={isActive ? "gold" : "#D9D9D9"}
      />
    </svg>
  </button>
);

const ProjectRecruitmentCard = ({
  id,
  title,
  description,
  roles,
  isFavorite,
  onFavoriteToggle,
  onClick,
}) => (
  <article className={styles.card} data-id={id} onClick={onClick}>
    <StarButton isActive={isFavorite} onClick={onFavoriteToggle} />
    <header className={styles.cardHeader}>
      <h2 className={styles.cardTitle}>{title}</h2>
    </header>
    <p className={styles.cardDescription}>{description}</p>
    <div className={styles.roleTags}>
      {roles.slice(0, 4).map((role, index) => (
        <RoleTag key={index} role={role} />
      ))}
      {roles.length > 4 && (
        <span className={styles.roleTag}>+{roles.length - 4}</span>
      )}
    </div>
  </article>
);

const ProjectList = ({
  selectedStacks,
  selectedRegions,
  processOnly,
  searchKeyword,
  order,
  searchTrigger,
}) => {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [favorites, setFavorites] = useState({});

  const limit = 6;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    const keyword = searchKeyword.trim();
    if (
      searchTrigger === 0 &&
      selectedStacks.length === 0 &&
      selectedRegions.length === 0 &&
      searchKeyword.trim() === ""
    ) {
    }

    const params = new URLSearchParams();
    params.append("page", page);
    if (order) params.append("order", order);
    if (processOnly) params.append("process", "true");
    selectedRegions.forEach((region) => params.append("location", region));
    selectedStacks.forEach((stack) => params.append("stacks", stack));
    if (keyword) params.append("keyword", keyword);

    const token = localStorage.getItem("accessToken");

    const isTokenExpired = (token) => {
      if (!token) return true;

      try {
        const base64Url = token.split(".")[1]; // JWT payload 부분
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000); // 현재 시간 (초)

        return exp < now;
      } catch (e) {
        console.error("토큰 디코딩 실패:", e);
        return true; // 디코딩 실패 시 만료된 것으로 간주
      }
    };

    if (!token || isTokenExpired(token)) {
      alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      // navigate("/login"); 등 처리
    } else {
      // 유효한 토큰 → API 요청 등 진행
    }
    console.log("🔐 accessToken:", token);

    const query = [
      `page=${page}`,
      `order=${order}`,
      processOnly ? `process=true` : null,
      keyword ? `keyword=${encodeURIComponent(keyword)}` : null,
      ...selectedRegions.map((r) => `location=${encodeURIComponent(r)}`),
      ...selectedStacks.map((s) => `stacks=${encodeURIComponent(s)}`),
    ]
      .filter(Boolean)
      .join("&");

    axios
      .get(`/api/project?${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.code === "SU") {
          const fetchedProjects = Array.isArray(res.data.projects)
            ? res.data.projects
            : [];
          setProjects(fetchedProjects);
          setTotalCount(res.data.totalCount || 0);
          setPage(res.data.page || 0);

          const initialFavorites = {};
          fetchedProjects.forEach((project) => {
            initialFavorites[project.project_id] = false;
          });
          setFavorites(initialFavorites);
        } else {
          setProjects([]); // 실패 시 명시적으로 빈 배열
          setTotalCount(0);
          setPage(0);
        }
      })
      .catch((err) => {
        console.warn("백엔드 연결 실패.");
        setProjects([]);
        setTotalCount(0);
        setPage(0);
      });
  }, [
    searchTrigger, // 버튼 누를 때만 증가
    page,
    selectedStacks,
    selectedRegions,
    processOnly,
    order,
  ]);

  const navigate = useNavigate();
  const handleProjectClick = (projectId) => {
    navigate(`/Post/${Number(projectId)}`);
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isFiltered =
    searchTrigger > 0 ||
    selectedStacks.length > 0 ||
    selectedRegions.length > 0 ||
    searchKeyword.trim() !== "";

  return (
    <section className={styles.projectListWrapper}>
      {projects.length === 0 && isFiltered ? (
        <div className={styles.noResults}>검색 결과가 없습니다.</div>
      ) : (
        <>
          <div className={styles.projectList}>
            {projects.map((project) => (
              <ProjectRecruitmentCard
                key={project.project_id}
                id={project.project_id}
                title={project.title}
                description={project.description}
                roles={project.stackList}
                isFavorite={favorites[project.project_id]}
                onFavoriteToggle={() => toggleFavorite(project.project_id)}
                onClick={() => handleProjectClick(project.project_id)}
              />
            ))}
          </div>

          <div className={styles.slideControls}>
            <button
              className={`${styles.arrowButton} ${styles.leftArrow}`}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
            >
              ◀
            </button>
            <span className={styles.pageInfo}>
              {page + 1} / {totalPages}
            </span>
            <button
              className={`${styles.arrowButton} ${styles.rightArrow}`}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={page >= totalPages - 1}
            >
              ▶
            </button>
          </div>
        </>
      )}
    </section>
  );
};

const SortSelector = ({ order, setOrder }) => (
  <div className={styles.sortSelectorWrapper}>
    <select
      className={styles.sortSelect}
      value={order}
      onChange={(e) => setOrder(e.target.value)}
    >
      <option value="RECENT">최신순</option>
      <option value="POPULAR">인기순</option>
      <option value="RECOMMEND">추천순</option>
    </select>
  </div>
);

const Project = () => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("keyword") || "";
  const initialStacks = queryParams.getAll("stacks") || [];
  const initialTrigger = queryParams.get("search") === "1" ? 1 : 0;
  const [selectedStacks, setSelectedStacks] = useState(initialStacks);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [processOnly, setProcessOnly] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(initialKeyword);
  const [order, setOrder] = useState("RECENT");
  const [searchTrigger, setSearchTrigger] = useState(initialTrigger);

  const handleRemoveTag = (tagToRemove) => {
    setSelectedStacks((prev) => prev.filter((tag) => tag !== tagToRemove));
    setSelectedRegions((prev) =>
      prev.filter((region) => region !== tagToRemove)
    );
  };

  return (
    <div className={styles.projectContainer}>
      <section className={styles.filterContainer}>
        <div className={styles.filterTopRow}>
          <div className={styles.filterButtons}>
            <button
              className={styles.filterButton}
              onClick={() => setIsSearchOpen(true)}
            >
              기술 선택 ▾
            </button>
            <button
              className={styles.filterButton}
              onClick={() => setIsRegionOpen(true)}
            >
              위치 선택 ▾
            </button>
            <button
              className={styles.filterButton}
              onClick={() => setProcessOnly((prev) => !prev)}
            >
              {processOnly ? "전체 보기" : "모집 중만 보기"}
            </button>
          </div>
          <SearchBar
            keyword={searchKeyword}
            setKeyword={setSearchKeyword}
            onSearch={() => {
              setSearchTrigger((prev) => prev + 1);
            }}
          />
        </div>

        {(selectedStacks.length > 0 || selectedRegions.length > 0) && (
          <div className={styles.selectedTagContainer}>
            {selectedStacks.map((tag) => (
              <span key={tag} className={styles.selectedTag}>
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
            {selectedRegions.map((region) => (
              <span key={region} className={styles.selectedTag}>
                {region}
                <button onClick={() => handleRemoveTag(region)}>×</button>
              </span>
            ))}
          </div>
        )}
      </section>

      <div className={styles.fixedSortArea}>
        <SortSelector order={order} setOrder={setOrder} />
      </div>

      <ProjectList
        selectedStacks={selectedStacks}
        selectedRegions={selectedRegions}
        processOnly={processOnly}
        searchKeyword={searchKeyword}
        order={order}
        searchTrigger={searchTrigger}
      />

      {isSearchOpen && (
        <StackFilter
          selectedStacks={selectedStacks}
          setSelectedStacks={setSelectedStacks}
          onClose={() => setIsSearchOpen(false)}
          onApply={() => setIsSearchOpen(false)}
        />
      )}

      {isRegionOpen && (
        <LocationFilter
          selectedRegions={selectedRegions}
          setSelectedRegions={setSelectedRegions}
          onClose={() => setIsRegionOpen(false)}
          onApply={() => setIsRegionOpen(false)}
        />
      )}
    </div>
  );
};

export default Project;
