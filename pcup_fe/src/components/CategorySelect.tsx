import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Category = {
  id: number;
  name: string;
};

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/categories`);
        if (!res.ok) throw new Error("Nepodařilo se načíst kategorie");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError("Chyba při načítání kategorií.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isLoading && !error && categories.length > 0 && value === null) {
      const firstAvailableCategory = categories.find(
        (cat) => !(noMini41 && cat.name === "Mini 4+1")
      );
      if (firstAvailableCategory) onChange(firstAvailableCategory.id);
    }
  }, [isLoading, error, categories, value, onChange, noMini41]);

  if (isLoading) return <p>Načítání kategorií...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
