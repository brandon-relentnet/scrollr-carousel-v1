import React, { useEffect, useState } from "react";

const HeightManager = ({ heightMode, onChange }) => {
  // Initialize state with the heightMode prop
  const [currentHeightMode, setCurrentHeightMode] = useState(heightMode);

  useEffect(() => {
    // Whenever heightMode changes, update local state and save to localStorage
    setCurrentHeightMode(heightMode);
    localStorage.setItem("heightMode", heightMode); // Save to localStorage
  }, [heightMode]);

  const handleHeightChange = (e) => {
    const newHeightMode = e.target.value;
    setCurrentHeightMode(newHeightMode);
    onChange(newHeightMode); // Update the heightMode in the app
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
