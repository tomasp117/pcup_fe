import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useTournamentInstance,
  useUpdateTournamentInstance,
} from "@/hooks/useTournamentInstances";

type FormValues = {
  editionNumber: number;
  startDate: string;
  endDate: string;
};

export const EditTournamentInstanceForm = () => {
  const { id } = useParams();
  const instanceId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading } = useTournamentInstance(instanceId);
  const { mutate, isPending, isSuccess, isError, error } =
    useUpdateTournamentInstance();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      setValue("editionNumber", data.editionNumber);
      setValue("startDate", data.startDate.split("T")[0]);
      setValue("endDate", data.endDate.split("T")[0]);
    }
  }, [data, setValue]);

  const onSubmit = (form: FormValues) => {
    mutate(
      {
        id: instanceId,
        editionNumber: form.editionNumber,
        startDate: form.startDate,
        endDate: form.endDate,
      },
      {
        onSuccess: () => navigate(-1),
      }
    );
  };

  if (isLoading) return <p>Načítám instanci...</p>;

  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Upravit edici</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="number"
          {...register("editionNumber", { required: true })}
          placeholder="Číslo edice"
        />

        <Input type="date" {...register("startDate", { required: true })} />
        <Input type="date" {...register("endDate", { required: true })} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Uložit změny"}
        </Button>
      </form>

      {isError && <p className="text-red-600">{(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600">✅ Uloženo</p>}
    </div>
  );
};
