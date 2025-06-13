//import { useMatchContext } from "../../../Contexts/MatchReportContext/MatchContext";
import ScoreAndTime from "./ScoreAndTime";
import {
  CardContent,
  CardMatchReport,
  CardMatchReportHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MatchTeamCard } from "./MatchTeamCard";
import { Team } from "@/interfaces/MatchReport/Team";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";

export interface MatchInfoProps {
  teamHome: Team;
  teamAway: Team;
}

const customHalftimes: Record<string, number> = {
  "Mini 6+1": 12.5 * 60, // 12.5 minutes in seconds
};

export const MatchInfo = ({ teamHome, teamAway }: MatchInfoProps) => {
  const { data: categories } = useCategories();

  const { matchDetails, setSwapped, swapped } = useMatchContext();

  const [swapOrder, setSwapOrder] = useState(false);

  const category = categories?.find(
    (cat) => cat.id === teamHome.categoryId || cat.id === teamAway.categoryId
  );

  const halftime = customHalftimes[category?.name ?? ""] ?? 15 * 60;
  return (
    <CardMatchReport className="max-w-[calc(100vw-32px)] h-min shadow-lg overflow-hidden">
      {/* Header - Kategorie */}
      <CardMatchReportHeader className="text-white text-center py-2 sm:py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          Kategorie: {category?.name || "N/A"}
        </h2>
        <Button
          variant="secondaryOutline"
          size="sm"
          onClick={() => setSwapped((o) => !o)}
        >
          <Repeat className="w-4 h-4" />
        </Button>
      </CardMatchReportHeader>

      {/* Flexbox pro layout */}
      <CardContent className="flex sm:flex-row justify-between gap-4 w-full overflow-hidden p-4">
        {/* 🔹 Domácí tým */}
        {swapped ? (
          <>
            <MatchTeamCard team={teamAway} side="away" />
            <ScoreAndTime halftime={halftime} />
            <MatchTeamCard team={teamHome} side="home" />
          </>
        ) : (
          <>
            <MatchTeamCard team={teamHome} side="home" />
            <ScoreAndTime halftime={halftime} />
            <MatchTeamCard team={teamAway} side="away" />
          </>
        )}
      </CardContent>
    </CardMatchReport>
  );
};
