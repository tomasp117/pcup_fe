import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { showToast } from "../../../ui/showToast";

function RedCardHandlers() {
  const { matchDetails, timerRunning, addEvent, updatePlayerStats } =
    useMatchContext();
  const [canAddRC, setCanAddRC] = useState<boolean>(true);

  function addRedCard(playerId: number): void {
    if (!canAddRC) return;
    setCanAddRC(false);
    console.log("🟥 updatePlayerStats volán pro hráče:", playerId);

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0) return player;

      let updatedPlayer = { ...player };
      updatedPlayer.redCardCount = 1;

      let toastMessage = `🟥 Červená karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
      let message = `🟥 Červená karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;

      addEvent({
        type: "R",
        team: matchDetails.homeTeam.players.some((p) => p.id === playerId)
          ? "L"
          : "R",
        time: matchDetails.timePlayed,
        authorID: playerId,
        message,
      });

      showToast(toastMessage, "error");

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAddRC(true);
    }, 1000);
  }

  return { addRedCard };
}

export default RedCardHandlers;
