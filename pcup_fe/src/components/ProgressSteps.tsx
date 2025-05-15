type Props = {
  step: number;
};

export const ProgressSteps = ({ step }: Props) => {
  const steps = ["Turnaj", "Ročník", "Kategorie"];

  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((label, index) => {
        const current = index + 1;
        return (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
                current <= step ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              {current}
            </div>
            <span className={`${current === step ? "font-semibold" : ""}`}>
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
