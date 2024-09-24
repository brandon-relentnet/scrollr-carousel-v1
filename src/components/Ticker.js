import React, { useEffect, useRef } from "react";
import TickerBlock from "./TickerBlock";
import "./Ticker.css";

const Ticker = ({ blocks }) => {
  const tickerContentRef = useRef(null);
  const totalBlocks = blocks.length;

  // Duplicate blocks for seamless looping
  const tickerBlocks = [...blocks, ...blocks];

  useEffect(() => {
    const stepDuration = 2000; // Duration for each step in milliseconds
    const transitionDuration = 500; // Duration of the ease-in-out transition
    const stepWidth = 100 / totalBlocks; // Percentage width of each block
    const tickerContent = tickerContentRef.current;

    let currentIndex = 0;

    const moveNext = () => {
      currentIndex++;

      // Apply transition
      tickerContent.style.transition = `transform ${transitionDuration}ms ease-in-out`;

      // Move to the next position
      tickerContent.style.transform = `translateX(-${
        currentIndex * stepWidth
      }%)`;

      // When we have moved through all blocks, reset
      if (currentIndex >= totalBlocks) {
        // After the transition ends, reset transform without transition
        setTimeout(() => {
          tickerContent.style.transition = "none";
          tickerContent.style.transform = `translateX(0%)`;
          tickerContent.getBoundingClientRect(); // Force reflow
          currentIndex = 0;
        }, transitionDuration);
      }
    };

    // Start the interval
    const interval = setInterval(moveNext, stepDuration);

    return () => clearInterval(interval);
  }, [totalBlocks]);

  return (
    <div
      className="ticker-container"
      style={{ "--visible-blocks": totalBlocks }}
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
