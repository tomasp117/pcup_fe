import React, { useState, useEffect } from "react";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { Button } from "@/components/ui/button";
import {
  CardMatchReport,
  CardContent,
  CardContentNoPadding,
} from "@/components/ui/card";

import { Play, Pause } from "lucide-react";

function ScoreAndTime() {
  const {
    timerRunning,
    setTimerRunning,
    setMatchState,
    scoreHome,
    scoreAway,
    matchDetails,
    setMatchDetails,
    addEvent,
  } = useMatchContext();

  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning && !timerPaused) {
      // Pokud už běží, neaktivuj nový interval
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTotalSeconds((prev) => prev + 1);
        }, 1000);
      }
    } else {
      // Když se timer pauzne nebo zastaví, interval se vyčistí
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerPaused]);

  useEffect(() => {
    setMatchDetails((prev) => ({
      ...prev,
      timePlayed: formatTime(totalSeconds),
    }));
  }, [totalSeconds, setMatchDetails]);

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }

  function toggleTimer(): void {
    if (timerPaused) {
      setTimerPaused(false);
      setTimerRunning(true);
    } else {
      setTimerPaused(true);
      setTimerRunning(false);
    }
  }

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

  function handleButtonClick(): void {
    if (!initialCheckCompleted) {
      setInitialCheckCompleted(true);
      setMatchState("Pending");
      return;
    }
    if (!startButtonClicked) {
      setStartButtonClicked(true);
      setTimerRunning(true);
      addEvent({
        type: "I",
        team: null,
        time: "Začátek 1. poločasu",
        authorID: null,
        message: "Začátek 1. poločasu",
      });
      return;
    }
    toggleTimer();
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
          <h1 className="text-md sm:text-4xl font-bold">
            {matchDetails.timePlayed}
          </h1>
          <Button
            className="flex items-center gap-2 text-xs sm:text-sm xl:text-xl  p-2 sm:p-4 xl:p-6 w-full "
            onClick={handleButtonClick}
          >
            {getButtonIcon()} {getButtonText()}
          </Button>
        </CardContent>
      </CardMatchReport>
    </div>
  );
}

export default ScoreAndTime;
