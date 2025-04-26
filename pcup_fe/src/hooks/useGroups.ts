import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export const useSaveBracket = () => {
  return useMutation({
    mutationFn: async (bracketData: any) => {
      const res = await fetch(`${API_URL}/bracket/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bracketData),
      });

      if (!res.ok) {
        throw new Error("Nepodařilo se uložit pavouka.");
      }

      return res.json();
    },
    onSuccess: () => {
      // Tady můžeš třeba:
      // - Ukázat notifikaci že bylo uloženo
      // - Invalidovat query
      console.log("Bracket byl úspěšně uložen!");
    },
  });
};
