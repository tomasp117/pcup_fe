import { Team } from "./Team";

// export interface Club {
//   id: number;
//   name: string;
//   logo: string;
//   email: string;
//   teams: Team[];
// }

export interface Club {
  id: number;
  name: string;
  email?: string;
  address?: string;
  website?: string;
  state?: string;
  logo: string;
  teams: Team[];
}
