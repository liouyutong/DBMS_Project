import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BlockList.module.css';

export default function BlockList({ userData, setUserData, currentUser }) {
  const navigate = useNavigate();
  const curId = currentUser || userData.currentUserId;

  const [friends, setFriends] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [error, setError] = useState('');

  // 抓取好友名單
  useEffect(() => {
    if (!curId) return;

    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/friend/list/${curId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || "抓取好友名單失敗");
          return;
        }
        setFriends(data.friends || []);
      } catch (err) {
        console.error(err);
        setError("抓取好友名單失敗");
      }
    };

    fetchFriends();
  }, [curId]);

  // 抓取封鎖名單
  useEffect(() => {
    if (!curId) return;

    const fetchBlocked = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/block/list/${curId}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || "取得封鎖名單失敗");
          return;
        }
        setBlocked(data.blocked || []);
      } catch (err) {
        console.error(err);
        setError("取得封鎖名單失敗");
      }
    };

    fetchBlocked();
  }, [curId]);

  // 拉黑好友
  const handleBlock = async () => {
    if (!selectedFriend) return;
    setError('');

    try {
      const res = await fetch("http://127.0.0.1:8000/block/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: curId, partner_id: Number(selectedFriend) })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "拉黑失敗");
        return;
      }
      setBlocked(prev => [...prev, Number(selectedFriend)]);
      setSelectedFriend('');
    } catch (err) {
      console.error(err);
      setError("拉黑失敗");
    }
  };

  // 解除封鎖
  const handleUnblock = async (id) => {
    setError('');
    try {
      const res = await fetch("http://127.0.0.1:8000/block/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: curId, partner_id: id })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "解除封鎖失敗");
        return;
      }
      setBlocked(prev => prev.filter(b => b !== id));
    } catch (err) {
      console.error(err);
      setError("解除封鎖失敗");
    }
  };

  return (
    <div className={styles.container}>
      <h1>封鎖名單</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>拉黑好友</h3>
      <select value={selectedFriend} onChange={e => setSelectedFriend(e.target.value)}>
        <option value="">選擇好友ID</option>
        {friends.filter(f => !blocked.includes(f)).map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <div style={{ display: 'flex', gap: 8, marginTop: 5 }}>
        <button onClick={() => navigate('/dashboard')}>返回</button>
        <button onClick={handleBlock}>拉黑</button>
      </div>

      <h3 style={{ marginTop: 20 }}>已封鎖名單</h3>
      {blocked.length === 0 ? (
        <p>目前沒有封鎖的好友</p>
      ) : (
        blocked.map(b => (
          <div key={b} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>{b}</span>
            <button onClick={() => handleUnblock(b)}>解除封鎖</button>
          </div>
        ))
      )}
    </div>
  );
}
