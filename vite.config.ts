import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // base: "/tiket-online/",
  plugins: [react()],
  server: {
    allowedHosts: ["1f49c57bcdd0.ngrok-free.app"],
  },
});
