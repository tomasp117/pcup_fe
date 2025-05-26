import { Team } from "./ITeam";

export interface Group {
  id: number | null;
  name: string;
  phase: string;
  teams: Team[];
}
