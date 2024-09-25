import React, { useState, useEffect, useRef } from "react";

const DisplayedWeekManager = ({ setWeekRange }) => {
  // Retrieve the saved week from local storage or default to "current"
  const savedWeek = localStorage.getItem("weekRange") || "current";
  const [currentWeek, setCurrentWeek] = useState(savedWeek);

  // Ref to track if this is the first render (mount)
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid running the effect on the first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only update weekRange when currentWeek changes after the first render
    setWeekRange(currentWeek);
    localStorage.setItem("weekRange", currentWeek); // Save to local storage
  }, [currentWeek, setWeekRange]);

  const handleWeekChange = (e) => {
    const selectedWeek = e.target.value;
    // Only update if the selected week is different
    if (selectedWeek !== currentWeek) {
      setCurrentWeek(selectedWeek); // Trigger state update
    }
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
