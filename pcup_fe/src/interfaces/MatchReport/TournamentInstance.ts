import { Category } from "./Category";
import { Team } from "./Team";

export interface TournamentInstance {
  id: number;
  editionNumber: number;
  startDate: string;
  endDate: string;
  tournamentId: number;
  tournamentName: string;
  teams: Team[];
  categories: Category[];
}
