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
import { useEffect } from "react";

export interface MatchInfoProps {
  teamHome: Team;
  teamAway: Team;
}

const customHalftimes: Record<string, number> = {
  "Mini 6+1": 30,
};

export const MatchInfo = ({ teamHome, teamAway }: MatchInfoProps) => {
  const { data: categories } = useCategories();

  const category = categories?.find(
    (cat) => cat.id === teamHome.categoryId || cat.id === teamAway.categoryId
  );

  const halftime = customHalftimes[category?.name ?? ""] ?? 15 * 60;
  return (
    <CardMatchReport className="max-w-[calc(100vw-32px)] h-min shadow-lg overflow-hidden">
      {/* Header - Kategorie */}
      <CardMatchReportHeader className="text-white text-center py-2 sm:py-3">
        <h2 className="text-lg font-semibold">
          Kategorie: {category?.name || "N/A"}
        </h2>
      </CardMatchReportHeader>

      {/* Flexbox pro layout */}
      <CardContent className="flex sm:flex-row justify-between gap-4 w-full overflow-hidden p-4">
        {/* 🔹 Domácí tým */}
        <MatchTeamCard team={teamHome} side="home" />

        {/* 🔹 Skóre a časomíra */}
        <ScoreAndTime halftime={halftime} />

        {/* 🔹 Hostující tým */}
        <MatchTeamCard team={teamAway} side="away" />
      </CardContent>
    </CardMatchReport>
  );
};
