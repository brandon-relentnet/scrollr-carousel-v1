// src/components/ThemeManager.js
import React, { useState, useEffect } from "react";
import "../../css/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faCloud,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons

// Helper to get saved theme from localStorage (before render)
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme ? savedTheme : "mocha"; // Default to mocha if nothing is saved
};

const ThemeManager = () => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["mocha", "macchiato", "frappe", "latte"];
    const currentThemeIndex = themes.indexOf(theme);
    const newTheme = themes[(currentThemeIndex + 1) % themes.length];
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Save theme to localStorage
    document.body.className = newTheme; // Apply theme class to body
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {theme === "mocha" ? (
        <FontAwesomeIcon icon={faPalette} className="svg-shadow" />
      ) : theme === "macchiato" ? (
        <FontAwesomeIcon icon={faCloud} className="svg-shadow" />
      ) : theme === "frappe" ? (
        <FontAwesomeIcon icon={faSun} className="svg-shadow" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="svg-shadow" />
      )}
    </button>
  );
};

export default ThemeManager;
