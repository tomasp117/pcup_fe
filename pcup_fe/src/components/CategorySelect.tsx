import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Category } from "@/interfaces/CategorySelect/ICategory";
import { useCategories } from "@/hooks/useCategories";
import { Loader2 } from "lucide-react";

interface CategorySelectProps {
  value: number | null;
  onChange: (categoryId: number) => void;
  noMini41?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL;

export const CategorySelect = ({
  value,
  onChange,
  noMini41,
}: CategorySelectProps) => {
  //const [categories, setCategories] = useState<Category[]>([]);
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const { data: categories = [], isLoading, error } = useCategories();

  // Nastavení výchozí hodnoty (první vhodná kategorie)
  useEffect(() => {
    if (!isLoading && !error && categories.length > 0 && value === null) {
      const firstAvailableCategory = categories.find(
        (cat) => !(noMini41 && cat.name === "Mini 4+1")
      );
      if (firstAvailableCategory) {
        Promise.resolve().then(() => onChange(firstAvailableCategory.id));
      }
    }
  }, [isLoading, error, categories, value, noMini41, onChange]);

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
          value
            ? value.toString()
            : categories.length > 0
            ? categories[0].id.toString()
            : ""
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Vyber kategorii" />
        </SelectTrigger>
        <SelectContent>
          {categories
            .filter((cat) => !(noMini41 && cat.name === "Mini 4+1"))
            .map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
};
