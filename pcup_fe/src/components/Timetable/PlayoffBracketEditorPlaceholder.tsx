import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import {
  useGroupsByCategory,
  useGroupsWithPlaceholders,
  useSaveBracketPlaceholder,
} from "@/hooks/useGroups";
import { set } from "react-hook-form";

import { Group } from "@/interfaces/BracketEditor/IGroup";
import { useTeamsByCategory } from "@/hooks/useTeams";

const API_URL = import.meta.env.VITE_API_URL;

export type PlaceholderTeam =
  | {
      type: "placeholder";
      group: string;
      position: number;
    }
  | {
      type: "resolved";
      id: number | null;
      name: string;
    };

export type PlaceholderTeamDTO = {
  name: string;
};

export type PlaceholderGroup = {
  name: string;
  phase: string;
  finalGroup?: number;
  teams: PlaceholderTeam[];
};

export type PlaceholderGroupDTO = {
  name: string;
  phase: string;
  finalGroup?: number;
  teams: PlaceholderTeamDTO[];
};

export type PlaceholderRow = {
  name: string;
  groups: PlaceholderGroup[];
};

interface PlayoffBracketEditorPlaceholderProps {
  categoryId: number | null;
}

export const PlayoffBracketEditorPlaceholder = ({
  categoryId,
}: PlayoffBracketEditorPlaceholderProps) => {
  const [rows, setRows] = useState<PlaceholderRow[]>([]);

  if (!categoryId) {
    return (
      <div className="text-red-500">
        K editaci pavouka je potřeba vybrat kategorii.
      </div>
    );
  }
  const { data: groups, isLoading } = useGroupsByCategory(categoryId);
  const { mutate: saveBracket, isPending } =
    useSaveBracketPlaceholder(categoryId);

  const { data: allTeams } = useTeamsByCategory(categoryId);

  if (allTeams == null) {
    return <div className="text-red-500">Týmy nejsou načteny.</div>;
  }

  const { data: placeholderGroups } = useGroupsWithPlaceholders(categoryId);

  const BACKEND_GROUPS =
    groups
      ?.filter((g) => g.name && g.name.trim() !== "")
      .map((g) => g.name.trim()) ?? [];

  const LOCAL_GROUPS = rows
    .flatMap((row) => row.groups)
    .map((g) => g.name.trim())
    .filter((v) => v); // odstraní prázdné názvy

  const AVAILABLE_GROUPS = Array.from(
    new Set([...BACKEND_GROUPS, ...LOCAL_GROUPS])
  );

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { name: `Nová fáze ${prev.length + 1}`, groups: [] },
    ]);
  };

  const addGroupToRow = (rowIndex: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: [
                ...row.groups,
                {
                  name: `Skupina ${row.groups.length + 1}`,
                  phase: row.name,
                  finalPlace: undefined,
                  teams: [],
                },
              ],
            }
          : row
      )
    );
  };

  const addTeamToGroup = (rowIndex: number, groupIndex: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((group, j) =>
                j === groupIndex
                  ? {
                      ...group,
                      teams: [
                        ...group.teams,
                        { type: "placeholder", group: "", position: 1 },
                      ],
                    }
                  : group
              ),
            }
          : row
      )
    );
  };

  const updateGroupName = (
    rowIndex: number,
    groupIndex: number,
    name: string
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((g, j) =>
                j === groupIndex ? { ...g, name } : g
              ),
            }
          : row
      )
    );
  };

  const updateRowName = (index: number, name: string) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              name,
              groups: row.groups.map((g) => ({ ...g, phase: name })),
            }
          : row
      )
    );
  };

  const updateTeamPlaceholder = (
    rowIndex: number,
    groupIndex: number,
    teamIndex: number,
    group: string,
    position: number
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((groupItem, j) =>
                j === groupIndex
                  ? {
                      ...groupItem,
                      teams: groupItem.teams.map((t, k) =>
                        k === teamIndex
                          ? { type: "placeholder", group, position }
                          : t
                      ),
                    }
                  : groupItem
              ),
            }
          : row
      )
    );
  };

  const validate = (): string | null => {
    for (const row of rows) {
      if (!row.name.trim()) return "Každá fáze musí mít název.";
      for (const group of row.groups) {
        if (!group.name.trim()) return "Každá skupina musí mít název.";
        if (!group.phase.trim()) return "Skupina musí mít fázi.";
        for (const team of group.teams) {
          if (team.type === "placeholder" && (!team.group || !team.position))
            return `Skupina ${group.name} má neúplného placeholdera.`;
        }
      }
    }
    return null;
  };

  const handleSave = () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = rows.flatMap((r) =>
      r.groups.map((g) => ({
        name: g.name,
        phase: r.name,
        finalGroup: g.finalGroup,
        teams: g.teams.map((t) =>
          t.type === "placeholder"
            ? { name: `${t.position}.${t.group}` }
            : { id: t.id, name: t.name }
        ),
      }))
    );

    saveBracket(payload);
  };

  const fetchGroupStandings = async (groupId: number) => {
    const res = await fetch(`${API_URL}/groups/${groupId}/standings`);
    if (!res.ok) throw new Error("Nepodařilo se načíst tabulku.");
    return res.json();
  };

  const resolveRealTeamsForRow = async (rowIndex: number) => {
    const row = rows[rowIndex];

    if (!groups) {
      toast.error("Skupiny nejsou načteny.");
      return;
    }

    try {
      const updatedGroups = await Promise.all(
        row.groups.map(async (group) => {
          const resolvedTeams: PlaceholderTeam[] = await Promise.all(
            group.teams.map(async (team) => {
              if (team.type !== "placeholder") return team;

              // Najdi skupinu podle názvu z placeholderu (např. "B")
              const realGroup = groups.find(
                (g) =>
                  g.name.trim().toLowerCase() ===
                  team.group.trim().toLowerCase()
              );

              if (!realGroup || realGroup.id == null) {
                return {
                  type: "resolved",
                  id: null,
                  name: `N/A (skupina '${team.group}' nenalezena)`,
                };
              }

              // FETCHUJ standings pro konkrétní placeholder skupinu!
              const standings = await fetchGroupStandings(realGroup.id);
              const realTeam = standings?.[team.position - 1];

              if (!realTeam) {
                return {
                  type: "resolved",
                  id: null,
                  name: `N/A (${team.position}.${team.group})`,
                };
              }

              return {
                type: "resolved",
                id: realTeam.teamId,
                name: realTeam.teamName,
              };
            })
          );

          return {
            ...group,
            teams: resolvedTeams,
          };
        })
      );

      setRows((prev) =>
        prev.map((r, i) =>
          i === rowIndex
            ? {
                ...r,
                groups: updatedGroups,
              }
            : r
        )
      );

      toast.success(`Reálné týmy pro fázi "${row.name}" byly přiřazeny.`);
    } catch (err) {
      console.error(err);
      toast.error("Nastala chyba při přiřazování týmů.");
    }
  };

  useEffect(() => {
    if (!placeholderGroups) return;

    // 1. Seskup podle phase
    const phaseMap: Record<string, PlaceholderGroup[]> = {};

    for (const group of placeholderGroups) {
      const phase = group.phase ?? "Neznámá fáze";

      if (!phaseMap[phase]) {
        phaseMap[phase] = [];
      }

      const teams: PlaceholderTeam[] = (group.teams ?? []).map((t: any) => {
        const match = t.name.match(/^(\d+)\.(.+)$/);
        if (!match) return { type: "resolved", id: null, name: t.name };

        return {
          type: "placeholder",
          position: parseInt(match[1], 10),
          group: match[2],
        };
      });

      phaseMap[phase].push({
        name: group.name,
        phase: phase,
        teams,
      });
    }

    // 2. Převést na array of rows
    const newRows: PlaceholderRow[] = Object.entries(phaseMap).map(
      ([phaseName, groups]) => ({
        name: phaseName,
        groups: groups ?? [],
      })
    );

    setRows(newRows);
  }, [placeholderGroups]);

  const updateResolvedTeam = (
    rowIndex: number,
    groupIndex: number,
    teamIndex: number,
    selected: { id: number; name: string }
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((g, j) =>
                j === groupIndex
                  ? {
                      ...g,
                      teams: g.teams.map((t, k) =>
                        k === teamIndex
                          ? {
                              type: "resolved",
                              id: selected.id,
                              name: selected.name,
                            }
                          : t
                      ),
                    }
                  : g
              ),
            }
          : row
      )
    );
  };

  const removeRow = (rowIndex: number) => {
    setRows((prev) => prev.filter((_, i) => i !== rowIndex));
  };

  // Delete a single group
  const removeGroup = (rowIndex: number, groupIndex: number) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? { ...row, groups: row.groups.filter((_, j) => j !== groupIndex) }
          : row
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {placeholderGroups && placeholderGroups.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Skupiny s placeholdery:</p>
          <ul className="list-disc pl-4">
            {placeholderGroups.map((g: Group) => (
              <li key={g.id}>
                {g.name} {g.phase && <span>({g.phase})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="border border-muted rounded-xl p-4 bg-gray-50 flex flex-col gap-4"
        >
          <Label className="text-sm font-semibold">Název fáze:</Label>
          <div
            className="flex
            items-center gap-2 mb-2"
          >
            <Input
              value={row.name}
              onChange={(e) => updateRowName(rowIndex, e.target.value)}
              className="w-fit bg-primary/10 font-semibold"
            />
            <Button
              onClick={() => resolveRealTeamsForRow(rowIndex)}
              disabled={
                row.groups?.length === 0 ||
                isPending ||
                row.groups.some((g) => g.teams.length === 0) ||
                row.groups.some((g) =>
                  g.teams.some(
                    (t) => t.type === "placeholder" && !t.group && !t.position
                  )
                )
              }
            >
              Přiřadit reálné týmy
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeRow(rowIndex)}
              title="Odstranit fázi"
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            {Array.isArray(row.groups) &&
              row.groups.map((group, groupIndex) => (
                <Card
                  key={groupIndex}
                  className="w-full sm:w-64 border border-primary shadow-sm"
                >
                  <CardHeader className="p-0 flex items-center justify-between">
                    <Input
                      value={group.name}
                      onChange={(e) =>
                        updateGroupName(rowIndex, groupIndex, e.target.value)
                      }
                      className="text-lg font-semibold p-4 border-0"
                    />
                    {/* Nové pole pro finální umístění */}
                    <div className="flex items-center gap-2 pr-4">
                      <Label
                        htmlFor={`final-${rowIndex}-${groupIndex}`}
                        className="text-sm"
                      >
                        o místo
                      </Label>
                      <Input
                        id={`final-${rowIndex}-${groupIndex}`}
                        type="number"
                        min={1}
                        placeholder="–"
                        value={group.finalGroup ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRows((prev) =>
                            prev.map((r, ri) =>
                              ri !== rowIndex
                                ? r
                                : {
                                    ...r,
                                    groups: r.groups.map((g, gi) =>
                                      gi !== groupIndex
                                        ? g
                                        : {
                                            ...g,
                                            finalGroup: val
                                              ? parseInt(val, 10)
                                              : undefined,
                                          }
                                    ),
                                  }
                            )
                          );
                        }}
                        className="w-12"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {Array.isArray(group.teams) &&
                      group.teams.map((team, teamIndex) => (
                        <div
                          key={teamIndex}
                          className="flex items-center gap-2"
                        >
                          {team.type === "placeholder" ? (
                            <>
                              <Select
                                value={team.group}
                                onValueChange={(val) =>
                                  updateTeamPlaceholder(
                                    rowIndex,
                                    groupIndex,
                                    teamIndex,
                                    val,
                                    team.position
                                  )
                                }
                              >
                                <SelectTrigger className="w-16">
                                  <SelectValue placeholder="Sk." />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_GROUPS.map((g) => (
                                    <SelectItem key={g} value={g}>
                                      {g}
                                      {LOCAL_GROUPS.includes(g) &&
                                        !BACKEND_GROUPS.includes(g)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                min={1}
                                max={4}
                                value={team.position}
                                onChange={(e) =>
                                  updateTeamPlaceholder(
                                    rowIndex,
                                    groupIndex,
                                    teamIndex,
                                    team.group,
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-12"
                              />
                              <span className="text-muted-foreground text-sm">
                                . místo
                              </span>
                            </>
                          ) : (
                            <Select
                              value={team.id?.toString() || ""}
                              onValueChange={(value) => {
                                const selected = allTeams.find(
                                  (t) => t.id.toString() === value
                                );
                                if (!selected) return;
                                updateResolvedTeam(
                                  rowIndex,
                                  groupIndex,
                                  teamIndex,
                                  selected
                                );
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Vyber tým" />
                              </SelectTrigger>
                              <SelectContent>
                                {allTeams.map((team) => (
                                  <SelectItem
                                    key={team.id}
                                    value={team.id.toString()}
                                  >
                                    {team.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      ))}
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => addTeamToGroup(rowIndex, groupIndex)}
                        className="mt-2 text-xs w-fit"
                      >
                        Přidat tým <Plus />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeGroup(rowIndex, groupIndex)}
                        title="Odstranit skupinu"
                        className="mt-2"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

            <Button onClick={() => addGroupToRow(rowIndex)}>
              Přidat skupinu <Plus />
            </Button>
          </div>
        </div>
      ))}
      <Button onClick={addRow} className="w-fit">
        Přidat fázi <Plus />
      </Button>
      <Button
        onClick={handleSave}
        disabled={isPending}
        className="mt-4 bg-green-500 hover:bg-green-600 w-fit"
      >
        {isPending ? "Ukládám..." : "Uložit pavouka"}
      </Button>
    </div>
  );
};
