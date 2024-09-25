import React, { useState, useEffect, useCallback } from "react";
import Ticker from "./components/Ticker";
import Popup from "./components/Popup";
import "./App.css";

function App() {
  // Function to load from localStorage and default if not found
  const loadFromLocalStorage = (key, defaultValue) => {
    const savedValue = localStorage.getItem(key);
    return savedValue !== null ? savedValue : defaultValue;
  };

  const savedVisibleBlocks = loadFromLocalStorage("visibleBlocks", 4); // Default to 4 blocks
  const savedSpeed = loadFromLocalStorage("speed", "default");
  const savedHeightMode = loadFromLocalStorage("heightMode", "default");
  const savedWeekRange = loadFromLocalStorage("weekRange", "current");
  const savedSport = loadFromLocalStorage("selectedSport", "football");
  const savedTheme = loadFromLocalStorage("theme", "mocha"); // Load the saved theme from localStorage

  const [blocks, setBlocks] = useState([]);
  const [visibleBlocks, setVisibleBlocks] = useState(
    Number(savedVisibleBlocks)
  );
  const [speed, setSpeed] = useState(savedSpeed);
  const [heightMode, setHeightMode] = useState(savedHeightMode);
  const [weekRange, setWeekRange] = useState(savedWeekRange);
  const [selectedSport, setSelectedSport] = useState(savedSport);
  const [theme, setTheme] = useState(savedTheme); // Initialize theme

  useEffect(() => {
    // Ensure the selectedSport is initialized first before fetching any data
    if (selectedSport !== null) {
      const fetchData = async () => {
        try {
          const today = new Date();
          const dayOfWeek = today.getDay();
          let startDate, endDate, leagueType;

          const calculateDateRange = (daysOffset) => {
            const newDate = new Date(today);
            newDate.setDate(today.getDate() + daysOffset);
            return newDate;
          };

          if (selectedSport === "football") {
            const lastThursday = new Date(today);
            lastThursday.setDate(today.getDate() - ((dayOfWeek + 3) % 7)); // Last Thursday

            const nextMonday = new Date(lastThursday);
            nextMonday.setDate(lastThursday.getDate() + 4); // Next Monday

            if (weekRange === "previous" || dayOfWeek === 2) {
              const previousThursday = new Date(lastThursday);
              previousThursday.setDate(lastThursday.getDate() - 7); // Go to the previous Thursday
              const previousMonday = new Date(previousThursday);
              previousMonday.setDate(previousThursday.getDate() + 4); // Previous Monday

              startDate = previousThursday;
              endDate = previousMonday;
            } else if (weekRange === "next") {
              const upcomingThursday = new Date(lastThursday);
              upcomingThursday.setDate(lastThursday.getDate() + 7); // Next Thursday
              const upcomingMonday = new Date(upcomingThursday);
              upcomingMonday.setDate(upcomingThursday.getDate() + 4); // Next Monday

              startDate = upcomingThursday;
              endDate = upcomingMonday;
            } else {
              startDate = lastThursday;
              endDate = nextMonday;
            }

            leagueType = "nfl"; // Football uses NFL league type
          } else {
            if (weekRange === "previous") {
              startDate = calculateDateRange(-8); // 4 days before today in the past week
              endDate = calculateDateRange(-4); // 4 days after the calculated start date in the past
            } else if (weekRange === "next") {
              startDate = calculateDateRange(4); // 4 days before future week
              endDate = calculateDateRange(8); // 4 days after
            } else {
              startDate = calculateDateRange(-4); // 4 days before today
              endDate = calculateDateRange(4); // 4 days after today
            }

            switch (selectedSport) {
              case "hockey":
                leagueType = "nhl";
                break;
              case "baseball":
                leagueType = "mlb";
                break;
              case "basketball":
                leagueType = "nba";
                break;
              default:
                leagueType = "nfl"; // Fallback to NFL just in case
            }
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
            formattedEndDate,
            "for sport:",
            selectedSport,
            "league:",
            leagueType
          );

          const response = await fetch(
            `https://site.api.espn.com/apis/site/v2/sports/${selectedSport}/${leagueType}/scoreboard?dates=${formattedStartDate}-${formattedEndDate}`
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

              const homeTeamWon = homeTeam.winner || false;
              const awayTeamWon = awayTeam.winner || false;

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

      fetchData(); // Fetch data only when selectedSport is ready
    }
  }, [weekRange, selectedSport]);

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
        selectedSport={selectedSport}
        setSelectedSport={setSelectedSport}
        theme={theme}
        setTheme={setTheme}
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
