import React from "react";
import TotalBlocksManager from "./managers/TotalBlocksManager";
import ThemeManager from "./managers/ThemeManager";
import HeightManager from "./managers/HeightManager";
import SpeedManager from "./managers/SpeedManager";
import DisplayedWeekManager from "./managers/DisplayedWeekManager"; // Import the new component
import BorderRadiusManager from "./managers/BorderRadiusManager";

const Popup = ({
  visibleBlocks,
  setVisibleBlocks,
  speed,
  setSpeed,
  heightMode,
  setHeightMode,
  weekRange,
  setWeekRange,
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

      {/* DisplayedWeekManager component to swap weeks */}
      <DisplayedWeekManager weekRange={weekRange} setWeekRange={setWeekRange} />

      {/* ThemeManager component for changing themes */}
      <ThemeManager />
      <BorderRadiusManager />
    </div>
  );
};

export default Popup;
