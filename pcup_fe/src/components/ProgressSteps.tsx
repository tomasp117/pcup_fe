type Props = {
  step: number;
  tournamentName?: string;
  tournamentInstanceEdition?: number;
  onStepChange?: (step: number) => void;
};
export const ProgressSteps = ({
  step,
  tournamentName,
  tournamentInstanceEdition,
  onStepChange,
}: Props) => {
  const steps = [
    `Turnaj${tournamentName ? `: ${tournamentName}` : ""}`,
    `Ročník${
      tournamentInstanceEdition ? `: ${tournamentInstanceEdition}` : ""
    }`,
    "Kategorie",
    "Kluby",
    "Týmy",
  ];

  return (
    <div className="flex justify-center items-center gap-4 mb-6 select-none">
      {steps.map((label, index) => {
        const current = index + 1;
        const isClickable =
          current < step && typeof onStepChange === "function";
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white transition
                ${
                  current < step
                    ? "bg-green-500 cursor-pointer hover:scale-105"
                    : current === step
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              style={{
                boxShadow: current === step ? "0 0 0 3px #F59E42" : undefined,
              }}
              onClick={() => isClickable && onStepChange(current)}
              tabIndex={isClickable ? 0 : -1}
              role={isClickable ? "button" : undefined}
              aria-disabled={!isClickable}
              title={isClickable ? `Vrátit se na tento krok` : undefined}
            >
              {current}
            </div>
            <span
              className={`${current === step ? "font-semibold" : ""} ${
                isClickable ? "cursor-pointer underline" : ""
              }`}
              onClick={() => isClickable && onStepChange(current)}
              tabIndex={isClickable ? 0 : -1}
              role={isClickable ? "button" : undefined}
              aria-disabled={!isClickable}
            >
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className="w-6 h-1 bg-gray-300 rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
};
