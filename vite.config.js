import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "sakura-football": resolve(__dirname, "games/sakura-football/index.html"),
        "voxel-pagoda-rpg": resolve(__dirname, "games/voxel-pagoda-rpg/index.html")
      }
    }
  }
});
