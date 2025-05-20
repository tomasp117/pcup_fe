import { Tournament } from "@/interfaces/MatchReport/Tournament";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch(`${API_URL}/tournaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name }),
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

export const useTournaments = () => {
  return useQuery<Tournament[]>({
    queryKey: ["tournaments"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tournaments`);
      if (!res.ok) throw new Error("Nepodařilo se načíst turnaje");
      return res.json();
    },
  });
};

export const useTournament = (id: number) => {
  return useQuery<Tournament>({
    queryKey: ["tournament", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/tournaments/${id}`);
      if (!res.ok) throw new Error("Nepodařilo se načíst turnaj");
      return res.json();
    },
  });
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: number; name: string }) => {
      const res = await fetch(`${API_URL}/tournaments/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: data.id, name: data.name }),
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

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${API_URL}/tournaments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Chyba při mazání turnaje");
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
};
