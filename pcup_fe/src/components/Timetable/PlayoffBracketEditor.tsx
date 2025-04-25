import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface Team {
  name: string;
}

interface Group {
  name: string;
  teams: Team[];
}

interface BracketRow {
  name: string;
  groups: Group[];
}

export const PlayoffBracketEditor = () => {
  const [bracket, setBracket] = useState<BracketRow[]>([]);

  const addRow = () => {
    setBracket((prev) => [
      ...prev,
      { name: `Nová fáze ${prev.length + 1}`, groups: [] },
    ]);
  };

  const addGroupToRow = (rowIndex: number) => {
    setBracket((prev) => {
      const updated = [...prev];
      updated[rowIndex].groups.push({
        name: `Skupina ${updated[rowIndex].groups.length + 1}`,
        teams: [],
      });
      return updated;
    });
  };

  const updateRowName = (index: number, name: string) => {
    setBracket((prev) => {
      const updated = [...prev];
      updated[index].name = name;
      return updated;
    });
  };

  const updateGroupName = (
    rowIndex: number,
    groupIndex: number,
    name: string
  ) => {
    setBracket((prev) => {
      const updated = [...prev];
      updated[rowIndex].groups[groupIndex].name = name;
      return updated;
    });
  };

  const addTeamToGroup = (rowIndex: number, groupIndex: number) => {
    console.log("Adding team to group", rowIndex, groupIndex);
    setBracket((prev) => {
      const updated = [...prev];
      const existing = updated[rowIndex].groups[groupIndex].teams;

      const group = updated[rowIndex].groups[groupIndex];

      const newTeamNumber = group.teams.length + 1;
      const newTeamName = `Tým ${newTeamNumber}`;

      const alreadyExists = group.teams.some((t) => t.name === newTeamName);
      if (alreadyExists) return prev;

      group.teams.push({ name: newTeamName });
      return updated;
    });
  };

  const updateTeamName = (
    rowIndex: number,
    groupIndex: number,
    teamIndex: number,
    name: string
  ) => {
    setBracket((prev) => {
      const updated = [...prev];
      updated[rowIndex].groups[groupIndex].teams[teamIndex].name = name;
      return updated;
    });
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
                      <Plus className="" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={() => addGroupToRow(rowIndex)}>
                Přidat skupinu <Plus className="" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addRow} className="w-fit">
        Přidat fázi <Plus className="" />
      </Button>
    </div>
  );
};
