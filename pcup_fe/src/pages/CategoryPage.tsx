import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useCategoryDetail } from "@/hooks/useCategories";
import { Participants } from "@/components/Category/Participants";
import { CategorySelect } from "@/components/CategorySelect";
import { useCategoryData } from "@/hooks/Draws/useCategoryData";
import { Groups } from "@/components/Category/Groups";
import { Matches } from "@/components/Category/Matches";
import { Standings } from "@/components/Category/Standings";
import { parse } from "path";
import { Loader2 } from "lucide-react";
import { FinalStandings } from "@/components/Category/FinalStandings";

const tabs = ["Účastníci", "Skupiny", "Utkání", "Tabulky", "Konečné pořadí"];
const API_URL = import.meta.env.VITE_API_URL;
export const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const categoryIdFromUrl = parseInt(id || "0", 10);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number>(categoryIdFromUrl);
  const [activeTab, setActiveTab] = useState("Účastníci");

  useEffect(() => {
    if (id) {
      const parsed = parseInt(id);
      if (!isNaN(parsed)) {
        setSelectedCategoryId(parsed);
      }
    }
  }, [id]);

  const handleCategoryChange = (newId: number) => {
    setSelectedCategoryId(newId);
    navigate(`/kategorie/${newId}`);
  };

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
              onChange={handleCategoryChange}
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
        {isLoading && (
          <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" />
        )}
        {error && <p>Chyba při načítání kategorie.</p>}

        {category && activeTab === "Účastníci" && (
          <Participants categoryId={selectedCategoryId} />
        )}
        {category && activeTab === "Skupiny" && (
          <Groups categoryId={selectedCategoryId} />
        )}
        {category && activeTab === "Utkání" && (
          <Matches categoryId={selectedCategoryId} />
        )}
        {category && activeTab === "Tabulky" && (
          <Standings categoryId={selectedCategoryId} />
        )}
        {category && activeTab === "Konečné pořadí" && (
          <FinalStandings categoryId={selectedCategoryId} />
        )}
      </div>
    </div>
  );
};
