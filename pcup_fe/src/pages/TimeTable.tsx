import { CategorySelect } from "@/components/CategorySelect";
import { MatchSlotRow } from "@/components/Timetable/MatchSlotRow";
import { PlayoffBracketEditor } from "@/components/Timetable/PlayoffBracketEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "@/interfaces/CategorySelect/ICategory";
import { GroupDetailDTO } from "@/interfaces/Timetable/GroupDetailDTO";
import { MatchDTO } from "@/interfaces/Timetable/MatchDTO";
import { UnassignedMatch } from "@/interfaces/Timetable/UnassignedMatch";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export const TimeTable = () => {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [groups, setGroups] = useState<GroupDetailDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //const [slots, setSlots] = useState<Slot[]>([]);
  const [matches, setMatches] = useState<MatchDTO[]>([]);
  const [unassignedMatches, setUnassignedMatches] = useState<UnassignedMatch[]>(
    []
  );

  const [filterCourt, setFilterCourt] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error("Nepodařilo se načíst kategorie");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError("Chyba při načítání kategorií.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchGroups = async (categoryId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/groups?category=${categoryId}`);
      if (!res.ok) throw new Error("Nepodařilo se načíst skupiny");
      const data: GroupDetailDTO[] = await res.json();
      setGroups(data);
    } catch (err) {
      setError("Chyba při načítání skupin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (id: number) => {
    setCategoryId(id);
    fetchGroups(id);
    fetchMatches();
    fetchUnassignedMatches(id);
  };

  const handleAssignUnassignedMatch = (
    matchId: number,
    homeTeamId: number,
    awayTeamId: number,
    groupName: string,
    groupId: number
  ) => {
    const matchToUpdate = matches.find((m) => m.id === matchId);
    if (!matchToUpdate) return;

    const prevHome = matchToUpdate.homeTeam?.id;
    const prevAway = matchToUpdate.awayTeam?.id;
    const prevGroupId = matchToUpdate.group?.id ?? 0;
    const prevGroupName = matchToUpdate.group?.name ?? "Skupina ?";

    // ⛔ Zrušení přiřazení
    if (homeTeamId === 0 && awayTeamId === 0) {
      if (prevHome && prevAway) {
        setUnassignedMatches((prev) => [
          ...prev,
          {
            homeTeamId: prevHome,
            homeTeamName: matchToUpdate.homeTeam?.name ?? "Neznámý",
            awayTeamId: prevAway,
            awayTeamName: matchToUpdate.awayTeam?.name ?? "Neznámý",
            groupId: prevGroupId,
            groupName: prevGroupName,
          },
        ]);
      }

      const clearedMatch = {
        ...matchToUpdate,
        homeTeam: null,
        awayTeam: null,
      };

      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? clearedMatch : m))
      );
      return;
    }

    // ↩️ Předchozí zápas přidat zpět (pokud byl jiný)
    if (
      prevHome &&
      prevAway &&
      (prevHome !== homeTeamId || prevAway !== awayTeamId)
    ) {
      setUnassignedMatches((prev) => [
        ...prev,
        {
          homeTeamId: prevHome,
          homeTeamName: matchToUpdate.homeTeam?.name ?? "Neznámý tým",
          awayTeamId: prevAway,
          awayTeamName: matchToUpdate.awayTeam?.name ?? "Neznámý tým",
          groupId: prevGroupId,
          groupName: prevGroupName,
        },
      ]);
    }

    // ✅ Přiřazení nového zápasu
    const updatedMatch = {
      ...matchToUpdate,
      group: {
        id: groupId,
        name: groupName,
        categoryId: 0,
        categoryName: "",
      },
      homeTeam: {
        id: homeTeamId,
        name:
          unassignedMatches.find(
            (m) => m.homeTeamId === homeTeamId && m.awayTeamId === awayTeamId
          )?.homeTeamName ?? "??",
        clubId: 0,
        clubName: "",
        categoryId: 0,
        tournamentInstanceId: 0,
        tournamentInstanceNum: 0,
      },
      awayTeam: {
        id: awayTeamId,
        name:
          unassignedMatches.find(
            (m) => m.homeTeamId === homeTeamId && m.awayTeamId === awayTeamId
          )?.awayTeamName ?? "??",
        clubId: 0,
        clubName: "",
        categoryId: 0,
        tournamentInstanceId: 0,
        tournamentInstanceNum: 0,
      },
    };

    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? updatedMatch : m))
    );

    setUnassignedMatches((prev) =>
      prev.filter(
        (m) => m.homeTeamId !== homeTeamId || m.awayTeamId !== awayTeamId
      )
    );
  };

  const handleSaveAssignments = async () => {
    const assigned = matches.filter((m) => m.homeTeam && m.awayTeam);

    const body = assigned.map((m) => ({
      matchId: m.id,
      homeTeamId: m.homeTeam!.id,
      awayTeamId: m.awayTeam!.id,
      groupId: m.group!.id,
    }));

    const res = await fetch(`${API_URL}/matches/update-batch`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("Chyba při ukládání přiřazení");
      return;
    }

    if (res.ok) {
      console.log("Přiřazení bylo úspěšně uloženo.");
    }

    // Možná refreshe zápasů
    await fetchMatches();
  };

  const handleAssignMatches = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/matches/assign-group-matches/${categoryId}`, {
        method: "POST",
      });

      toast.success("Zápasy úspěšně přiřazeny");
    } catch (err) {
      toast.error("Nepodařilo se přiřadit zápasy");
    } finally {
      setIsLoading(false);
      await fetchMatches();
    }
  };

  const handleAssignAllMatches = async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_URL}/matches/assign-all-group-matches`, {
        method: "POST",
      });

      toast.success("Všechny zápasy úspěšně přiřazeny");
    } catch (err) {
      toast.error("Nepodařilo se přiřadit zápasy");
    } finally {
      setIsLoading(false);
      await fetchMatches();
    }
  };

  const fetchMatches = async () => {
    if (matches.length > 0) return;
    try {
      const res = await fetch(`${API_URL}/matches`);
      if (!res.ok) throw new Error("Chyba při načítání zápasů");
      const data: MatchDTO[] = await res.json();
      setMatches(data);

      /* const convertedSlots: Slot[] = data.map((match, index) => ({
        id: match.id,
        time: match.time,
        playground: match.playground,
        match,
      }));
      setSlots(convertedSlots); */
    } catch (err) {
      setError("Chyba při načítání zápasů");
    }
  };

  const handleGenerateSlots = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/matches/generate-blank`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Chyba při generování slotů");
      await fetchMatches();
    } catch (err) {
      setError("Nepodařilo se vygenerovat sloty");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUnassignedMatches = async (categoryId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/matches/unassigned-group-matches/${categoryId}`
      );
      if (!res.ok) throw new Error("Chyba při načítání nepřiřazených zápasů");
      const data: UnassignedMatch[] = await res.json();
      setUnassignedMatches(data);
    } catch (err) {
      setError("Nepodařilo se načíst nepřiřazené zápasy");
    }
  };

  const [showUnassigned, setShowUnassigned] = useState(true);
  const filteredMatches = matches
    .filter((m) => !filterCourt || m.playground === filterCourt)
    .filter((m) => {
      const isUnassigned = m.homeTeam === null && m.awayTeam === null;
      if (isUnassigned) {
        return showUnassigned;
      }

      return (
        !filterCategory ||
        m.group?.categoryName === filterCategory ||
        (m.group === null && showUnassigned)
      );
    });

  return (
    <div className="gap-8 flex-col flex">
      <Card className="">
        <CardHeader>
          <h2 className="text-xl font-bold">Rozpis utkání</h2>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <CategorySelect
            value={categoryId}
            onChange={handleCategoryChange}
            noMini41={true}
          />
        </CardContent>
      </Card>
      {isLoading && <p>Načítání zápasů...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex gap-4 flex-wrap">
        {groups.map((group) => (
          <Card key={group.id} className=" ">
            <CardHeader className="py-2  ">
              <h2 className="text-lg font-bold text-primary">{group.name}</h2>
            </CardHeader>
            <CardContent className="p-4">
              {group.teams && group.teams.length > 0 ? (
                <Table className="text-sm">
                  <TableHeader className="bg-primary/10">
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Tým</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.teams.map((team, index) => (
                      <TableRow
                        key={team.id}
                        className="even:bg-gray-200 odd:bg-white"
                      >
                        <TableCell>{index + 1}.</TableCell>
                        <TableCell>{team.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-sm">Žádné týmy</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <div className="flex flex-col gap-4 my-4">
          <div className="flex flex-wrap items-end gap-4">
            <Button
              onClick={handleGenerateSlots}
              disabled={!categoryId || isLoading || matches.length > 0}
            >
              Vygenerovat sloty
            </Button>
            <Button
              onClick={handleAssignMatches}
              disabled={!categoryId || isLoading}
            >
              Přiřadit zápasy kategorie do slotů
            </Button>
            <Button
              onClick={handleAssignAllMatches}
              disabled={!categoryId || isLoading}
            >
              Přiřadit všechny zápasy do slotů
            </Button>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Hřiště</label>
              <select
                value={filterCourt ?? ""}
                onChange={(e) => setFilterCourt(e.target.value || null)}
                className="border rounded px-3 py-1 min-w-[180px]"
              >
                <option value="">Všechna hřiště</option>
                {Array.from(new Set(matches.map((m) => m.playground))).map(
                  (court) => (
                    <option key={court} value={court}>
                      {court}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Kategorie</label>
              <select
                value={filterCategory ?? ""}
                onChange={(e) => setFilterCategory(e.target.value || null)}
                className="border rounded px-3 py-1 min-w-[180px]"
              >
                <option value="">Všechny kategorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <input
                type="checkbox"
                id="show-unassigned"
                checked={showUnassigned}
                onChange={(e) => setShowUnassigned(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="show-unassigned" className="text-sm">
                Zobrazit volné zápasy
              </label>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="">Čas</TableHead>
              <TableHead>Hřiště</TableHead>
              <TableHead>Zápas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Načítání slotů...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filteredMatches
                .slice()
                .sort(
                  (a, b) =>
                    new Date(a.time).getTime() - new Date(b.time).getTime()
                )
                .map((match) => (
                  <MatchSlotRow
                    key={match.id}
                    match={match}
                    unassignedMatches={unassignedMatches}
                    onAssign={handleAssignUnassignedMatch}
                  />
                ))}
          </TableBody>
        </Table>
      </div>
      <Button className="w-fit" onClick={handleSaveAssignments}>
        Uložit přiřazení
      </Button>

      <PlayoffBracketEditor />
    </div>
  );
};
