import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { Event } from "@/interfaces/MatchReport/Event";

export const MatchLog = () => {
  const {
    matchDetails,
    events,
    setEvents,
    setScoreHome,
    setScoreAway,
    updatePlayerStats,
    timerRunning,
  } = useMatchContext();

  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null); // Stav pro sledování hoveru na posledním eventu

  const [pendingPlayerUpdate, setPendingPlayerUpdate] = useState<Event | null>(
    null
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const removeLastEvent = () => {
    if (events.length === 0 || isUpdating) return;

    setIsUpdating(true);

    const lastNonInfoIndex = [...events]
      .reverse()
      .findIndex((event) => event.type !== "I");

    if (lastNonInfoIndex === -1) return;

    const eventToRemove = events[events.length - 1 - lastNonInfoIndex];

    setEvents((prevEvents) =>
      prevEvents.filter(
        (_, idx) => idx !== events.length - 1 - lastNonInfoIndex
      )
    );

    setPendingPlayerUpdate(eventToRemove);
  };

  useEffect(() => {
    if (!pendingPlayerUpdate) return;

    const { authorID, type, team, message } = pendingPlayerUpdate;

    if (authorID !== null) {
      updatePlayerStats(authorID, (player) => {
        let updatedPlayer = { ...player };

        if (type === "G") {
          const isHomeTeam = team === "L";
          const isSevenMeterMissed = message.includes("7m hod neproměněn");
          const isSevenMeter = message.includes("7m Gól");

          if (isSevenMeterMissed) {
            updatedPlayer.sevenMeterMissCount = Math.max(
              updatedPlayer.sevenMeterMissCount - 1,
              0
            );

            return updatedPlayer;
          } else if (isSevenMeter) {
            updatedPlayer.sevenMeterGoalCount = Math.max(
              updatedPlayer.sevenMeterGoalCount - 1,
              0
            );
          } else {
            updatedPlayer.goalCount = Math.max(updatedPlayer.goalCount - 1, 0);
          }

          if (isHomeTeam) {
            setScoreHome((prev) => Math.max(prev - 1, 0));
          } else {
            setScoreAway((prev) => Math.max(prev - 1, 0));
          }
        }

        if (type === "2") {
          updatedPlayer.twoMinPenaltyCount = Math.max(
            updatedPlayer.twoMinPenaltyCount - 1,
            0
          );
          if (
            updatedPlayer.redCardCount &&
            updatedPlayer.twoMinPenaltyCount < 3
          ) {
            updatedPlayer.redCardCount = 0;
          }
        }

        if (type === "Y") updatedPlayer.yellowCardCount = 0;
        if (type === "R") updatedPlayer.redCardCount = 0;

        return updatedPlayer;
      });
    }
    setPendingPlayerUpdate(null);
    setIsUpdating(false);
  }, [pendingPlayerUpdate]);

  const eventTypes: Record<string, string> = {
    G: "Gól",
    Y: "Žlutá karta",
    R: "Červená karta",
    "2": "2 minuty",
    I: "Info",
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden table-fixed">
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="text-primary text-center w-[40%]">
              {matchDetails.homeTeam.name}
            </TableHead>
            <TableHead className="text-primary text-center w-[20%]">
              Čas
            </TableHead>
            <TableHead className="text-primary text-center w-[40%]">
              {matchDetails.awayTeam.name}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!timerRunning ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center w-full">
                <Button variant="goalInfo">Zápas nezačal</Button>
              </TableCell>
            </TableRow>
          ) : (
            [...events].reverse().map((event, reversedIdx) => {
              // Najdeme index posledního ne-info eventu v původním seznamu
              const lastNonInfoIndex = events.lastIndexOf(
                events
                  .slice()
                  .reverse()
                  .find((event) => event.type !== "I")!
              );

              // Přepočítáme původní index, protože jsme otočili pole
              const originalIdx = events.length - 1 - reversedIdx;
              const isLast = originalIdx === lastNonInfoIndex;

              // Nastavení varianty tlačítka podle události
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
                          variant={isLast ? "eventDelete" : "goalInfo"}
                          className="whitespace-normal break-words h-full max-w-full sm:min-w-[9ch]"
                          title={isLast ? "Smazat poslední událost" : ""}
                          onClick={isLast ? removeLastEvent : undefined}
                          onMouseEnter={() =>
                            isLast && setHoveredEvent(originalIdx) && {}
                          }
                          onMouseLeave={() => isLast && setHoveredEvent(null)}
                        >
                          {isLast && hoveredEvent === originalIdx ? (
                            <X size={24} />
                          ) : (
                            event.time
                          )}
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
