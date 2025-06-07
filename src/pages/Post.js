import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AuthPostSideBar from '../components/postSideBar/AuthPostSideBar';
import styles from '../style/Post.module.css';
import commentStyles from '../style/PostComment.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate , useParams } from 'react-router-dom';

const Post = () =>{
    const navigate = useNavigate();
    const [isAuthor, setIsAuthor] = useState(); // 작성자 여부 상태
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [userNickname ,setUserNickname] = useState();
    const [comments , setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");

    const token = localStorage.getItem("accessToken");
    
    useEffect(()=>{
        if (!token) {
            alert("로그인 하세요!");
            navigate("/login");
            return;
        }  
        axios.get(`/api/users/me`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res)=>{
            setUserNickname(res.data.nickname);
        })
        .catch((err)=>{
            console.error("데이터를 불러오지 못했습니다.",err);
        })
    },[token])
    useEffect(() => {
        if (!userNickname) return;

        // 프로젝트 상세 보기
        axios.get(`/api/project/${projectId}/view`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            setProject(res.data.project);
            console.log("저장 데이터: ", res.data.project);
            setIsAuthor(res.data.project.writer === userNickname);
        })
        .catch((err) => {
            console.error("프로젝트 조회 실패", err);
        });
        // 프로젝트 댓글 보기
        fetchComments();
    }, [userNickname, projectId, token]);

    const projectCompletedBtn = () =>{
        if (!isAuthor) return;

        const payload = {
            ...project,
            processing: "모집완료",
        };

        axios.put(`/api/project/${projectId}/edit`, payload,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(() => {
                alert("상태가 변경되었습니다!");
                navigate(`/Post/${Number(projectId)}`);
            })
            .catch((err) => {
                console.error(err);
                alert("수정 실패");
            });
        
    }

    const fetchComments =()=>{
        axios.get(`/api/project/${projectId}/comment/list`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((commentRes)=> {
            setComments(commentRes.data.comments);
        })
        .catch((commentErr)=>{
            console.error("댓글 조회 실패", commentErr);
        })
    }
    
    const [reply, setReply] = useState({
        message:"",
    })
    const createComments =()=>{
        axios.post(`/api/project/${projectId}/comment`,reply,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res)=>{
            alert("댓글 등록 되었습니다.");
            setReply({ message: "" });
            fetchComments();
        })
        .catch((err)=>{
                alert("글 등록 실패하였습니다.");
        })
    }
    const editComment = (commentId, currentMessage) => {
        setEditingCommentId(commentId);
        setEditedMessage(currentMessage);
    };
    const submitEditedComment = (commentId) => {
        axios.put(`/api/project/comment/${commentId}/edit`, { message: editedMessage }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert("댓글 수정 완료");
            setEditingCommentId(null);
            fetchComments();
        })
        .catch(err => {
            console.error("댓글 수정 실패", err);
            alert("댓글 수정에 실패했습니다.");
        });
    };

    const deleteComment =(commentId)=>{
        axios.delete(`/api/project/comment/${commentId}/delete`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(()=>{
            alert("댓글이 삭제되었습니다.");
            fetchComments();
        })
        .catch((err)=>{
            console.log("댓글 삭제 실패했습니다.",err);
        })
    }

    const deleteProjectPost = ()=>{
        axios.delete(`/api/project/${projectId}/delete`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(()=>{
            alert("삭제 완료되었습니다.");
            navigate('/');
        })
        .catch((err)=>{
            alert(err.data.status);
        })
    }

    if (!project) return <p>로딩 중...</p>;  
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.component}>
                <div className={styles.backArrow} onClick={() => navigate(-1)}><ArrowBackIosIcon/></div>
                <div className={styles.top}>
                    <div className={styles.title}>{project?.title ??  "로딩 중 ..."}

                    </div>
                    <div className={styles.uerInfo}>
                        <div>{project?.writer}</div>
                        <div>조회수 {project?.viewCount}</div>
                        <div>작성 일 {project?.createdAt.split("T")[0]}</div>
                        <div>{project?.processing}</div>
                        {isAuthor ? (
                            project.processing == "모집완료" ? (
                                <button className={styles.authorBtn} onClick={deleteProjectPost}>삭제</button>
                            ):
                            (
                            <div className={styles.authorAction}>
                                <button className={styles.authorBtn} onClick={projectCompletedBtn}>모집 완료 | </button>
                                <button className={styles.authorBtn} onClick={() => navigate(`/CreatePost/edit/${projectId}`)}>수정</button>
                                <button className={styles.authorBtn} onClick={deleteProjectPost}>삭제</button>
                            </div>
                            )
                        ) : null}
                    </div>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <span className={styles.name}>모임 위치</span>
                            <span className={styles.contentName}>{project?.meet_location}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 분야</span>
                            <span className={styles.contentName}>{project?.recruitmentField}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 인원</span>
                            <span className={styles.contentName}>{project?.people}</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>사용 기술</span>
                            <div className={styles.stackContainer}> {project?.stackList?.map((stack, index) => (
                                <span key={index} className={styles.stackBadge}>{stack}</span>
                            ))} </div>
                        </div>
                    </div>
                </div>
                <div className={styles.postContent}>{project?.content}</div>
                <div style={{marginTop:'100px'}}>
                    <div className={commentStyles.commentInput}>
                        <div className={commentStyles.reply}>
                            댓글
                            <span className={commentStyles.commentCount}>{comments.length}</span>
                        </div>
                        <div className={commentStyles.inputContainer}>
                            <textarea className = {commentStyles.inputComment} value={reply.message} 
                            onChange={(e) => setReply({ ...reply, message: e.target.value })}/>
                        </div>
                        <div className={commentStyles.buttonWrapper}>
                            <button className={commentStyles.submitButton} onClick={createComments}>댓글 등록</button>
                        </div>
                    </div>
                    <ul className={commentStyles.commentList}>
                        {Array.isArray(comments) && comments.map((comment) => (
                            <li key={comment.commentId} className={commentStyles.commentContainer}>
                            <section className={commentStyles.commentHeader}>
                                <div className={commentStyles.commentInfo}>
                                    <div className={commentStyles.commentBtn}>
                                        <span className={commentStyles.commentUserName}>{comment.writer}</span>
                                        {comment.writer === userNickname && (
                                        <div className={commentStyles.btnContainer}>
                                            {editingCommentId === comment.commentId ? (<div/>):(
                                                <>
                                                <button className={styles.authorBtn} onClick={() => editComment(comment.commentId, comment.message)}>수정</button>
                                                <button className={styles.authorBtn} onClick={() => deleteComment(comment.commentId)}>삭제</button>
                                                </>
                                            )}
                                            </div>
                                        )}
                                    </div>
                                    <span className={commentStyles.commentDate}>
                                        {comment.createdAt.split("T")[0]}
                                    </span>
                                </div>
                            </section>
                            <section className={commentStyles.commentContent}>
                                {editingCommentId === comment.commentId ? (
                                    <div className={commentStyles.editWrapper}>
                                        <textarea
                                        className={commentStyles.editTextarea}
                                        value={editedMessage}
                                        onChange={(e) => setEditedMessage(e.target.value)}
                                        />
                                        <button
                                        className={styles.authorBtn}
                                        onClick={() => submitEditedComment(comment.commentId)}
                                        >
                                        완료
                                        </button>
                                    </div>
                                    ) : (
                                    <p className={commentStyles.comment}>{comment.message}</p>
                                )}
                            </section>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <aside className={styles.sideBar}>
                <AuthPostSideBar isAuthor={isAuthor} token={token} projectId = {projectId} processing = {project.processing}/>
            </aside>
        </div>
        </>
    )
}

export default Post;