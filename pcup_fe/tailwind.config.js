export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx,js,jsx}",
        "./components/**/*.{ts,tsx,js,jsx}",
        "./pages/**/*.{ts,tsx,js,jsx}",
    ],
    theme: {
        extend: {
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out forwards",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            },
            colors: {
                tertiary: "hsl(270, 80%, 50%)",
                "tertiary-dark": "hsl(270, 80%, 40%)",
                secondary: "hsl(0, 0%, 8%)",
                "secondary-dark": "hsl(0, 0%, 15%)",
                primary: "hsl(24, 96%, 48%)",
                "primary-dark": "hsl(24, 96%, 40%)",
                // primary: "hsl(140, 70%, 45%)", // Zelená
                // "primary-dark": "hsl(140, 70%, 35%)",

                // --primary: hsl(45, 95%, 55%), // Žlutá
                // --primary-dark: hsl(45, 95%, 45%),

                // --primary: hsl(0, 85%, 50%), // Červená
                // --primary-dark: hsl(0, 85%, 40%),

                // primary: "hsl(220, 80%, 50%)", // Modrá
                // "primary-dark": "hsl(220, 80%, 40%)",

                navbar: "hsl(0, 0%, 10%)",
                navbarText: "hsl(0, 0%, 100%)",
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground":
                        "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground":
                        "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

/*
Primary (Oranžová)
--primary: hsl(24, 96%, 48%);
--primary-dark: hsl(24, 96%, 40%);

primary (Zelená)
--primary-light: hsl(140, 70%, 55%);
--primary: hsl(140, 70%, 45%);
--primary-dark: hsl(140, 70%, 35%);

primary (Žlutá)
--primary-light: hsl(45, 95%, 65%);
--primary: hsl(45, 95%, 55%);
--primary-dark: hsl(45, 95%, 45%);

primary (Červená)
--primary-light: hsl(0, 85%, 65%);
--primary: hsl(0, 85%, 50%);
--primary-dark: hsl(0, 85%, 40%);

primary (Modrá)
--primary-light: hsl(220, 80%, 65%);
--primary: hsl(220, 80%, 50%);
--primary-dark: hsl(220, 80%, 40%);

*/
