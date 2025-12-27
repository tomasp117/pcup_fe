import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

interface CategorySelectProps {
  value: number | null;
  onChange: (categoryId: number) => void;
  noMini41?: boolean;
}

export const CategorySelect = ({
  value,
  onChange,
  noMini41,
}: CategorySelectProps) => {
  //const [categories, setCategories] = useState<Category[]>([]);
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useCategories();

  const filtered = categories.filter(
    (cat) => !(noMini41 && cat.name === "Mini 4+1")
  );
  // a pak je obrátíme
  const reversed = filtered.slice().reverse();

  // Nastavení výchozí hodnoty (první v obráceném seznamu)
  useEffect(() => {
    if (
      !isLoading &&
      !error &&
      reversed.length > 0 &&
      (value === null || value === undefined)
    ) {
      onChange(reversed[0].id);
    }
  }, [isLoading, error, reversed, value, onChange]);

  if (isLoading)
    return <Loader2 className="animate-spin w-8 h-8 text-primary" />;
  if (error)
    return <p className="text-red-500">Chyba při načítání kategorií.</p>;

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="font-medium">Vyber kategorii:</span>
      <Select
        onValueChange={(value) => onChange(Number(value))}
        value={
          value != null ? value.toString() : reversed[0]?.id.toString() ?? ""
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Vyber kategorii" />
        </SelectTrigger>
        <SelectContent>
          {reversed.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
