import React, { useState, useEffect, useCallback } from "react";
import Ticker from "./components/Ticker";
import Popup from "./components/Popup"; // Import the Popup component
import "./App.css";

function App() {
  const [blocks, setBlocks] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState(5); // Default to 5 blocks
  const [speed, setSpeed] = useState("default"); // Default speed
  const [heightMode, setHeightMode] = useState("default"); // Height mode
  const [weekRange, setWeekRange] = useState("current"); // State to manage current/previous week

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        let startDate, endDate;

        const lastThursday = new Date(today);
        lastThursday.setDate(today.getDate() - ((dayOfWeek + 3) % 7)); // Last Thursday (for the current football week)

        const nextMonday = new Date(lastThursday);
        nextMonday.setDate(lastThursday.getDate() + 4); // Monday after the last Thursday

        if (weekRange === "previous" || dayOfWeek === 2) {
          // Fetch previous week's data (Thursday-Monday)
          const previousThursday = new Date(lastThursday);
          previousThursday.setDate(lastThursday.getDate() - 7); // Go to the previous Thursday
          const previousMonday = new Date(previousThursday);
          previousMonday.setDate(previousThursday.getDate() + 4); // The Monday after the previous Thursday

          startDate = previousThursday;
          endDate = previousMonday;
        } else if (weekRange === "next") {
          // Fetch next week's data (Thursday-Monday)
          const upcomingThursday = new Date(lastThursday);
          upcomingThursday.setDate(lastThursday.getDate() + 7); // Next Thursday
          const upcomingMonday = new Date(upcomingThursday);
          upcomingMonday.setDate(upcomingThursday.getDate() + 4); // Next Monday

          startDate = upcomingThursday;
          endDate = upcomingMonday;
        } else {
          // Fetch current week's data (Thursday-Monday)
          startDate = lastThursday;
          endDate = nextMonday;
        }

        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}${month}${day}`;
        };

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        console.log(
          "Fetching data from:",
          formattedStartDate,
          "to",
          formattedEndDate
        );

        const response = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedStartDate}-${formattedEndDate}`
        );
        const data = await response.json();

        if (data.events && data.events.length > 0) {
          const fetchedBlocks = data.events.map((event) => {
            const competition = event.competitions[0];
            const competitors = competition.competitors;
            const homeTeam = competitors.find(
              (team) => team.homeAway === "home"
            );
            const awayTeam = competitors.find(
              (team) => team.homeAway === "away"
            );

            const homeTeamName = homeTeam.team.shortDisplayName || "Home";
            const awayTeamName = awayTeam.team.shortDisplayName || "Away";
            const homeTeamScore = homeTeam.score || "0";
            const awayTeamScore = awayTeam.score || "0";

            const homeTeamLogo = homeTeam.team.logo;
            const awayTeamLogo = awayTeam.team.logo;

            const statusType = event.status.type.name;
            let status;
            let isLive = false;

            if (statusType === "STATUS_FINAL") {
              status = "Final";
            } else if (statusType === "STATUS_SCHEDULED") {
              status = "Scheduled";
            } else if (statusType === "STATUS_IN_PROGRESS") {
              status = "In Progress";
              isLive = true;
            } else {
              status = "In Progress";
            }

            const eventDate = new Date(event.date);
            const formattedEventDate = eventDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const homeTeamWon = homeTeam.winner;
            const awayTeamWon = awayTeam.winner;

            const gameLink =
              event.links && event.links[0] ? event.links[0].href : null;

            return {
              title: `${awayTeamName} @ ${homeTeamName}`,
              points: `${awayTeamScore} - ${homeTeamScore}`,
              status: status,
              date: formattedEventDate,
              isLive: isLive,
              id: event.id,
              homeTeamLogo,
              awayTeamLogo,
              href: gameLink,
              homeTeamWon,
              awayTeamWon,
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

    fetchData();
  }, [weekRange]);

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

  // useEffect to poll live game updates every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(updateLiveGames, 30000); // Poll every 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [updateLiveGames]); // Only depends on `updateLiveGames`, not `blocks`

  const getHeightFromMode = (mode) => {
    switch (mode) {
      case "shorter":
        return 150;
      case "taller":
        return 250;
      case "default":
      default:
        return 200;
    }
  };

  // Calculate the actual height from the selected mode
  const height = getHeightFromMode(heightMode);

  return (
    <div className="App">
      <Popup
        visibleBlocks={visibleBlocks}
        setVisibleBlocks={setVisibleBlocks}
        speed={speed}
        setSpeed={setSpeed}
        heightMode={heightMode}
        setHeightMode={setHeightMode}
        setWeekRange={setWeekRange} // Function to update the week range
      />
      <Ticker
        blocks={blocks}
        visibleBlocks={visibleBlocks}
        speed={speed}
        height={height}
        heightMode={heightMode}
      />
    </div>
  );
}

export default App;
