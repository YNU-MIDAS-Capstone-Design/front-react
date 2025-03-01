import React, { useState } from "react";

function App() {
    const [message, setMessage] = useState("Hi"); // 초기값은 "Hi"

    // 데이터를 가져오는 함수
    const fetchData = () => {
        fetch("/api/hello") // 백엔드 API 호출
            .then(response => response.json())
            .then(data => setMessage(data.message)) // 응답 데이터를 상태에 저장
            .catch(error => console.error("Error fetching data:", error));
    };

    return (
        <div>
            <h1>{message}</h1> {/* 처음엔 "Hi", 이후엔 백엔드 데이터 */}
            <button onClick={fetchData}>데이터 갱신</button> {/* 버튼 클릭 시 fetchData 실행 */}
        </div>
    );
}

export default App;