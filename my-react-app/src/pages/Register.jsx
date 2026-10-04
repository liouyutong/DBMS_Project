// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';

export default function Register({ userData, setUserData }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    try {
      // 1️⃣ 呼叫註冊 API
      const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.message || '註冊失敗');
        return;
      }

      const userId = data.user_id;

      // 2️⃣ 註冊成功後，立刻呼叫 /auth/{user_id} 取得 profile（含暱稱）
      const profileRes = await fetch(`http://127.0.0.1:8000/profile/${userId}`);
      const profile = await profileRes.json();

      // 3️⃣ 更新全域 userData，讓 Dashboard 立刻讀到 nickname
      setUserData(prev => ({
        ...prev,
        currentUserId: userId,
        profile: profile,
        users: [
          ...(prev.users || []),
          { id: profile.id, name: profile.nickname }
        ],
        mailbox: [],
        sent: []
      }));

      alert(`註冊成功！使用者 ID: ${userId}`);
      navigate('/dashboard');

    } catch (err) {
      console.error('註冊錯誤:', err);
      setError('註冊發生錯誤，請稍後再試');
    }
  };

  return (
    <div className={styles.container}>
      <h1>註冊</h1>
      {error && <p className={styles.error}>{error}</p>}

      <input
        placeholder="Email"
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
        <button className={styles.primaryButton} onClick={() => navigate('/')}>
          返回登入頁面
        </button>
        <button className={styles.primaryButton} onClick={handleRegister}>
          註冊
        </button>
      </div>
    </div>
  );
}
