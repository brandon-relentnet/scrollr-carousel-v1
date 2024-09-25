import React, { useState, useEffect } from "react";
import "../../css/styles.css"; // Make sure your CSS is correctly linked

// Helper to get saved border radius from localStorage
const getInitialBorderRadius = () => {
  const savedRadius = localStorage.getItem("borderRadius");
  return savedRadius ? savedRadius : "border-radius-6";
};

const BorderRadiusManager = () => {
  const [borderRadius, setBorderRadius] = useState(() =>
    getInitialBorderRadius()
  ); // Lazy initialization
  const [boxShadow, setBoxShadow] = useState(""); // State to manage box-shadow on hover

  useEffect(() => {
    document.body.classList.remove(
      "border-radius-0",
      "border-radius-6",
      "border-radius-18"
    );
    document.body.classList.add(borderRadius);

    localStorage.setItem("borderRadius", borderRadius);
  }, [borderRadius]);

  // Calculate the next border-radius value
  const getNextBorderRadius = () => {
    return borderRadius === "border-radius-0"
      ? "border-radius-6"
      : borderRadius === "border-radius-6"
      ? "border-radius-18"
      : "border-radius-0";
  };

  // Toggle the actual border radius
  const toggleBorderRadius = () => {
    setBorderRadius(getNextBorderRadius());
  };

  const handleMouseEnter = () => {
    setBoxShadow(
      "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
    ); // Add shadow on hover
  };

  // Handle mouse leave to remove box-shadow
  const handleMouseLeave = () => {
    setBoxShadow(""); // Remove shadow when hover ends
  };

  return (
    <button
      className="border-radius-toggle"
      onClick={toggleBorderRadius}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Show the current border-radius visually */}
      <div
        style={{
          width: "32px",
          height: "32px",
          transition: "box-shadow 0.3s ease, border-radius 0.3s ease", // Smooth transition for box-shadow and border-radius
          border: "2px solid var(--subtext0)",
          boxShadow: boxShadow, // Dynamic box-shadow based on hover state
          borderRadius:
            borderRadius === "border-radius-0"
              ? "0px"
              : borderRadius === "border-radius-6"
              ? "6px"
              : "18px", // Show current border-radius
        }}
      >
        {/* Visually represents the CURRENT border-radius */}
      </div>
    </button>
  );
};

export default BorderRadiusManager;
