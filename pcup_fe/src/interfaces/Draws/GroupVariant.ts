import { Group } from "./Group";

export interface GroupVariant {
  groupCount: number;
  totalMatches: number;
  minMatchesPerTeam: number;
  groups: Group[];
}
