import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useMyTeam } from "@/hooks/MyTeam/useMyTeam";
import {
  useAddPlayer,
  useAssignPlayerToTeam,
  useDeletePlayer,
  useFreePlayers,
  useRemoveFromTeam,
  useUpdatePlayer,
} from "@/hooks/MyTeam/usePlayers";
import { Trash2, Pencil, Save, X, Plus, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export const MyTeam = () => {
  const { data: team, isLoading, error } = useMyTeam();
  const { mutate: deletePlayer, isPending: isDeleting } = useDeletePlayer();
  const { mutate: updatePlayer, isPending: isUpdating } = useUpdatePlayer();
  const { mutate: addPlayer, isPending: isAdding } = useAddPlayer();

  const [editPlayerId, setEditPlayerId] = useState<number | null>(null);
  const [editedPlayer, setEditedPlayer] = useState({
    firstName: "",
    lastName: "",
    number: 0,
  });

  const [addingNew, setAddingNew] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    firstName: "",
    lastName: "",
    number: 0,
  });

  const handleEditClick = (player: any) => {
    setEditPlayerId(player.id);
    setEditedPlayer({
      firstName: player.person.firstName,
      lastName: player.person.lastName,
      number: player.number,
    });
  };

  const handleSaveClick = (playerId: number) => {
    if (!team) return;

    const currentPlayer = team.players.find((p) => p.id === playerId);
    if (!currentPlayer) return;

    const isDuplicate = team.players.some(
      (p) => p.id !== playerId && p.number === editedPlayer.number
    );
    if (isDuplicate) {
      toast.warning(
        "Hráč s tímto číslem dresu už existuje. Číslo bylo nastaveno na 0."
      );
    }

    const numberToUse = isDuplicate ? 0 : editedPlayer.number;

    updatePlayer({
      id: currentPlayer.id,
      number: numberToUse,
      goalCount: currentPlayer.goalCount,
      sevenMeterGoalCount: currentPlayer.sevenMeterGoalCount,
      sevenMeterMissCount: currentPlayer.sevenMeterMissCount,
      twoMinPenaltyCount: currentPlayer.twoMinPenaltyCount,
      yellowCardCount: currentPlayer.yellowCardCount,
      redCardCount: currentPlayer.redCardCount,
      teamId: currentPlayer.teamId,
      categoryId: currentPlayer.categoryId,
      person: {
        id: currentPlayer.person.id,
        firstName: editedPlayer.firstName,
        lastName: editedPlayer.lastName,
        email: currentPlayer.person.email,
        phoneNumber: currentPlayer.person.phoneNumber,
        address: currentPlayer.person.address,
        dateOfBirth: currentPlayer.person.dateOfBirth,
      },
    });

    setEditPlayerId(null);
  };

  const handleCancelEdit = () => {
    setEditPlayerId(null);
  };

  const handleDelete = (playerId: number) => {
    if (confirm("Opravdu chceš smazat hráče? Tato akce je nevratná.")) {
      deletePlayer(playerId);
    }
  };

  const handleAddPlayer = () => {
    setAddingNew(true);
    setNewPlayer({
      firstName: "",
      lastName: "",
      number: 1,
    });
  };

  const handleConfirmAdd = () => {
    if (!team) return;

    const isDuplicate = team.players.some((p) => p.number === newPlayer.number);
    if (isDuplicate) {
      toast.warning(
        "Hráč s tímto číslem dresu už existuje. Číslo bylo nastaveno na 0."
      );
    }
    const numberToUse = isDuplicate ? 0 : newPlayer.number;
    addPlayer({
      number: numberToUse,
      goalCount: 0,
      sevenMeterGoalCount: 0,
      sevenMeterMissCount: 0,
      twoMinPenaltyCount: 0,
      yellowCardCount: 0,
      redCardCount: 0,
      teamId: team.id,
      categoryId: team.categoryId,
      person: {
        firstName: newPlayer.firstName,
        lastName: newPlayer.lastName,
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "2000-01-01T00:00:00",
      },
    });

    setAddingNew(false);
    setNewPlayer({ firstName: "", lastName: "", number: 0 });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewPlayer({ firstName: "", lastName: "", number: 0 });
  };

  const { mutate: removeFromTeam, isPending: isRemoving } = useRemoveFromTeam();

  const handleRemoveFromTeam = (playerId: number) => {
    if (
      confirm("Opravdu chceš odebrat hráče z týmu? Stane se volným hráčem.")
    ) {
      removeFromTeam(playerId);
    }
  };

  const { data: freePlayers = [] } = useFreePlayers(team?.categoryId || 0);

  const filteredFreePlayers = freePlayers.filter((p) => {
    const fullName = `${p.person.firstName} ${p.person.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const { mutate: assignToTeam } = useAssignPlayerToTeam();

  const handleAssignExisting = (playerId: number) => {
    if (!team) return;

    assignToTeam(
      { playerId, teamId: team.id },
      {
        onSuccess: () => {
          setAddingNew(false);
          setSearchTerm("");
        },
      }
    );
  };

  if (isLoading)
    return (
      <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mt-8" />
    );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold text-red-500">Chyba</h2>
        <p className="text-lg text-red-500">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col items-start justify-between sm:items-center sm:flex-row">
          <div>
            <h2 className="text-xl font-bold">{team?.name}</h2>
            <p className="text-sm text-muted-foreground">
              {team?.clubName} – {team?.categoryName}
            </p>
          </div>
          {!addingNew && (
            <Button
              onClick={handleAddPlayer}
              variant="default"
              className="text-white"
            >
              <Plus className="mr-2" size={18} /> Přidat hráče
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Hráči</h3>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>Dres</TableHead>
                <TableHead>Jméno</TableHead>
                <TableHead>Příjmení</TableHead>
                <TableHead>Góly</TableHead>
                <TableHead>7m Góly</TableHead>
                <TableHead>7m Neproměněny</TableHead>
                <TableHead>2min</TableHead>
                <TableHead>ŽK</TableHead>
                <TableHead>ČK</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...(team?.players ?? [])]
                .sort((a, b) => a.number - b.number)
                .map((player) => (
                  <TableRow key={player.id} className="">
                    {editPlayerId === player.id ? (
                      <>
                        <TableCell>
                          <Input
                            type="number"
                            value={editedPlayer.number}
                            onChange={(e) =>
                              setEditedPlayer((prev) => ({
                                ...prev,
                                number: parseInt(e.target.value),
                              }))
                            }
                            className="w-16"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editedPlayer.firstName}
                            onChange={(e) =>
                              setEditedPlayer((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={editedPlayer.lastName}
                            onChange={(e) =>
                              setEditedPlayer((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              player.id && handleSaveClick(player.id)
                            }
                            disabled={isUpdating}
                          >
                            <Save size={16} />
                          </Button>
                          <Button size="sm" onClick={handleCancelEdit}>
                            <X size={16} />
                          </Button>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{player.number}</TableCell>
                        <TableCell>{player.person.firstName}</TableCell>
                        <TableCell>{player.person.lastName}</TableCell>
                        <TableCell>{player.goalCount}</TableCell>
                        <TableCell>{player.sevenMeterGoalCount}</TableCell>
                        <TableCell>{player.sevenMeterMissCount}</TableCell>
                        <TableCell>{player.twoMinPenaltyCount}</TableCell>
                        <TableCell>{player.yellowCardCount}</TableCell>
                        <TableCell>{player.redCardCount}</TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondaryOutline"
                            onClick={() => handleEditClick(player)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => player.id && handleDelete(player.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={16} />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveFromTeam(player.id)}
                            disabled={isRemoving}
                          >
                            Odebrat z týmu
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}

              {/* Přidání nového hráče */}
              {addingNew && (
                <>
                  <TableRow className="bg-primary/10">
                    <TableCell colSpan={10} className="space-y-4 py-6">
                      <div className="space-y-2">
                        <h4 className="font-medium">
                          Vyber existujícího hráče:
                        </h4>
                        <Input
                          placeholder="Hledat podle jména"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="max-h-60 overflow-y-auto border rounded">
                          {filteredFreePlayers.map((player) => (
                            <div
                              key={player.id}
                              className="flex items-center gap-4 px-4 py-2"
                            >
                              <span>
                                {player.person.firstName}{" "}
                                {player.person.lastName} #{player.number}
                              </span>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleAssignExisting(player.id)}
                              >
                                Přidat
                              </Button>
                            </div>
                          ))}
                          {filteredFreePlayers.length === 0 && (
                            <p className="text-muted-foreground px-4 py-2 text-sm">
                              Nenalezeno žádný volný hráč
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-6">
                        <h4 className="font-medium">Nebo vytvoř nového:</h4>
                        <div className="flex gap-4">
                          <Input
                            type="number"
                            placeholder="Dres"
                            className="w-16"
                            value={newPlayer.number}
                            onChange={(e) =>
                              setNewPlayer((prev) => ({
                                ...prev,
                                number: parseInt(e.target.value),
                              }))
                            }
                          />
                          <Input
                            placeholder="Jméno"
                            value={newPlayer.firstName}
                            className="w-32"
                            onChange={(e) =>
                              setNewPlayer((prev) => ({
                                ...prev,
                                firstName: e.target.value,
                              }))
                            }
                          />
                          <Input
                            placeholder="Příjmení"
                            value={newPlayer.lastName}
                            className="w-32"
                            onChange={(e) =>
                              setNewPlayer((prev) => ({
                                ...prev,
                                lastName: e.target.value,
                              }))
                            }
                          />
                          <Button
                            size="sm"
                            onClick={handleConfirmAdd}
                            disabled={isAdding}
                          >
                            <Save size={16} className="mr-2" />
                            Přidat
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancelAdd}
                        className="mt-2"
                      >
                        <X size={16} className="mr-2" />
                        Zrušit
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
