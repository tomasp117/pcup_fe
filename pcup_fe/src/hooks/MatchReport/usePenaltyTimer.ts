// hooks/usePenaltyTimer.ts
import { useState, useEffect, useRef } from "react";

export function usePenaltyTimer(isCounting: boolean, shouldReset: boolean) {
  const [expiries, setExpiries] = useState<Record<number, number>>({});
  const interval = useRef<NodeJS.Timeout | null>(null);
  const wasCounting = useRef(isCounting);
  const pauseStart = useRef<number | null>(null);

  // 1s tick & pruning
  useEffect(() => {
    clearInterval(interval.current!);
    if (isCounting) {
      interval.current = setInterval(() => {
        const now = Date.now();
        setExpiries((prev) =>
          Object.fromEntries(
            Object.entries(prev).filter(([_, exp]) => exp > now)
          )
        );
      }, 1000);
    }
    return () => clearInterval(interval.current!);
  }, [isCounting]);

  // freeze-and-shift logic (unchanged)
  useEffect(() => {
    if (wasCounting.current && !isCounting) {
      pauseStart.current = Date.now();
    }
    if (!wasCounting.current && isCounting && pauseStart.current != null) {
      const pausedFor = Date.now() - pauseStart.current;
      setExpiries((prev) =>
        Object.fromEntries(
          Object.entries(prev).map(([id, exp]) => [id, exp + pausedFor])
        )
      );
      pauseStart.current = null;
    }
    wasCounting.current = isCounting;
  }, [isCounting]);

  // **wipe everything out when shouldReset becomes true**
  useEffect(() => {
    if (shouldReset) {
      setExpiries({});
    }
  }, [shouldReset]);

  function addPenalty(playerId: number) {
    setExpiries((prev) => ({
      ...prev,
      [playerId]: Date.now() + 120_000,
    }));
  }

  function getPenaltyLeft(playerId: number): number | null {
    const exp = expiries[playerId];
    if (!exp) return null;
    const left = Math.ceil((exp - Date.now()) / 1000);
    return left > 0 ? left : null;
  }

  return { addPenalty, getPenaltyLeft };
}
