// App.js
import React, { useState } from "react";
import "./App.css";
import Ticker from "./components/Ticker";

function App() {
  const speedSettings = {
    "Very Slow": 50,
    "Slow": 75,
    "Default": 100,
    "Fast": 150,
    "Very Fast": 200,
  };

  const [speedLabel, setSpeedLabel] = useState("Default");
  const [isStepMode, setIsStepMode] = useState(false);

  const handleSpeedChange = (e) => {
    setSpeedLabel(e.target.value);
  };

  const handleModeChange = (e) => {
    setIsStepMode(e.target.checked);
  };

  return (
    <div className="App">
      <h1>Customizable Ticker</h1>
      <div className="controls">
        <label htmlFor="speed">Scroll Speed:</label>
        <select id="speed" value={speedLabel} onChange={handleSpeedChange}>
          {Object.keys(speedSettings).map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="controls">
        <label htmlFor="mode">Step Mode:</label>
        <input
          type="checkbox"
          id="mode"
          checked={isStepMode}
          onChange={handleModeChange}
        />
      </div>
      <Ticker speed={speedSettings[speedLabel]} isStepMode={isStepMode} />
    </div>
  );
}

export default App;
