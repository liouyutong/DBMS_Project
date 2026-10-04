import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sent.module.css';

export default function Sent({ userData }) {
  const navigate = useNavigate();
  const [letters, setLetters] = useState([]);
  const [filterReceiver, setFilterReceiver] = useState('');
  const [error, setError] = useState('');

  const currentId = userData.currentUserId;

  // 抓取寄信紀錄
  useEffect(() => {
    if (!currentId) return;

    const fetchLetters = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/mail/sent/${currentId}`);
        if (!res.ok) {
          const data = await res.json();
          setError(data.detail || '抓取寄信紀錄失敗');
          return;
        }
        const data = await res.json();
        setLetters(data.sent || []);
      } catch (err) {
        console.error(err);
        setError('抓取寄信紀錄失敗');
      }
    };

    fetchLetters();
  }, [currentId]);

  // 過濾信件（依收件人）
  const filtered = filterReceiver
    ? letters.filter(l => l.receiver_id === Number(filterReceiver))
    : letters;

  return (
    <div className={styles.container}>
      <h1>寄信紀錄</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 10 }}>
        <label>選擇收件人: </label>
        <select value={filterReceiver} onChange={e => setFilterReceiver(e.target.value)}>
          <option value="">全部收件人</option>
          {[...new Set(letters.map(l => l.receiver_id))].map(id => {
            const receiver = letters.find(l => l.receiver_id === id);
            return (
              <option key={id} value={id}>
                {receiver.receiver_name} ({id})
              </option>
            );
          })}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>沒有寄出的信件</p>
      ) : (
        filtered.map((l, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <button
              style={{ padding: '5px 10px', cursor: 'pointer' }}
              onClick={() =>
                alert(
                  `收件人: ${l.receiver_name} (${l.receiver_id})\n時間: ${new Date(l.timestamp).toLocaleString()}\n內容: ${l.content}`
                )
              }
            >
              {l.receiver_name}: {l.content.slice(0, 20)}...
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
