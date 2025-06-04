import { LineupPlayer } from "./LineupPlayer";
import { Player } from "./Person/Roles/Player";

export interface Lineup {
  id?: number;
  matchId: number;
  teamId: number;
  players: LineupPlayer[];
}
