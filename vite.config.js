import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

function copyNaturalUiStatic() {
  return {
    name: "copy-natural-ui-static",
    apply: "build",
    writeBundle() {
      const source = resolve(__dirname, "games/naturalUI");
      const target = resolve(__dirname, "dist/games/naturalUI");

      if (existsSync(source)) {
        cpSync(source, target, { recursive: true });
      }
    }
  };
}

export default defineConfig({
  plugins: [copyNaturalUiStatic()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "eastern-clash-shadow-arena": resolve(__dirname, "games/eastern-clash-shadow-arena/index.html"),
        "sakura-football": resolve(__dirname, "games/sakura-football/index.html"),
        "voxel-pagoda-rpg": resolve(__dirname, "games/voxel-pagoda-rpg/index.html")
      }
    }
  }
});
