import { useMemo } from "react";
import { Match } from "@/interfaces/MatchReport/Match";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Event } from "@/interfaces/MatchReport/Event";

export const useReconstructedPlayers = (match: Match, events: Event[]) => {
  return useMemo(() => {
    const playerMap = new Map<number, Player>();

    const allPlayers = [
      ...(match.homeTeam.players ?? []),
      ...(match.awayTeam.players ?? []),
    ];

    allPlayers.forEach((p) => {
      playerMap.set(p.id, {
        ...p,
        goalCount: 0,
        sevenMeterGoalCount: 0,
        sevenMeterMissCount: 0,
        yellowCardCount: 0,
        redCardCount: 0,
        twoMinPenaltyCount: 0,
      });
    });

    for (const event of events) {
      if (event.authorId == null) continue;
      const player = playerMap.get(event.authorId);
      if (!player) continue;

      switch (event.type) {
        case "G":
          player.goalCount++;
          break;
        case "7G":
          player.goalCount++;
          player.sevenMeterGoalCount++;
          break;
        case "7N":
          player.sevenMeterMissCount++;
          break;
        case "Y":
          player.yellowCardCount = 1;
          break;
        case "R":
          player.redCardCount = 1;
          break;
        case "2":
          player.twoMinPenaltyCount++;
          if (player.twoMinPenaltyCount >= 3) {
            player.redCardCount = 1;
          }
          break;
      }
    }

    return {
      homePlayers: match.homeTeam.players.map((p) => playerMap.get(p.id)!),
      awayPlayers: match.awayTeam.players.map((p) => playerMap.get(p.id)!),
    };
  }, [match, events]);
};
