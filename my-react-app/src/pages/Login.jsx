// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export default function Login({ userData, setUserData, fetchAllData }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      // 1️⃣ 呼叫登入 API
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || '登入失敗');
        return;
      }

      const userId = data.user_id;
      if (!userId) {
        setError('登入回傳資料錯誤');
        return;
      }

      // 2️⃣ 取得使用者個人資料
      const profileResp = await fetch(`http://127.0.0.1:8000/profile/${userId}`);
      if (!profileResp.ok) {
        setError('取得使用者資料失敗');
        return;
      }
      const profileData = await profileResp.json();

      // 3️⃣ 更新 userData
      setUserData(prev => ({
        ...prev,
        currentUserId: userId,
        // 將 users 陣列加入登入的使用者，Dashboard 才能抓到 ID
        users: [{ id: userId, name: profileData.nickname || '未設定暱稱' }],
        profile: profileData || {}
      }));

    
      alert(`登入成功！使用者 ID: ${userId}`);
      navigate('/dashboard');

    } catch (err) {
      console.error('登入錯誤:', err);
      setError('登入發生錯誤，請稍後再試');
    }
  };

  return (
    <div className={styles.container}>
      <h1>登入</h1>
      {error && <p className={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="信箱"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={styles.inputField}
      />
      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className={styles.inputField}
      />

      <div className={styles.buttonGroup}>
        <button className={styles.primaryButton} onClick={() => navigate('/register')}>
          註冊
        </button>
        <button className={styles.primaryButton} onClick={handleLogin}>
          登入
        </button>
      </div>
    </div>
  );
}
