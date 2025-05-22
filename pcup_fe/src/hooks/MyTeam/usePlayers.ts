import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

type PersonInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: string;
};

type PlayerDetailInput = {
  number: number;
  goalCount: number;
  sevenMeterGoalCount: number;
  sevenMeterMissCount: number;
  twoMinPenaltyCount: number;
  yellowCardCount: number;
  redCardCount: number;
  teamId: number;
  categoryId: number;
  person: PersonInput;
};

export const useAddPlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlayer: PlayerDetailInput) => {
      const res = await fetch(`${API_URL}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newPlayer),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Nepodařilo se přidat hráče.");
      }
    },
    onSuccess: () => {
      toast.success("Hráč byl úspěšně přidán.");
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

      return;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};

export const useFreePlayers = (categoryId: number) => {
  return useQuery<Player[]>({
    queryKey: ["free-players", categoryId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/players/free?categoryId=${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst volné hráče.");
      }

      return res.json();
    },
    enabled: !!categoryId,
  });
};

export const useAssignPlayerToTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      playerId,
      teamId,
    }: {
      playerId: number;
      teamId: number;
    }) => {
      const res = await fetch(`${API_URL}/players/${playerId}/assign-to-team`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(teamId),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Nepodařilo se přiřadit hráče.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
      queryClient.invalidateQueries({ queryKey: ["free-players"] });
    },
  });
};

export const useRemoveFromTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (playerId: number) => {
      const res = await fetch(
        `${API_URL}/players/${playerId}/remove-from-team`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Nepodařilo se odebrat hráče z týmu.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
      queryClient.invalidateQueries({ queryKey: ["free-players"] });
    },
  });
};

export const useApplyMatchStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: number) => {
      const res = await fetch(`${API_URL}/players/apply-match-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(matchId),
      });

      if (!res.ok)
        throw new Error("Nepodařilo se aktualizovat statistiky hráčů.");
    },
    onSuccess: () => {
      toast.success("Statistiky hráčů byly úspěšně aktualizovány.");
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};

export const useRevertMatchStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: number) => {
      const res = await fetch(`${API_URL}/players/revert-match-stats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(matchId),
      });

      if (!res.ok) throw new Error("Nepodařilo se vrátit statistiky hráčů.");
    },
    onSuccess: () => {
      toast.success("Statistiky hráčů byly úspěšně vráceny.");
      queryClient.invalidateQueries({ queryKey: ["my-team"] });
    },
  });
};
