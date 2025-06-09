import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useMyClub } from "@/hooks/useClubs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddCoachDialog } from "@/components/AddCoachDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useDeleteCoach } from "@/hooks/useCoaches";

const API_URL = import.meta.env.VITE_API_URL;

const API_URL_IMAGES = import.meta.env.VITE_API_URL_IMAGES;

interface CreateCoachDTO {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth: string;
  username: string;
  password: string;
  license: string;
  teamId: number;
  categoryId: number;
}

export const ClubAdminPage = () => {
  const { data: club, isLoading } = useMyClub();

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const [visibleCoachDetails, setVisibleCoachDetails] = useState<number | null>(
    null
  );

  const { mutate: handleDeleteCoach } = useDeleteCoach();

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (coachData: CreateCoachDTO) => {
      const res = await fetch(`${API_URL}/coaches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(coachData),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Chyba při vytváření trenéra");
      }
    },
    onSuccess: () => {
      toast.success("Trenér byl úspěšně přidán");
      queryClient.invalidateQueries({ queryKey: ["my-club"] });
      setSelectedTeamId(null);
    },
    onError: (err: any) => {
      toast.error(`Chyba: ${err.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const handleSaveCoach = (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    dateOfBirth: string;
    username: string;
    password: string;
    teamId: number;
  }) => {
    const team = club?.teams.find((t) => t.id === data.teamId);
    if (!team) return;

    if (typeof team.categoryId !== "number") {
      toast.error("Kategorie týmu není správně nastavena.");
      return;
    }
    mutation.mutate({
      ...data,
      license: "C",
      categoryId: team.categoryId,
    });
  };

  if (!club) {
    return <div>Nemáš přiřazen žádný klub.</div>;
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const uploadLogo = async () => {
    if (!logoFile || !club?.id) return;

    const formData = new FormData();
    formData.append("file", logoFile);

    const res = await fetch(`${API_URL}/clubs/${club.id}/upload-logo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!res.ok) {
      toast.error("Chyba při nahrávání loga");
      return;
    }

    const newPath = await res.text();
    toast.success("Logo nahráno");
    queryClient.invalidateQueries({ queryKey: ["my-club"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex flex-col">
          <div>
            <h1 className="text-2xl font-bold">{club.name}</h1>
            {club.email && (
              <p className="text-muted-foreground">{club.email}</p>
            )}
            {club.website && (
              <a href={club.website} className="text-blue-600 underline">
                {club.website}
              </a>
            )}
          </div>
          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            <Button onClick={uploadLogo} disabled={!logoFile}>
              Nahrát logo
            </Button>
          </div>
        </div>

        {club.logo && (
          <img
            src={`${API_URL_IMAGES}/${club.logo}`}
            alt="Logo klubu"
            className="h-24 w-fit mt-2"
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {club.teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <CardTitle>{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Kategorie:</strong> {team.categoryName || "?"}
              </div>
              <div>
                <strong>Trenér:</strong>{" "}
                {team.coach ? (
                  <>
                    <span>
                      {team.coach.person.firstName} {team.coach.person.lastName}
                    </span>
                    {/* toggle details */}
                    <Button
                      size="sm"
                      className="ml-4"
                      onClick={() =>
                        setVisibleCoachDetails((v) =>
                          v === team.id ? null : team.id
                        )
                      }
                    >
                      {visibleCoachDetails === team.id
                        ? "Skrýt detaily"
                        : "Zobrazit detaily"}
                    </Button>
                    {/* delete */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-2"
                      onClick={() =>
                        confirm(
                          `Opravdu chceš odstranit trenéra ${team.coach?.person.firstName} ${team.coach?.person.lastName}?`
                        ) && handleDeleteCoach(team.coach.id)
                      }
                    >
                      Odstranit trenéra
                    </Button>

                    {visibleCoachDetails === team.id && (
                      <div className="mt-2 space-y-1 text-sm">
                        <div>
                          <strong>Id:</strong> {team.coach.id}
                        </div>
                        <div>
                          <strong>Email:</strong> {team.coach.person.email}
                        </div>
                        <div>
                          <strong>Telefon:</strong>{" "}
                          {team.coach.person.phoneNumber}
                        </div>
                        <div>
                          <strong>Adresa:</strong> {team.coach.person.address}
                        </div>
                        <div>
                          <strong>Datum narození:</strong>{" "}
                          {format(
                            new Date(team.coach.person.dateOfBirth),
                            "dd.MM.yyyy"
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setSelectedTeamId(team.id)}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Přidat trenéra
                  </Button>
                )}
              </div>
              <div>
                <strong>Hráči:</strong>{" "}
                {team.players.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {team.players.map((p) => (
                      <Badge
                        key={p.id}
                        className="bg-primary/10 hover:bg-primary hover:text-white"
                      >
                        {p.person.firstName} {p.person.lastName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span>Žádní hráči</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddCoachDialog
        open={selectedTeamId !== null}
        onClose={() => setSelectedTeamId(null)}
        onSave={handleSaveCoach}
        teamId={selectedTeamId!}
      />
    </div>
  );
};
