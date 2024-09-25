import React, { useEffect, useState } from "react";

const HeightManager = ({ heightMode, onChange }) => {
  const [currentHeightMode, setCurrentHeightMode] = useState(heightMode);

  useEffect(() => {
    // Remove setCurrentHeightMode(heightMode), it's unnecessary
    localStorage.setItem("heightMode", heightMode); // Save to localStorage
  }, [heightMode]);

  const handleHeightChange = (e) => {
    const newHeightMode = e.target.value;
    setCurrentHeightMode(newHeightMode);
    onChange(newHeightMode); // Update the heightMode in the parent component
    localStorage.setItem("heightMode", newHeightMode); // Save to localStorage
  };

  return (
    <div className="height-manager">
      <label>Height:</label>
      <div className="select-wrapper">
        <select value={currentHeightMode} onChange={handleHeightChange}>
          <option value="shorter">Shorter</option>
          <option value="default">Classic</option>
          <option value="taller">Taller</option>
        </select>
      </div>
    </div>
  );
};

export default HeightManager;
