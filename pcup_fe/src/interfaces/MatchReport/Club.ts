import { Team } from "./Team";

export interface Club {
  id: number;
  name: string;
  logo: string;
  email: string;
  teams: Team[];
}
