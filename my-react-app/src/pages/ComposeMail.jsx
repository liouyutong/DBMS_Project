import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from './ComposeMail.module.css';

export default function ComposeMail({ userData, currentUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const prefillId = location.state?.toId || "";
  const prevSearch = location.state?.prevSearch || null;

  const [toId, setToId] = useState(prefillId);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!toId || !content) {
      alert("請填寫收信人ID和信件內容");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/mail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: Number(currentUser),
          receiver_id: Number(toId),
          content
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "寄信失敗");
        return;
      }

      alert(`寄信成功！寄送時間: ${data.timestamp}`);

      if (prevSearch) navigate("/search-result", { state: prevSearch });
      else navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("寄信失敗，請稍後再試");
    }
  };

  return (
    <div className={styles.container}>
      <h2>寫信</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ margin: "10px 0" }}>
        <label>收信人ID：</label>
        {prefillId ? (
          <input value={toId} disabled />
        ) : (
          <input value={toId} onChange={e => setToId(e.target.value)} />
        )}
      </div>

      <div style={{ margin: "10px 0" }}>
        <label>信件內容：</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={5}
          cols={50}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() =>
            prevSearch ? navigate("/search-result", { state: prevSearch }) : navigate("/dashboard")
          }
          style={{ marginRight: 10 }}
        >
          返回
        </button>
        <button onClick={handleSend}>確認寄信</button>
      </div>
    </div>
  );
}
