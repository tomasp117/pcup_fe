export default function ColorTest() {
    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
                🎨 Test barev
            </h1>

            {/* Hlavní barva (nová červená) */}
            <div className="p-4 bg-primary text-primary-foreground rounded-md shadow-md">
                Hlavní barva (Červená)
            </div>

            {/* Akcentní barva (nová černá) */}
            <div className="p-4 bg-accent text-accent-foreground rounded-md shadow-md">
                Akcentní barva (Černá)
            </div>

            {/* Navbar simulace */}
            <div className="p-4 bg-navbar text-navbar-text rounded-md shadow-md">
                Navbar (Černé pozadí, Bílé texty)
            </div>

            {/* Pozadí */}
            <div className="p-4 bg-background text-foreground rounded-md border border-navbar shadow-md">
                Hlavní pozadí (Bílé)
            </div>
            <div className="p-4 bg-tertiary text-tertiary-foreground rounded-md shadow-md">
                Terciární barva (Oranžová)
            </div>
        </div>
    );
}
