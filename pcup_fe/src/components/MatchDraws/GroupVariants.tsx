// components/MatchDraws/GroupVariants.tsx
import { Button } from "@/components/ui/button";
import { DroppableGroup } from "./DroppableGroup";
import { Group, GroupVariant, TeamDraw } from "@/pages/Draws";

interface GroupVariantsProps {
  groups: Group[];
  groupVariants: GroupVariant[];
  selectedVariant: GroupVariant | null;
  expandedVariant: number | null;
  onToggle: (index: number) => void;
  onSelect: (variant: GroupVariant) => void;
  onResetSelection: () => void;
  onSave: () => void;
  moveTeam: (team: TeamDraw, groupId: number) => void;
  moveBack: (team: TeamDraw) => void;
  removeTeamFromGroup: (teamId: number, fromGroup: number | null) => void;
}

export const GroupVariants = ({
  groups,
  groupVariants,
  selectedVariant,
  expandedVariant,
  onToggle,
  onSelect,
  onResetSelection,
  onSave,
  moveTeam,
  moveBack,
  removeTeamFromGroup,
}: GroupVariantsProps) => {
  return (
    <div className="w-full sm:w-1/2 flex flex-col gap-4 shadow-lg p-4">
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
              moveTeam={moveTeam}
              moveBack={moveBack}
              removeTeamFromGroup={removeTeamFromGroup}
            />
          ))}
          <div className="flex justify-between items-center">
            <Button className="mt-4" onClick={onResetSelection}>
              Zpět k výběru variant
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
          </div>
        </div>
      ) : (
        groupVariants.map((variant, index) => (
          <div key={index} className="border p-4 rounded-lg shadow-md">
            <h3
              className="text-lg font-bold cursor-pointer"
              onClick={() => onToggle(index)}
            >
              Varianta {index + 1} ({variant.groupCount} skupin)
            </h3>
            <p>
              Celkem zápasů: {variant.totalMatches} ( Minimálně{" "}
              {variant.minMatchesPerTeam} na tým)
            </p>

            {expandedVariant === index &&
              variant.groups.map((group, i) => (
                <DroppableGroup
                  key={group.id ?? `new-group-${i}`}
                  group={group}
                  moveTeam={moveTeam}
                  moveBack={moveBack}
                  removeTeamFromGroup={removeTeamFromGroup}
                />
              ))}

            <Button onClick={() => onSelect(variant)} className="mt-2">
              Vybrat tuto variantu
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
