import { useParams } from "react-router-dom";
import { useBracketByCategory } from "@/hooks/useGroups";
import { PlayoffVisualizer } from "./PlayoffVisualizer";

export const PlayoffBracketPage = () => {
  const categoryId = 2; // TODO: načti z URL nebo z contextu
  const { data: bracket, isLoading, error } = useBracketByCategory(categoryId);

  if (isLoading) return <p>Načítám pavouka...</p>;
  if (error || !bracket) return <p>Chyba při načítání.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Playoff pavouk</h2>
      <PlayoffVisualizer groups={bracket} />
    </div>
  );
};
