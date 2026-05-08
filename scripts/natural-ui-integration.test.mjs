import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readProjectFile(path) {
  return readFileSync(resolve(rootDir, path), "utf8");
}

test("launcher exposes the naturalUI static app", () => {
  const gamesSource = readProjectFile("src/data/games.js");

  assert.match(gamesSource, /id:\s*"natural-ui"/);
  assert.match(gamesSource, /href:\s*"\/games\/naturalUI\/"/);
  assert.match(
    gamesSource,
    /thumbnail:\s*"\/games\/naturalUI\/assets\/layers\/layer-001\.jpg"/
  );
});

test("naturalUI static runtime assets are present", () => {
  const requiredFiles = [
    "games/naturalUI/index.html",
    "games/naturalUI/assets/index.js",
    "games/naturalUI/assets/style.css",
    "games/naturalUI/assets/cloth.worker-BigqzsOf.js",
    "games/naturalUI/cloth-sim.wasm",
    "games/naturalUI/assets/layers/manifest.json",
    "games/naturalUI/assets/layers/layer-001.jpg"
  ];

  for (const file of requiredFiles) {
    assert.ok(existsSync(resolve(rootDir, file)), `${file} should exist`);
  }
});

test("build config copies the static naturalUI app to dist", () => {
  const configSource = readProjectFile("vite.config.js");

  assert.match(configSource, /copyNaturalUiStatic/);
  assert.match(configSource, /games\/naturalUI/);
  assert.match(configSource, /dist\/games\/naturalUI/);
});
