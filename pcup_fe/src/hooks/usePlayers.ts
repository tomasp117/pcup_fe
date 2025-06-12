import { useMemo } from "react";
import { Match } from "@/interfaces/MatchReport/Match";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Event } from "@/interfaces/MatchReport/Event";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useReconstructedPlayers = (match: Match, events: Event[]) => {
  return useMemo(() => {
    if (!match) return { homePlayers: [], awayPlayers: [] };

    let homePlayers: Player[] = [];
    let awayPlayers: Player[] = [];

    if (match.state === "Done" && events.length === 0) {
      // použijeme přímo lineup (pokud existuje) nebo týmy
      const source = match.lineups?.length
        ? match.lineups.flatMap((l) => l.players.map((lp) => lp.player))
        : [...match.homeTeam.players, ...match.awayTeam.players];

      homePlayers = source
        .filter((p) => p.teamId === match.homeTeam.id)
        .map((p) => ({ ...p, goalCount: 0, sevenMeterGoalCount: 0 /* ... */ }));
      awayPlayers = source
        .filter((p) => p.teamId === match.awayTeam.id)
        .map((p) => ({ ...p /* ... */ }));

      return { homePlayers, awayPlayers };
    }

    // pokud je zápas hotový a lineupy existují, ber hráče z nich
    if (match.state === "Done" && match.lineups && match.lineups.length > 0) {
      const homeLineup = match.lineups.find(
        (l) => l.teamId === match.homeTeam.id
      );
      const awayLineup = match.lineups.find(
        (l) => l.teamId === match.awayTeam.id
      );

      homePlayers =
        homeLineup?.players.map((lp) => ({
          ...lp.player,
          goalCount: 0,
          sevenMeterGoalCount: 0,
          sevenMeterMissCount: 0,
          yellowCardCount: 0,
          redCardCount: 0,
          twoMinPenaltyCount: 0,
        })) ?? [];

      awayPlayers =
        awayLineup?.players.map((lp) => ({
          ...lp.player,
          goalCount: 0,
          sevenMeterGoalCount: 0,
          sevenMeterMissCount: 0,
          yellowCardCount: 0,
          redCardCount: 0,
          twoMinPenaltyCount: 0,
        })) ?? [];
    } else {
      // jinak klasicky z týmů
      homePlayers = (match.homeTeam.players ?? []).map((p) => ({
        ...p,
        goalCount: 0,
        sevenMeterGoalCount: 0,
        sevenMeterMissCount: 0,
        yellowCardCount: 0,
        redCardCount: 0,
        twoMinPenaltyCount: 0,
      }));

      awayPlayers = (match.awayTeam.players ?? []).map((p) => ({
        ...p,
        goalCount: 0,
        sevenMeterGoalCount: 0,
        sevenMeterMissCount: 0,
        yellowCardCount: 0,
        redCardCount: 0,
        twoMinPenaltyCount: 0,
      }));
    }

    // ---- aplikuj eventy na hráče ----
    const playerMap = new Map<number, Player>();
    [...homePlayers, ...awayPlayers].forEach((p) => {
      playerMap.set(p.id, { ...p });
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

    // finální výstup z mapy
    return {
      homePlayers: homePlayers.map((p) => playerMap.get(p.id)!),
      awayPlayers: awayPlayers.map((p) => playerMap.get(p.id)!),
    };
  }, [match, events]);
};

export const useUpdatePlayerNumber = () => {
  const qc = useQueryClient();

  return useMutation<void, Error, { id: number; newNumber: number }>({
    mutationFn: ({ id, newNumber }) =>
      fetch(`${API_URL}/players/${id}/update-number`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newNumber),
      }).then((res) => {
        if (!res.ok) throw new Error("Chyba při updatu čísla hráče");
      }),

    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["players", id] });
    },
  });
};
