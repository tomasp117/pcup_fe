import { Group } from "@/interfaces/MatchReport/Group";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useSaveBracket = () => {
  return useMutation({
    mutationFn: async (bracketData: any) => {
      const res = await fetch(`${API_URL}/bracket/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bracketData),
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se uložit pavouka.");
      }

      return res.json();
    },
    onSuccess: () => {
      // Tady můžeš třeba:
      // - Ukázat notifikaci že bylo uloženo
      // - Invalidovat query
      console.log("Bracket byl úspěšně uložen!");
    },
  });
};

export const useGroupsByCategory = (categoryId: number) => {
  return useQuery<Group[]>({
    queryKey: ["groups", categoryId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/groups?category=${categoryId}`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst skupiny.");
      }
      return res.json();
    },
  });
};

export const useGroupStandings = (groupId: number) => {
  return useQuery({
    queryKey: ["groupStandings", groupId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/groups/${groupId}/standings`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst tabulku.");
      }
      return res.json();
    },
  });
};
