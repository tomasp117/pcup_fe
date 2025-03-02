import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface StatsCardProps {
  category: string;
}

export const StatsCard = ({ category }: StatsCardProps) => {
  type Scorer = { name: string; team: string; goals: number };
  type Penalty = { name: string; team: string; penalties: number };

  // Data střelců a trestů pro jednotlivé kategorie
  const categoryStats: Record<
    string,
    { scorers: Scorer[]; penalties: Penalty[] }
  > = {
    "Mini žáci 4+1": {
      scorers: [
        { name: "Jan Novák", team: "Polanka", goals: 8 },
        { name: "Petr Svoboda", team: "Ostrava", goals: 6 },
      ],
      penalties: [
        { name: "David Černý", team: "Ostrava", penalties: 2 },
        { name: "Jakub Veselý", team: "Frýdek", penalties: 1 },
      ],
    },
    "Mini žáci 6+1": {
      scorers: [
        { name: "Lukáš Král", team: "Polanka", goals: 10 },
        { name: "Martin Dvořák", team: "Frýdek", goals: 9 },
        { name: "Lukáš Král", team: "Polanka", goals: 10 },
        { name: "Martin Dvořák", team: "Frýdek", goals: 9 },
        { name: "Lukáš Král", team: "Polanka", goals: 10 },
        { name: "Martin Dvořák", team: "Frýdek", goals: 9 },
        { name: "Lukáš Král", team: "Polanka", goals: 10 },
        { name: "Martin Dvořák", team: "Frýdek", goals: 9 },
        { name: "Lukáš Král", team: "Polanka", goals: 10 },
        { name: "Martin Dvořák", team: "Frýdek", goals: 9 },
      ],
      penalties: [
        { name: "Jan Kučera", team: "Ostrava", penalties: 3 },
        { name: "David Marek", team: "Zubří", penalties: 2 },
      ],
    },
    "Mladší žáci": {
      scorers: [
        { name: "Ondřej Malý", team: "Zubří", goals: 12 },
        { name: "Tomáš Fiala", team: "Frýdek", goals: 11 },
      ],
      penalties: [
        { name: "Adam Kovář", team: "Polanka", penalties: 4 },
        { name: "Vojtěch Nový", team: "Ostrava", penalties: 3 },
        { name: "Adam Kovář", team: "Polanka", penalties: 4 },
        { name: "Vojtěch Nový", team: "Ostrava", penalties: 3 },
        { name: "Adam Kovář", team: "Polanka", penalties: 4 },
        { name: "Vojtěch Nový", team: "Ostrava", penalties: 3 },
        { name: "Adam Kovář", team: "Polanka", penalties: 4 },
        { name: "Vojtěch Nový", team: "Ostrava", penalties: 3 },
        { name: "Adam Kovář", team: "Polanka", penalties: 4 },
        { name: "Vojtěch Nový", team: "Ostrava", penalties: 3 },
      ],
    },
  };

  // Použijeme data pro vybranou kategorii (defaultně prázdné)
  const selectedStats = categoryStats[category] || {
    scorers: [],
    penalties: [],
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stats: (Scorer[] | Penalty[])[] = [
    selectedStats.scorers,
    selectedStats.penalties,
  ];
  const titles = ["Nejlepší střelci", "Nejvíce trestů"];

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [category]);

  const startAutoplay = () => {
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length);
    }, 5000);
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
        ? (prev - 1 + stats.length) % stats.length
        : (prev + 1) % stats.length
    );
    startAutoplay();
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {titles[currentIndex]} - {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="relative w-full group flex-grow">
          <Carousel className="w-full h-full relative overflow-hidden">
            <CarouselContent
              className="transition-transform duration-500 ease-in-out flex"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {stats.map((data, index) => (
                <CarouselItem key={index} className="w-full flex-shrink-0">
                  {data.length > 0 ? (
                    <div className="max-h-[250px] overflow-y-auto">
                      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                        <TableHeader className="bg-primary/10">
                          <TableRow>
                            <TableHead className="text-primary">Hráč</TableHead>
                            <TableHead className="text-center text-primary">
                              Tým
                            </TableHead>
                            <TableHead className="text-center text-primary">
                              {index === 0 ? "Góly" : "Tresty"}
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data.map((player, idx) => (
                            <TableRow
                              key={idx}
                              className={
                                idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                              }
                            >
                              <TableCell className="font-medium">
                                {player.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {player.team}
                              </TableCell>
                              <TableCell className="text-center font-bold text-primary">
                                {index === 0
                                  ? (player as Scorer).goals
                                  : (player as Penalty).penalties}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">
                      Žádná data pro tuto kategorii.
                    </p>
                  )}
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
        </div>
      </CardContent>
    </Card>
  );
};
