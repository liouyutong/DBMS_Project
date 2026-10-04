// src/pages/SearchResult.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchResult.css"; // 匯入 CSS

export default function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const results = location.state?.results || [];
  const searchParams = location.state?.searchParams || {};

  return (
    <div className="page-background">
      <h2>搜尋結果</h2>

      {results.length === 0 ? (
        <p>沒有符合條件的使用者</p>
      ) : (
        results.map(u => (
          <button
            key={u.id}
            className="result-button"
            onClick={() =>
              navigate(`/user/${u.id}`, { state: { results, searchParams } })
            }
          >
            {u.name} | {u.gender} | {u.age}
          </button>
        ))
      )}

      <div>
        <button
          className="back-button"
          onClick={() => navigate("/search")}
        >
          返回搜尋頁面
        </button>
      </div>
    </div>
  );
}
