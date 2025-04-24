import { MatchDTO, UnassignedMatch } from "@/pages/TimeTable";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { use, useEffect } from "react";

interface MatchSlotRowProps {
  match: MatchDTO;
  unassignedMatches: UnassignedMatch[];
  onAssign: (
    matchId: number,
    homeTeamId: number,
    awayTeamId: number,
    groupName: string,
    groupId: number
  ) => void;
}

export const MatchSlotRow = ({
  match,
  unassignedMatches,
  onAssign,
}: MatchSlotRowProps) => {
  const isUnassigned = !match.homeTeam || !match.awayTeam;
  const selectedValue = isUnassigned
    ? "__placeholder__"
    : `${match.homeTeam?.id ?? 0}-${match.awayTeam?.id ?? 0}`;
  return (
    <TableRow className={isUnassigned ? "bg-muted" : ""}>
      <TableCell>
        {new Date(match.time).toLocaleString("cs-CZ", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell>{match.playground}</TableCell>
      <TableCell>
        <Select
          value={selectedValue}
          onValueChange={(val) => {
            if (val === "__unassign") {
              // při zrušení pošli placeholder groupName/groupId
              onAssign(match.id, 0, 0, "", 0);
              return;
            }

            const [homeIdStr, awayIdStr] = val.split("-");
            const homeId = parseInt(homeIdStr);
            const awayId = parseInt(awayIdStr);

            if (!isNaN(homeId) && !isNaN(awayId)) {
              const foundMatch = unassignedMatches.find(
                (m) => m.homeTeamId === homeId && m.awayTeamId === awayId
              );

              const groupName = foundMatch?.groupName ?? "";
              const groupId = foundMatch?.groupId ?? 0;

              onAssign(match.id, homeId, awayId, groupName, groupId);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Vyber zápas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem disabled value="__placeholder__">
              Vyber zápas
            </SelectItem>

            {/* Možnost zrušit přiřazení */}
            {!isUnassigned && (
              <SelectItem value="__unassign">
                <em className="text-muted-foreground">Zrušit přiřazení</em>
              </SelectItem>
            )}

            {/* Vždy zobrazit aktuálně přiřazený zápas, pokud existuje */}
            {!isUnassigned && match.homeTeam && match.awayTeam && (
              <SelectItem value={`${match.homeTeam.id}-${match.awayTeam.id}`}>
                <div className="flex flex-col items-start">
                  <span className="text-xs">
                    {match.group.categoryName}
                    {": "}
                    {match.group?.name ?? "Bez skupiny"}
                  </span>
                  <div className="flex gap-2">
                    <span className="font-medium">{match.homeTeam.name}</span>
                    <span className="">vs</span>
                    <span className="font-medium">{match.awayTeam.name}</span>
                  </div>
                </div>
              </SelectItem>
            )}

            {/* Zbytek nepřiřazených zápasů */}
            {unassignedMatches.map((m, index) => (
              <SelectItem
                key={`${m.homeTeamId}-${m.awayTeamId}-${index}`}
                value={`${m.homeTeamId}-${m.awayTeamId}`}
                className="flex flex-col items-start"
              >
                <span className="text-xs text-muted-foreground">
                  {m.groupName}
                </span>
                <div className="flex gap-2">
                  <span className="font-medium">{m.homeTeamName}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="font-medium">{m.awayTeamName}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
};
