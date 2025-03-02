import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

import polanka from "../../assets/polanka.gif";
import ostrava from "../../assets/ostrava.gif";
import frydek from "../../assets/frydek.png";
import zubri from "../../assets/zubri.png";
import praha from "../../assets/praha.png";

interface TeamCardProps {
  category: string;
}

export const TeamCard = ({ category }: TeamCardProps) => {
  // Data týmů pro různé kategorie
  const categoryTeams: Record<string, { img: string; name: string }[]> = {
    "Mini žáci 4+1": [
      { img: polanka, name: "Polanka" },
      { img: ostrava, name: "Ostrava" },
    ],
    "Mini žáci 6+1": [
      { img: frydek, name: "Frýdek" },
      { img: zubri, name: "Zubří" },
    ],
    "Mladší žáci": [
      { img: praha, name: "Praha" },
      { img: polanka, name: "Polanka" },
    ],
    "Starší žáci": [
      { img: praha, name: "Praha" },
      { img: polanka, name: "Polanka" },
    ],
    "Mladší dorostenci": [
      { img: praha, name: "Praha" },
      { img: polanka, name: "Polanka" },
    ],
  };

  // Použijeme data pro vybranou kategorii (defaultně prázdné)
  const teams = categoryTeams[category] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [category]); // Restartuje animaci při změně kategorie

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % teams.length);
    }, 3000);
  };

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleClick = (direction: "prev" | "next") => {
    stopAutoplay();
    setCurrentIndex((prev) =>
      direction === "prev"
        ? (prev - 1 + teams.length) % teams.length
        : (prev + 1) % teams.length
    );
    startAutoplay();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Týmy - {category}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative w-full h-auto group overflow-hidden flex-grow">
          {teams.length > 0 ? (
            <Carousel className="w-full h-full relative">
              <CarouselContent
                className="transition-transform duration-500 ease-in-out flex"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {teams.map((team, index) => (
                  <CarouselItem key={index} className="w-full flex-shrink-0">
                    <div className="relative w-full h-64">
                      <img
                        src={team.img}
                        alt={team.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-center py-3">
                        <h3 className="text-lg font-bold">{team.name}</h3>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <button
                onClick={() => handleClick("prev")}
                className="carousel-arrow carousel-arrow-left absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={() => handleClick("next")}
                className="carousel-arrow carousel-arrow-right absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </Carousel>
          ) : (
            <p className="text-center text-gray-500">
              Žádné týmy pro tuto kategorii.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
