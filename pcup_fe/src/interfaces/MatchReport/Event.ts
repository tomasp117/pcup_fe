export interface Event {
  id?: number;
  type: string;
  team: string | null;
  time: string;
  authorId: number | null;
  matchId: number | null;
  message: string;
}
