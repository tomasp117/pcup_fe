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
    return timerRunning && !timerPaused ? (
      <Pause className="w-6 h-6" />
    ) : (
      <Play className="w-6 h-6" />
    );
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
      setMatchState("msPending");
      return;
    }
    if (!startButtonClicked) {
      setStartButtonClicked(true);
      setTimerRunning(true);
      addEvent({
        id: 0,
        type: "I",
        team: null,
        time: "Začátek 1. poločasu",
        authorID: null,
      });
      return;
    }
    toggleTimer();
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="flex justify-center gap-4">
        <CardMatchReport className="w-24 ">
          <CardContentNoPadding className="p-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold">{scoreHome}</h2>
          </CardContentNoPadding>
        </CardMatchReport>

        <CardMatchReport className="w-24 ">
          <CardContentNoPadding className="p-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold">{scoreAway}</h2>
          </CardContentNoPadding>
        </CardMatchReport>
      </div>

      <CardMatchReport className="w-52 ">
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-6">
          <h1 className="text-4xl font-bold">{matchDetails.timePlayed}</h1>
          <Button
            className="flex items-center gap-2"
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
