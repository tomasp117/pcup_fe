import { GroupVariant } from "@/interfaces/Draws/GroupVariant";

export function useAutoAssign(
  API_URL: string,
  category: number | null,
  teamDraws: any,
  setGroupVariants: (variants: GroupVariant[]) => void,
  setErrorMessage: (msg: string | null) => void,
  setCategoryData: (data: any) => void
) {
  const autoAssignTeams = async () => {
    if (category === null) return;
    setErrorMessage(null);

    try {
      console.log("Auto-assigning teams...");
      console.log("Category ID:", category);
      const response = await fetch(
        `${API_URL}/teams/assign-groups?category=${category}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(teamDraws),
        }
      );

      if (!response.ok) throw new Error(`Chyba: ${response.status}`);
      const data: GroupVariant[] = await response.json();

      console.log("Auto-assigned variants:", data);

      setGroupVariants(data);

      // Uložíme varianty do categoryData
      setCategoryData((prev: any) => ({
        ...prev,
        [category]: {
          ...(prev[category] || {}),
          groupVariants: data,
          selectedVariant: null,
        },
      }));
    } catch (error: any) {
      setErrorMessage(error.message || "Chyba při rozdělování týmů.");
    }
  };

  return { autoAssignTeams };
}
