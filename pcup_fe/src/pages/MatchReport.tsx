import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";
import { MatchProvider } from "../Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "../components/MatchReport/MatchInfo/MatchInfo";

export const MatchReport = () => {
  return (
    <MatchProvider>
      <div className="flex flex-col gap-8">
        <MatchInfo />
        <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
          <MatchTeamTable team="home" />
          <MatchTeamTable team="away" />
        </div>
      </div>
    </MatchProvider>
  );
};
