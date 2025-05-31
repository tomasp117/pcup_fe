import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import { useClubs } from "@/hooks/useClubs";
import { useCategories } from "@/hooks/useCategories";
import {
  useCreateTeam,
  useDeleteTeam,
  useImportTeamsCsv,
  useTeams,
} from "@/hooks/useTeams";
import Papa from "papaparse";

type TeamFormValues = {
  name: string;
  clubId: number;
  categoryId: number;
  tournamentInstanceId?: number;
};

interface TeamFormProps {
  instanceId: number | null;
}

export const TeamForm = ({ instanceId }: TeamFormProps) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamFormValues>({
    defaultValues: {
      tournamentInstanceId: instanceId ?? undefined,
    },
  });

  const {
    mutate,
    isPending,
    isSuccess,
    isError,
    error,
    data: createdTeam,
  } = useCreateTeam();
  if (instanceId === null) {
    return <p className="text-red-600">Instance ID is required.</p>;
  }
  const { data: teams, isLoading } = useTeams(instanceId);
  const { mutate: deleteTeam, isPending: isDeleting } = useDeleteTeam();

  const { data: clubs } = useClubs();
  const { data: categories } = useCategories();

  const onSubmit = (data: TeamFormValues) => {
    mutate(
      { ...data, tournamentInstanceId: instanceId },
      {
        onSuccess: () => reset(),
      }
    );
  };

  const [csvMessage, setCsvMessage] = useState("");

  // Mapping pro kategorie (případně si rozšiř dál)
  const categoryMap: Record<string, string> = {
    A: "Mladší dorostenci",
    B: "Starší žáci",
    C: "Mladší žáci",
    D: "Minižáci 6+1",
    E: "Minižáci 4+1",
  };

  const {
    mutate: importTeams,
    isPending: isCsvPending,
    isSuccess: isCsvSuccess,
    isError: isCsvError,
    error: csvError,
  } = useImportTeamsCsv();

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
        complete: (results) => {
          const parsed = results.data as any[];
          const payload = parsed
            .filter((row) => row.Caption?.trim())
            .map((row) => {
              const categoryName =
                categoryMap[row.Category?.trim()] || row.Category?.trim();
              const clubNameRaw = row.Club?.trim() || "";
              return {
                name: row.Caption.trim(),
                clubName: clubNameRaw,
                categoryName,
                tournamentInstanceId: instanceId,
              };
            });
          importTeams(payload);
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="max-w-lg mx-auto space-y-6 mt-8">
      <h2 className="text-xl font-bold">Vytvořit tým</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          placeholder="Název týmu"
          {...register("name", { required: "Název je povinný" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}

        {/* Club select */}
        <select
          {...register("clubId", { required: "Vyber klub" })}
          className="w-full p-2 border rounded"
        >
          <option value="">Vyber klub</option>
          {clubs?.map((club) => (
            <option value={club.id} key={club.id}>
              {club.name}
            </option>
          ))}
        </select>
        {errors.clubId && (
          <p className="text-red-600 text-sm">{errors.clubId.message}</p>
        )}

        {/* Category select */}
        <select
          {...register("categoryId", { required: "Vyber kategorii" })}
          className="w-full p-2 border rounded"
        >
          <option value="">Vyber kategorii</option>
          {categories?.map((cat) => (
            <option value={cat.id} key={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-600 text-sm">{errors.categoryId.message}</p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Ukládám..." : "Vytvořit tým"}
        </Button>

        {isSuccess && createdTeam && (
          <p className="text-green-600">✅ Tým vytvořen: {createdTeam.name}</p>
        )}
        {isError && (
          <p className="text-red-600">❌ {(error as Error).message}</p>
        )}
      </form>

      <div className="space-y-2">
        <label htmlFor="csv-upload" className="block font-medium">
          Import týmů z CSV:
        </label>
        <Input
          id="csv-upload"
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="cursor-pointer :hover:bg-primary/10"
        />
        {isCsvPending && <p className="text-sm">Importuji CSV...</p>}
        {isCsvSuccess && (
          <p className="text-green-600 text-sm">
            ✅ Týmy z CSV byly úspěšně importovány.
          </p>
        )}
        {isCsvError && (
          <p className="text-red-600 text-sm">
            ❌ Chyba při importu CSV:{" "}
            {csvError instanceof Error ? csvError.message : "Chyba"}
          </p>
        )}
      </div>

      {/* Výpis existujících týmů */}
      <div className="border-t pt-6 mt-6 space-y-4">
        <h3 className="font-semibold">Existující týmy:</h3>
        {isLoading ? (
          <p>Načítám...</p>
        ) : (
          <div
            className="space-y-2 max-h-[60vh]
           overflow-y-auto "
          >
            {teams?.map((team) => (
              <div key={team.id} className="flex items-center gap-2">
                <Button
                  variant="secondaryOutline"
                  className="flex-1 justify-start"
                >
                  {team.name}
                </Button>
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  onClick={() => navigate(`/teams/${team.id}/edit`)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Opravdu chceš tento tým smazat?")) {
                      deleteTeam(team.id, {
                        onSuccess: () => {
                          toast.success("✅ Tým byl úspěšně smazán.");
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
    </div>
  );
};
