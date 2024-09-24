// Ticker.js
import React, { useState, useEffect, useRef } from "react";
import "./Ticker.css";

const Ticker = ({ speed, isStepMode }) => {
  const items = Array.from({ length: 10 }, (_, i) => `Block ${i + 1}`);

  const timesToRepeat = 20;
  const repeatedItems = Array(timesToRepeat).fill(items).flat();

  const tickerRef = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const animationFrameRef = useRef(null);
  const [initialAdjustmentMade, setInitialAdjustmentMade] = useState(false);

  useEffect(() => {
    const calculateDimensions = () => {
      if (tickerRef.current) {
        // Get the width of a single item including margin-right
        const firstItem = tickerRef.current.querySelector(".ticker-item");
        if (firstItem) {
          const style = window.getComputedStyle(firstItem);
          const marginRight = parseFloat(style.marginRight);
          setItemWidth(firstItem.offsetWidth + marginRight);
        }
      }
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);

    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, [repeatedItems]);

  useEffect(() => {
    let lastTimestamp = null;

    const animateContinuous = (timestamp) => {
      if (lastTimestamp !== null) {
        const delta = timestamp - lastTimestamp;
        const distance = (speed * delta) / 1000; // pixels per millisecond
        setCurrentPosition((prevPosition) => {
          let newPosition = prevPosition - distance;

          // Reset position if we've scrolled half of the content
          if (Math.abs(newPosition) >= tickerRef.current.scrollWidth / 2) {
            newPosition = 0;
          }
          return newPosition;
        });
      }
      lastTimestamp = timestamp;
      animationFrameRef.current = requestAnimationFrame(animateContinuous);
    };

    if (!isStepMode) {
      // Reset initial adjustment flag
      setInitialAdjustmentMade(false);
      animationFrameRef.current = requestAnimationFrame(animateContinuous);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isStepMode, speed]);

  useEffect(() => {
    let intervalId;

    if (isStepMode && itemWidth > 0) {
      // Adjust moveInterval and moveDuration based on speed
      const baseInterval = 2000; // Base time between moves in milliseconds
      const baseDuration = 500; // Base duration of the movement in milliseconds

      const speedFactor = speed / 100; // Assuming default speed is 100

      const moveInterval = baseInterval / speedFactor; // Higher speed means shorter interval
      const moveDuration = baseDuration / speedFactor; // Higher speed means faster movement

      // Apply the CSS transition duration
      if (tickerRef.current) {
        tickerRef.current.style.transition = `transform ${moveDuration}ms ease-in-out`;
      }

      intervalId = setInterval(() => {
        setCurrentPosition((prevPosition) => {
          let newPosition = prevPosition;

          if (!initialAdjustmentMade) {
            // Calculate misalignment
            const offset = prevPosition % itemWidth;
            const adjustment = offset !== 0 ? -itemWidth - offset : -itemWidth;
            newPosition += adjustment;
            setInitialAdjustmentMade(true);
          } else {
            newPosition -= itemWidth;
          }

          // Reset if we've scrolled half of the content
          if (Math.abs(newPosition) >= tickerRef.current.scrollWidth / 2) {
            return 0;
          }
          return newPosition;
        });
      }, moveInterval);
    } else {
      // Remove the inline transition style when not in step mode
      if (tickerRef.current) {
        tickerRef.current.style.transition = "";
      }
      setInitialAdjustmentMade(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStepMode, itemWidth, speed, initialAdjustmentMade]);

  useEffect(() => {
    if (tickerRef.current) {
      tickerRef.current.style.transform = `translateX(${currentPosition}px)`;
    }
  }, [currentPosition]);

  return (
    <div className="ticker-wrapper">
      <div className="ticker" ref={tickerRef}>
        {repeatedItems.map((item, index) => (
          <div className="ticker-item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
