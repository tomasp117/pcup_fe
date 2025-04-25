import { Coach } from "../MatchReport/Person/Roles/Coach";
import { Player } from "../MatchReport/Person/Roles/Player";

export interface TeamDetailDTO {
  id: number;
  name: string;
  clubId: number;
  clubName: string;
  categoryId: number;
  categoryName: string;
  tournamentInstanceId: number;
  tournamentInstanceNum: number;
  groupId?: number;
  groupName?: string;
  players: Player[];
  coaches: Coach[];
}
