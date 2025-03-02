import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Trophy,
  Users,
  LogIn,
  Menu,
  X,
  ChevronDown,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetContentNoClose,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"; // ShadCN Sheet
import polankaLogo from "@/assets/polanka.gif";

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Domů", path: "/", icon: <Home /> },
    { name: "Rozpis utkání", path: "/rozpis", icon: <Trophy /> },
    { name: "Týmy", path: "/teams", icon: <Users /> },
    { name: "Výsledky", path: "/vysledky", icon: <Trophy /> },
    {
      name: "Kategorie",
      path: "/kategorie",
      icon: <Trophy />,
      children: [
        { name: "Mini žáci 4+1", path: "/kategorie/mini4" },
        { name: "Mini žáci 6+1", path: "/kategorie/mini6" },
        { name: "Mladší žáci", path: "/kategorie/mladsi" },
        { name: "Starší žáci", path: "/kategorie/starsi" },
        { name: "Mladší dorost", path: "/kategorie/mladsidorost" },
      ],
    },
  ];

  return (
    <div className="flex">
      {/* Mobilní Sidebar - ShadCN Sheet */}
      {isMobile && (
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <button className="fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md md:hidden">
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContentNoClose
            side="left"
            className="w-64 bg-white p-4 flex flex-col"
          >
            {/* OPRAVA - Přidání SheetHeader s SheetTitle */}
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center justify-center">
                  <img src={polankaLogo} alt="HandballApp" className="h-12" />
                </div>
              </SheetTitle>
            </SheetHeader>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4"
            >
              <X size={24} />
            </button>

            {/* Navigace obalená flex-1 */}
            <div className="flex-1 overflow-auto">
              <ul className="mt-6 flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path || "#"}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg transition-all",
                      location.pathname === item.path
                        ? "bg-primary text-white"
                        : "text-black-800 hover:bg-orange-200"
                    )}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </ul>
            </div>

            {/* Login Button ZAROVNANÝ DOLŮ */}
            <div className="p-4 border-t flex items-center justify-center">
              <Link
                to="/login"
                className="flex items-center space-x-2 text-black-800 hover:text-primary transition-all"
              >
                <UserCircle size={32} />
                <span>Přihlášení</span>
              </Link>
            </div>
          </SheetContentNoClose>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={cn(
            "fixed left-0 top-0 h-screen bg-white shadow-md transition-all duration-300 z-40 flex flex-col border-r",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Logo a tlačítko na sbalení */}
          <div className="flex p-4 justify-between items-center">
            {!isCollapsed && (
              <img src={polankaLogo} alt="HandballApp" className="h-12" />
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-full hover:hover:bg-gradient-to-b hover:from-primary/60 hover:to-transparent"
            >
              <Menu
                size={24}
                className={cn(isCollapsed ? "rotate-0" : "rotate-180")}
              />
            </button>
          </div>

          {/* Navigace */}
          <ul className="mt-2 flex flex-col flex-1">
            {menuItems.map((item) => (
              <div key={item.name}>
                {/* Collapsible sekce */}
                {item.children ? (
                  <div>
                    <Link
                      to={isCollapsed ? item.path : "#"}
                      onClick={() =>
                        !isCollapsed && setIsCategoriesOpen(!isCategoriesOpen)
                      }
                      className={cn(
                        "flex items-center w-full px-4 py-2 text-black-800 hover:hover:bg-gradient-to-b hover:from-primary/60 hover:to-transparent transition-all",
                        isCollapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      {item.icon}
                      {!isCollapsed && (
                        <>
                          <span className="ml-3">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "ml-auto transition-transform",
                              isCategoriesOpen ? "rotate-180" : ""
                            )}
                          />
                        </>
                      )}
                    </Link>
                    {/* Podkategorie */}
                    {!isCollapsed && (
                      <ul
                        className={cn(
                          "ml-6 border-l border-orange-300 pl-3 overflow-hidden transition-all",
                          isCategoriesOpen
                            ? "max-h-40 opacity-100"
                            : "max-h-0 opacity-0"
                        )}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            className="block px-4 py-1 text-black-700 rounded-lg hover:hover:bg-gradient-to-b hover:from-primary/60 hover:to-transparent"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-3 transition-all",
                      location.pathname === item.path
                        ? "bg-primary text-white"
                        : "text-black-800 hover:hover:bg-gradient-to-b hover:from-primary/60 hover:to-transparent",
                      isCollapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    {item.icon}
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </Link>
                )}
              </div>
            ))}
          </ul>

          {/* Login Button */}
          <div className="p-4 border-t flex items-center justify-center">
            <Link
              to="/login"
              className="flex items-center space-x-2 text-black-800 hover:text-primary transition-all"
            >
              <UserCircle size={32} />
              {!isCollapsed && <span>Přihlášení</span>}
            </Link>
          </div>
        </div>
      )}
      {/* Main Content */}
      {!isMobile && (
        <div
          className={cn(
            "flex-1 transition-all duration-300",
            isCollapsed ? "ml-20" : "ml-64"
          )}
        >
          {/* Tady bude hlavní obsah */}
        </div>
      )}
    </div>
  );
};
