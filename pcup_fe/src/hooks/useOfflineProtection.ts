import { useEffect } from "react";
import { toast } from "react-toastify";

export const useOfflineProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!navigator.onLine) {
        e.preventDefault();
        e.returnValue = "";
        toast.error("Jsi offline. Reload byl zablokován.");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !navigator.onLine &&
        (e.key === "F5" || (e.ctrlKey && e.key === "r"))
      ) {
        e.preventDefault();
        toast.error("Jsi offline. Reload je zakázán.");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);
};
