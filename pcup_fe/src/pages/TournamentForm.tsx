import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTournament, useTournaments } from "@/hooks/useTournaments";

type TournamentFormProps = {
  onSuccess: (id: number, name: string) => void;
};

export const TournamentForm = ({ onSuccess }: TournamentFormProps) => {
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
          <p>Načítám...</p>
        ) : (
          <div className="space-y-2">
            {tournaments?.map((tournament: { id: number; name: string }) => (
              <Button
                key={tournament.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => onSuccess(tournament.id, tournament.name)}
              >
                {tournament.name}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
