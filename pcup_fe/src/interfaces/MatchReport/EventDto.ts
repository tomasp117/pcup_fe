export type EventDto = {
  type: string;
  team: "L" | "R";
  time: string;
  authorId: number;
  matchId: number;
};
