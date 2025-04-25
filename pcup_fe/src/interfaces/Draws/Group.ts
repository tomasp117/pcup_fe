import { TeamDraw } from "./TeamDraw";

export interface Group {
  id: number;
  name: string;
  teams: TeamDraw[];
}
