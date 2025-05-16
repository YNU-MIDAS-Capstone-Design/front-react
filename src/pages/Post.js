import { useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AuthPostSideBar from '../components/postSideBar/AuthPostSideBar';
import styles from '../style/Post.module.css';
import commentStyles from '../style/PostComment.module.css';

const Post = () =>{
    const [isAuthor, setIsAuthor] = useState(true); // 작성자 여부 상태
  
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.component}>
                <div className={styles.backArrow}><ArrowBackIosIcon/></div>
                <div className={styles.top}>
                    <div className={styles.title}>주식 예측 ai 웹사이트 프론트 구합니다!</div>
                    <div className={styles.uerInfo}>
                        <div className={styles.userName}>User</div>
                        <div className={styles.views}>조회수 234회</div>
                        <div className={styles.uploadDate}>2025.03.12</div>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <span className={styles.name}>팀 이름</span>
                            <span className={styles.contentName}>Dev Match 외 인하대학의 여러 동아리 모임들</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 분야</span>
                            <span className={styles.contentName}>frontend</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 마감 일</span>
                            <span className={styles.contentName}>2025.04.16</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>모집 인원</span>
                            <span className={styles.contentName}>2명</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>프로젝트 시작 일</span>
                            <span className={styles.contentName}>미정</span>
                        </div>
                        <div className={styles.row}>
                            <span className={styles.name}>사용 언어</span>
                            <span className={styles.contentName}>JavaScript React Spring Node.js 외 다른 다양한 언어 사용 예정</span>
                        </div>
                    </div>
                </div>
                <div className={styles.postContent}>
                    안녕하세요 프론트 구합니다<br/>
                    연락은 웹 쪽지 / 이메일로 부탁드립니다<br/>
                    경험 있는 분이면 좋겠습니다<br/>
                    <br/>
                    감사합니다.<br/>
                </div>
                {/* {Array.from({ length: 30 }).map((_, i) => (
                    <p key={i}>test data</p>
                ))} */}
                <div style={{marginTop:'100px'}}>
                    <div className={commentStyles.commentInput}>
                        <div className={commentStyles.reply}>
                            댓글
                            <span className={commentStyles.commentCount}>0</span>
                        </div>
                        <div className={commentStyles.inputContainer}>
                            <textarea className = {commentStyles.inputComment} typeof='text'/>
                        </div>
                        <div className={commentStyles.buttonWrapper}>
                            <button className={commentStyles.submitButton}>댓글 등록</button>
                        </div>
                    </div>
                    <ul className={commentStyles.commentList}>
                        <li className={commentStyles.commentContainer}>
                            <section className={commentStyles.commentHeader}>
                                <div className={commentStyles.commentInfo}>
                                    <span className={commentStyles.commentUserName}>User 1</span>
                                    <span className={commentStyles.commentDate}>2025.03.21</span>
                                </div>
                            </section>
                            <section className={commentStyles.commentContent}>
                                <p className={commentStyles.comment}>
                                    안녕하세요 프론트 구한다고 하셔서 연락 드립니다.
                                </p>
                            </section>
                        </li>
                        <li className={commentStyles.commentContainer}>
                            <section className={commentStyles.commentHeader}>
                                <div className={commentStyles.commentInfo}>
                                    <span className={commentStyles.commentUserName}>User 1</span>
                                    <span className={commentStyles.commentDate}>2025.03.21</span>
                                </div>
                            </section>
                            <section className={commentStyles.commentContent}>
                                <p className={commentStyles.comment}>
                                    안녕하세요 프론트 구한다고 하셔서 연락 드립니다.
                                </p>
                            </section>
                        </li>
                    </ul>
                </div>
            </div>
            <aside className={styles.sideBar}>
                <AuthPostSideBar isAuthor={isAuthor} />
            </aside>
        </div>
        </>
    )
}

export default Post;