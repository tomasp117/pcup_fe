import { CardContent, CardMatchReport } from "@/components/ui/card";
import polanka from "@/assets/polanka.gif";
import ostrava from "@/assets/ostrava.gif";
import frydek from "@/assets/frydek.png";
import zubri from "@/assets/zubri.png";
import praha from "@/assets/praha.png";

export const MatchTeamCard = () => {
  return (
    <>
      <CardMatchReport className="flex flex-col bg-gradient-to-b from-primary/10 to-transparent transition-all hover:shadow-xl hover:scale-105 flex-1 min-w-0 max-w-[33%] sm:max-w-[40%] h-auto">
        <CardContent className="flex flex-col items-center justify-center flex-1 p-0 sm:p-4 scale-[0.95] sm:scale-100 ">
          <div className="max-w-[50%] xl:max-w-[30%] rounded-full overflow-hidden border-2 shadow-md">
            <img src={polanka} alt="polanka" className="w-full h-full" />
          </div>
          <h2 className="text-sm sm:text-lg font-bold mt-2 sm:mt-3 text-primary">
            Polanka
          </h2>
        </CardContent>
      </CardMatchReport>
    </>
  );
};
export default MatchTeamCard;
