import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ErrorPage = () => {
  const error = useRouteError();

  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error)
    ? error.statusText || "Tahle stránka se asi ztratila..."
    : (error as Error)?.message || "Ups! Něco se pokazilo.";

  const funnyText =
    status === 404
      ? "Ooopsie, špatná stránka 👻"
      : "Server měl zřejmě špatný den 😬";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md text-center bg-white shadow-lg rounded-lg p-8 border border-red-300">
        <div className="flex justify-center mb-4 text-red-500">
          <Ghost size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {status === 404 ? "404 – Nenalezeno" : `Chyba ${status}`}
        </h1>
        <p className="text-gray-700 text-base mb-2">{message}</p>
        <p className="text-sm text-muted-foreground mb-6">{funnyText}</p>
        <Button asChild variant="default">
          <Link to="/">🏠 Zpět domů</Link>
        </Button>
      </div>
    </div>
  );
};
