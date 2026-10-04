import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ProfileSetup.module.css';

function ProfileSetup({ userData, setUserData }) {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("M");
  const [country, setCountry] = useState("Taiwan");
  const [replyTime, setReplyTime] = useState("in 1 day");
  const [error, setError] = useState("");

  const countryOptions = [
    "Argentina","Australia","Austria","Bangladesh","Belarus","Brazil","Bulgaria",
    "Canada","Chile","China","Colombia","Denmark","Ecuador","Egypt","France",
    "Gambia","Georgia","Germany","Greece","HK","Hungary","Iceland","India",
    "Indonesia","Iran","Ireland","Israel","Italy","Japan","Kazakhstan","Kenya",
    "Lithuanian","Malaysia","Macao","Mexico","Morocco","Nigeria","Pakistan","Peru",
    "Philippines","Poland","Romania","Russia","Saudi Lanka","Singapore",
    "South Africa","South Korea","Spain","Sri Lanka","Switzerland","Taiwan",
    "Thailand","Turkey","Ukraine","UK","USA","Vietnam"
  ];

  const replyTimeOptions = [
    
    { value: "in 1 day", label: "一天內" },
    { value: "in 1 week", label: "一週內" },
    { value: "in 2 weeks", label: "兩週內" },
    { value: "in 1 month", label: "一個月內" },
    { value: "not sure", label: "不確定" },
  ];

  useEffect(() => {
    if (!userData.currentUserId) {
      setError("使用者未登入");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/profile/${userData.currentUserId}`);
        if (!response.ok) {
          const data = await response.json();
          setError(data.detail || "抓取資料失敗");
          return;
        }
        const data = await response.json();

        setNickname(data.nickname || "");
        setAge(data.age || "");
        setGender(data.gender || "M");
        setCountry(data.country || "Taiwan");
        setReplyTime(data.reply_time || "in 1 day");

        setUserData(prev => ({
          ...prev,
          profile: {
            nickname: data.nickname || "",
            age: data.age || "",
            gender: data.gender || "M",
            country: data.country || "Taiwan",
            replyTime: data.reply_time || "in 1 day"
          }
        }));
      } catch (err) {
        console.error(err);
        setError("抓取資料失敗，請稍後再試");
      }
    };

    fetchProfile();
  }, [userData.currentUserId, setUserData]);

  const handleNext = async () => {
    if (!userData.currentUserId) {
      setError("使用者未登入，無法更新資料");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.currentUserId,
          nickname,
          age: Number(age),
          gender,
          country,
          reply_time: replyTime
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "更新失敗");
        return;
      }

      setUserData(prev => ({
        ...prev,
        profile: { nickname, age, gender, country, replyTime }
      }));

      navigate("/profile-interest");

    } catch (err) {
      console.error(err);
      setError("更新個人資料失敗，請稍後再試");
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.formContent}>
        <h2>設定個人資料</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <label>暱稱：</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>

        <div>
          <label>年齡：</label>
          <input
            type="number"
            min="1"
            max="100"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div>
          <label>性別：</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="M">男</option>
            <option value="F">女</option>
          </select>
        </div>

        <div>
          <label>國家：</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label>期望回信時間：</label>
          <select value={replyTime} onChange={(e) => setReplyTime(e.target.value)}>
            {replyTimeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        <div style={{ marginTop: 20 }}>
          <button onClick={() => navigate("/dashboard")} style={{ marginRight: 10 }}>
            返回
          </button>
          <button onClick={handleNext}>下一步</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;
