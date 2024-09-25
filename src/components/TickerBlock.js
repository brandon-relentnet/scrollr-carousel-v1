// TickerBlock.js
import React, { forwardRef } from "react";
import "../css/styles.css";

const TickerBlock = forwardRef(({ content }, ref) => {
  return (
    <div className="ticker-block" ref={ref}>
      <div className="ticker-block-wrapper">
        <div className="team-info">
          {/* Team A Logo and Score */}
          <img
            src={content.awayTeamLogo}
            alt="Away Team Logo"
            className="team-logo"
          />
          <span className="team-score">{content.points}</span>
          {/* Team B Logo and Score */}
          <img
            src={content.homeTeamLogo}
            alt="Home Team Logo"
            className="team-logo"
          />
        </div>
        <div className="block-info">
          {/* Display the status, date, and live status below the score */}
          <p className="small-text">{content.status}</p>
          <p className="small-text">{content.date}</p>
          {content.isLive && <p className="live-status">LIVE</p>}
        </div>
      </div>
    </div>
  );
});

export default TickerBlock;
