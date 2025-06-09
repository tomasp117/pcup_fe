import { useParams } from "react-router-dom";
import { useBracketByCategory } from "@/hooks/useGroups";
import { PlayoffVisualizer } from "./PlayoffVisualizer";
import { Loader2 } from "lucide-react";

export const PlayoffBracketPage = () => {
  const categoryId = 2; // TODO: načti z URL nebo z contextu
  const { data: bracket, isLoading, error } = useBracketByCategory(categoryId);

  if (isLoading)
    return (
      <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mt-8" />
    );
  if (error || !bracket) return <p>Chyba při načítání.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Playoff pavouk</h2>
      <PlayoffVisualizer groups={bracket} />
    </div>
  );
};
