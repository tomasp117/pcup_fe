import { Outlet } from "react-router-dom";
import Navbar from "@/components/NavBar";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="container mx-auto p-6">
                <Outlet />
            </main>
        </div>
    );
}
