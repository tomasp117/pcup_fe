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
import {
  useDeleteLastEvent,
  useMatchEvents,
} from "@/hooks/MatchReport/useEvent";
import { useCreateLineups, useUpdateMatch } from "@/hooks/useMatches";
import { toast } from "react-toastify";
import { set } from "date-fns";
import { usePenaltyTimer } from "@/hooks/MatchReport/usePenaltyTimer";

export const MatchLog = () => {
  const {
    matchDetails,
    events,
    matchState,
    setEvents,
    sethomeScore,
    setawayScore,
    updatePlayerStats,
    timerRunning,
    matchStarted,
    setMatchState,
    setMatchPhase,
    setTimerRunning,
    clearPenalty,
    swapped,
  } = useMatchContext();

  //const { clearPenalty } = usePenaltyTimer(timerRunning, matchState === "None");

  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null); // Stav pro sledování hoveru na posledním eventu

  const [pendingPlayerUpdate, setPendingPlayerUpdate] = useState<Event | null>(
    null
  );

  const isLocked = matchState === "Done";

  const [isUpdating, setIsUpdating] = useState(false);

  const createLineups = useCreateLineups();

  const { data: loadedEvents } = useMatchEvents(matchDetails.id);

  const deleteEventMutation = useDeleteLastEvent();

  const updateMatch = useUpdateMatch();

  useEffect(() => {
    if (loadedEvents) {
      setEvents(loadedEvents);
      console.log("Loaded events:", loadedEvents);

      loadedEvents.forEach((event) => {
        if (event.message.includes("Začátek 2. poločasu")) {
          console.log("Začátek 2. poločasu event found:", event);
          setMatchPhase("secondHalf");
        }
        if (event.message.includes("Konec zápasu")) {
          if (matchState === "Pending") {
            setMatchPhase("finished");
            return;
          }
          console.log("Konec zápasu event found:", event);
          setMatchPhase("postMatchConfirm");
        }
      });
    }
  }, [loadedEvents]);

  const removeLastEvent = () => {
    if (events.length === 0 || isUpdating) return;
    setIsUpdating(true);

    deleteEventMutation.mutate(matchDetails.id, {
      onSuccess: (deletedEvent) => {
        if (!deletedEvent) return;

        setEvents((prev) => prev.filter((e) => e.id !== deletedEvent.id));

        const { authorId, type, team, message } = deletedEvent;

        if (authorId !== null) {
          updatePlayerStats(authorId, (player) => {
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
                updatedPlayer.goalCount = Math.max(
                  updatedPlayer.goalCount - 1,
                  0
                );
              }

              if (isHomeTeam) sethomeScore((prev) => Math.max(prev - 1, 0));
              else setawayScore((prev) => Math.max(prev - 1, 0));
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
              clearPenalty(updatedPlayer.id);
              console.log(
                `Two-minute penalty cleared for player ${updatedPlayer.id}`
              );
            }

            if (type === "Y") updatedPlayer.yellowCardCount = 0;
            if (type === "R") updatedPlayer.redCardCount = 0;

            return updatedPlayer;
          });
        }

        setIsUpdating(false);
      },
      onError: () => setIsUpdating(false),
    });
  };

  // team = "L" pro domácí, "R" pro hosty – tento tým kontumuje
  const handleForfeit = (team: "L" | "R") => {
    if (!matchDetails) return;
    // když domácí kontumují, domácí = 0, hosté = 10; a naopak
    const homeScore = team === "L" ? 0 : 10;
    const awayScore = team === "R" ? 0 : 10;

    updateMatch.mutate(
      {
        id: matchDetails.id,
        timePlayed: "00:00",
        homeScore,
        awayScore,
        state: "Done",
      },
      {
        onSuccess: () => {
          setTimerRunning(false);

          setMatchState("Done");
          setMatchPhase("postMatchConfirm");
          // synchronizace UI
          sethomeScore(homeScore);
          setawayScore(awayScore);
          // pokud máte v kontextu metodu pro stav, zavolejte ji:

          createLineups.mutate(matchDetails.id);

          toast.success("Kontumace provedena");
        },
        onError: () => {
          toast.error("Nepodařilo se provést kontumaci");
        },
      }
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden table-fixed">
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="text-primary text-center w-[40%]">
              {swapped
                ? matchDetails?.awayTeam?.name ?? "Hosté"
                : matchDetails?.homeTeam?.name ?? "Domácí"}

              {/* {matchDetails?.homeTeam?.name ?? "Domácí"} */}
            </TableHead>
            <TableHead className="text-primary text-center w-[20%]">
              Čas
            </TableHead>
            <TableHead className="text-primary text-center w-[40%]">
              {swapped
                ? matchDetails?.homeTeam?.name ?? "Domácí"
                : matchDetails?.awayTeam?.name ?? "Hosté"}

              {/* {matchDetails?.awayTeam?.name ?? "Hosté"} */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!matchStarted && matchState !== "Done" ? (
            <TableRow>
              <TableCell className="text-center w-full">
                <Button
                  variant="destructive"
                  onClick={() =>
                    !swapped ? handleForfeit("L") : handleForfeit("R")
                  }
                >
                  Kontumace
                </Button>
              </TableCell>
              <TableCell className="text-center w-full">
                <Button variant="goalInfo">Zápas nezačal</Button>
              </TableCell>
              <TableCell className="text-center w-full">
                <Button
                  variant="destructive"
                  onClick={() =>
                    !swapped ? handleForfeit("R") : handleForfeit("L")
                  }
                >
                  Kontumace
                </Button>
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
                        {swapped
                          ? event.team === "R" && (
                              <Button variant={buttonVariant}>
                                {event.message}
                              </Button>
                            )
                          : event.team === "L" && (
                              <Button variant={buttonVariant}>
                                {event.message}
                              </Button>
                            )}
                      </TableCell>

                      {/* Střední část (čas + mazání posledního eventu) */}
                      <TableCell className="text-center max-w-[20%] whitespace-normal break-words">
                        <Button
                          variant={
                            !isLocked && isLast ? "eventDelete" : "goalInfo"
                          }
                          className="whitespace-normal break-words h-full max-w-full sm:min-w-[9ch]"
                          title={isLast ? "Smazat poslední událost" : ""}
                          onClick={
                            !isLocked && isLast ? removeLastEvent : undefined
                          }
                          //disabled={isLocked}
                          onMouseEnter={() =>
                            isLast && setHoveredEvent(originalIdx)
                          }
                          onMouseLeave={() => isLast && setHoveredEvent(null)}
                        >
                          {!isLocked &&
                          isLast &&
                          hoveredEvent === originalIdx ? (
                            <X size={24} />
                          ) : (
                            event.time
                          )}
                        </Button>
                      </TableCell>

                      {/* Pravá strana (hostující tým) */}
                      <TableCell className="text-center w-[40%] whitespace-normal break-words">
                        {swapped
                          ? event.team === "L" && (
                              <Button variant={buttonVariant}>
                                {event.message}
                              </Button>
                            )
                          : event.team === "R" && (
                              <Button variant={buttonVariant}>
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
