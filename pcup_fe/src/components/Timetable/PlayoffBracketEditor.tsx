import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { BracketRow } from "@/interfaces/BracketEditor/IBracketRow";
import { useTeamsByCategory } from "@/hooks/useTeams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSaveBracket } from "@/hooks/useGroups";
import { toast } from "react-toastify";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PlayoffBracketEditorPlaceholder } from "./PlayoffBracketEditorPlaceholder";

interface PlayoffBracketEditorProps {
  categoryId: number | null;
}

export const PlayoffBracketEditor = ({
  categoryId,
}: PlayoffBracketEditorProps) => {
  const [bracket, setBracket] = useState<BracketRow[]>([]);

  const { data: teams } = useTeamsByCategory(categoryId || 0);

  const { mutate: saveBracket, isPending: isSaving } = useSaveBracket(
    categoryId || 0
  );

  const addRow = () => {
    setBracket((prev) => [
      ...prev,
      { name: `Nová fáze ${prev.length + 1}`, groups: [] },
    ]);
  };

  const addGroupToRow = (rowIndex: number) => {
    setBracket((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: [
                ...row.groups,
                {
                  id: null,
                  name: `Skupina ${row.groups.length + 1}`,
                  phase: row.name,
                  teams: [],
                },
              ],
            }
          : row
      )
    );
  };

  const updateRowName = (index: number, name: string) => {
    setBracket((prev) =>
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

  const updateGroupName = (
    rowIndex: number,
    groupIndex: number,
    name: string
  ) => {
    setBracket((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((group, j) =>
                j === groupIndex ? { ...group, name } : group
              ),
            }
          : row
      )
    );
  };

  const addTeamToGroup = (rowIndex: number, groupIndex: number) => {
    setBracket((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((group, j) =>
                j === groupIndex
                  ? {
                      ...group,
                      teams: [...group.teams, { id: null, name: "" }],
                    }
                  : group
              ),
            }
          : row
      )
    );
  };

  const updateTeamInGroup = (
    rowIndex: number,
    groupIndex: number,
    teamIndex: number,
    selectedTeamId: string
  ) => {
    const selectedTeam = teams?.find((t) => t.id.toString() === selectedTeamId);
    if (!selectedTeam) return;

    setBracket((prev) =>
      prev.map((row, i) =>
        i === rowIndex
          ? {
              ...row,
              groups: row.groups.map((group, j) =>
                j === groupIndex
                  ? {
                      ...group,
                      teams: group.teams.map((team, k) =>
                        k === teamIndex
                          ? { id: selectedTeam.id, name: selectedTeam.name }
                          : team
                      ),
                    }
                  : group
              ),
            }
          : row
      )
    );
  };

  const validateBracket = (bracket: BracketRow[]): string | null => {
    for (const row of bracket) {
      if (!row.name.trim()) return "Každá fáze musí mít název.";

      for (const group of row.groups) {
        if (!group.name.trim()) return "Každá skupina musí mít název.";
        if (!group.phase.trim())
          return "Každá skupina musí mít přiřazenou fázi.";

        if (group.teams.length === 0)
          return `Skupina "${group.name}" neobsahuje žádné týmy.`;

        for (const team of group.teams) {
          if (!team.id)
            return `Skupina "${group.name}" obsahuje tým bez výběru.`;
        }
      }
    }

    return null; // všechno OK
  };

  return (
    <div className="flex flex-col gap-6 mb-16">
      <h2 className="text-2xl font-bold">Editor pavouka</h2>

      <Tabs defaultValue="manual">
        <TabsList>
          <TabsTrigger value="manual" className="hover:bg-primary/10">
            Ruční výběr týmů
          </TabsTrigger>
          <TabsTrigger value="ranking" className="hover:bg-primary/10">
            Podle pořadí ve skupinách
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          <div className="flex flex-col gap-6">
            {bracket.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex flex-col gap-4 border border-muted rounded-xl p-4 bg-gray-50"
              >
                <Label className="text-sm font-semibold">Název fáze:</Label>
                <Input
                  value={row.name}
                  onChange={(e) => updateRowName(rowIndex, e.target.value)}
                  className="w-fit bg-primary/10 font-semibold"
                />
                <div className="flex flex-wrap gap-4">
                  {row.groups.map((group, groupIndex) => (
                    <Card
                      key={groupIndex}
                      className="w-full sm:w-64 border border-primary shadow-sm"
                    >
                      <CardHeader className="p-0">
                        <Input
                          value={group.name}
                          onChange={(e) =>
                            updateGroupName(
                              rowIndex,
                              groupIndex,
                              e.target.value
                            )
                          }
                          className="text-lg font-semibold p-4 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2">
                        {group.teams.map((team, teamIndex) => (
                          <Select
                            key={teamIndex}
                            value={team.id?.toString() || ""}
                            onValueChange={(value) =>
                              updateTeamInGroup(
                                rowIndex,
                                groupIndex,
                                teamIndex,
                                value
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Vyber tým" />
                            </SelectTrigger>
                            <SelectContent>
                              {teams?.map((team) => (
                                <SelectItem
                                  key={team.id}
                                  value={team.id.toString()}
                                >
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ))}
                        <div className="flex justify-between items-center">
                          <Button
                            onClick={() => addTeamToGroup(rowIndex, groupIndex)}
                            className="mt-2 text-xs w-fit"
                          >
                            Přidat tým <Plus />
                          </Button>
                          <Button
                            onClick={() => {
                              setBracket((prev) =>
                                prev.map((r, i) =>
                                  i === rowIndex
                                    ? {
                                        ...r,
                                        groups: r.groups.filter(
                                          (_, j) => j !== groupIndex
                                        ),
                                      }
                                    : r
                                )
                              );
                            }}
                            className="mt-2 bg-red-500 hover:bg-red-600 text-xs w-fit"
                          >
                            <Trash2 className="" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-between items-center w-full">
                    <Button
                      onClick={() => addGroupToRow(rowIndex)}
                      className="w-fit mt-2"
                    >
                      Přidat skupinu <Plus className="ml-1" />
                    </Button>
                    <Button
                      onClick={() => {
                        setBracket((prev) =>
                          prev.filter((_, i) => i !== rowIndex)
                        );
                      }}
                      className="w-fit mt-2 bg-red-500 hover:bg-red-600"
                    >
                      Odstranit fázi
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Button onClick={addRow} className="w-fit">
              Přidat fázi <Plus />
            </Button>
            <Button
              onClick={() => {
                const error = validateBracket(bracket);
                if (error) {
                  toast.error(error);
                  return;
                }

                const flattenedGroups = bracket.flatMap((row) =>
                  row.groups.map((group) => ({
                    ...group,
                    phase: row.name,
                  }))
                );

                saveBracket(flattenedGroups);
              }}
              disabled={isSaving}
              className="mt-4 w-fit bg-green-500 hover:bg-green-600 "
            >
              Uložit pavouka
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ranking">
          <PlayoffBracketEditorPlaceholder categoryId={categoryId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
