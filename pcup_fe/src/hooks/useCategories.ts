import { useEdition } from "@/Contexts/TournamentEditionContext";
import { Category } from "@/interfaces/MatchReport/Category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useCategories = () => {
  const edition = useEdition();
  return useQuery<Category[]>({
    queryKey: ["categories", edition],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/${edition}/categories`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst kategorie.");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoryDetail = (id: number) => {
  return useQuery({
    queryKey: ["category-detail", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/categories/${id}`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst detail kategorie.");
      }
      return res.json();
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (category: {
      name: string;
      tournamentInstanceId: number;
    }) => {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(category),
      });

      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
