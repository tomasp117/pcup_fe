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
    origin: "https://9cc6-109-81-120-179.ngrok-free.app",
    hmr: {
      protocol: "wss",
      host: "9cc6-109-81-120-179.ngrok-free.app", // BEZ HTTPS!!!
      clientPort: 443,
    },
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "9cc6-109-81-120-179.ngrok-free.app", // Aktuální NGROK doména
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
