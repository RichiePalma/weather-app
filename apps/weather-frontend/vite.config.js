import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/weather-app/",
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/ipapi": "http://localhost:3000",
      "/nws": "http://localhost:3000",
    },
  },
});
