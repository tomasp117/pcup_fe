import { MatchSelector } from "@/components/MatchReport/MatchSelector";
import { MatchProvider } from "@/Contexts/MatchReportContext/MatchContext";
import { Match } from "@/interfaces/MatchReport/Match";
import { useLoaderData } from "react-router-dom";

export const MatchSelectorPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-16">
      <h2 className="text-2xl font-bold text-center">
        Vyberte zápas pro zápis
      </h2>

      <MatchSelector />
    </div>
  );
};
