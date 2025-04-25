import { Match } from "./Match";
import { Coach } from "./Person/Roles/Coach";
import { Player } from "./Person/Roles/Player";

export interface Team {
  id: number;
  name: string;
  players: Player[];
  coaches: Coach[];
  matches: Match[];
}
