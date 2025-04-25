import { Person } from "../Person";

export interface Player {
  id: number;
  number: number;
  goalCount: number;
  twoMinPenaltyCount: number;
  sevenMeterGoalCount: number;
  sevenMeterMissCount: number;
  yellowCardCount: number;
  redCardCount: number;
  teamId: number;
  categoryId: number;
  person: Person;
}
