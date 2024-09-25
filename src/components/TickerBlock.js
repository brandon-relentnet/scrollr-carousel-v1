// TickerBlock.js
import React, { forwardRef } from "react";
import "./Ticker.css";

const TickerBlock = forwardRef(({ content }, ref) => {
  return (
    <div className="ticker-block" ref={ref}>
      <div className="team-logos">
        {/* Display team logos */}
        <img
          src={content.awayTeamLogo}
          alt="Away Team Logo"
          className="team-logo"
        />
        <span> @ </span>
        <img
          src={content.homeTeamLogo}
          alt="Home Team Logo"
          className="team-logo"
        />
      </div>
      <h3>{content.title}</h3>
      <p>{content.points}</p>
      <p>{content.status}</p>
      {/* Display the date of play */}
      <p>{content.date}</p>
      {/* Conditionally display 'Live' if the game is live */}
      {content.isLive && <p className="live-status">LIVE</p>}
    </div>
  );
});

export default TickerBlock;
