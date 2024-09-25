import React, { useEffect, useRef } from "react";
import TickerBlock from "./TickerBlock";
import "../css/styles.css";

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
        stepDuration = 2500; // Shorter time before moving to the next step
        transitionDuration = 1200; // Smoother, faster movement
        break;
      case "slow":
        stepDuration = 4500; // Slower time between steps
        transitionDuration = 2500; // Slower, smoother transition
        break;
      default:
        stepDuration = 3500; // Moderate time before next step
        transitionDuration = 1800; // Moderate easing for the movement
        break;
    }

    const stepWidth = 100 / visibleBlocks; // Percentage width of each block
    const tickerContent = tickerContentRef.current;

    // Adjust the transform to match the current index when props change
    tickerContent.style.transition = "none"; // Disable transition initially
    tickerContent.style.transform = `translateX(-${
      currentIndexRef.current * stepWidth
    }%)`;

    const moveNext = () => {
      currentIndexRef.current++;

      // Apply smooth cubic-bezier easing for even more natural movement
      tickerContent.style.transition = `transform ${transitionDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;

      // Move to the next position
      tickerContent.style.transform = `translateX(-${
        currentIndexRef.current * stepWidth
      }%)`;

      // When we have moved through all blocks, reset after the animation completes
      if (currentIndexRef.current >= totalBlocks) {
        setTimeout(() => {
          // Disable transition and reset position without animation
          tickerContent.style.transition = "none";
          tickerContent.style.transform = `translateX(0%)`;
          tickerContent.getBoundingClientRect(); // Force reflow
          currentIndexRef.current = 0;
        }, transitionDuration); // Reset after the current animation completes
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
