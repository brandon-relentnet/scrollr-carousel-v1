import React, { useEffect, useRef } from "react";
import TickerBlock from "./TickerBlock";
import "./Ticker.css";

const Ticker = ({ blocks, visibleBlocks = 5, speed = "default" }) => {
  const tickerContentRef = useRef(null);
  const totalBlocks = blocks.length;

  // Duplicate blocks for seamless looping
  const tickerBlocks = [...blocks, ...blocks];

  // Use a ref to store currentIndex
  const currentIndexRef = useRef(0);

  useEffect(() => {
    // Define step durations based on speed
    let stepDuration;
    let transitionDuration;

    switch (speed) {
      case "fast":
        stepDuration = 1000; // Fast speed
        transitionDuration = 300;
        break;
      case "slow":
        stepDuration = 3000; // Slow speed
        transitionDuration = 700;
        break;
      default:
        stepDuration = 2000; // Default speed
        transitionDuration = 500;
        break;
    }

    const stepWidth = 100 / visibleBlocks; // Percentage width of each block
    const tickerContent = tickerContentRef.current;

    // Adjust the transform to match the current index when props change
    tickerContent.style.transition = "none"; // Disable transition
    tickerContent.style.transform = `translateX(-${
      currentIndexRef.current * stepWidth
    }%)`;

    const moveNext = () => {
      currentIndexRef.current++;

      // Apply transition
      tickerContent.style.transition = `transform ${transitionDuration}ms ease-in-out`;

      // Move to the next position
      tickerContent.style.transform = `translateX(-${
        currentIndexRef.current * stepWidth
      }%)`;

      // When we have moved through all blocks, reset
      if (currentIndexRef.current >= totalBlocks) {
        // After the transition ends, reset transform without transition
        setTimeout(() => {
          tickerContent.style.transition = "none";
          tickerContent.style.transform = `translateX(0%)`;
          tickerContent.getBoundingClientRect(); // Force reflow
          currentIndexRef.current = 0;
        }, transitionDuration);
      }
    };

    // Clear any existing interval to prevent multiple intervals
    let intervalId;

    // Start the interval
    intervalId = setInterval(moveNext, stepDuration);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, [totalBlocks, visibleBlocks, speed]);

  return (
    <div
      className="ticker-container"
      style={{ "--visible-blocks": visibleBlocks }}
    >
      <div className="ticker-content" ref={tickerContentRef}>
        {tickerBlocks.map((blockContent, index) => (
          <TickerBlock key={index} content={blockContent} />
        ))}
      </div>
    </div>
  );
};

export default Ticker;
