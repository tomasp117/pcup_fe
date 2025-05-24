import { GroupDTO } from "./GroupDTO";
import { TeamDTO } from "./TeamDTO";

export interface MatchDTO {
  id: number;
  time: string;
  timePlayed: string;
  playground: string;
  //score: string;
  homeScore: number;
  awayScore: number;
  state: string;
  homeTeam: TeamDTO | null;
  awayTeam: TeamDTO | null;
  group: GroupDTO;
}
