import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const TotalBlocksManager = ({ visibleBlocks, setVisibleBlocks }) => {
  // Initialize state with the visibleBlocks prop
  const [currentBlocks, setCurrentBlocks] = useState(visibleBlocks);

  useEffect(() => {
    // Whenever visibleBlocks changes, update local state and save to localStorage
    setCurrentBlocks(visibleBlocks);
    localStorage.setItem("visibleBlocks", visibleBlocks); // Save to localStorage
  }, [visibleBlocks]);

  const incrementBlocks = () => {
    if (currentBlocks < 6) {
      const newBlocks = currentBlocks + 1;
      setCurrentBlocks(newBlocks);
      setVisibleBlocks(newBlocks); // Update the parent component
      localStorage.setItem("visibleBlocks", newBlocks); // Save to localStorage
    }
  };

  const decrementBlocks = () => {
    if (currentBlocks > 3) {
      const newBlocks = currentBlocks - 1;
      setCurrentBlocks(newBlocks);
      setVisibleBlocks(newBlocks); // Update the parent component
      localStorage.setItem("visibleBlocks", newBlocks); // Save to localStorage
    }
  };

  return (
    <div className="total-blocks-manager">
      <label>Blocks:</label>
      <button onClick={decrementBlocks} disabled={currentBlocks <= 3}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <span>{currentBlocks}</span> {/* Display current number of blocks */}
      <button onClick={incrementBlocks} disabled={currentBlocks >= 6}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default TotalBlocksManager;
