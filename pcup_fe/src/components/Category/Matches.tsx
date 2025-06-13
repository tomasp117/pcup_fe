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
import { useEffect, useState } from "react";
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
  // 1) HOOKY vždy na začátku
  const { data: matches, isLoading, error } = useMatchesByCategory(categoryId);
  const [playgroundFilter, setPlaygroundFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 2) Seřaď podle času, potom filtruj
  const sortedMatches = [...(matches ?? [])].sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : 0;
    const timeB = b.time ? new Date(b.time).getTime() : 0;
    return timeA - timeB;
  });
  const filteredMatches = sortedMatches.filter((match) => {
    const byPlayground =
      playgroundFilter === "all" || match.playground === playgroundFilter;
    const bySearch =
      searchTerm === "" ||
      match.homeTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam?.name.toLowerCase().includes(searchTerm.toLowerCase());
    return byPlayground && bySearch;
  });

  // 3) Debug/logging hook taky bude vždy zavolán
  useEffect(() => {
    console.log("Filtered matches:", filteredMatches);
  }, [filteredMatches]);

  // 4) Teprve teď rozhodni, co renderovat
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

  if (filteredMatches.length === 0) {
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
                {[...new Set(filteredMatches.map((m) => m.playground))].map(
                  (pg) => (
                    <SelectItem key={pg} value={pg}>
                      {pg}
                    </SelectItem>
                  )
                )}
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
              <TableHead className="font-bold text-center">Výsledek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMatches.map((match) => (
              <TableRow
                key={match.id}
                className="even:bg-primary/10 hover:bg-primary/20 relative group cursor-pointer"
                onClick={(e) => {
                  // levé tlačítko
                  if (e.ctrlKey || e.metaKey) {
                    // Ctrl nebo Cmd + klik
                    window.open(`/match-preview/${match.id}`, "_blank");
                  } else {
                    // normální klik
                    navigate(`/match-preview/${match.id}`);
                  }
                }}
                onAuxClick={(e) => {
                  if (e.button === 1) {
                    // prostřední tlačítko
                    window.open(`/match-preview/${match.id}`, "_blank");
                  }
                }}
              >
                <TableCell className="z-10">
                  {match.time
                    ? new Date(match.time).toLocaleTimeString("cs-CZ", {
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </TableCell>
                <TableCell className="z-10">
                  {match.playground ?? "-"}
                </TableCell>
                <TableCell className="font-medium text-primary z-10">
                  <Link
                    to={`/teams/${match.homeTeam.id}`}
                    onClick={(e) => e.stopPropagation()}
                    onAuxClick={(e) => {
                      e.stopPropagation();
                      // necháme browser otevřít novou záložku s odkazem
                    }}
                    className="hover:text-blue-500 hover:underline relative z-20"
                  >
                    {match.homeTeam?.name ?? "-"}
                  </Link>
                </TableCell>
                <TableCell className="font-medium text-primary z-10">
                  <Link
                    to={`/teams/${match.awayTeam.id}`}
                    onClick={(e) => e.stopPropagation()}
                    onAuxClick={(e) => {
                      e.stopPropagation();
                      // necháme browser otevřít novou záložku s odkazem
                    }}
                    className="hover:text-blue-500 hover:underline relative z-20"
                  >
                    {match.awayTeam?.name ?? "-"}
                  </Link>
                </TableCell>
                <TableCell className="font-semibold text-center z-10 ">
                  {match.homeScore != null && match.awayScore != null
                    ? `${match.homeScore} : ${match.awayScore}`
                    : "- : -"}
                  {match.state === "Pending" ? (
                    <span className=" pl-1 absolute text-red-500">Live</span>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
