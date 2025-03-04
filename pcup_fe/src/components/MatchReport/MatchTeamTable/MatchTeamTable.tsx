import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { Check, X } from "lucide-react";

interface MatchTeamTableProps {
  team: string;
}
const sampleData = [
  {
    num: 10,
    name: "Tomas Prorok",
    goals: 0,
    penalties: { "7m+": 0, "7m-": 0 },
    yellow: false,
    twoMin: 0,
    red: false,
  },
  {
    num: 20,
    name: "Teo Balcar",
    goals: 0,
    penalties: { "7m+": 0, "7m-": 0 },
    yellow: false,
    twoMin: 0,
    red: false,
  },
  {
    num: 11,
    name: "Martin Kalus",
    goals: 0,
    penalties: { "7m+": 0, "7m-": 0 },
    yellow: false,
    twoMin: 0,
    red: false,
  },
  {
    num: 22,
    name: "David Nejedly",
    goals: 0,
    penalties: { "7m+": 0, "7m-": 0 },
    yellow: false,
    twoMin: 0,
    red: false,
  },
];

export const MatchTeamTable = ({ team }: MatchTeamTableProps) => {
  const { timerRunning, matchDetails, players } = useMatchContext();

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg flex-1">
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
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
          {sampleData.map((player, idx) => (
            <TableRow
              key={player.num}
              className={idx % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <TableCell className="font-medium">{player.num}</TableCell>
              <TableCell className="font-medium">{player.name}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <Button className="">{player.goals}</Button>

                  <div className="flex flex-col gap-1">
                    <Button
                      variant={"scored7m"}
                      className="px-1 py-0 text-xs h-auto"
                    >
                      7<Check className="" />
                    </Button>
                    <Button
                      variant={"missed7m"}
                      className="px-1 py-0 text-xs h-auto"
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
                  disabled={player.red || !timerRunning}
                />
              </TableCell>
              <TableCell className="text-center">
                <Button className="">{player.twoMin}</Button>
              </TableCell>
              <TableCell className="text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  disabled={player.red || !timerRunning}
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
