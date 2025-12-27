import { useParams } from "react-router-dom";
import { MatchInfoPreview } from "../components/MatchReportPreview/MatchInfoPreview";
import { MatchTeamTablePreview } from "@/components/MatchReportPreview/MatchTeamTablePreview";
import { MatchLogPreview } from "@/components/MatchReportPreview/MatchLogPreview";
import { useMatchPreview } from "@/hooks/useMatches";
import { useReconstructedPlayers } from "@/hooks/usePlayers";
import { useMatchEventsPreview } from "@/hooks/MatchReport/useEvent";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const MatchPreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading } = useMatchPreview(id ? parseInt(id) : 0);
  const isPolling = match?.state !== "Done";
  const { data: events } = useMatchEventsPreview(Number(id), isPolling);

  const { homePlayers, awayPlayers } = useReconstructedPlayers(
    match!,
    events ?? []
  );

  useEffect(() => {
    if (match) {
      document.title = `${match.homeTeam.name} vs ${match.awayTeam.name} | Zápas`;
    }
  }, [match]);

  if (isLoading || !match)
    return (
      <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mt-8" />
    );
  console.log("MatchPreviewPage", match);
  return (
    <div className="flex flex-col gap-8">
      <>
        <MatchInfoPreview match={match} events={events} />
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
