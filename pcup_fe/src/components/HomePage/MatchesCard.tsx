import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

interface MatchesCardProps {
  category: string;
}

const matchesData: Record<
  string,
  { home: string; away: string; time: string }[]
> = {
  "Mini žáci 4+1": [
    { home: "Polanka", away: "Ostrava", time: "10:00" },
    { home: "Frýdek", away: "Zubří", time: "12:00" },
  ],
  "Mini žáci 6+1": [
    { home: "Ostrava", away: "Frýdek", time: "09:00" },
    { home: "Zubří", away: "Polanka", time: "11:00" },
  ],
  "Mladší žáci": [
    { home: "Ostrava", away: "Frýdek", time: "13:00" },
    { home: "Polanka", away: "Zubří", time: "15:00" },
  ],
  "Starší žáci": [
    { home: "Zubří", away: "Polanka", time: "14:00" },
    { home: "Frýdek", away: "Ostrava", time: "16:00" },
  ],
  "Mladší dorost": [
    { home: "Frýdek", away: "Zubří", time: "17:00" },
    { home: "Polanka", away: "Ostrava", time: "19:00" },
  ],
};

export const MatchesCard = ({ category }: MatchesCardProps) => {
  const matches = matchesData[category];

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Nadcházející zápasy</CardTitle>
      </CardHeader>
      <CardContent>
        {matches.length > 0 ? (
          <ul className="list-disc px-6 space-y-2">
            {matches.map((match, index) => (
              <li key={index}>
                {match.home} vs. {match.away} - {match.time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            Žádné zápasy pro tuto kategorii.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
