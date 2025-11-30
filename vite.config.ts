import dotenv from "dotenv";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}`, quiet: true });

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/v1"),
      }
    }
  },
  ssr: {
    noExternal: ["@mui/x-data-grid"],
  },
});
