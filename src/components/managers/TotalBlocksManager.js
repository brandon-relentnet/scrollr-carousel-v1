import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const TotalBlocksManager = ({ totalBlocks, setTotalBlocks }) => {
  // Function to handle incrementing the blocks
  const incrementBlocks = () => {
    if (totalBlocks < 6) {
      setTotalBlocks(totalBlocks + 1);
    }
  };

  // Function to handle decrementing the blocks
  const decrementBlocks = () => {
    if (totalBlocks > 3) {
      setTotalBlocks(totalBlocks - 1);
    }
  };

  return (
    <div className="total-blocks-manager">
      <label>Blocks:</label>
      <button onClick={decrementBlocks} disabled={totalBlocks <= 3}>
        <FontAwesomeIcon icon={faMinus} />
      </button>
      <button onClick={incrementBlocks} disabled={totalBlocks >= 6}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default TotalBlocksManager;
