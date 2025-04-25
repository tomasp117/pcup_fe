import { Group } from "./Group";
import { Match } from "./Match";
import { Coach } from "./Person/Roles/Coach";
import { Player } from "./Person/Roles/Player";

export interface Category {
  id: number;
  name: string;
  votingOpen: boolean;
  groups: Group[];
  voiting: Coach[];
  matches: Match[];
  stats: Player[];
}
