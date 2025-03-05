import MatchTeamTable from "@/components/MatchReport/MatchTeamTable/MatchTeamTable";
import {
    Coach,
    Match,
    MatchProvider,
    Player,
    Team,
    useMatchContext,
} from "../contexts/MatchReportContext/MatchContext";
import { MatchInfo } from "../components/MatchReport/MatchInfo/MatchInfo";
import { useEffect, useState } from "react";
import { MatchLog } from "@/components/MatchReport/MatchLog/MatchLog";

// 🏆 Hráči domácího týmu (SK Polanka)
export const samplePlayersHome: Player[] = [
    {
        id: 1,
        number: 7,
        firstName: "Tomas",
        lastName: "Prorok",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
    {
        id: 2,
        number: 9,
        firstName: "Teo",
        lastName: "Balcar",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
    {
        id: 3,
        number: 12,
        firstName: "Martin",
        lastName: "Kalus",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
];

// 🏆 Hráči hostujícího týmu (TJ Sokol)
export const samplePlayersAway: Player[] = [
    {
        id: 10,
        number: 5,
        firstName: "David",
        lastName: "Nejedly",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
    {
        id: 11,
        number: 14,
        firstName: "Filip",
        lastName: "Hort",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
    {
        id: 12,
        number: 1,
        firstName: "Klárka",
        lastName: "Jaklová",
        goalCount: 0,
        twoMin: 0,
        sevenScored: 0,
        sevenMissed: 0,
        yellowCard: 0,
        redCard: 0,
    },
];

// 🏆 Trenéři
export const sampleCoachesHome: Coach[] = [
    {
        id: 101,
        firstName: "Petr",
        lastName: "Novák",
        email: "petr.novak@email.com",
        phone: 123456789,
        username: "coach_petr",
        password: "password123",
        playerVote: null,
        goalKeeperVote: null,
        license: "A",
    },
];

export const sampleCoachesAway: Coach[] = [
    {
        id: 102,
        firstName: "Jan",
        lastName: "Svoboda",
        email: "jan.svoboda@email.com",
        phone: 987654321,
        username: "coach_jan",
        password: "password456",
        playerVote: null,
        goalKeeperVote: null,
        license: "B",
    },
];

// 🏠 Domácí tým
export const sampleTeamHome: Team = {
    id: 1,
    name: "SK Polanka",
    players: samplePlayersHome,
    coaches: sampleCoachesHome,
    matches: [],
};

// 🏆 Hostující tým
export const sampleTeamAway: Team = {
    id: 2,
    name: "TJ Sokol",
    players: samplePlayersAway,
    coaches: sampleCoachesAway,
    matches: [],
};

// ⚽ Zápasová data
export const sampleMatchDetails: Match = {
    id: 101,
    time: "18:00",
    timePlayed: "00:00",
    playground: "Sportovní hala Polanka",
    homeTeam: sampleTeamHome,
    awayTeam: sampleTeamAway,
    score: "0:0",
    state: "msNone",
    events: [],
    referees: [],
};

export const MatchReport = () => {
    const {
        matchDetails,
        teamAway,
        teamHome,
        setMatchDetails,
        setTeamAway,
        setTeamHome,
        setPlayers,
    } = useMatchContext();

    useEffect(() => {
        setMatchDetails(sampleMatchDetails);
        setTeamHome(sampleTeamHome);
        setTeamAway(sampleTeamAway);

        setPlayers([...samplePlayersHome, ...samplePlayersAway]);
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <MatchInfo />
            <div className="flex w-full gap-8 max-w-[calc(100vw-32px)]">
                <MatchTeamTable team={teamHome} />
                <MatchTeamTable team={teamAway} />
            </div>
            <MatchLog />
        </div>
    );
};
