import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import axios from "axios";
import styles from "./CustomCalendar.module.css";  // ✅ CSS 모듈 import

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const subtractOneDay = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() - 1);
  return result;
};

const formatToJSDate = (oracleDateStr) => {
  return new Date(oracleDateStr);
};

export default function CustomCalendar({ teamId }) {
  const [events, setEvents] = useState([]);
  const [localEvents, setLocalEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const token = localStorage.getItem("accessToken");

  const fetchEvents = async () => {
    if (!token || !teamId) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    try {
      const response = await axios.get(`/api/myteams/team/${teamId}/calendar`, {
        params: { year, month },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = (response.data?.calendars ?? [])
        .map((item) => ({
          id: item.cal_id,
          title: item.content,
          start: formatToJSDate(item.start),
          end: subtractOneDay(formatToJSDate(item.end)),
        }))
        .sort((a, b) => a.id - b.id);

      setEvents(data);
    } catch (error) {
      console.error("일정 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [teamId, currentDate]);

  const handleSelectSlot =async ({ start, end }) => {
    const selectedDate = formatDate(start);
    const adjustedEnd = new Date(end);
    adjustedEnd.setDate(adjustedEnd.getDate()-1);
    const totalEventsToday = [...events, ...localEvents].filter(
    (e) => formatDate(e.start) === selectedDate
  ).length;

  if (totalEventsToday >= 3) {
    alert("해당 날짜에는 이미 3개의 일정이 있습니다.");
    return;
  }
    
    const title = window.prompt("일정 제목을 입력하세요");
    if (!title) return;

    const tempId = `temp-${Date.now()}`;
    const localNewEvent = {
      id: tempId,
      title: title,
      start: formatDate(start),
      end: formatDate(subtractOneDay(end)),
    };

    setLocalEvents((prev) => [...prev, localNewEvent]);

    const newEvent = {
      content: title,
      start: formatDate(start),
      end: formatDate(adjustedEnd),
    };

    try {
      await axios.post(`/api/myteams/team/${teamId}/calendar/add`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchEvents();
      setLocalEvents([]);
    } catch (error) {
      console.error("일정 추가 실패:", error);
    }
  };

  const handleDoubleClickEvent = async (event) => {
    if (!window.confirm(`${event.title} 일정을 삭제할까요?`)) return;

    try {
      await axios.delete(`/api/myteams/team/calendar/${event.id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchEvents();
    } catch (error) {
      console.error("일정 삭제 실패:", error);
    }
  };

  const handleEventDrop = async ({ event, start, end }) => {
    try {
      const adjustedEnd = new Date(end);
    adjustedEnd.setDate(adjustedEnd.getDate() + 1);
      await axios.put(
        `/api/myteams/team/calendar/${event.id}/modify`,
        {
          content: event.title,
          start: formatDate(start),
          end: formatDate(adjustedEnd),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchEvents();
    } catch (error) {
      console.error("일정 이동 실패:", error);
    }
  };

  const handleEventResize = async ({ event, start, end }) => {
    try {
      const adjustedEnd = new Date(end);
    adjustedEnd.setDate(adjustedEnd.getDate() + 1);
      await axios.put(
        `/api/myteams/team/calendar/${event.id}/modify`,
        {
          content: event.title,
          start: formatDate(start),
          end: formatDate(adjustedEnd),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchEvents();
    } catch (error) {
      console.error("일정 리사이징 실패:", error);
    }
  };

  return (
    <div className={styles.calendarWrapper}>
      <DragAndDropCalendar
        localizer={localizer}
        events={[...events, ...localEvents]}
        defaultView="month"
        views={["month"]}
        startAccessor="start"
        endAccessor="end"
        selectable
        resizable
        onSelectSlot={handleSelectSlot}
        onDoubleClickEvent={handleDoubleClickEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        popup
        date={currentDate}
        rowLimit={3}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        style={{ height: "87vh", width: "100%" }}
      />
    </div>
  );
}
