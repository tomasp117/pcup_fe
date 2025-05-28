import { Category } from "./Category";
import { Club } from "./Club";
import { Match } from "./Match";
import { Coach } from "./Person/Roles/Coach";
import { Player } from "./Person/Roles/Player";

export interface Team {
  id: number;
  name: string;
  players: Player[];
  coach: Coach;
  matches: Match[];
  club?: Club;
  //category?: Category;
  categoryId?: number;
  categoryName?: string;
}
