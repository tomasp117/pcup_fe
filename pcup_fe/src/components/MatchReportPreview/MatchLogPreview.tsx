import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMatchEventsPreview } from "@/hooks/MatchReport/useEvent";
import { Match } from "@/interfaces/MatchReport/Match";

interface MatchLogPreviewProps {
  match: Match;
}

export const MatchLogPreview = ({ match }: MatchLogPreviewProps) => {
  const isPolling = match.state !== "Done";
  const { data: events, error } = useMatchEventsPreview(match.id, isPolling);

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Chyba při načítání událostí: {error.message}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-gray-500 text-center">
        Zápas nezačal nebo nebyly zaznamenány žádné události.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden table-fixed">
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="text-primary text-center w-[40%]">
              {match?.homeTeam?.name ?? "Domácí"}
            </TableHead>
            <TableHead className="text-primary text-center w-[20%]">
              Čas
            </TableHead>
            <TableHead className="text-primary text-center w-[40%]">
              {match?.awayTeam?.name ?? "Hosté"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!match ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center w-full">
                <Button variant="goalInfo">Zápas nezačal</Button>
              </TableCell>
            </TableRow>
          ) : (
            [...events].reverse().map((event, reversedIdx) => {
              const lastNonInfoIndex = events.lastIndexOf(
                events
                  .slice()
                  .reverse()
                  .find((event) => event.type !== "I")!
              );

              const originalIdx = events.length - 1 - reversedIdx;
              const isLast = originalIdx === lastNonInfoIndex;

              const buttonVariant =
                event.type === "Y"
                  ? "yellowCardCount"
                  : event.type === "R"
                  ? "redCardCount"
                  : event.type === "2"
                  ? "twoMinPenaltyCountute"
                  : "goalInfo";

              return (
                <TableRow key={originalIdx}>
                  {event.type === "I" ? (
                    <TableCell colSpan={3} className="text-center w-full">
                      <Button variant="goalInfo">{event.message}</Button>
                    </TableCell>
                  ) : (
                    <>
                      {/* Levá strana (domácí tým) */}
                      <TableCell className="text-center w-[40%] whitespace-normal break-words">
                        {event.team === "L" && (
                          <Button
                            variant={buttonVariant}
                            className="whitespace-normal break-words h-full"
                          >
                            {event.message}
                          </Button>
                        )}
                      </TableCell>

                      {/* Střední část (čas + mazání posledního eventu) */}
                      <TableCell className="text-center max-w-[20%] whitespace-normal break-words">
                        <Button
                          variant={"goalInfo"}
                          className="whitespace-normal break-words h-full max-w-full sm:min-w-[9ch]"
                          title={isLast ? "Smazat poslední událost" : ""}
                        >
                          {event.time}
                        </Button>
                      </TableCell>

                      {/* Pravá strana (hostující tým) */}
                      <TableCell className="text-center w-[40%] whitespace-normal break-words">
                        {event.team === "R" && (
                          <Button
                            variant={buttonVariant}
                            className="whitespace-normal break-words h-full"
                          >
                            {event.message}
                          </Button>
                        )}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
