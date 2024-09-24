import React from "react";
import "./Ticker.css";

const TickerBlock = ({ content }) => {
  return (
    <div className="ticker-block">
      <h3>{content.title}</h3>
      <p>{content.points}</p>
      <p>{content.status}</p>
    </div>
  );
};

export default TickerBlock;
