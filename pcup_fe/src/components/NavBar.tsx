import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"; // ShadCN Navigation Menu
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger Menu Icon (Mobil) */}
        <button onClick={() => setIsOpen(!isOpen)} className="block md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          HandballApp
        </Link>

        {/* Hlavní navigace (Desktop) */}
        <div className="navbar-menu">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center">
                  Turnaj
                </NavigationMenuTrigger>
                <NavigationMenuContent className="dropdown">
                  <ul className="flex flex-col">
                    <li>
                      <Link to="/rozpis" className="dropdown-item">
                        Rozpis zápasů
                      </Link>
                    </li>
                    <li>
                      <Link to="/tabulky" className="dropdown-item">
                        Tabulky
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center">
                  Týmy
                </NavigationMenuTrigger>
                <NavigationMenuContent className="dropdown">
                  <ul className="flex flex-col">
                    <li>
                      <Link to="/teams/mini" className="dropdown-item">
                        Mini žáci
                      </Link>
                    </li>
                    <li>
                      <Link to="/teams/mladsi" className="dropdown-item">
                        Mladší žáci
                      </Link>
                    </li>
                    <li>
                      <Link to="/teams/starsi" className="dropdown-item">
                        Starší žáci
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/vysledky" className="navbar-link">
                    Výsledky
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Přihlášení */}
        <div className="hidden md:flex">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary-dark transition-colors"
          >
            Přihlásit se
          </Link>
        </div>
      </div>

      {/* Mobilní Sidebar */}
      <div
        className={cn(
          "sidebar",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col p-6 space-y-4">
          <button onClick={() => setIsOpen(false)} className="self-end">
            <X size={28} />
          </button>
          <Link to="/" className="sidebar-item">
            Domů
          </Link>
          <Link to="/rozpis" className="sidebar-item">
            Rozpis zápasů
          </Link>
          <Link to="/tabulky" className="sidebar-item">
            Tabulky
          </Link>
          <Link to="/teams/mini" className="sidebar-item">
            Mini žáci
          </Link>
          <Link to="/teams/mladsi" className="sidebar-item">
            Mladší žáci
          </Link>
          <Link to="/teams/starsi" className="sidebar-item">
            Starší žáci
          </Link>
          <Link to="/vysledky" className="sidebar-item">
            Výsledky
          </Link>
          <Link to="/login" className="sidebar-item">
            Přihlásit se
          </Link>
        </div>
      </div>
    </nav>
  );
};
