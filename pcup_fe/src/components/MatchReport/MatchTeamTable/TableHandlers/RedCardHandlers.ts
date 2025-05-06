import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { showToast } from "../../../ui/showToast";
import { useReliableAddEvent } from "@/hooks/MatchReport/useEvent";

export const RedCardHandlers = () => {
  const { matchDetails, addEvent, updatePlayerStats, players } =
    useMatchContext();
  const [canAddRC, setCanAddRC] = useState<boolean>(true);
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  function addRedCard(playerId: number): void {
    if (!canAddRC) return;
    setCanAddRC(false);

    const player = players.find((p) => p.id === playerId);
    if (!player) {
      setCanAddRC(true);
      return;
    }

    const toastMessage = `🟥 Červená karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    const eventMessage = `🟥 Červená karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    const isHome = matchDetails.homeTeam.players.some((p) => p.id === playerId);

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0) return player;

      const updatedPlayer = { ...player };
      updatedPlayer.redCardCount = 1;
      return updatedPlayer;
    });

    const newEvent = {
      type: "R",
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

    showToast(toastMessage, "error");

    setTimeout(() => {
      setCanAddRC(true);
    }, 1000);
  }

  return { addRedCard };
};
