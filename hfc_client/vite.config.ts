import { defineConfig, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
// removed lovable-tagger per request

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  // Always use root base on Vercel/Netlify/static hosting
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
  // Vite's bundler mode allows using absolute path strings for aliases
  "@": "/src",
    },
  },
}));
