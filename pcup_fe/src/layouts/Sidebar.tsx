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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoginDialog } from "@/components/Login/LoginDialog";
import { useUser } from "@/Contexts/UserContext";
import { Button } from "@/components/ui/button";

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
    { name: "Rozpis utkání", path: "/match_report", icon: <Trophy /> },
    { name: "Draws", path: "/draws", icon: <Users /> },
    { name: "Výsledky", path: "/time-table", icon: <Trophy /> },
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

  const { user, logout } = useUser();

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
                        : " hover:bg-primary/10"
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
              {user ? (
                <div className="flex flex-col items-center space-y-2 w-full">
                  <div className="flex items-center space-x-2">
                    <UserCircle size={36} />
                    <div>
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="text-red-500 w-full text-center py-2 rounded-md hover:bg-red-100"
                  >
                    Odhlásit se
                  </button>
                </div>
              ) : (
                <LoginDialog isCollapsed={false} />
              )}
            </div>
          </SheetContentNoClose>
        </Sheet>
      )}
      <TooltipProvider>
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
                className="p-2 rounded-full sidebar-item-hover"
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
                  {item.children ? (
                    <div>
                      <Link
                        to={isCollapsed ? item.path : "#"}
                        onClick={() =>
                          !isCollapsed && setIsCategoriesOpen(!isCategoriesOpen)
                        }
                        className={cn(
                          "flex items-center w-full px-4 py-2 sidebar-item-hover transition-all",
                          isCollapsed ? "justify-center" : "justify-start"
                        )}
                      >
                        {isCollapsed ? (
                          // 🛠 Tooltip pro sbalený sidebar
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center justify-center w-full">
                                {item.icon}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.name}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <>
                            {item.icon}
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
                      {!isCollapsed && (
                        <ul
                          className={cn(
                            "ml-6 border-l border-primary/10 pl-3 transition-all",
                            isCategoriesOpen
                              ? "max-h-40 opacity-100"
                              : "max-h-0 opacity-0"
                          )}
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="block px-4 py-1 rounded-lg sidebar-item-hover"
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
                          : " sidebar-item-hover",
                        isCollapsed ? "justify-center" : "justify-start"
                      )}
                    >
                      {isCollapsed ? (
                        // 🛠 Tooltip pro sbalený sidebar
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center justify-center w-full">
                              {item.icon}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <>
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </ul>

            {/* Login Button */}
            {/* <div className="p-4 border-t flex items-center justify-center">
              <Link
                to="/login"
                className="flex items-center space-x-2  hover:text-primary transition-all"
              >
                <UserCircle size={32} />
                {!isCollapsed && <span>Přihlášení</span>}
              </Link>
            </div> */}
            <div className="border-t flex items-center justify-center p-4">
              {user ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCircle size={32} />
                    {!isCollapsed && (
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                      </div>
                    )}
                  </div>
                  {!isCollapsed && (
                    <Button
                      variant="ghost"
                      onClick={logout}
                      className="text-red-500 mt-1 text-sm hover:bg-red-100 hover:text-red-500"
                    >
                      Odhlásit se
                    </Button>
                  )}
                </div>
              ) : (
                <LoginDialog isCollapsed={isCollapsed} />
              )}
            </div>
          </div>
        )}
      </TooltipProvider>
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
