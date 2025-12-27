import { useGroupsByCategory } from "@/hooks/useGroups";

import { Loader2 } from "lucide-react";
import { GroupStandingsCard } from "./GroupStandingsCard";

export const Standings = ({ categoryId }: { categoryId: number }) => {
  const { data: groups, isLoading, error } = useGroupsByCategory(categoryId);

  if (isLoading)
    return <Loader2 className="animate-spin w-6 h-6 mx-auto mt-10" />;
  if (error)
    return (
      <p className="text-center text-red-500 mt-6">
        Chyba při načítání skupin.
      </p>
    );
  if (!groups || groups.length === 0)
    return <p className="text-center mt-6">Žádné skupiny.</p>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 lg:grid-cols-2">
      {groups
        .filter((group) => group.id !== null)
        .map((group) => (
          <GroupStandingsCard
            key={group.id}
            groupId={group.id as number}
            groupName={group.name}
          />
        ))}
    </div>
  );
};
