import { TournamentInstance } from "./TournamentInstance";

export interface Tournament {
  id: number;
  name: string;
  editions: TournamentInstance[];
}
