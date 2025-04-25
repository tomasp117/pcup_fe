import { Category } from "./Category";
import { Team } from "./Team";

export interface TournamentInstance {
  id: number;
  editionNumber: number;
  startDate: Date;
  endDate: Date;
  categories: Category[];
  teams: Team[];
}
