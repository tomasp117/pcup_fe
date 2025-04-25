import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { useQueryClient, useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useAddPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlayer: Partial<Player>) => {
      console.log("Adding player:", newPlayer); // Debugging line
      const res = await fetch(`${API_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPlayer),
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se přidat hráče.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerId: number) => {
      const res = await fetch(`${API_URL}/players/${playerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se smazat hráče.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedPlayer: Player) => {
      const res = await fetch(`${API_URL}/players/${updatedPlayer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedPlayer),
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se upravit hráče.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};
