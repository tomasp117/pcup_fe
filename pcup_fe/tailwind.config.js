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
		  background: "hsl(var(--background))",
		  foreground: "hsl(var(--foreground))",
		  primary: {
			DEFAULT: "hsl(var(--primary))",
			foreground: "hsl(var(--primary-foreground))",
		  },
		  tertiary: {
			DEFAULT: "hsl(var(--tertiary))",
			foreground: "hsl(var(--tertiary-foreground))",
		  },
		  accent: {
			DEFAULT: "hsl(var(--accent))",
			foreground: "hsl(var(--accent-foreground))",
		  },
		  navbar: {
			DEFAULT: "hsl(var(--navbar-bg))",
			text: "hsl(var(--navbar-text))",
		  },
		},
	  },
	},
	plugins: [require("tailwindcss-animate")],
  };
  