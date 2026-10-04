// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// 登入/註冊
import Login from './pages/Login';
import Register from './pages/Register';

// 個人主頁
import Dashboard from './pages/Dashboard';

// 個人資料
import ProfileSetup from './pages/ProfileSetup';
import ProfileInterest from './pages/ProfileInterest';

// 信箱
import Mailbox from './pages/Mailbox';
import Inbox from './pages/Inbox';
import Sent from './pages/Sent';
import ComposeMail from './pages/ComposeMail';

// 搜尋
import Search from './pages/Search';
import SearchResult from './pages/SearchResult';
import UserProfile from './pages/UserProfile';

// 封鎖名單
import BlockList from './pages/BlockList';
// 排行榜
import Ranking from './pages/Ranking'

function App() {
  // userData 改成存放從後端抓到的所有資料
  const [userData, setUserData] = useState({
    currentUserId: null,
    users: [],
    auths: [],
    interests: [],
    languages: [],
    block_list: [],
    letters: [],
    profile: {}, // 登入後會放自己的資料
  });

  

  return (
    <Routes>
      {/* 登入 / 註冊 */}
      <Route path="/" element={<Login userData={userData} setUserData={setUserData}  />} />
      <Route path="/register" element={<Register userData={userData} setUserData={setUserData}  />} />

      {/* 個人主頁 */}
      <Route path="/dashboard" element={<Dashboard userData={userData} setUserData={setUserData} />} />

      {/* 個人資料設定 */}
      <Route path="/profile-setup" element={<ProfileSetup userData={userData} setUserData={setUserData} />} />
      <Route path="/profile-interest" element={<ProfileInterest userData={userData} setUserData={setUserData} />} />

      {/* 信箱 */}
      <Route path="/mailbox" element={<Mailbox userData={userData} />} />
      <Route path="/inbox" element={<Inbox userData={userData} setUserData={setUserData} />} />
      <Route path="/sent" element={<Sent userData={userData} currentUser={userData.currentUserId} />} />
      <Route path="/compose" element={<ComposeMail userData={userData} setUserData={setUserData} currentUser={userData.currentUserId} />} />

      {/* 搜尋 */}
      <Route path="/search" element={<Search userData={userData} />} />
      <Route path="/search-result" element={<SearchResult userData={userData} />} />

      {/* 搜尋結果點進去的他人頁面 */}
      <Route path="/user/:id" element={<UserProfile userData={userData} />} />

      {/* 封鎖名單 */}
      <Route path="/blocklist" element={<BlockList userData={userData} setUserData={setUserData} currentUser={userData.currentUserId} />} />
      
      {/* 排行榜 */} 
      <Route path="/ranking" element={<Ranking userData={userData} />} />

    </Routes>
  );
}

export default App;
