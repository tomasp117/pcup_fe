import React, { createContext, useState, ReactNode, useEffect } from "react";

// TypeScript Entities
export interface Tournament {
    id: number;
    name: string;
    editions: TournamentInstance[];
}

export interface TournamentInstance {
    id: number;
    editionNumber: number;
    startDate: Date;
    endDate: Date;
    categories: Category[];
    teams: Team[];
}

export interface Category {
    id: number;
    name: string;
    votingOpen: boolean;
    groups: Group[];
    matches: Match[];
    stats: Player[];
}

export interface Club {
    id: number;
    name: string;
    logo: string;
    email: string;
    teams: Team[];
}

export interface Team {
    id: number;
    name: string;
    players: Player[];
    coaches: Coach[];
    matches: Match[];
}

export interface Player {
    id: number;
    number: number;
    firstName: string;
    lastName: string;
    goalCount: number;
    twoMin: number;
    sevenScored: number;
    sevenMissed: number;
    yellowCard: number;
    redCard: number;
}

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    username: string;
    password: string;
}

export interface Coach extends Person {
    playerVote: Player | null;
    goalKeeperVote: Player | null;
    license: string;
}

export interface Referee extends Person {
    license: string;
}

export interface Recorder extends Person {}

export interface Admin extends Person {}

export interface Match {
    id: number;
    time: string;
    timePlayed: string;
    playground: string;
    homeTeam: Team;
    awayTeam: Team;
    score: string;
    state: "msNone" | "msPending" | "msDone";
    events: Event[];
    referees: Referee[];
}

export interface Group {
    id: number;
    name: string;
    teams: Team[];
    matches: Match[];
}

export interface Event {
    type: string;
    team: string | null;
    time: string;
    authorID: number | null;
}

// Match Context
interface MatchContextProps {
    matchDetails: Match;
    teamHome: Team;
    teamAway: Team;
    players: Player[];
    timerRunning: boolean;
    matchState: "msNone" | "msPending" | "msDone";
    scoreHome: number;
    scoreAway: number;
    events: Event[];
    setMatchDetails: React.Dispatch<React.SetStateAction<Match>>;
    setTeamHome: React.Dispatch<React.SetStateAction<Team>>;
    setTeamAway: React.Dispatch<React.SetStateAction<Team>>;
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    setTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    setMatchState: React.Dispatch<
        React.SetStateAction<"msNone" | "msPending" | "msDone">
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
        state: "msNone",
        events: [],
        referees: [],
    });
    const [players, setPlayers] = useState<Player[]>([]);
    const [timerRunning, setTimerRunning] = useState<boolean>(false);
    const [matchState, setMatchState] = useState<
        "msNone" | "msPending" | "msDone"
    >("msNone");
    const [scoreHome, setScoreHome] = useState<number>(0);
    const [scoreAway, setScoreAway] = useState<number>(0);
    const [events, setEvents] = useState<Event[]>([]);

    const addEvent = (event: Event) => {
        setEvents((prevEvents) => [event, ...prevEvents]);
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
