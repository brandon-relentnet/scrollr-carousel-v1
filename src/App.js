import React, { useState } from "react";
import Ticker from "./components/Ticker";
import Popup from "./components/Popup";
import { loadFromLocalStorage } from "./utils/utils";
import { useFetchGames } from "./utils/useFetchGames";
import "./App.css";

function App() {
  const initialSettings = {
    visibleBlocks: Number(loadFromLocalStorage("visibleBlocks", 4)),
    speed: loadFromLocalStorage("speed", "default"),
    heightMode: loadFromLocalStorage("heightMode", "default"),
    weekRange: loadFromLocalStorage("weekRange", "current"),
    selectedSport: loadFromLocalStorage("selectedSport", "football"),
    theme: loadFromLocalStorage("theme", "mocha"),
  };

  const [settings, setSettings] = useState(initialSettings);

  // Generalized update function for settings
  const updateSetting = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Setters for each setting
  const setVisibleBlocks = (value) => updateSetting("visibleBlocks", value);
  const setSpeed = (value) => updateSetting("speed", value);
  const setHeightMode = (value) => updateSetting("heightMode", value);
  const setWeekRange = (value) => updateSetting("weekRange", value);
  const setSelectedSport = (value) => updateSetting("selectedSport", value);
  const setTheme = (value) => updateSetting("theme", value);

  const blocks = useFetchGames(settings);

  const height =
    settings.heightMode === "taller"
      ? 250
      : settings.heightMode === "shorter"
      ? 150
      : 200;

  return (
    <div className="App">
      <Popup
        visibleBlocks={settings.visibleBlocks}
        setVisibleBlocks={setVisibleBlocks}
        speed={settings.speed}
        setSpeed={setSpeed}
        heightMode={settings.heightMode}
        setHeightMode={setHeightMode}
        setWeekRange={setWeekRange}
        selectedSport={settings.selectedSport}
        setSelectedSport={setSelectedSport}
        theme={settings.theme}
        setTheme={setTheme}
      />
      <Ticker
        blocks={blocks}
        visibleBlocks={settings.visibleBlocks}
        speed={settings.speed}
        height={height}
        heightMode={settings.heightMode}
      />
    </div>
  );
}

export default App;
