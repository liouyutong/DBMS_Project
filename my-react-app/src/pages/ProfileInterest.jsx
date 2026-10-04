import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './ProfileInterest.module.css';

function ProfileInterest({ userData, setUserData }) {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [error, setError] = useState("");

  const interestsList = [
    "adventure","animal","anime","art","aviation","car","cooking","cosmetics","cosplay","culture",
    "design","dancing","DIY","drawing","exercise","family","fashion","food","game","health",
    "history","magic","movie","music","nature","news","novel","philosophy","photography","politics",
    "programming","psychology","reading","science","shopping","technology","travel","TV show",
    "workout","writing"
  ];

  const languagesList = [
    "Afrikaans","Ancient Greek","Arabic","Bengali","Bulgarian","Cantonese","Chinese","Danish",
    "Egyptian Arabic","English","Persian","French","Gaelic","German","Greek","Hindi","Hungarian",
    "Italian","Japanese","Kazakh","Korean","Lithuanian","Nepali","Polish","Portuguese","Romanian",
    "Russian","Spanish","Swahili","Tamil","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Zulu"
  ];

  const toggleSelection = (item, listSetter, max = 3) => {
    listSetter(prev => {
      if (prev.includes(item)) return prev.filter(i => i !== item);
      if (prev.length >= max) {
        alert(`最多只能選 ${max} 個`);
        return prev;
      }
      return [...prev, item];
    });
  };

  useEffect(() => {
    if (!userData.currentUserId) return;

    const fetchInterests = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/profile/interests/${userData.currentUserId}`);
        if (!res.ok) {
          const errData = await res.json();
          setError(errData.detail || "抓取資料失敗");
          return;
        }
        const data = await res.json();
        setSelectedInterests(data.interests || []);
        setSelectedLanguages(data.languages || []);
      } catch (err) {
        console.error(err);
        setError("抓取資料失敗，請稍後再試");
      }
    };

    fetchInterests();
  }, [userData.currentUserId]);

  const handleConfirm = async () => {
    if (!userData.currentUserId) {
      setError("使用者未登入，無法更新資料");
      return;
    }
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/profile/update_interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.currentUserId,
          interests: selectedInterests,
          languages: selectedLanguages
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "更新失敗");
        return;
      }

      setUserData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          interests: selectedInterests,
          languages: selectedLanguages
        }
      }));

      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("更新失敗，請稍後再試");
    }
  };

  // 白底藍框，點擊後變淺藍填滿
  const buttonStyle = selected => ({
  margin: 5,
  padding: "5px 10px",
  backgroundColor: selected ? "#e2f1ffff" : "#fff", // 選取後背景淺藍，否則白色
  color: "#14709eff", 
  border: "4px solid #97c0ebff", // 框線加粗
  borderRadius: 5,
  cursor: "pointer",
  fontWeight: 500,
  transition: "0.2s"
});



  return (
    <div className={styles.profileContainer}>
      <div className={styles.formContent}>
        <h2>設定興趣與語言</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginBottom: 10 }}>
          <h3>興趣（最多選3個）：</h3>
          <p>目前已選: {selectedInterests.join(", ") || "尚未選擇"}</p>
          <div>
            {interestsList.map(i => (
              <button
                key={i}
                style={buttonStyle(selectedInterests.includes(i))}
                onClick={() => toggleSelection(i, setSelectedInterests)}
              >{i}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3>語言（最多選3個）：</h3>
          <p>目前已選: {selectedLanguages.join(", ") || "尚未選擇"}</p>
          <div>
            {languagesList.map(l => (
              <button
                key={l}
                style={buttonStyle(selectedLanguages.includes(l))}
                onClick={() => toggleSelection(l, setSelectedLanguages)}
              >{l}</button>
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={() => navigate("/profile-setup")}
            style={{ marginRight: 10, padding: "5px 15px" }}
          >
            返回
          </button>
          <button onClick={handleConfirm} style={{ padding: "5px 15px" }}>確認</button>
        </div>
      </div>
    </div>
  );
}

export default ProfileInterest;
