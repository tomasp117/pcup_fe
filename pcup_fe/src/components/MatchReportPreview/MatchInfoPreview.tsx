import { useCategories } from "@/hooks/useCategories";
import { Team } from "@/interfaces/MatchReport/Team";
import {
  CardContent,
  CardMatchReport,
  CardMatchReportHeader,
} from "../ui/card";
import { MatchTeamCard } from "../MatchReport/MatchInfo/MatchTeamCard";
import ScoreAndTime from "../MatchReport/MatchInfo/ScoreAndTime";
import { Match } from "@/interfaces/MatchReport/Match";
import { ScoreAndTimePreview } from "./ScoreAndTimePreview";

export interface MatchInfoPreviewProps {
  match: Match;
}

export const MatchInfoPreview = ({ match }: MatchInfoPreviewProps) => {
  const { data: categories } = useCategories();

  const category = categories?.find(
    (cat) =>
      cat.id === match.homeTeam.categoryId ||
      cat.id === match.awayTeam.categoryId
  );
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
        <MatchTeamCard team={match.homeTeam} side="home" />

        {/* 🔹 Skóre a časomíra */}
        <ScoreAndTimePreview match={match} />

        {/* 🔹 Hostující tým */}
        <MatchTeamCard team={match.awayTeam} side="away" />
      </CardContent>
    </CardMatchReport>
  );
};
