import { useUser } from "@/Contexts/UserContext";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRoles?: string[]; // Seznam povolených rolí
  children: React.ReactNode;
};

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const { user } = useUser();

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
