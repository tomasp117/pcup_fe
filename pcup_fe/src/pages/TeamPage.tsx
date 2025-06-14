import { useNavigate, useParams } from "react-router-dom";
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
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";

//const API_URL2 = "http://localhost:5056";

const API_URL_IMAGES = import.meta.env.VITE_API_URL_IMAGES;

const teamLogos: Record<string, string> = {
  Polanka: `${API_URL_IMAGES}/polanka.gif`,
  Ostrava: `${API_URL_IMAGES}/ostrava.gif`,
  "Frýdek-Místek": `${API_URL_IMAGES}/frydek.png`,
  Zubří: `${API_URL_IMAGES}/zubri.png`,
  Praha: `${API_URL_IMAGES}/praha.png`,
};

// API endpoint
const API_URL = import.meta.env.VITE_API_URL;

export const TeamPage = () => {
  const { id } = useParams<{ id: string }>();

  const teamId = Number(id);

  const navigate = useNavigate();

  const { data: team, isLoading: teamLoading } = useTeamById(teamId);
  const { data: matches, isLoading: matchesLoading } = useMatchesByTeam(teamId);

  const findLogo = () => {
    if (!team || !team.name) {
      return `${API_URL_IMAGES}/default-logo.png`; // fallback logo
    }
    const teamName = team.name.toLowerCase();
    for (const key in teamLogos) {
      if (teamName.includes(key.toLowerCase())) {
        return teamLogos[key];
      }
    }
    return `${API_URL_IMAGES}/default-logo.png`; // fallback logo
  };

  const sortedMatches = [...(matches ?? [])].sort((a, b) => {
    const timeA = a.time ? new Date(a.time).getTime() : 0;
    const timeB = b.time ? new Date(b.time).getTime() : 0;
    return timeA - timeB;
  });

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
          <div className="flex justify-between">
            <div className="flex flex-col">
              <p>
                <strong>Klub:</strong> {team.club?.name}
              </p>
              <p>
                <strong>Kategorie:</strong> {team.categoryName}
              </p>
              <p>
                <strong>Hráči:</strong>
              </p>

              {team.players.map((palyer: Player) => (
                <p key={palyer.id}>
                  {palyer.person.firstName} {palyer.person.lastName}
                </p>
              ))}
            </div>
            {/* Logo pokud existuje */}
            {logo && (
              <img src={logo} alt="Logo týmu" className="mt-4 h-fit w-[40%] " />
            )}
          </div>
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
          ) : sortedMatches && sortedMatches.length > 0 ? (
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
                {sortedMatches.map((match: any) => {
                  const isHome = match.homeTeam.id === Number(id);
                  const opponent = isHome
                    ? match.awayTeam.name
                    : match.homeTeam.name;
                  const score = isHome
                    ? `${match.homeScore ?? "-"} : ${match.awayScore ?? "-"}`
                    : `${match.awayScore ?? "-"} : ${match.homeScore ?? "-"}`;
                  // const score = `${match.homeScore ?? "-"} : ${
                  //   match.awayScore ?? "-"
                  // }`;

                  return (
                    <TableRow
                      key={match.id}
                      className="cursor-pointer hover:bg-primary/10"
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
            <p>Tým zatím nemá přiřazené zápasy.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
