import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import ScoreAndTime from "./ScoreAndTime";
import {
  CardContent,
  CardMatchReport,
  CardMatchReportHeader,
} from "@/components/ui/card";

export const MatchInfo = () => {
  return (
    <>
      <CardMatchReport className="w-full h-min ">
        <CardMatchReportHeader className="h-min">
          <h2 className=" font-semibold">Kategorie: </h2>
        </CardMatchReportHeader>
        <CardContent className="p-6 grid grid-cols-3 gap-4">
          <ScoreAndTime />
        </CardContent>
      </CardMatchReport>
    </>
  );
};
