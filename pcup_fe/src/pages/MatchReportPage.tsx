import { useLoaderData } from "react-router-dom";
import { Match } from "@/interfaces/MatchReport/Match";
import { MatchProvider } from "@/Contexts/MatchReportContext/MatchContext";
import { MatchReport } from "./MatchReport";

export const MatchReportPage = () => {
  const match = useLoaderData() as Match;

  return (
    <MatchProvider match={match}>
      <MatchReport />
    </MatchProvider>
  );
};
