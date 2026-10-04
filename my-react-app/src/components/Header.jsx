import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, back }) {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', maxWidth: 900, padding: '8px 16px', boxSizing: 'border-box', textAlign: 'left' }}>
      {back && <button className="small" onClick={() => navigate(back)}>返回</button>}
      <span style={{ marginLeft: 12, fontSize: 18 }}>{title}</span>
    </div>
  );
}
