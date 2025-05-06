import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { showToast } from "../../../ui/showToast";
import { useReliableAddEvent } from "@/hooks/MatchReport/useEvent";

function YellowCardHandlers() {
  const { matchDetails, players, addEvent, updatePlayerStats } =
    useMatchContext();
  const [canAddYC, setCanAddYC] = useState<boolean>(true);
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  function addYellowCard(playerId: number): void {
    if (!canAddYC) return;
    setCanAddYC(false);

    const player = players.find((p) => p.id === playerId);
    if (!player) {
      setCanAddYC(true);
      return;
    }

    const isHome = matchDetails.homeTeam.players.some((p) => p.id === playerId);

    let toastMessage = `🟨 Žlutá karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    let eventMessage = `🟨 Žlutá karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0 || player.yellowCardCount > 0) return player;

      const updatedPlayer = { ...player };
      updatedPlayer.yellowCardCount = 1;

      return updatedPlayer;
    });

    const newEvent = {
      type: "Y",
      team: isHome ? "L" : "R",
      time: matchDetails.timePlayed,
      authorId: playerId,
      matchId: matchDetails.id,
      message: eventMessage,
    };

    // Add event to log
    addEvent(newEvent);

    // Add event to database
    addEventMutation.mutate(newEvent, {
      onError: (error) => {
        console.error("Error adding event:", error);
      },
    });

    showToast(toastMessage, "info");

    setTimeout(() => {
      setCanAddYC(true);
    }, 1000);
  }

  return { addYellowCard };
}

export default YellowCardHandlers;
