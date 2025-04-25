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
  useDeletePlayer,
  useUpdatePlayer,
} from "@/hooks/MyTeam/usePlayers";
import { Trash2, Pencil, Save, X, Plus } from "lucide-react";

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
    const currentPlayer = team?.players.find((p) => p.id === playerId);
    if (!currentPlayer) return;

    updatePlayer({
      id: playerId,
      number: editedPlayer.number,
      person: {
        firstName: editedPlayer.firstName,
        lastName: editedPlayer.lastName,
        email: currentPlayer.person.email,
        phoneNumber: currentPlayer.person.phoneNumber,
        address: currentPlayer.person.address,
        dateOfBirth: currentPlayer.person.dateOfBirth,
      },
      goalCount: currentPlayer.goalCount,
      twoMinPenaltyCount: currentPlayer.twoMinPenaltyCount,
      sevenMeterGoalCount: currentPlayer.sevenMeterGoalCount,
      sevenMeterMissCount: currentPlayer.sevenMeterMissCount,
      yellowCardCount: currentPlayer.yellowCardCount,
      redCardCount: currentPlayer.redCardCount,
      teamId: currentPlayer.teamId,
      categoryId: currentPlayer.categoryId,
    });

    setEditPlayerId(null);
  };

  const handleCancelEdit = () => {
    setEditPlayerId(null);
  };

  const handleDelete = (playerId: number) => {
    if (confirm("Opravdu chceš smazat hráče?")) {
      deletePlayer(playerId);
    }
  };

  const handleAddPlayer = () => {
    setAddingNew(true);
    setNewPlayer({
      firstName: "",
      lastName: "",
      number: 0,
    });
  };

  const handleConfirmAdd = () => {
    if (!team) return;

    addPlayer({
      number: newPlayer.number,
      goalCount: 0,
      sevenMeterGoalCount: 0, // správné názvy
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
        phoneNumber: "0",
        address: "",
        dateOfBirth: "2000-01-01T00:00:00", // musí být platné datum!
      },
    });

    setAddingNew(false);
    setNewPlayer({ firstName: "", lastName: "", number: 0 });
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewPlayer({ firstName: "", lastName: "", number: 0 });
  };

  if (isLoading) return <p>Načítám tým…</p>;

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
        <CardHeader className="flex flex-row justify-between items-center">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dres</TableHead>
                <TableHead>Jméno</TableHead>
                <TableHead>Příjmení</TableHead>
                <TableHead className="text-right">Akce</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team?.players.map((player) => (
                <TableRow key={player.id}>
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
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
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
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}

              {/* Přidání nového hráče */}
              {addingNew && (
                <TableRow>
                  <TableCell>
                    <Input
                      type="number"
                      value={newPlayer.number}
                      onChange={(e) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          number: parseInt(e.target.value),
                        }))
                      }
                      className="w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newPlayer.firstName}
                      onChange={(e) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={newPlayer.lastName}
                      onChange={(e) =>
                        setNewPlayer((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={handleConfirmAdd}
                      disabled={isAdding}
                    >
                      <Save size={16} />
                    </Button>
                    <Button size="sm" onClick={handleCancelAdd}>
                      <X size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
