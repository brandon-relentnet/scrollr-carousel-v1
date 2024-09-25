import React, { useState, useEffect } from "react";

const DisplayedWeekManager = ({ setWeekRange }) => {
  // Retrieve the saved week from local storage or default to "current"
  const savedWeek = localStorage.getItem("weekRange") || "current";
  const [currentWeek, setCurrentWeek] = useState(savedWeek);

  useEffect(() => {
    // On component mount, set the initial week range based on local storage
    setWeekRange(savedWeek);
  }, [savedWeek, setWeekRange]);

  const handleWeekChange = (e) => {
    const selectedWeek = e.target.value;
    setCurrentWeek(selectedWeek);
    setWeekRange(selectedWeek); // Update the week range based on the user's selection
    localStorage.setItem("weekRange", selectedWeek); // Save to local storage
  };

  return (
    <div className="displayed-week-manager">
      <label htmlFor="week-select">Week: </label>
      <select id="week-select" value={currentWeek} onChange={handleWeekChange}>
        <option value="previous">Previous</option>
        <option value="current">Current</option>
        <option value="next">Next</option>
      </select>
    </div>
  );
};

export default DisplayedWeekManager;
