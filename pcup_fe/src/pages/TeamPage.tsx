import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTeamById } from "@/hooks/useTeams";
import { useMatchesByTeam } from "@/hooks/useMatches";

const API_URL2 = "http://localhost:5056";

const teamLogos: Record<string, string> = {
  Polanka: `${API_URL2}/images/polanka.gif`,
  Ostrava: `${API_URL2}/images/ostrava.gif`,
  "Frýdek-Místek": `${API_URL2}/images/frydek.png`,
  Zubří: `${API_URL2}/images/zubri.png`,
  Praha: `${API_URL2}/images/praha.png`,
};

// API endpoint
const API_URL = import.meta.env.VITE_API_URL;

export const TeamPage = () => {
  const { id } = useParams<{ id: string }>();

  const teamId = Number(id);

  const { data: team, isLoading: teamLoading } = useTeamById(teamId);
  const { data: matches, isLoading: matchesLoading } = useMatchesByTeam(teamId);

  const findLogo = () => {
    if (!team || !team.name) {
      return `${API_URL}/images/default-logo.png`; // fallback logo
    }
    const teamName = team.name.toLowerCase();
    for (const key in teamLogos) {
      if (teamName.includes(key.toLowerCase())) {
        return teamLogos[key];
      }
    }
    return `${API_URL}/images/default-logo.png`; // fallback logo
  };

  const logo = findLogo();

  if (teamLoading)
    return <Loader2 className="animate-spin w-6 h-6 mx-auto mt-10" />;
  if (!team)
    return <p className="text-center mt-10 text-red-500">Tým nenalezen.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Úvodní info */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-bold">{team.name}</h2>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Klub:</strong> {team.club?.name}
          </p>
          <p>
            <strong>Kategorie:</strong> {team.category?.name}
          </p>
          {/* Logo pokud existuje */}
          {logo && <img src={logo} alt="Logo týmu" className="h-24 mt-4" />}
        </CardContent>
      </Card>

      {/* Seznam zápasů */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-lg">Zápasy</h3>
        </CardHeader>
        <CardContent>
          {matchesLoading ? (
            <Loader2 className="animate-spin w-5 h-5 mx-auto" />
          ) : matches && matches.length > 0 ? (
            <Table>
              <TableHeader className="bg-primary/10">
                <TableRow>
                  <TableHead>Soupeř</TableHead>
                  <TableHead>Skóre</TableHead>
                  <TableHead>Hřiště</TableHead>
                  <TableHead>Čas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match: any) => {
                  const isHome = match.homeTeam.id === Number(id);
                  const opponent = isHome
                    ? match.awayTeam.name
                    : match.homeTeam.name;
                  const score = `${match.homeScore ?? "-"} : ${
                    match.awayScore ?? "-"
                  }`;
                  return (
                    <TableRow key={match.id}>
                      <TableCell>{opponent}</TableCell>
                      <TableCell>{score}</TableCell>
                      <TableCell>{match.playground}</TableCell>
                      <TableCell>
                        {new Date(match.time).toLocaleString("cs-CZ")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <p>Tým zatím neodehrál žádné zápasy.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
