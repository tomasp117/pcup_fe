import { Person } from "../Person";
import { Player } from "./Player";

export interface Coach {
  id: number;
  // playerVote: Player | null;
  // goalKeeperVote: Player | null;
  license: string;
  teamId: number;
  // categoryId: number;
  person: Person;
}
