import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../style/UserStyle.module.css";
import mbti from "../../assets/mbti.png";

const questions = [
  {
    id: 1,
    text: "프로젝트 첫 미팅에서 당신은 어떤 타입?",
    options: [
      { id: "1-1", text: "먼저 말을 걸며 분위기를 푼다", type: "E" },
      { id: "1-2", text: "기다리며 조용히 타이밍을 본다", type: "I" },
      { id: "1-3", text: "밝은 농담으로 대화를 주도한다", type: "E" },
      { id: "1-4", text: "상대의 말을 먼저 듣고 판단한다", type: "I" },
    ],
  },
  {
    id: 2,
    text: "새로운 기술을 접했을 때 당신은?",
    options: [
      { id: "2-1", text: "일단 써보면서 배우는 게 빠르다", type: "S" },
      { id: "2-2", text: "기술의 철학과 배경부터 조사한다", type: "N" },
      { id: "2-3", text: "기존 기술과 비교해보며 접근한다", type: "S" },
      { id: "2-4", text: "장기적으로 어떤 가치가 있을지 본다", type: "N" },
    ],
  },
  {
    id: 3,
    text: "동료가 마감 기한을 넘겼을 때, 당신은?",
    options: [
      { id: "3-1", text: "왜 그랬는지 과정을 분석한다", type: "T" },
      { id: "3-2", text: "무리한 일정이었는지 공감한다", type: "F" },
      { id: "3-3", text: "다음엔 개선 방안을 제안한다", type: "T" },
      { id: "3-4", text: "먼저 위로하고 상황을 정리한다", type: "F" },
    ],
  },
  {
    id: 4,
    text: "회의 중 논쟁이 생겼을 때, 당신의 반응은?",
    options: [
      { id: "4-1", text: "논리적으로 정리해보자고 한다", type: "T" },
      { id: "4-2", text: "서로 감정이 상하지 않게 유도한다", type: "F" },
      { id: "4-3", text: "기준을 정해서 판단하자고 한다", type: "T" },
      { id: "4-4", text: "상대의 감정을 먼저 고려한다", type: "F" },
    ],
  },
  {
    id: 5,
    text: "프로젝트를 시작할 때 당신은?",
    options: [
      { id: "5-1", text: "계획표를 만들고 구조부터 잡는다", type: "J" },
      { id: "5-2", text: "일단 시작하고 흐름을 본다", type: "P" },
      { id: "5-3", text: "해야 할 일부터 목록을 정리한다", type: "J" },
      { id: "5-4", text: "일이 생기면 그때그때 처리한다", type: "P" },
    ],
  },
  {
    id: 6,
    text: "예상치 못한 이슈가 생겼을 때, 당신은?",
    options: [
      { id: "6-1", text: "기존 계획에 맞춰 우선순위를 조정한다", type: "J" },
      { id: "6-2", text: "상황에 따라 유동적으로 바꾼다", type: "P" },
      { id: "6-3", text: "당황하지 않고 대응 시나리오를 찾는다", type: "J" },
      { id: "6-4", text: "계획 없이 유연하게 해결한다", type: "P" },
    ],
  },
  {
    id: 7,
    text: "친구와의 약속에 대해 당신은?",
    options: [
      { id: "7-1", text: "미리 장소와 시간을 확정한다", type: "J" },
      { id: "7-2", text: "그날 기분 따라 정한다", type: "P" },
      { id: "7-3", text: "계획을 세우고 미리 알려준다", type: "J" },
      { id: "7-4", text: "흐름에 따라 자연스럽게 만난다", type: "P" },
    ],
  },
  {
    id: 8,
    text: "아이디어 회의에서 당신은?",
    options: [
      { id: "8-1", text: "현실적인 아이디어부터 제시한다", type: "S" },
      { id: "8-2", text: "추상적이고 참신한 방향을 제시한다", type: "N" },
      { id: "8-3", text: "예시와 근거를 중심으로 설명한다", type: "S" },
      { id: "8-4", text: "미래적인 가능성을 상상하며 말한다", type: "N" },
    ],
  },
];

function MbtiTest() {
  const navigate = useNavigate();
  const location = useLocation();

  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [result, setResult] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(-1);

  const handleSelect = (id, type) => {
    const updated = [...answers];
    updated[currentQuestion] = { id, type };
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentQuestion === -1) {
      setCurrentQuestion(0);
    } else if (answers[currentQuestion] === null) {
      alert("옵션을 선택해주세요.");
    } else if (currentQuestion === questions.length - 1) {
      calculateMbti(answers);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentQuestion === 0) {
      setCurrentQuestion(-1);
    }
  };

  const calculateMbti = (answerList) => {
    const count = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    answerList.forEach((answer) => {
      if (answer?.type) count[answer.type]++;
    });
    const mbti =
      (count.E >= count.I ? "E" : "I") +
      (count.S >= count.N ? "S" : "N") +
      (count.T >= count.F ? "T" : "F") +
      (count.J >= count.P ? "J" : "P");
    setResult(mbti);
  };

  const handleSaveProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("로그인이 필요합니다.");
      return false;
    }

    const { stacks, career, location: userLocation } = location.state;
    const payload = {
      techStacks: stacks,
      job: career,
      location: userLocation,
      mbti: result,
    };

    try {
      const res = await axios.patch("/api/users/me", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("프로필 저장 성공:", res.data);
      return true;
    } catch (err) {
      console.error("프로필 저장 실패:", err);
      return false;
    }
  };

  return (
    <div className={styles.View}>
      <div className={styles.StyleBox} style={{ textAlign: "center" }}>
        {currentQuestion === -1 && !result && (
          <>
            <p className={styles.title}>당신의 MBTI 성향을 알려주세요</p>
            <div className={styles.DoneBox} style={{ flexDirection: "column" }}>
              <img
                src={mbti}
                alt="MBTI illustration"
                style={{ width: "300px", marginBottom: "20px" }}
              />
              <div className={styles.DoneButton} onClick={handleNext}>
                MBTI 검사 시작하기
              </div>
            </div>
          </>
        )}

        {currentQuestion >= 0 &&
          currentQuestion < questions.length &&
          !result && (
            <>
              <div className={styles.StageBox}>
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`${styles.StageDot} ${
                      i < answers.filter(Boolean).length
                        ? styles.Buttonclick
                        : ""
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div
                className={styles.MiddleBox}
                style={{ flexDirection: "column", alignItems: "center" }}
              >
                <p style={{ fontSize: "22px", fontWeight: "bold" }}>
                  {questions[currentQuestion].text}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  {questions[currentQuestion].options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`${styles.Button} ${
                        answers[currentQuestion]?.id === opt.id
                          ? styles.Buttonclick
                          : ""
                      }`}
                      onClick={() => handleSelect(opt.id, opt.type)}
                    >
                      {opt.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.DoneBox}>
                <div className={styles.DoneButton} onClick={handleBack}>
                  이전
                </div>
                <div className={styles.DoneButton} onClick={handleNext}>
                  {currentQuestion === questions.length - 1
                    ? "결과 보기"
                    : "다음"}
                </div>
              </div>
            </>
          )}

        {result && (
          <>
            <div className={styles.MiddleBox}>
              <p style={{ fontSize: "20px" }}>
                당신의 MBTI는&nbsp;<b>{result}</b>&nbsp;입니다.
              </p>
            </div>
            <div className={styles.DoneBox}>
              <div
                className={styles.DoneButton}
                onClick={async () => {
                  const success = await handleSaveProfile();
                  if (success) navigate("/mypage");
                }}
              >
                프로필 저장하기
              </div>

              <div
                className={styles.DoneButton}
                onClick={async () => {
                  const success = await handleSaveProfile();
                  if (success) navigate("/");
                }}
              >
                홈으로 가기
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MbtiTest;
