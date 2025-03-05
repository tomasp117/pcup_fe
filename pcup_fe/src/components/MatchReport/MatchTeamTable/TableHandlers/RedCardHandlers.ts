import { useState } from "react";
import { useMatchContext } from "../../../../contexts/MatchReportContext/MatchContext";

function RedCardHandlers() {
  const { matchDetails, timerRunning, addEvent, updatePlayerStats } = useMatchContext();
  const [canAddRC, setCanAddRC] = useState<boolean>(true);

  function addRedCard(playerId: number): void {
    if (!canAddRC) return;
    setCanAddRC(false);
    console.log("🟨 updatePlayerStats volán pro hráče:", playerId);

    updatePlayerStats(playerId, (player) => {
      let updatedPlayer = { ...player };
      if(updatedPlayer.redCard === 1) {
        updatedPlayer.redCard = 0;
      }
      else updatedPlayer.redCard = 1;

      let toastMessage = `Cervena karta - ${player.firstName} ${player.lastName} #${player.number}`;
      addEvent(createCardEvent(matchDetails.timePlayed, playerId));

      showToast(toastMessage);

      return updatedPlayer;
    });

    setTimeout(() => {
      setCanAddRC(true);
    }, 1000);
  }

  function createCardEvent(timePlayed: string, playerId: number) {
    const isHomeTeam = matchDetails.homeTeam.players.some((p) => p.id === playerId);
    return {
      type: "R", 
      team: isHomeTeam ? "L" : "R",
      time: timePlayed,
      authorID: playerId,
    };
  }

  const showToast = (message: string) => {
    console.log(message);
  };

  return { addRedCard };
}

export default RedCardHandlers;
