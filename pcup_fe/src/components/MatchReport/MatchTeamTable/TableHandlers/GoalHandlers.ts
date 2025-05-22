import { useMatchContext } from "../../../../Contexts/MatchReportContext/MatchContext";
import { useState } from "react";
import { showToast } from "../../../ui/showToast";

import { useQueryClient } from "@tanstack/react-query";

import { Event } from "@/interfaces/MatchReport/Event";
import { useReliableAddEvent } from "@/hooks/MatchReport/useEvent";

enum GoalType {
  NormalHome = "L",
  NormalAway = "R",
  SevenHome = "L7",
  SevenAway = "R7",
  MissedHome = "LN",
  MissedAway = "RN",
}

const getEventType = (goalType: GoalType): string => {
  switch (goalType) {
    case GoalType.NormalHome:
      return "G";
    case GoalType.NormalAway:
      return "G";
    case GoalType.SevenHome:
      return "7G";
    case GoalType.SevenAway:
      return "7G";
    case GoalType.MissedHome:
      return "7N";
    case GoalType.MissedAway:
      return "7N";
    default:
      return "";
  }
};

function GoalHandlers() {
  const {
    matchDetails,

    setScoreHome,
    players,
    setScoreAway,

    addEvent,
    updatePlayerStats,
  } = useMatchContext();
  const [canAddGoal, setCanAddGoal] = useState<boolean>(true);
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  const queryClient = useQueryClient();

  function addGoal(playerId: number, goalType: GoalType): void {
    if (!canAddGoal) return;
    setCanAddGoal(false);

    let toastMessage = "";
    let eventMessage = "";

    const isHome = matchDetails.homeTeam.players.some((p) => p.id === playerId);

    // 🔹 Nejprve najdeme hráče, abychom si připravili jména
    const player = players.find((p) => p.id === playerId);
    if (!player) {
      setCanAddGoal(true);
      return;
    }

    // 🔹 Připravíme si zprávy dopředu
    switch (goalType) {
      case GoalType.NormalHome:
        toastMessage = `Gól, ${player.person.firstName} ${player.person.lastName} #${player.number} pro domácí tým!`;
        eventMessage = `⚽ Gól, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
      case GoalType.NormalAway:
        toastMessage = `Gól, ${player.person.firstName} ${player.person.lastName} #${player.number} pro hostující tým!`;
        eventMessage = `⚽ Gól, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
      case GoalType.SevenHome:
        toastMessage = `7m Gól, ${player.person.firstName} ${player.person.lastName} #${player.number} pro domácí tým!`;
        eventMessage = `⚽ 7m Gól, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
      case GoalType.SevenAway:
        toastMessage = `7m Gól, ${player.person.firstName} ${player.person.lastName} #${player.number} pro hostující tým!`;
        eventMessage = `⚽ 7m Gól, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
      case GoalType.MissedHome:
        toastMessage = `7m hod neproměněn, ${player.person.firstName} ${player.person.lastName} #${player.number} pro domácí tým!`;
        eventMessage = `7m hod neproměněn, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
      case GoalType.MissedAway:
        toastMessage = `7m hod neproměněn, ${player.person.firstName} ${player.person.lastName} #${player.number} pro hostující tým!`;
        eventMessage = `7m hod neproměněn, ${player.person.firstName} ${player.person.lastName} #${player.number}`;
        break;
    }

    updatePlayerStats(playerId, (player) => {
      if (player.redCardCount > 0) return player;

      const updatedPlayer = { ...player };

      if (
        goalType === GoalType.NormalHome ||
        goalType === GoalType.NormalAway ||
        goalType === GoalType.SevenHome ||
        goalType === GoalType.SevenAway
      ) {
        updatedPlayer.goalCount++;
      }

      if (goalType === GoalType.SevenHome || goalType === GoalType.SevenAway) {
        updatedPlayer.sevenMeterGoalCount++;
      }

      if (
        goalType === GoalType.MissedHome ||
        goalType === GoalType.MissedAway
      ) {
        updatedPlayer.sevenMeterMissCount++;
      }
      console.log("updatedPlayer", updatedPlayer);

      return updatedPlayer;
    });

    // 🔹 Teď můžeme bezpečně upravit skóre, event a ukázat toast
    if (goalType === GoalType.NormalHome || goalType === GoalType.SevenHome) {
      setScoreHome((prev) => prev + 1);
      console.log("setScoreHome", goalType);
    }
    if (goalType === GoalType.NormalAway || goalType === GoalType.SevenAway) {
      setScoreAway((prev) => prev + 1);
    }

    const newEvent: Event = {
      type: getEventType(goalType),
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

    showToast(toastMessage, "success");

    setTimeout(() => {
      setCanAddGoal(true);
    }, 1000);
  }

  return { addGoal, GoalType };
}

export default GoalHandlers;
