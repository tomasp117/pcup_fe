import { Loader2 } from "lucide-react";
import { useTeamsByCategory } from "@/hooks/useTeams";
import { Link } from "react-router-dom";
import { useFinalStandingsByCategory } from "@/hooks/useGroups";

export const FinalStandings = ({ categoryId }: { categoryId: number }) => {
  const {
    data: finalStandings,
    isLoading,
    error,
  } = useFinalStandingsByCategory(categoryId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        Chyba při načítání týmů.
      </div>
    );
  }

  if (!finalStandings || finalStandings.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        Žádné týmy zatím nejsou přihlášeny do této kategorie.
      </div>
    );
  }

  const sortedTeams = [...finalStandings].sort(
    (a, b) => a.finalPlace - b.finalPlace
  );

  return (
    <div className="border rounded-lg overflow-hidden">
      {sortedTeams.map((team, index) => (
        <div
          key={team.teamId}
          className={`flex items-center gap-1 p-3 text-sm 
          ${
            index === 0
              ? "bg-yellow-400"
              : index === 1
              ? "bg-gray-400"
              : index === 2
              ? "bg-yellow-600"
              : ""
          }
          `}
        >
          <span className="font-bold">{team.finalPlace}.</span>
          <div className="font-medium">
            <Link
              to={`/teams/${team.teamId}`}
              className="hover:text-blue-500 hover:underline"
            >
              {team.teamName}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
