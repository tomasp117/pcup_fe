import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "@/components/MatchReport/MatchInfo/MatchInfo";
import { MatchLog } from "@/components/MatchReport/MatchLog/MatchLog";
import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";
import { useReconstructStats } from "@/hooks/MatchReport/useReconstructStats";
import { useOfflineProtection } from "@/hooks/useOfflineProtection";

export const MatchReport = () => {
  const { teamAway, teamHome, swapped } = useMatchContext();

  useReconstructStats();
  useOfflineProtection();
  return (
    <div className="flex flex-col gap-8">
      <>
        <MatchInfo teamHome={teamHome} teamAway={teamAway} />
        <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
          {!swapped ? (
            <>
              <MatchTeamTable team={teamHome} />
              <MatchTeamTable team={teamAway} />
            </>
          ) : (
            <>
              <MatchTeamTable team={teamAway} />
              <MatchTeamTable team={teamHome} />
            </>
          )}
        </div>
        <MatchLog />
      </>
    </div>
  );
};
