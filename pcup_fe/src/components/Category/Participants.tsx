import { Loader2 } from "lucide-react";
import { useTeamsByCategory } from "@/hooks/useTeams";
import { Link } from "react-router-dom";

export const Participants = ({ categoryId }: { categoryId: number }) => {
  const { data: teams, isLoading, error } = useTeamsByCategory(categoryId);

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

  if (!teams || teams.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-6">
        Žádné týmy zatím nejsou přihlášeny do této kategorie.
      </div>
    );
  }

  const sortedTeams = [...teams].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="border rounded-lg overflow-hidden">
      {sortedTeams.map((team, index) => (
        <div
          key={team.id}
          className={`flex items-center justify-between p-3 text-sm ${
            index % 2 === 0 ? "bg-white" : "bg-primary/10"
          }`}
        >
          <div className="font-medium">
            <Link
              to={`/teams/${team.id}`}
              className="hover:text-blue-500 hover:underline"
            >
              {team.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};
