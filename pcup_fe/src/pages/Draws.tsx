import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableTeam } from "../components/MatchDraws/DraggableTeam";
import { DroppableGroup } from "../components/MatchDraws/DroppableGroup";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL = import.meta.env.VITE_API_URL;

interface Team {
  id: number;
  name: string;
  categoryId: number;
}

export interface TeamDraw {
  id: number;
  name: string;
  categoryId: number;
  strength: number;
  isGirls: boolean;
}

export interface Group {
  id?: number;
  name: string;
  teams: TeamDraw[];
}

export interface GroupVariant {
  groupCount: number;
  totalMatches: number;
  minMatchesPerTeam: number;
  groups: Group[];
}

export const Draws = () => {
  const [category, setCategory] = useState(1);
  const [categoryData, setCategoryData] = useState<
    Record<
      number,
      {
        teams: TeamDraw[];
        groups: Group[];
        selectedVariant: GroupVariant | null;
        groupVariants: GroupVariant[];
      }
    >
  >({});
  const [teamDraws, setTeamDraws] = useState<TeamDraw[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [groupCount, setGroupCount] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [expandedVariant, setExpandedVariant] = useState<number | null>(null);
  const [groupVariants, setGroupVariants] = useState<GroupVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<GroupVariant | null>(
    null
  );

  const hasTeamsInGroups = groups.some((group) => group.teams.length > 0);

  const handleCategoryChange = (newCategory: number) => {
    setCategoryData((prev) => ({
      ...prev,
      [category]: {
        teams: teamDraws,
        groups: groups,
        selectedVariant,
        groupVariants,
      },
    }));

    setCategory(newCategory);

    const newData = categoryData[newCategory] || {
      teams: [],
      groups: Array.from({ length: 4 }, (_, index) => ({
        id: index + 1,
        name: `Skupina ${String.fromCharCode(65 + index)}`,
        teams: [],
      })),
      selectedVariant: null,
      groupVariants: [],
    };

    setTeamDraws(newData.teams);
    setGroups(newData.groups);
    setSelectedVariant(newData.selectedVariant);
    setGroupVariants(newData.groupVariants);
  };

  const getTeamsAndGroups = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (categoryData[category]?.teams.length) {
      setTeamDraws(categoryData[category].teams);
      setGroups(categoryData[category].groups);
      setSelectedVariant(categoryData[category].selectedVariant);
      setGroupVariants(categoryData[category].groupVariants);
      setIsLoading(false);
      return;
    }

    try {
      const groupsResponse = await fetch(
        `${API_URL}/groups?categoryId=${category}`
      );

      let newGroups: Group[] = [];
      let remainingTeams: TeamDraw[] = [];

      if (groupsResponse.ok) {
        const groups: Group[] = await groupsResponse.json();
        newGroups = groups.map((group) => ({
          ...group,
          teams: group.teams.map((team) => ({
            ...team,
            strength: team.strength ?? 1,
            isGirls: team.isGirls ?? false,
          })),
        }));
      } else if (groupsResponse.status === 404) {
        const teamsResponse = await fetch(
          `${API_URL}/teams?category=${category}`
        );

        if (!teamsResponse.ok) {
          throw new Error(
            `Chyba: ${teamsResponse.status} ${teamsResponse.statusText}`
          );
        }

        remainingTeams = await teamsResponse.json();

        newGroups = Array.from({ length: 4 }, (_, index) => ({
          id: undefined,
          name: `Skupina ${String.fromCharCode(65 + index)}`,
          teams: [],
        }));
      } else {
        throw new Error(
          `Chyba: ${groupsResponse.status} ${groupsResponse.statusText}`
        );
      }

      setCategoryData((prev) => ({
        ...prev,
        [category]: {
          teams: remainingTeams,
          groups: newGroups,
          selectedVariant: prev[category]?.selectedVariant || null,
          groupVariants: prev[category]?.groupVariants || [],
        },
      }));

      setTeamDraws(remainingTeams);
      setGroups(newGroups);
      setSelectedVariant(categoryData[category]?.selectedVariant || null);
      setGroupVariants(categoryData[category]?.groupVariants || []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chyba při načítání dat. Zkuste to znovu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const autoAssignTeams = async () => {
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${API_URL}/teams/assign-groups?categoryId=${category}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamDraws),
        }
      );

      if (!response.ok) throw new Error(`Chyba: ${response.status}`);

      const data: GroupVariant[] = await response.json();

      setGroupVariants(data);

      // 🔹 Uložit varianty do paměti
      setCategoryData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          groupVariants: data,
          selectedVariant: null,
        },
      }));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Chyba při rozdělování týmů."
      );
    }
  };

  const selectVariant = (variant: GroupVariant) => {
    setSelectedVariant(variant);
    setExpandedVariant(null);
    setGroups(
      variant.groups.map((group) => ({
        ...group,
        teams: group.teams.map((team) => ({
          ...team,
          strength: teamDraws.find((t) => t.id === team.id)?.strength ?? 1,
          isGirls: teamDraws.find((t) => t.id === team.id)?.isGirls ?? false,
        })),
      }))
    );

    setTeamDraws((prevTeams) =>
      prevTeams.filter(
        (team) =>
          !variant.groups.flatMap((g) => g.teams).some((t) => t.id === team.id)
      )
    );

    setCategoryData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        selectedVariant: variant,
      },
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      getTeamsAndGroups();
    }, 300);

    return () => clearTimeout(timeout);
  }, [category]);

  const resetVariantSelection = () => {
    setSelectedVariant(null);
    resetTeams();
    //setGroupVariants([]);

    //setGroups(groups.map((group) => ({ ...group, teams: [] })));
  };

  const backToManual = () => {
    resetTeams();
    setSelectedVariant(null);
    setGroupVariants([]);

    //setGroups(groups.map((group) => ({ ...group, teams: [] })));
  };

  const toggleVariant = (index: number) => {
    setExpandedVariant(expandedVariant === index ? null : index);
  };

  const handleChange = (
    id: number,
    field: "strength" | "isGirls",
    value: number | boolean
  ) => {
    setTeamDraws((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, [field]: value } : team
      )
    );
  };

  const moveTeamToGroup = (team: TeamDraw, groupId: number) => {
    setTeamDraws((prevTeams) => prevTeams.filter((t) => t.id !== team.id));

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              teams: [...group.teams, { ...team }],
            }
          : group
      )
    );
  };

  const moveTeamBack = (team: TeamDraw) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        teams: group.teams.filter((t) => t.id !== team.id),
      }))
    );

    setTeamDraws((prevTeams) => {
      // 🔹 Ověříme, jestli už tým není v levé tabulce
      if (!prevTeams.some((t) => t.id === team.id)) {
        return [...prevTeams, { ...team }];
      }
      return prevTeams; // ✅ Pokud tam už je, nic nepřidáváme
    });
  };

  const removeTeamFromGroup = (teamId: number, fromGroup: number | null) => {
    if (fromGroup === null) return;

    let removedTeam: TeamDraw | undefined;

    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === fromGroup) {
          removedTeam = group.teams.find((t) => t.id === teamId);
          return {
            ...group,
            teams: group.teams.filter((t) => t.id !== teamId),
          };
        }
        return group;
      })
    );

    if (removedTeam) {
      setTeamDraws((prevTeams) => {
        // 🔹 Ověříme, jestli už tým není v levé tabulce
        if (!prevTeams.some((t) => t.id === removedTeam!.id)) {
          return [...prevTeams, removedTeam!];
        }
        return prevTeams;
      });
    }
  };

  const updateGroupCount = (newCount: number) => {
    if (newCount < 1 || newCount > 5) return;
    setGroupCount(newCount);

    if (newCount < groups.length) {
      const removedTeams = groups
        .slice(newCount)
        .flatMap((group) => group.teams);
      setTeamDraws((prevTeams) => [...prevTeams, ...removedTeams]);
    }

    const newGroups = Array.from({ length: newCount }, (_, index) => ({
      id: groups[index]?.id,
      name: `Skupina ${String.fromCharCode(65 + index)}`,
      teams: groups[index]?.teams || [],
    }));

    setGroups(newGroups);
  };

  useEffect(() => {
    updateGroupCount(groupCount);
  }, []);

  const resetTeams = () => {
    const allTeamsFromGroups = groups.flatMap((group) => group.teams);
    setTeamDraws((prevTeams) => [...prevTeams, ...allTeamsFromGroups]);
    setGroups(groups.map((group) => ({ ...group, teams: [] })));
  };

  const saveGroups = async () => {
    setErrorMessage(null);
    const validGroups = groups.filter((group) => group.teams.length > 0);

    if (validGroups.length === 0) {
      toast.error("Nelze uložit – všechny skupiny jsou prázdné.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/groups/save?categoryId=${category}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validGroups),
        }
      );

      if (!response.ok) throw new Error(`Chyba: ${response.status}`);

      toast.success("Skupiny byly úspěšně uloženy.");
    } catch (error) {
      toast.error("Chyba při ukládání skupin.");
    }
  };
  return (
    <DndProvider
      backend={HTML5Backend}
      key={selectedVariant ? "variant" : "manual"}
    >
      <Card className="shadow-lg p-4 h-min">
        <CardHeader>
          <h2 className="text-xl font-bold">Rozdělování týmů do skupin</h2>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <span className="font-medium">Vyber kategorii:</span>
          <Select
            onValueChange={(value) => handleCategoryChange(Number(value))}
            value={category.toString()}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Vyber kategorii" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Mini 4+1</SelectItem>
              <SelectItem value="2">Mini 6+1</SelectItem>
              <SelectItem value="3">Mladší žáci</SelectItem>
              <SelectItem value="4">Starší žáci</SelectItem>
              <SelectItem value="5">Mladší dorostenci</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className="flex_col sm:flex gap-8">
        {/*LEVÁ STRANA - Seznam týmů */}
        <div className="w-full sm:w-1/2 shadow-lg p-4 flex flex-col gap-4 ">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Seznam týmů</h2>
            {groupVariants.length === 0 ? (
              <Button
                onClick={autoAssignTeams}
                className="bg-blue-500 text-white px-4 py-2 whitespace-normal"
                disabled={selectedVariant !== null || hasTeamsInGroups}
              >
                {hasTeamsInGroups
                  ? "Vyčistěte skupiny"
                  : "Automaticky rozdělit týmy"}
              </Button>
            ) : (
              <Button
                onClick={() => backToManual()}
                className="bg-blue-500 text-white px-4 py-2"
                disabled={selectedVariant !== null}
              >
                Zpět na manuální rozdělení
              </Button>
            )}
          </div>
          {errorMessage && (
            <div className="text-red-500 bg-red-100 p-2 rounded">
              {errorMessage}
              {/* <Button className="ml-2" onClick={getTeams}>
                Zkusit znovu
              </Button> */}
            </div>
          )}
          {isLoading ? (
            <p>Načítání...</p>
          ) : (
            <Table>
              <TableHeader className="bg-primary/10">
                <TableRow>
                  <TableHead>Tým</TableHead>
                  <TableHead className="text-center">Koeficient</TableHead>
                  <TableHead className="text-center">Dívky</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamDraws.map((team) => (
                  <DraggableTeam
                    key={team.id}
                    team={team}
                    handleChange={handleChange}
                    isDraggable={
                      groupVariants.length === 0 || selectedVariant !== null
                    }
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* 🟢 PRAVÁ STRANA - Skupiny */}
        <div className="w-full sm:w-1/2 flex flex-col gap-4 shadow-lg p-4">
          {groupVariants.length === 0 ? (
            <>
              {/* Skupiny */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Skupiny</h2>
                <div className="flex gap-4 items-center">
                  <Button
                    onClick={resetTeams}
                    variant={"destructive"}
                    className=" "
                  >
                    Vyčistit týmy
                  </Button>
                </div>
              </div>
              {groups.map((group, index) => (
                <DroppableGroup
                  key={group.id ?? `new-group-${index}`}
                  group={group}
                  moveTeam={moveTeamToGroup}
                  moveBack={moveTeamBack}
                  removeTeamFromGroup={removeTeamFromGroup}
                />
              ))}
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => updateGroupCount(groupCount - 1)}
                  disabled={groupCount <= 1}
                  className="p-2"
                >
                  <Minus />
                </Button>
                <Button
                  className="mt-4"
                  onClick={saveGroups}
                  disabled={
                    groups.length === 0 ||
                    groups.every((g) => g.teams.length === 0)
                  }
                >
                  Uložit skupiny
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={groupCount}
                  onChange={(e) => updateGroupCount(Number(e.target.value))}
                  className="text-center shadow-lg p-2 hidden"
                />
                <Button
                  onClick={() => updateGroupCount(groupCount + 1)}
                  disabled={groupCount >= 5}
                  className="p-2 "
                >
                  <Plus />
                </Button>
              </div>
            </>
          ) : (
            <>
              {selectedVariant ? (
                <div>
                  <h3 className="text-lg font-bold">
                    Varianta ({selectedVariant.groupCount} skupin)
                  </h3>
                  <p>
                    Celkem zápasů: {selectedVariant.totalMatches} ( Minimálně{" "}
                    {selectedVariant.minMatchesPerTeam} na tým)
                  </p>

                  {groups.map((group, index) => (
                    <DroppableGroup
                      key={group.id ?? `new-group-${index}`}
                      group={group}
                      moveTeam={moveTeamToGroup}
                      moveBack={moveTeamBack}
                      removeTeamFromGroup={removeTeamFromGroup}
                    />
                  ))}
                  <div className="flex justify-between items-center">
                    <Button className="mt-4" onClick={resetVariantSelection}>
                      Zpět k výběru variant
                    </Button>
                    <Button
                      className="mt-4"
                      onClick={saveGroups}
                      disabled={
                        groups.length === 0 ||
                        groups.every((g) => g.teams.length === 0)
                      }
                    >
                      Uložit skupiny
                    </Button>
                  </div>
                </div>
              ) : (
                groupVariants.map((variant, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow-md">
                    <h3
                      className="text-lg font-bold cursor-pointer"
                      onClick={() => toggleVariant(index)}
                    >
                      Varianta {index + 1} ({variant.groupCount} skupin)
                    </h3>
                    <p>
                      Celkem zápasů: {variant.totalMatches} ( Minimálně{" "}
                      {variant.minMatchesPerTeam} na tým)
                    </p>

                    {expandedVariant === index &&
                      variant.groups.map((group) => (
                        <DroppableGroup
                          key={group.id ?? `new-group-${index}`}
                          group={group}
                          moveTeam={undefined}
                          moveBack={undefined}
                          removeTeamFromGroup={undefined}
                        />
                      ))}

                    <Button
                      onClick={() => selectVariant(variant)}
                      className="mt-2"
                    >
                      Vybrat tuto variantu
                    </Button>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </DndProvider>
  );
};
