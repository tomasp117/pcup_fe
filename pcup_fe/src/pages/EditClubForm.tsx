import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClubDetail, useUpdateClub } from "@/hooks/useClubs";

type FormValues = {
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
  logo?: string;
};

export const EditClubForm = () => {
  const { id } = useParams();
  const clubId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading } = useClubDetail(clubId);
  const { mutate, isPending, isSuccess, isError, error } = useUpdateClub();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  useEffect(() => {
    if (data) {
      setValue("name", data.name);
      setValue("email", data.email || "");
      setValue("address", data.address || "");
      setValue("website", data.website || "");
      setValue("state", data.state || "");
      setValue("logo", data.logo || "");
    }
  }, [data, setValue]);

  const onSubmit = (formData: FormValues) => {
    mutate(
      { id: clubId, ...formData, logo: formData.logo ?? "" },
      {
        onSuccess: () => navigate(-1),
      }
    );
  };

  if (isLoading) return <p>Načítám klub...</p>;

  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Upravit klub</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name", { required: "Název je povinný" })}
          placeholder="Název klubu"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}

        <Input {...register("email")} placeholder="Email" />
        <Input {...register("address")} placeholder="Adresa" />
        <Input {...register("website")} placeholder="Web" />
        <Input {...register("state")} placeholder="Země (např. CZ)" />
        <Input
          {...register("logo")}
          placeholder="Logo (odkaz nebo název souboru)"
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Uložit změny"}
        </Button>
      </form>

      {isError && <p className="text-red-600">❌ {(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600">✅ Klub byl upraven</p>}
    </div>
  );
};
