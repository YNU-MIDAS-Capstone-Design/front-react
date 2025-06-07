import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../style/Project.module.css";
import axios from "axios";
import SearchBar from "../components/template/SearchBar";
import StackFilter from "../components/template/StackFilter";
import LocationFilter from "../components/template/LocationFilter";

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
}) => {
  const images = require.context("../assets/stack", false, /\.png$/);

  return (
    <article className={styles.card} data-id={id} onClick={onClick}>
      <StarButton isActive={isFavorite} onClick={onFavoriteToggle} />
      <header className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
      </header>
      <p className={styles.cardDescription}>{description ?
                (description.split(/[.!?]/)[0].length> 90
                ? description.slice(0, 90) + "..."
                : description.split(/[.!?]/)[0])
                : (description)}</p>

      {/* 여기부터 기존 역할 태그 대신 바뀜 */}
      <div className={styles.roleTags}>
        {(roles?.slice(0, 4) || []).map((role, index) => {
          let imgSrc = "";
          try {
            imgSrc = images(`./${role}.png`);
          } catch (e) {
            imgSrc = "";
          }
          return (
            <div key={index} className={styles.roleTagWithImage}>
              {imgSrc && (
                <img
                  src={imgSrc}
                  alt={role}
                  className={styles.roleImage}
                  style={{ width: "20px", height: "20px", marginRight: "5px" }}
                />
              )}
              <span>{role}</span>
            </div>
          );
        })}
        {roles.length > 4 && (
          <div className={styles.roleTagWithImage}>+{roles.length - 4}</div>
        )}
      </div>
    </article>
  );
};

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

  // 별 버튼 토글 함수
  const toggleFavorite = async (projectId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post(`/api/project/${projectId}/like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 좋아요 리스트 새로 불러오기
      const likeRes = await axios.get("/api/users/me/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const likedIds = likeRes.data.data.map((item) => item.project_id);
      setFavorites((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          updated[id] = likedIds.includes(parseInt(id));
        });
        return updated;
      });
    } catch (error) {
      console.error("좋아요 실패", error);
    }
  };

  useEffect(() => {
    const keyword = searchKeyword.trim();
    const params = new URLSearchParams();
    params.append("page", page);
    if (order) params.append("order", order);
    if (processOnly) params.append("process", "true");
    selectedRegions.forEach((region) => params.append("location", region));
    selectedStacks.forEach((stack) => params.append("stacks", stack));
    if (keyword) params.append("keyword", keyword);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 만료되었습니다.");
      return;
    }

    const fetchProjectsAndLikes = async () => {
      try {
        // 프로젝트 리스트 조회
        const res = await axios.get(`/api/project?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedProjects = Array.isArray(res.data.projects)
          ? res.data.projects
          : [];
        setProjects(fetchedProjects);
        setTotalCount(res.data.totalCount || 0);

        // 좋아요 리스트 조회
        const likeRes = await axios.get("/api/users/me/likes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const likedIds = likeRes.data.data.map((item) => item.project_id);
        const initialFavorites = {};
        fetchedProjects.forEach((project) => {
          initialFavorites[project.project_id] = likedIds.includes(
            project.project_id
          );
        });
        setFavorites(initialFavorites);
      } catch (err) {
        console.error("데이터 가져오기 실패", err);
        setProjects([]);
        setTotalCount(0);
      }
    };

    fetchProjectsAndLikes();
  }, [
    searchTrigger,
    page,
    selectedStacks,
    selectedRegions,
    processOnly,
    order,
  ]);

  const navigate = useNavigate();
  const handleProjectClick = (projectId) => {
    navigate(`/Post/${Number(projectId)}`);
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
                description={project.content}
                roles={project.stackList}
                isFavorite={favorites[project.project_id] || false}
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
