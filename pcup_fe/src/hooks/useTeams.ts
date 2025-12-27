import { Team } from "@/interfaces/MatchReport/Team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export const useTeams = (instanceId: number) => {
  return useQuery<Team[]>({
    queryKey: ["teams", "instance", instanceId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/${instanceId}/teams`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst týmy.");
      }

      return res.json();
    },
    enabled: !!instanceId,
  });
};

type TeamCreateInput = Partial<Omit<Team, "id" | "matches" | "players" | "coach">> & {
  tournamentInstanceId?: number;
  name: string;
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (team: TeamCreateInput) => {
      const res = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(team),
      });
      if (!res.ok) throw new Error("Nepodařilo se vytvořit tým.");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate all team-related queries
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId: number) => {
      const res = await fetch(`${API_URL}/teams/${teamId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat tým.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export const useImportTeamsCsv = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Team>[]) => {
      const res = await fetch(`${API_URL}/teams/import-csv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Nepodařilo se importovat CSV.");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate all team-related queries
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
