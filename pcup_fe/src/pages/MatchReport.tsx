import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "@/components/MatchReport/MatchInfo/MatchInfo";
import { MatchLog } from "@/components/MatchReport/MatchLog/MatchLog";
import { MatchSelector } from "@/components/MatchReport/MatchSelector";
import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";

export const MatchReport = () => {
  const { matchDetails, teamAway, teamHome } = useMatchContext();

  const isMatchSelected = matchDetails?.id !== 0; // Jestli už máme vybraný zápas

  return (
    <div className="flex flex-col gap-8">
      {!isMatchSelected ? (
        <div className="flex flex-col gap-4 items-center justify-center mt-16">
          <h2 className="text-2xl font-bold text-center">
            Vyberte zápas pro zápis
          </h2>
          <MatchSelector />
        </div>
      ) : (
        <>
          <MatchInfo teamHome={teamHome} teamAway={teamAway} />
          <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
            <MatchTeamTable team={teamHome} />
            <MatchTeamTable team={teamAway} />
          </div>
          <MatchLog />
        </>
      )}
    </div>
  );
};
