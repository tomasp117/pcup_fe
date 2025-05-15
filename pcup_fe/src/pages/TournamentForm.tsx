import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateTournament } from "@/hooks/useTournaments";
import { useNavigate } from "react-router-dom";

type TournamentFormProps = {
  onSuccess: (tournamentId: number) => void;
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

  const onSubmit = ({ name }: { name: string }) => {
    mutate(name, {
      onSuccess: (data) => {
        onSuccess(data.id);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
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
    </div>
  );
};
