import {
  PlaceholderGroup,
  PlaceholderGroupDTO,
} from "@/components/Timetable/PlayoffBracketEditorPlaceholder";
import { BracketRow } from "@/interfaces/BracketEditor/IBracketRow";
import { Group } from "@/interfaces/BracketEditor/IGroup";
import { FinalsStandingsTeam } from "@/interfaces/CategoryData/FinalsStandingsTeam";

import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const useSaveBracket = (categoryId: number) => {
  return useMutation({
    mutationFn: async (bracketData: Group[]) => {
      const res = await fetch(
        `${API_URL}/groups/bracket?category=${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bracketData),
        }
      );

      if (!res.ok) {
        throw new Error("Nepodařilo se uložit pavouka.");
      }

      return res.json();
    },
    onSuccess: () => {
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

export const useBracketByCategory = (categoryId: number) => {
  return useQuery<Group[]>({
    queryKey: ["bracket", categoryId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/groups/bracket?category=${categoryId}`
      );
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst pavouka.");
      }
      return res.json();
    },
  });
};

export const useSaveBracketPlaceholder = (categoryId: number) => {
  return useMutation({
    mutationFn: async (bracketData: PlaceholderGroupDTO[]) => {
      const res = await fetch(
        `${API_URL}/groups/bracket/placeholder?category=${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bracketData),
        }
      );

      if (!res.ok) {
        throw new Error("Nepodařilo se uložit placeholdery.");
      }
      return;
    },
    onSuccess: () => {
      console.log("Placeholder byl úspěšně uložen!");
    },
    onError: (error) => {
      toast.error("Nepodařilo se uložit pavouka.");
      console.error(error);
    },
  });
};

export const useGroupsWithPlaceholders = (categoryId: number) => {
  return useQuery({
    queryKey: ["groups-with-placeholders", categoryId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/groups/with-placeholders?categoryId=${categoryId}`
      );
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst skupiny s placeholdery.");
      }
      return res.json();
    },
    enabled: !!categoryId,
  });
};

export const useFinalStandingsByCategory = (categoryId: number) => {
  return useQuery<FinalsStandingsTeam[]>({
    queryKey: ["finalStandings", categoryId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/groups/final-standings?categoryId=${categoryId}`
      );
      if (!res.ok) {
        throw new Error("Nepodařilo se načíst konečné pořadí.");
      }
      return res.json();
    },
    enabled: !!categoryId,
  });
};
