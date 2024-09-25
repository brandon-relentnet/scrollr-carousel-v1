// SpeedManager.js
import React from "react";

const SpeedManager = ({ speed, setSpeed }) => {
  return (
    <div className="speed-manager">
      <label>Speed:</label>
      <div className="select-wrapper">
        <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
          <option value="fast">Faster</option>
          <option value="default">Classic</option>
          <option value="slow">Slower</option>
        </select>
      </div>
    </div>
  );
};

export default SpeedManager;
