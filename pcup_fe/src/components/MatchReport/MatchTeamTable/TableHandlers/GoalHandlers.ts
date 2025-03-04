import {
  Player,
  Team,
  useMatchContext,
} from "@/Contexts/MatchReportContext/MatchContext";
import { useState } from "react";

function GoalHandlers(team: Team) {
  const {
    matchDetails,
    scoreHome,
    scoreAway,
    setScoreHome,
    setScoreAway,
    timerRunning,
    addEvent,
  } = useMatchContext();
  const [canAddGoal, setCanAddGoal] = useState<boolean>(true);

  const isHomeTeam = team.id === matchDetails.homeTeam.id;

  const teamSide = isHomeTeam ? "L" : "R";

  function addGoal(player: Player, goalType: string): void {
    if (canAddGoal && timerRunning) {
      setCanAddGoal(false);

      const currentPlayer = team.players.find((p) => p === player);

      // Zpracování hráčů přímo z team.players
      if (currentPlayer && !currentPlayer.redCard) {
        let toastMessage = "";

        switch (goalType) {
          case "L":
            currentPlayer.goalCount++;
            toastMessage = `Gól, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro domácí tým!`;
            setScoreHome(scoreHome + 1);
            break;

          case "R":
            currentPlayer.goalCount++;
            toastMessage = `Gól, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro hostující tým!`;
            setScoreAway(scoreAway + 1);
            break;

          case "L7":
            currentPlayer.goalCount++;
            currentPlayer.sevenScored++;
            toastMessage = `7m Gól, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro domácí tým!`;
            setScoreHome(scoreHome + 1);
            break;

          case "R7":
            currentPlayer.goalCount++;
            currentPlayer.sevenScored++;
            toastMessage = `7m Gól, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro hostující tým!`;
            setScoreAway(scoreAway + 1);
            break;

          case "LN":
            currentPlayer.sevenMissed++;
            toastMessage = `7m hod neproměněn, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro domácí tým!`;
            break;

          case "RN":
            currentPlayer.sevenMissed++;
            toastMessage = `7m hod neproměněn, ${
              currentPlayer.firstName + " " + currentPlayer.lastName
            } #${currentPlayer.number} pro hostující tým!`;
            break;
        }

        // Přidání události do logu
        addEvent({
          type: "G",
          team: isHomeTeam ? "L" : "R",
          time: matchDetails.timePlayed,
          authorID: currentPlayer.id,
        });

        showToast(toastMessage + ` - Celkem gólů: ${currentPlayer.goalCount}`);
      }
      setTimeout(() => {
        setCanAddGoal(true);
      }, 1000);
    }
  }

  const showToast = (message: string) => {
    console.log(message);
  };

  return { addGoal, teamSide };
}

export default GoalHandlers;
