import { useLoaderData, useParams } from "react-router-dom";
import { Match } from "@/interfaces/MatchReport/Match";
import { MatchProvider } from "@/Contexts/MatchReportContext/MatchContext";
import { MatchReport } from "./MatchReport";
import { MatchInfoPreview } from "../components/MatchReportPreview/MatchInfoPreview";
import { MatchTeamTablePreview } from "@/components/MatchReportPreview/MatchTeamTablePreview";
import { MatchLogPreview } from "@/components/MatchReportPreview/MatchLogPreview";
import { useMatchPreview } from "@/hooks/useMatches";
import { useReconstructedPlayers } from "@/hooks/usePlayers";
import { useMatchEventsPreview } from "@/hooks/MatchReport/useEvent";
import { Loader2 } from "lucide-react";

export const MatchPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading } = useMatchPreview(id ? parseInt(id) : 0);
  const isPolling = match?.state !== "Done";
  const { data: events } = useMatchEventsPreview(Number(id), isPolling);

  const { homePlayers, awayPlayers } = useReconstructedPlayers(
    match!,
    events ?? []
  );
  if (isLoading || !match)
    return (
      <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mt-8" />
    );
  console.log("MatchPreviewPage", match);
  return (
    <div className="flex flex-col gap-8">
      <>
        <MatchInfoPreview match={match} />
        <div className=" flex-col sm:flex-row flex w-full gap-8 max-w-[calc(100vw-32px)]">
          <MatchTeamTablePreview
            team={match.homeTeam}
            match={match}
            players={homePlayers}
          />
          <MatchTeamTablePreview
            team={match.awayTeam}
            match={match}
            players={awayPlayers}
          />
        </div>
        <MatchLogPreview match={match} />
      </>
    </div>
  );
};
