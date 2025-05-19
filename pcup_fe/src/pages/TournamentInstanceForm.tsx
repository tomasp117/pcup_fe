import { useForm } from "react-hook-form";
import {
  useCreateTournamentInstance,
  useTournamentInstancesByTournamentId,
} from "@/hooks/useTournamentInstances";
import { useTournaments } from "@/hooks/useTournaments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormValues = {
  tournamentId: string;
  editionNumber: number;
  startDate: string;
  endDate: string;
};

type TournamentInstanceFormProps = {
  tournamentId: number;
  onSuccess: (instanceId: number, editionNumber: number) => void;
  onBack?: () => void;
};

export const TournamentInstanceForm = ({
  tournamentId,
  onSuccess,
  onBack,
}: TournamentInstanceFormProps) => {
  const { mutate, isPending, isError, error } = useCreateTournamentInstance();

  const { data: instances, isLoading: loadingInstances } =
    useTournamentInstancesByTournamentId(tournamentId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Omit<FormValues, "tournamentId">>();

  const today = new Date().toISOString().split("T")[0];
  const startDate = watch("startDate");

  const onSubmit = (data: Omit<FormValues, "tournamentId">) => {
    mutate(
      {
        tournamentId,
        editionNumber: data.editionNumber,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      {
        onSuccess: (instance) => {
          onSuccess(instance.id, data.editionNumber);
        },
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-xl font-bold">Vytvořit edici turnaje</h2>

        <Input
          placeholder="Číslo edice (např. 2024)"
          type="number"
          {...register("editionNumber", {
            required: true,
            min: { value: 1, message: "Musí být větší než 0" },
          })}
        />
        {errors.editionNumber && (
          <p className="text-red-600 text-sm">{errors.editionNumber.message}</p>
        )}

        <Input
          type="date"
          {...register("startDate", {
            required: true,
            validate: (val) =>
              val >= today || "Začátek musí být dnes nebo později",
          })}
        />
        {errors.startDate && (
          <p className="text-red-600 text-sm">{errors.startDate.message}</p>
        )}

        <Input
          type="date"
          {...register("endDate", {
            required: true,
            validate: (val) =>
              !startDate || val > startDate || "Konec musí být po začátku",
          })}
        />
        {errors.endDate && (
          <p className="text-red-600 text-sm">{errors.endDate.message}</p>
        )}

        <div className="flex gap-2">
          {onBack && (
            <Button type="button" variant="default" onClick={onBack}>
              Zpět
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Ukládám..." : "Vytvořit instanci"}
          </Button>
        </div>

        {isError && (
          <p className="text-red-600">❌ {(error as Error).message}</p>
        )}
      </form>
      {instances && (
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="font-semibold">Nebo vyber existující edici:</h3>

          {loadingInstances ? (
            <p>Načítám edice...</p>
          ) : instances.length > 0 ? (
            <div className="space-y-2">
              {instances.map((instance) => (
                <Button
                  key={instance.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onSuccess(instance.id, instance.editionNumber)}
                >
                  Edice {instance.editionNumber} ({instance.startDate} –{" "}
                  {instance.endDate})
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Žádné edice zatím nejsou.</p>
          )}
        </div>
      )}
    </>
  );
};
