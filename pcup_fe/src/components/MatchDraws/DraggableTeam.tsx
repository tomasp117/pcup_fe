import { useDrag } from "react-dnd";
import { useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { TableCell, TableRow } from "@/components/ui/table";
import { TeamDraw } from "../../pages/Draws";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const DraggableTeam = ({
  team,
  groupId,
  handleChange,
  removeFromGroup,
  isDraggable,
}: {
  team: TeamDraw;
  groupId?: number;
  handleChange: (
    id: number,
    field: "strength" | "isGirls",
    value: number | boolean
  ) => void;
  removeFromGroup?: (team: TeamDraw) => void;
  isDraggable: boolean;
}) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const dragHandleRef = useRef<HTMLSpanElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "TEAM",
      item: {
        ...team, // ✅ Posíláme AKTUÁLNÍ hodnoty týmu
        fromGroup: groupId ?? null,
      },
      canDrag: isDraggable,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [team, isDraggable]
  );

  useEffect(() => {
    if (rowRef.current) {
      preview(rowRef.current);
    }
    if (dragHandleRef.current) {
      drag(dragHandleRef.current);
    }
  }, [drag, preview]);

  return (
    <TableRow
      ref={rowRef}
      className={`border-b ${isDragging ? "opacity-50" : ""}  ${
        isDraggable ? "hover:bg-primary/10" : "opacity-50 cursor-not-allowed"
      }`}
    >
      <TableCell className="p-2">
        <span
          ref={isDraggable ? dragHandleRef : undefined}
          className={`${
            isDraggable ? "cursor-grab" : "cursor-not-allowed text-gray-400"
          }`}
        >
          {team.name}
        </span>
      </TableCell>

      <TableCell className="text-center">
        <Slider
          min={1}
          max={5}
          step={1}
          value={[team.strength]}
          onValueChange={(value) => handleChange(team.id, "strength", value[0])}
          disabled={team.isGirls || groupId !== undefined}
        />
        <Input
          type="number"
          className=""
          value={team.strength}
          onChange={(e) =>
            handleChange(team.id, "strength", Number(e.target.value))
          }
          disabled={team.isGirls || groupId !== undefined}
        />
      </TableCell>

      <TableCell className="text-center">
        <input
          type="checkbox"
          checked={team.isGirls}
          onChange={(e) => handleChange(team.id, "isGirls", e.target.checked)}
          disabled={groupId !== undefined || team.strength !== 1}
        />
      </TableCell>

      {groupId !== undefined && (
        <TableCell className="text-center">
          <Button
            variant={"destructive"}
            onClick={() => removeFromGroup?.(team)}
            className="px-2 py-1 text-xs rounded"
          >
            Odebrat
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};
