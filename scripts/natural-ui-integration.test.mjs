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

  assert.match(configSource, /copyStaticGameApps/);
  assert.match(configSource, /games\/naturalUI/);
  assert.match(configSource, /dist\/games\/naturalUI/);
});

test("launcher exposes the vibe fighter static app", () => {
  const gamesSource = readProjectFile("src/data/games.js");

  assert.match(gamesSource, /id:\s*"vibe-fighter"/);
  assert.match(gamesSource, /href:\s*"\/games\/vibe-fighter\/"/);
  assert.match(
    gamesSource,
    /thumbnail:\s*"\/games\/vibe-fighter\/assets\/mode-cards\/mode-1v1-card\.png"/
  );
});

test("vibe fighter static runtime assets are present", () => {
  const requiredFiles = [
    "games/vibe-fighter/index.html",
    "games/vibe-fighter/favicon.svg",
    "games/vibe-fighter/assets/mode-cards/mode-1v1-card.png",
    "games/vibe-fighter/assets/config/game-config.json",
    "games/vibe-fighter/configs/fighter-playground.json"
  ];

  for (const file of requiredFiles) {
    assert.ok(existsSync(resolve(rootDir, file)), `${file} should exist`);
  }
});

test("launcher exposes the hero quest static app", () => {
  const gamesSource = readProjectFile("src/data/games.js");

  assert.match(gamesSource, /id:\s*"hero-quest"/);
  assert.match(gamesSource, /href:\s*"\/games\/hero-quest\/"/);
  assert.match(
    gamesSource,
    /thumbnail:\s*"\/games\/hero-quest\/assets\/splash\/hero-quest-splash\.png"/
  );
});

test("hero quest static runtime assets are present", () => {
  const requiredFiles = [
    "games/hero-quest/index.html",
    "games/hero-quest/game.js",
    "games/hero-quest/style.css",
    "games/hero-quest/assets/tiles/quest/atlas-transparent.png",
    "games/hero-quest/assets/hero-v2/idle.png",
    "games/hero-quest/assets/enemies/purple-orc/idle.png",
    "games/hero-quest/assets/levels/level-1.json"
  ];

  for (const file of requiredFiles) {
    assert.ok(existsSync(resolve(rootDir, file)), `${file} should exist`);
  }
});
