export interface Event {
  type: string;
  team: string | null;
  time: string;
  authorID: number | null;
  message: string; // only frontend
}
