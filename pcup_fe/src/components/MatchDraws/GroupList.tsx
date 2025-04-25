// components/MatchDraws/GroupList.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { DroppableGroup } from "./DroppableGroup";
import { Group } from "@/interfaces/Draws/Group";
import { TeamDraw } from "@/interfaces/Draws/TeamDraw";

interface GroupListProps {
  groups: Group[];
  onUpdateCount: (newCount: number) => void;
  onReset: () => void;
  onSave: () => void;
  moveTeam: (team: TeamDraw, groupId: number) => void;
  moveBack: (team: TeamDraw) => void;
  removeTeamFromGroup: (teamId: number, fromGroup: number | null) => void;
}

export const GroupList = ({
  groups,
  onUpdateCount,
  onReset,
  onSave,
  moveTeam,
  moveBack,
  removeTeamFromGroup,
}: GroupListProps) => {
  return (
    <div className="w-full sm:w-2/3 flex flex-col gap-4 shadow-lg p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Skupiny</h2>
        <div className="flex gap-4 items-center">
          <Button onClick={onReset} variant="destructive">
            Vyčistit týmy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
        {groups.map((group, index) => {
          const isLastOdd =
            groups.length % 2 === 1 && index === groups.length - 1;

          return (
            <div
              key={group.id ?? `${index}`}
              className={isLastOdd ? "md:col-span-2" : ""}
            >
              <DroppableGroup
                group={group}
                moveTeam={moveTeam}
                moveBack={moveBack}
                removeTeamFromGroup={removeTeamFromGroup}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center">
        <Button
          onClick={() => onUpdateCount(groups.length - 1)}
          disabled={groups.length <= 1}
          className="p-2"
        >
          <Minus />
        </Button>
        <Button
          className="mt-4"
          onClick={onSave}
          disabled={
            groups.length === 0 || groups.every((g) => g.teams.length === 0)
          }
        >
          Uložit skupiny
        </Button>
        <Input
          type="number"
          min={1}
          max={5}
          value={groups.length}
          onChange={(e) => onUpdateCount(Number(e.target.value))}
          className="text-center shadow-lg p-2 hidden"
        />
        <Button
          onClick={() => onUpdateCount(groups.length + 1)}
          disabled={groups.length >= 5}
          className="p-2"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};
