import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    plugins: [react(), tailwindcss()],
    base: "/" + env.VITE_GITHUB_REPO,
    server: {
      fs: {
        strict: false,
      },
    },
  });
};
