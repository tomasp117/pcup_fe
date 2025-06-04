import { CardContent, CardMatchReport } from "@/components/ui/card";
import polanka from "@/assets/polanka.gif";
import ostrava from "@/assets/ostrava.gif";
import frydek from "@/assets/frydek.png";
import zubri from "@/assets/zubri.png";
import praha from "@/assets/praha.png";
import { Team } from "@/interfaces/MatchReport/Team";
import { useClubs } from "@/hooks/useClubs";

interface MatchTeamCardProps {
  team: Team;
  side: "home" | "away";
}
//const API_URL = "http://localhost:5056";

const API_URL_IMAGES = import.meta.env.VITE_API_URL_IMAGES;

// const teamLogos: Record<string, string> = {
//   Polanka: `${API_URL_IMAGES}/polanka.gif`,
//   Ostrava: `${API_URL_IMAGES}/ostrava.gif`,
//   "Frýdek-Místek": `${API_URL_IMAGES}/frydek.png`,
//   Zubří: `${API_URL_IMAGES}/zubri.png`,
//   Praha: `${API_URL_IMAGES}/praha.png`,
// };

export const MatchTeamCard = ({ team, side }: MatchTeamCardProps) => {
  const logo = team.club?.logo
    ? `${API_URL_IMAGES}/${team.club.logo}`
    : `${API_URL_IMAGES}/default-logo.png`;

  // const findLogo = () => {
  //   const teamName = team.name.toLowerCase();
  //   for (const key in teamLogos) {
  //     if (teamName.includes(key.toLowerCase())) {
  //       return teamLogos[key];
  //     }
  //   }
  //   return `${API_URL_IMAGES}/default-logo.png`; // fallback logo
  // };

  // const logo = findLogo();

  return (
    <CardMatchReport className="flex flex-col bg-gradient-to-b from-primary/10 to-transparent transition-all hover:shadow-xl hover:scale-105 flex-1 min-w-0 max-w-[40%] sm:max-w-[40%] h-auto">
      <CardContent className="flex flex-col items-center justify-center flex-1 p-0 sm:p-4 scale-[0.95] sm:scale-100">
        <div className="relative w-12 h-12 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 shadow-md bg-white">
          <img
            src={logo}
            alt={team.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <h2 className="text-sm sm:text-lg font-bold mt-2 sm:mt-3 text-primary text-center">
          {team.name}
        </h2>
        <p className="text-xs text-muted-foreground">
          {side === "home" ? "Domácí" : "Hosté"}
        </p>
      </CardContent>
    </CardMatchReport>
  );
};
