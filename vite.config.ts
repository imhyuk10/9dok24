import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import electron from "vite-plugin-electron";
import renderer from "vite-plugin-electron-renderer";

// file:// 프로토콜에서 crossorigin 속성이 CORS 에러를 유발하므로 제거
function removeCrossOrigin(): Plugin {
  return {
    name: "remove-crossorigin",
    enforce: "post",
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, "");
    },
  };
}

export default defineConfig({
  base: "./",
  server: {
    host: "localhost",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    electron([
      { entry: "electron/main.ts" },
      {
        entry: "electron/preload.ts",
        onstart(options) { options.reload(); },
      },
    ]),
    renderer(),
    removeCrossOrigin(),
  ],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
