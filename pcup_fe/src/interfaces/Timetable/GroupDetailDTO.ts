import { GroupDTO } from "./GroupDTO";
import { MatchDTO } from "./MatchDTO";
import { TeamDTO } from "./TeamDTO";

export interface GroupDetailDTO extends GroupDTO {
  teams: TeamDTO[];
  matches: MatchDTO[];
}
