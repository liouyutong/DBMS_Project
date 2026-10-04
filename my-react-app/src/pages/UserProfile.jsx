// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./UserProfile.module.css";

export default function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const prevSearch = location.state; // { results, searchParams }

  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const resUser = await fetch(`http://127.0.0.1:8000/profile/${id}`);
        if (!resUser.ok) throw new Error("Failed to fetch user data");
        const userData = await resUser.json();
        setUser(userData);

        const resProfile = await fetch(`http://127.0.0.1:8000/profile/interests/${id}`);
        if (!resProfile.ok) throw new Error("Failed to fetch interests/languages");
        const profileData = await resProfile.json();
        setInterests(profileData.interests || []);
        setLanguages(profileData.languages || []);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleBackToResults = () => {
    if (!prevSearch || !prevSearch.results) {
      navigate("/search");
      return;
    }
    navigate("/search-result", { state: prevSearch });
  };

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!user) return <div className={styles.container}>User not found</div>;

  return (
    <div className={styles.container}>
      <h1>{user.nickname} 的使用者資料</h1>
      <p>ID: {user.id}</p>
      <p>年齡: {user.age}</p>
      <p>國家: {user.country}</p>
      <p>性別: {user.gender}</p>
      <p>興趣: {interests.join(", ")}</p>
      <p>語言: {languages.join(", ")}</p>
      <p>最後回信時間: {user.reply_time}</p>

      <div className={styles["button-group"]}>
        <button onClick={handleBackToResults}>返回搜尋結果</button>
        <button onClick={() => navigate("/compose", { state: { toId: user.id, prevSearch } })}>
          寄信
        </button>
      </div>
    </div>
  );
}
