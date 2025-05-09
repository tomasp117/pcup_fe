import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCategoryDetail } from "@/hooks/useCategories";
import { Participants } from "@/components/Category/Participants";
import { CategorySelect } from "@/components/CategorySelect";
import { useCategoryData } from "@/hooks/Draws/useCategoryData";
import { Groups } from "@/components/Category/Groups";
import { Matches } from "@/components/Category/Matches";

const tabs = ["Účastníci", "Skupiny", "Utkání", "Tabulky"];
const API_URL = import.meta.env.VITE_API_URL;
export const CategoryPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("Účastníci");

  const {
    data: category,
    isLoading,
    error,
  } = useCategoryDetail(selectedCategoryId || 0);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold">Kategorie</h2>
            <CategorySelect
              value={selectedCategoryId}
              onChange={setSelectedCategoryId}
            />
          </div>
        </CardHeader>
      </Card>

      <div className="flex items-center gap-4">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={tab === activeTab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className="text-sm"
          >
            {tab}
          </Button>
        ))}
      </div>

      <div>
        {isLoading && <p>Načítám kategorii...</p>}
        {error && <p>Chyba při načítání kategorie.</p>}
        {category &&
          selectedCategoryId !== null &&
          activeTab === "Účastníci" && (
            <Participants categoryId={selectedCategoryId} />
          )}

        {category && activeTab === "Skupiny" && (
          <Groups categoryId={selectedCategoryId!} />
        )}

        {category && activeTab === "Utkání" && (
          <Matches categoryId={selectedCategoryId!} />
        )}
      </div>
    </div>
  );
};
