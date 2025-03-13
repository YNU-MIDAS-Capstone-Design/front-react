import {useState} from 'react';
import styles from '../style/UserStyle.module.css';

function UserStyle(){
    const stack=['C', 'Java', 'Python', 'Js', 'React', 'HTML/CSS', 'Spring', 'SQL', 'Kotlin' ,'TypeScript', '머신러닝', '데이터 분석', 'Android', 'iOS', 'Unity', 'Swift', 'Vue.js', 'Linux', 'JQuery'];
    const career=['학생', '전공자', '비전공자', '회사원', '프리랜서', '기타'];
    const locate=['서울특별시','인천광역시', '대구광역시', '부산광역시', '대전광역시', '광주광역시', '울산광역시',' 세종특별시', '경기도', '강원도', '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];
    const[stage, setstage] = useState(0);
    const[click, setclick] = useState(0);
    const[multiselect, setmultiselect]=useState([]);
    const[select, setselect]=useState({"care":-1, "EI":-1, "SN":-1, "TF":-1, "JP":-1, "loca":-1});
    const isactive = (key) => {
        let check=0;
        for(let i=0; i<multiselect.length; i++)
            if(multiselect[i]===key) check++;
        if(check>1) {setmultiselect(multiselect.filter(data=>data !== key));}
        return check; }

    function stageDot(){
        const result=[];
        for(let i=1; i<5; i++) result.push(<div className={`${styles.StageDot} ${stage>=i ? styles.Buttonclick : ""}`}>{i}</div>)
        return result; }

    function MbtiButton(mbti){
        const result=[];
        for(let i=0; i < mbti.length; i++)
            result.push(<div className={`${styles.Button} ${styles.MbtiButton} ${select[mbti]===mbti[i] ? styles.Buttonclick : ""}`} 
            onClick={()=>{setselect((prev)=>{return select[mbti]===mbti[i] ? {...prev, [mbti]:-1} : {...prev, [mbti]: mbti[i]}});}}>
            {mbti[i]}</div>)
        return result;}
    
    return(
        <div className={`${styles.View} ${click==0 ? "" : styles.View_list}`}>
        <div className={styles.StyleBox}>
        <div className={styles.StageBox}>
                {stageDot()}
        </div>
        <p className={styles.title}>당신의 스타일을 알려주세요</p>
        <div className={styles.MiddleBox}>
            {stack.map((item, key)=>
                <div onClick={()=>{setmultiselect((prev)=>[...prev,key])}} 
                className={`${styles.Button} ${isactive(key)%2 ? styles.Buttonclick : ""}`}>{item}</div>)}
        </div>
        <div className={styles.MiddleBox}>
            {career.map((item, key)=>
            <div onClick={()=>{setselect((prev)=>{return select.care===key ? {...prev, care:-1} : {...prev, care:key}});}} 
            className={`${styles.Button} ${select.care===key ? styles.Buttonclick : ""}`}>{item}</div>)}
        </div>
        <div className={styles.MiddleBox}>
            <div className={styles.MbtiBox}>{MbtiButton('EI')}</div>
            <div className={styles.MbtiBox}>{MbtiButton('SN')}</div>
            <div className={styles.MbtiBox}>{MbtiButton('TF')}</div>
            <div className={styles.MbtiBox}>{MbtiButton('JP')}</div>
        </div>
        <div className={styles.MiddleBox}>
            <p className={styles.Dropdown}>위치</p>
            <div>
            <button onClick={()=>{setclick(!click);}} className={`${styles.Dropdown} ${select.loca === -1 ? "": styles.Buttonclick}`}>
                <div></div>
                {select.loca > -1 ?  `${locate[select.loca]}` : `시/도`}
                <i class={click==0 ? "fas fa-caret-down xl" : "fas fa-caret-up xl"}></i>
            </button>
            <ul className={`${click==0 ? styles.hidden : `${styles.Dropdown} ${styles.visible}`}`}>
            {locate.map((item, key)=> 
            <li className={styles.DropList} onClick={()=>{setclick(!click); setselect((prev)=>{return {...prev,loca:key}})}}>{item}</li> )}
            </ul>
            </div>
        </div>
        <div className={styles.DoneBox}>           
            <div className={styles.DoneButton}>초기화</div>
            <div className={styles.DoneButton}>적용</div>
        </div> 
        </div>
        </div>
    );
}
export default UserStyle;