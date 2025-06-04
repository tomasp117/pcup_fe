import { useMutation, useQuery } from "@tanstack/react-query";
import { Match } from "@/interfaces/MatchReport/Match";
import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all matches
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

// Fetch matches by category
export const useMatchesByCategory = (categoryId: number) => {
  return useQuery<Match[]>({
    queryKey: ["matches", categoryId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/matches/by-category?category=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst zápasy.");
      }
      return res.json();
    },
  });
};

// Navigate to match report of the selected match
export const useSelectMatch = () => {
  const navigate = useNavigate();

  const handleSelectMatch = (match: Match) => {
    navigate(`/match-report/${match.id}`);
  };

  return { handleSelectMatch };
};

// Update match details (after x seconds and etc.)
export const useUpdateMatch = () => {
  return useMutation({
    mutationFn: async (data: {
      id: number;
      timePlayed: string;
      homeScore: number;
      awayScore: number;
      state: string;
    }) => {
      const res = await fetch(`${API_URL}/matches/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          timePlayed: data.timePlayed,
          homeScore: data.homeScore,
          awayScore: data.awayScore,
          state: data.state,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Nepodařilo se aktualizovat zápas: ${text}`);
      }
    },
  });
};

// Get matches by team
export const useMatchesByTeam = (id: number) => {
  return useQuery<Match[]>({
    queryKey: ["team-matches", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/teams/${id}/matches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst zápasy.");
      }
      return res.json();
    },
  });
};

export const useMatchPreview = (id: number) => {
  return useQuery<Match>({
    queryKey: ["match-preview", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/matches/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst zápas.");
      }

      return res.json();
    },
    refetchInterval: (query) => {
      const match = query.state.data;
      if (match && match.state === "Done") return false;
      return 5000;
    },
  });
};

export const fetchMatch = async (id: number): Promise<Match> => {
  const res = await fetch(`${API_URL}/matches/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    throw new Error("Nepodařilo se načíst zápas.");
  }

  return res.json();
};

export const useCreateLineups = () => {
  return useMutation({
    mutationFn: async (matchId: number) => {
      const res = await fetch(
        `${API_URL}/matches/${matchId}/generate-lineups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Nepodařilo se uložit soupisku.");
      }
      //return res.json();
    },
    onSuccess: () => {
      toast.success("Soupisky byly úspěšně uloženy.");
    },
    onError: (err) => {
      toast.error("Chyba při ukládání soupisky.");
    },
  });
};
