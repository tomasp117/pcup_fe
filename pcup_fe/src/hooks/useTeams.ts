import { Team } from "@/interfaces/MatchReport/Team";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

// Fetch teams by category
export const useTeamsByCategory = (categoryId: number) => {
  return useQuery<Team[]>({
    queryKey: ["teams-by-category", categoryId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/teams?category=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst týmy pro kategorii.");
      }

      return res.json();
    },
    enabled: !!categoryId,
  });
};

// Fetch team by ID
export const useTeamById = (teamId: number) => {
  return useQuery<Team>({
    queryKey: ["team", teamId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/teams/${teamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst tým.");
      }

      return res.json();
    },
    enabled: !!teamId,
  });
};
