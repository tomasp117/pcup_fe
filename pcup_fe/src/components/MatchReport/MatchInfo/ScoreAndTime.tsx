import React, { useState, useEffect } from "react";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardContentNoPadding,
  CardHeader,
  CardMatchReport,
  CardMatchReportHeader,
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

  const [initialCheckCompleted, setInitialCheckCompleted] =
    useState<boolean>(false);
  const [startButtonClicked, setStartButtonClicked] = useState<boolean>(false);

  const [timerPaused, setTimerPaused] = useState(false);
  const [isSecondHalf, setIsSecondHalf] = useState<boolean>(false);
  const [matchEnd, setMatchEnd] = useState<boolean>(false);
  const [secondHalfClicked, setSecondHalfClicked] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRunning && !timerPaused) {
      const id = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
      setIntervalId(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
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
    if (initialCheckCompleted && (!timerRunning || timerPaused)) {
      return <Play className="w-6 h-6" fill="white" />;
    }
    if (timerRunning && !timerPaused) {
      return <Pause className="w-6 h-6" fill="white" />;
    }
    return null;
  }

  function getButtonText(): string {
    if (!initialCheckCompleted) {
      return "Kontrola";
    } else if (!startButtonClicked) {
      return "Start";
    } else if (isSecondHalf) {
      return "2. Poločas";
    } else if (matchEnd) {
      return "Potvrdit";
    } else if (timerPaused) {
      return "Resume";
    } else {
      return "Pause";
    }
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
    if (timerRunning) {
      toggleTimer();
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Skóre */}
      <div className="flex justify-center gap-4">
        <CardMatchReport className="w-24">
          <CardContentNoPadding className="p-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold">{scoreHome}</h2>
          </CardContentNoPadding>
        </CardMatchReport>

        <CardMatchReport className="w-24">
          <CardContentNoPadding className="p-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold">{scoreAway}</h2>
          </CardContentNoPadding>
        </CardMatchReport>
      </div>

      {/* Čas a tlačítko */}
      <CardMatchReport className="w-48">
        <CardContent className="flex flex-col items-center justify-center space-y-2 p-6">
          <h1 className="text-4xl font-bold">{matchDetails.timePlayed}</h1>
          <Button
            className="flex items-center gap-2"
            onClick={handleButtonClick}
          >
            {getButtonIcon()} {/* Ikona */}
            {getButtonText()} {/* Text */}
          </Button>
        </CardContent>
      </CardMatchReport>
    </div>
  );
}

export default ScoreAndTime;
