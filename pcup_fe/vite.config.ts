// import path from "path";
// import react from "@vitejs/plugin-react";
// import { defineConfig } from "vite";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true, // Otevře server pro všechny adresy
//     port: 5173,
//     strictPort: true,
//     cors: true, // Povolit CORS
//     origin: "https://8edf-109-81-120-179.ngrok-free.app",
//     hmr: {
//       protocol: "wss",
//       host: "8edf-109-81-120-179.ngrok-free.app", // BEZ HTTPS!!!
//       clientPort: 443,
//     },
//     allowedHosts: [
//       "localhost",
//       "127.0.0.1",
//       "8edf-109-81-120-179.ngrok-free.app", // Aktuální NGROK doména
//     ],
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });

import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // Použij localhost místo host: true
    port: 5173,
    strictPort: true,
    cors: true,
    hmr: true, // Odstranění ngrok specifických nastavení
    allowedHosts: ["localhost", "127.0.0.1"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
