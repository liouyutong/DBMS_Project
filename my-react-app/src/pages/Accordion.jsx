import React, { useState } from "react";
import "./Accordion.css";

export default function Accordion({ title, options, selected, setSelected }) {
  const [open, setOpen] = useState(false);

  const toggleItem = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(v => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const selectAll = () => {
    setSelected(options.slice());
  };

  const clearAll = () => {
    setSelected([]);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        {title} {open ? "▲" : "▼"}
      </div>
      {open && (
        <div className="accordion-body">
          <div className="accordion-actions">
            <button type="button" onClick={selectAll}>全選</button>
            <button type="button" onClick={clearAll}>清除</button>
          </div>
          {options.map(opt => (
            <label key={opt} className="accordion-item">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleItem(opt)}
              />
              <span className="accordion-label">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
