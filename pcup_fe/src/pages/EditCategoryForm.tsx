import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategoryDetail, useUpdateCategory } from "@/hooks/useCategories";

type FormValues = {
  name: string;
};

export const EditCategoryForm = () => {
  const { id } = useParams();
  const categoryId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading } = useCategoryDetail(categoryId);
  const { mutate, isPending, isSuccess, isError, error } = useUpdateCategory();

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
      { id: categoryId, name: formData.name },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  if (isLoading) return <p>Načítám kategorii...</p>;

  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Upravit kategorii</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name", { required: "Název je povinný" })}
          placeholder="Název kategorie"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Uložit změny"}
        </Button>
      </form>

      {isError && <p className="text-red-600">❌ {(error as Error).message}</p>}
      {isSuccess && (
        <p className="text-green-600">✅ Kategorie byla upravena</p>
      )}
    </div>
  );
};
