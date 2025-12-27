import { useState } from "react";
import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { showToast } from "../../../ui/showToast";
import { useReliableAddEvent } from "@/hooks/MatchReport/useEvent";

function TwoMinuteHandlers() {
  const { matchDetails, players, addEvent, updatePlayerStats } =
    useMatchContext();
  const [canAdd2M, setCanAdd2M] = useState<boolean>(true);
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  function addTwoMinutes(playerId: number): void {
    if (!canAdd2M) return;

    setCanAdd2M(false);

    const player = players.find((p) => p.id === playerId);

    if (!player) {
      setCanAdd2M(true);
      return;
    }
    if (player.twoMinPenaltyCount >= 3) {
      setCanAdd2M(true);
      return;
    }

    const isHome = matchDetails.homeTeam.players.some((p) => p.id === playerId);

    const toastMessage = `🕑 2 minuty - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    const eventMessage = `🕑 2 minuty - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    const redEventMessage = `🟥 Červená karta - ${player.person.firstName} ${player.person.lastName} #${player.number}`;
    //let willGetRedCard = false;

    const updatedCount = player.twoMinPenaltyCount + 1;

    updatePlayerStats(playerId, (player) => {
      const updatedPlayer = { ...player, twoMinPenaltyCount: updatedCount };

      if (updatedCount >= 3) {
        updatedPlayer.redCardCount = 1;
      }

      return updatedPlayer;
    });

    const newEvent = {
      type: "2",
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
      onSuccess: () => {
        if (updatedCount >= 3) {
          const redCardEvent = {
            type: "R",
            team: isHome ? "L" : "R",
            time: matchDetails.timePlayed,
            authorId: playerId,
            matchId: matchDetails.id,
            message: redEventMessage,
          };
          addEvent(redCardEvent);
          addEventMutation.mutate(redCardEvent, {
            onError: (error) => {
              console.error("Error adding event:", error);
            },
          });
          showToast(`${toastMessage} 🟥 Červená karta!`, "error");
        } else {
          showToast(toastMessage, "info");
        }
      },
    });

    setTimeout(() => {
      setCanAdd2M(true);
    }, 1000);
  }

  return { addTwoMinutes };
}

export default TwoMinuteHandlers;
