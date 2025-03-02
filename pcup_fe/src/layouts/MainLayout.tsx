import { useState } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";

export const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-all">
      {/* Sidebar s ovládáním sbalení */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Hlavní obsah */}
        <main className={`flex-1 container mx-auto px-4 md:px-16 pt-[72px]`}>
          <Outlet />
        </main>
        {location.pathname === "/" && <Footer />}
      </div>
    </div>
  );
};
