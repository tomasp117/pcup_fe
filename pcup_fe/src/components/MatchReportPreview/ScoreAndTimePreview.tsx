import { Match } from "@/interfaces/MatchReport/Match";
import { Button } from "../ui/button";
import { CardContent, CardContentNoPadding, CardMatchReport } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useEffect, useState } from "react";

export interface ScoreAndTimePreviewProps {
  match: Match;
  halftime: boolean;
}

export const ScoreAndTimePreview = ({
  match,
  halftime,
}: ScoreAndTimePreviewProps) => {
  const [isMobile, setIsMoile] = useState(false);

  const handleResize = () => {
    setIsMoile(window.innerWidth < 375);
  };

  // Add event listener for window resize
  useEffect(() => {
    handleResize(); // nastaví počáteční hodnotu
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-between flex-1 min-w-0 max-w-[20%] sm:max-w-[20%] gap-4">
      {!navigator.onLine && (
        <span className="text-red-500 text-xs">
          Jste offline – nesynchronizuje se
        </span>
      )}

      <div className="flex justify-between gap-1 sm:gap-4 w-full h-[30%]">
        {isMobile ? (
          <>
            <CardMatchReport className="flex-1 w-full sm:p-4 p-0 justify-center">
              <CardContentNoPadding className="flex items-center justify-center w-full">
                <h2 className="text-sm sm:text-2xl font-bold">
                  {match.homeScore} : {match.awayScore}
                </h2>
              </CardContentNoPadding>
            </CardMatchReport>
          </>
        ) : (
          <>
            <CardMatchReport className="flex-1 w-full sm:p-4 p-1 justify-center">
              <CardContentNoPadding className="flex items-center justify-center w-full">
                <h2 className="text-md sm:text-2xl font-bold">
                  {match.homeScore}
                </h2>
              </CardContentNoPadding>
            </CardMatchReport>

            <CardMatchReport className="flex-1 w-full sm:p-4 p-1 justify-center">
              <CardContentNoPadding className="flex items-center justify-center w-full">
                <h2 className="text-md sm:text-2xl font-bold">
                  {match.awayScore}
                </h2>
              </CardContentNoPadding>
            </CardMatchReport>
          </>
        )}
      </div>

      <CardMatchReport className="w-full flex justify-center h-[70%] sm:p-4 p-2 flex-1">
        <CardContent className="flex flex-col items-center w-full p-0  gap-4">
          <h1 className="text-sm sm:text-4xl font-bold flex flex-col text-center">
            <span className="text-sm">{halftime ? "2." : "1."} poločas</span>
            <span>{match.timePlayed}</span>
          </h1>
        </CardContent>
      </CardMatchReport>
    </div>
  );
};
