import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { showToast } from "../../../ui/showToast";

function TwoMinuteHandlers() {
  const { matchDetails, timerRunning, addEvent, updatePlayerStats } =
    useMatchContext();
  const [canAdd2M, setCanAdd2M] = useState<boolean>(true);

  function addTwoMinutes(playerId: number): void {
    if (!canAdd2M) return;
    setCanAdd2M(false);
    console.log("🕑 updatePlayerStats volán pro hráče:", playerId);

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0) return player;

      let updatedPlayer = { ...player };
      updatedPlayer.twoMinPenaltyCount++;

      let toastMessage = `🕑 2 minuty - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
      let message = `🕑 2 minuty - ${player.person.firstName} ${player.person.lastName} #${player.number}`;

      if (updatedPlayer.twoMinPenaltyCount >= 3) {
        updatedPlayer.redCardCount = 1;
        toastMessage += " 🟥 Červená karta!";
      }

      addEvent({
        type: "2",
        team: matchDetails.homeTeam.players.some((p) => p.id === playerId)
          ? "L"
          : "R",
        time: matchDetails.timePlayed,
        authorID: playerId,
        message,
      });

      if (updatedPlayer.redCardCount) {
        showToast(toastMessage, "error");
      } else {
        showToast(toastMessage, "info");
      }

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAdd2M(true);
    }, 1000);
  }

  return { addTwoMinutes };
}

export default TwoMinuteHandlers;
