import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Accordion from "./Accordion";
import "./Search.css";

export default function Search() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("no limit");
  const [countries, setCountries] = useState([]);
  const [interests, setInterests] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [replyTime, setReplyTime] = useState("no limit");

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

  const interestOptions = [
    "adventure","animal","anime","art","aviation","car","cooking","cosmetics","cosplay","culture",
    "design","dancing","DIY","drawing","exercise","family","fashion","food","game","health",
    "history","magic","movie","music","nature","news","novel","philosophy","photography","politics",
    "programming","psychology","reading","science","shopping","technology","travel","TV show",
    "workout","writing"
  ];

  const languageOptions = [
    "Afrikaans","Ancient Greek","Arabic","Bengali","Bulgarian","Cantonese","Chinese","Danish",
    "Egyptian Arabic","English","Persian","French","Gaelic","German","Greek","Hindi","Hungarian",
    "Italian","Japanese","Kazakh","Korean","Lithuanian","Nepali","Polish","Portuguese","Romanian",
    "Russian","Spanish","Swahili","Tamil","Thai","Turkish","Ukrainian","Urdu","Uzbek","Vietnamese","Zulu"
  ];

  const doSearch = async () => {
    const params = new URLSearchParams();

    if (age) params.append("age", age);
    if (gender !== "no limit") params.append("gender", gender);
    if (countries.length > 0) params.append("countries", countries.join(","));
    if (interests.length > 0) params.append("interests", interests.join(","));
    if (languages.length > 0) params.append("languages", languages.join(","));
    if (replyTime !== "no limit") params.append("reply_time", replyTime);

    try {
      const res = await fetch(`http://127.0.0.1:8000/search/users?${params.toString()}`);
      const data = await res.json();
      const users = data.users || [];

      navigate("/search-result", {
        state: { results: users, searchParams: { age, gender, countries, interests, languages, replyTime } }
      });
    } catch (err) {
      console.error(err);
      alert("搜尋失敗");
    }
  };

  return (
    <div className="search-container">
      <h2>搜尋使用者</h2>

      <div className="search-section">
        <label>年齡上限: </label>
        <input
          type="number"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
      </div>

      <div className="search-section">
        <label>性別: </label>
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="no limit">不限</option>
          <option value="M">男</option>
          <option value="F">女</option>
        </select>
      </div>

      <Accordion
        title="國家"
        options={countryOptions}
        selected={countries}
        setSelected={setCountries}
      />

      <Accordion
        title="興趣"
        options={interestOptions}
        selected={interests}
        setSelected={setInterests}
      />

      <Accordion
        title="語言"
        options={languageOptions}
        selected={languages}
        setSelected={setLanguages}
      />

      <div className="search-section">
        <label>回覆時間: </label>
        <select value={replyTime} onChange={e => setReplyTime(e.target.value)}>
          <option value="no limit">不限</option>
          <option value="in 1 day">一天內</option>
          <option value="in 1 week">一週內</option>
          <option value="in 2 weeks">兩週內</option>
          <option value="in 1 month">一個月內</option>
          <option value="not sure">不確定</option>
        </select>
      </div>

      <div className="btn-area">
        <button onClick={() => navigate("/dashboard")}>返回個人主頁</button>
        <button onClick={doSearch}>開始搜尋</button>
      </div>
    </div>
  );
}
