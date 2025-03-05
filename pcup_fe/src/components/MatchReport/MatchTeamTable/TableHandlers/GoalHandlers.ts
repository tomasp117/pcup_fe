import {
  Player,
  useMatchContext,
} from "../../../../Contexts/MatchReportContext/MatchContext";
import { useState } from "react";

enum GoalType {
  NormalHome = "L",
  NormalAway = "R",
  SevenHome = "L7",
  SevenAway = "R7",
  MissedHome = "LN",
  MissedAway = "RN",
}

function GoalHandlers() {
  const {
    matchDetails,
    scoreHome,
    scoreAway,
    setScoreHome,
    setScoreAway,
    timerRunning,
    addEvent,
    updatePlayerStats,
  } = useMatchContext();
  const [canAddGoal, setCanAddGoal] = useState<boolean>(true);

  function addGoal(playerId: number, goalType: GoalType): void {
    if (!canAddGoal) return;
    setCanAddGoal(false);

    updatePlayerStats(playerId, (player) => {
      if (player.redCard > 0) return player;

      console.log("🔹 updatePlayerStats volán pro hráče:", playerId);

      let updatedPlayer = { ...player };

      let toastMessage = "";

      switch (goalType) {
        case GoalType.NormalHome:
          updatedPlayer.goalCount++;
          toastMessage = `Gól, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          setScoreHome(scoreHome + 1);
          break;

        case GoalType.NormalAway:
          updatedPlayer.goalCount++;
          toastMessage = `Gól, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          setScoreAway(scoreAway + 1);
          break;

        case GoalType.SevenHome:
          updatedPlayer.goalCount++;
          updatedPlayer.sevenScored++;
          toastMessage = `7m Gól, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          setScoreHome(scoreHome + 1);
          break;

        case GoalType.SevenAway:
          updatedPlayer.goalCount++;
          updatedPlayer.sevenScored++;
          toastMessage = `7m Gól, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          setScoreAway(scoreAway + 1);
          break;

        case GoalType.MissedHome:
          updatedPlayer.sevenMissed++;
          toastMessage = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          break;

        case GoalType.MissedAway:
          updatedPlayer.sevenMissed++;
          toastMessage = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          break;
      }

      addEvent(createGoalEvent(goalType, matchDetails.timePlayed, playerId));
      showToast(toastMessage + ` - Celkem gólů: ${updatedPlayer.goalCount}`);

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAddGoal(true);
    }, 1000);
  }

  function createGoalEvent(
    goalType: GoalType,
    timePlayed: string,
    playerId: number
  ) {
    const isHomeTeam = matchDetails.homeTeam.players.some(
      (p) => p.id === playerId
    );
    return {
      type: "G",
      team: isHomeTeam ? "L" : "R",
      time: timePlayed,
      authorID: playerId,
      goalType,
    };
  }

  const showToast = (message: string) => {
    console.log(message);
  };

  return { addGoal, GoalType };
}

export default GoalHandlers;
