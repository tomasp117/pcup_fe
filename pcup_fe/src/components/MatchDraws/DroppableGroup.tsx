import { useDrop } from "react-dnd";
import { useEffect, useRef } from "react";
import { TeamDraw, Group } from "../../pages/Draws";
import { DraggableTeam } from "./DraggableTeam";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "../ui/card";

export const DroppableGroup = ({
    group,
    moveTeam,
    moveBack,
    removeTeamFromGroup,
}: {
    group: Group;
    moveTeam?: (team: TeamDraw, groupId: number) => void;
    moveBack?: (team: TeamDraw) => void;
    removeTeamFromGroup?: (teamId: number, fromGroup: number | null) => void;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: "TEAM",
        drop: (item: TeamDraw & { fromGroup: number | string | null }) => {
            if (!group.id) {
                console.warn("⚠️ Skupina nemá platné ID:", group);
                return;
            }

            if (item.fromGroup === group.id) return;

            console.log("🟢 PŘETAŽENO:", item);

            if (item.fromGroup !== null && item.fromGroup !== group.id) {
                removeTeamFromGroup?.(
                    item.id,
                    typeof item.fromGroup === "string"
                        ? parseInt(item.fromGroup, 10)
                        : item.fromGroup
                );
            }

            moveTeam?.(item, group.id);
        },
    });

    useEffect(() => {
        if (cardRef.current) {
            drop(cardRef.current);
        }
    }, [drop]);

    return (
        <Card ref={cardRef} className="h-auto">
            <CardHeader>
                <h3 className="font-bold">{group.name ?? "Neznámá skupina"}</h3>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-primary/10">
                        <TableRow>
                            <TableHead>Tým</TableHead>
                            <TableHead className="text-center">
                                Koeficient
                            </TableHead>
                            <TableHead className="text-center">Dívky</TableHead>
                            <TableHead className="text-center">Akce</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {group.teams && group.teams.length > 0 ? (
                            group.teams.map((team) => (
                                <DraggableTeam
                                    key={team.id}
                                    team={team}
                                    groupId={group.id}
                                    handleChange={() => {}}
                                    removeFromGroup={() => moveBack?.(team)}
                                    isDraggable={
                                        !!moveTeam &&
                                        !!moveBack &&
                                        !!removeTeamFromGroup
                                    }
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center text-gray-500"
                                >
                                    Skupina je prázdná
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
