import { Group } from "../Draws/Group";
import { GroupVariant } from "../Draws/GroupVariant";
import { TeamDraw } from "../Draws/TeamDraw";

export interface CategoryData {
  teams: TeamDraw[];
  groups: Group[];
  selectedVariant: GroupVariant | null;
  groupVariants: GroupVariant[];
}
