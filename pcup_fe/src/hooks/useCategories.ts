import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst kategorie.");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCategoryDetail = (id: string) => {
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
