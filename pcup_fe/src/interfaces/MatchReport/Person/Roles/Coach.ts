import { Person } from "../Person";

export interface Coach {
  id: number;
  // playerVote: Player | null;
  // goalKeeperVote: Player | null;
  license: string;
  teamId: number;
  // categoryId: number;
  person: Person;
}
