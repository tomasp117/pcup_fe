import { useMatches, useSelectMatch } from "@/hooks/useMatches";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUser } from "@/Contexts/UserContext";
import { Loader } from "lucide-react";

export const MatchSelector = () => {
  const { data: matches, isLoading } = useMatches();
  const [searchId, setSearchId] = useState("");
  const [playgroundFilter, setPlaygroundFilter] = useState("");
  const { user } = useUser();

  const { handleSelectMatch } = useSelectMatch();

  const playgrounds = Array.from(
    new Set(matches?.map((match) => match.playground).filter(Boolean))
  );

  const filteredMatches = matches
    ?.filter((match) => {
      const matchesSearch = searchId
        ? match.id.toString().startsWith(searchId)
        : true;
      const matchesPlaygroundFilter = playgroundFilter
        ? match.playground === playgroundFilter
        : true;

      const userCanSeeMatch =
        user?.role === "Admin" ||
        (user?.username &&
          match.playground.toLowerCase().includes(user.username.toLowerCase()));

      return (
        match.homeTeam &&
        match.awayTeam &&
        matchesSearch &&
        matchesPlaygroundFilter &&
        userCanSeeMatch
      );
    })
    .sort((a, b) => a.id - b.id);

  const formatTime = (isoTime: string) => {
    const date = new Date(isoTime);

    const dayShort = date.toLocaleDateString("cs-CZ", { weekday: "short" }); // Přidáme den v týdnu
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${dayShort} ${time}`; // Výstup např. "Po 13:30"
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Vyhledat ID (začátek)..."
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
        className="w-full"
      />

      <Select
        onValueChange={(value) =>
          setPlaygroundFilter(value === "all" ? "" : value)
        }
        value={playgroundFilter || "all"}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Vyber hřiště..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Všechna hřiště</SelectItem>
          {playgrounds.map((playground) => (
            <SelectItem key={playground} value={playground}>
              {playground}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading ? (
        <Loader className="animate-spin w-8 h-8 text-primary mx-auto" />
      ) : filteredMatches?.length ? (
        <div className="w-full border rounded-md overflow-hidden">
          {/* Header */}
          <div className="flex bg-gray-100 p-2 text-sm font-semibold">
            <div className="w-12">ID</div>
            <div className="flex-1 px-2">Domácí</div>
            <div className="flex-1 px-2">Host</div>
            <div className="flex-1 px-2">Hřiště</div>
            <div className="w-16 px-2">Čas</div>
            <div className="w-20 px-2">Stav</div>
            <div className="w-20 px-2">Výsledek</div>
          </div>

          {/* Rows */}
          {filteredMatches.map((match, index) => (
            <Button
              key={match.id}
              onClick={() => handleSelectMatch(match)}
              variant="ghost"
              className={`flex items-center w-full p-2 text-left text-xs ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-primary/5`}
            >
              <div className="w-12 truncate">{match.id}</div>
              <div className="flex-1 px-2 truncate">{match.homeTeam?.name}</div>
              <div className="flex-1 px-2 truncate">{match.awayTeam?.name}</div>
              <div className="flex-1 px-2 truncate">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    match.playground === "Hala"
                      ? "bg-blue-100 text-blue-800"
                      : match.playground.includes("1")
                      ? "bg-green-100 text-green-800"
                      : match.playground.includes("2")
                      ? "bg-red-100 text-red-800"
                      : match.playground.includes("3")
                      ? "bg-yellow-100 text-yellow-800"
                      : match.playground.includes("4")
                      ? "bg-purple-100 text-purple-800"
                      : match.playground.includes("5")
                      ? "bg-pink-100 text-pink-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {match.playground}
                </span>
              </div>
              <div className="w-16 px-2 truncate">{formatTime(match.time)}</div>
              <div className="w-20 px-2 truncate">{match.state}</div>
              <div className="w-20 px-2 truncate">
                {match.homeScore} : {match.awayScore}
              </div>
            </Button>
          ))}
        </div>
      ) : (
        <p>Žádné zápasy nenalezeny.</p>
      )}
    </div>
  );
};
