import { useMutation } from "@tanstack/react-query";

type ClubCreateInput = {
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
};

type Club = {
  id: number;
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
  logo: string;
};

export const useCreateClub = () => {
  return useMutation<Club, Error, ClubCreateInput>({
    mutationFn: async (data) => {
      const response = await fetch("/api/clubs", {
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
  });
};
