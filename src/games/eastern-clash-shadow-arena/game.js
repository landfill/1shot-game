import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import ryuhanArt from "../../assets/characters/eastern-clash/cutouts/ryuhan-side.png";
import ayaneArt from "../../assets/characters/eastern-clash/cutouts/ayane-side.png";
import genzoArt from "../../assets/characters/eastern-clash/cutouts/genzo-side.png";
import meilinArt from "../../assets/characters/eastern-clash/cutouts/meilin-side.png";
import ryuhanFallenArt from "../../assets/characters/eastern-clash/cutouts/ryuhan-fallen.png";
import ayaneFallenArt from "../../assets/characters/eastern-clash/cutouts/ayane-fallen.png";
import genzoFallenArt from "../../assets/characters/eastern-clash/cutouts/genzo-fallen.png";
import meilinFallenArt from "../../assets/characters/eastern-clash/cutouts/meilin-fallen.png";
import humanoidRigUrl from "../../assets/characters/eastern-clash/rigs/eastern-humanoid.glb?url";
import moonTempleBackdrop from "../../assets/stages/eastern-clash/backgrounds/moon-temple-realistic.png";
import bambooArenaBackdrop from "../../assets/stages/eastern-clash/backgrounds/bamboo-arena-realistic.png";

(() => {
  const canvas = document.getElementById("scene");
  const ui = {
    titleScreen: document.getElementById("titleScreen"),
    selectScreen: document.getElementById("selectScreen"),
    resultScreen: document.getElementById("resultScreen"),
    battleHud: document.getElementById("battleHud"),
    centerMessage: document.getElementById("centerMessage"),
    fighterGrid: document.getElementById("fighterGrid"),
    selectedConcept: document.getElementById("selectedConcept"),
    selectedName: document.getElementById("selectedName"),
    selectedBio: document.getElementById("selectedBio"),
    statGrid: document.getElementById("statGrid"),
    stageSelect: document.getElementById("stageSelect"),
    npcSelect: document.getElementById("npcSelect"),
    difficultySelect: document.getElementById("difficultySelect"),
    playerName: document.getElementById("playerName"),
    playerStyle: document.getElementById("playerStyle"),
    playerHealth: document.getElementById("playerHealth"),
    playerMeter: document.getElementById("playerMeter"),
    playerRounds: document.getElementById("playerRounds"),
    npcName: document.getElementById("npcName"),
    npcStyle: document.getElementById("npcStyle"),
    npcHealth: document.getElementById("npcHealth"),
    npcMeter: document.getElementById("npcMeter"),
    npcRounds: document.getElementById("npcRounds"),
    roundTimer: document.getElementById("roundTimer"),
    roundLabel: document.getElementById("roundLabel"),
    comboReadout: document.getElementById("comboReadout"),
    aiReadout: document.getElementById("aiReadout"),
    resultKicker: document.getElementById("resultKicker"),
    resultTitle: document.getElementById("resultTitle"),
    resultDetail: document.getElementById("resultDetail"),
    resultRounds: document.getElementById("resultRounds"),
    howModal: document.getElementById("howModal"),
    settingsModal: document.getElementById("settingsModal"),
    bgmToggle: document.getElementById("bgmToggle"),
    sfxToggle: document.getElementById("sfxToggle"),
    shakeToggle: document.getElementById("shakeToggle"),
    qualitySelect: document.getElementById("qualitySelect")
  };

  const buttons = {
    start: document.getElementById("startButton"),
    how: document.getElementById("howButton"),
    settings: document.getElementById("settingsButton"),
    backToTitle: document.getElementById("backToTitleButton"),
    confirm: document.getElementById("confirmButton"),
    retry: document.getElementById("retryButton"),
    selectAgain: document.getElementById("selectAgainButton"),
    mainMenu: document.getElementById("mainMenuButton")
  };

  const CHARACTERS = [
    {
      id: "ryuhan",
      name: "Ryuhan",
      concept: "Eastern Kung Fu",
      style: "Bare-hand chains",
      weaponType: "none",
      bio: "Balanced martial artist with fast chains, a rush punch, and a short ki burst.",
      stats: { attack: 3, defense: 3, speed: 4, range: 3, difficulty: 2 },
      asset: ryuhanArt,
      spriteScale: [2.82, 4.34],
      spriteGroundInset: 0.52,
      fallenAsset: ryuhanFallenArt,
      fallenSpriteScale: [5.8, 2.9],
      fallenSpriteGroundInset: 0.39,
      ai: "pressure",
      colors: { primary: 0x162d4a, secondary: 0x071018, accent: 0xb3342a, skin: 0xc99470, hair: 0x101014 },
      cssAccent: "linear-gradient(135deg, rgba(22,45,74,0.92), rgba(119,32,35,0.64))",
      special: { name: "Iron Palm", damage: 17, range: 2.75, startup: 0.16, active: 0.13, recovery: 0.32, hitType: "mid", knockback: 3.5 },
      ultimate: { name: "Ki Burst", damage: 31, range: 3.7, startup: 0.23, active: 0.18, recovery: 0.48, hitType: "mid", knockback: 5.8 }
    },
    {
      id: "ayane",
      name: "Ayane",
      concept: "Shadow Assassin",
      style: "Twin daggers",
      weaponType: "dagger",
      bio: "Fast evasive assassin who punishes whiffs with short blade strings.",
      stats: { attack: 3, defense: 2, speed: 5, range: 2, difficulty: 3 },
      asset: ayaneArt,
      spriteScale: [4.18, 3.72],
      spriteGroundInset: 0.14,
      fallenAsset: ayaneFallenArt,
      fallenSpriteScale: [5.7, 2.85],
      fallenSpriteGroundInset: 0.63,
      ai: "evasive",
      colors: { primary: 0x171018, secondary: 0x2c1837, accent: 0x7a2ca2, skin: 0xd1a07e, hair: 0x08080a },
      cssAccent: "linear-gradient(135deg, rgba(24,16,26,0.96), rgba(89,38,120,0.72))",
      special: { name: "Venom Thrust", damage: 15, range: 2.35, startup: 0.11, active: 0.12, recovery: 0.27, hitType: "mid", knockback: 2.6 },
      ultimate: { name: "Moonlit Flurry", damage: 28, range: 3.1, startup: 0.17, active: 0.25, recovery: 0.44, hitType: "mid", knockback: 5.0 }
    },
    {
      id: "genzo",
      name: "Genzo",
      concept: "Veteran Samurai",
      style: "Heavy katana",
      weaponType: "sword",
      bio: "Slow, armored swordsman with long reach and severe single-hit damage.",
      stats: { attack: 5, defense: 4, speed: 2, range: 5, difficulty: 3 },
      asset: genzoArt,
      spriteScale: [3.08, 4.35],
      spriteGroundInset: 0.62,
      fallenAsset: genzoFallenArt,
      fallenSpriteScale: [6.05, 3.02],
      fallenSpriteGroundInset: 0.48,
      ai: "counter",
      colors: { primary: 0x3a3b3f, secondary: 0x171819, accent: 0x946c3e, skin: 0xb98262, hair: 0x34343a },
      cssAccent: "linear-gradient(135deg, rgba(58,59,63,0.96), rgba(97,70,49,0.74))",
      special: { name: "Counter Stance", damage: 18, range: 3.35, startup: 0.2, active: 0.18, recovery: 0.36, hitType: "mid", knockback: 4.8 },
      ultimate: { name: "No-Moon Slash", damage: 35, range: 4.45, startup: 0.28, active: 0.17, recovery: 0.55, hitType: "mid", knockback: 6.6 }
    },
    {
      id: "meilin",
      name: "Meilin",
      concept: "Staff Dancer",
      style: "Long staff control",
      weaponType: "staff",
      bio: "Graceful staff fighter who controls space with safe long-range strikes.",
      stats: { attack: 3, defense: 3, speed: 3, range: 5, difficulty: 3 },
      asset: meilinArt,
      spriteScale: [5.55, 3.9],
      spriteGroundInset: 0.18,
      fallenAsset: meilinFallenArt,
      fallenSpriteScale: [5.95, 2.98],
      fallenSpriteGroundInset: 0.36,
      ai: "zoning",
      colors: { primary: 0x8f2326, secondary: 0x2e1412, accent: 0xd0a340, skin: 0xd4a47c, hair: 0x432217 },
      cssAccent: "linear-gradient(135deg, rgba(143,35,38,0.94), rgba(194,143,54,0.58))",
      special: { name: "Spinning Sweep", damage: 16, range: 3.6, startup: 0.15, active: 0.19, recovery: 0.34, hitType: "low", knockback: 3.3 },
      ultimate: { name: "Dragon Staff Dance", damage: 30, range: 4.1, startup: 0.2, active: 0.27, recovery: 0.48, hitType: "mid", knockback: 5.4 }
    }
  ];

  const STAGES = [
    { id: "moon-temple", name: "Moonlit Temple", backdrop: moonTempleBackdrop, fog: 0x0b1018, clear: 0x0b1018 },
    { id: "bamboo-arena", name: "Bamboo Forest", backdrop: bambooArenaBackdrop, fog: 0x111713, clear: 0x111713 }
  ];

  const DIFFICULTY = {
    easy: { reaction: 0.72, guard: 0.18, aggression: 0.42, combo: 0.14, ultimate: 0.08 },
    normal: { reaction: 0.48, guard: 0.34, aggression: 0.62, combo: 0.26, ultimate: 0.18 },
    hard: { reaction: 0.3, guard: 0.52, aggression: 0.82, combo: 0.42, ultimate: 0.32 }
  };

  const BASE_MOVES = {
    light: { name: "Light Strike", damage: 6, range: 1.28, startup: 0.07, active: 0.1, recovery: 0.16, hitType: "mid", knockback: 1.7 },
    low: { name: "Low Sweep", damage: 7, range: 1.38, startup: 0.1, active: 0.12, recovery: 0.2, hitType: "low", knockback: 2.0 },
    heavy: { name: "Heavy Strike", damage: 13, range: 1.58, startup: 0.17, active: 0.12, recovery: 0.34, hitType: "mid", knockback: 3.2 },
    jumpHeavy: { name: "Leaping Heavy", damage: 14, range: 1.55, startup: 0.13, active: 0.16, recovery: 0.3, hitType: "high", knockback: 3.4 },
    rush: { name: "Rush Strike", damage: 16, range: 1.9, startup: 0.12, active: 0.14, recovery: 0.31, hitType: "mid", knockback: 4.8 },
    chain: { name: "Chain Finisher", damage: 15, range: 1.72, startup: 0.1, active: 0.13, recovery: 0.28, hitType: "mid", knockback: 3.9 },
    grab: { name: "Guard Break Throw", damage: 12, range: 1.05, startup: 0.09, active: 0.1, recovery: 0.34, hitType: "throw", knockback: 4.4 }
  };

  const input = {
    keys: new Set(),
    pressed: new Set(),
    combatHistory: [],
    lastTap: { KeyA: 0, KeyD: 0 }
  };

  const state = {
    screen: "title",
    selectedIndex: 0,
    stageId: "moon-temple",
    npcChoice: "random",
    difficulty: "normal",
    lastBattleConfig: null,
    settings: {
      bgm: true,
      sfx: true,
      shake: true,
      quality: "medium"
    },
    messageTimer: 0,
    messageText: "",
    cameraShake: 0,
    battle: null,
    previewFighters: [],
    seed: 8321
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0c1118);
  scene.fog = new THREE.Fog(0x0c1118, 18, 82);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;

  const camera = new THREE.PerspectiveCamera(43, window.innerWidth / window.innerHeight, 0.1, 200);
  const clock = new THREE.Clock();
  const tmpVec = new THREE.Vector3();
  const tmpVec2 = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpScale = new THREE.Vector3();
  const tmpMat = new THREE.Matrix4();

  const stageRoot = new THREE.Group();
  const fighterRoot = new THREE.Group();
  const effectRoot = new THREE.Group();
  scene.add(stageRoot, fighterRoot, effectRoot);

  const effects = [];
  const textureLoader = new THREE.TextureLoader();
  const rigLoader = new GLTFLoader();
  const textureCache = new Map();
  let humanoidRigAsset = null;
  let petals = null;
  let audioContext = null;
  let bgm = null;

  const sharedGeo = {
    box: new THREE.BoxGeometry(1, 1, 1),
    plane: new THREE.PlaneGeometry(1, 1),
    sphere: new THREE.SphereGeometry(0.5, 24, 16),
    cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 18),
    cone: new THREE.ConeGeometry(0.5, 1, 18),
    torus: new THREE.TorusGeometry(1, 0.04, 8, 64)
  };

  const mats = {
    ink: mat(0x0b0e13, 0.72, 0.02),
    stone: mat(0x7d8386, 0.9, 0.02),
    stoneDark: mat(0x3d454d, 0.94, 0.02),
    gold: mat(0xd9ad58, 0.55, 0.12, false, 1, 0x4d2b04, 0.08),
    red: mat(0xb73a2f, 0.7, 0.03),
    redDark: mat(0x571b1c, 0.78, 0.03),
    wood: mat(0x6f3f28, 0.78, 0.02),
    bamboo: mat(0x408654, 0.78, 0.02),
    bambooHi: mat(0x80b85c, 0.72, 0.02),
    mist: mat(0xdce8ff, 0.9, 0, true, 0.14, 0xdce8ff, 0.05),
    moon: mat(0xdce8ff, 0.34, 0, false, 1, 0xdce8ff, 0.85),
    lantern: mat(0xff9d51, 0.42, 0.02, false, 1, 0xff7133, 1.05),
    dirt: mat(0x40362c, 0.96, 0.01),
    leaf: mat(0xc98a3c, 0.82, 0.01),
    hit: mat(0xffe29a, 0.35, 0.02, true, 0.82, 0xffb23a, 1.2),
    guard: mat(0x9fd2ff, 0.4, 0.02, true, 0.72, 0x75c8ff, 1.0),
    shadow: mat(0x030406, 1, 0, true, 0.28)
  };

  function mat(color, roughness = 0.75, metalness = 0.02, transparent = false, opacity = 1, emissive = 0x000000, emissiveIntensity = 0) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent,
      opacity,
      emissive,
      emissiveIntensity
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function rand() {
    state.seed = (state.seed * 1664525 + 1013904223) >>> 0;
    return state.seed / 4294967296;
  }

  function range(min, max) {
    return min + rand() * (max - min);
  }

  function pick(items) {
    return items[Math.floor(rand() * items.length)];
  }

  function findCharacter(id) {
    return CHARACTERS.find((character) => character.id === id) || CHARACTERS[0];
  }

  function findStage(id) {
    return STAGES.find((stage) => stage.id === id) || STAGES[0];
  }

  function getTexture(asset) {
    if (!asset) return null;
    if (!textureCache.has(asset)) {
      const texture = textureLoader.load(asset);
      if ("colorSpace" in texture && THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      textureCache.set(asset, texture);
    }
    return textureCache.get(asset);
  }

  function getCharacterTexture(character) {
    return getTexture(character.asset);
  }

  function addStageBackdrop(stage) {
    const texture = getTexture(stage.backdrop);
    stageRoot.userData.stageBackdropReady = Boolean(texture);
    stageRoot.userData.stageBackdropId = texture ? stage.id : null;
  }

  function disposePetals() {
    if (!petals?.mesh) {
      petals = null;
      return;
    }
    scene.remove(petals.mesh);
    petals.mesh.geometry.dispose();
    petals.mesh.material.dispose();
    petals = null;
  }

  function transparentMaterial(color, opacity, emissive = 0x000000, intensity = 0) {
    const material = mat(color, 0.58, 0.04, true, opacity, emissive, intensity);
    material.depthWrite = false;
    return material;
  }

  function croppedPlaneGeometry(crop) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const uv = geometry.attributes.uv;
    uv.setXY(0, crop.u0, crop.v1);
    uv.setXY(1, crop.u1, crop.v1);
    uv.setXY(2, crop.u0, crop.v0);
    uv.setXY(3, crop.u1, crop.v0);
    uv.needsUpdate = true;
    return geometry;
  }

  function textureStrikePlane(parent, texture, crop, opacity = 0.96) {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      transparent: true,
      opacity,
      alphaTest: 0.035,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(croppedPlaneGeometry(crop), material);
    mesh.visible = false;
    mesh.renderOrder = 14;
    parent.add(mesh);
    return mesh;
  }

  function box(parent, x, y, z, sx, sy, sz, material, cast = true, receive = true) {
    const mesh = new THREE.Mesh(sharedGeo.box, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    parent.add(mesh);
    return mesh;
  }

  function sphere(parent, x, y, z, sx, sy, sz, material, cast = true, receive = false) {
    const mesh = new THREE.Mesh(sharedGeo.sphere, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(parent, x, y, z, radius, height, material, cast = true, receive = true) {
    const mesh = new THREE.Mesh(sharedGeo.cylinder, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(radius, height, radius);
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    parent.add(mesh);
    return mesh;
  }

  function clearGroup(group) {
    while (group.children.length) {
      const child = group.children.pop();
      child.traverse((node) => {
        if (node.geometry && !Object.values(sharedGeo).includes(node.geometry)) {
          node.geometry.dispose();
        }
      });
    }
  }

  function setupLighting() {
    scene.children
      .filter((child) => child.isLight)
      .forEach((light) => scene.remove(light));

    const hemi = new THREE.HemisphereLight(0xdfeeff, 0x1c1110, 0.75);
    scene.add(hemi);

    const moon = new THREE.DirectionalLight(0xcbdcff, 2.2);
    moon.position.set(-12, 24, 12);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -28;
    moon.shadow.camera.right = 28;
    moon.shadow.camera.top = 22;
    moon.shadow.camera.bottom = -14;
    moon.shadow.camera.near = 4;
    moon.shadow.camera.far = 70;
    scene.add(moon);

    const warm = new THREE.PointLight(0xff8a45, 1.35, 28, 2);
    warm.position.set(0, 4, -6);
    scene.add(warm);
  }

  function buildStage(stageId) {
    clearGroup(stageRoot);
    clearGroup(effectRoot);
    effects.length = 0;
    disposePetals();
    setupLighting();
    const stage = findStage(stageId);
    scene.background = getTexture(stage.backdrop) || new THREE.Color(stage.clear);
    scene.fog = new THREE.Fog(stage.fog, stage.id === "bamboo-arena" ? 14 : 18, stage.id === "bamboo-arena" ? 70 : 82);
    if (stageId === "bamboo-arena") {
      buildBambooArena(stage);
    } else {
      buildMoonTemple(stage);
    }
  }

  function buildMoonTemple(stage) {
    addStageBackdrop(stage);
    createPetals(0xffd2d9);
  }

  function buildBambooArena(stage) {
    addStageBackdrop(stage);
    const sun = new THREE.PointLight(0xffd99a, 0.8, 34, 2);
    sun.position.set(-8, 9, -12);
    scene.add(sun);

    createPetals(0xc98a3c);
  }

  function makeLantern(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    stageRoot.add(group);
    box(group, 0, 2.5, 0, 0.1, 3.1, 0.1, mats.wood);
    box(group, 0, 3.95, 0, 1.0, 0.1, 0.1, mats.wood);
    sphere(group, 0, 3.35, 0, 0.55, 0.72, 0.55, mats.lantern, false, false);
    const light = new THREE.PointLight(0xff8044, 0.75, 10, 2.2);
    light.position.set(x, 3.35, z);
    scene.add(light);
  }

  function makeStoneLantern(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    stageRoot.add(group);
    cylinder(group, 0, 0.25, 0, 0.55, 0.5, mats.stoneDark);
    cylinder(group, 0, 1.2, 0, 0.22, 1.55, mats.stone);
    box(group, 0, 2.0, 0, 1.25, 0.25, 1.25, mats.stoneDark);
    box(group, 0, 2.42, 0, 0.86, 0.65, 0.86, mats.lantern);
    box(group, 0, 2.9, 0, 1.45, 0.28, 1.45, mats.stoneDark);
  }

  function createMist() {
    for (let i = 0; i < 16; i++) {
      const mist = new THREE.Mesh(sharedGeo.plane, mats.mist);
      mist.position.set(range(-16, 16), 0.12 + rand() * 0.16, range(-5.2, 5.2));
      mist.scale.set(range(4, 8), range(0.7, 1.3), 1);
      mist.rotation.x = -Math.PI / 2;
      mist.rotation.z = rand() * Math.PI;
      mist.castShadow = false;
      mist.receiveShadow = false;
      stageRoot.add(mist);
    }
  }

  function createPetals(color) {
    const geo = new THREE.PlaneGeometry(0.08, 0.16);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    material.toneMapped = false;
    const count = 90;
    const mesh = new THREE.InstancedMesh(geo, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = false;
    scene.add(mesh);
    petals = {
      mesh,
      items: Array.from({ length: count }, (_, i) => ({
        x: range(-18, 18),
        y: range(2, 12),
        z: range(-8, 8),
        fall: range(0.25, 0.75),
        sway: range(0.3, 1.2),
        spin: i * 0.37
      }))
    };
  }

  function updatePetals(dt) {
    if (!petals) return;
    for (let i = 0; i < petals.items.length; i++) {
      const p = petals.items[i];
      p.y -= p.fall * dt;
      p.x += Math.sin(clock.elapsedTime * p.sway + i) * dt * 0.35;
      p.z += Math.cos(clock.elapsedTime * p.sway * 0.7 + i) * dt * 0.22;
      p.spin += dt * (1.2 + p.sway);
      if (p.y < 0.05) {
        p.x = range(-18, 18);
        p.y = range(5, 12);
        p.z = range(-8, 8);
      }
      tmpQuat.setFromEuler(new THREE.Euler(p.spin, p.spin * 0.7, p.spin * 0.2));
      tmpScale.setScalar(1);
      tmpMat.compose(tmpVec.set(p.x, p.y, p.z), tmpQuat, tmpScale);
      petals.mesh.setMatrixAt(i, tmpMat);
    }
    petals.mesh.instanceMatrix.needsUpdate = true;
  }

  function makeFighter(character, kind, startX, preview = false) {
    const c = character.colors;
    const materials = {
      primary: mat(c.primary, 0.62, 0.04),
      secondary: mat(c.secondary, 0.68, 0.04),
      accent: mat(c.accent, 0.48, 0.08, false, 1, c.accent, 0.04),
      skin: mat(c.skin, 0.74, 0.02),
      hair: mat(c.hair, 0.72, 0.02),
      metal: mat(0xd6dde3, 0.36, 0.28),
      staff: mat(0x8a552e, 0.58, 0.04)
    };
    const group = new THREE.Group();
    const root = new THREE.Group();
    group.add(root);

    const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), mats.shadow);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.021;
    shadow.castShadow = false;
    shadow.receiveShadow = false;
    group.add(shadow);

    const parts = { root, shadow };
    parts.hips = box(root, 0, 1.05, 0, 0.74, 0.52, 0.42, materials.secondary);
    parts.torso = box(root, 0, 1.72, 0, 0.86, 1.08, 0.48, materials.primary);
    parts.chest = box(root, 0, 2.18, 0.03, 0.96, 0.34, 0.52, materials.accent);
    parts.neck = cylinder(root, 0, 2.46, 0, 0.14, 0.25, materials.skin);
    parts.head = sphere(root, 0, 2.82, 0, 0.45, 0.54, 0.42, materials.skin);
    parts.hair = box(root, 0, 3.18, -0.02, 0.52, 0.22, 0.48, materials.hair);

    if (character.id === "ayane") {
      parts.tail = box(root, 0, 3.12, -0.38, 0.16, 0.2, 0.82, materials.hair);
      parts.tail.rotation.x = -0.55;
    }
    if (character.id === "genzo") {
      parts.beard = box(root, 0, 2.52, 0.29, 0.28, 0.18, 0.12, materials.hair);
    }

    parts.armL = limb(root, -0.58, 2.12, 0, 0.24, 0.9, materials.primary);
    parts.armR = limb(root, 0.58, 2.12, 0, 0.24, 0.9, materials.primary);
    parts.foreL = limb(parts.armL, 0, -0.78, 0.05, 0.2, 0.82, materials.skin);
    parts.foreR = limb(parts.armR, 0, -0.78, 0.05, 0.2, 0.82, materials.skin);
    parts.legL = limb(root, -0.28, 1.02, 0, 0.26, 0.92, materials.secondary);
    parts.legR = limb(root, 0.28, 1.02, 0, 0.26, 0.92, materials.secondary);
    parts.shinL = limb(parts.legL, 0, -0.78, 0.03, 0.22, 0.82, materials.secondary);
    parts.shinR = limb(parts.legR, 0, -0.78, 0.03, 0.22, 0.82, materials.secondary);
    parts.footL = box(parts.shinL, 0, -0.78, 0.16, 0.32, 0.14, 0.52, mats.ink);
    parts.footR = box(parts.shinR, 0, -0.78, 0.16, 0.32, 0.14, 0.52, mats.ink);

    addWeapon(character, root, parts, materials);
    const texture = getCharacterTexture(character);
    if (texture) {
      const fallenTexture = getTexture(character.fallenAsset);
      const spriteMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.025,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide
      });
      const sprite = new THREE.Mesh(sharedGeo.plane, spriteMaterial);
      const [spriteWidth, spriteHeight] = character.spriteScale || [2.7, 4.4];
      sprite.scale.set(spriteWidth, spriteHeight, 1);
      sprite.renderOrder = kind === "player" ? 3 : 2;
      fighterRoot.add(sprite);
      parts.sprite = sprite;
      parts.standTexture = texture;
      parts.fallenTexture = fallenTexture;
      parts.spriteBaseScale = { width: spriteWidth, height: spriteHeight };
      parts.spriteGroundInset = character.spriteGroundInset || 0;
      const [fallenWidth, fallenHeight] = character.fallenSpriteScale || [5.8, 2.9];
      parts.fallenSpriteBaseScale = { width: fallenWidth, height: fallenHeight };
      parts.fallenSpriteGroundInset = character.fallenSpriteGroundInset || 0;
      root.visible = false;
    }
    parts.strike = createStrikeRig(character, materials);
    group.position.set(startX, 0, 0);
    fighterRoot.add(group);

    const fighter = {
      kind,
      character,
      group,
      parts,
      materials,
      pos: new THREE.Vector3(startX, 0, 0),
      vx: 0,
      vy: 0,
      facing: kind === "player" ? 1 : -1,
      hp: 100,
      meter: preview ? 70 : 0,
      wins: 0,
      state: "idle",
      aiState: "Idle",
      aiTimer: 0,
      aiDecision: 0,
      aiGuardTimer: 0,
      action: null,
      actionLocked: false,
      hitTimer: 0,
      knockdownTimer: 0,
      dashTimer: 0,
      dashCooldown: 0,
      specialCooldown: 0,
      ultimateCooldown: 0,
      invuln: 0,
      flashTimer: 0,
      guardFlashTimer: 0,
      combo: 0,
      lastHitAt: -10,
      damageTaken: 0,
      koDefeated: false,
      onGround: true,
      crouching: false,
      guarding: false,
      guardLow: false,
      preview,
      step: rand() * Math.PI * 2
    };
    attachHumanoidRig(fighter);
    applyFighterPose(fighter, 0);
    return fighter;
  }

  function attachHumanoidRig(fighter) {
    if (!humanoidRigAsset?.scene) return;
    const rig = humanoidRigAsset.scene.clone(true);
    rig.name = `${fighter.kind}-${fighter.character.id}-glb-humanoid`;
    const scale = fighter.character.id === "ayane" ? 1.14 : fighter.character.id === "meilin" ? 1.18 : fighter.character.id === "genzo" ? 1.24 : 1.2;
    rig.scale.setScalar(scale);
    rig.position.set(0, 0, 0);
    rig.rotation.set(0, 0, 0);

    const nodes = {};
    rig.traverse((node) => {
      if (node.name) nodes[node.name] = node;
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.renderOrder = fighter.kind === "player" ? 8 : 7;
        node.material = materialForRigMesh(node.name, fighter);
        node.visible = false;
      }
      const isSword = node.name.startsWith("WeaponSword");
      const isStaff = node.name.startsWith("WeaponStaff");
      const isDagger = node.name.startsWith("WeaponDagger");
      if (!node.isMesh && (isSword || isStaff || isDagger)) {
        node.visible = isSword && fighter.character.weaponType === "sword" || isStaff && fighter.character.weaponType === "staff" || isDagger && fighter.character.weaponType === "dagger";
      }
    });

    fighter.group.add(rig);
    fighter.parts.glbRig = rig;
    fighter.parts.glbNodes = nodes;
    fighter.parts.root.visible = false;
    if (fighter.parts.sprite) {
      fighter.parts.sprite.renderOrder = fighter.kind === "player" ? 8 : 7;
      fighter.parts.sprite.material.transparent = true;
      fighter.parts.sprite.material.opacity = fighter.preview ? 0.96 : 0.92;
    }

    fighter.rigMixer = new THREE.AnimationMixer(rig);
    fighter.rigActions = buildHumanoidRigActions(fighter);
    fighter.rigClipName = null;
    fighter.rigCurrentAction = null;
    playHumanoidClip(fighter, "idle", true);
  }

  function materialForRigMesh(name, fighter) {
    const p = fighter.materials;
    if (name.includes("Hair")) return p.hair;
    if (name.includes("Head") || name.includes("Neck") || name.includes("Fore") || name.includes("Hand")) return p.skin;
    if (name.includes("ChestAccent")) return p.accent;
    if (name.includes("Hips") || name.includes("Leg") || name.includes("Shin") || name.includes("Foot")) return p.secondary;
    if (name.includes("WeaponStaff")) return p.staff;
    if (name.includes("Weapon")) return p.metal;
    return p.primary;
  }

  function buildHumanoidRigActions(fighter) {
    const clips = buildHumanoidRigClips(fighter.parts.glbNodes);
    return Object.fromEntries(clips.map((clip) => [clip.name, fighter.rigMixer.clipAction(clip)]));
  }

  function rigTrack(nodes, nodeName, property, times, values) {
    const target = nodes[nodeName];
    return target ? new THREE.NumberKeyframeTrack(`${target.name}.${property}`, times, values) : null;
  }

  function rigClip(nodes, name, duration, tracks) {
    return new THREE.AnimationClip(name, duration, tracks.filter(Boolean));
  }

  function rigAttackTimes(duration) {
    return [0, duration * 0.32, duration * 0.58, duration];
  }

  function buildHumanoidRigClips(nodes) {
    const clips = [
      rigClip(nodes, "idle", 1.2, [
        rigTrack(nodes, "Torso", "rotation[z]", [0, 0.6, 1.2], [-0.025, 0.025, -0.025]),
        rigTrack(nodes, "Head", "rotation[x]", [0, 0.6, 1.2], [0.02, -0.03, 0.02]),
        rigTrack(nodes, "ArmL", "rotation[z]", [0, 0.6, 1.2], [-0.28, -0.34, -0.28]),
        rigTrack(nodes, "ArmR", "rotation[z]", [0, 0.6, 1.2], [0.28, 0.34, 0.28])
      ]),
      rigClip(nodes, "walk", 0.65, [
        rigTrack(nodes, "LegL", "rotation[x]", [0, 0.325, 0.65], [0.46, -0.46, 0.46]),
        rigTrack(nodes, "LegR", "rotation[x]", [0, 0.325, 0.65], [-0.46, 0.46, -0.46]),
        rigTrack(nodes, "ShinL", "rotation[x]", [0, 0.325, 0.65], [0.1, 0.42, 0.1]),
        rigTrack(nodes, "ShinR", "rotation[x]", [0, 0.325, 0.65], [0.42, 0.1, 0.42]),
        rigTrack(nodes, "ArmL", "rotation[x]", [0, 0.325, 0.65], [-0.2, 0.38, -0.2]),
        rigTrack(nodes, "ArmR", "rotation[x]", [0, 0.325, 0.65], [0.38, -0.2, 0.38])
      ]),
      rigClip(nodes, "dash", 0.38, [
        rigTrack(nodes, "Torso", "rotation[z]", [0, 0.19, 0.38], [-0.16, -0.22, -0.16]),
        rigTrack(nodes, "ArmL", "rotation[x]", [0, 0.19, 0.38], [0.25, -0.45, 0.25]),
        rigTrack(nodes, "ArmR", "rotation[x]", [0, 0.19, 0.38], [-0.55, 0.2, -0.55]),
        rigTrack(nodes, "LegL", "rotation[x]", [0, 0.19, 0.38], [0.6, -0.4, 0.6]),
        rigTrack(nodes, "LegR", "rotation[x]", [0, 0.19, 0.38], [-0.45, 0.62, -0.45])
      ]),
      rigClip(nodes, "guard", 0.5, [
        rigTrack(nodes, "ArmL", "rotation[x]", [0, 0.12, 0.5], [-0.7, -1.05, -1.05]),
        rigTrack(nodes, "ArmR", "rotation[x]", [0, 0.12, 0.5], [-0.7, -1.1, -1.1]),
        rigTrack(nodes, "ForeL", "rotation[x]", [0, 0.12, 0.5], [-0.55, -0.22, -0.22]),
        rigTrack(nodes, "ForeR", "rotation[x]", [0, 0.12, 0.5], [-0.55, -0.18, -0.18])
      ]),
      rigClip(nodes, "hit", 0.32, [
        rigTrack(nodes, "Torso", "rotation[x]", [0, 0.12, 0.32], [-0.08, -0.34, -0.08]),
        rigTrack(nodes, "Head", "rotation[x]", [0, 0.12, 0.32], [-0.02, -0.24, -0.02]),
        rigTrack(nodes, "ArmL", "rotation[x]", [0, 0.12, 0.32], [0.1, 0.45, 0.1]),
        rigTrack(nodes, "ArmR", "rotation[x]", [0, 0.12, 0.32], [0.1, 0.48, 0.1])
      ]),
      rigClip(nodes, "knockdown", 0.7, [
        rigTrack(nodes, "Torso", "rotation[x]", [0, 0.26, 0.7], [-0.2, -1.0, -1.0]),
        rigTrack(nodes, "Head", "rotation[x]", [0, 0.26, 0.7], [-0.12, -0.5, -0.5]),
        rigTrack(nodes, "LegL", "rotation[x]", [0, 0.26, 0.7], [0.2, 0.8, 0.8]),
        rigTrack(nodes, "LegR", "rotation[x]", [0, 0.26, 0.7], [-0.1, 0.3, 0.3])
      ])
    ];

    addRigAttackClip(clips, nodes, "light", 0.33, {
      torsoY: [0, -0.12, -0.2, 0],
      torsoZ: [0, -0.04, -0.08, 0],
      armRX: [0.18, -1.05, -0.32, 0.18],
      armRZ: [0.28, 0.55, 0.18, 0.28],
      foreRX: [-0.7, -0.2, -0.08, -0.7],
      armLX: [0.18, -0.18, 0.1, 0.18],
      legRX: [0.04, 0.02, -0.08, 0.04],
      shinRX: [0, 0.04, 0.02, 0],
      footRZ: [0, 0.02, -0.04, 0]
    });
    addRigAttackClip(clips, nodes, "low", 0.42, {
      torsoY: [0, -0.06, -0.14, 0],
      torsoZ: [0, 0.12, 0.18, 0],
      armRX: [0.18, -0.4, -0.18, 0.18],
      armRZ: [0.28, 0.35, 0.2, 0.28],
      foreRX: [-0.7, -0.42, -0.25, -0.7],
      armLX: [0.18, -0.25, -0.12, 0.18],
      legRX: [0.04, -0.86, -1.2, 0.04],
      shinRX: [0, 0.55, 0.22, 0],
      footRZ: [0, -0.28, -0.38, 0]
    });
    addRigAttackClip(clips, nodes, "heavy", 0.63, {
      torsoY: [0, 0.24, -0.42, 0],
      torsoZ: [0, 0.08, -0.16, 0],
      armRX: [0.18, -1.42, -0.18, 0.18],
      armRZ: [0.28, 0.76, 0.08, 0.28],
      foreRX: [-0.7, -0.24, 0.08, -0.7],
      armLX: [0.18, -0.65, -0.28, 0.18],
      legRX: [0.04, -0.1, 0.18, 0.04],
      shinRX: [0, 0.14, 0.08, 0],
      footRZ: [0, -0.06, 0.1, 0],
      weaponRZ: [0, 0.55, -0.36, 0]
    });
    addRigAttackClip(clips, nodes, "jumpHeavy", 0.59, {
      torsoY: [0, 0.14, -0.3, 0],
      torsoZ: [0, -0.08, -0.2, 0],
      armRX: [0.18, -0.8, -0.25, 0.18],
      armRZ: [0.28, 0.5, 0.2, 0.28],
      foreRX: [-0.7, -0.25, -0.08, -0.7],
      armLX: [0.18, -0.32, -0.18, 0.18],
      legRX: [0.04, -0.4, -1.12, 0.04],
      shinRX: [0, 0.2, 0.1, 0],
      footRZ: [0, 0.22, 0.34, 0]
    });
    addRigAttackClip(clips, nodes, "rush", 0.57, {
      torsoY: [0, 0.26, -0.5, 0],
      torsoZ: [0, -0.14, -0.24, 0],
      armRX: [0.18, -1.36, -0.08, 0.18],
      armRZ: [0.28, 0.68, -0.02, 0.28],
      foreRX: [-0.7, -0.18, 0.12, -0.7],
      armLX: [0.18, -0.5, -0.24, 0.18],
      legRX: [0.04, 0.42, -0.25, 0.04],
      shinRX: [0, 0.16, 0.34, 0],
      footRZ: [0, 0.1, -0.08, 0],
      weaponRZ: [0, 0.5, -0.42, 0]
    });
    addRigAttackClip(clips, nodes, "chain", 0.51, {
      torsoY: [0, -0.28, 0.38, 0],
      torsoZ: [0, -0.08, 0.16, 0],
      armRX: [0.18, -0.7, -1.2, 0.18],
      armRZ: [0.28, -0.22, 0.64, 0.28],
      foreRX: [-0.7, -0.3, -0.04, -0.7],
      armLX: [0.18, -0.9, -0.32, 0.18],
      legRX: [0.04, 0.12, -0.12, 0.04],
      shinRX: [0, 0.06, 0.1, 0],
      footRZ: [0, 0.08, -0.06, 0],
      weaponRZ: [0, -0.36, 0.46, 0]
    });
    addRigAttackClip(clips, nodes, "grab", 0.53, {
      torsoY: [0, 0.04, -0.08, 0],
      torsoZ: [0, -0.08, -0.1, 0],
      armRX: [0.18, -0.95, -1.2, 0.18],
      armRZ: [0.28, 0.48, 0.62, 0.28],
      foreRX: [-0.7, -0.14, -0.08, -0.7],
      armLX: [0.18, -0.95, -1.18, 0.18],
      legRX: [0.04, -0.04, 0.08, 0.04],
      shinRX: [0, 0.05, 0.04, 0],
      footRZ: [0, -0.04, 0.06, 0]
    });
    addRigAttackClip(clips, nodes, "special", 0.69, {
      torsoY: [0, 0.42, -0.58, 0],
      torsoZ: [0, 0.08, -0.2, 0],
      armRX: [0.18, -1.22, -0.12, 0.18],
      armRZ: [0.28, 0.8, -0.12, 0.28],
      foreRX: [-0.7, -0.12, 0.18, -0.7],
      armLX: [0.18, -0.95, -0.4, 0.18],
      legRX: [0.04, 0.14, -0.18, 0.04],
      shinRX: [0, 0.12, 0.12, 0],
      footRZ: [0, 0.08, -0.08, 0],
      weaponRZ: [0, 0.78, -0.62, 0]
    });
    addRigAttackClip(clips, nodes, "ultimate", 0.96, {
      torsoY: [0, 0.74, -0.82, 0],
      torsoZ: [0, -0.18, 0.24, 0],
      armRX: [0.18, -1.48, -0.04, 0.18],
      armRZ: [0.28, 0.9, -0.2, 0.28],
      foreRX: [-0.7, -0.08, 0.22, -0.7],
      armLX: [0.18, -1.32, -0.7, 0.18],
      legRX: [0.04, 0.3, -0.42, 0.04],
      shinRX: [0, 0.24, 0.28, 0],
      footRZ: [0, 0.14, -0.16, 0],
      weaponRZ: [0, 1.05, -0.82, 0]
    });
    return clips;
  }

  function addRigAttackClip(clips, nodes, name, duration, pose) {
    const t = rigAttackTimes(duration);
    const tracks = [
      rigTrack(nodes, "Torso", "rotation[y]", t, pose.torsoY),
      rigTrack(nodes, "Torso", "rotation[z]", t, pose.torsoZ),
      rigTrack(nodes, "ArmR", "rotation[x]", t, pose.armRX),
      rigTrack(nodes, "ArmR", "rotation[z]", t, pose.armRZ),
      rigTrack(nodes, "ForeR", "rotation[x]", t, pose.foreRX),
      rigTrack(nodes, "ArmL", "rotation[x]", t, pose.armLX),
      rigTrack(nodes, "LegR", "rotation[x]", t, pose.legRX),
      rigTrack(nodes, "ShinR", "rotation[x]", t, pose.shinRX),
      rigTrack(nodes, "FootR", "rotation[z]", t, pose.footRZ)
    ];
    if (pose.weaponRZ) {
      tracks.push(rigTrack(nodes, "WeaponSword", "rotation[z]", t, pose.weaponRZ));
      tracks.push(rigTrack(nodes, "WeaponStaff", "rotation[z]", t, pose.weaponRZ));
      tracks.push(rigTrack(nodes, "WeaponDaggerR", "rotation[z]", t, pose.weaponRZ));
    }
    clips.push(rigClip(nodes, name, duration, tracks));
  }

  function playHumanoidClip(fighter, name, loop = false) {
    if (!fighter.rigMixer || !fighter.rigActions) return false;
    const action = fighter.rigActions[name] || fighter.rigActions.idle;
    if (!action) return false;
    const actionName = action.getClip().name;
    if (fighter.rigCurrentAction === action && fighter.rigClipName === actionName) return true;
    if (fighter.rigCurrentAction) fighter.rigCurrentAction.fadeOut(0.04);
    action.reset();
    action.enabled = true;
    action.clampWhenFinished = !loop;
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
    action.fadeIn(0.04).play();
    fighter.rigCurrentAction = action;
    fighter.rigClipName = actionName;
    return true;
  }

  function syncHumanoidRig(fighter, dt, moving) {
    if (!fighter.rigMixer) return false;
    if (fighter.action) {
      playHumanoidClip(fighter, fighter.action.id, false);
    } else if (fighter.state === "knockdown" || fighter.state === "defeat") {
      playHumanoidClip(fighter, "knockdown", false);
    } else if (fighter.state === "victory") {
      playHumanoidClip(fighter, "idle", true);
    } else if (fighter.state === "hit") {
      playHumanoidClip(fighter, "hit", false);
    } else if (fighter.state === "guard" || fighter.state === "guardLow") {
      playHumanoidClip(fighter, "guard", true);
    } else if (fighter.state === "dash") {
      playHumanoidClip(fighter, "dash", true);
    } else if (moving || fighter.state === "walk") {
      playHumanoidClip(fighter, "walk", true);
    } else {
      playHumanoidClip(fighter, "idle", true);
    }
    fighter.rigMixer.update(dt);
    return true;
  }

  function limb(parent, x, y, z, width, length, material) {
    const pivot = new THREE.Group();
    pivot.position.set(x, y, z);
    const mesh = new THREE.Mesh(sharedGeo.box, material);
    mesh.scale.set(width, length, width);
    mesh.position.y = -length * 0.5;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    pivot.add(mesh);
    parent.add(pivot);
    return pivot;
  }

  function addWeapon(character, root, parts, materials) {
    if (character.weaponType === "dagger") {
      parts.weaponL = box(parts.foreL, -0.08, -0.82, 0.18, 0.08, 0.12, 0.52, materials.metal);
      parts.weaponR = box(parts.foreR, 0.08, -0.82, 0.18, 0.08, 0.12, 0.52, materials.metal);
    } else if (character.weaponType === "sword") {
      parts.weaponR = box(parts.foreR, 0.04, -0.95, 0.46, 0.09, 0.08, 1.85, materials.metal);
      parts.weaponR.rotation.x = 0.14;
      parts.sheath = box(root, -0.45, 1.16, -0.33, 0.12, 0.12, 1.55, mats.ink);
      parts.sheath.rotation.x = 0.35;
    } else if (character.weaponType === "staff") {
      parts.weaponR = box(parts.foreR, 0.04, -0.92, 0.22, 0.08, 0.08, 2.65, materials.staff);
      parts.weaponR.rotation.x = 0.04;
    }
  }

  function createStrikeRig(character, materials) {
    const group = new THREE.Group();
    group.visible = false;
    const skin = transparentMaterial(character.colors.skin, 0.96);
    const cloth = transparentMaterial(character.colors.primary, 0.9, character.colors.accent, 0.04);
    const shoe = transparentMaterial(0x0b0e13, 0.95);
    const metal = transparentMaterial(0xe4edf4, 0.82, 0x8ed7ff, 0.55);
    const wood = transparentMaterial(0x9b5b2d, 0.9, 0xd9ad58, 0.22);
    const flare = transparentMaterial(0xffdfa0, 0.72, 0xffac38, 1.0);

    const sleeve = box(group, 0, 0, 0, 1, 1, 1, cloth, false, false);
    const arm = box(group, 0, 0, 0, 1, 1, 1, skin, false, false);
    const fist = sphere(group, 0, 0, 0, 0.16, 0.16, 0.16, skin, false, false);
    const leg = box(group, 0, 0, 0, 1, 1, 1, cloth, false, false);
    const foot = box(group, 0, 0, 0, 0.22, 0.13, 0.38, shoe, false, false);
    const weapon = box(group, 0, 0, 0, 1, 1, 1, character.weaponType === "staff" ? wood : metal, false, false);
    const trail = box(group, 0, 0, 0, 1, 1, 1, flare, false, false);
    const spark = sphere(group, 0, 0, 0, 0.18, 0.18, 0.18, mats.hit, false, false);
    const texture = getCharacterTexture(character);
    const photoArm = textureStrikePlane(group, texture, { u0: 0.35, v0: 0.34, u1: 0.86, v1: 0.74 });
    const photoLeg = textureStrikePlane(group, texture, { u0: 0.34, v0: 0.02, u1: 0.86, v1: 0.46 });
    const photoWeapon = textureStrikePlane(group, texture, character.weaponType === "staff" ? { u0: 0.08, v0: 0.16, u1: 0.94, v1: 0.84 } : { u0: 0.44, v0: 0.24, u1: 0.92, v1: 0.72 }, 0.9);

    [sleeve, arm, fist, leg, foot, weapon, trail, spark, photoArm, photoLeg, photoWeapon].forEach((mesh) => {
      mesh.visible = false;
      mesh.renderOrder = 12;
    });
    [photoArm, photoLeg, photoWeapon].forEach((mesh) => {
      mesh.renderOrder = 15;
    });

    fighterRoot.add(group);
    return { group, sleeve, arm, fist, leg, foot, weapon, trail, spark, photoArm, photoLeg, photoWeapon };
  }

  function moveData(fighter, type) {
    const base = type === "special" ? fighter.character.special : type === "ultimate" ? fighter.character.ultimate : BASE_MOVES[type] || BASE_MOVES.light;
    const stat = fighter.character.stats;
    return {
      id: type,
      name: base.name,
      damage: Math.round(base.damage * (0.86 + stat.attack * 0.055)),
      range: base.range + stat.range * 0.13,
      startup: base.startup,
      active: base.active,
      recovery: base.recovery,
      hitType: base.hitType,
      knockback: base.knockback,
      elapsed: 0,
      hasHit: false
    };
  }

  function setScreen(screen) {
    state.screen = screen;
    ui.titleScreen.classList.toggle("is-active", screen === "title");
    ui.selectScreen.classList.toggle("is-active", screen === "select");
    ui.resultScreen.classList.toggle("is-active", screen === "result");
    ui.battleHud.classList.toggle("is-active", screen === "battle");
    ui.centerMessage.classList.remove("is-active");
    input.pressed.clear();
    if (screen === "title") {
      buildPreview("title");
      maybeStartBgm();
    } else if (screen === "select") {
      renderCharacterSelect();
      buildPreview("select");
      maybeStartBgm();
    } else if (screen === "battle") {
      maybeStartBgm();
    } else {
      stopBgm();
    }
  }

  function renderCharacterSelect() {
    ui.fighterGrid.innerHTML = CHARACTERS.map((character, index) => `
      <button class="fighterCard ${index === state.selectedIndex ? "is-selected" : ""}" style="--accent:${character.cssAccent}" type="button" data-character="${character.id}">
        <img class="fighterPortrait" src="${character.asset}" alt="">
        <h3>${character.name}</h3>
        <p>${character.concept} / ${character.style}</p>
        <span>${character.weaponType === "none" ? "Unarmed" : character.weaponType}</span>
      </button>
    `).join("");
    ui.fighterGrid.querySelectorAll(".fighterCard").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-character");
        state.selectedIndex = CHARACTERS.findIndex((character) => character.id === id);
        updateSelectedCharacter();
        buildPreview("select");
      });
    });
    updateSelectedCharacter();
  }

  function updateSelectedCharacter() {
    const character = CHARACTERS[state.selectedIndex];
    ui.selectedConcept.textContent = character.concept;
    ui.selectedName.textContent = character.name;
    ui.selectedBio.textContent = character.bio;
    ui.statGrid.innerHTML = Object.entries(character.stats).map(([key, value]) => `
      <div class="statRow">
        <span>${key}</span>
        <b class="statTrack"><i style="width:${value * 20}%"></i></b>
        <em>${value}</em>
      </div>
    `).join("");
    ui.fighterGrid.querySelectorAll(".fighterCard").forEach((card, index) => {
      card.classList.toggle("is-selected", index === state.selectedIndex);
    });
  }

  function buildPreview(mode) {
    buildStage(ui.stageSelect.value || state.stageId);
    clearGroup(fighterRoot);
    state.previewFighters.length = 0;
    if (mode === "title") {
      state.previewFighters.push(makeFighter(CHARACTERS[0], "player", -2.5, true));
      state.previewFighters.push(makeFighter(CHARACTERS[2], "npc", 2.5, true));
    } else {
      const selected = CHARACTERS[state.selectedIndex];
      const rival = chooseNpc(selected.id, true);
      state.previewFighters.push(makeFighter(selected, "player", -2.0, true));
      state.previewFighters.push(makeFighter(rival, "npc", 2.0, true));
    }
    camera.position.set(0, 4.7, 10.5);
    camera.lookAt(0, 1.8, 0);
  }

  function chooseNpc(playerId, preview = false) {
    const choice = preview ? ui.npcSelect.value : state.npcChoice;
    if (choice && choice !== "random") return findCharacter(choice);
    const pool = CHARACTERS.filter((character) => character.id !== playerId);
    return pick(pool.length ? pool : CHARACTERS);
  }

  function startBattle(config = null) {
    const selected = CHARACTERS[state.selectedIndex];
    state.stageId = config?.stageId || ui.stageSelect.value;
    state.npcChoice = ui.npcSelect.value;
    state.difficulty = config?.difficulty || ui.difficultySelect.value;
    const battleConfig = config || {
      playerId: selected.id,
      npcId: chooseNpc(selected.id).id,
      stageId: state.stageId,
      difficulty: state.difficulty
    };
    state.lastBattleConfig = battleConfig;
    buildStage(battleConfig.stageId);
    clearGroup(fighterRoot);
    const player = makeFighter(findCharacter(battleConfig.playerId), "player", -4.2);
    const npc = makeFighter(findCharacter(battleConfig.npcId), "npc", 4.2);
    state.battle = {
      status: "intro",
      round: 1,
      maxRounds: 3,
      playerWins: 0,
      npcWins: 0,
      timeLeft: 60,
      introTimer: 1.35,
      endTimer: 0,
      player,
      npc,
      roundResults: [],
      finalWinner: null,
      hitStop: 0
    };
    setScreen("battle");
    showCenterMessage("Round 1");
    updateBattleHud();
  }

  function resetRound() {
    const battle = state.battle;
    clearGroup(fighterRoot);
    battle.player = makeFighter(battle.player.character, "player", -4.2);
    battle.npc = makeFighter(battle.npc.character, "npc", 4.2);
    battle.player.wins = battle.playerWins;
    battle.npc.wins = battle.npcWins;
    battle.timeLeft = 60;
    battle.status = "intro";
    battle.introTimer = 1.2;
    input.combatHistory.length = 0;
    showCenterMessage(`Round ${battle.round}`);
    updateBattleHud();
  }

  function showCenterMessage(text, duration = 1.05) {
    state.messageText = text;
    state.messageTimer = duration;
    ui.centerMessage.textContent = text;
    ui.centerMessage.classList.remove("is-active");
    void ui.centerMessage.offsetWidth;
    ui.centerMessage.classList.add("is-active");
  }

  function updateBattle(dt) {
    const battle = state.battle;
    if (!battle) return;
    if (battle.hitStop > 0) {
      battle.hitStop = Math.max(0, battle.hitStop - dt);
      dt *= 0.1;
    }

    updateCooldowns(battle.player, dt);
    updateCooldowns(battle.npc, dt);

    if (battle.status === "intro") {
      battle.introTimer -= dt;
      idleFighter(battle.player, dt);
      idleFighter(battle.npc, dt);
      if (battle.introTimer <= 0) {
        battle.status = "fight";
        showCenterMessage("Fight", 0.72);
        playSfx("start");
      }
    } else if (battle.status === "fight") {
      battle.timeLeft = Math.max(0, battle.timeLeft - dt);
      updatePlayerFighter(battle.player, battle.npc, dt);
      updateNpcFighter(battle.npc, battle.player, dt);
      resolveFighterBodyPush(battle.player, battle.npc);
      if (battle.npc.hp <= 0) {
        endRound("ko", "player");
      } else if (battle.player.hp <= 0) {
        endRound("ko", "npc");
      }
      if (battle.timeLeft <= 0) {
        endRound("time");
      }
    } else if (battle.status === "roundEnd") {
      battle.endTimer -= dt;
      idleFighter(battle.player, dt);
      idleFighter(battle.npc, dt);
      if (battle.endTimer <= 0) {
        if (battle.finalWinner) {
          showResult();
        } else {
          battle.round += 1;
          resetRound();
        }
      }
    } else if (battle.status === "paused") {
      idleFighter(battle.player, dt * 0.2);
      idleFighter(battle.npc, dt * 0.2);
    }

    updateEffects(dt);
    updateCamera(dt);
    updateBattleHud();
  }

  function updateCooldowns(fighter, dt) {
    fighter.dashCooldown = Math.max(0, fighter.dashCooldown - dt);
    fighter.dashTimer = Math.max(0, fighter.dashTimer - dt);
    fighter.specialCooldown = Math.max(0, fighter.specialCooldown - dt);
    fighter.ultimateCooldown = Math.max(0, fighter.ultimateCooldown - dt);
    fighter.hitTimer = Math.max(0, fighter.hitTimer - dt);
    fighter.knockdownTimer = Math.max(0, fighter.knockdownTimer - dt);
    fighter.invuln = Math.max(0, fighter.invuln - dt);
    fighter.flashTimer = Math.max(0, fighter.flashTimer - dt);
    fighter.guardFlashTimer = Math.max(0, fighter.guardFlashTimer - dt);
  }

  function canAct(fighter) {
    return !fighter.action && fighter.hitTimer <= 0 && fighter.knockdownTimer <= 0;
  }

  function updatePlayerFighter(player, npc, dt) {
    if (!canAct(player)) {
      updateActionOrRecovery(player, npc, dt);
      integrateFighter(player, dt);
      applyFighterPose(player, dt);
      return;
    }

    player.guarding = input.keys.has("KeyI");
    player.guardLow = player.guarding && input.keys.has("KeyS");
    player.crouching = input.keys.has("KeyS") && !input.keys.has("KeyW");

    const dir = (input.keys.has("KeyD") ? 1 : 0) - (input.keys.has("KeyA") ? 1 : 0);
    const guardMod = player.guarding ? 0.36 : 1;
    const crouchMod = player.crouching ? 0.25 : 1;
    const speed = (3.2 + player.character.stats.speed * 0.48) * guardMod * crouchMod;
    if (dir !== 0 && !player.crouching) {
      player.vx += dir * speed * dt * 5.4;
      player.state = player.dashTimer > 0 ? "dash" : "walk";
    } else if (player.guarding) {
      player.state = player.guardLow ? "guardLow" : "guard";
    } else if (player.crouching) {
      player.state = "crouch";
    } else {
      player.state = "idle";
    }

    if (input.pressed.has("KeyW") && player.onGround && !player.guarding) {
      player.vy = 8.1;
      player.onGround = false;
      player.state = "jump";
      playSfx("step");
    }

    if (input.pressed.has("KeyJ")) {
      recordCombatInput("J");
      startMove(player, player.crouching ? "low" : "light");
    } else if (input.pressed.has("KeyK")) {
      recordCombatInput("K");
      const type = comboMatches(["J", "J"]) ? "chain" : (!player.onGround ? "jumpHeavy" : (player.dashTimer > 0 ? "rush" : "heavy"));
      startMove(player, type);
    } else if (input.pressed.has("KeyL")) {
      recordCombatInput("L");
      if (comboMatches(["J", "K"]) || player.specialCooldown <= 0) startMove(player, "special");
    } else if (input.pressed.has("KeyU")) {
      startMove(player, "grab");
    } else if (input.pressed.has("KeyO")) {
      if (player.meter >= 60 && player.ultimateCooldown <= 0) startMove(player, "ultimate");
      else showCenterMessage("Need Meter", 0.45);
    }

    updateActionOrRecovery(player, npc, dt);
    integrateFighter(player, dt);
    applyFighterPose(player, dt);
  }

  function updateNpcFighter(npc, player, dt) {
    const battle = state.battle;
    if (!canAct(npc)) {
      updateActionOrRecovery(npc, player, dt);
      integrateFighter(npc, dt);
      applyFighterPose(npc, dt);
      return;
    }

    const diff = DIFFICULTY[battle.difficulty] || DIFFICULTY.normal;
    const distance = Math.abs(player.pos.x - npc.pos.x);
    npc.aiDecision -= dt;
    npc.aiGuardTimer = Math.max(0, npc.aiGuardTimer - dt);
    npc.guarding = npc.aiGuardTimer > 0;
    npc.guardLow = npc.guarding && player.crouching;

    if (npc.aiDecision <= 0) {
      npc.aiDecision = diff.reaction + rand() * 0.24;
      const playerThreatening = player.action && !player.action.hasHit && player.action.elapsed < player.action.startup + player.action.active + 0.05;
      const lowHealth = npc.hp < 32 || npc.hp + 18 < player.hp;
      const preferred = 1.55 + npc.character.stats.range * 0.22;

      if (playerThreatening && distance < (player.action?.range || 1.8) + 0.35 && rand() < diff.guard) {
        npc.aiState = "Guard";
        npc.aiGuardTimer = 0.42 + rand() * 0.22;
      } else if (lowHealth && distance < 2.4 && rand() < 0.42) {
        npc.aiState = "Retreat";
      } else if (distance > preferred + 0.55) {
        npc.aiState = "Approach";
      } else if (npc.meter >= 70 && npc.ultimateCooldown <= 0 && rand() < diff.ultimate) {
        npc.aiState = "Ultimate";
        startMove(npc, "ultimate");
      } else if (npc.specialCooldown <= 0 && rand() < 0.22 + diff.combo * 0.35) {
        npc.aiState = "Special";
        startMove(npc, "special");
      } else if (distance < 1.1 && rand() < 0.22) {
        npc.aiState = "Throw";
        startMove(npc, "grab");
      } else if (rand() < diff.aggression) {
        npc.aiState = rand() < diff.combo ? "Combo" : "Attack";
        startMove(npc, rand() < diff.combo ? "chain" : (rand() < 0.5 ? "light" : "heavy"));
      } else {
        npc.aiState = "Guard";
        npc.aiGuardTimer = 0.24 + rand() * 0.24;
      }
    }

    if (!npc.action) {
      const dir = Math.sign(player.pos.x - npc.pos.x) || -npc.facing;
      if (npc.aiState === "Approach") {
        npc.vx += dir * (2.9 + npc.character.stats.speed * 0.48) * dt * 4.8;
        npc.state = "walk";
      } else if (npc.aiState === "Retreat") {
        npc.vx -= dir * (2.6 + npc.character.stats.speed * 0.38) * dt * 4.8;
        npc.state = "walk";
      } else if (npc.guarding) {
        npc.state = npc.guardLow ? "guardLow" : "guard";
      } else {
        npc.state = "idle";
      }
    }

    updateActionOrRecovery(npc, player, dt);
    integrateFighter(npc, dt);
    applyFighterPose(npc, dt);
  }

  function recordCombatInput(code) {
    const now = performance.now();
    input.combatHistory.push({ code, at: now });
    input.combatHistory = input.combatHistory.filter((item) => now - item.at < 900).slice(-5);
  }

  function comboMatches(sequence) {
    const items = input.combatHistory.slice(-sequence.length);
    if (items.length !== sequence.length) return false;
    return sequence.every((code, index) => items[index].code === code);
  }

  function startDash(fighter, dir) {
    if (!fighter || !canAct(fighter) || fighter.dashCooldown > 0) return;
    fighter.dashTimer = 0.24;
    fighter.dashCooldown = 0.38;
    fighter.vx = dir * (7.6 + fighter.character.stats.speed * 0.65);
    fighter.state = "dash";
    spawnDust(fighter.pos.x, 0.22, 0, 0xd9ad58, 8);
    playSfx("step");
  }

  function startMove(fighter, type) {
    if (!canAct(fighter)) return false;
    if (type === "special" && fighter.specialCooldown > 0) return false;
    if (type === "ultimate" && (fighter.ultimateCooldown > 0 || fighter.meter < 60)) return false;
    const action = moveData(fighter, type);
    fighter.action = action;
    fighter.state = "attack";
    fighter.guarding = false;
    fighter.crouching = false;
    playHumanoidClip(fighter, type, false);
    if (type === "special") fighter.specialCooldown = 2.2;
    if (type === "ultimate") {
      fighter.ultimateCooldown = 6.5;
      fighter.meter = Math.max(0, fighter.meter - 60);
      state.cameraShake = Math.max(state.cameraShake, 0.18);
      showCenterMessage(action.name, 0.55);
      playSfx("ultimate");
    } else {
      playSfx(type === "light" ? "swingLight" : "swingHeavy");
    }
    spawnAttackArc(fighter, type);
    const afterimageStrength = afterimageStrengthForMove(type);
    if (afterimageStrength > 0) spawnCharacterAfterimage(fighter, afterimageStrength);
    return true;
  }

  function updateActionOrRecovery(attacker, defender, dt) {
    if (attacker.state === "defeat" || attacker.state === "victory") return;
    if (attacker.action) {
      const action = attacker.action;
      action.elapsed += dt;
      const activeStart = action.startup;
      const activeEnd = action.startup + action.active;
      if (!action.hasHit && action.elapsed >= activeStart && action.elapsed <= activeEnd) {
        tryHit(attacker, defender, action);
      }
      if (action.elapsed >= action.startup + action.active + action.recovery) {
        attacker.action = null;
        attacker.state = attacker.onGround ? "idle" : "jump";
        playHumanoidClip(attacker, "idle", true);
      }
    } else if (attacker.hitTimer > 0) {
      attacker.state = "hit";
    } else if (attacker.knockdownTimer > 0) {
      attacker.state = "knockdown";
    }
  }

  function tryHit(attacker, defender, action) {
    if (defender.invuln > 0 || state.battle.status !== "fight") return;
    const dx = defender.pos.x - attacker.pos.x;
    const inFront = Math.sign(dx || attacker.facing) === attacker.facing;
    const distance = Math.abs(dx);
    const verticalOk = Math.abs((defender.pos.y || 0) - (attacker.pos.y || 0)) < 1.75 || action.id === "ultimate";
    if (!inFront || distance > action.range || !verticalOk) return;

    action.hasHit = true;
    const canGuard = action.hitType !== "throw" && defender.guarding;
    const correctGuard = canGuard && (action.hitType === "low" ? defender.guardLow : !defender.guardLow);
    const defenseMod = 1 - (defender.character.stats.defense - 1) * 0.045;
    let damage = Math.max(1, Math.round(action.damage * defenseMod));
    let blocked = false;

    if (correctGuard) {
      blocked = true;
      damage = Math.max(1, Math.round(damage * 0.22));
      defender.hitTimer = 0.14;
      defender.guardFlashTimer = 0.16;
      defender.vx += attacker.facing * action.knockback * 0.22;
      attacker.vx -= attacker.facing * 0.42;
      spawnGuardEffect(defender.pos.x, 1.7, 0);
      playSfx("guard");
    } else {
      defender.hp = clamp(defender.hp - damage, 0, 100);
      defender.damageTaken += damage;
      defender.flashTimer = 0.18;
      defender.hitTimer = action.id === "light" ? 0.16 : 0.28;
      if (action.id === "heavy" || action.id === "chain" || action.id === "rush" || action.id === "ultimate") {
        defender.knockdownTimer = action.id === "ultimate" ? 0.82 : 0.48;
        defender.vy = Math.max(defender.vy, action.id === "ultimate" ? 4.2 : 2.6);
      }
      defender.vx += attacker.facing * action.knockback;
      defender.state = defender.knockdownTimer > 0 ? "knockdown" : "hit";
      spawnHitEffect(defender.pos.x, 1.65, 0, action.id);
      playSfx(action.id === "ultimate" ? "bigHit" : "hit");
      state.cameraShake = Math.max(state.cameraShake, action.id === "ultimate" ? 0.28 : 0.11);
      state.battle.hitStop = action.id === "ultimate" ? 0.095 : 0.045;
    }

    attacker.meter = clamp(attacker.meter + (blocked ? 5 : 10), 0, 100);
    defender.meter = clamp(defender.meter + (blocked ? 4 : 6), 0, 100);
    const now = clock.elapsedTime;
    attacker.combo = now - attacker.lastHitAt < 1.15 ? attacker.combo + 1 : 1;
    attacker.lastHitAt = now;
    if (!blocked && attacker.combo >= 2) {
      ui.comboReadout.textContent = `${attacker.combo} Hit`;
    }

    if (defender.hp <= 0) {
      endRound("ko", attacker.kind);
    }
  }

  function integrateFighter(fighter, dt) {
    const battle = state.battle;
    const opponent = fighter.kind === "player" ? battle.npc : battle.player;
    fighter.facing = fighter.pos.x <= opponent.pos.x ? 1 : -1;
    fighter.vy -= 19.5 * dt;
    fighter.pos.x += fighter.vx * dt;
    fighter.pos.y += fighter.vy * dt;
    fighter.pos.x = clamp(fighter.pos.x, -11.2, 11.2);
    if (fighter.pos.y <= 0) {
      fighter.pos.y = 0;
      fighter.vy = 0;
      fighter.onGround = true;
    } else {
      fighter.onGround = false;
    }
    const friction = fighter.onGround ? 0.024 : 0.18;
    fighter.vx *= Math.pow(friction, dt);
    fighter.group.position.copy(fighter.pos);
    fighter.group.rotation.y = fighter.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
    fighter.parts.shadow.scale.setScalar(clamp(1 - fighter.pos.y * 0.08, 0.55, 1));
    if (fighter.parts.sprite) {
      const base = fighter.parts.spriteBaseScale;
      fighter.parts.sprite.position.set(fighter.pos.x, base.height * 0.5 - fighter.parts.spriteGroundInset + fighter.pos.y, 0.08);
    }
  }

  function resolveFighterBodyPush(a, b) {
    const minDistance = 1.05;
    const dx = b.pos.x - a.pos.x;
    const distance = Math.abs(dx);
    if (distance <= 0.001 || distance > minDistance) return;
    const push = (minDistance - distance) * 0.5;
    const dir = Math.sign(dx);
    a.pos.x -= dir * push;
    b.pos.x += dir * push;
  }

  function idleFighter(fighter, dt) {
    integrateFighter(fighter, dt);
    if (!fighter.action && fighter.hitTimer <= 0 && fighter.knockdownTimer <= 0 && fighter.state !== "defeat" && fighter.state !== "victory") fighter.state = "idle";
    applyFighterPose(fighter, dt);
  }

  function applyFighterPose(fighter, dt) {
    const p = fighter.parts;
    fighter.step += dt * (fighter.state === "walk" || fighter.state === "dash" ? 9.5 : 2.6);
    const walk = Math.sin(fighter.step);
    const counter = Math.sin(fighter.step + Math.PI);
    const moving = Math.abs(fighter.vx) > 0.08 && fighter.onGround;
    const bob = moving ? Math.abs(walk) * 0.12 : Math.sin(clock.elapsedTime * 2.1 + fighter.kind.length) * 0.035;
    const crouch = fighter.state === "crouch" || fighter.state === "guardLow" ? 0.42 : 0;

    p.root.position.y = -crouch + bob + fighter.pos.y * 0.02;
    p.root.rotation.set(0, 0, 0);
    p.torso.rotation.set(0, 0, 0);
    p.head.rotation.set(0, 0, 0);
    p.armL.rotation.set(0.18, 0, -0.28);
    p.armR.rotation.set(0.18, 0, 0.28);
    p.foreL.rotation.set(-0.7, 0, 0);
    p.foreR.rotation.set(-0.7, 0, 0);
    p.legL.rotation.set(moving ? walk * 0.5 : 0.08, 0, 0.08);
    p.legR.rotation.set(moving ? counter * 0.5 : -0.08, 0, -0.08);
    p.shinL.rotation.set(moving ? Math.max(0, -walk) * 0.42 : 0, 0, 0);
    p.shinR.rotation.set(moving ? Math.max(0, -counter) * 0.42 : 0, 0, 0);

    if (fighter.weapon) fighter.weapon.rotation.set(0, 0, 0);

    if (!fighter.onGround) {
      p.root.position.y += 0.15;
      p.legL.rotation.x = -0.48;
      p.legR.rotation.x = 0.5;
      p.shinL.rotation.x = 0.55;
      p.shinR.rotation.x = -0.25;
    }

    if (fighter.state === "guard" || fighter.state === "guardLow") {
      p.armL.rotation.set(-0.72, 0, -0.38);
      p.armR.rotation.set(-0.78, 0, 0.38);
      p.foreL.rotation.set(-0.58, 0, 0.18);
      p.foreR.rotation.set(-0.58, 0, -0.18);
      p.root.rotation.z = fighter.state === "guardLow" ? -0.08 : 0;
    }

    if (fighter.state === "hit") {
      p.root.rotation.x = -0.18;
      p.torso.rotation.x = -0.28;
      p.head.rotation.x = -0.2;
      p.armL.rotation.x = 0.32;
      p.armR.rotation.x = 0.36;
    }

    if (fighter.state === "knockdown" || fighter.state === "defeat") {
      const defeated = fighter.state === "defeat";
      p.root.rotation.x = defeated ? 1.45 : 1.22;
      p.root.rotation.z = defeated ? -fighter.facing * 0.35 : 0;
      p.root.position.y = (defeated ? -0.92 : -0.74) + fighter.pos.y;
      p.armL.rotation.x = -0.2;
      p.armR.rotation.x = -0.1;
      p.legL.rotation.x = 0.55;
      p.legR.rotation.x = -0.2;
    }

    const rigDriven = syncHumanoidRig(fighter, dt, moving);
    if (fighter.action && !rigDriven) {
      applyAttackPose(fighter, fighter.action);
    }

    if (p.sprite) {
      const usingFallenAsset = fighter.state === "defeat" && Boolean(p.fallenTexture);
      const targetTexture = usingFallenAsset ? p.fallenTexture : p.standTexture;
      if (targetTexture && p.sprite.material.map !== targetTexture) {
        p.sprite.material.map = targetTexture;
        p.sprite.material.needsUpdate = true;
      }
      const base = usingFallenAsset ? p.fallenSpriteBaseScale : p.spriteBaseScale;
      const groundInset = usingFallenAsset ? p.fallenSpriteGroundInset : p.spriteGroundInset;
      const motion = computeSpriteMotion(fighter, bob, crouch, moving, base, usingFallenAsset, groundInset);
      let scaleX = base.width * (fighter.facing >= 0 ? 1 : -1) * motion.scaleX;
      let scaleY = base.height * motion.scaleY;
      p.sprite.position.set(motion.x, motion.y, motion.z);
      p.sprite.scale.set(scaleX, scaleY, 1);
      p.sprite.rotation.set(0, motion.yaw, motion.rotationZ);
      fighter.debugVisualMotion = {
        x: motion.x,
        bodyX: fighter.pos.x,
        y: motion.y,
        rotationZ: motion.rotationZ,
        lunge: motion.lunge,
        groundInset,
        spriteMode: usingFallenAsset ? "fallen-asset" : "standing-asset"
      };
      if (fighter.flashTimer > 0) {
        p.sprite.material.color.setRGB(1.35, 0.76, 0.56);
      } else if (fighter.guardFlashTimer > 0) {
        p.sprite.material.color.setRGB(0.62, 0.84, 1.25);
      } else {
        p.sprite.material.color.setRGB(1, 1, 1);
      }
    }

    updateStrikeRig(fighter);

    if (fighter.preview) {
      fighter.group.rotation.y += dt * (fighter.kind === "player" ? 0.12 : -0.12);
    }
  }

  function spriteAttackProfile(action) {
    const defaults = { windup: 0.14, lunge: 0.34, lean: 0.1, lift: 0, squash: 0.04 };
    const profiles = {
      light: { windup: 0.12, lunge: 0.36, lean: 0.1, lift: 0, squash: 0.035 },
      low: { windup: 0.1, lunge: 0.44, lean: -0.12, lift: -0.28, squash: 0.065 },
      heavy: { windup: 0.22, lunge: 0.68, lean: 0.18, lift: 0.02, squash: 0.07 },
      jumpHeavy: { windup: 0.16, lunge: 0.56, lean: 0.2, lift: 0.34, squash: 0.055 },
      rush: { windup: 0.18, lunge: 1.02, lean: 0.24, lift: 0.04, squash: 0.075 },
      chain: { windup: 0.18, lunge: 0.62, lean: 0.18, lift: 0.01, squash: 0.065 },
      grab: { windup: 0.12, lunge: 0.58, lean: 0.16, lift: 0, squash: 0.045 },
      special: { windup: 0.2, lunge: 0.76, lean: 0.24, lift: 0.1, squash: 0.08 },
      ultimate: { windup: 0.26, lunge: 0.92, lean: 0.3, lift: 0.18, squash: 0.09 }
    };
    return profiles[action.id] || defaults;
  }

  function computeSpriteMotion(fighter, bob, crouch, moving, base, usingFallenAsset = false, groundInset = 0) {
    const facing = fighter.facing >= 0 ? 1 : -1;
    const groundedY = base.height * 0.5 + fighter.pos.y - groundInset;
    const motion = {
      x: fighter.pos.x,
      y: groundedY - crouch * 0.36 + bob * 0.22,
      z: 0.1 + (fighter.kind === "player" ? 0.02 : 0),
      yaw: facing > 0 ? -0.16 : 0.16,
      rotationZ: 0,
      scaleX: 1,
      scaleY: 1,
      lunge: 0
    };

    if (fighter.action && fighter.state === "attack") {
      const action = fighter.action;
      const profile = spriteAttackProfile(action);
      const startupT = clamp(action.elapsed / Math.max(0.001, action.startup), 0, 1);
      const activeT = clamp((action.elapsed - action.startup) / Math.max(0.001, action.active), 0, 1);
      const recoveryT = clamp((action.elapsed - action.startup - action.active) / Math.max(0.001, action.recovery), 0, 1);
      const inStartup = action.elapsed < action.startup;
      const inActive = action.elapsed >= action.startup && action.elapsed <= action.startup + action.active;
      const recoveryHold = 1 - smoothstep(recoveryT);
      const activePush = smoothstep(activeT);

      if (inStartup) {
        motion.lunge = -profile.windup * Math.sin(startupT * Math.PI);
        motion.rotationZ = facing * profile.lean * 0.55 * Math.sin(startupT * Math.PI);
        motion.scaleX += profile.squash * 0.35 * Math.sin(startupT * Math.PI);
        motion.scaleY -= profile.squash * 0.18 * Math.sin(startupT * Math.PI);
      } else if (inActive) {
        motion.lunge = profile.lunge * (0.18 + activePush * 0.82);
        motion.rotationZ = -facing * profile.lean * (0.35 + activePush * 0.65);
        motion.scaleX += profile.squash * (0.55 + activePush * 0.45);
        motion.scaleY -= profile.squash * 0.35;
      } else {
        motion.lunge = profile.lunge * recoveryHold * 0.42;
        motion.rotationZ = -facing * profile.lean * recoveryHold * 0.45;
        motion.scaleX += profile.squash * recoveryHold * 0.35;
        motion.scaleY -= profile.squash * recoveryHold * 0.18;
      }

      motion.x += facing * motion.lunge;
      motion.y += profile.lift * Math.sin(clamp((startupT + activeT) * 0.5, 0, 1) * Math.PI);
      motion.z += 0.02 + Math.abs(motion.lunge) * 0.03;
      if (action.id === "ultimate" || action.id === "special") {
        motion.yaw += facing * Math.sin(clamp(action.elapsed / Math.max(0.001, action.startup + action.active), 0, 1) * Math.PI) * 0.08;
      }
    } else if (fighter.state === "hit") {
      const recoil = clamp(fighter.hitTimer / 0.28, 0.25, 1);
      motion.x -= facing * 0.18 * recoil;
      motion.rotationZ = facing * 0.12 * recoil;
      motion.scaleX *= 0.98;
      motion.scaleY *= 1.015;
      motion.z += 0.04;
      motion.lunge = -0.18 * recoil;
    } else if (fighter.state === "knockdown" || fighter.state === "defeat") {
      const defeated = fighter.state === "defeat";
      motion.rotationZ = usingFallenAsset ? 0 : -facing * (defeated ? 1.34 : 0.82);
      motion.y = usingFallenAsset ? groundedY : (defeated ? 0.62 : 0.88) + fighter.pos.y;
      motion.x -= facing * (usingFallenAsset ? 0.12 : defeated ? 0.38 : 0.24);
      motion.scaleX *= usingFallenAsset ? 1 : defeated ? 1.16 : 1.08;
      motion.scaleY *= usingFallenAsset ? 1 : defeated ? 0.58 : 0.76;
      motion.z += 0.05;
      motion.lunge = usingFallenAsset ? -0.12 : defeated ? -0.38 : -0.24;
    } else if (fighter.state === "dash") {
      const dashLean = clamp(Math.abs(fighter.vx) / 9, 0, 1);
      motion.x += facing * 0.16 * dashLean;
      motion.rotationZ = -facing * 0.08 * dashLean;
      motion.scaleX *= 1 + dashLean * 0.035;
      motion.scaleY *= 1 - dashLean * 0.015;
      motion.lunge = 0.16 * dashLean;
    } else if (moving) {
      const walkLean = clamp(fighter.vx * facing / 5, -1, 1);
      motion.rotationZ = -facing * walkLean * 0.035;
      motion.x += facing * walkLean * 0.035;
      motion.lunge = walkLean * 0.035;
    }

    motion.y += (base.height * 0.5 - groundInset) * (motion.scaleY - 1);
    return motion;
  }

  function updateStrikeRig(fighter) {
    const rig = fighter.parts.strike;
    if (!rig) return;
    const action = fighter.action;
    if (!action || fighter.state !== "attack") {
      rig.group.visible = false;
      return;
    }

    const total = action.startup + action.active + action.recovery;
    const t = clamp(action.elapsed / total, 0, 1);
    const activeT = clamp((action.elapsed - action.startup) / Math.max(0.001, action.active), 0, 1);
    const wind = Math.sin(clamp(t * 1.25, 0, 1) * Math.PI);
    const extension = action.range * (0.22 + 0.78 * Math.sin(activeT * Math.PI * 0.5));
    const facing = fighter.facing;
    const isLow = action.hitType === "low";
    const isWeapon = fighter.character.weaponType !== "none" || action.id === "special" || action.id === "ultimate";
    const isKick = isLow || action.id === "jumpHeavy";
    const punchY = action.id === "grab" ? 1.78 : action.id === "ultimate" ? 2.18 : 2.03;
    const kickY = isLow ? 0.82 : 1.24;
    const reach = clamp(extension, 0.35, action.range);
    const z = 0.32 + (fighter.kind === "player" ? 0.04 : 0);
    const usePhotoStrikes = Boolean(rig.photoArm && fighter.parts.glbRig);
    const photoOpacity = 0.58 + wind * 0.38;

    rig.group.visible = true;
    rig.group.position.set(fighter.pos.x, 0, z);
    rig.group.rotation.set(0, 0, 0);

    [rig.sleeve, rig.arm, rig.fist, rig.leg, rig.foot, rig.weapon, rig.trail, rig.spark, rig.photoArm, rig.photoLeg, rig.photoWeapon].forEach((mesh) => {
      if (!mesh) return;
      mesh.visible = false;
      if (mesh.material?.opacity !== undefined) mesh.material.opacity = 0.3 + wind * 0.65;
    });

    if (!isKick) {
      if (usePhotoStrikes) {
        rig.photoArm.visible = true;
        rig.photoArm.material.opacity = photoOpacity;
        rig.photoArm.position.set(facing * (0.5 + reach * 0.5), punchY - 0.02, 0.05);
        rig.photoArm.scale.set(facing * clamp(reach * 0.82, 0.88, 2.35), action.id === "grab" ? 0.92 : 0.78, 1);
        rig.photoArm.rotation.z = facing * (action.id === "grab" ? 0.1 : -0.05);
      } else {
        rig.sleeve.visible = true;
        rig.arm.visible = true;
        rig.fist.visible = true;
        rig.sleeve.position.set(facing * (0.32 + reach * 0.22), punchY + 0.02, 0);
        rig.sleeve.scale.set(reach * 0.44, 0.16, 0.13);
        rig.sleeve.rotation.z = facing * -0.08;
        rig.arm.position.set(facing * (0.52 + reach * 0.5), punchY, 0);
        rig.arm.scale.set(reach * 0.62, 0.12, 0.12);
        rig.arm.rotation.z = facing * (action.id === "grab" ? 0.14 : -0.04);
        rig.fist.position.set(facing * (0.72 + reach), punchY, 0);
        rig.fist.scale.setScalar(action.id === "heavy" || action.id === "ultimate" ? 0.23 : 0.17);
      }
    }

    if (isKick) {
      if (usePhotoStrikes) {
        rig.photoLeg.visible = true;
        rig.photoLeg.material.opacity = photoOpacity;
        rig.photoLeg.position.set(facing * (0.48 + reach * 0.55), kickY + (isLow ? -0.04 : 0.1), 0.05);
        rig.photoLeg.scale.set(facing * clamp(reach * 0.96, 0.92, 2.5), isLow ? 0.78 : 0.96, 1);
        rig.photoLeg.rotation.z = facing * (isLow ? -0.2 : 0.28);
      } else {
        rig.leg.visible = true;
        rig.foot.visible = true;
        rig.leg.position.set(facing * (0.46 + reach * 0.48), kickY, 0);
        rig.leg.scale.set(reach * 0.7, 0.18, 0.14);
        rig.leg.rotation.z = facing * (isLow ? -0.18 : 0.22);
        rig.foot.position.set(facing * (0.72 + reach), kickY + (isLow ? -0.02 : 0.12), 0);
        rig.foot.scale.set(0.24, 0.13, 0.42);
        rig.foot.rotation.z = facing * (isLow ? -0.14 : 0.28);
      }
    }

    if (isWeapon) {
      const weaponY = isLow ? 1.02 : punchY + 0.04;
      if (usePhotoStrikes && fighter.character.weaponType !== "none") {
        rig.photoWeapon.visible = true;
        rig.photoWeapon.material.opacity = clamp(photoOpacity + 0.08, 0, 1);
        rig.photoWeapon.position.set(facing * (0.62 + reach * 0.55), weaponY + 0.02, 0.08);
        rig.photoWeapon.scale.set(facing * reach * (fighter.character.weaponType === "staff" ? 1.36 : 0.96), fighter.character.weaponType === "staff" ? 0.38 : 0.7, 1);
        rig.photoWeapon.rotation.z = facing * (fighter.character.weaponType === "staff" ? 0.2 : 0.34);
      } else {
        rig.weapon.visible = true;
        rig.weapon.position.set(facing * (0.58 + reach * 0.52), weaponY, 0.01);
        rig.weapon.scale.set(reach * (fighter.character.weaponType === "staff" ? 1.1 : 0.82), 0.08, 0.08);
        rig.weapon.rotation.z = facing * (fighter.character.weaponType === "staff" ? 0.22 : 0.34);
      }
    }

    rig.trail.visible = true;
    rig.trail.position.set(facing * (0.56 + reach * 0.55), isLow ? 0.92 : punchY + 0.08, -0.02);
    rig.trail.scale.set(reach * 1.08, action.id === "ultimate" ? 0.14 : 0.08, 0.08);
    rig.trail.rotation.z = facing * (isLow ? -0.22 : 0.2);

    rig.spark.visible = action.elapsed >= action.startup && action.elapsed <= action.startup + action.active;
    rig.spark.position.set(facing * (0.82 + reach), isLow ? 0.92 : punchY + 0.04, 0.04);
    rig.spark.scale.setScalar(action.id === "ultimate" ? 0.35 : 0.22);
  }

  function applyAttackPose(fighter, action) {
    const p = fighter.parts;
    const total = action.startup + action.active + action.recovery;
    const t = clamp(action.elapsed / total, 0, 1);
    const hitT = clamp((action.elapsed - action.startup) / Math.max(0.001, action.active), 0, 1);
    const swing = Math.sin(t * Math.PI);
    p.root.rotation.z = -0.12 * swing;

    if (action.id === "light" || action.id === "low") {
      p.armR.rotation.set(-1.2 + hitT * 0.55, 0, 0.35);
      p.foreR.rotation.set(-0.18, 0, 0);
      if (action.id === "low") {
        p.root.position.y -= 0.3;
        p.legR.rotation.x = -1.0 * swing;
      }
    } else if (action.id === "heavy" || action.id === "chain" || action.id === "rush") {
      p.torso.rotation.y = -0.35 * swing;
      p.armR.rotation.set(-1.45 + hitT * 1.4, 0, 0.62);
      p.foreR.rotation.set(-0.1, 0, 0);
      if (action.id === "rush") p.root.position.z += Math.sin(t * Math.PI) * 0.28;
    } else if (action.id === "grab") {
      p.armL.rotation.set(-1.15, 0, -0.48);
      p.armR.rotation.set(-1.15, 0, 0.48);
      p.foreL.rotation.set(-0.2, 0, 0);
      p.foreR.rotation.set(-0.2, 0, 0);
    } else if (action.id === "special") {
      p.torso.rotation.y = -0.5 * swing;
      p.armL.rotation.set(-1.0, 0, -0.25);
      p.armR.rotation.set(-1.2 + hitT * 1.2, 0, 0.45);
      if (fighter.character.weaponType === "staff") p.root.rotation.y = Math.sin(t * Math.PI) * 0.7;
    } else if (action.id === "ultimate") {
      p.root.position.y += Math.sin(t * Math.PI) * 0.35;
      p.root.rotation.y = Math.sin(t * Math.PI) * 1.1;
      p.armL.rotation.set(-1.2, 0, -0.6);
      p.armR.rotation.set(-1.45 + hitT * 1.4, 0, 0.65);
    }
  }

  function afterimageStrengthForMove(type) {
    if (type === "ultimate") return 1;
    if (type === "special" || type === "rush") return 0.78;
    if (type === "heavy" || type === "chain" || type === "jumpHeavy") return 0.58;
    if (type === "low" || type === "grab") return 0.38;
    return 0;
  }

  function spawnCharacterAfterimage(fighter, strength = 0.5) {
    const sprite = fighter.parts.sprite;
    if (!sprite?.material?.map) return;
    const opacity = 0.14 + strength * 0.13;
    const material = new THREE.MeshBasicMaterial({
      map: sprite.material.map,
      color: 0xffdf9c,
      transparent: true,
      opacity,
      alphaTest: 0.025,
      depthWrite: false,
      depthTest: true,
      side: THREE.DoubleSide
    });
    const ghost = new THREE.Mesh(sharedGeo.plane, material);
    ghost.position.copy(sprite.position);
    ghost.position.x -= fighter.facing * (0.12 + strength * 0.16);
    ghost.position.z -= 0.04;
    ghost.rotation.copy(sprite.rotation);
    ghost.scale.copy(sprite.scale);
    ghost.renderOrder = sprite.renderOrder - 1;
    effectRoot.add(ghost);
    effects.push({
      group: ghost,
      life: 0.18 + strength * 0.14,
      maxLife: 0.18 + strength * 0.14,
      fade: true,
      opacity
    });
  }

  function spawnAttackArc(fighter, type) {
    const group = new THREE.Group();
    const count = type === "ultimate" ? 36 : type === "special" ? 24 : 14;
    const radius = type === "ultimate" ? 2.3 : type === "special" ? 1.85 : 1.25;
    const width = type === "low" ? 0.12 : 0.2;
    for (let i = 0; i < count; i++) {
      const t = i / Math.max(1, count - 1);
      const angle = -0.8 + t * 1.6;
      const block = box(group, Math.sin(angle) * radius, 1.35 + Math.sin(t * Math.PI) * (type === "low" ? -0.7 : 0.45), Math.cos(angle) * 0.22, width, 0.07, 0.36, type === "ultimate" ? mats.hit : mats.guard, false, false);
      block.rotation.y = angle;
    }
    group.position.copy(fighter.pos);
    group.rotation.y = fighter.facing > 0 ? Math.PI / 2 : -Math.PI / 2;
    effectRoot.add(group);
    effects.push({ group, life: type === "ultimate" ? 0.42 : 0.22, maxLife: type === "ultimate" ? 0.42 : 0.22, fade: true });
  }

  function spawnHitEffect(x, y, z, type) {
    const group = new THREE.Group();
    const count = type === "ultimate" ? 30 : 16;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = type === "ultimate" ? 1.2 : 0.68;
      const shard = box(group, Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2, Math.sin(a * 1.7) * 0.12, 0.12, 0.12, 0.42, mats.hit, false, false);
      shard.rotation.set(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI);
    }
    group.position.set(x, y, z);
    effectRoot.add(group);
    effects.push({ group, life: 0.34, maxLife: 0.34, expand: 2.4, fade: true });
    spawnDust(x, 0.12, z, 0xd9ad58, type === "ultimate" ? 18 : 9);
  }

  function spawnGuardEffect(x, y, z) {
    const ring = new THREE.Mesh(sharedGeo.torus, mats.guard);
    ring.position.set(x, y, z);
    ring.rotation.y = Math.PI / 2;
    effectRoot.add(ring);
    effects.push({ group: ring, life: 0.26, maxLife: 0.26, expand: 1.6, fade: true });
  }

  function spawnDust(x, y, z, color, count) {
    const material = mat(color, 0.95, 0, true, 0.72);
    const group = new THREE.Group();
    group.position.set(x, y, z);
    for (let i = 0; i < count; i++) {
      const dust = box(group, range(-0.28, 0.28), 0, range(-0.18, 0.18), range(0.06, 0.14), range(0.04, 0.09), range(0.06, 0.14), material, false, false);
      dust.userData.velocity = new THREE.Vector3(range(-0.8, 0.8), range(0.4, 1.2), range(-0.5, 0.5));
    }
    effectRoot.add(group);
    effects.push({ group, life: 0.42, maxLife: 0.42, dust: true, fade: true });
  }

  function updateEffects(dt) {
    for (let i = effects.length - 1; i >= 0; i--) {
      const effect = effects[i];
      effect.life -= dt;
      const t = 1 - effect.life / effect.maxLife;
      if (effect.expand) effect.group.scale.setScalar(1 + t * effect.expand);
      if (effect.dust) {
        effect.group.children.forEach((child) => {
          child.position.addScaledVector(child.userData.velocity, dt);
          child.userData.velocity.y -= 2.2 * dt;
        });
      }
      if (effect.fade) {
        effect.group.traverse((node) => {
          if (node.isMesh && node.material.opacity !== undefined) {
            node.material.opacity = clamp(effect.life / effect.maxLife, 0, 1) * (effect.opacity ?? 0.82);
          }
        });
      }
      if (effect.life <= 0) {
        effectRoot.remove(effect.group);
        effects.splice(i, 1);
      }
    }
  }

  function forceKoFall(loser, winner) {
    loser.action = null;
    loser.actionLocked = false;
    loser.guarding = false;
    loser.guardLow = false;
    loser.crouching = false;
    loser.koDefeated = true;
    loser.hitTimer = 0;
    loser.knockdownTimer = 8;
    loser.invuln = Math.max(loser.invuln, 0.8);
    loser.vy = 0;
    loser.vx += (winner?.facing || loser.facing) * 1.4;
    loser.state = "defeat";
    playHumanoidClip(loser, "knockdown", false);
    spawnDust(loser.pos.x, 0.12, 0, 0x9a6b4a, 14);
  }

  function forceVictoryPose(winner) {
    winner.action = null;
    winner.actionLocked = false;
    winner.guarding = false;
    winner.guardLow = false;
    winner.crouching = false;
    winner.hitTimer = 0;
    winner.knockdownTimer = 0;
    winner.vx *= 0.35;
    winner.state = "victory";
    playHumanoidClip(winner, "idle", true);
  }

  function endRound(reason, forcedWinner = null) {
    const battle = state.battle;
    if (!battle || battle.status !== "fight") return;
    let winner = forcedWinner;
    if (!winner) {
      if (battle.player.hp > battle.npc.hp) winner = "player";
      else if (battle.npc.hp > battle.player.hp) winner = "npc";
      else winner = "draw";
    }

    if (winner === "player") battle.playerWins += 1;
    if (winner === "npc") battle.npcWins += 1;
    battle.player.wins = battle.playerWins;
    battle.npc.wins = battle.npcWins;

    const perfect = winner === "player" && battle.player.damageTaken === 0 || winner === "npc" && battle.npc.damageTaken === 0;
    const resultText = winner === "draw" ? "Draw" : reason === "time" ? "Time Up" : perfect ? "Perfect" : "KO";
    battle.roundResults.push({
      round: battle.round,
      winner,
      reason,
      playerHp: Math.round(battle.player.hp),
      npcHp: Math.round(battle.npc.hp),
      perfect
    });

    battle.status = "roundEnd";
    battle.endTimer = 2.35;
    if (winner === "player") {
      forceVictoryPose(battle.player);
      if (reason === "ko") forceKoFall(battle.npc, battle.player);
      else battle.npc.state = "defeat";
    } else if (winner === "npc") {
      forceVictoryPose(battle.npc);
      if (reason === "ko") forceKoFall(battle.player, battle.npc);
      else battle.player.state = "defeat";
    }
    showCenterMessage(resultText, 1.8);
    playSfx(reason === "ko" ? "ko" : "start");

    if (battle.playerWins >= 2 || battle.npcWins >= 2 || battle.round >= battle.maxRounds) {
      if (battle.playerWins > battle.npcWins) battle.finalWinner = "player";
      else if (battle.npcWins > battle.playerWins) battle.finalWinner = "npc";
      else battle.finalWinner = "draw";
    }
  }

  function showResult() {
    const battle = state.battle;
    const playerWon = battle.finalWinner === "player";
    const draw = battle.finalWinner === "draw";
    ui.resultKicker.textContent = `${battle.player.character.name} ${battle.playerWins} - ${battle.npcWins} ${battle.npc.character.name}`;
    ui.resultTitle.textContent = draw ? "Draw" : playerWon ? "Victory" : "Defeat";
    ui.resultDetail.textContent = draw
      ? "The duel ends without a clear victor."
      : `${playerWon ? battle.player.character.name : battle.npc.character.name} wins the match.`;
    ui.resultRounds.innerHTML = battle.roundResults.map((round) => {
      const label = round.winner === "draw" ? "Draw" : round.winner === "player" ? battle.player.character.name : battle.npc.character.name;
      const reason = round.perfect ? "Perfect" : round.reason === "ko" ? "KO" : "Time Up";
      return `<span><b>Round ${round.round}</b><em>${label} / ${reason} / ${round.playerHp}-${round.npcHp}</em></span>`;
    }).join("");
    setScreen("result");
  }

  function updateCamera(dt) {
    const battle = state.battle;
    let targetX = 0;
    let distance = 5;
    if (battle) {
      targetX = (battle.player.pos.x + battle.npc.pos.x) * 0.5;
      distance = Math.abs(battle.player.pos.x - battle.npc.pos.x);
    }
    const desired = tmpVec.set(targetX, 4.8 + distance * 0.06, 12.6 + distance * 0.42);
    if (state.cameraShake > 0 && state.settings.shake) {
      desired.x += range(-state.cameraShake, state.cameraShake);
      desired.y += range(-state.cameraShake, state.cameraShake);
      desired.z += range(-state.cameraShake, state.cameraShake);
    }
    camera.position.lerp(desired, 1 - Math.pow(0.0008, dt));
    camera.lookAt(tmpVec2.set(targetX, 1.75, 0));
    state.cameraShake *= Math.pow(0.04, dt);
  }

  function updateBattleHud() {
    const battle = state.battle;
    if (!battle) return;
    ui.playerName.textContent = battle.player.character.name;
    ui.playerStyle.textContent = battle.player.character.style;
    ui.npcName.textContent = battle.npc.character.name;
    ui.npcStyle.textContent = battle.npc.character.style;
    ui.playerHealth.style.width = `${battle.player.hp}%`;
    ui.npcHealth.style.width = `${battle.npc.hp}%`;
    ui.playerMeter.style.width = `${battle.player.meter}%`;
    ui.npcMeter.style.width = `${battle.npc.meter}%`;
    ui.roundTimer.textContent = String(Math.ceil(battle.timeLeft));
    ui.roundLabel.textContent = battle.status === "paused" ? "Paused" : `Round ${battle.round}`;
    ui.playerRounds.innerHTML = roundDots(battle.playerWins);
    ui.npcRounds.innerHTML = roundDots(battle.npcWins);
    ui.aiReadout.textContent = `NPC: ${battle.npc.aiState}`;
    if (clock.elapsedTime - battle.player.lastHitAt > 1.05) {
      ui.comboReadout.textContent = "";
      battle.player.combo = 0;
    }
  }

  function roundDots(wins) {
    return `<i class="${wins >= 1 ? "is-won" : ""}"></i><i class="${wins >= 2 ? "is-won" : ""}"></i>`;
  }

  function updatePreview(dt) {
    for (const fighter of state.previewFighters) {
      fighter.state = "idle";
      if (fighter.kind === "player") fighter.facing = 1;
      else fighter.facing = -1;
      fighter.pos.y = 0;
      fighter.group.position.copy(fighter.pos);
      applyFighterPose(fighter, dt);
    }
    if (state.screen === "title") {
      camera.position.lerp(tmpVec.set(0, 4.9, 11.8), 1 - Math.pow(0.001, dt));
      camera.lookAt(0, 1.9, 0);
    } else if (state.screen === "select") {
      camera.position.lerp(tmpVec.set(0, 4.5, 9.8), 1 - Math.pow(0.001, dt));
      camera.lookAt(0, 1.8, 0);
    }
  }

  function maybeStartBgm() {
    if (!state.settings.bgm || bgm || !audioContext) return;
    const drone = audioContext.createOscillator();
    const pulse = audioContext.createOscillator();
    const gain = audioContext.createGain();
    drone.type = "sine";
    pulse.type = "triangle";
    drone.frequency.value = 82;
    pulse.frequency.value = 164;
    gain.gain.value = 0.018;
    drone.connect(gain);
    pulse.connect(gain);
    gain.connect(audioContext.destination);
    drone.start();
    pulse.start();
    bgm = { drone, pulse, gain };
  }

  function stopBgm() {
    if (!bgm) return;
    bgm.gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.08);
    setTimeout(() => {
      try {
        bgm.drone.stop();
        bgm.pulse.stop();
      } catch {
        // Oscillators can already be stopped after a fast screen change.
      }
      bgm = null;
    }, 160);
  }

  function ensureAudio() {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === "suspended") audioContext.resume();
  }

  function playSfx(kind) {
    if (!state.settings.sfx) return;
    ensureAudio();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    const map = {
      start: [320, 0.05, "triangle"],
      step: [120, 0.04, "sine"],
      swingLight: [210, 0.035, "triangle"],
      swingHeavy: [150, 0.055, "sawtooth"],
      hit: [96, 0.075, "square"],
      bigHit: [58, 0.12, "sawtooth"],
      guard: [430, 0.07, "triangle"],
      ultimate: [72, 0.16, "sawtooth"],
      ko: [52, 0.32, "sawtooth"]
    };
    const [freq, dur, type] = map[kind] || map.hit;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.58), now + dur);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "ko" ? 0.12 : 0.055, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  function toggleModal(modal, show) {
    modal.classList.toggle("is-active", show);
    modal.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function applyQuality() {
    const q = state.settings.quality;
    const ratio = q === "high" ? 1.8 : q === "medium" ? 1.35 : 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, ratio));
    renderer.shadowMap.enabled = q !== "low";
  }

  function bindEvents() {
    buttons.start.addEventListener("click", () => {
      ensureAudio();
      setScreen("select");
    });
    buttons.how.addEventListener("click", () => toggleModal(ui.howModal, true));
    buttons.settings.addEventListener("click", () => toggleModal(ui.settingsModal, true));
    buttons.backToTitle.addEventListener("click", () => setScreen("title"));
    buttons.confirm.addEventListener("click", () => {
      ensureAudio();
      startBattle();
    });
    buttons.retry.addEventListener("click", () => {
      ensureAudio();
      startBattle(state.lastBattleConfig);
    });
    buttons.selectAgain.addEventListener("click", () => setScreen("select"));
    buttons.mainMenu.addEventListener("click", () => setScreen("title"));

    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => {
        toggleModal(ui.howModal, false);
        toggleModal(ui.settingsModal, false);
      });
    });

    ui.stageSelect.addEventListener("change", () => {
      state.stageId = ui.stageSelect.value;
      if (state.screen === "select") buildPreview("select");
    });
    ui.npcSelect.addEventListener("change", () => {
      state.npcChoice = ui.npcSelect.value;
      if (state.screen === "select") buildPreview("select");
    });
    ui.difficultySelect.addEventListener("change", () => {
      state.difficulty = ui.difficultySelect.value;
    });
    ui.bgmToggle.addEventListener("change", () => {
      state.settings.bgm = ui.bgmToggle.checked;
      if (state.settings.bgm) {
        ensureAudio();
        maybeStartBgm();
      } else {
        stopBgm();
      }
    });
    ui.sfxToggle.addEventListener("change", () => {
      state.settings.sfx = ui.sfxToggle.checked;
    });
    ui.shakeToggle.addEventListener("change", () => {
      state.settings.shake = ui.shakeToggle.checked;
    });
    ui.qualitySelect.addEventListener("change", () => {
      state.settings.quality = ui.qualitySelect.value;
      applyQuality();
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
  }

  function onKeyDown(event) {
    const typingTarget = ["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(event.target.tagName);
    if (["KeyW", "KeyA", "KeyS", "KeyD", "KeyJ", "KeyK", "KeyL", "KeyU", "KeyI", "KeyO", "Space", "Enter", "Escape"].includes(event.code)) {
      event.preventDefault();
    }
    if (!typingTarget) ensureAudio();
    input.keys.add(event.code);
    if (!event.repeat) input.pressed.add(event.code);

    if (state.screen === "title" && !typingTarget && (event.code === "Enter" || event.code === "Space")) {
      setScreen("select");
      return;
    }

    if (state.screen === "select" && !typingTarget) {
      if (event.code === "ArrowRight" || event.code === "KeyD" || event.code === "ArrowDown" || event.code === "KeyS") {
        state.selectedIndex = (state.selectedIndex + 1) % CHARACTERS.length;
        updateSelectedCharacter();
        buildPreview("select");
      } else if (event.code === "ArrowLeft" || event.code === "KeyA" || event.code === "ArrowUp" || event.code === "KeyW") {
        state.selectedIndex = (state.selectedIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
        updateSelectedCharacter();
        buildPreview("select");
      } else if (event.code === "Enter" || event.code === "Space") {
        startBattle();
      } else if (event.code === "Escape") {
        setScreen("title");
      }
      return;
    }

    if (state.screen === "battle" && state.battle) {
      if (event.code === "Escape" && !event.repeat) {
        const battle = state.battle;
        if (battle.status === "fight") {
          battle.status = "paused";
          showCenterMessage("Paused", 999);
        } else if (battle.status === "paused") {
          battle.status = "fight";
          ui.centerMessage.classList.remove("is-active");
          state.messageTimer = 0;
        }
      }
      if ((event.code === "KeyA" || event.code === "KeyD") && !event.repeat && state.battle.status === "fight") {
        const now = performance.now();
        if (now - input.lastTap[event.code] < 260) {
          startDash(state.battle.player, event.code === "KeyD" ? 1 : -1);
        }
        input.lastTap[event.code] = now;
      }
    }
  }

  function onKeyUp(event) {
    input.keys.delete(event.code);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    applyQuality();
  }

  function loop() {
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (state.messageTimer > 0 && state.messageTimer < 900) {
      state.messageTimer -= dt;
      if (state.messageTimer <= 0) ui.centerMessage.classList.remove("is-active");
    }
    if (state.screen === "battle") updateBattle(dt);
    else updatePreview(dt);
    updatePetals(dt);
    renderer.render(scene, camera);
    input.pressed.clear();
  }

  async function loadHumanoidRigAsset() {
    try {
      humanoidRigAsset = await rigLoader.loadAsync(humanoidRigUrl);
    } catch (error) {
      console.warn("Humanoid GLB rig failed to load; falling back to procedural strike animation.", error);
      humanoidRigAsset = null;
    }
  }

  async function init() {
    await loadHumanoidRigAsset();
    bindEvents();
    applyQuality();
    renderCharacterSelect();
    setScreen("title");
    requestAnimationFrame(loop);
  }

  function hasVisibleRigMesh(fighter) {
    let visible = false;
    fighter.parts.glbRig?.traverse((node) => {
      if (node.isMesh && node.visible) visible = true;
    });
    return visible;
  }

  window.__easternClashDebug = {
    state,
    characters: CHARACTERS,
    startQuickBattle(stageId = "moon-temple") {
      startBattle({ playerId: "ryuhan", npcId: "ayane", stageId, difficulty: "normal" });
    },
    damageNpc(amount = 100) {
      if (!state.battle) this.startQuickBattle();
      if (state.battle.status !== "fight") state.battle.status = "fight";
      state.battle.npc.hp = clamp(state.battle.npc.hp - amount, 0, 100);
      if (state.battle.npc.hp <= 0) endRound("ko", "player");
    },
    damagePlayer(amount = 100) {
      if (!state.battle) this.startQuickBattle();
      if (state.battle.status !== "fight") state.battle.status = "fight";
      state.battle.player.hp = clamp(state.battle.player.hp - amount, 0, 100);
      if (state.battle.player.hp <= 0) endRound("ko", "npc");
    },
    setTimeLeft(seconds) {
      if (!state.battle) this.startQuickBattle();
      state.battle.timeLeft = seconds;
    },
    status() {
      return {
        screen: state.screen,
        battle: state.battle && {
          status: state.battle.status,
          round: state.battle.round,
          playerHp: state.battle.player.hp,
          npcHp: state.battle.npc.hp,
          playerWins: state.battle.playerWins,
          npcWins: state.battle.npcWins,
          timeLeft: state.battle.timeLeft,
          aiState: state.battle.npc.aiState,
          playerFacing: state.battle.player.facing,
          npcFacing: state.battle.npc.facing,
          playerArtYaw: state.battle.player.parts.sprite?.rotation.y ?? null,
          npcArtYaw: state.battle.npc.parts.sprite?.rotation.y ?? null,
          playerArtX: state.battle.player.parts.sprite?.position.x ?? null,
          npcArtX: state.battle.npc.parts.sprite?.position.x ?? null,
          playerBodyX: state.battle.player.pos.x,
          npcBodyX: state.battle.npc.pos.x,
          playerArtZRot: state.battle.player.parts.sprite?.rotation.z ?? null,
          npcArtZRot: state.battle.npc.parts.sprite?.rotation.z ?? null,
          playerAction: state.battle.player.action?.id ?? null,
          npcAction: state.battle.npc.action?.id ?? null,
          playerState: state.battle.player.state,
          npcState: state.battle.npc.state,
          playerKoDefeated: state.battle.player.koDefeated,
          npcKoDefeated: state.battle.npc.koDefeated,
          playerVisualLunge: state.battle.player.debugVisualMotion?.lunge ?? 0,
          npcVisualLunge: state.battle.npc.debugVisualMotion?.lunge ?? 0,
          playerSpriteMode: state.battle.player.debugVisualMotion?.spriteMode ?? null,
          npcSpriteMode: state.battle.npc.debugVisualMotion?.spriteMode ?? null,
          playerRigType: state.battle.player.parts.glbRig ? "glb-humanoid" : "procedural",
          npcRigType: state.battle.npc.parts.glbRig ? "glb-humanoid" : "procedural",
          playerVisualMode: state.battle.player.parts.glbRig ? "realistic-cutout-texture-puppet" : "procedural",
          npcVisualMode: state.battle.npc.parts.glbRig ? "realistic-cutout-texture-puppet" : "procedural",
          playerRigMeshVisible: hasVisibleRigMesh(state.battle.player),
          npcRigMeshVisible: hasVisibleRigMesh(state.battle.npc),
          playerSpriteOpacity: state.battle.player.parts.sprite?.material.opacity ?? null,
          npcSpriteOpacity: state.battle.npc.parts.sprite?.material.opacity ?? null,
          playerRigClip: state.battle.player.rigClipName ?? null,
          npcRigClip: state.battle.npc.rigClipName ?? null,
          playerMixerTime: state.battle.player.rigMixer?.time ?? null,
          npcMixerTime: state.battle.npc.rigMixer?.time ?? null,
          playerArmJointX: state.battle.player.parts.glbNodes?.ArmR?.rotation.x ?? state.battle.player.parts.armR?.rotation.x ?? null,
          playerLegJointX: state.battle.player.parts.glbNodes?.LegR?.rotation.x ?? state.battle.player.parts.legR?.rotation.x ?? null,
          playerFootJointZ: state.battle.player.parts.glbNodes?.FootR?.rotation.z ?? state.battle.player.parts.footR?.rotation.z ?? null,
          npcArmJointX: state.battle.npc.parts.glbNodes?.ArmR?.rotation.x ?? state.battle.npc.parts.armR?.rotation.x ?? null,
          npcLegJointX: state.battle.npc.parts.glbNodes?.LegR?.rotation.x ?? state.battle.npc.parts.legR?.rotation.x ?? null,
          npcFootJointZ: state.battle.npc.parts.glbNodes?.FootR?.rotation.z ?? state.battle.npc.parts.footR?.rotation.z ?? null,
          playerStrikeVisible: state.battle.player.parts.strike?.group.visible ?? false,
          npcStrikeVisible: state.battle.npc.parts.strike?.group.visible ?? false
        },
        stage: {
          id: state.stageId,
          backdropCount: stageRoot.userData.stageBackdropReady ? 1 : 0,
          backdropStageId: stageRoot.userData.stageBackdropId ?? null,
          objectCount: stageRoot.children.length
        },
        canvas: {
          width: renderer.domElement.width,
          height: renderer.domElement.height
        }
      };
    }
  };

  init();
})();
