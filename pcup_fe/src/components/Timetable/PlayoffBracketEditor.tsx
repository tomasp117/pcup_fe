import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { BracketRow } from "@/interfaces/BracketEditor/IBracketRow";

export const PlayoffBracketEditor = () => {
  const [bracket, setBracket] = useState<BracketRow[]>([]);

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
                  name: `Skupina ${row.groups.length + 1}`,
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
      prev.map((row, i) => (i === index ? { ...row, name } : row))
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
                      teams: group.teams.some(
                        (t) => t.name === `Tým ${group.teams.length + 1}`
                      )
                        ? group.teams
                        : [
                            ...group.teams,
                            { name: `Tým ${group.teams.length + 1}` },
                          ],
                    }
                  : group
              ),
            }
          : row
      )
    );
  };

  const updateTeamName = (
    rowIndex: number,
    groupIndex: number,
    teamIndex: number,
    name: string
  ) => {
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
                        k === teamIndex ? { ...team, name } : team
                      ),
                    }
                  : group
              ),
            }
          : row
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 mb-16">
      <h2 className="text-2xl font-bold">Editor pavouka</h2>

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
                        updateGroupName(rowIndex, groupIndex, e.target.value)
                      }
                      className="text-lg font-semibold p-4 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2">
                    {group.teams.map((team, teamIndex) => (
                      <Input
                        key={teamIndex}
                        value={team.name}
                        onChange={(e) =>
                          updateTeamName(
                            rowIndex,
                            groupIndex,
                            teamIndex,
                            e.target.value
                          )
                        }
                        placeholder={`Tým ${teamIndex + 1}`}
                        className="text-sm"
                      />
                    ))}
                    <Button
                      onClick={() => addTeamToGroup(rowIndex, groupIndex)}
                      className="mt-2 text-xs w-fit"
                    >
                      <Plus />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addGroupToRow(rowIndex)}>
                Přidat skupinu <Plus />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addRow} className="w-fit">
        Přidat fázi <Plus />
      </Button>
    </div>
  );
};
