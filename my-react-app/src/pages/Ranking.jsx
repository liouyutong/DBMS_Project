// src/pages/Ranking.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Ranking.module.css";

export default function Ranking() {
  const navigate = useNavigate();
  const [topInterests, setTopInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopInterests = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/ranking/top_interests");
        if (!res.ok) throw new Error("Failed to fetch ranking");
        const data = await res.json();
        setTopInterests(data.top_interests || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchTopInterests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>熱門十大興趣</h2>

      <ol className={styles.list}>
        {topInterests.map((item, index) => (
          <li key={index}>
            {item.topic} — 出現次數: {item.count}
          </li>
        ))}
      </ol>

      <div className={styles.buttonArea}>
        <button
          className={styles.button}
          onClick={() => navigate("/dashboard")}
        >
          返回個人主頁
        </button>
      </div>
    </div>
  );
}
