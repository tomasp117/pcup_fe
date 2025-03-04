import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Otevře server pro všechny adresy
    port: 5173,
    strictPort: true,
    cors: true, // Povolit CORS
    origin: "https://55ff-109-81-120-179.ngrok-free.app", // NGROK URL bez https:// na začátku!
    hmr: {
      protocol: "wss",
      host: "55ff-109-81-120-179.ngrok-free.app", // BEZ HTTPS!!!
      clientPort: 443,
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "55ff-109-81-120-179.ngrok-free.app", // Aktuální NGROK doména
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
