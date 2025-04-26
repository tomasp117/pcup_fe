import { Team } from "@/interfaces/MatchReport/Team";
import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

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
