import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMatchContext } from "../../../Contexts/MatchReportContext/MatchContext";
import { Check, X } from "lucide-react";
import GoalHandlers from "./TableHandlers/GoalHandlers";
import { match } from "assert";
import { useEffect } from "react";
import TwoMinuteHandlers from "./TableHandlers/TwoMinuteHandlers";
import YellowCardHandlers from "./TableHandlers/YellowCardHandlers";
import { RedCardHandlers } from "./TableHandlers/RedCardHandlers";
import { Team } from "@/interfaces/MatchReport/Team";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { usePenaltyTimer } from "@/hooks/MatchReport/usePenaltyTimer";

interface MatchTeamTableProps {
  team: Team;
}

export const MatchTeamTable = ({ team }: MatchTeamTableProps) => {
  const {
    matchDetails,
    players,
    setPlayers,
    matchStarted,
    matchState,
    getPlayersForTeam,
    timerRunning,
  } = useMatchContext();

  const { addGoal, GoalType } = GoalHandlers();
  const { addTwoMinutes } = TwoMinuteHandlers();
  const { addYellowCard } = YellowCardHandlers();
  const { addRedCard } = RedCardHandlers();

  const isLocked = matchState === "Done";

  const isHomeTeam = team === matchDetails.homeTeam;

  const teamPlayers = getPlayersForTeam(team);

  const isCounting = timerRunning;
  // will clear all when matchState flips to "None"
  const { addPenalty, getPenaltyLeft } = usePenaltyTimer(
    isCounting,
    matchState === "None"
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
            <TableHead className="text-center text-primary">ŽK</TableHead>
            <TableHead className="text-center text-primary">2'</TableHead>
            <TableHead className="text-center text-primary">ČK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamPlayers.map((player, idx) => {
            const penaltyLeft = getPenaltyLeft(player.id);
            return (
              <TableRow
                key={player.id}
                className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <TableCell className="font-medium">{player.number}</TableCell>
                <TableCell className="font-medium">
                  {player.person.firstName} {player.person.lastName}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <Button
                      className=""
                      disabled={
                        player.redCardCount > 0 || !matchStarted || isLocked
                      }
                      onClick={() =>
                        addGoal(
                          player.id,
                          isHomeTeam ? GoalType.NormalHome : GoalType.NormalAway
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
                          player.redCardCount > 0 || !matchStarted || isLocked
                        }
                        onClick={() =>
                          addGoal(
                            player.id,
                            isHomeTeam ? GoalType.SevenHome : GoalType.SevenAway
                          )
                        }
                      >
                        7<Check className="" />
                      </Button>
                      <Button
                        variant={"missed7m"}
                        className="px-1 py-0 text-xs h-auto"
                        disabled={
                          player.redCardCount > 0 || !matchStarted || isLocked
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
                    checked={player.yellowCardCount > 0}
                    onChange={() => addYellowCard(player.id)}
                    disabled={
                      player.redCardCount > 0 ||
                      !matchStarted ||
                      player.yellowCardCount > 0 ||
                      isLocked
                    }
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    disabled={
                      player.redCardCount > 0 ||
                      !matchStarted ||
                      isLocked ||
                      penaltyLeft != null
                    }
                    onClick={() => {
                      addTwoMinutes(player.id); // your stat bump
                      addPenalty(player.id); // start 120s countdown
                    }}
                  >
                    {player.twoMinPenaltyCount}
                    {getPenaltyLeft(player.id) != null && (
                      <span className="ml-1 text-white font-serif">
                        {String(
                          Math.floor(getPenaltyLeft(player.id)! / 60)
                        ).padStart(2, "0")}
                        :
                        {String(getPenaltyLeft(player.id)! % 60).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    onChange={() => addRedCard(player.id)}
                    checked={player.redCardCount > 0}
                    disabled={
                      !matchStarted || player.redCardCount > 0 || isLocked
                    }
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
export default MatchTeamTable;
