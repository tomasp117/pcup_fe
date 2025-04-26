import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCategoryDetail } from "@/hooks/useCategories";
import { Participants } from "@/components/Category/Participants";

const tabs = ["Účastníci", "Skupiny", "Utkání", "Tabulky"];

export const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Účastníci");

  const { data: category, isLoading, error } = useCategoryDetail(id || "");

  if (isLoading) return <p>Načítám kategorii...</p>;
  if (error) return <p>Chyba při načítání kategorie.</p>;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">{category.name}</h2>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={tab === activeTab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
            className="text-sm"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Obsah podle vybraného tabu */}
      <div>
        {activeTab === "Účastníci" && <Participants />}
        {/* {activeTab === "Skupiny" && <Groups categoryId={id!} />}
        {activeTab === "Utkání" && <Matches categoryId={id!} />}
        {activeTab === "Tabulky" && <Standings categoryId={id!} />} */}
      </div>
    </div>
  );
};
