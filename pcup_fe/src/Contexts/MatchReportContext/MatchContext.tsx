import { Match } from "@/interfaces/MatchReport/Match";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Team } from "@/interfaces/MatchReport/Team";
import { Event } from "@/interfaces/MatchReport/Event";
import React, { createContext, useState, ReactNode, useEffect } from "react";

type MatchState = "None" | "Generated" | "Pending" | "Done";
type MatchPhase =
  | "notStarted"
  | "firstHalf"
  | "halftime"
  | "secondHalf"
  | "finished"
  | "postMatchConfirm";

// Match Context
interface MatchContextProps {
  matchDetails: Match;
  teamHome: Team;
  teamAway: Team;
  players: Player[];
  timerRunning: boolean;
  matchState: MatchState;
  homeScore: number;
  awayScore: number;
  events: Event[];
  matchPhase: MatchPhase;
  matchStarted: boolean;
  setMatchDetails: React.Dispatch<React.SetStateAction<Match>>;
  setTeamHome: React.Dispatch<React.SetStateAction<Team>>;
  setTeamAway: React.Dispatch<React.SetStateAction<Team>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
  sethomeScore: React.Dispatch<React.SetStateAction<number>>;
  setawayScore: React.Dispatch<React.SetStateAction<number>>;
  addEvent: (event: Event) => void;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  updatePlayerStats: (
    playerId: number,
    updateFn: (player: Player) => Player
  ) => void;
  setMatchPhase: React.Dispatch<React.SetStateAction<MatchPhase>>;
  setMatchStarted: React.Dispatch<React.SetStateAction<boolean>>;
  resetMatch: () => void;
  getPlayersForTeam: (team: Team) => Player[];
}

const MatchContext = createContext<MatchContextProps | undefined>(undefined);

export const MatchProvider: React.FC<{
  children: ReactNode;
  match: Match;
}> = ({ children, match }) => {
  const [matchDetails, setMatchDetails] = useState<Match>(match);
  const [teamHome, setTeamHome] = useState<Team>(match.homeTeam);
  const [teamAway, setTeamAway] = useState<Team>(match.awayTeam);

  const [players, setPlayers] = useState<Player[]>([]);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [matchState, setMatchState] = useState<MatchState>("None");
  const [homeScore, sethomeScore] = useState<number>(0);
  const [awayScore, setawayScore] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);
  const [matchStarted, setMatchStarted] = useState<boolean>(false);

  const [matchPhase, setMatchPhase] = useState<MatchPhase>("firstHalf");

  const addEvent = (event: Event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const updatePlayerStats = (
    playerId: number,
    updateFn: (player: Player) => Player
  ) => {
    setPlayers((prevPlayers) => {
      const index = prevPlayers.findIndex((p) => p.id === playerId);
      if (index === -1) return prevPlayers;

      const updatedPlayers = [...prevPlayers];
      updatedPlayers[index] = updateFn({ ...prevPlayers[index] });
      console.log("Updated player stats:", updatedPlayers[index]);
      return updatedPlayers;
    });
  };

  useEffect(() => {
    setMatchDetails((prev) => ({
      ...prev,
      homeTeam: teamHome,
      awayTeam: teamAway,
    }));
  }, [teamHome, teamAway]);

  useEffect(() => {
    const allPlayers = [
      ...(match.homeTeam?.players ?? []),
      ...(match.awayTeam?.players ?? []),
    ].map((p) => ({
      ...p,
      goalCount: 0,
      sevenMeterGoalCount: 0,
      sevenMeterMissCount: 0,
      yellowCardCount: 0,
      redCardCount: 0,
      twoMinPenaltyCount: 0,
    }));

    setPlayers(allPlayers);
  }, [match]);

  function getPlayersForTeam(team: Team): Player[] {
    // Pokud je zápas uzavřený a má lineupy
    if (
      (matchDetails.state === "Done" || matchDetails.state === "Pending") &&
      matchDetails.lineups &&
      matchDetails.lineups.length > 0
    ) {
      const lineup = matchDetails.lineups.find((l) => l.teamId === team.id);
      // V lineup.players jsou LineupPlayer objekty, kde je vždy .player
      return (
        lineup?.players.map((lp) => {
          // Najdi odpovídajícího hráče v `players` podle id
          const base = players.find((p) => p.id === lp.player.id);
          return base ?? lp.player; // pokud není v players, vezmi z lineup (mělo by sedět)
        }) ?? []
      );
    }
    // Jinak hráči z týmu, najít je v players (kvůli statistikám)
    return (team.players ?? []).map((tp) => {
      const base = players.find((p) => p.id === tp.id);
      return base ?? tp;
    });
  }

  useEffect(() => {
    // if (match.score) {
    //   const [home, away] = match.score.split(":").map((v) => parseInt(v));
    //   sethomeScore(home);
    //   setawayScore(away);
    // }

    if (match.state) {
      setMatchState(match.state as MatchState);
    }

    if (match.timePlayed) {
      setMatchDetails((prev) => ({
        ...prev,
        timePlayed: match.timePlayed,
      }));
    }

    if (match.homeTeam) {
      setTeamHome(match.homeTeam);
    }

    if (match.awayTeam) {
      setTeamAway(match.awayTeam);
    }

    if (match.state === "Pending") {
      setMatchStarted(true);
    }
  }, [match]);

  const resetMatch = () => {
    sethomeScore(0);
    setawayScore(0);
    setEvents([]);
    setTimerRunning(false);
    setMatchState("None");
    setMatchStarted(false);

    setMatchPhase("firstHalf");

    setMatchDetails((prev) => ({
      ...prev,
      timePlayed: "00:00",
      state: "None",
      score: "0:0",
    }));

    // Reset hráčských statistik
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        goalCount: 0,
        sevenMeterGoalCount: 0,
        sevenMeterMissCount: 0,
        yellowCardCount: 0,
        redCardCount: 0,
        twoMinPenaltyCount: 0,
      }))
    );
  };

  return (
    <MatchContext.Provider
      value={{
        matchDetails,
        teamHome,
        teamAway,
        players,
        timerRunning,
        matchState,
        homeScore,
        awayScore,
        events,
        matchPhase,
        matchStarted,
        setMatchDetails,
        setTeamHome,
        setTeamAway,
        setPlayers,
        setTimerRunning,
        setMatchState,
        sethomeScore,
        setawayScore,
        addEvent,
        setEvents,
        updatePlayerStats,
        setMatchPhase,
        setMatchStarted,
        resetMatch,
        getPlayersForTeam,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatchContext = () => {
  const context = React.useContext(MatchContext);
  if (!context) {
    throw new Error("useMatchContext must be used within a MatchProvider");
  }
  return context;
};
