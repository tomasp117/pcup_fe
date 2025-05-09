// components/Category/Matches.tsx
import { useMatchesByCategory } from "@/hooks/useMatches";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const Matches = ({ categoryId }: { categoryId: number }) => {
  const { data: matches, isLoading, error } = useMatchesByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        Chyba při načítání zápasů.
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        V této kategorii nejsou žádné zápasy.
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-primary">Zápasy</h2>
      </CardHeader>
      <CardContent className="p-4">
        <Table className="text-sm">
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="font-bold">Čas</TableHead>
              <TableHead className="font-bold">Hřiště</TableHead>
              <TableHead className="font-bold">Domácí</TableHead>
              <TableHead className="font-bold">Hosté</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match) => (
              <TableRow
                key={match.id}
                className="even:bg-primary/10 hover:bg-primary/20 cursor-pointer "
              >
                <TableCell>
                  {match.time
                    ? new Date(match.time).toLocaleTimeString("cs-CZ", {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{match.playground ?? "-"}</TableCell>
                <TableCell className="font-medium text-primary ">
                  {match.homeTeam?.name ?? "-"}
                </TableCell>
                <TableCell className="font-medium text-primary">
                  {match.awayTeam?.name ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
