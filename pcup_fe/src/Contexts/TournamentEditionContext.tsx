import { useParams } from "react-router-dom";
import { createContext, useContext } from "react";

const DEFAULT_EDITION = 2025;

const EditionContext = createContext<number>(DEFAULT_EDITION);

export const useEdition = () => useContext(EditionContext);
export const getDefaultEdition = () => DEFAULT_EDITION;

export const EditionProvider = ({
  value,
  children,
}: {
  value: number;
  children: React.ReactNode;
}) => {
  const { edition } = useParams();
  const editionNumber = edition ? parseInt(edition) : DEFAULT_EDITION;

  return (
    <EditionContext.Provider value={value}>{children}</EditionContext.Provider>
  );
};
