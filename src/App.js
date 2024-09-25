import React, { useState, useEffect, useCallback } from "react";
import Ticker from "./components/Ticker";
import "./App.css";

function App() {
  const [blocks, setBlocks] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState(5); // Default to 5 blocks
  const [speed, setSpeed] = useState("default"); // Default speed

  // Function to fetch data from the API (run once on initial load)
  const fetchData = async () => {
    try {
      // Get today's date
      const today = new Date();
      const dayOfWeek = today.getDay();

      // Calculate the most recent Monday
      const daysSinceMonday = (dayOfWeek + 6) % 7;
      const recentMonday = new Date(today);
      recentMonday.setDate(today.getDate() - daysSinceMonday);

      // Calculate the previous Sunday and Thursday
      const previousSunday = new Date(recentMonday);
      previousSunday.setDate(recentMonday.getDate() - 1);
      const previousThursday = new Date(recentMonday);
      previousThursday.setDate(recentMonday.getDate() - 4);

      // Format the dates as YYYYMMDD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
      };

      const formattedThursday = formatDate(previousThursday);
      const formattedMonday = formatDate(recentMonday);

      console.log(
        "Fetching data from:",
        formattedThursday,
        "to",
        formattedMonday
      );

      // Fetch the data for Thursday to Monday
      const response = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedThursday}-${formattedMonday}`
      );
      const data = await response.json();

      // Check if events are available
      if (data.events && data.events.length > 0) {
        const fetchedBlocks = data.events.map((event) => {
          const competition = event.competitions[0];
          const competitors = competition.competitors;
          const homeTeam = competitors.find((team) => team.homeAway === "home");
          const awayTeam = competitors.find((team) => team.homeAway === "away");

          const homeTeamName = homeTeam.team.shortDisplayName || "Home";
          const awayTeamName = awayTeam.team.shortDisplayName || "Away";
          const homeTeamScore = homeTeam.score || "0";
          const awayTeamScore = awayTeam.score || "0";

          // Fetch team logos (use `team.logo` instead of `team.logos`)
          const homeTeamLogo = homeTeam.team.logo; // Corrected to use the `logo` field
          const awayTeamLogo = awayTeam.team.logo; // Corrected to use the `logo` field

          const statusType = event.status.type.name;
          let status;
          let isLive = false;

          if (statusType === "STATUS_FINAL") {
            status = "Final";
          } else if (statusType === "STATUS_SCHEDULED") {
            status = "Scheduled";
          } else if (statusType === "STATUS_IN_PROGRESS") {
            status = "In Progress";
            isLive = true; // Mark game as live
          } else {
            status = "In Progress";
          }

          // Parse the date of the event (e.g., "2024-09-15T17:00Z")
          const eventDate = new Date(event.date);
          const formattedEventDate = eventDate.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return {
            title: `${awayTeamName} @ ${homeTeamName}`,
            points: `${awayTeamScore} - ${homeTeamScore}`,
            status: status,
            date: formattedEventDate,
            isLive: isLive,
            id: event.id, // Use this ID for re-fetching specific live games
            homeTeamLogo, // Include the home team logo
            awayTeamLogo, // Include the away team logo
          };
        });

        setBlocks(fetchedBlocks);
      } else {
        console.warn("No games available for the selected date range.");
        setBlocks([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Polling function to update live games, wrapped with useCallback
  const updateLiveGames = useCallback(async () => {
    const liveGames = blocks.filter((block) => block.isLive);
    if (liveGames.length === 0) return; // No live games to update

    const liveGameIds = liveGames.map((game) => game.id).join(",");
    const response = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?ids=${liveGameIds}`
    );
    const data = await response.json();

    if (data.events && data.events.length > 0) {
      const updatedBlocks = blocks.map((block) => {
        const liveGame = data.events.find((event) => event.id === block.id);
        if (liveGame) {
          const competition = liveGame.competitions[0];
          const competitors = competition.competitors;
          const homeTeam = competitors.find((team) => team.homeAway === "home");
          const awayTeam = competitors.find((team) => team.homeAway === "away");

          const homeTeamScore = homeTeam.score || "0";
          const awayTeamScore = awayTeam.score || "0";

          return {
            ...block,
            points: `${awayTeamScore} - ${homeTeamScore}`, // Update score
          };
        }
        return block;
      });

      setBlocks(updatedBlocks); // Update the state with new scores
    }
  }, [blocks]);

  // useEffect to fetch data only on mount
  useEffect(() => {
    fetchData(); // Fetch data once on component mount
  }, []); // Empty dependency array ensures this runs only once

  // useEffect to poll live game updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(updateLiveGames, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [updateLiveGames]); // Only depends on `updateLiveGames`, not `blocks`

  return (
    <div className="App">
      {/* Controls for changing visibleBlocks and speed */}
      <div className="controls">
        <label>
          Visible Blocks:
          <select
            value={visibleBlocks}
            onChange={(e) => setVisibleBlocks(parseInt(e.target.value))}
          >
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={7}>7</option>
          </select>
        </label>

        <label>
          Speed:
          <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
            <option value="fast">Fast</option>
            <option value="default">Default</option>
            <option value="slow">Slow</option>
          </select>
        </label>
      </div>

      <Ticker blocks={blocks} visibleBlocks={visibleBlocks} speed={speed} />
    </div>
  );
}

export default App;
