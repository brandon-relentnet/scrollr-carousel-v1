import React, { useEffect, useState } from "react";
import "../../css/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPalette,
  faCloud,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons

const ThemeManager = ({ theme, setTheme }) => {
  // Initialize state with the theme prop
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    // Whenever theme changes, update local state and save to localStorage
    setCurrentTheme(theme);
    document.body.className = theme; // Apply theme class to body
    localStorage.setItem("theme", theme); // Save to localStorage
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["mocha", "macchiato", "frappe", "latte"];
    const currentThemeIndex = themes.indexOf(currentTheme);
    const newTheme = themes[(currentThemeIndex + 1) % themes.length];
    setCurrentTheme(newTheme); // Update local state
    setTheme(newTheme); // Update theme in the parent component
    localStorage.setItem("theme", newTheme); // Save new theme to localStorage
  };

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      {currentTheme === "mocha" ? (
        <FontAwesomeIcon icon={faPalette} className="svg-shadow" />
      ) : currentTheme === "macchiato" ? (
        <FontAwesomeIcon icon={faCloud} className="svg-shadow" />
      ) : currentTheme === "frappe" ? (
        <FontAwesomeIcon icon={faSun} className="svg-shadow" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="svg-shadow" />
      )}
    </button>
  );
};

export default ThemeManager;
