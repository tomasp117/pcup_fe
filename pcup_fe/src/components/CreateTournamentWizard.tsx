import { useState } from "react";

import { TournamentForm } from "@/pages/TournamentForm";
import { TournamentInstanceForm } from "@/pages/TournamentInstanceForm";
import { CategoryForm } from "@/pages/CategoryForm";
import { ProgressSteps } from "./ProgressSteps";

export const CreateTournamentWizard = () => {
  const [step, setStep] = useState(1);
  const [tournamentId, setTournamentId] = useState<number | null>(null);
  const [instanceId, setInstanceId] = useState<number | null>(null);

  const goNext = () => setStep((s) => s + 1);
  const goBack = () => setStep((s) => s - 1);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <ProgressSteps step={step} />
      {step === 1 && (
        <TournamentForm
          onSuccess={(id) => {
            setTournamentId(id);
            goNext();
          }}
        />
      )}
      {step === 2 && tournamentId !== null && (
        <TournamentInstanceForm
          tournamentId={tournamentId}
          onSuccess={(id) => {
            setInstanceId(id);
            goNext();
          }}
          onBack={goBack}
        />
      )}
      {step === 3 && instanceId !== null && (
        <CategoryForm instanceId={instanceId} onBack={goBack} />
      )}
    </div>
  );
};
