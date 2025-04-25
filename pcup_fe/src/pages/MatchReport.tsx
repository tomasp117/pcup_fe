import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";
import {
  MatchProvider,
  useMatchContext,
} from "../Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "../components/MatchReport/MatchInfo/MatchInfo";
import { useEffect, useState } from "react";
import { MatchLog } from "@/components/MatchReport/MatchLog/MatchLog";
import { Match } from "@/interfaces/MatchReport/Match";
import { Coach } from "@/interfaces/MatchReport/Person/Roles/Coach";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Team } from "@/interfaces/MatchReport/Team";

export const MatchReport = () => {
  const {
    matchDetails,
    teamAway,
    teamHome,
    setMatchDetails,
    setTeamAway,
    setTeamHome,
    setPlayers,
  } = useMatchContext();

  useEffect(() => {
    setMatchDetails(sampleMatchDetails);
    setTeamHome(sampleTeamHome);
    setTeamAway(sampleTeamAway);

    setPlayers([...samplePlayersHome, ...samplePlayersAway]);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <MatchInfo />
      <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
        <MatchTeamTable team={teamHome} />
        <MatchTeamTable team={teamAway} />
      </div>
      <MatchLog />
    </div>
  );
};
