import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export default function Dashboard({ userData, setUserData }) {
  const navigate = useNavigate();

  const currentUser = (userData.users || []).find(u => u.id === userData.currentUserId) || {};
  const nickname = userData.profile.nickname || currentUser.name || '未設定暱稱';
  const userId = currentUser.id ?? '無ID';

  const handleLogout = () => {
    setUserData(prev => ({
      ...prev,
      profile: {},
      mailbox: [],
      sent: [],
      currentUserId: null
    }));
    navigate('/');
  };

  return (
    <div className={styles.dashboardContainer}>
      <h1>個人主頁</h1>
      <p>暱稱：{nickname}</p>
      <p>ID：{userId}</p>

      <div className={styles.buttonsContainer}>
        <button onClick={() => navigate('/profile-setup')}>設定個人資料</button>
        <button onClick={() => navigate('/mailbox')}>信箱</button>
        <button onClick={() => navigate('/compose')}>寄信</button>
        <button onClick={() => navigate('/blocklist')}>封鎖名單</button>
        <button onClick={() => navigate('/search')}>搜尋頁面</button>
        <button style={{ width: 200 }} onClick={() => navigate('/ranking')}>排行榜</button>
      </div>

      <button className={styles.logoutButton} onClick={handleLogout}>登出</button>
    </div>
  );
}
