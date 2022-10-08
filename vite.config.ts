import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import wasm from "vite-plugin-wasm"
import svgr from "vite-plugin-svgr"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      makeAbsoluteExternalsRelative: true,
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  plugins: [
    tsconfigPaths(),
    react({
      jsxImportSource: "@basilisk/jsx",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    wasm(),
    svgr(),
  ],
})
