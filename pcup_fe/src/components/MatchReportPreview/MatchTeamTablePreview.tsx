import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Check, X } from "lucide-react";

import { Team } from "@/interfaces/MatchReport/Team";
import { Match } from "@/interfaces/MatchReport/Match";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";

interface MatchTeamTablePreviewProps {
  team: Team;
  match: Match;
  players: Player[];
}

export const MatchTeamTablePreview = ({
  team,
  match,
  players,
}: MatchTeamTablePreviewProps) => {
  const isHomeTeam = team === match.homeTeam;

  const filteredPlayers = team.players.filter((p) =>
    team.players.some((tp) => tp.id === p.id)
  );

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          {isHomeTeam ? "Domácí" : "Hostující"}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium ">{team.name}</span>
        </div>
      </div>
      <Table className="">
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="text-primary ">#</TableHead>
            <TableHead className="text-primary">Hráč</TableHead>
            {/* <TableHead className="text-center text-primary">ŽK</TableHead>
            <TableHead className="text-center text-primary">2'</TableHead>
            <TableHead className="text-center text-primary">ČK</TableHead>*/}
            <TableHead
              className="text-center text-primary"
              colSpan={4}
            ></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, idx) => (
            <TableRow
              key={player.id}
              className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <TableCell className="font-medium">{player.number}</TableCell>
              <TableCell className="font-medium">
                {player.person.firstName} {player.person.lastName}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-end items-center gap-1 text-sm">
                  {player.yellowCardCount > 0 && (
                    <span
                      title="Žlutá karta"
                      className="inline-block w-3 h-4 bg-yellow-400 rounded-sm shadow"
                    />
                  )}

                  {player.twoMinPenaltyCount > 0 && (
                    <span className="text-bold font-semibold text-gray-700">
                      {`2'`
                        .repeat(player.twoMinPenaltyCount)
                        .split("")
                        .join(" ")}
                    </span>
                  )}

                  {player.redCardCount > 0 && (
                    <span
                      title="Červená karta"
                      className="inline-block w-3 h-4 bg-red-500 rounded-sm shadow"
                    />
                  )}

                  <span className="ml-2 font-bold">
                    {player.goalCount}/{player.sevenMeterGoalCount}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
