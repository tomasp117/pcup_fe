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
