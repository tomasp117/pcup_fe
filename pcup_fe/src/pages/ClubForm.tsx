import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { useState } from "react";
import { useCreateClub } from "@/hooks/useClubs";

type ClubFormValues = {
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export const ClubForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClubFormValues>();

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
    data: createdClub,
  } = useCreateClub();

  const [csvMessage, setCsvMessage] = useState("");

  const onSubmit = (data: ClubFormValues) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;

      // 👉 ruční dekódování pomocí windows-1250
      const decoder = new TextDecoder("windows-1250");
      const text = decoder.decode(arrayBuffer);

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsed = results.data as {
            Id: string;
            State: string;
            Club: string;
            Web: string;
          }[];

          const payload = parsed
            .filter((row) => row.Club?.trim())
            .map((row) => ({
              name: row.Club.trim(),
              state: row.State?.trim() || "",
              website: row.Web?.trim() || "",
            }));

          try {
            const res = await fetch(`${API_URL}/clubs/import`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(payload),
            });

            if (res.ok) {
              setCsvMessage("✅ Kluby z CSV byly úspěšně importovány.");
            } else {
              setCsvMessage("❌ Chyba při importu CSV.");
            }
          } catch (err) {
            setCsvMessage("❌ Výjimka při importu CSV.");
          }
        },
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Vytvořit klub</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Název klubu"
          {...register("name", { required: "Název je povinný" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

        <Input placeholder="Email" {...register("email")} />
        <Input placeholder="Adresa" {...register("address")} />
        <Input placeholder="Web" {...register("website")} />
        <Input placeholder="Země (např. CZ nebo SK)" {...register("state")} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Vytvořit klub"}
        </Button>

        {isSuccess && createdClub && (
          <p className="text-green-600">✅ Klub vytvořen: {createdClub.name}</p>
        )}
        {isError && (
          <p className="text-red-600">❌ {(error as Error).message}</p>
        )}
      </form>

      <div className="space-y-2">
        <label htmlFor="csv-upload" className="block font-medium">
          Import klubů z CSV:
        </label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
        />
        {csvMessage && <p className="text-sm">{csvMessage}</p>}
      </div>
    </div>
  );
};
