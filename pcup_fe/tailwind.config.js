export default {
	darkMode: ["class"],
	content: [
	  "./index.html",
	  "./src/**/*.{ts,tsx,js,jsx}",
	  "./components/**/*.{ts,tsx,js,jsx}",
	  "./pages/**/*.{ts,tsx,js,jsx}"
	],
	theme: {
	  extend: {
		colors: {
			primary: "hsl(270, 80%, 50%)", // Fialová
			"primary-dark": "hsl(270, 80%, 40%)", // Tmavší fialová pro hover
			secondary: "hsl(0, 0%, 8%)", // Černá
			"secondary-dark": "hsl(0, 0%, 15%)", // Světlejší černá pro hover
			tertiary: "hsl(24, 96%, 48%)", // Oranžová
			"tertiary-dark": "hsl(24, 96%, 40%)", // Tmavší oranžová pro hover
			navbar: "hsl(0, 0%, 10%)",
			navbarText: "hsl(0, 0%, 100%)",
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  