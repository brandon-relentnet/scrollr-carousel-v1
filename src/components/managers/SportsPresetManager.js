import React, { useEffect, useState } from "react";

const SportsPresetManager = ({ selectedSport, setSelectedSport }) => {
  const sports = ["football", "hockey", "baseball", "basketball"];
  const [currentSport, setCurrentSport] = useState(selectedSport);

  useEffect(() => {
    // Remove setCurrentSport(selectedSport)
    localStorage.setItem("selectedSport", selectedSport); // Save to localStorage
  }, [selectedSport]);

  const handleSportChange = (e) => {
    const newSport = e.target.value;
    setCurrentSport(newSport);
    setSelectedSport(newSport); // Update the selectedSport in the app
    localStorage.setItem("selectedSport", newSport); // Save to localStorage
  };

  return (
    <div className="sports-preset-manager">
      <label htmlFor="sports">Select Sport:</label>
      <select id="sports" value={currentSport} onChange={handleSportChange}>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport.charAt(0).toUpperCase() + sport.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SportsPresetManager;
