import React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../style/Member.module.css";
import profile from "../../assets/profile.jpg";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faCalendar,
  faCamera,
  faEllipsisVertical,
  faMinus,
  faPen,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import CustomCalendar from "../../components/Calendar/CustomCalendar";

//>> Component
/* ✅ 팀 카드  */
const Teamcard = React.memo(
  ({ Team, onClick, getbgColor, setclick_pos, setclick_btn, click_btn }) => {
    return (
      <div onClick={onClick} className={styles.Teamcard}>
        {Team.team_image.startsWith("hsl(") ? (
          <div
            className={styles.Teamimg}
            style={{ backgroundColor: Team.team_image }}
          ></div>
        ) : Team.team_image.startsWith("http") ? (
          <img
            src={Team.team_image}
            alt="미리보기"
            className={styles.Teamimg}
          ></img>
        ) : (
          <div
            className={styles.Teamimg}
            style={{ backgroundColor: getbgColor() }}
          ></div>
        )}

        <div className={styles.Teamdata}>
          <p
            style={{
              width: "650px",
              maxwidth: "650px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {Team.team_name}
          </p>
          <div className={styles.rolebadge}>
            {Team.owner ? "owner" : "member"}
          </div>
          <div
            className={styles.TeamSet}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              onMouseDown={(e) => {
                e.stopPropagation();
                setclick_pos(-1);
                setclick_btn(!click_btn);
                console.log(`btn${click_btn}`);
              }}
              style={{ height: "20px", width: "20px", opacity: "0.4" }}
            />
          </div>
        </div>
      </div>
    );
  }
);

/* ✅ 멤버 리스트 */
const Membercomponent = ({
  name,
  position,
  role,
  member_id,
  member_img,
  addMember,
  AddTeammember,
  delete_mem,
  minus_member,
  set_minus_member,
  me,
  click_pos,
  setclick_pos,
  posbtnRef,
  my_pos,
  modifyPos,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {addMember ? <AddTeammember /> : ""}
      <li
        className={styles.Memberlistset}
        onClick={() => {
          //Checkbox 클릭 효과
          if (delete_mem && role === "member") {
            if (minus_member.includes(member_id)) {
              set_minus_member(minus_member.filter((n) => n !== member_id));
            } else {
              set_minus_member([...minus_member, member_id]);
            }
          }
        }}
      >
        <div className={styles.Memberlistset_left}>
          {delete_mem && role === "member" ? (
            <input
              type="checkbox"
              checked={minus_member.includes(member_id)}
              onChange={(e) => {
                if (e.target.checked) {
                  set_minus_member([...minus_member, member_id]);
                } else {
                  set_minus_member(minus_member.filter((n) => n !== member_id));
                }
              }}
              style={{ marginLeft: "-5px", marginRight: "12px" }}
            ></input>
          ) : (
            ""
          )}

          <img
            onClick={() =>
              me !== name && !delete_mem ? navigate(`/user/${name}`) : ""
            }
            className={styles.Memberimg}
            src={member_img === null ? profile : member_img}
            alt="memberprofile"
          ></img>
          <p className={styles.Memberimgdata}>{name}</p>
          {me == name && position != null ? (
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                if (click_pos == -1) {
                  setclick_pos(true);
                } else setclick_pos(!click_pos);
              }}
              className={styles.Memberimgdata}
              style={{ marginLeft: "25px", textAlign: "center" }}
            >
              <span className={styles.button} style={{ fontSize: "14px" }}>
                {position}
              </span>
            </div>
          ) : (
            <>
              <p
                className={styles.Memberimgdata}
                style={{ textAlign: "center", marginLeft: "25px" }}
              >
                {position}
              </p>
            </>
          )}

          {me == name && position == null ? (
            <div
              onMouseDown={(e) => {
                e.stopPropagation();
                if (click_pos == -1) {
                  setclick_pos(true);
                } else setclick_pos(!click_pos);
              }}
              className={styles.add_button}
              style={{ marginLeft: "-66px" }}
            >
              <i className="fas fa-plus fa-xs" style={{ opacity: "0.5" }}></i>
              <div style={{ fontSize: "14px", marginBottom: "1px" }}> 추가</div>
            </div>
          ) : (
            ""
          )}

          {me == name ? (
            <div
              ref={posbtnRef}
              className={
                click_pos == -1
                  ? styles.hidden
                  : click_pos
                  ? styles.click_pos
                  : styles.unclick_pos
              }
              style={{ display: "flex", gap: "10px", marginLeft: "10px" }}
            >
              {my_pos.map(
                (item, key) =>
                  item != position && (
                    <div
                      key={key}
                      onClick={() => {
                        modifyPos(item, member_id);
                        setclick_pos(!click_pos);
                      }}
                      className={styles.add_button}
                      style={{ fontSize: "14px" }}
                    >
                      {item}
                    </div>
                  )
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "70px",
          }}
        >
          <div className={styles.rolebadge}>{role}</div>{" "}
        </div>
      </li>
    </>
  );
};

const Member = React.memo(
  function Member(props) {
    const [click, setclick] = useState(0); //멤버 리스트
    const [click_pos, setclick_pos] = useState(0); //멤버 포지션
    const [click_btn, setclick_btn] = useState(0);
    const [modify, setmodify] = useState(0); //팀 수정
    const [calendar, setCalendar] = useState(0); //캘린더
    const [modify_mem, setmodify_mem] = useState(0);
    const [delete_mem, setdelete_mem] = useState(0);
    const [addMember, setaddMember] = useState(0);
    const [modify_img, setmodify_img] = useState(0);
    const [member, setmember] = useState([]); // team 별 멤버 관리
    const [new_member, set_new_member] = useState([]); //새 멤버 추가
    const [minus_member, set_minus_member] = useState([]); // 멤버 삭제
    const [uploadImgUrl, setUploadImgUrl] = useState(""); //profile img
    const [selectedFile, setSelectedFile] = useState(null); // 실제 img
    const btnRef = useRef(null);
    const posbtnRef = useRef(null);

    const { Team, onTeamNameChange, deleteTeamNameChange, teamName, me } =
      props; // ✅ 본인 team 및 전체 team_name 변경 콜백 함수.
    const my_pos = [
      "백엔드",
      "프론트",
      "디자이너",
      "모바일",
      "인공지능",
      "게임",
    ];

    const handleTeamClick = useCallback(() => {
      setclick((c) => !c);
      setCalendar(false); // ✅ 캘린더 닫기
      getMemberlist();
      setclick_pos(-1);
    }, []);

    {
      /* 버튼 외부 감지 */
    }
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (btnRef.current && !btnRef.current.contains(e.target)) {
          setclick_btn(false); // 바깥 클릭하면 버튼 닫기
          if (modify_mem) setmodify_mem(false);
        }
      };

      const handlePosClickOutside = (e) => {
        if (
          posbtnRef.current &&
          !posbtnRef.current.contains(e.target) &&
          click_pos == 1
        ) {
          setclick_pos(0);
        }
      };

      if (click_btn || modify_mem) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      if (posbtnRef) {
        document.addEventListener("mousedown", handlePosClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("mousedown", handlePosClickOutside);
      };
    }, [click_btn, modify_mem, click_pos]);

    /*✅ 팀 멤버 GET */
    const getMemberlist = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.get(
          `/api/myteams/team/${Team.team_id}/member`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setmember(res.data.members);
        console.log(res.data);
      } catch (err) {
        if (err.response) {
          console.error(
            "서버 응답 에러:",
            err.response.status,
            err.response.data
          );
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /* ✅ 팀 수정 POST */
    const modifyTeam = async (newName) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.post(
          `/api/myteams/team/name/${Team.team_id}`,
          { teamName: newName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (selectedFile) {
          const form = new FormData();
          form.append("file", selectedFile);
          try {
            const imgRes = await axios.post(
              `/api/myteams/team/image/${Team.team_id}`,
              form,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const newImageUrl = imgRes.data.teamImage;

            setUploadImgUrl(newImageUrl);
            setSelectedFile(null);

            onTeamNameChange(Team.team_id, Team.team_name, newImageUrl);
          } catch (err) {
            setUploadImgUrl("");
            setSelectedFile(null);
            if (err.response) {
              console.error(
                "서버 응답 에러:",
                err.response.status,
                err.response.data
              );
            } else {
              console.error("요청 자체 실패:", err.message);
            }
          }
        }
        onTeamNameChange(Team.team_id, newName);
        console.log(res.data);
      } catch (err) {
        if (err.response) {
          console.error(
            "서버 응답 에러:",
            err.response.status,
            err.response.data
          );
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /*✅ 팀 이미지 Delete */
    const handleImageDelete = async (e) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }

      try {
        const res = await axios.delete(
          `/api/myteams/team/del_img/${Team.team_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res.data);
        setSelectedFile(null);
        setUploadImgUrl("");
        setmodify_img(0);
        onTeamNameChange(Team.team_id, Team.team_name, res.data.teamImage);
      } catch (err) {
        if (err.response) {
          console.error(
            "서버 응답 에러:",
            err.response.status,
            err.response.data
          );
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /* ✅ 포지션 POST */
    const modifyPos = async (newPos, member_id) => {
      const token = localStorage.getItem("accessToken");
      const encodedMemberId = encodeURIComponent(member_id);
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }
      try {
        const res = await axios.post(
          `/api/myteams/team/member/position/${encodedMemberId}`,
          { team_role: newPos },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(res.data);
        setclick_pos(-1);
        getMemberlist();
      } catch (err) {
        if (err.response) {
          console.error(
            "서버 응답 에러:",
            err.response.status,
            err.response.data
          );
        } else {
          console.error("요청 자체 실패:", err.message);
        }
      }
    };

    /* ✅ 멤버 POST */
    const add_member = async (e, inputdata) => {
      e.preventDefault(); // 폼 제출 막기
      console.log(inputdata);
      const token = localStorage.getItem("accessToken");
      const encodedTeamId = encodeURIComponent(Team.team_id);
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }

      const trimmedNickname = inputdata.trim();
      const existingNicknames = member.map((m) => m.name); // 현재 팀원 닉네임 리스트

      // 만약 입력창에 닉네임이 있는데 아직 new_member에 없고, 기존 팀에도 없으면 추가
      const isAlreadyInList =
        new_member.includes(trimmedNickname) ||
        existingNicknames.includes(trimmedNickname);
      let updatedMemberList = [...new_member];
      if (trimmedNickname && !isAlreadyInList) {
        updatedMemberList.push(trimmedNickname);
      }

      let successList = [];
      let failList = [];
      let duplicateList = [];

      for (const nickname of updatedMemberList) {
        if (existingNicknames.includes(nickname)) {
          duplicateList.push(nickname);
          continue;
        }

        try {
          const res = await axios.post(
            `/api/myteams/team/${encodedTeamId}/member/create`,
            { nickname },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`${nickname} 추가됨`, res.data);
          successList.push(nickname);
        } catch (err) {
          console.error(`${nickname} 추가 실패`);
          if (err.response) {
            console.error(
              "서버 응답 에러:",
              err.response.status,
              err.response.data
            );
          } else {
            console.error("요청 자체 실패:", err.message);
          }
          failList.push(nickname);
        }
      }

      // 사용자에게 결과 알림
      if (failList.length > 0) {
        alert(`${failList.join(", ")}은(는) 존재하지 않는 사용자입니다.`);
        setaddMember(0);
        set_new_member([]);
      }

      if (successList.length > 0) {
        setaddMember(0);
        set_new_member([]);
        getMemberlist(); // 새로고침
      }
    };

    /* ✅ 멤버 DELETE */
    const delete_member = async (e) => {
      e.preventDefault(); // 폼 제출 막기

      const token = localStorage.getItem("accessToken");
      const encodedTeamId = encodeURIComponent(Team.team_id);
      if (!token) {
        console.warn("로그인을 먼저 하세요.");
        return;
      }

      if (minus_member.length === 0) {
        alert("삭제할 팀원을 선택하세요.");
        return;
      }

      let successList = [];
      let failList = [];

      for (const nickname of minus_member) {
        try {
          const res = await axios.post(
            `/api/myteams/team/${encodedTeamId}/member/delete`,
            { member_id: nickname },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(`${nickname} 삭제됨`, res.data);
          successList.push(nickname);
        } catch (err) {
          console.error(`${nickname} 삭제 실패`);
          if (err.response) {
            console.error(
              "서버 응답 에러:",
              err.response.status,
              err.response.data
            );
          } else {
            console.error("요청 자체 실패:", err.message);
          }
          failList.push(nickname);
        }
      }

      // 사용자에게 결과 알림
      if (failList.length > 0) {
        alert(`${failList.join(", ")}은(는) 존재하지 않는 사용자입니다.`);
      }

      if (successList.length > 0) {
        set_minus_member([]);
        setdelete_mem(0);
        getMemberlist(); // 새로고침
      }
    };

    /* ✅ 팀 이미지 색상 */
    const getbgColor = () => {
      const hueRanges = [
        [180, 200], // 하늘색
        [200, 240], // 파랑
      ];

      const [minHue, maxHue] =
        hueRanges[Math.floor(Math.random() * hueRanges.length)];

      const h = Math.floor(Math.random() * (maxHue - minHue)) + minHue;
      const s = Math.floor(Math.random() * 20) + 60; // 채도
      const l = Math.floor(Math.random() * 20) + 75; // 밝기

      return `hsl(${h}, ${s}%, ${l}%)`;
    };

    /* ✅ 이미지 로드 */
    const onchangeImageUpload = (e) => {
      const { files } = e.target;
      const uploadFile = files[0];
      if (!uploadFile) return;
      setSelectedFile(uploadFile);
      setmodify_img(0);

      const reader = new FileReader();
      reader.readAsDataURL(uploadFile);
      reader.onloadend = () => {
        setUploadImgUrl(reader.result);
      };
      console.log(uploadFile);
    };

    /* ✅ 팀 이름 수정 event */
    const inputRef = useRef();
    const handleSubmit = (e, data) => {
      e.preventDefault();
      const newTeamName = inputRef.current.value.trim();
      setmodify(0);
      //입력 유무 검사
      if (!newTeamName) {
        alert("팀 이름을 입력해주세요.");
        return;
      }

      //중복 검사
      const isDuplicate = teamName.some(
        (name) => name === newTeamName && name !== data
      );
      if (isDuplicate) {
        alert("이미 존재하는 팀 이름입니다. 다른 이름을 입력해주세요.");
        return;
      }
      // 기존 팀 이름 삭제 후 새로운 팀 이름 추가
      const updatedTeamNames = teamName.filter((name) => name !== data);
      updatedTeamNames.push(newTeamName);
      deleteTeamNameChange(updatedTeamNames);

      modifyTeam(newTeamName);
      setmodify(!modify);
    };

    //>> Component
    /* ✅ 팀원 추가 모달  */
    const AddTeammember = () => {
      const [nickname, setNickname] = useState(""); // 멤버 nickname

      const handleAddMember = () => {
        const trimmed = nickname.trim();
        const isAlreadyAdded = new_member.includes(trimmed);
        const isAlreadyInTeam = member.some((m) => m.name === trimmed);

        if (!trimmed) return;
        if (isAlreadyAdded || isAlreadyInTeam) {
          alert("이미 추가된 팀원이거나 팀에 있는 사용자입니다.");
          return;
        }

        set_new_member((prev) => [...prev, trimmed]);
        setNickname("");
      };

      return (
        <div
          className={styles.modalOuter}
          onClick={() => {
            setaddMember(!addMember);
            set_new_member([]);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <form
              className={`${styles.modalcard} ${styles.modal}`}
              onSubmit={(e) => add_member(e, nickname)}
            >
              <p
                style={{
                  width: "90%",
                  fontSize: "24px",
                  marginBottom: "10px",
                  fontWeight: "700",
                }}
              >
                팀원 모집
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90%",
                  marginBottom: "30px",
                  marginLeft: "10px",
                }}
              >
                <i
                  class="fas fa-user-plus"
                  style={{
                    opacity: "0.4",
                    marginRight: "10px",
                    fontSize: "1.2em",
                    marginTop: "4px",
                  }}
                ></i>
                <div>
                  <p style={{ fontSize: "15px", color: "rgba(0,0,0,0.5)" }}>
                    닉네임으로 팀원을 추가하세요.
                  </p>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="text"
                  className={styles.modal_input}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                ></input>
                <span
                  style={{ marginLeft: "8px" }}
                  onClick={() => handleAddMember()}
                >
                  <i className="fas fa-plus" style={{ opacity: "0.4" }}></i>{" "}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "75%",
                  textAlign: "center",
                  marginBottom: "15px",
                  gap: "8px",
                  color: "rgba(0,0,0,0.5)",
                  flexWrap: "wrap",
                }}
              >
                {new_member.map((item, key) => {
                  {
                    console.log(new_member);
                  }
                  return (
                    <p
                      key={key}
                      style={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {" "}
                      {item}{" "}
                    </p>
                  );
                })}
              </div>

              <button
                type="submit"
                className={styles.modal_save}
                style={{ width: "80%", textAlign: "center", padding: "8px 0" }}
              >
                모집완료
              </button>
              <div
                style={{
                  fontSize: "14px",
                  color: "rgba(0,0,0,0.4)",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                ※ 팀원 추가 후 모집 완료해주세요.
              </div>
            </form>
          </div>
        </div>
      );
    };

    /* ✅ 팀 이름 수정 모달  */
    const fileInputRef = useRef();
    const modify_Teamname_modal = () => {
      return (
        <div
          className={styles.modalOuter}
          onClick={() => {
            setmodify(!modify);
            setmodify_img(0);
            setUploadImgUrl("");
          }}
        >
          <form
            onSubmit={(e) => handleSubmit(e, Team.team_name)}
            className={`${styles.Teamcard} ${styles.modal}`}
            style={{ position: "relative", width: "620px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Team 이미지 (1) 이미지 색상 오류 or hsl() 색상 (2) teamimage */}
            {(!Team.team_image.startsWith("hsl(") &&
              !Team.team_image.startsWith("http")) ||
            Team.team_image.startsWith("hsl(") ? (
              <div
                className={styles.Teamimg}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: uploadImgUrl
                    ? "white"
                    : Team.team_image.startsWith("hsl(")
                    ? Team.team_image
                    : getbgColor(),
                }}
              >
                {uploadImgUrl ? (
                  <img
                    src={uploadImgUrl}
                    alt="미리보기"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></img>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={onchangeImageUpload}
                  style={{ display: "none" }}
                ></input>
                <FontAwesomeIcon
                  icon={faCamera}
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                  style={{
                    fontSize: "28px",
                    color: "rgba(0, 0, 0, 0.4)",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                />
              </div>
            ) : (
              <div
                className={styles.Teamimg}
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                {uploadImgUrl ? (
                  <img
                    src={uploadImgUrl}
                    alt="미리보기"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></img>
                ) : Team.team_image.startsWith("http") ? (
                  <img
                    src={Team.team_image}
                    alt="미리보기"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "15px",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                  ></img>
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={onchangeImageUpload}
                  style={{ display: "none" }}
                ></input>
                <FontAwesomeIcon
                  icon={faPen}
                  onClick={() => setmodify_img(!modify_img)}
                  style={{
                    fontSize: "28px",
                    color: "rgba(0, 0, 0, 0.4)",
                    cursor: "pointer",
                    zIndex: 1,
                  }}
                />
              </div>
            )}
            {modify_img ? (
              <div
                style={{
                  position: "absolute",
                  left: "60px",
                  bottom: "25px",
                  display: "flex",
                  color: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={styles.img_btn}
                  style={{ borderRight: "1px solid rgba(0,0,0,0.2)" }}
                >
                  변경
                </div>
                <div onClick={handleImageDelete} className={styles.img_btn}>
                  삭제
                </div>
              </div>
            ) : (
              ""
            )}
            <input
              ref={inputRef}
              type="text"
              style={{
                fontWeight: "700",
                fontSize: "24px",
                marginLeft: "20px",
              }}
              defaultValue={Team.team_name}
            />
            <button type="submit" className={styles.modal_submit}>
              SAVE
            </button>
          </form>
        </div>
      );
    };

    return (
      <section style={{ position: "relative" }}>
        {/* TEAM CARD */}
        <Teamcard
          Team={Team}
          onClick={handleTeamClick}
          getbgColor={getbgColor}
          setclick_pos={setclick_pos}
          click_btn={click_btn}
          setclick_btn={setclick_btn}
        />

        {/* TEAM btn (팀 수정, 캘린더) */}
        {click_btn ? (
          <div
            ref={btnRef}
            style={{
              position: "absolute",
              right: Team.owner ? "-65px" : "-20px",
              top: "60px",
              color: "rgba(0,0,0,0.6)",
              display: "flex",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {/* 캘린더 버튼 */}
            <div
              onClick={() => {
                setCalendar((prev) => !prev);
                setclick(false);
                setmodify(false);
              }}
              className={styles.team_btn}
              style={{ borderRight: "1px solid rgba(0,0,0,0.2)" }}
            >
              <FontAwesomeIcon icon={faCalendar} style={{ opacity: "0.5" }} />
            </div>

            {/* 수정 버튼 */}
            {Team.owner ? (
              <div
                onClick={() => {
                  setmodify((prev) => !prev);
                  setclick(false);
                  setCalendar(false);
                }}
                className={styles.team_btn}
              >
                <FontAwesomeIcon icon={faPen} style={{ opacity: "0.6" }} />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {/* TEAM 수정 모달 */}
        {modify ? modify_Teamname_modal() : ""}

        {/* 캘린더 렌더링 */}
        {calendar ? <CustomCalendar teamId={Team.team_id} /> : ""}

        {/* TEAM 멤버 수정 모달 */}
        {member.length != 1 && Team.owner && modify_mem ? (
          <div
            ref={btnRef}
            style={{
              position: "absolute",
              right: "-75px",
              top: "170px",
              fontSize: "14px",
              border: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "6px",
            }}
          >
            <div
              onClick={() => {
                setaddMember(!addMember);
                setmodify_mem(0);
              }}
              className={styles.modify_mem}
              style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
            >
              <FontAwesomeIcon
                icon={faPlus}
                style={{ opacity: "0.4", marginRight: "5px" }}
              />
              팀원 추가
            </div>
            <div
              onClick={() => {
                setdelete_mem(!delete_mem);
                setmodify_mem(0);
              }}
              className={styles.modify_mem}
            >
              <FontAwesomeIcon
                icon={faMinus}
                style={{ opacity: "0.4", marginRight: "5px" }}
              />
              팀원 삭제
            </div>
          </div>
        ) : (
          ""
        )}

        {/* TEAM 멤버 삭제 버튼 */}
        {delete_mem ? (
          <div style={{ position: "absolute", right: "-85px", bottom: "30px" }}>
            <button
              onClick={() => {
                set_minus_member([]);
                setdelete_mem(0);
              }}
              className={styles.deletebtn}
              style={{ marginRight: "6px" }}
            >
              취소
            </button>
            <button onClick={delete_member} className={styles.deletebtn}>
              삭제
            </button>
          </div>
        ) : (
          ""
        )}

        {/* MEMBER LIST */}
        {click ? (
          <ul
            className={`${styles.Memberlist} ${styles.visible}`}
            style={{ position: "relative" }}
          >
            {/* MEMBER LIST - HEADER */}
            <li className={styles.Memberheader}>
              {member.length != 1 && Team.owner && (
                <FontAwesomeIcon
                  icon={faAngleRight}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setmodify_mem(!modify_mem);
                    setclick_pos(-1);
                    setclick_btn(0);
                  }}
                  style={{
                    position: "absolute",
                    right: "15px",
                    opacity: "0.5",
                  }}
                />
              )}
              <div style={{ display: "flex" }}>
                <p className={styles.Memberimgdata}>NAME</p>
                <p
                  className={styles.Memberimgdata}
                  style={{ marginLeft: "30px" }}
                >
                  POSITION
                </p>
              </div>
              <p
                style={{
                  width: "70px",
                  marginRight: "15px",
                  textAlign: "center",
                }}
              >
                ROLE
              </p>
            </li>

            {/* MEMBER LIST - DATA */}
            {member.map((item, key) => (
              <Membercomponent
                key={key}
                name={item.name}
                position={item.team_role}
                role={item.owner ? "owner" : "member"}
                member_id={item.member_id}
                member_img={item.image_url}
                addMember={addMember}
                AddTeammember={AddTeammember}
                delete_mem={delete_mem}
                minus_member={minus_member}
                set_minus_member={set_minus_member}
                me={me}
                click_pos={click_pos}
                setclick_pos={setclick_pos}
                posbtnRef={posbtnRef}
                my_pos={my_pos}
                modifyPos={modifyPos}
              />
            ))}

            {member.length === 1 ? (
              <div
                onClick={() => {
                  setaddMember(!addMember);
                  setclick_pos(-1);
                }}
                className={styles.add_team}
              >
                <i
                  className="fas fa-user-plus fa-lg"
                  style={{ opacity: "0.4", marginRight: "10px" }}
                ></i>
                <p style={{ marginBottom: "2px" }}>팀원을 모집하세요.</p>
              </div>
            ) : (
              ""
            )}
          </ul>
        ) : (
          ""
        )}
      </section>
    );
  },
  (prevProps, nextProps) => {
    // true 반환 시 리렌더링 안 함, false 면 리렌더링 함
    return (
      prevProps.Team.team_id === nextProps.Team.team_id &&
      prevProps.Team.team_name === nextProps.Team.team_name &&
      prevProps.me === nextProps.me &&
      prevProps.Team.team_image === nextProps.Team.team_image
      // 비교할 props
    );
  }
);
export default React.memo(Member);
