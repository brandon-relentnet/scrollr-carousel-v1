// Popup.js
import React from "react";
import TotalBlocksManager from "./managers/TotalBlocksManager";
import ThemeManager from "./managers/ThemeManager";
import HeightManager from "./managers/HeightManager";
import SpeedManager from "./managers/SpeedManager"; // Import the SpeedManager component

const Popup = ({
  visibleBlocks,
  setVisibleBlocks,
  speed,
  setSpeed,
  heightMode,
  setHeightMode,
}) => {
  return (
    <div className="popup-controls">
      {/* TotalBlocks component for adjusting the visible blocks */}
      <TotalBlocksManager
        totalBlocks={visibleBlocks}
        setTotalBlocks={setVisibleBlocks}
      />

      {/* SpeedManager component for adjusting the speed */}
      <SpeedManager speed={speed} setSpeed={setSpeed} />

      {/* HeightManager component to select height mode */}
      <HeightManager heightMode={heightMode} onChange={setHeightMode} />

      {/* ThemeManager component for changing themes */}
      <ThemeManager />
    </div>
  );
};

export default Popup;
