import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import ScoreAndTime from "./ScoreAndTime";
import {
  CardContent,
  CardMatchReport,
  CardMatchReportHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MatchTeamCard from "./MatchTeamCard";

export const MatchInfo = () => {
  return (
    <CardMatchReport className="max-w-[calc(100vw-32px)] h-min shadow-lg overflow-hidden">
      {/* Header - Kategorie */}
      <CardMatchReportHeader className="text-white text-center py-2 sm:py-3">
        <h2 className="text-lg font-semibold">Kategorie:</h2>
      </CardMatchReportHeader>

      {/* Flexbox pro layout */}
      <CardContent className="flex justify-between gap-1 sm:gap-4 w-full overflow-hidden p-1 sm:p-4">
        {/* 🔹 Domácí tým */}
        <MatchTeamCard />
        {/* 🔹 Skóre a časomíra */}
        <ScoreAndTime />
        {/* 🔹 Hostující tým */}
        <MatchTeamCard />
      </CardContent>
    </CardMatchReport>
  );
};
