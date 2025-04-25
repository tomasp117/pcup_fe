import { Match } from "@/interfaces/MatchReport/Match";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Team } from "@/interfaces/MatchReport/Team";
import { Event } from "@/interfaces/MatchReport/Event";
import React, { createContext, useState, ReactNode, useEffect } from "react";

// TypeScript Entities

// Match Context
interface MatchContextProps {
  matchDetails: Match;
  teamHome: Team;
  teamAway: Team;
  players: Player[];
  timerRunning: boolean;
  matchState: "None" | "Generated" | "Pending" | "Done";
  scoreHome: number;
  scoreAway: number;
  events: Event[];
  setMatchDetails: React.Dispatch<React.SetStateAction<Match>>;
  setTeamHome: React.Dispatch<React.SetStateAction<Team>>;
  setTeamAway: React.Dispatch<React.SetStateAction<Team>>;
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setMatchState: React.Dispatch<
    React.SetStateAction<"None" | "Generated" | "Pending" | "Done">
  >;
  setScoreHome: React.Dispatch<React.SetStateAction<number>>;
  setScoreAway: React.Dispatch<React.SetStateAction<number>>;
  addEvent: (event: Event) => void;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  updatePlayerStats: (
    playerId: number,
    updateFn: (player: Player) => Player
  ) => void;
}

const MatchContext = createContext<MatchContextProps | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [teamHome, setTeamHome] = useState<Team>({
    id: 0,
    name: "",
    players: [],
    coaches: [],
    matches: [],
  });
  const [teamAway, setTeamAway] = useState<Team>({
    id: 0,
    name: "",
    players: [],
    coaches: [],
    matches: [],
  });
  const [matchDetails, setMatchDetails] = useState<Match>({
    id: 0,
    time: "",
    timePlayed: "00:00",
    playground: "",
    homeTeam: teamHome,
    awayTeam: teamAway,
    score: "0:0",
    state: "None",
    events: [],
    referees: [],
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [matchState, setMatchState] = useState<
    "None" | "Generated" | "Pending" | "Done"
  >("None");
  const [scoreHome, setScoreHome] = useState<number>(0);
  const [scoreAway, setScoreAway] = useState<number>(0);
  const [events, setEvents] = useState<Event[]>([]);

  const [matchPhase, setMatchPhase] = useState<
    "firstHalf" | "secondHalf" | "finished"
  >("firstHalf");

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

  return (
    <MatchContext.Provider
      value={{
        matchDetails,
        teamHome,
        teamAway,
        players,
        timerRunning,
        matchState,
        scoreHome,
        scoreAway,
        events,
        setMatchDetails,
        setTeamHome,
        setTeamAway,
        setPlayers,
        setTimerRunning,
        setMatchState,
        setScoreHome,
        setScoreAway,
        addEvent,
        setEvents,
        updatePlayerStats,
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
