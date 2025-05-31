import { useState } from "react";

import { TournamentForm } from "@/pages/TournamentForm";
import { TournamentInstanceForm } from "@/pages/TournamentInstanceForm";
import { CategoryForm } from "@/pages/CategoryForm";
import { ProgressSteps } from "./ProgressSteps";
import { ClubForm } from "@/pages/ClubForm";
import { TeamForm } from "@/pages/TeamForm";

export const CreateTournamentWizard = () => {
  const [step, setStep] = useState(1);
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [instanceId, setInstanceId] = useState<number | null>(null);

  const [tournamentName, setTournamentName] = useState<string | null>(null);
  const [tournamentInstanceEdition, setTournamentInstanceEdition] = useState<
    number | null
  >(null);

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  return (
    <div className="max-w-full md:max-w-3xl sm:max-w-2xl mx-auto p-4">
      <ProgressSteps
        step={step}
        tournamentName={tournamentName ?? undefined}
        tournamentInstanceEdition={tournamentInstanceEdition ?? undefined}
        onStepChange={setStep}
      />
      {step === 1 && (
        <TournamentForm
          onSuccess={(id, name) => {
            setTournamentId(id);
            setTournamentName(name);
            goNext();
          }}
        />
      )}
      {step === 2 && tournamentId !== null && (
        <TournamentInstanceForm
          tournamentId={tournamentId}
          onSuccess={(id, editionNumber) => {
            setInstanceId(id);
            setTournamentInstanceEdition(editionNumber);
            goNext();
          }}
          onBack={goBack}
        />
      )}
      {step === 3 && instanceId !== null && (
        <CategoryForm instanceId={instanceId} onBack={goBack} onSkip={goNext} />
      )}
      {step === 4 && <ClubForm onBack={goBack} onSkip={goNext} />}
      {step === 5 && <TeamForm instanceId={instanceId} />}
    </div>
  );
};
