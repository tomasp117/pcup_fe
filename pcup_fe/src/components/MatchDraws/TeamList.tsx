// components/MatchDraws/TeamList.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DraggableTeam } from "./DraggableTeam";
import { TeamDraw } from "@/interfaces/Draws/TeamDraw";
import { GroupVariant } from "@/interfaces/Draws/GroupVariant";

interface TeamListProps {
  teams: TeamDraw[];
  isLoading: boolean;
  errorMessage: string | null;
  groupVariants: GroupVariant[];
  selectedVariant: GroupVariant | null;
  hasTeamsInGroups: boolean;
  onAutoAssign: () => void;
  onBackToManual: () => void;
  onChange: (
    id: number,
    field: "strength" | "isGirls",
    value: number | boolean
  ) => void;
}

export const TeamList = ({
  teams,
  isLoading,
  errorMessage,
  groupVariants,
  selectedVariant,
  hasTeamsInGroups,
  onAutoAssign,
  onBackToManual,
  onChange,
}: TeamListProps) => {
  return (
    <div className="w-full sm:w-1/2 shadow-lg p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Seznam týmů</h2>
        {groupVariants.length === 0 ? (
          <Button
            onClick={onAutoAssign}
            className="bg-blue-500 text-white px-4 py-2 whitespace-normal"
            disabled={selectedVariant !== null || hasTeamsInGroups}
          >
            {hasTeamsInGroups
              ? "Vyčistěte skupiny"
              : "Automaticky rozdělit týmy"}
          </Button>
        ) : (
          <Button
            onClick={onBackToManual}
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
            {teams.map((team) => (
              <DraggableTeam
                key={team.id}
                team={team}
                handleChange={onChange}
                isDraggable={
                  groupVariants.length === 0 || selectedVariant !== null
                }
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
