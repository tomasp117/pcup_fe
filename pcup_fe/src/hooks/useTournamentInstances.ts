import { TournamentInstance } from "@/interfaces/MatchReport/TournamentInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateTournamentInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      tournamentId: number;
      editionNumber: number;
      startDate: string;
      endDate: string;
    }) => {
      const res = await fetch(`${API_URL}/tournament-instances`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
};

export const useTournamentInstances = () => {
  return useQuery({
    queryKey: ["tournament-instances"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tournament-instances`);
      if (!res.ok) throw new Error("Nepodařilo se načíst instance");
      return res.json();
    },
  });
};

export const useTournamentInstancesByTournamentId = (tournamentId: number) => {
  return useQuery<TournamentInstance[]>({
    queryKey: ["tournament-instances", tournamentId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/tournament-instances/by-tournament?tournamentId=${tournamentId}`
      );
      if (!res.ok) throw new Error("Nepodařilo se načíst edice turnaje");
      return res.json();
    },
    enabled: !!tournamentId,
  });
};

export const useTournamentInstance = (id: number) => {
  return useQuery<TournamentInstance>({
    queryKey: ["tournament-instance", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tournament-instances/${id}`);
      if (!res.ok) throw new Error("Nepodařilo se načíst instanci");
      return res.json();
    },
  });
};

export const useUpdateTournamentInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: number;
      editionNumber: number;
      startDate: string;
      endDate: string;
    }) => {
      const res = await fetch(`${API_URL}/tournament-instances/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-instances"] });
    },
  });
};

export const useDeleteTournamentInstance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/tournament-instances/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament-instances"] });
    },
  });
};
