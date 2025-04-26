import { useQuery } from "@tanstack/react-query";
import { Match } from "@/interfaces/MatchReport/Match";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";

const API_URL = import.meta.env.VITE_API_URL;

export const useMatches = () => {
  return useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst zápasy.");
      }
      console.log("Response:", res);
      return res.json();
    },
  });
};

export const useSelectMatch = () => {
  const {
    setMatchDetails,
    setTeamHome,
    setTeamAway,
    setPlayers,
    setScoreHome,
    setScoreAway,
    setEvents,
  } = useMatchContext();

  const handleSelectMatch = (match: Match) => {
    // Nastavíš základní info
    setMatchDetails(match);

    // Nastavíš týmy
    setTeamHome(match.homeTeam);
    setTeamAway(match.awayTeam);

    // Připravíš hráče (sloučíš hráče obou týmů)
    const allPlayers = [
      ...(match.homeTeam.players || []),
      ...(match.awayTeam.players || []),
    ];
    setPlayers(allPlayers);

    // Nastavíš skóre (pokud už je nějaké)
    if (match.score) {
      const [homeScore, awayScore] = match.score.split(":").map(Number);
      setScoreHome(homeScore);
      setScoreAway(awayScore);
    } else {
      setScoreHome(0);
      setScoreAway(0);
    }

    setEvents(match.events || []);
  };

  return { handleSelectMatch };
};
