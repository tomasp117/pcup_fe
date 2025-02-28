import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
        <nav className="fixed top-0 left-0 w-full bg-[hsl(var(--navbar-bg))] text-[hsl(var(--navbar-text))] shadow-md z-50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Hamburger Menu Icon (Mobil) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="block md:hidden text-black"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

                {/* Logo / Homepage Link */}
                <Link
                    to="/"
                    className="hidden md:block text-xl font-bold text-black"
                >
                    HandballApp
                </Link>

                {/* Hlavní navigace (Desktop) */}
                <div className="hidden md:flex flex-1 justify-center">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="flex items-center">
                                    Turnaj
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="absolute bg-white shadow-lg rounded-md">
                                    <ul className="flex flex-col w-48 text-black">
                                        <li>
                                            <Link
                                                to="/rozpis"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                            >
                                                Rozpis zápasů
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/tabulky"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                            >
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
                                <NavigationMenuContent className="absolute bg-white shadow-lg rounded-md">
                                    <ul className="flex flex-col text-black w-48">
                                        <li>
                                            <Link
                                                to="/teams/mini"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                            >
                                                Mini žáci
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/teams/mladsi"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                            >
                                                Mladší žáci
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/teams/starsi"
                                                className="block px-4 py-2 hover:bg-gray-200"
                                            >
                                                Starší žáci
                                            </Link>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/vysledky" className="text-">
                                        Výsledky
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Přihlášení / Uživatelský panel */}
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
                    "fixed inset-y-0 left-0 bg-white shadow-lg transform transition-transform",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
                style={{ width: "75%" }}
            >
                <div className="flex flex-col p-6 space-y-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="self-end text-black"
                    >
                        <X size={28} />
                    </button>
                    <Link to="/" className="text-xl font-bold text-black">
                        HandballApp
                    </Link>
                    <Link to="/" className="text-black">
                        Domů
                    </Link>
                    <Link to="/rozpis" className="text-black">
                        Rozpis zápasů
                    </Link>
                    <Link to="/tabulky" className="text-black">
                        Tabulky
                    </Link>
                    <Link to="/teams/mini" className="text-black">
                        Mini žáci
                    </Link>
                    <Link to="/teams/mladsi" className="text-black">
                        Mladší žáci
                    </Link>
                    <Link to="/teams/starsi" className="text-black">
                        Starší žáci
                    </Link>
                    <Link to="/vysledky" className="text-black">
                        Výsledky
                    </Link>
                    <Link to="/login" className="text-black">
                        Přihlásit se
                    </Link>
                </div>
            </div>
        </nav>
    );
};
