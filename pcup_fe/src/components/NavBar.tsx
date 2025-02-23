"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import reactLogo from "@/assets/react.svg";

export default function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            {/* Horní navbar */}
            <nav className="bg-navbar text-navbar-text p-4 shadow-md">
                <div className="mx-auto flex justify-between items-center">
                    {/* Hamburger button pro mobil */}
                    <button
                        className="sm:hidden order-1"
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                    {/* Logo/Homepage (bude vidět jen na desktopu) */}
                    <Link
                        to="/"
                        className="hidden sm:flex text-lg font-bold text-primary items-center gap-2"
                    >
                        <img src={reactLogo} alt="React" className="h-6" />
                    </Link>

                    {/* Desktop navigace */}
                    <div className="hidden sm:flex space-x-6">
                        <Link to="/teams" className="hover:text-primary">
                            Týmy
                        </Link>
                        <Link to="/stats" className="hover:text-primary">
                            Statistiky
                        </Link>
                        <Link to="/schedule" className="hover:text-primary">
                            Rozpis zápasů
                        </Link>
                    </div>

                    {/* Přihlášení */}
                    <div className="hidden sm:flex">
                        <Link
                            to="/login"
                            className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary/80"
                        >
                            Přihlásit se
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Sidebar overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar menu */}
            <div
                className={`fixed top-0 left-0 h-full w-3/4 bg-navbar text-navbar-text p-6 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 z-50`}
            >
                {/* Logo/Homepage (bude vidět jen na desktopu) */}
                <Link to="/" className="absolute top-4">
                    <img src={reactLogo} alt="React" className="h-6" />
                </Link>
                {/* Zavírací tlačítko */}
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsOpen(false)}
                >
                    <X size={28} />
                </button>

                {/* Odkazy v sidebaru */}
                <div className="flex flex-col space-y-4 mt-10">
                    <Link
                        to="/"
                        className="hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Domů
                    </Link>
                    <Link
                        to="/teams"
                        className="hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Týmy
                    </Link>
                    <Link
                        to="/stats"
                        className="hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Statistiky
                    </Link>
                    <Link
                        to="/schedule"
                        className="hover:text-primary"
                        onClick={() => setIsOpen(false)}
                    >
                        Rozpis zápasů
                    </Link>
                    <Link
                        to="/login"
                        className="bg-tertiary text-white px-4 py-2 rounded-md hover:bg-tertiary/80 text-center"
                        onClick={() => setIsOpen(false)}
                    >
                        Přihlásit se
                    </Link>
                </div>
            </div>
        </>
    );
}
