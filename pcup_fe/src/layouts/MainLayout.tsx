import { use, useEffect, useState } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Footer } from "./Footer";
import {
  EditionProvider,
  getDefaultEdition,
} from "@/Contexts/TournamentEditionContext";

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const { edition } = useParams();
  const navigate = useNavigate();

  const editionNumber = edition ? parseInt(edition) : getDefaultEdition();

  useEffect(() => {
    const defaultEdition = getDefaultEdition();

    if (edition && parseInt(edition) === defaultEdition) {
      const pathWithoutEdition =
        location.pathname.replace(`/${edition}`, "") || "/";
      if (location.pathname !== pathWithoutEdition) {
        navigate(pathWithoutEdition + location.search, { replace: true });
      }
    }
  }, [edition, location.pathname, location.search, navigate]);

  return (
    <EditionProvider value={editionNumber}>
      <div className="min-h-screen flex bg-background text-foreground transition-all">
        {/* Sidebar s ovládáním sbalení */}
        <Sidebar />

        <div className="flex flex-col flex-1">
          {/* Hlavní obsah */}
          <main
            className={`flex-1 container mx-auto px-4 md:px-16 pt-[72px] max-w-[calc(100vw-32px)]`}
          >
            <Outlet />
          </main>
          {location.pathname === "/" && <Footer />}
        </div>
      </div>
    </EditionProvider>
  );
};
