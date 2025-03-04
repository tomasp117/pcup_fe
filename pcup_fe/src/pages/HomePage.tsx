import { useState } from "react";
import { TeamCard } from "@/components/HomePage/TeamCard";
import { StatsCard } from "@/components/HomePage/StatsCard";
import { MatchesCard } from "@/components/HomePage/MatchesCard";
import { ResultsCard } from "@/components/HomePage/ResultsCard";
import { GalleryCard } from "@/components/HomePage/GalleryCard";
import { MapCard } from "@/components/HomePage/MapCard";
import { InfoCard } from "@/components/HomePage/InfoCard";

export default function HomePage() {
  // Kategorie turnaje
  const categories = [
    "Mini žáci 4+1",
    "Mini žáci 6+1",
    "Mladší žáci",
    "Starší žáci",
    "Mladší dorost",
  ];

  // Vybraná kategorie
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="space-y-8">
      {/* Úvodní banner */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent text-center py-12 rounded-lg shadow-sm">
        <h1 className="text-5xl md:text-7xl font-bold text-primary">
          Polanka Cup 2025
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-3">
          31. ročník mezinárodního mládežnického turnaje v házené
        </h2>
        <h3 className="text-xl md:text-2xl font-medium text-gray-700 mt-2">
          12. – 15. června 2025, Polanka nad Odrou
        </h3>
      </div>
      {/* Kategorie turnaje */}
      <div className="flex space-x-2 md:space-x-4 overflow-x-auto pl-4 md:pl-0 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-lg font-medium transition whitespace-nowrap shadow-sm border my-1 ${
              selectedCategory === category
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:text-primary hover:bg-primary/10"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid layout - Obsah pro vybranou kategorii */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <TeamCard category={selectedCategory} />
        <StatsCard category={selectedCategory} />
        <MatchesCard category={selectedCategory} />
        <ResultsCard category={selectedCategory} />
      </div>

      {/* Fotogalerie */}
      <GalleryCard />
      <InfoCard />
      <MapCard />
    </div>
  );
}
