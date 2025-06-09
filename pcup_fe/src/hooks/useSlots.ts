import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface Slot {
  id: number;
  time: string;
  playground: string;
}

export const useSlots = (edition: number) =>
  useQuery<Slot[]>({
    queryKey: ["slots", edition],
    queryFn: async () => {
      // pokud nemáte vlastní endpoint, můžete brát všechny zápasy a filtrovat state=Generated
      const res = await fetch(`${API_URL}/${edition}/matches/slots`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Nelze načíst sloty");
      return res.json();
    },
  });

export const useAddSlot = (edition: number) => {
  const qc = useQueryClient();
  return useMutation<Slot, Error, { time: string; playground: string }>({
    mutationFn: async (newSlot: { time: string; playground: string }) => {
      const res = await fetch(`${API_URL}/${edition}/matches/slots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newSlot),
      });
      if (!res.ok) throw new Error("Chyba při přidávání slotu");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["slots", edition] });
    },
  });
};

export const useDeleteSlot = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (slotId: number) => {
      const res = await fetch(`${API_URL}/matches/slots/${slotId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Mazání selhalo");
    },
    onSuccess: (_data, slotId, context) => {
      // Jestli chcete, znovu načíst sloty
      qc.invalidateQueries({ queryKey: ["slots"] });
    },
  });
};
