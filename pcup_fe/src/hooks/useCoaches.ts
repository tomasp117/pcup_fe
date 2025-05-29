import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const useDeleteCoach = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coachId: number) => {
      const res = await fetch(`${API_URL}/coaches/${coachId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Chyba při mazání trenéra");
      }
    },
    onSuccess: () => {
      toast.success("Trenér byl úspěšně smazán");
      queryClient.invalidateQueries({ queryKey: ["my-club"] });
    },
    onError: (err: any) => {
      toast.error(`Chyba: ${err.message}`);
    },
  });
};
