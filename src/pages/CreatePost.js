import { useState ,useEffect } from "react";
import styles from "../style/CreatePost.module.css";
import stackStyles from "../style/Post.module.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SingleSelectFilter from "../components/template/SingleSelectFilter";
import StackFilter from "../components/template/StackFilter";
import axios from "axios";
import { useNavigate , useParams } from "react-router-dom";

const POSITIONS = ["백엔드", "프론트", "디자이너", "모바일", "인공지능", "게임"];
const REGIONS = ["경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도"];


const CreatePost =()=> {
    const { projectId } = useParams();

    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken")
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [selectedStacks, setSelectedStacks] = useState([]);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [isPositionOpen, setIsPositionOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState("");

    const [projectInfo, setProjectInfo] = useState({
        title: "",
        content: "",
        processing: "수정중",
        recruitmentField: "",
        people: "",
        meet_location: "",
        stackList: []
    });
        
    useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
        try {
        const [projectRes, userRes] = await Promise.all([
            axios.get(`/api/project/${projectId}/view`, {
            headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            }),
        ]);

        const projectData = projectRes.data.project;
        const nickname = userRes.data.nickname;

        if (nickname !== projectData.writer) {
            alert("수정할 수 없습니다.");
            navigate("/"); // 또는 뒤로 가기 등 처리
            return;
        }
        setProjectInfo({
            title: projectData.title,
            content: projectData.content,
            processing: projectData.processing,
            recruitmentField: projectData.recruitmentField,
            people: projectData.people,
            meet_location: projectData.meet_location,
            stackList: projectData.stackList,
        });

        setSelectedRegion(projectData.meet_location);
        setSelectedPosition(projectData.recruitmentField);
        setSelectedStacks(projectData.stackList);
        } catch (err) {
        console.error("데이터 불러오기 실패", err);
        alert("프로젝트 정보를 불러오지 못했습니다.");
        }
    };

    fetchData();
    }, [projectId, token, navigate]);


    const createProject =()=>{
        const payload = {
            ...projectInfo,
            // people: Number(projectInfo.people),
            meet_location: selectedRegion,
            recruitmentField: selectedPosition,
            stackList: selectedStacks,
        };
        if (projectId) {
            const summary = projectInfo.content.split('\n')[0].slice(0, 20);
            payload.description = summary;
            console.log(payload);
            // 수정
            axios.put(`/api/project/${projectId}/edit`, payload,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                alert("수정 완료되었습니다!");
                navigate(`/Post/${Number(projectId)}`);
            })
            .catch((err) => {
                console.error(err);
                alert("수정 실패");
            });
        }
        else{
            axios.post(`/api/project`,payload,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(()=>{
                alert("등록되었습니다");
                navigate('/');
            })
            .catch((err) => {
                console.error("ERROR", err);
                alert("등록 실패: " + (err.response?.data?.message || err.message));
            });
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setProjectInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (e.target.tagName === 'TEXTAREA') {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
        }    
    };
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.component}>
                <div className={styles.backArrow} onClick={()=>navigate(-1)}><ArrowBackIosIcon/></div>
                <div className={styles.top}>
                    <textarea className={styles.title} name="title" value={projectInfo.title} onInput={handleInput} placeholder="프로젝트 제목"></textarea>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <span className={styles.name}>모임 위치</span>
                            <button className={styles.filterButton} value={projectInfo.meet_location} onClick={() => setIsRegionOpen(true)}>{selectedRegion || "위치 선택 "}▾</button>
                            {isRegionOpen && (
                                <SingleSelectFilter
                                    title="지역"
                                    options={REGIONS}
                                    selectedOption={selectedRegion}
                                    setSelectedOption={setSelectedRegion}
                                    onClose={() => setIsRegionOpen(false)}
                                    onApply={() => setIsRegionOpen(false)}
                                />
                            )}
                            
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 분야</span>
                            <button className={styles.filterButton} value={projectInfo.recruitmentField} onClick={() => setIsPositionOpen(true)}>{selectedPosition || "분야 선택 "}▾</button>
                            {isPositionOpen && (
                                <SingleSelectFilter
                                    title="포지션"
                                    options={POSITIONS}
                                    selectedOption={selectedPosition}
                                    setSelectedOption={setSelectedPosition}
                                    onClose={() => setIsPositionOpen(false)}
                                    onApply={() => setIsPositionOpen(false)}
                                />
                            )}
                        </div>
                        <div className={styles.row}>
                            <label className={styles.inputLabel} >모집 인원</label>
                            <input className={styles.name} name = "people" value={projectInfo.people} type="number" placeholder="모집 인원" onChange={handleInput}/>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>사용 기술</span>
                            <button className={styles.filterButton} value={projectInfo.stackList} onClick={() => setIsSearchOpen(true)}>{"기술 선택 ▾"}</button>
                            {isSearchOpen && (
                                <StackFilter
                                selectedStacks={selectedStacks}
                                setSelectedStacks={setSelectedStacks}
                                onClose={() => setIsSearchOpen(false)}
                                onApply={() => setIsSearchOpen(false)}
                                />
                            )}
                            <div className={stackStyles.stackContainer}> {selectedStacks?.map((stack, index) => (
                                <span key={index} className={stackStyles.stackBadge}>{stack}</span>
                            ))} </div>
                        </div>
                    </div>
                </div>
                <textarea className={styles.postContent} name="content" value={projectInfo.content} onInput={handleInput} placeholder="내용을 입력하시오."/>
            </div>
            <button className={styles.submit} onClick={createProject}>{projectId ? "수정하기" : "등록하기"}</button>
        </div>
        </>
    )
}
export default CreatePost;