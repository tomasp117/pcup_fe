import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTournament, useUpdateTournament } from "@/hooks/useTournaments";

type FormValues = {
  name: string;
};

export const EditTournamentForm = () => {
  const { id } = useParams();
  const tournamentId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading } = useTournament(tournamentId);
  const { mutate, isPending, isSuccess, isError, error } =
    useUpdateTournament();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
    }
  }, [data, setValue]);

  const onSubmit = (formData: FormValues) => {
    mutate(
      { id: tournamentId, name: formData.name },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  if (isLoading) return <p>Načítám turnaj...</p>;

  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Upravit turnaj</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name", { required: "Název je povinný" })}
          placeholder="Název turnaje"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Uložit změny"}
        </Button>
      </form>

      {isError && <p className="text-red-600">❌ {(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600">✅ Turnaj byl upraven</p>}
    </div>
  );
};
