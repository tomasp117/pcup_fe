import { CategorySelect } from "@/components/CategorySelect";
import { MatchSlotRow } from "@/components/Timetable/MatchSlotRow";
import { PlayoffBracketEditor } from "@/components/Timetable/PlayoffBracketEditor";
import { SlotManager } from "@/components/Timetable/SlotManager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRounded,
  TableRow,
} from "@/components/ui/table";
import { useEdition } from "@/Contexts/TournamentEditionContext";
import { Category } from "@/interfaces/CategorySelect/ICategory";
import { GroupDetailDTO } from "@/interfaces/Timetable/GroupDetailDTO";
import { MatchDTO } from "@/interfaces/Timetable/MatchDTO";
import { UnassignedMatch } from "@/interfaces/Timetable/UnassignedMatch";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

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
  //const courts = Array.from(new Set(matches.map((m) => m.playground)));

  const [filterCourt, setFilterCourt] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const edition = useEdition();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/${edition}/categories`);
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
      setGroups([]);
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
        categoryId: categoryId!,
        categoryName:
          categories.find((cat) => cat.id === categoryId)?.name ?? "",
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
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
      const res = await fetch(
        `${API_URL}/matches/assign-group-matches/${categoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Chyba při přiřazení zápasů");

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Zápasy úspěšně přiřazeny");
    } catch (err) {
      toast.error("Nepodařilo se přiřadit zápasy");
    } finally {
      setIsLoading(false);
      await fetchMatches();
      await fetchUnassignedMatches(categoryId!);
    }
  };

  const handleAssignAllMatches = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/${edition}/matches/assign-all-group-matches`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Chyba při přiřazení zápasů");

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Všechny zápasy úspěšně přiřazeny");
    } catch (err) {
      toast.error("Nepodařilo se přiřadit zápasy");
    } finally {
      setIsLoading(false);
      await fetchMatches();
      await fetchUnassignedMatches(categoryId!);
    }
  };

  const fetchMatches = async () => {
    //if (matches.length > 0) return;
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
      const res = await fetch(`${API_URL}/${edition}/matches/generate-blank`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Chyba při generování slotů");
      await fetchMatches();
    } catch (err) {
      setError(`Chyba při generování slotů ${err}`);
    } finally {
      setError(null);
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

  const courts = useMemo(
    () => Array.from(new Set(matches.map((m) => m.playground))),
    [matches]
  );

  const filteredMatches = useMemo(() => {
    return matches
      .filter((m) => !filterCourt || m.playground === filterCourt)
      .filter((m) => {
        const isUn = !m.homeTeam && !m.awayTeam;
        if (isUn) return showUnassigned;
        return !filterCategory || m.group?.categoryName === filterCategory;
      })
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [matches, filterCourt, filterCategory, showUnassigned]);

  // const filteredMatches = matches
  //   .filter((m) => !filterCourt || m.playground === filterCourt)
  //   .filter((m) => {
  //     const isUnassigned = m.homeTeam === null && m.awayTeam === null;
  //     if (isUnassigned) {
  //       return showUnassigned;
  //     }

  //     return (
  //       !filterCategory ||
  //       m.group?.categoryName === filterCategory ||
  //       (m.group === null && showUnassigned)
  //     );
  //   });

  const handleSwapTeams = useCallback((matchId: number) => {
    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== matchId || !m.homeTeam || !m.awayTeam) return m;
        return {
          ...m,
          homeTeam: m.awayTeam,
          awayTeam: m.homeTeam,
        };
      })
    );
  }, []);

  const parentRef = useRef<HTMLTableSectionElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredMatches.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 56, // nebo jaká je vaše výška řádku
    overscan: 5,
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
      {isLoading && (
        <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" />
      )}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {groups.length === 0 && !isLoading && (
          <p className="text-gray-500">Žádné skupiny pro tuto kategorii</p>
        )}
        {groups.map((group) => (
          <Card key={group.id} className=" ">
            <CardHeader className="py-2  ">
              <h2 className="text-lg font-bold text-primary">{group.name}</h2>
            </CardHeader>
            <CardContent className="p-4">
              {group.teams && group.teams.length > 0 ? (
                <TableRounded className="text-sm ">
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
                </TableRounded>
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
              disabled={
                !categoryId ||
                isLoading ||
                matches.length === 0 ||
                unassignedMatches.length === 0
              }
            >
              Přiřadit zápasy kategorie do slotů
            </Button>
            <Button
              onClick={handleAssignAllMatches}
              disabled={
                !categoryId ||
                isLoading ||
                matches.length === 0 ||
                unassignedMatches.length === 0
              }
            >
              Přiřadit všechny zápasy do slotů
            </Button>
            <SlotManager edition={edition} courts={courts} />
            {/* <div className="flex flex-col">
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
            </div> */}
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Hřiště</label>
              <select
                value={filterCourt ?? ""}
                onChange={(e) => setFilterCourt(e.target.value || null)}
                className="border rounded px-3 py-1 min-w-[180px]"
              >
                <option value="">Všechna hřiště</option>
                {courts.map((court) => (
                  <option key={court} value={court}>
                    {court}
                  </option>
                ))}
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
        <div
          className="
          overflow-y-auto max-h-[100vh] min-h-[300px] rounded-lg border border-gray-200 shadow-sm p-4 mb-4
        "
        >
          {/* <Table>
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
                    <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
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
                      category={
                        categories.find((cat) => cat.id === categoryId)?.name
                      }
                      onSwap={handleSwapTeams}
                    />
                  ))}
            </TableBody>
          </Table> */}
          <Table className="table-fixed w-full">
            <colgroup>
              <col style={{ width: "120px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "auto" }} />
            </colgroup>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead>Čas</TableHead>
                <TableHead>Hřiště</TableHead>
                <TableHead>Zápas</TableHead>
              </TableRow>
            </TableHeader>
          </Table>

          {/* SCROLLOVATELNÁ ČÁST */}
          <div
            ref={scrollRef}
            className="overflow-y-auto max-h-[70vh] rounded-lg border border-gray-200 shadow-sm"
          >
            <Table className="table-fixed w-full">
              <colgroup>
                <col style={{ width: "120px" }} />
                <col style={{ width: "200px" }} />
                <col style={{ width: "auto" }} />
              </colgroup>
              <TableBody
                style={{
                  position: "relative",
                  height: rowVirtualizer.getTotalSize(),
                }}
              >
                {/* spacer, díky němu scrollbar ví, jak dlouhý je obsah */}
                <TableRow
                  style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
                >
                  <TableCell colSpan={3} style={{ padding: 0, border: 0 }} />
                </TableRow>

                {/* virtuální řádky */}
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const match = filteredMatches[virtualRow.index];
                  return (
                    <MatchSlotRow
                      key={match.id}
                      match={match}
                      unassignedMatches={unassignedMatches}
                      onAssign={handleAssignUnassignedMatch}
                      onSwap={handleSwapTeams}
                      category={
                        categories.find((c) => c.id === categoryId)?.name
                      }
                      style={{
                        position: "absolute",
                        top: virtualRow.start,
                        left: 0,
                        width: "100%",
                      }}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <Button
        className="w-fit"
        onClick={handleSaveAssignments}
        disabled={matches.length === 0}
      >
        Uložit přiřazení
      </Button>

      {matches.length > 0 && <PlayoffBracketEditor categoryId={categoryId} />}
    </div>
  );
};
