// src/pages/EmailCheckTest.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EmailCheckTest() {
  const [message, setMessage] = useState('⏳ 응답 대기 중...');

  useEffect(() => {
    axios.get('/api/users/check-email', {
      params: { email: 'test@example.com' }
    })
    .then(res => {
      console.log('✅ 연동 성공:', res.data); // 콘솔 로그
      setMessage("✅ 연동 성공: " + JSON.stringify(res.data));
    })
    .catch(err => {
      console.error('❌ 연동 실패:', err); // 콘솔 로그
      setMessage("❌ 연동 실패: " + err.message);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>연동 테스트 결과</h2>
      <p>{message}</p>
    </div>
  );
}

export default EmailCheckTest;
