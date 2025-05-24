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
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";

export const Matches = ({ categoryId }: { categoryId: number }) => {
  const { data: matches, isLoading, error } = useMatchesByCategory(categoryId);
  const [playgroundFilter, setPlaygroundFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const navigate = useNavigate();
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

  const filteredMatches = matches.filter((match) => {
    const matchesPlayground =
      playgroundFilter === "all" || match.playground === playgroundFilter;

    const matchesSearch =
      searchTerm.trim() === "" ||
      match.homeTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam?.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPlayground && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-bold text-primary">Zápasy</h2>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex flex-col gap-1">
            <Label htmlFor="playground">Hřiště</Label>
            <Select
              value={playgroundFilter}
              onValueChange={setPlaygroundFilter}
            >
              <SelectTrigger className="w-[200px]" id="playground">
                <SelectValue placeholder="Vyber hřiště" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všechna hřiště</SelectItem>
                {[...new Set(matches.map((m) => m.playground))].map((pg) => (
                  <SelectItem key={pg} value={pg}>
                    {pg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="search">Hledat tým</Label>
            <Input
              id="search"
              className="w-[250px]"
              placeholder="Např. Polanka"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
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
            {filteredMatches.map((match) => (
              <TableRow
                key={match.id}
                className="even:bg-primary/10 hover:bg-primary/20 cursor-pointer "
                onClick={() => navigate(`/match-preview/${match.id}`)}
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
                  <Link
                    to={`/teams/${match.homeTeam.id}`}
                    className="text-blue-500 underline"
                  >
                    {match.homeTeam?.name ?? "-"}
                  </Link>
                </TableCell>
                <TableCell className="font-medium text-primary">
                  <Link
                    to={`/teams/${match.awayTeam.id}`}
                    className="text-blue-500 underline"
                  >
                    {match.awayTeam?.name ?? "-"}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
