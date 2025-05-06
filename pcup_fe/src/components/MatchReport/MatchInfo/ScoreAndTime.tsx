import { Button } from "@/components/ui/button";
import {
  CardMatchReport,
  CardContent,
  CardContentNoPadding,
} from "@/components/ui/card";
import { useMatchTimer } from "@/hooks/useMatchTimer";
import { Play, Pause } from "lucide-react";

export default function ScoreAndTime() {
  const {
    scoreHome,
    scoreAway,
    timePlayed,
    handleControl,
    timerRunning,
    timerPaused,
    initialCheckCompleted,
    startButtonClicked,
    resetMatch,
  } = useMatchTimer();

  function getButtonIcon() {
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
    if (timerPaused) return "Resume";
    return "Pause";
  }

  return (
    <div className="flex flex-col items-center justify-between flex-1 min-w-0 max-w-[33%] sm:max-w-[20%] gap-4">
      <div className="flex justify-between gap-2 sm:gap-4 w-full h-[30%]">
        <CardMatchReport className="flex-1 w-full sm:p-4 p-2 justify-center">
          <CardContentNoPadding className="flex items-center justify-center w-full">
            <h2 className="text-md sm:text-2xl font-bold">{scoreHome}</h2>
          </CardContentNoPadding>
        </CardMatchReport>

        <CardMatchReport className="flex-1 w-full sm:p-4 p-2 justify-center">
          <CardContentNoPadding className="flex items-center justify-center w-full">
            <h2 className="text-md sm:text-2xl font-bold">{scoreAway}</h2>
          </CardContentNoPadding>
        </CardMatchReport>
      </div>

      <CardMatchReport className="w-full flex justify-center h-[70%] sm:p-4 p-2 flex-1">
        <CardContent className="flex flex-col items-center w-full p-0  gap-4">
          <h1 className="text-md sm:text-4xl font-bold">{timePlayed}</h1>
          <Button
            className="flex items-center gap-2 text-xs sm:text-sm xl:text-xl p-2 sm:p-4 xl:p-6 w-full"
            onClick={handleControl}
          >
            {getButtonIcon()} {getButtonText()}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("Opravdu chceš celý zápas resetovat?")) {
                resetMatch();
              }
            }}
          >
            Reset zápasu
          </Button>
        </CardContent>
      </CardMatchReport>
    </div>
  );
}
