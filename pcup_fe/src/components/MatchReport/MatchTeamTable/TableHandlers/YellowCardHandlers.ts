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
      if (player.redCard > 0 || player.yellowCard > 0) return player;

      let updatedPlayer = { ...player };
      if (updatedPlayer.yellowCard === 1) {
        updatedPlayer.yellowCard = 0;
      } else updatedPlayer.yellowCard = 1;

      let toastMessage = `🟨 Žlutá karta - ${player.firstName} ${player.lastName} #${player.number}`;
      addEvent(createCardEvent(matchDetails.timePlayed, playerId));

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
