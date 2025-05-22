import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { useState, useRef, useEffect } from "react";
import { useDeleteEventsByMatchId, useReliableAddEvent } from "./useEvent";
import { useUpdateMatch } from "../useMatches";
import { toast } from "react-toastify";
import { useApplyMatchStats, useRevertMatchStats } from "../MyTeam/usePlayers";

const HALFTIME = 20;
const SEND_INTERVAL = 10;

export const useMatchTimer = () => {
  const {
    timerRunning,
    setTimerRunning,
    setMatchState,
    scoreHome,
    scoreAway,
    matchDetails,
    matchState,
    matchPhase,
    setMatchStarted,
    setMatchDetails,
    setMatchPhase,
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

  //const scoreRef = useRef(`${scoreHome}:${scoreAway}`);
  const timeRef = useRef("00:00");
  const stateRef = useRef(matchState);

  const updateMatchMutation = useUpdateMatch();
  const addEventMutation = useReliableAddEvent(matchDetails.id);

  const lastStartTime = useRef<number | null>(null);
  const elapsedBeforePause = useRef<number>(0);

  const lastSyncedSecond = useRef<number>(-1);

  const initializedRef = useRef(false);

  const { mutate: applyStats } = useApplyMatchStats();

  const revertStats = useRevertMatchStats();

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
      (matchDetails.state === "Pending" || matchDetails.state === "Done") &&
      matchDetails.timePlayed /*&&
      matchDetails.scoreHome  &&
      matchDetails.scoreAway */
    ) {
      const [minutes, seconds] = matchDetails.timePlayed
        .split(":")
        .map((v) => parseInt(v));

      const total = minutes * 60 + seconds;
      setTotalSeconds(total);
      //   setScoreHome(home);
      //   setScoreAway(away);

      // ⏱ Nastav přesný čas startu tak, aby odpovídal aktuálnímu stavu
      elapsedBeforePause.current = total * 1000;
      lastStartTime.current = Date.now() - elapsedBeforePause.current;

      if (matchDetails.state === "Done") {
        setInitialCheckCompleted(true);
        setStartButtonClicked(true);
        setMatchStarted(true);
        setTimerRunning(false);
        setTimerPaused(false);
        setMatchState("Done");
        setMatchPhase("postMatchConfirm");
        return;
      }

      setInitialCheckCompleted(true);
      setStartButtonClicked(true);
      setMatchStarted(true);
      setTimerRunning(false);
      setTimerPaused(true);

      initializedRef.current = true;
    }
  }, [matchDetails]);

  // Aktualizuj refy
  // useEffect(() => {
  //   scoreRef.current = `${scoreHome}:${scoreAway}`;
  // }, [scoreHome, scoreAway]);

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

  // 🔁 Xs synchronizace na server
  useEffect(() => {
    if (!timerRunning || timerPaused) return;

    // sync pouze pokud jsme dosáhli nové celé desítky
    if (
      totalSeconds % SEND_INTERVAL === 0 &&
      totalSeconds !== lastSyncedSecond.current
    ) {
      lastSyncedSecond.current = totalSeconds;

      const time = formatTime(totalSeconds);
      const score = `${scoreHome}:${scoreAway}`;
      const state = matchState;

      updateMatchMutation.mutate({
        id: matchDetails.id,
        timePlayed: time,
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        state,
      });

      console.log("SYNC @", time);
    }
  }, [totalSeconds, timerRunning, timerPaused]);

  useEffect(() => {
    if (
      matchPhase === "firstHalf" &&
      totalSeconds >= HALFTIME &&
      timerRunning
    ) {
      setTimerRunning(false);
      setTimerPaused(true);
      setMatchPhase("halftime");

      const newEvent = {
        type: "I",
        team: null,
        time: timeRef.current,
        authorId: null,
        matchId: matchDetails.id,
        message: "Konec 1. poločasu",
      };

      addEvent(newEvent);
      addEventMutation.mutate(newEvent);

      updateMatchMutation.mutate({
        id: matchDetails.id,
        timePlayed: timeRef.current,
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        state: "Pending",
      });
    }

    if (
      matchPhase === "secondHalf" &&
      totalSeconds >= HALFTIME &&
      timerRunning
    ) {
      setTimerRunning(false);
      setTimerPaused(false);
      setMatchPhase("finished");
      //setMatchState("Done");

      const newEvent = {
        type: "I",
        team: null,
        time: timeRef.current,
        authorId: null,
        matchId: matchDetails.id,
        message: "Konec zápasu",
      };

      addEvent(newEvent);
      addEventMutation.mutate(newEvent);

      updateMatchMutation.mutate({
        id: matchDetails.id,
        timePlayed: timeRef.current,
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        state: "Pending",
      });
    }
  }, [totalSeconds, timerRunning, matchPhase]);

  const handleControl = () => {
    if (matchPhase === "postMatchConfirm") {
      alert("Zápis byl potvrzen. Není možné pokračovat.");
      return;
    }
    if (!initialCheckCompleted) {
      setInitialCheckCompleted(true);
      setMatchState("Pending");
      return;
    }

    // Start 1. poločasu
    if (!startButtonClicked) {
      setStartButtonClicked(true);
      setMatchStarted(true);
      setTimerRunning(true);
      setMatchPhase("firstHalf");

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

    // Start 2. poločasu
    if (matchPhase === "halftime") {
      setTotalSeconds(0);
      elapsedBeforePause.current = 0;
      lastStartTime.current = Date.now();
      setTimerRunning(true);
      setTimerPaused(false);
      setMatchPhase("secondHalf");

      const newEvent = {
        type: "I",
        team: null,
        time: "Začátek 2. poločasu",
        authorId: null,
        matchId: matchDetails.id,
        message: "Začátek 2. poločasu",
      };

      addEvent(newEvent);
      addEventMutation.mutate(newEvent);
      return;
    }

    // Potvrzení zápisu (po skončení zápasu)
    if (matchPhase === "finished") {
      setMatchPhase("postMatchConfirm");
      setMatchState("Done");

      const newEvent = {
        type: "I",
        team: null,
        time: "Zápis potvrzen",
        authorId: null,
        matchId: matchDetails.id,
        message: "Zápis potvrzen - zápas uzavřen",
      };

      addEvent(newEvent);
      addEventMutation.mutate(newEvent);

      updateMatchMutation.mutate({
        id: matchDetails.id,
        timePlayed: timeRef.current,
        scoreHome: scoreHome,
        scoreAway: scoreAway,
        state: "Done",
      });

      applyStats(matchDetails.id, {
        onError: () => toast.error("Chyba při aktualizaci statistik hráčů."),
      });
      toast.success("Zápis potvrzen");

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
      scoreHome: 0,
      scoreAway: 0,
      state: "None",
    });
  };

  useEffect(() => {
    const handleOffline = () => {
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error("Ztráta připojení k internetu");
      toast.info("Zápis se ukládá do místního úložiště.");
      toast.info(
        "Zápis se pokusíme odeslat, jakmile se připojíte k internetu."
      );

      // toast({
      //   title: "Jste offline",
      //   description: "Změny nebudou ukládány, dokud se znovu nepřipojíte.",
      //   variant: "destructive",
      // });
    };

    const handleOnline = () => {
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.success("Znovu připojeno k internetu");
      toast.info("Zápis se pokusíme odeslat.");

      // toast({
      //   title: "Zpět online",
      //   description: "Data se nyní opět synchronizují.",
      // });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return {
    scoreHome,
    scoreAway,
    timePlayed: formatTime(totalSeconds),
    timerRunning,
    timerPaused,
    matchPhase,
    handleControl,
    initialCheckCompleted,
    startButtonClicked,
    resetMatch: () => {
      console.log(`Match state: ${matchState} - ${matchDetails.state}`);
      if (matchState === "Done") {
        console.log("Zápas je již uzavřen.");
        revertStats.mutate(matchDetails.id, {
          onError: () => toast.error("Chyba při vracení statistik hráčů."),
        });
        toast.success("Statistiky hráčů vráceny.");
      }
      resetTimer();
      resetMatch();

      deleteEventsMutation.mutate(matchDetails.id);
    },
  };
};
