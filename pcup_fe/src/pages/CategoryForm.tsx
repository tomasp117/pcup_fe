import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTournamentInstances } from "@/hooks/useTournamentInstances";
import { useCreateCategory } from "@/hooks/useCategories";

type FormValues = {
  name: string;
  tournamentInstanceId: string;
};
type CategoryFormProps = {
  instanceId: number;
  onSuccess?: () => void;
  onBack?: () => void;
};

export const CategoryForm = ({
  instanceId,
  onSuccess,
  onBack,
}: CategoryFormProps) => {
  const {
    mutate,
    isSuccess,
    isError,
    error,
    isPending,
    data: createdCategory,
  } = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string }>();

  const onSubmit = ({ name }: { name: string }) => {
    mutate(
      {
        name,
        tournamentInstanceId: instanceId,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.(); // zavolá callback pokud existuje
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4 mt-8"
    >
      <h2 className="text-xl font-bold">Vytvořit kategorii</h2>

      <Input
        placeholder="Název kategorie (např. Mladší žáci)"
        {...register("name", { required: "Název je povinný" })}
      />
      {errors.name && (
        <p className="text-red-600 text-sm">{errors.name.message}</p>
      )}

      <div className="flex gap-2">
        {onBack && (
          <Button type="button" variant="secondary" onClick={onBack}>
            Zpět
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Vytvořit kategorii"}
        </Button>
      </div>

      {isSuccess && createdCategory && (
        <p className="text-green-600">
          ✅ Kategorie vytvořena: {createdCategory.name}
        </p>
      )}
      {isError && <p className="text-red-600">❌ {(error as Error).message}</p>}
    </form>
  );
};
