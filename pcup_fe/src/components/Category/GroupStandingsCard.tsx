import { useGroupStandings } from "@/hooks/useGroups";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Loader2 } from "lucide-react";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";

export const GroupStandingsCard = ({
  groupId,
  groupName,
}: {
  groupId: number;
  groupName: string;
}) => {
  const { data: standings, isLoading, error } = useGroupStandings(groupId);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-primary text-lg">{groupName}</h3>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader2 className="animate-spin w-5 h-5 mx-auto" />}
        {error && <p className="text-red-500">Chyba při načítání tabulky.</p>}
        {standings && (
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Tým</TableHead>
                <TableHead>Z</TableHead>
                <TableHead>V</TableHead>
                <TableHead>R</TableHead>
                <TableHead>P</TableHead>
                <TableHead>Skóre</TableHead>
                <TableHead>+/-</TableHead>
                <TableHead>Body</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((team: any, index: number) => (
                <TableRow key={team.teamId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{team.teamName}</TableCell>
                  <TableCell>{team.matchesPlayed}</TableCell>
                  <TableCell>{team.wins}</TableCell>
                  <TableCell>{team.draws}</TableCell>
                  <TableCell>{team.losses}</TableCell>
                  <TableCell>
                    {team.goalsFor}:{team.goalsAgainst}
                  </TableCell>
                  <TableCell>{team.goalsFor - team.goalsAgainst}</TableCell>
                  <TableCell className="font-bold">{team.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
