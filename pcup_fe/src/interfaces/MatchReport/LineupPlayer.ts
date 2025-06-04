import { Player } from "./Person/Roles/Player";

export interface LineupPlayer {
  id: number;
  lineupId: number;
  player: Player;
}
