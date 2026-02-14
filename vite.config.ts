import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/api/voice-agent/transcripts/live": {
        target: "ws://localhost:8000",
        ws: true,
      },
      "/api/chat/stream": {
        target: "ws://localhost:8000",
        ws: true,
      },
    },
  },
});
