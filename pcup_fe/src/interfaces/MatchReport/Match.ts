import { Referee } from "./Person/Roles/Referee";
import { Team } from "./Team";

export interface Match {
  id: number;
  time: string;
  timePlayed: string;
  playground: string;
  homeTeam: Team;
  awayTeam: Team;
  score: string;
  state: "None" | "Generated" | "Pending" | "Done";
  events: Event[];
  referees: Referee[];
}
