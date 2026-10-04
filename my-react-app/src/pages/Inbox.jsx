import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Inbox.module.css';

export default function Inbox({ userData }) {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [filterSender, setFilterSender] = useState('');
  const [error, setError] = useState('');

  const currentId = userData.currentUserId;

  // 抓取收件箱信件
  useEffect(() => {
    if (!currentId) return;

    const fetchLetters = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/mail/inbox/${currentId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.detail || '抓取信件失敗');
          return;
        }
        const data = await res.json();
        setLetters(data.letters || []);
      } catch (err) {
        console.error(err);
        setError('抓取信件失敗');
      }
    };

    fetchLetters();
  }, [currentId]);

  // 過濾信件
  const filtered = filterSender
    ? letters.filter(l => l.sender_id === Number(filterSender))
    : letters;

  return (
    <div className={styles.container}>
      <h1>收信紀錄</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 10 }}>
        <label>選擇寄件人: </label>
        <select value={filterSender} onChange={e => setFilterSender(e.target.value)}>
          <option value="">全部寄件人</option>
          {[...new Set(letters.map(l => l.sender_id))].map(id => {
            const sender = letters.find(l => l.sender_id === id);
            return (
              <option key={id} value={id}>
                {sender.sender_name} ({id})
              </option>
            );
          })}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>沒有信件</p>
      ) : (
        filtered.map((l, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <button
              style={{ padding: '5px 10px', cursor: 'pointer' }}
              onClick={() =>
                alert(
                  `寄件人: ${l.sender_name} (${l.sender_id})\n時間: ${l.timestamp}\n內容: ${l.content}`
                )
              }
            >
              {l.sender_name}: {l.content.slice(0, 20)}...
            </button>
          </div>
        ))
      )}

      <div style={{ marginTop: 20 }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '5px 15px' }}>
          返回
        </button>
      </div>
    </div>
  );
}
