import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "./ScheduleModal.module.css";

const localizer = momentLocalizer(moment);

const ScheduleModal = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]); // ✅ 여러 개 일정 저장 가능
  const [selectedDate, setSelectedDate] = useState(null); // ✅ 선택한 날짜
  const [newEvent, setNewEvent] = useState(""); // ✅ 새 일정 제목
  const [selectedEvent, setSelectedEvent] = useState(null); // ✅ 삭제할 일정 선택

  if (!isOpen) return null;

  // ✅ 일정 저장
  const handleSaveEvent = () => {
    if (!newEvent.trim()) return alert("일정을 입력하세요!");

    const newEventData = {
      id: Date.now(), // ✅ 고유 ID 생성
      title: newEvent,
      start: selectedDate,
      end: selectedDate,
    };

    setEvents((prevEvents) => [...prevEvents, newEventData]); // ✅ 기존 일정 유지하면서 추가
    setNewEvent(""); // 입력 필드 초기화
    setSelectedDate(null); // 일정 추가 후 모달 닫기
  };

  // ✅ 일정 삭제
  const handleDeleteEvent = () => {
    if (!selectedEvent) return;
    const confirmDelete = window.confirm(`"${selectedEvent.title}" 일정을 삭제하시겠습니까?`);
    if (confirmDelete) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEvent.id));
      setSelectedEvent(null); // ✅ 삭제 후 선택 초기화
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>✖</button>
        <h2>📅 일정 관리</h2>

        <div style={{ height: "500px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            defaultView="month"
            selectable={true}
            onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)} // ✅ 날짜 선택 시 입력창 띄우기
            onSelectEvent={(event) => setSelectedEvent(event)} // ✅ 일정 클릭 시 선택
          />
        </div>
      </div>

      {/* ✅ 일정 추가 모달 */}
      {selectedDate && (
        <div className={styles.eventModal}>
          <h3>{moment(selectedDate).format("YYYY-MM-DD")} 일정 추가</h3>
          <input
            type="text"
            placeholder="일정 제목 입력"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            className={styles.inputField}
          />
          <button className={styles.saveButton} onClick={handleSaveEvent}>
            저장
          </button>
        </div>
      )}

      {/* ✅ 일정 삭제 모달 */}
      {selectedEvent && (
        <div className={styles.eventModal}>
          <h3>{selectedEvent.title} 삭제</h3>
          <button className={styles.deleteButton} onClick={handleDeleteEvent}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleModal;
