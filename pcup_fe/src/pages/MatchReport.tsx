import {
  MatchProvider,
  useMatchContext,
} from "@/Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "@/components/MatchReport/MatchInfo/MatchInfo";
import { MatchLog } from "@/components/MatchReport/MatchLog/MatchLog";
import { MatchSelector } from "@/components/MatchReport/MatchSelector";
import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";
import { useReconstructStats } from "@/hooks/MatchReport/useReconstructStats";
import { Match } from "@/interfaces/MatchReport/Match";
import { useEffect } from "react";
import { useLoaderData } from "react-router-dom";

export const MatchReport = () => {
  const { matchDetails, teamAway, teamHome } = useMatchContext();
  const match = useLoaderData() as Match;
  useReconstructStats();

  return (
    <div className="flex flex-col gap-8">
      <>
        <MatchInfo teamHome={teamHome} teamAway={teamAway} />
        <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
          <MatchTeamTable team={teamHome} />
          <MatchTeamTable team={teamAway} />
        </div>
        <MatchLog />
      </>
    </div>
  );
};
