import { useEffect } from "react";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";

export const useReconstructStats = () => {
  const {
    events,
    sethomeScore,
    setawayScore,
    setPlayers,
    players,
    matchDetails,
  } = useMatchContext();

  useEffect(() => {
    if (!matchDetails) return;
    if (matchDetails.state === "Done" && events.length === 0) {
      sethomeScore(matchDetails.homeScore);
      setawayScore(matchDetails.awayScore);
      return;
    }
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

    let homeScore = 0;
    let awayScore = 0;

    for (const event of events) {
      const { type, authorId, team } = event;
      if (authorId === null) continue;

      const player = playersMap.get(authorId);
      if (!player) continue;

      if (type === "G") {
        player.goalCount++;
        if (team === "L") homeScore++;
        else if (team === "R") awayScore++;
      }

      if (type === "7G") {
        player.sevenMeterGoalCount++;
        player.goalCount++;
        if (team === "L") homeScore++;
        else if (team === "R") awayScore++;
      }
      if (type === "7N") {
        player.sevenMeterMissCount++;
      }

      if (type === "Y") player.yellowCardCount = 1;
      if (type === "R") player.redCardCount = 1;
      if (type === "2") player.twoMinPenaltyCount++;
    }

    setPlayers(Array.from(playersMap.values()));
    sethomeScore(homeScore);
    setawayScore(awayScore);
  }, [matchDetails, events]);
};
