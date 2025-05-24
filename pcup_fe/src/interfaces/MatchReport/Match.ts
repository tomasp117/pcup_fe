import { Referee } from "./Person/Roles/Referee";
import { Team } from "./Team";
import { Event } from "./Event";
import { Category } from "./Category";

export interface Match {
  id: number;
  time: string;
  timePlayed: string;
  playground: string;
  homeTeam: Team;
  awayTeam: Team;
  // homeScore: number;
  // awayScore: number;
  awayScore: number;
  homeScore: number;
  state: "None" | "Generated" | "Pending" | "Done";
  events: Event[];
  referees: Referee[];
  category: Category;
}
