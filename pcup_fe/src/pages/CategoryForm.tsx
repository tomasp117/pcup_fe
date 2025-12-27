import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useCategoriesByInstance,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { Loader2, MoveRight, Pencil, X } from "lucide-react";

type CategoryFormProps = {
  instanceId: number;
  onSuccess?: () => void;
  onBack?: () => void;
  onSkip?: () => void;
};

export const CategoryForm = ({
  instanceId,
  onSuccess,
  onSkip,
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

  const navigate = useNavigate();
  const { data: categories, isLoading: loadingCategories } =
    useCategoriesByInstance(instanceId);
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

  const onSubmit = ({ name }: { name: string }) => {
    mutate(
      {
        name,
        tournamentInstanceId: instanceId,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
      }
    );
  };

  return (
    <>
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
          {/* {onBack && (
            <Button type="button" variant="default" onClick={onBack}>
              Zpět
            </Button>
          )} */}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Ukládám..." : "Vytvořit kategorii"}
          </Button>
        </div>

        {isSuccess && createdCategory && (
          <p className="text-green-600">
            ✅ Kategorie vytvořena: {createdCategory.name}
          </p>
        )}
        {isError && (
          <p className="text-red-600">❌ {(error as Error).message}</p>
        )}
      </form>
      {categories && (
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="font-semibold">Existující kategorie:</h3>

          {loadingCategories ? (
            <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" />
          ) : categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-2">
                  <Button
                    variant="secondaryOutline"
                    className="flex-1 justify-start"
                    onClick={() => onSuccess?.()}
                  >
                    {category.name}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondaryOutline"
                    onClick={() => navigate(`/categories/${category.id}/edit`)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        window.confirm("Opravdu chceš tuto kategorii smazat?")
                      ) {
                        deleteCategory(category.id);
                      }
                    }}
                    disabled={deleting}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Zatím žádné kategorie.</p>
          )}
        </div>
      )}

      {onSkip && (
        <div className="pt-4 border-t mt-4">
          <Button
            type="button"
            variant="secondaryOutline"
            className="text-sm text-muted-foreground"
            onClick={() => onSkip?.()}
          >
            Přeskočit krok kategorií <MoveRight size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </>
  );
};
