const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BASE = document.baseURI;
const LEVEL_IDS = ["level-1", "level-2", "level-3"];
const GRAVITY = 2100;
const WALK_SPEED = 280;
const JUMP_SPEED = 760;
const HERO_SCALE = 0.72;
const ENEMY_SCALE = 0.68;

const ui = {
  levelTitle: document.querySelector("#levelTitle"),
  health: document.querySelector("#healthReadout"),
  coins: document.querySelector("#coinReadout"),
  coinTotal: document.querySelector("#coinTotalReadout"),
  overlay: document.querySelector("#overlay"),
  overlayKicker: document.querySelector("#overlayKicker"),
  overlayTitle: document.querySelector("#overlayTitle"),
  start: document.querySelector("#startButton"),
  restart: document.querySelector("#restartButton"),
  levelButtons: [...document.querySelectorAll(".level-button")]
};

const keys = new Set();
const assets = {};
const state = {
  started: false,
  levelId: "level-1",
  level: null,
  frames: new Map(),
  cameraX: 0,
  coins: new Set(),
  hazards: [],
  platforms: [],
  enemies: [],
  portal: null,
  messageTimer: 0,
  completed: false,
  player: makePlayer()
};

function asset(path) {
  return new URL(path, BASE).href;
}

function makePlayer() {
  return {
    x: 140,
    y: 260,
    vx: 0,
    vy: 0,
    width: 54,
    height: 118,
    health: 100,
    facing: 1,
    grounded: false,
    invincible: 0,
    attack: 0,
    anim: "idle",
    animTime: 0
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function frameRect(entity) {
  return {
    x: entity.x - entity.width / 2,
    y: entity.y - entity.height,
    width: entity.width,
    height: entity.height
  };
}

function objectDrawRect(object, frame) {
  const scale = object.scale ?? 1;
  const anchor = frame.anchor ?? { x: 0.5, y: 1 };
  const width = frame.bounds.width * scale;
  const height = frame.bounds.height * scale;

  return {
    x: object.x - width * anchor.x,
    y: object.y - height * anchor.y,
    width,
    height
  };
}

function objectCollisionRect(object, frame, collision = frame.collision ?? frame.trigger ?? frame.bounds) {
  const draw = objectDrawRect(object, frame);
  const scale = object.scale ?? 1;
  const source = frame.collision ?? frame.trigger ? collision : {
    x: 0,
    y: 0,
    width: frame.bounds.width,
    height: frame.bounds.height
  };

  return {
    x: draw.x + source.x * scale,
    y: draw.y + source.y * scale,
    width: source.width * scale,
    height: source.height * scale
  };
}

async function loadJson(path) {
  const response = await fetch(asset(path));
  if (!response.ok) {
    throw new Error(`Could not load ${path}`);
  }
  return response.json();
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${path}`));
    image.src = asset(path);
  });
}

async function boot() {
  const [tileManifest, heroManifest, orcManifest, levels, tileAtlas, uiAtlas, heroIdle, heroWalk, heroRun, heroJump, heroPunch, heroHurt, heroDeath, orcIdle, orcRun, orcAttack, bgFar, bgMid, bgFront] = await Promise.all([
    loadJson("assets/tiles/quest/atlas-transparent.manifest.json"),
    loadJson("assets/hero-v2/manifest.json"),
    loadJson("assets/enemies/purple-orc/manifest.json"),
    loadJson("assets/levels/index.json"),
    loadImage("assets/tiles/quest/atlas-transparent.png"),
    loadImage("assets/ui/quest/ui-atlas-transparent.png"),
    loadImage("assets/hero-v2/idle.png"),
    loadImage("assets/hero-v2/walk.png"),
    loadImage("assets/hero-v2/run.png"),
    loadImage("assets/hero-v2/jump.png"),
    loadImage("assets/hero-v2/light-punch.png"),
    loadImage("assets/hero-v2/hurt.png"),
    loadImage("assets/hero-v2/death.png"),
    loadImage("assets/enemies/purple-orc/idle.png"),
    loadImage("assets/enemies/purple-orc/run.png"),
    loadImage("assets/enemies/purple-orc/attack.png"),
    loadImage("assets/backgrounds/quest-far.png"),
    loadImage("assets/backgrounds/quest-mid.png"),
    loadImage("assets/backgrounds/quest-foreground.png")
  ]);

  tileManifest.frames.forEach((frame) => state.frames.set(frame.name, frame));
  assets.tileAtlas = tileAtlas;
  assets.uiAtlas = uiAtlas;
  assets.hero = {
    idle: anim(heroIdle, findAnim(heroManifest, "idle")),
    walk: anim(heroWalk, findAnim(heroManifest, "walk")),
    run: anim(heroRun, findAnim(heroManifest, "run")),
    jump: anim(heroJump, findAnim(heroManifest, "jump")),
    punch: anim(heroPunch, findAnim(heroManifest, "light-punch")),
    hurt: anim(heroHurt, findAnim(heroManifest, "hurt")),
    death: anim(heroDeath, findAnim(heroManifest, "death"))
  };
  assets.orc = {
    idle: anim(orcIdle, findAnim(orcManifest, "idle")),
    run: anim(orcRun, findAnim(orcManifest, "run")),
    attack: anim(orcAttack, findAnim(orcManifest, "attack"))
  };
  assets.bg = { far: bgFar, mid: bgMid, front: bgFront };
  assets.levels = levels.levels;

  await loadLevel("level-1");
  bindInput();
  requestAnimationFrame(loop);
}

function findAnim(manifest, action) {
  return manifest.animations.find((item) => item.action === action);
}

function anim(image, meta) {
  const rows = meta.rows || Math.ceil(meta.frames / meta.columns);
  return {
    image,
    frames: meta.frames,
    columns: meta.columns,
    frameRate: meta.frameRate,
    frameWidth: image.width / meta.columns,
    frameHeight: image.height / rows
  };
}

async function loadLevel(levelId) {
  const entry = assets.levels?.find((level) => level.id === levelId);
  const levelExport = await loadJson(`assets/levels/${levelId}.json`);
  const level = levelExport.level ?? levelExport;
  state.levelId = levelId;
  state.level = level;
  state.cameraX = 0;
  state.completed = false;
  state.messageTimer = 0;
  state.coins = new Set();
  state.hazards = [];
  state.platforms = [];
  state.enemies = [];
  state.portal = null;
  state.player = makePlayer();
  state.player.x = level.playerStart.x;
  state.player.y = level.playerStart.y;

  for (const object of level.objects) {
    const frame = state.frames.get(object.frameName);
    if (object.frameName === "enemy-v3-purple-orc") {
      state.enemies.push({
        ...object,
        x: object.x,
        y: object.y,
        homeX: object.x,
        vx: -70,
        health: 2,
        alive: true,
        attack: 0,
        animTime: 0,
        width: 60,
        height: 112
      });
      continue;
    }

    if (!frame) {
      continue;
    }
    if (frame.kind === "whole-platform" || frame.kind === "repeatable-tile") {
      state.platforms.push({ object, rect: objectCollisionRect(object, frame) });
    }
    if (frame.kind === "hazard") {
      state.hazards.push({ object, rect: objectCollisionRect(object, frame) });
    }
    if (frame.kind === "collectible") {
      state.coins.add(object.id);
    }
    if (object.frameName === "portal-exit-complete") {
      state.portal = { object, rect: objectCollisionRect(object, frame, frame.trigger) };
    }
  }

  ui.levelTitle.textContent = entry?.title ?? level.title;
  ui.coinTotal.textContent = `${state.coins.size}`;
  ui.levelButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.level === levelId));
}

function bindInput() {
  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "Space"].includes(event.code)) {
      event.preventDefault();
    }
    keys.add(event.code);
    if (event.code === "KeyR") {
      restart();
    }
  });
  window.addEventListener("keyup", (event) => keys.delete(event.code));
  ui.start.addEventListener("click", () => {
    if (state.player && state.player.health <= 0) {
      restart();
    } else {
      start();
    }
  });
  ui.restart.addEventListener("click", () => restart());
  ui.levelButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      await loadLevel(button.dataset.level);
      start();
    });
  });
}

function start() {
  state.started = true;
  ui.overlay.classList.remove("is-visible");
}

function showOverlay(kicker, title) {
  ui.overlayKicker.textContent = kicker;
  ui.overlayTitle.textContent = title;
  ui.start.textContent = "다시 하기";
  ui.overlay.classList.add("is-visible");
}

function restart() {
  loadLevel(state.levelId).then(start);
}

let lastTime = 0;
function loop(time) {
  const dt = Math.min(0.033, (time - lastTime) / 1000 || 0);
  lastTime = time;

  if (state.started && state.level) {
    update(dt);
  }
  draw();
  requestAnimationFrame(loop);
}

function update(dt) {
  const player = state.player;
  player.animTime += dt;
  player.invincible = Math.max(0, player.invincible - dt);
  player.attack = Math.max(0, player.attack - dt);

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const jump = keys.has("ArrowUp") || keys.has("KeyW") || keys.has("Space");
  const attack = keys.has("KeyJ") || keys.has("KeyX");

  player.vx = 0;
  if (left) player.vx -= WALK_SPEED;
  if (right) player.vx += WALK_SPEED;
  if (player.vx !== 0) player.facing = Math.sign(player.vx);
  if (jump && player.grounded) {
    player.vy = -JUMP_SPEED;
    player.grounded = false;
  }
  if (attack && player.attack <= 0) {
    player.attack = 0.22;
    player.animTime = 0;
  }

  player.vy += GRAVITY * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.grounded = false;

  resolvePlatforms(player);
  updateEnemies(dt);
  resolveHazards();
  resolveCoins();
  resolvePortal();
  updateCamera();
  updateHud();

  if (player.y > HEIGHT + 320 || player.health <= 0) {
    player.health = 0;
    state.started = false;
    showOverlay("패배", "게이트에서 여정을 다시 시작합니다.");
  }
}

function resolvePlatforms(player) {
  const body = frameRect(player);
  for (const platform of state.platforms) {
    if (!rectsOverlap(body, platform.rect)) continue;
    const previousBottom = body.y + body.height - player.vy / 60;
    if (player.vy >= 0 && previousBottom <= platform.rect.y + 18) {
      player.y = platform.rect.y;
      player.vy = 0;
      player.grounded = true;
      body.y = player.y - player.height;
    }
  }

  player.x = Math.max(30, Math.min(state.level.bounds.width - 30, player.x));
}

function updateEnemies(dt) {
  const player = state.player;
  const attackBox = {
    x: player.x + player.facing * 18,
    y: player.y - 92,
    width: player.facing > 0 ? 90 : -90,
    height: 70
  };
  const normalizedAttack = {
    x: Math.min(attackBox.x, attackBox.x + attackBox.width),
    y: attackBox.y,
    width: Math.abs(attackBox.width),
    height: attackBox.height
  };

  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    enemy.animTime += dt;
    enemy.attack = Math.max(0, enemy.attack - dt);
    enemy.x += enemy.vx * dt;
    if (Math.abs(enemy.x - enemy.homeX) > 190) enemy.vx *= -1;

    const enemyRect = frameRect(enemy);
    if (player.attack > 0.09 && rectsOverlap(normalizedAttack, enemyRect)) {
      enemy.health -= 1;
      enemy.vx = player.facing * 120;
      player.attack = 0.06;
      if (enemy.health <= 0) enemy.alive = false;
    } else if (rectsOverlap(frameRect(player), enemyRect) && player.invincible <= 0) {
      hurtPlayer(18);
      enemy.attack = 0.25;
    }
  }
}

function resolveHazards() {
  const playerRect = frameRect(state.player);
  for (const hazard of state.hazards) {
    if (rectsOverlap(playerRect, hazard.rect)) {
      hurtPlayer(22);
      state.player.vy = -420;
      state.player.y -= 12;
      break;
    }
  }
}

function hurtPlayer(amount) {
  if (state.player.invincible > 0) return;
  state.player.health = Math.max(0, state.player.health - amount);
  state.player.invincible = 0.85;
  state.player.animTime = 0;
}

function resolveCoins() {
  const playerRect = frameRect(state.player);
  for (const object of state.level.objects) {
    if (!state.coins.has(object.id)) continue;
    const frame = state.frames.get(object.frameName);
    const rect = objectCollisionRect(object, frame);
    if (rectsOverlap(playerRect, rect)) {
      state.coins.delete(object.id);
    }
  }
}

function resolvePortal() {
  if (!state.portal || state.coins.size > 0 || state.completed) return;
  if (rectsOverlap(frameRect(state.player), state.portal.rect)) {
    state.completed = true;
    const index = LEVEL_IDS.indexOf(state.levelId);
    const next = LEVEL_IDS[index + 1];
    state.started = false;
    if (next) {
      loadLevel(next).then(() => {
        showOverlay("게이트 열림", "다음 길이 준비되었습니다.");
      });
    } else {
      showOverlay("임무 완수", "마지막 게이트가 복구되었습니다.");
    }
  }
}

function updateCamera() {
  const maxX = Math.max(0, state.level.bounds.width - WIDTH);
  const target = Math.max(0, Math.min(maxX, state.player.x - WIDTH * 0.38));
  state.cameraX += (target - state.cameraX) * 0.12;
}

function updateHud() {
  ui.health.textContent = `${Math.ceil(state.player.health)}`;
  ui.coins.textContent = `${Number(ui.coinTotal.textContent) - state.coins.size}`;
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground();
  if (!state.level) return;

  const objects = [...state.level.objects].sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));
  for (const object of objects) {
    if (object.frameName === "enemy-v3-purple-orc") continue;
    if (state.coins.has(object.id) || object.frameName !== "collectible-coin") {
      drawTileObject(object);
    }
  }
  drawEnemies();
  drawPlayer();
  drawVignette();
}

function drawBackground() {
  ctx.fillStyle = "#9bd9d1";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  drawLayer(assets.bg?.far, 0.08, 0);
  drawLayer(assets.bg?.mid, 0.20, 0);
  drawLayer(assets.bg?.front, 0.38, 0);
}

function drawLayer(image, factor, y) {
  if (!image) return;
  const scale = HEIGHT / image.height;
  const width = image.width * scale;
  const offset = -(state.cameraX * factor) % width;
  for (let x = offset - width; x < WIDTH + width; x += width) {
    ctx.drawImage(image, x, y, width, HEIGHT);
  }
}

function drawTileObject(object) {
  const frame = state.frames.get(object.frameName);
  if (!frame) return;
  const draw = objectDrawRect(object, frame);
  ctx.drawImage(
    assets.tileAtlas,
    frame.bounds.x,
    frame.bounds.y,
    frame.bounds.width,
    frame.bounds.height,
    Math.round(draw.x - state.cameraX),
    Math.round(draw.y),
    Math.round(draw.width),
    Math.round(draw.height)
  );
}

function currentHeroAnim() {
  const player = state.player;
  if (player.health <= 0) return assets.hero.death;
  if (player.invincible > 0.45) return assets.hero.hurt;
  if (player.attack > 0) return assets.hero.punch;
  if (!player.grounded) return assets.hero.jump;
  if (Math.abs(player.vx) > WALK_SPEED * 0.75) return assets.hero.run;
  if (Math.abs(player.vx) > 1) return assets.hero.walk;
  return assets.hero.idle;
}

function drawPlayer() {
  const player = state.player;
  const animation = currentHeroAnim();
  drawSprite(animation, player.x - state.cameraX, player.y, HERO_SCALE, player.facing, player.animTime, player.invincible > 0);
}

function drawEnemies() {
  for (const enemy of state.enemies) {
    if (!enemy.alive) continue;
    const animation = enemy.attack > 0 ? assets.orc.attack : assets.orc.run;
    drawSprite(animation, enemy.x - state.cameraX, enemy.y, ENEMY_SCALE, enemy.vx > 0 ? 1 : -1, enemy.animTime, false);
  }
}

function drawSprite(animation, x, y, scale, facing, time, blink) {
  if (!animation) return;
  const frameIndex = Math.floor(time * animation.frameRate) % animation.frames;
  const sx = (frameIndex % animation.columns) * animation.frameWidth;
  const sy = Math.floor(frameIndex / animation.columns) * animation.frameHeight;
  const width = animation.frameWidth * scale;
  const height = animation.frameHeight * scale;

  ctx.save();
  if (blink) ctx.globalAlpha = Math.floor(time * 18) % 2 ? 0.45 : 1;
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(animation.image, sx, sy, animation.frameWidth, animation.frameHeight, -width / 2, -height, width, height);
  ctx.restore();
}

function drawVignette() {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.10)");
  gradient.addColorStop(0.72, "rgba(0, 0, 0, 0)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.34)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

boot().catch((error) => {
  console.error(error);
  ui.overlayKicker.textContent = "불러오기 오류";
  ui.overlayTitle.textContent = "에셋을 불러올 수 없습니다.";
  ui.overlay.classList.add("is-visible");
});
