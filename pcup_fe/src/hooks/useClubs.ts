import { Club } from "@/interfaces/MatchReport/Club";

import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

type ClubCreateInput = {
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
  logo?: string; // ➕
};

// type Club = {
//   id: number;
//   name: string;
//   email?: string;
//   address?: string;
//   website?: string;
//   state?: string;
//   logo: string;
// };

const API_URL = import.meta.env.VITE_API_URL;

export const useCreateClub = () => {
  const queryClient = useQueryClient();
  return useMutation<Club, Error, ClubCreateInput>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_URL}/clubs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chyba při vytváření klubu");
      }

      return await response.json();
    },
    onError: (error: Error) => {
      console.error("Chyba při vytváření klubu:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
};

export const useClubs = () => {
  return useQuery<Club[]>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/clubs`);
      if (!res.ok) throw new Error("Nepodařilo se načíst kluby");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_URL}/clubs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Chyba při mazání klubu");
      }
    },
    onError: (error: Error) => {
      console.error("Chyba při mazání klubu:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
};

export const useClubDetail = (id: number) => {
  return useQuery<Club>({
    queryKey: ["club-detail", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/clubs/${id}`);
      if (!res.ok) throw new Error("Nepodařilo se načíst klub.");
      return res.json();
    },
    enabled: !!id,
  });
};

export const useUpdateClub = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (club: Club) => {
      const res = await fetch(`${API_URL}/clubs/${club.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(club),
      });

      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
};

export const useMyClub = () => {
  return useQuery<Club | null>({
    queryKey: ["my-club"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/club-admin/my-club`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Nepodařilo se načíst můj klub.");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
};
