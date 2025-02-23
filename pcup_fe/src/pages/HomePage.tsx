import TeamCard from "@/components/HomePage/TeamCard";
// import StatsCard from "@/components/HomePage/StatsCard";
// import MatchesCard from "@/components/HomePage/MatchesCard";
// import ResultsCard from "@/components/HomePage/ResultsCard";

export default function HomePage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-6">
                Vítejte na PCUP Turnaji!
            </h1>

            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TeamCard />
                {/* <StatsCard />
                <MatchesCard />
                <ResultsCard /> */}
            </div>
        </div>
    );
}
