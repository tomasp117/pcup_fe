import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCreateTournament,
  useDeleteTournament,
  useTournaments,
} from "@/hooks/useTournaments";
import { useNavigate } from "react-router-dom";
import { Delete, Loader2, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";

type TournamentFormProps = {
  onSuccess: (id: number, name: string) => void;
};

export const TournamentForm = ({ onSuccess }: TournamentFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  const {
    mutate,
    isSuccess,
    isError,
    error: mutationError,
  } = useCreateTournament();

  const { data: tournaments, isLoading } = useTournaments();

  const { mutate: deleteTournament, isPending: isDeleting } =
    useDeleteTournament();

  const onSubmit = ({ name }: { name: string }) => {
    mutate(name, {
      onSuccess: (data) => {
        onSuccess(data.id, name);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h2 className="text-xl font-bold">Vytvořit nový turnaj</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Název turnaje"
          {...register("name", { required: "Název je povinný" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

        <Button type="submit">Vytvořit</Button>
      </form>

      {isError && (
        <p className="text-red-600">❌ {(mutationError as Error).message}</p>
      )}

      <div className="border-t pt-6 mt-6 space-y-4">
        <h3 className="font-semibold">Nebo vyber existující turnaj:</h3>

        {isLoading ? (
          <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto mt-8" />
        ) : (
          <div className="space-y-2">
            {tournaments?.map((tournament) => (
              <div
                key={tournament.id}
                className="flex items-center justify-between gap-2"
              >
                <Button
                  variant="secondaryOutline"
                  className="flex-1 justify-start"
                  onClick={() => onSuccess(tournament.id, tournament.name)}
                >
                  {tournament.name}
                </Button>
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  onClick={() => navigate(`/tournaments/${tournament.id}/edit`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Opravdu chceš tento turnaj smazat?")) {
                      deleteTournament(tournament.id, {
                        onSuccess: () => {
                          toast.success("✅ Turnaj byl úspěšně smazán.");
                        },
                      });
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : <X size={16} />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
