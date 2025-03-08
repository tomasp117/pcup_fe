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
      let message = "";

      switch (goalType) {
        case GoalType.NormalHome:
          updatedPlayer.goalCount++;
          toastMessage = `Gól, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          message = `⚽ Gól, ${player.firstName} ${player.lastName} #${player.number}`;
          setScoreHome(scoreHome + 1);
          break;

        case GoalType.NormalAway:
          updatedPlayer.goalCount++;
          toastMessage = `Gól, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          message = `⚽ Gól, ${player.firstName} ${player.lastName} #${player.number}`;
          setScoreAway(scoreAway + 1);
          break;

        case GoalType.SevenHome:
          updatedPlayer.goalCount++;
          updatedPlayer.sevenScored++;
          toastMessage = `7m Gól, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          message = `⚽ 7m Gól, ${player.firstName} ${player.lastName} #${player.number}`;
          setScoreHome(scoreHome + 1);
          break;

        case GoalType.SevenAway:
          updatedPlayer.goalCount++;
          updatedPlayer.sevenScored++;
          toastMessage = `7m Gól, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          message = `⚽ 7m Gól, ${player.firstName} ${player.lastName} #${player.number}`;
          setScoreAway(scoreAway + 1);
          break;

        case GoalType.MissedHome:
          updatedPlayer.sevenMissed++;
          toastMessage = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number} pro domácí tým!`;
          message = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number}`;
          break;

        case GoalType.MissedAway:
          updatedPlayer.sevenMissed++;
          toastMessage = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number} pro hostující tým!`;
          message = `7m hod neproměněn, ${player.firstName} ${player.lastName} #${player.number}`;
          break;
      }

      addEvent({
        type: "G",
        team: matchDetails.homeTeam.players.some((p) => p.id === playerId)
          ? "L"
          : "R",
        time: matchDetails.timePlayed,
        authorID: playerId,
        message,
      });
      showToast(toastMessage + ` - Celkem gólů: ${updatedPlayer.goalCount}`);

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAddGoal(true);
    }, 1000);
  }

  const showToast = (message: string) => {
    console.log(message);
  };

  return { addGoal, GoalType };
}

export default GoalHandlers;
