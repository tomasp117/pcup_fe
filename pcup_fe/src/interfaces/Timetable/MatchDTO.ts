import { GroupDTO } from "./GroupDTO";
import { TeamDTO } from "./TeamDTO";

export interface MatchDTO {
  id: number;
  time: string;
  timePlayed: string;
  playground: string;
  //score: string;
  scoreHome: number;
  scoreAway: number;
  state: string;
  homeTeam: TeamDTO | null;
  awayTeam: TeamDTO | null;
  group: GroupDTO;
}
