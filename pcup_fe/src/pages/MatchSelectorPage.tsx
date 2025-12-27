import { MatchSelector } from "@/components/MatchReport/MatchSelector";

export const MatchSelectorPage = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center mt-16 px-4">
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-center mb-4">
          Vyberte zápas pro zápis
        </h2>

        <MatchSelector />
      </div>
    </div>
  );
};
