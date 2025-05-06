import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventDto } from "../../interfaces/MatchReport/EventDto";
import { Player } from "@/interfaces/MatchReport/Person/Roles/Player";
import { Event } from "@/interfaces/MatchReport/Event";
import { useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const PENDING_EVENTS_KEY = "pendingEvents";

const savePendingEvent = (event: Event) => {
  const pending = JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || "[]");
  localStorage.setItem(PENDING_EVENTS_KEY, JSON.stringify([...pending, event]));
};

const getPendingEvents = (): Event[] => {
  return JSON.parse(localStorage.getItem(PENDING_EVENTS_KEY) || "[]");
};

const clearPendingEvents = () => {
  localStorage.removeItem(PENDING_EVENTS_KEY);
};

/* export const useAddEvent = () => {
  return useMutation({
    mutationFn: async (event: Event) => {
      const res = await fetch(`${API_URL}/events/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error("Nepodařilo se uložit událost");
      return res.ok;
    },
  });
}; */

export const useReliableAddEvent = (matchId: number) => {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async (event: Event) => {
      const res = await fetch(`${API_URL}/events/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error: ${res.status} ${errorText}`);
      }
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", matchId] });
    },
    onError: (error, event) => {
      console.warn("Ukládám událost pro pozdější odeslání", event);
      savePendingEvent(event);
    },
  });

  // Retry pending events on reconnect
  useEffect(() => {
    const sendPending = async () => {
      const pending = getPendingEvents();
      if (pending.length === 0) return;

      console.log("Zkouším odeslat pending události...");
      const successes: Event[] = [];

      for (const e of pending) {
        try {
          const res = await fetch(`${API_URL}/events/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(e),
          });
          if (res.ok) {
            successes.push(e);
          }
        } catch (err) {
          // síťová chyba, nech být
        }
      }

      if (successes.length > 0) {
        // Zbývající neúspěšné události necháme v localStorage
        const stillPending = pending.filter(
          (ev) =>
            !successes.some(
              (s) => s.time === ev.time && s.authorId === ev.authorId
            )
        );
        if (stillPending.length > 0) {
          localStorage.setItem(
            PENDING_EVENTS_KEY,
            JSON.stringify(stillPending)
          );
        } else {
          clearPendingEvents();
        }
        queryClient.invalidateQueries({ queryKey: ["events", matchId] });
      }
    };

    window.addEventListener("online", sendPending);
    return () => window.removeEventListener("online", sendPending);
  }, [matchId, queryClient]);

  return addMutation;
};

export const useMatchEvents = (matchId: number) => {
  return useQuery<Event[]>({
    queryKey: ["events", matchId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/events/match/${matchId}`);
      if (!res.ok) throw new Error("Nepodařilo se načíst události");
      return res.json();
    },
  });
};

export const generateFrontendMessage = (
  event: Event,
  players: Player[]
): string => {
  if (event.type === "I" || !event.authorId) return event.message ?? "";

  const player = players.find((p) => p.id === event.authorId);
  if (!player) return "";

  const name = `${player.person.firstName} ${player.person.lastName} #${player.number}`;

  switch (event.type) {
    case "G":
      return event.message?.includes("7m hod neproměněn")
        ? `⚽ 7m Gól neproměněn, ${name}`
        : event.message?.includes("7m Gól")
        ? `⚽ 7m Gól, ${name}`
        : `⚽ Gól, ${name}`;
    case "2":
      return `🕑 2 minuty - ${name}`;
    case "Y":
      return `🟨 Žlutá karta - ${name}`;
    case "R":
      return `🟥 Červená karta - ${name}`;
    default:
      return "";
  }
};

export const useDeleteEventsByMatchId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: number) => {
      const res = await fetch(`${API_URL}/events?matchId=${matchId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat události");
    },
    onSuccess: (_, matchId) => {
      queryClient.invalidateQueries({ queryKey: ["events", matchId] });
    },
  });
};

export const useDeleteLastEvent = () => {
  return useMutation({
    mutationFn: async (matchId: number) => {
      const res = await fetch(`${API_URL}/events/last?matchId=${matchId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Nepodařilo se smazat poslední událost");
      return res.json() as Promise<Event>; // včetně `id`
    },
  });
};
