import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Mailbox.module.css';

export default function Mailbox({ userData }) {
  const navigate = useNavigate();
  return (
    <div className={styles.container}>
      <h1>信箱</h1>
      <button onClick={() => navigate('/inbox')}>收信紀錄</button>
      <button onClick={() => navigate('/sent')}>寄信紀錄</button>
      <button onClick={() => navigate('/dashboard')}>返回個人主頁</button>
    </div>
  );
}
