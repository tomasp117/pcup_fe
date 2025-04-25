import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";

function YellowCardHandlers() {
  const { matchDetails, timerRunning, addEvent, updatePlayerStats } =
    useMatchContext();
  const [canAddYC, setCanAddYC] = useState<boolean>(true);

  function addYellowCard(playerId: number): void {
    if (!canAddYC) return;
    setCanAddYC(false);
    console.log("🟨 updatePlayerStats volán pro hráče:", playerId);

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0 || player.yellowCardCount > 0) return player;

      let updatedPlayer = { ...player };
      if (updatedPlayer.yellowCardCount === 1) {
        updatedPlayer.yellowCardCount = 0;
      } else updatedPlayer.yellowCardCount = 1;

      let toastMessage = `🟨 Žlutá karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
      let message = `🟨 Žlutá karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
      addEvent({
        type: "Y",
        team: matchDetails.homeTeam.players.some((p) => p.id === playerId)
          ? "L"
          : "R",
        time: matchDetails.timePlayed,
        authorID: playerId,
        message,
      });

      showToast(toastMessage);

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAddYC(true);
    }, 1000);
  }

  function createCardEvent(timePlayed: string, playerId: number) {
    const isHomeTeam = matchDetails.homeTeam.players.some(
      (p) => p.id === playerId
    );
    return {
      type: "Y",
      team: isHomeTeam ? "L" : "R",
      time: timePlayed,
      authorID: playerId,
    };
  }

  const showToast = (message: string) => {
    console.log(message);
  };

  return { addYellowCard };
}

export default YellowCardHandlers;
