import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { useState } from "react";
import { useAddSlot, useDeleteSlot, useSlots } from "@/hooks/useSlots";
import { Loader2, Trash2 } from "lucide-react";

interface SlotManagerProps {
  edition: number;
  courts: string[];
}

export const SlotManager = ({ edition, courts }: SlotManagerProps) => {
  const [open, setOpen] = useState(false);
  const { data: slots = [], isLoading, error } = useSlots(edition);
  const addSlot = useAddSlot(edition);
  const deleteSlot = useDeleteSlot();
  const [newTime, setNewTime] = useState("");
  const [newCourt, setNewCourt] = useState("");

  const [filterCourt, setFilterCourt] = useState<string>("");

  const courtOptions = ["", ...courts];

  const sortedSlots = [...slots].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  const filteredSlots = sortedSlots.filter((slot) =>
    filterCourt ? slot.playground === filterCourt : true
  );

  const handleAdd = () => {
    if (!newTime || !newCourt) return;
    addSlot.mutate({ time: newTime, playground: newCourt });
    setNewTime("");
    setNewCourt("");
  };

  const handleDelete = (id: number) => {
    deleteSlot.mutate(id);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondaryOutline">Správa slotů</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg bg-white over">
        <DialogTitle>Správa časových slotů</DialogTitle>
        <DialogDescription>
          Zde můžete mazat existující sloty nebo přidávat nové termíny zápasů.
        </DialogDescription>

        {isLoading && (
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        )}
        {error && <p className="text-red-500">{(error as Error).message}</p>}

        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm">Filtr hřiště:</label>
          <select
            className="border rounded px-2 py-1"
            value={filterCourt}
            onChange={(e) => setFilterCourt(e.target.value)}
          >
            {courtOptions.map((c) => (
              <option key={c} value={c}>
                {c || "Všechna hřiště"}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Čas</TableHead>
                <TableHead>Hřiště</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSlots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{new Date(slot.time).toLocaleString()}</TableCell>
                  <TableCell>{slot.playground}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex gap-2 mt-4">
          <Input
            type="datetime-local"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <Select value={newCourt} onValueChange={setNewCourt}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Vyber hřiště" />
            </SelectTrigger>
            <SelectContent>
              {courts.map((court) => (
                <SelectItem key={court} value={court}>
                  {court}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd}>Přidat</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
