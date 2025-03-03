import { useMatchContext } from "@/Contexts/MatchReportContext/MatchContext";
import ScoreAndTime from "./ScoreAndTime";
import {
  CardContent,
  CardMatchReport,
  CardMatchReportHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const MatchInfo = () => {
  return (
    <CardMatchReport className="w-full h-min shadow-lg">
      {/* Header - Kategorie */}
      <CardMatchReportHeader className=" text-white text-center py-3">
        <h2 className="text-lg font-semibold">Kategorie:</h2>
      </CardMatchReportHeader>

      {/* Obsah */}
      <CardContent className="p-6 grid grid-cols-3 gap-4 items-center">
        {/* Domácí tým */}
        <CardMatchReport className=" items-center shadow-md w-full">
          <CardMatchReportHeader className=" text-white px-4 py-2 w-full">
            <h2 className="text-lg font-semibold">Domácí tým</h2>
          </CardMatchReportHeader>
          <CardContent className="flex flex-1 flex-col items-center mt-2">
            <Button className="bg-yellow-400 text-black">Start Timeout</Button>
            <div className="flex gap-2 mt-3">
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
            </div>
          </CardContent>
        </CardMatchReport>

        {/* Skóre a časomíra */}
        <ScoreAndTime />

        {/* Hostující tým */}
        <CardMatchReport className="flex flex-col items-center p-4 shadow-md rounded-lg w-full">
          <CardMatchReportHeader className=" text-white px-4 py-2 rounded-md">
            <h2 className="text-lg font-semibold">Hostující tým</h2>
          </CardMatchReportHeader>
          <CardContent className="flex flex-col items-center mt-2">
            <Button className="bg-yellow-400 text-black">Start Timeout</Button>
            <div className="flex gap-2 mt-3">
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
              <div className="w-5 h-5 bg-gray-500 rounded"></div>
            </div>
          </CardContent>
        </CardMatchReport>
      </CardContent>
    </CardMatchReport>
  );
};
