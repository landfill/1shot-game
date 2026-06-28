import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const staticApps = [
  {
    name: "natural-ui",
    source: "games/naturalUI",
    target: "dist/games/naturalUI"
  },
  {
    name: "vibe-fighter",
    source: "games/vibe-fighter",
    target: "dist/games/vibe-fighter"
  },
  {
    name: "hero-quest",
    source: "games/hero-quest",
    target: "dist/games/hero-quest"
  }
];

function copyStaticGameApps() {
  return {
    name: "copy-static-game-apps",
    apply: "build",
    writeBundle() {
      for (const app of staticApps) {
        const source = resolve(__dirname, app.source);
        const target = resolve(__dirname, app.target);

        if (existsSync(source)) {
          rmSync(target, { recursive: true, force: true });
          cpSync(source, target, { recursive: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [copyStaticGameApps()],
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
