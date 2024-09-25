// HeightManager.js
import React from "react";

const HeightManager = ({ heightMode, onChange }) => {
  return (
    <div className="height-manager">
      <label>Height:</label>
      <div className="select-wrapper">
        <select value={heightMode} onChange={(e) => onChange(e.target.value)}>
          <option value="shorter">Shorter</option>
          <option value="default">Classic</option>
          <option value="taller">Taller</option>
        </select>
      </div>
    </div>
  );
};

export default HeightManager;
