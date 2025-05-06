import { useEffect, useRef } from "react";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";

export const useReconstructStats = () => {
  const {
    events,
    updatePlayerStats,
    setScoreHome,
    setScoreAway,
    setPlayers,
    players,
  } = useMatchContext();

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!events || events.length === 0) return;
    if (players.length === 0) return;

    const playersMap = new Map<number, Player>();
    players.forEach((p) =>
      playersMap.set(p.id, {
        ...p,
        goalCount: 0,
        sevenMeterGoalCount: 0,
        sevenMeterMissCount: 0,
        yellowCardCount: 0,
        redCardCount: 0,
        twoMinPenaltyCount: 0,
      })
    );

    let scoreHome = 0;
    let scoreAway = 0;

    for (const event of events) {
      const { type, authorId, team, message } = event;
      if (authorId === null) continue;

      const player = playersMap.get(authorId);
      if (!player) continue;

      if (type === "G") {
        const isSeven = message.includes("7m Gól");
        const isMissed = message.includes("7m hod neproměněn");

        if (isMissed) {
          player.sevenMeterMissCount++;
        } else if (isSeven) {
          player.sevenMeterGoalCount++;
          if (team === "L") scoreHome++;
          else if (team === "R") scoreAway++;
        } else {
          player.goalCount++;
          if (team === "L") scoreHome++;
          else if (team === "R") scoreAway++;
        }
      }

      if (type === "Y") player.yellowCardCount = 1;
      if (type === "R") player.redCardCount = 1;
      if (type === "2") player.twoMinPenaltyCount++;
    }

    setPlayers(Array.from(playersMap.values()));
    setScoreHome(scoreHome);
    setScoreAway(scoreAway);
  }, [events]);
};
