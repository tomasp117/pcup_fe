import { CategoryData } from "@/interfaces/CategoryData/CategoryData";
import { Group } from "@/interfaces/Draws/Group";
import { GroupVariant } from "@/interfaces/Draws/GroupVariant";
import { TeamDraw } from "@/interfaces/Draws/TeamDraw";
import { useEffect, useState } from "react";

export function useCategoryData(API_URL: string) {
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState<number | null>(null);
  const [categoryData, setCategoryData] = useState<
    Record<number, CategoryData>
  >({});
  const [teamDraws, setTeamDraws] = useState<TeamDraw[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<GroupVariant | null>(
    null
  );
  const [groupVariants, setGroupVariants] = useState<GroupVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Přidáme stav a funkce pro správu variant:
  const [expandedVariant, setExpandedVariant] = useState<number | null>(null);

  const toggleVariant = (index: number) => {
    setExpandedVariant((prev) => (prev === index ? null : index));
  };

  const selectVariant = (variant: GroupVariant) => {
    setSelectedVariant(variant);
    setExpandedVariant(null);
    // Příklad: nastavení skupin podle vybrané varianty
    setGroups(
      variant.groups.map((group) => ({
        ...group,
        teams: group.teams.map((team) => ({
          ...team,
          // Zachování případných úprav, pokud existují
          strength: teamDraws.find((t) => t.id === team.id)?.strength ?? 1,
          isGirls: teamDraws.find((t) => t.id === team.id)?.isGirls ?? false,
        })),
      }))
    );
    // Odebrání týmů, které jsou již v variantě, ze seznamu volných týmů
    setTeamDraws((prevTeams) =>
      prevTeams.filter(
        (team) =>
          !variant.groups.flatMap((g) => g.teams).some((t) => t.id === team.id)
      )
    );
  };

  // Funkce pro načítání týmů a skupin z API
  const getTeamsAndGroups = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    if (category !== null && categoryData[category]?.teams.length) {
      setTeamDraws(categoryData[category].teams);
      setGroups(categoryData[category].groups);
      setSelectedVariant(categoryData[category].selectedVariant);
      setGroupVariants(categoryData[category].groupVariants);
      setIsLoading(false);
      return;
    }

    if (category === null) {
      setTeamDraws([]);
      setGroups([]);
      setSelectedVariant(null);
      setGroupVariants([]);
      setIsLoading(false);
      return;
    }
    try {
      const groupsResponse = await fetch(
        `${API_URL}/groups?category=${category}`
      );
      let newGroups: Group[] = [];
      let remainingTeams: TeamDraw[] = [];

      if (groupsResponse.ok) {
        const groupsData: Group[] = await groupsResponse.json();
        newGroups = groupsData.map((group, index) => ({
          id: group.id ?? `temp-${index}`,
          name: group.name,
          teams: group.teams.map((team) => ({
            ...team,
            strength: team.strength ?? 1,
            isGirls: team.isGirls ?? false,
          })),
        }));
      } else if (groupsResponse.status === 404) {
        const teamsResponse = await fetch(
          `${API_URL}/teams?category=${category}`
        );
        if (!teamsResponse.ok) {
          throw new Error(
            `Chyba: ${teamsResponse.status} ${teamsResponse.statusText}`
          );
        }
        remainingTeams = await teamsResponse.json();
        newGroups = Array.from({ length: 4 }, (_, index) => ({
          id: -(index + 1),
          name: `Skupina ${String.fromCharCode(65 + index)}`,
          teams: [],
        }));
      } else {
        throw new Error(
          `Chyba: ${groupsResponse.status} ${groupsResponse.statusText}`
        );
      }

      setCategoryData((prev) => ({
        ...prev,
        [String(category)]: {
          teams: remainingTeams,
          groups: newGroups,
          selectedVariant:
            category !== null ? prev[category]?.selectedVariant || null : null,
          groupVariants:
            category !== null ? prev[category]?.groupVariants || [] : [],
        },
      }));

      setTeamDraws(remainingTeams);
      setGroups(newGroups);
      setSelectedVariant(
        category !== null
          ? categoryData[category]?.selectedVariant || null
          : null
      );
      setGroupVariants(
        category !== null ? categoryData[category]?.groupVariants || [] : []
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chyba při načítání dat. Zkuste to znovu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTeamsAndGroups();
  }, [category]);

  const handleCategoryChange = (newCategory: number | null) => {
    setCategory(newCategory);
  };

  return {
    categories,
    category,
    teamDraws,
    groups,
    selectedVariant,
    groupVariants,
    isLoading,
    errorMessage,
    categoryData,
    setCategory,
    handleCategoryChange,
    setTeamDraws,
    setGroups,
    setSelectedVariant,
    setGroupVariants,
    setErrorMessage,
    setCategoryData,
    // Export funkcí pro varianty:
    expandedVariant,
    toggleVariant,
    selectVariant,
  };
}
