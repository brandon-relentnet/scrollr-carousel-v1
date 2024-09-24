import React, { useState, useEffect } from "react";
import Ticker from "./components/Ticker";

function App() {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        // Get today's date
        const today = new Date();
        // Get today's day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        const dayOfWeek = today.getDay();

        // Calculate the most recent Monday
        const daysSinceMonday = (dayOfWeek + 6) % 7; // Number of days since Monday
        const recentMonday = new Date(today); // Clone today's date
        recentMonday.setDate(today.getDate() - daysSinceMonday); // Set the date to the most recent Monday

        // Calculate the previous Sunday (1 day before the recent Monday)
        const previousSunday = new Date(recentMonday);
        previousSunday.setDate(recentMonday.getDate() - 1);

        // Calculate the Thursday of the week before the most recent Monday (4 days before Monday)
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
        const formattedSunday = formatDate(previousSunday);
        const formattedMonday = formatDate(recentMonday);

        console.log(
          "Fetching data from:",
          formattedThursday,
          "to",
          formattedSunday
        );

        // Fetch the data for Thursday to Sunday
        const responseThursdayToSunday = await fetch(
          `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${formattedThursday}-${formattedSunday}`
        );
        const data = await responseThursdayToSunday.json();

        // Check if events are available
        if (data.events && data.events.length > 0) {
          // Process and transform the data
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

            // Game status
            const statusType = event.status.type.name;
            let status;
            if (statusType === "STATUS_FINAL") {
              status = "Final";
            } else if (statusType === "STATUS_SCHEDULED") {
              status = "Scheduled";
            } else {
              status = "In Progress";
            }

            return {
              title: `${awayTeamName} @ ${homeTeamName}`,
              points: `${awayTeamScore} - ${homeTeamScore}`,
              status: status,
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

    // Call the fetch function
    fetchData();
  }, []); // No dependencies needed, so empty array

  return (
    <div className="App">
      <Ticker blocks={blocks} />
    </div>
  );
}

export default App;
