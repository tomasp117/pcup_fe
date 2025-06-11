import { Button } from "@/components/ui/button";
import {
  CardMatchReport,
  CardContent,
  CardContentNoPadding,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { useMatchTimer } from "@/hooks/MatchReport/useMatchTimer";
import { useUpdateMatch } from "@/hooks/useMatches";

import { Play, Pause, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

interface ScoreAndTimeProps {
  halftime: number;
}

export default function ScoreAndTime({ halftime }: ScoreAndTimeProps) {
  const {
    homeScore,
    awayScore,
    timePlayed,
    handleControl,
    timerRunning,
    timerPaused,
    matchPhase,
    initialCheckCompleted,
    startButtonClicked,
    resetMatch,
    addThirtySeconds,
    subtractThirtySeconds,
  } = useMatchTimer(halftime);

  const updateMatchMutation = useUpdateMatch();

  const { matchState, matchDetails } = useMatchContext();

  function getButtonIcon() {
    if (matchPhase === "finished" || matchPhase === "postMatchConfirm")
      return null;
    if (
      initialCheckCompleted &&
      startButtonClicked &&
      (!timerRunning || timerPaused)
    ) {
      return <Play className="w-6 h-6" fill="white" />;
    }
    if (timerRunning && !timerPaused) {
      return <Pause className="w-6 h-6" fill="white" />;
    }
    return null;
  }

  function getButtonText(): string {
    if (!initialCheckCompleted) return "Kontrola";
    if (!startButtonClicked) return "Start";
    if (matchPhase === "halftime" && !timerRunning && timerPaused)
      return "Start 2. poločasu";
    if (matchPhase === "finished") {
      return "Ptrvrdit zápis";
    }
    if (matchPhase === "postMatchConfirm") {
      return "Zápis potvrzen";
    }
    if (timerPaused) return "Resume";
    return "Pause";
  }

  return (
    <div className="flex flex-col items-center justify-between flex-1 min-w-0 max-w-[33%] sm:max-w-[20%] gap-4">
      {!navigator.onLine && (
        <span className="text-red-500 text-xs">
          Jste offline – nesynchronizuje se
        </span>
      )}

      <div className="flex justify-between gap-2 sm:gap-4 w-full h-[30%]">
        <CardMatchReport className="flex-1 w-full sm:p-4 p-2 justify-center">
          <CardContentNoPadding className="flex items-center justify-center w-full">
            <h2 className="text-md sm:text-2xl font-bold">{homeScore}</h2>
          </CardContentNoPadding>
        </CardMatchReport>

        <CardMatchReport className="flex-1 w-full sm:p-4 p-2 justify-center">
          <CardContentNoPadding className="flex items-center justify-center w-full">
            <h2 className="text-md sm:text-2xl font-bold">{awayScore}</h2>
          </CardContentNoPadding>
        </CardMatchReport>
      </div>

      <CardMatchReport className="w-full flex justify-center h-[70%] sm:p-4 p-2 flex-1">
        <CardContent className="flex flex-col items-center w-full p-0  gap-4">
          <div className="flex items-center">
            <Button
              variant={"secondaryOutline"}
              onClick={subtractThirtySeconds}
              disabled={!navigator.onLine && matchPhase === "finished"}
              className=""
            >
              <Minus className="" />
            </Button>
            <h1 className="text-md sm:text-4xl font-bold">{timePlayed}</h1>
            <Button
              variant={"secondaryOutline"}
              onClick={addThirtySeconds}
              disabled={!navigator.onLine && matchPhase === "finished"}
              className=""
            >
              <Plus className="" />
            </Button>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className="flex items-center gap-2 text-xs sm:text-sm xl:text-xl p-2 sm:p-4 xl:p-6 w-full whitespace-normal"
                    onClick={handleControl}
                    disabled={!navigator.onLine && matchPhase === "finished"}
                  >
                    {getButtonIcon()}{" "}
                    <span className="block sm:inline">{getButtonText()}</span>
                  </Button>
                </span>
              </TooltipTrigger>
              {!navigator.onLine && matchPhase === "finished" && (
                <TooltipContent>
                  Jsi offline, nemůžeš potvrdit zápas
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="">
                <span>
                  {matchState === "Done" ? (
                    <Button
                      variant="destructive"
                      className="whitespace-normal"
                      onClick={async () => {
                        // zde si můžeš udělat případně confirm dialog
                        await updateMatchMutation.mutateAsync({
                          id: matchDetails.id,
                          timePlayed: timePlayed,
                          homeScore: homeScore,
                          awayScore: awayScore,
                          state: "Pending",
                        });
                        toast.success("Zápas je znovu otevřen k editaci.");
                        window.location.reload();
                        // můžeš případně refetchnout zápas
                      }}
                    >
                      <span className="block sm:inline">Editovat zápis</span>
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      className="whitespace-normal"
                      onClick={() => {
                        if (confirm("Opravdu chceš celý zápas resetovat?")) {
                          resetMatch();
                        }
                      }}
                      disabled={!navigator.onLine}
                    >
                      <span className="block sm:inline">Reset zápasu</span>
                    </Button>
                  )}
                </span>
              </TooltipTrigger>
              {!navigator.onLine && (
                <TooltipContent>
                  Jsi offline, nemůžeš vyresetovat zápas
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardContent>
      </CardMatchReport>
    </div>
  );
}
