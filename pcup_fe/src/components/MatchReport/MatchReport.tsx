import { MatchProvider } from "../../Contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "./MatchInfo/MatchInfo";

export const MatchReport = () => {
  return (
    <MatchProvider>
      <>
        <MatchInfo />
      </>
    </MatchProvider>
  );
};
