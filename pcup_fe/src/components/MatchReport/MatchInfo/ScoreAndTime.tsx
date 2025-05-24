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
import { useMatchTimer } from "@/hooks/MatchReport/useMatchTimer";

import { Play, Pause } from "lucide-react";

export default function ScoreAndTime() {
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
  } = useMatchTimer();

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
          <h1 className="text-md sm:text-4xl font-bold">{timePlayed}</h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    className="flex items-center gap-2 text-xs sm:text-sm xl:text-xl p-2 sm:p-4 xl:p-6 w-full"
                    onClick={handleControl}
                    disabled={!navigator.onLine && matchPhase === "finished"}
                  >
                    {getButtonIcon()} {getButtonText()}
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
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("Opravdu chceš celý zápas resetovat?")) {
                        resetMatch();
                      }
                    }}
                    disabled={!navigator.onLine}
                  >
                    Reset zápasu
                  </Button>
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
