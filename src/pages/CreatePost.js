import React, { useRef } from "react";
import styles from "../style/CreatePost.module.css"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const CreatePost =()=> {
    // 공통된 textarea 높이 자동 조절 함수
    const textareaRef = useRef(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        textarea.style.height = "auto"; // 높이 초기화
        textarea.style.height = textarea.scrollHeight + "px"; // 컨텐츠에 맞게 높이 조정
    };
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.component}>
                <div className={styles.backArrow}><ArrowBackIosIcon/></div>
                <div className={styles.top}>
                    <textarea className={styles.title} ref={textareaRef} onInput={handleInput} placeholder="프로젝트 제목"></textarea>
                    <div className={styles.content}>
                        <div className={styles.row}>
                            <input className={styles.name} type="text" placeholder="팀 이름"/>
                        </div>
                        <div className={styles.row}>
                            <input className={styles.name}type="text" placeholder="모집 분야"/>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.inputLabel}>모집 마감 일</label>
                            <input className={styles.name} type="date" placeholder=""/>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.inputLabel}>모집 인원</label>
                            <input className={styles.name} type="number" placeholder="모집 인원"/>
                        </div>
                        <div className={styles.row}>
                            <label className={styles.inputLabel}>프로젝트 시작 일</label>
                            <input className={styles.name} type="date" placeholder=""/>
                        </div>
                        <div className={styles.row}>
                            <input className={styles.name} type="text" placeholder="사용 언어"/>
                        </div>
                    </div>
                </div>
                <textarea className={styles.postContent} ref={textareaRef} onInput={handleInput} placeholder="내용을 입력하시오."/>
            </div>
            <button className={styles.submit}>제출하기</button>
        </div>
        </>
    )
}
export default CreatePost;