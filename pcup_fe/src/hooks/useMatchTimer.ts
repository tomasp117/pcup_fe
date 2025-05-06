import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { useState, useRef, useEffect } from "react";
import {
  useDeleteEventsByMatchId,
  useReliableAddEvent,
} from "./MatchReport/useEvent";
import { useUpdateMatch } from "./useMatches";

export const useMatchTimer = () => {
  const {
    timerRunning,
    setTimerRunning,
    setMatchState,
    scoreHome,
    scoreAway,
    matchDetails,
    matchState,
    setMatchStarted,
    setMatchDetails,
    setScoreHome,
    setScoreAway,
    addEvent,
    resetMatch,
  } = useMatchContext();

  const deleteEventsMutation = useDeleteEventsByMatchId();

  const [initialCheckCompleted, setInitialCheckCompleted] = useState(false);
  const [startButtonClicked, setStartButtonClicked] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scoreRef = useRef(`${scoreHome}:${scoreAway}`);
  const timeRef = useRef("00:00");
  const stateRef = useRef(matchState);

  const updateMatchMutation = useUpdateMatch();
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  const lastStartTime = useRef<number | null>(null);
  const elapsedBeforePause = useRef<number>(0);

  const lastSyncedSecond = useRef<number>(-1);

  const initializedRef = useRef(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    if (
      !initializedRef.current &&
      matchDetails.state === "Pending" &&
      matchDetails.timePlayed &&
      matchDetails.score
    ) {
      const [minutes, seconds] = matchDetails.timePlayed
        .split(":")
        .map((v) => parseInt(v));
      const [home, away] = matchDetails.score
        .split(":")
        .map((v) => parseInt(v));

      const total = minutes * 60 + seconds;
      setTotalSeconds(total);
      //   setScoreHome(home);
      //   setScoreAway(away);

      // ⏱ Nastav přesný čas startu tak, aby odpovídal aktuálnímu stavu
      elapsedBeforePause.current = total * 1000;
      lastStartTime.current = Date.now() - elapsedBeforePause.current;

      setInitialCheckCompleted(true);
      setStartButtonClicked(true);
      setMatchStarted(true);
      setTimerRunning(false);
      setTimerPaused(true);

      initializedRef.current = true;
    }
  }, [matchDetails]);

  // Aktualizuj refy
  useEffect(() => {
    scoreRef.current = `${scoreHome}:${scoreAway}`;
  }, [scoreHome, scoreAway]);

  useEffect(() => {
    timeRef.current = formatTime(totalSeconds);
  }, [totalSeconds]);

  useEffect(() => {
    stateRef.current = matchState;
  }, [matchState]);

  // Časomíra – 1s krok
  useEffect(() => {
    if (timerRunning && !timerPaused) {
      lastStartTime.current = Date.now() - elapsedBeforePause.current;

      intervalRef.current = setInterval(() => {
        const elapsedMs = Date.now() - (lastStartTime.current ?? 0);
        setTotalSeconds(Math.floor(elapsedMs / 1000));
      }, 200); // kontrolujeme 5× za sekundu kvůli přesnosti
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (lastStartTime.current) {
        elapsedBeforePause.current = Date.now() - lastStartTime.current;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerPaused]);

  // Uložení do kontextu
  useEffect(() => {
    setMatchDetails((prev) => ({
      ...prev,
      timePlayed: timeRef.current,
    }));
  }, [totalSeconds]);

  // 🔁 10s synchronizace na server
  useEffect(() => {
    if (!timerRunning || timerPaused) return;

    // sync pouze pokud jsme dosáhli nové celé desítky
    if (totalSeconds % 10 === 0 && totalSeconds !== lastSyncedSecond.current) {
      lastSyncedSecond.current = totalSeconds;

      const time = formatTime(totalSeconds);
      const score = `${scoreHome}:${scoreAway}`;
      const state = matchState;

      updateMatchMutation.mutate({
        id: matchDetails.id,
        timePlayed: time,
        score,
        state,
      });

      console.log("SYNC @", time);
    }
  }, [totalSeconds, timerRunning, timerPaused]);

  const handleControl = () => {
    if (!initialCheckCompleted) {
      setInitialCheckCompleted(true);
      setMatchState("Pending");
      return;
    }

    if (!startButtonClicked) {
      setStartButtonClicked(true);
      setMatchStarted(true);
      setTimerRunning(true);

      const newEvent = {
        type: "I",
        team: null,
        time: "Začátek 1. poločasu",
        authorId: null,
        matchId: matchDetails.id,
        message: "Začátek 1. poločasu",
      };

      addEvent(newEvent);
      addEventMutation.mutate(newEvent);
      return;
    }

    setTimerPaused((prev) => !prev);
    setTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setTotalSeconds(0);
    elapsedBeforePause.current = 0;
    lastStartTime.current = null;
    setTimerPaused(false);
    setTimerRunning(false);
    setInitialCheckCompleted(false);
    setStartButtonClicked(false);

    updateMatchMutation.mutate({
      id: matchDetails.id,
      timePlayed: "00:00",
      score: "0:0",
      state: "None",
    });
  };

  return {
    scoreHome,
    scoreAway,
    timePlayed: formatTime(totalSeconds),
    timerRunning,
    timerPaused,
    handleControl,
    initialCheckCompleted,
    startButtonClicked,
    resetMatch: () => {
      resetTimer();
      resetMatch();
      deleteEventsMutation.mutate(matchDetails.id);
    },
  };
};
