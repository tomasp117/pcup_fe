import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { MoveRight, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import { useClubs, useCreateClub, useDeleteClub } from "@/hooks/useClubs";

type ClubFormValues = {
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
  logo?: string;
};

interface ClubFormProps {
  onBack?: () => void;
  onSkip?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL;

export const ClubForm = ({ onBack, onSkip }: ClubFormProps) => {
  const navigate = useNavigate();

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

  const { data: clubs, isLoading } = useClubs();
  const { mutate: deleteClub, isPending: isDeleting } = useDeleteClub();

  const [csvMessage, setCsvMessage] = useState("");

  const onSubmit = (data: ClubFormValues) => {
    mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const decoder = new TextDecoder("windows-1250");
      const text = decoder.decode(reader.result as ArrayBuffer);

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsed = results.data as {
            Id: string;
            ContactEmail: string;
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
              email: row.ContactEmail?.trim() || "",
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

            setCsvMessage(
              res.ok
                ? "✅ Kluby z CSV byly úspěšně importovány."
                : "❌ Chyba při importu CSV."
            );
          } catch {
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
        <Input placeholder="Logo (volitelné)" {...register("logo")} />

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
          className="cursor-pointer :hover:bg-primary/10"
        />
        {csvMessage && <p className="text-sm">{csvMessage}</p>}
      </div>

      <div className="border-t pt-6 mt-6 space-y-4">
        <h3 className="font-semibold">Existující kluby:</h3>

        {isLoading ? (
          <p>Načítám...</p>
        ) : (
          <div className="space-y-2">
            {clubs?.map((club) => (
              <div key={club.id} className="flex items-center gap-2">
                <Button
                  variant="secondaryOutline"
                  className="flex-1 justify-start"
                >
                  {club.name}
                </Button>
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  onClick={() => navigate(`/clubs/${club.id}/edit`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Opravdu chceš tento klub smazat?")) {
                      deleteClub(club.id, {
                        onSuccess: () => {
                          toast.success("✅ Klub byl úspěšně smazán.");
                        },
                      });
                    }
                  }}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Mazání..." : <X size={16} />}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
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
    </div>
  );
};
