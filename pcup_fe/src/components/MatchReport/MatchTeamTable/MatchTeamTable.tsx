import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Team,
    useMatchContext,
} from "../../../contexts/MatchReportContext/MatchContext";
import { Check, X } from "lucide-react";
import GoalHandlers from "./TableHandlers/GoalHandlers";
import { match } from "assert";
import { useEffect } from "react";
import TwoMinuteHandlers from "./TableHandlers/TwoMinuteHandlers";
import YellowCardHandlers from "./TableHandlers/YellowCardHandlers";
import RedCardHandlers from "./TableHandlers/RedCardHandlers";

interface MatchTeamTableProps {
    team: Team;
}

export const MatchTeamTable = ({ team }: MatchTeamTableProps) => {
    const { timerRunning, matchDetails, players, setPlayers } =
        useMatchContext();

    const { addGoal, GoalType } = GoalHandlers();
    const { addTwoMinutes } = TwoMinuteHandlers();
    const { addYellowCard } = YellowCardHandlers();
    const { addRedCard } = RedCardHandlers();

    const isHomeTeam = team === matchDetails.homeTeam;

    const filteredPlayers = players.filter((p) =>
        team.players.some((tp) => tp.id === p.id)
    );

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
            <Table className="">
                <TableHeader className="bg-primary/10">
                    <TableRow>
                        <TableHead className="text-primary ">#</TableHead>
                        <TableHead className="text-primary">Hráč</TableHead>
                        <TableHead className="text-center text-primary">
                            Branky/7m
                        </TableHead>
                        <TableHead className="text-center text-primary">
                            ŽK
                        </TableHead>
                        <TableHead className="text-center text-primary">
                            2'
                        </TableHead>
                        <TableHead className="text-center text-primary">
                            ČK
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPlayers.map((player, idx) => (
                        <TableRow
                            key={player.id}
                            className={
                                idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                            }
                        >
                            <TableCell className="font-medium">
                                {player.number}
                            </TableCell>
                            <TableCell className="font-medium">
                                {player.firstName} {player.lastName}
                            </TableCell>
                            <TableCell className="text-center">
                                <div className="flex items-center gap-1 justify-center">
                                    <Button
                                        className=""
                                        disabled={
                                            player.redCard > 0 || !timerRunning
                                        }
                                        onClick={() =>
                                            addGoal(
                                                player.id,
                                                isHomeTeam
                                                    ? GoalType.NormalHome
                                                    : GoalType.NormalAway
                                            )
                                        }
                                    >
                                        {player.goalCount}
                                    </Button>

                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant={"scored7m"}
                                            className="px-1 py-0 text-xs h-auto"
                                            disabled={
                                                player.redCard > 0 ||
                                                !timerRunning
                                            }
                                            onClick={() =>
                                                addGoal(
                                                    player.id,
                                                    isHomeTeam
                                                        ? GoalType.SevenHome
                                                        : GoalType.SevenAway
                                                )
                                            }
                                        >
                                            7<Check className="" />
                                        </Button>
                                        <Button
                                            variant={"missed7m"}
                                            className="px-1 py-0 text-xs h-auto"
                                            disabled={
                                                player.redCard > 0 ||
                                                !timerRunning
                                            }
                                            onClick={() =>
                                                addGoal(
                                                    player.id,
                                                    isHomeTeam
                                                        ? GoalType.MissedHome
                                                        : GoalType.MissedAway
                                                )
                                            }
                                        >
                                            7<X className="" />
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    checked={player.yellowCard > 0}
                                    onChange={() => addYellowCard(player.id)}
                                    disabled={
                                        player.redCard > 0 || !timerRunning
                                    }
                                />
                            </TableCell>
                            <TableCell className="text-center">
                                <Button
                                    className=""
                                    disabled={
                                        player.redCard > 0 || !timerRunning
                                    }
                                    onClick={() => addTwoMinutes(player.id)}
                                >
                                    {player.twoMin}
                                </Button>
                            </TableCell>
                            <TableCell className="text-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4"
                                    onChange={() => addRedCard(player.id)}
                                    checked={player.redCard > 0}
                                    disabled={!timerRunning}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
export default MatchTeamTable;
