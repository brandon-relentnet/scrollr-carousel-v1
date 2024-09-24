import React from "react";
import Ticker from "./components/Ticker";

function App() {
  const blocks = ["Block 1", "Block 2", "Block 3", "Block 4", "Block 5"];

  return (
    <div className="App">
      <Ticker blocks={blocks} />
    </div>
  );
}

export default App;
