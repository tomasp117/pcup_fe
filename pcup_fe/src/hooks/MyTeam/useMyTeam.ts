import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { TeamDetailDTO } from "@/interfaces/MyTeam/TeamDetailDTO";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useMyTeam = () => {
  return useQuery<TeamDetailDTO>({
    queryKey: ["my-team"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/coaches/my-team`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 403 || res.status === 401) {
        throw new Error("Nemáte oprávnění k této akci. Přihlaste se prosím.");
      }

      if (!res.ok) {
        throw new Error("Nepodařilo se načíst tým.");
      }

      return res.json();
    },
  });
};
