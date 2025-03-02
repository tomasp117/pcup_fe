import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface ResultsCardProps {
  category: string;
}

const resultsData: Record<
  string,
  { home: string; away: string; score: string }[]
> = {
  "Mini žáci 4+1": [
    { home: "Polanka", away: "Ostrava", score: "3:2" },
    { home: "Frýdek", away: "Zubří", score: "1:4" },
  ],
  "Mini žáci 6+1": [
    { home: "Ostrava", away: "Frýdek", score: "2:1" },
    { home: "Zubří", away: "Polanka", score: "0:5" },
  ],
  "Mladší žáci": [
    { home: "Ostrava", away: "Frýdek", score: "3:3" },
    { home: "Polanka", away: "Zubří", score: "4:2" },
  ],
  "Starší žáci": [
    { home: "Zubří", away: "Polanka", score: "2:5" },
    { home: "Frýdek", away: "Ostrava", score: "1:3" },
  ],
  "Mladší dorost": [
    { home: "Frýdek", away: "Zubří", score: "6:1" },
    { home: "Polanka", away: "Ostrava", score: "2:2" },
  ],
};

export default function MatchesCard({ category }: ResultsCardProps) {
  const results = resultsData[category];
  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Výsledky</CardTitle>
      </CardHeader>
      <CardContent>
        {results.length > 0 ? (
          <ul className="list-disc px-6 space-y-2">
            {results.map((result, index) => (
              <li key={index}>
                {result.home} {result.score} {result.away}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            Žádné výsledky pro tuto kategorii.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
