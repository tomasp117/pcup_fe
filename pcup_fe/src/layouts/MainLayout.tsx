import { useState } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { Link, Outlet } from "react-router-dom";
import { Footer } from "./Footer";

export default function MainLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-all">
      {/* Sidebar s ovládáním sbalení */}
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Hlavní obsah */}
        <main className={`flex-1 container mx-auto px-4 md:px-16 pt-[72px]`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
