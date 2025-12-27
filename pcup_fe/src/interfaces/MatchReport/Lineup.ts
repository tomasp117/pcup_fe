import { LineupPlayer } from "./LineupPlayer";

export interface Lineup {
  id?: number;
  matchId: number;
  teamId: number;
  players: LineupPlayer[];
}
