import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Group } from "@/interfaces/BracketEditor/IGroup";

interface PlayoffVisualizerProps {
  groups: Group[];
}

const PHASE_ORDER = ["QF", "SF", "F", "F3"];

export const PlayoffVisualizer: React.FC<PlayoffVisualizerProps> = ({
  groups,
}) => {
  const orderedPhases = PHASE_ORDER.filter((phase) =>
    groups.some((g) => g.phase === phase)
  );

  return (
    <div className="flex flex-row gap-16 overflow-auto p-8">
      {orderedPhases.map((phase) => (
        <div key={phase} className="flex flex-col items-center gap-4">
          <h3 className="font-semibold text-lg">{phase}</h3>
          {groups
            .filter((g) => g.phase === phase)
            .map((group) => (
              <MatchCard key={group.name} group={group} />
            ))}
        </div>
      ))}
    </div>
  );
};

const MatchCard = ({ group }: { group: Group }) => {
  return (
    <Card className="w-48 text-center">
      <CardContent className="py-4 px-2">
        <div className="font-bold text-sm mb-2">{group.name}</div>
        <div className="flex flex-col gap-1">
          {group.teams.map((team, idx) => (
            <div
              key={idx}
              className="border rounded px-2 py-1 text-xs bg-muted"
            >
              {team.name || "?"}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
