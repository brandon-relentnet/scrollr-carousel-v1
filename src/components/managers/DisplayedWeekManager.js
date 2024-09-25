import React, { useState } from "react";

const DisplayedWeekManager = ({ setWeekRange }) => {
  const [currentWeek, setCurrentWeek] = useState("current");

  const handleWeekChange = (e) => {
    const selectedWeek = e.target.value;
    setCurrentWeek(selectedWeek);
    setWeekRange(selectedWeek); // Update the week range based on the user's selection
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
