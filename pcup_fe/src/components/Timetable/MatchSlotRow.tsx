import { TableRow, TableCell } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { use, useEffect } from "react";
import { MatchDTO } from "@/interfaces/Timetable/MatchDTO";
import { UnassignedMatch } from "@/interfaces/Timetable/UnassignedMatch";
import React from "react";
import { Input } from "../ui/input";

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
  onSequenceChange: (matchId: number, sequenceNumber: number | null) => void;
  style?: React.CSSProperties;
  onSwap: (matchId: number) => void;
  className?: string;
  category?: string;
}

export const MatchSlotRow = React.memo<MatchSlotRowProps>(
  ({
    match,
    unassignedMatches,
    onAssign,
    onSwap,
    onSequenceChange,
    category,
    style,
    className,
  }) => {
    const isUnassigned = !match.homeTeam || !match.awayTeam;
    const selectedValue = isUnassigned
      ? "__placeholder__"
      : `${match.homeTeam?.id ?? 0}-${match.awayTeam?.id ?? 0}`;
    const isUn = !match.homeTeam || !match.awayTeam;
    return (
      <TableRow style={style} className={className}>
        {/* 1) Pořadové číslo */}
        <TableCell className="w-[60px] text-center">
          <Input
            type="number"
            value={match.sequenceNumber ?? ""}
            onChange={(e) => {
              const num =
                e.target.value === "" ? null : parseInt(e.target.value, 10);
              onSequenceChange(match.id, num);
            }}
            className="w-full text-center"
          />
        </TableCell>
        <TableCell className="w-[120px]">
          {new Date(match.time).toLocaleString("cs-CZ", {
            weekday: "short",
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </TableCell>
        <TableCell className="w-[200px]">{match.playground}</TableCell>
        <TableCell>
          <Select
            value={selectedValue}
            // onValueChange={(val) => {
            //   if (val === "__unassign") {
            //     // při zrušení pošli placeholder groupName/groupId
            //     onAssign(match.id, 0, 0, "", 0);
            //     return;
            //   }

            //   const [homeIdStr, awayIdStr] = val.split("-");
            //   const homeId = parseInt(homeIdStr);
            //   const awayId = parseInt(awayIdStr);

            //   if (!isNaN(homeId) && !isNaN(awayId)) {
            //     const foundMatch = unassignedMatches.find(
            //       (m) => m.homeTeamId === homeId && m.awayTeamId === awayId
            //     );

            //     const groupName = foundMatch?.groupName ?? "";
            //     const groupId = foundMatch?.groupId ?? 0;

            //     onAssign(match.id, homeId, awayId, groupName, groupId);
            //   }
            // }
            onValueChange={(val) => {
              // 1) zrušení přiřazení
              if (val === "__unassign") {
                onAssign(match.id, 0, 0, "", 0);
                return;
              }
              // 2) prohození domácí/hosty
              if (val === "__swap" && match.homeTeam && match.awayTeam) {
                onSwap(match.id);
                return;
              }
              // 3) standardní přiřazení
              const [homeIdStr, awayIdStr] = val.split("-");
              const homeId = parseInt(homeIdStr, 10);
              const awayId = parseInt(awayIdStr, 10);
              if (!isNaN(homeId) && !isNaN(awayId)) {
                const found = unassignedMatches.find(
                  (m) => m.homeTeamId === homeId && m.awayTeamId === awayId
                );
                onAssign(
                  match.id,
                  homeId,
                  awayId,
                  found?.groupName ?? "",
                  found?.groupId ?? 0
                );
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

              {/* Prohození domácí/hosty */}
              {!isUnassigned && match.homeTeam && match.awayTeam && (
                <SelectItem value="__swap">
                  <em className="text-sm">Prohodit domácí/hosty</em>
                </SelectItem>
              )}

              {/* Vždy zobrazit aktuálně přiřazený zápas, pokud existuje */}
              {!isUnassigned && match.homeTeam && match.awayTeam && (
                <SelectItem value={`${match.homeTeam.id}-${match.awayTeam.id}`}>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">
                      {match.group.categoryName === ""
                        ? category
                        : match.group.categoryName}
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
  }
);
