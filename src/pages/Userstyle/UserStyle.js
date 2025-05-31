import { useState } from "react";
import styles from "../../style/UserStyle.module.css";
import { useNavigate } from "react-router-dom";

function UserStyle() {
  const stack = [
    //백엔드
    "Nodejs",
    "Java",
    "Spring",
    "Express",
    "Django",
    "Flask",
    "NestJS",
    "MySQL",
    "MongoDB",
    "Docker",
    "AWS",

    //프론트
    "JavaScript",
    "HTML",
    "CSS",
    "React",
    "Vue",

    //디자이너
    "Figma",
    "Illustrator",
    "Adobe_XD",

    //모바일 앱
    "Android",
    "Kotlin",
    "Swift",
    "Flutter",

    //인공지능
    "Python",
    "AI",
    "BigData",

    //게임+기타
    "Unity",
    "UnrealEngine",
    "C_SHARP", //C#
    "C_PLUS", //C++
    "IoT",
    "security",
  ];
  const career = ["학생", "전공자", "비전공자", "회사원", "프리랜서", "기타"];
  const locate = [
    "경기도",
    "강원도",
    "충청북도",
    "충청남도",
    "전라북도",
    "전라남도",
    "경상북도",
    "경상남도",
  ];
  const [stage, setstage] = useState(0);
  const [click, setclick] = useState(0);
  const [multiselect, setmultiselect] = useState([]);
  const [select, setselect] = useState({
    care: -1,
    EI: -1,
    SN: -1,
    TF: -1,
    JP: -1,
    loca: -1,
  });

  const navigate = useNavigate();

  const isactive = (key) => {
    let check = 0;
    for (let i = 0; i < multiselect.length; i++)
      if (multiselect[i] === key) check++;
    if (check > 1) {
      setmultiselect(multiselect.filter((data) => data !== key));
    }
    return check;
  };
  const handleNext = () => {
    const selectedStacks = multiselect.map((index) => stack[index]);
    const selectedCareer = career[select.care] || null;
    const selectedLocation = locate[select.loca] || null;

    if (selectedStacks.length === 0 || !selectedCareer || !selectedLocation) {
      alert("모든 정보를 선택해주세요!");
      return;
    }

    navigate("/mbtitest", {
      state: {
        stacks: selectedStacks,
        career: selectedCareer,
        location: selectedLocation,
      },
    });
  };

  function stageDot() {
    const result = [];
    for (let i = 1; i < 5; i++)
      result.push(
        <div
          key={i}
          className={`${styles.StageDot} ${
            stage >= i ? styles.Buttonclick : ""
          }`}
        >
        
        </div>
      );
    return result;
  }

  function MbtiButton(mbti) {
    const result = [];
    for (let i = 0; i < mbti.length; i++)
      result.push(
        <div
          key={i}
          className={`${styles.Button} ${styles.MbtiButton} ${
            select[mbti] === mbti[i] ? styles.Buttonclick : ""
          }`}
          onClick={() => {
            setselect((prev) => {
              return select[mbti] === mbti[i]
                ? { ...prev, [mbti]: -1 }
                : { ...prev, [mbti]: mbti[i] };
            });
          }}
        >
          {mbti[i]}
        </div>
      );
    return result;
  }

  // ✅ 적용 버튼 클릭 이벤트
  const handleApply = () => {
    const selectedStacks = multiselect.map((index) => stack[index]);
    const selectedCareer = career[select.care] || null;
    const selectedLocation = locate[select.loca] || null;

    // 필수 입력 여부 확인 (옵션)
    if (selectedStacks.length === 0 || !selectedCareer || !selectedLocation) {
      alert("모든 정보를 선택해주세요!");
      return;
    }

    // ✅ MBTI 검사 페이지로 이동하면서 선택값 전달
    navigate("/mbtitest", {
      state: {
        stacks: selectedStacks,
        career: selectedCareer,
        location: selectedLocation,
      },
    });
  };

  return (
    <div className={styles.View}>
      <div className={styles.StyleBox}>
        <div className={styles.StageBox}></div>
        <p className={styles.title}>당신의 스타일을 알려주세요</p>

        <div className={styles.MiddleBox}>
          {stack.map((item, key) => (
            <div
              key={key}
              onClick={() => {
                setmultiselect((prev) => [...prev, key]);
              }}
              className={`${styles.Button} ${
                isactive(key) % 2 ? styles.Buttonclick : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className={styles.MiddleBox}>
          {career.map((item, key) => (
            <div
              key={key}
              onClick={() => {
                setselect((prev) => {
                  return select.care === key
                    ? { ...prev, care: -1 }
                    : { ...prev, care: key };
                });
              }}
              className={`${styles.Button} ${
                select.care === key ? styles.Buttonclick : ""
              }`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className={styles.MiddleBox}>
          <p className={styles.Dropdown}>위치</p>
          <div>
            <button
              onClick={() => {
                setclick(!click);
              }}
              className={`${styles.Dropdown} ${
                select.loca === -1 ? "" : styles.Buttonclick
              }`}
            >
              <div style={{ paddingLeft: "10px" }}></div>
              {select.loca > -1 ? `${locate[select.loca]}` : `시/도`}
              <i
                className={
                  click === 0 ? "fas fa-caret-down xl" : "fas fa-caret-up xl"
                }
                style={{ paddingRight: "10px" }}
              ></i>
            </button>
            <ul
              className={`${
                click === 0
                  ? styles.hidden
                  : `${styles.Dropdown} ${styles.visible}`
              }`}
            >
              {locate.map((item, key) => (
                <li
                  key={key}
                  className={styles.DropList}
                  onClick={() => {
                    setclick(!click);
                    setselect((prev) => {
                      return { ...prev, loca: key };
                    });
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.DoneBox}>
          <div className={styles.DoneButton}>초기화</div>
          <div className={styles.DoneButton} onClick={handleNext}>
            다음
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserStyle;
