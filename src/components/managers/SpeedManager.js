import React, { useEffect, useState } from "react";

const SpeedManager = ({ speed, setSpeed }) => {
  // Initialize state with the speed prop
  const [currentSpeed, setCurrentSpeed] = useState(speed);

  useEffect(() => {
    // Whenever speed changes, update the local state and save to localStorage
    setCurrentSpeed(speed);
    localStorage.setItem("speed", speed); // Save the current speed to localStorage
  }, [speed]);

  const handleSpeedChange = (e) => {
    const newSpeed = e.target.value;
    setCurrentSpeed(newSpeed); // Update local state
    setSpeed(newSpeed); // Update the speed in the parent component
    localStorage.setItem("speed", newSpeed); // Save to localStorage
  };

  return (
    <div className="speed-manager">
      <label>Speed:</label>
      <div className="select-wrapper">
        <select value={currentSpeed} onChange={handleSpeedChange}>
          <option value="fast">Faster</option>
          <option value="default">Classic</option>
          <option value="slow">Slower</option>
        </select>
      </div>
    </div>
  );
};

export default SpeedManager;
