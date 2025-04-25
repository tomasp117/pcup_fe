import { Match } from "./Match";
import { Team } from "./Team";

export interface Group {
  id: number;
  name: string;
  teams: Team[];
  matches: Match[];
}
