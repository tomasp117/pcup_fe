export interface TeamDTO {
  id: number;
  name: string;
  clubId: number;
  clubName: string;
  categoryId: number;
  tournamentInstanceId: number;
  tournamentInstanceNum: number;
  groupId?: number;
  groupName?: string;
}
