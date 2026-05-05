import * as THREE from "three";

(() => {

    const canvas = document.getElementById("scene");
    const hpReadout = document.getElementById("hpReadout");
    const enemyReadout = document.getElementById("enemyReadout");
    const koReadout = document.getElementById("koReadout");
    const enemySlider = document.getElementById("enemyCount");
    const enemyTargetReadout = document.getElementById("enemyTargetReadout");
    const toast = document.getElementById("toast");
    const gameOverPanel = document.getElementById("gameOverPanel");
    const restartButton = document.getElementById("restartButton");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9fd4eb);
    scene.fog = new THREE.FogExp2(0xcdeaf4, 0.0065);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    } else {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping || THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 0.78;

    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 500);
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();

    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const planeGeo = new THREE.PlaneGeometry(1, 1);
    const tmpVec = new THREE.Vector3();
    const tmpVec2 = new THREE.Vector3();
    const tmpMat = new THREE.Matrix4();
    const tmpQuat = new THREE.Quaternion();
    const tmpScale = new THREE.Vector3();
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const worldLimit = 58;

    let seed = 8472;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const range = (a, b) => a + rand() * (b - a);
    const pick = (items) => items[Math.floor(rand() * items.length)];
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    function makeMat(color, roughness = 0.78, metalness = 0.02, transparent = false, opacity = 1, emissive = 0x000000, emissiveIntensity = 0) {
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

    const mats = {
      grass: makeMat(0x69b76d),
      grassDark: makeMat(0x347f59),
      moss: makeMat(0x91c65a),
      path: makeMat(0xd8c083),
      pathDark: makeMat(0xb99a67),
      stone: makeMat(0x9aa0a0),
      stoneDark: makeMat(0x677274),
      water: makeMat(0x2d9ccc, 0.28, 0.02, true, 0.72, 0x0d6a8b, 0.22),
      waterLight: makeMat(0x74d8e7, 0.18, 0.02, true, 0.66, 0x1ba9c8, 0.22),
      red: makeMat(0xca2f20),
      redDark: makeMat(0x7f171b),
      black: makeMat(0x20232b),
      roof: makeMat(0x2d566a),
      roofHi: makeMat(0x3a7890),
      cream: makeMat(0xffe1ae),
      white: makeMat(0xfff1dc),
      gold: makeMat(0xf4c75d, 0.52, 0.1, false, 1, 0x6b3c00, 0.12),
      wood: makeMat(0x8a4a2b),
      bark: makeMat(0x6a3e2d),
      trunkHi: makeMat(0x9b6643),
      sakura: makeMat(0xff8fbd),
      sakuraPale: makeMat(0xffc5d9),
      sakuraHot: makeMat(0xff6fa8),
      pine: makeMat(0x1f6d50),
      pineHi: makeMat(0x31966b),
      maple: makeMat(0xf05b35),
      mapleGold: makeMat(0xf4a742),
      bamboo: makeMat(0x2e9d58),
      bambooHi: makeMat(0x8ecf53),
      pot: makeMat(0xbd6546),
      potDark: makeMat(0x7a3529),
      playerBlue: makeMat(0x2d6ed0),
      playerCoat: makeMat(0x23385f),
      skin: makeMat(0xf0b78f),
      scarf: makeMat(0xf0444e),
      sword: makeMat(0xe8f6ff, 0.35, 0.2, false, 1, 0x73d6ff, 0.18),
      enemy: makeMat(0x813043),
      enemyHi: makeMat(0xe85b57),
      enemyHorn: makeMat(0xffdf93),
      dust: makeMat(0xe4c48f, 0.9, 0, true, 0.82),
      arc: makeMat(0xfff0a0, 0.42, 0.05, true, 0.82, 0xf4a742, 0.9),
      arcBlue: makeMat(0x88ecff, 0.35, 0.05, true, 0.72, 0x2ccfff, 1.1),
      ghost: makeMat(0x88ecff, 0.5, 0.02, true, 0.22, 0x2ccfff, 0.4)
    };

    const objects = [];
    const enemies = [];
    const koi = [];
    const debris = [];
    const particles = [];
    const attackEffects = [];
    const motionTrails = [];
    const decorations = new THREE.Group();
    const destructibleRoot = new THREE.Group();
    const enemyRoot = new THREE.Group();
    scene.add(decorations, destructibleRoot, enemyRoot);

    function cube(parent, x, y, z, sx, sy, sz, material, options = {}) {
      const mesh = new THREE.Mesh(boxGeo, material);
      mesh.position.set(x, y, z);
      mesh.scale.set(sx, sy, sz);
      mesh.castShadow = options.cast !== false;
      mesh.receiveShadow = options.receive !== false;
      parent.add(mesh);
      return mesh;
    }

    function coloredCube(parent, x, y, z, sx, sy, sz, color) {
      return cube(parent, x, y, z, sx, sy, sz, makeMat(color));
    }

    function addLight() {
      const hemi = new THREE.HemisphereLight(0xeaf8ff, 0x5c463f, 0.95);
      scene.add(hemi);

      const sun = new THREE.DirectionalLight(0xfff0ce, 1.55);
      sun.position.set(-24, 52, 28);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.near = 1;
      sun.shadow.camera.far = 120;
      sun.shadow.camera.left = -70;
      sun.shadow.camera.right = 70;
      sun.shadow.camera.top = 70;
      sun.shadow.camera.bottom = -70;
      scene.add(sun);

      const pondGlow = new THREE.PointLight(0x72d6ff, 0.75, 36, 2);
      pondGlow.position.set(-10, 4, 7);
      scene.add(pondGlow);

      const lanternWarmth = new THREE.PointLight(0xffa45d, 1.05, 34, 2.2);
      lanternWarmth.position.set(11, 7, -4);
      scene.add(lanternWarmth);
    }

    function buildGround() {
      cube(decorations, 0, -0.7, 0, 128, 1.4, 128, mats.grass, { cast: false });
      cube(decorations, 0, -1.55, 0, 132, 0.5, 132, mats.grassDark, { cast: false });

      for (let x = -56; x <= 56; x += 4) {
        for (let z = -56; z <= 56; z += 4) {
          if (rand() < 0.3 && Math.hypot(x + 8, z - 5) > 16) {
            cube(decorations, x + range(-0.8, 0.8), 0.02, z + range(-0.8, 0.8), range(0.45, 1.1), 0.05, range(0.45, 1.1), rand() > 0.45 ? mats.moss : mats.grassDark, { cast: false });
          }
        }
      }

      for (let z = -52; z <= 26; z += 2) {
        const wobble = Math.sin(z * 0.28) * 1.6;
        cube(decorations, wobble, 0.08, z, 4.4 + Math.sin(z) * 0.4, 0.16, 1.45, z % 4 === 0 ? mats.path : mats.pathDark, { cast: false });
      }
      for (let x = -36; x <= 35; x += 2) {
        const z = 22 + Math.sin(x * 0.28) * 1.2;
        cube(decorations, x, 0.09, z, 1.4, 0.16, 3.4, x % 4 === 0 ? mats.path : mats.pathDark, { cast: false });
      }
    }

    function buildPond() {
      const pondGroup = new THREE.Group();
      pondGroup.position.set(-13, 0.02, 8);
      decorations.add(pondGroup);

      for (let x = -13; x <= 13; x += 1.2) {
        for (let z = -8; z <= 8; z += 1.2) {
          const n = Math.sin(x * 1.7) * 0.45 + Math.cos(z * 2.1) * 0.36;
          if ((x * x) / 150 + (z * z) / 54 < 1 + n * 0.06) {
            cube(pondGroup, x, 0.02, z, 1.25, 0.12, 1.25, (x + z) % 2 > 0 ? mats.water : mats.waterLight, { cast: false });
          }
        }
      }

      for (let i = 0; i < 74; i++) {
        const a = (i / 74) * Math.PI * 2;
        const rX = 14.2 + Math.sin(i) * 0.8;
        const rZ = 8.6 + Math.cos(i * 1.7) * 0.5;
        cube(pondGroup, Math.cos(a) * rX, 0.25, Math.sin(a) * rZ, range(0.7, 1.7), range(0.35, 0.75), range(0.7, 1.7), rand() > 0.5 ? mats.stone : mats.stoneDark);
      }

      for (let i = 0; i < 9; i++) {
        const fish = new THREE.Group();
        const orange = makeMat(pick([0xff7a24, 0xffa21e, 0xf05232, 0xf8f3e1]));
        cube(fish, 0, 0, 0, 0.7, 0.25, 0.35, orange);
        cube(fish, -0.45, 0, 0, 0.25, 0.22, 0.28, orange);
        cube(fish, 0.42, 0, 0, 0.22, 0.2, 0.5, mats.white);
        cube(fish, 0.08, 0.18, 0, 0.22, 0.06, 0.38, mats.gold);
        pondGroup.add(fish);
        koi.push({
          group: fish,
          center: new THREE.Vector3(-13, 0.38, 8),
          radiusX: range(4.5, 11.5),
          radiusZ: range(2.4, 6.4),
          speed: range(0.25, 0.75),
          offset: range(0, Math.PI * 2),
          bob: range(0, Math.PI * 2)
        });
      }
    }

    function buildBridge() {
      const bridge = new THREE.Group();
      bridge.position.set(-13, 1.0, 8);
      decorations.add(bridge);

      for (let i = -5; i <= 5; i++) {
        const h = 0.35 + Math.cos(i / 5 * Math.PI) * 0.85;
        cube(bridge, i * 1.05, h, 0, 1, 0.42, 4.2, mats.red);
        cube(bridge, i * 1.05, h + 0.28, 0, 0.86, 0.24, 3.7, mats.redDark);
      }

      for (let side of [-1, 1]) {
        for (let i = -5; i <= 5; i += 2) {
          const h = 0.95 + Math.cos(i / 5 * Math.PI) * 0.85;
          cube(bridge, i * 1.05, h + 0.7, side * 2.3, 0.28, 1.5, 0.28, mats.red);
          cube(bridge, i * 1.05, h + 1.46, side * 2.3, 0.5, 0.22, 0.5, mats.gold);
        }
        cube(bridge, 0, 2.55, side * 2.3, 11.9, 0.22, 0.28, mats.redDark);
        cube(bridge, 0, 1.85, side * 2.3, 10.8, 0.18, 0.22, mats.red);
      }
    }

    function buildTorii() {
      const gate = new THREE.Group();
      gate.position.set(0, 0, -46);
      decorations.add(gate);
      cube(gate, -4, 3.4, 0, 0.8, 6.8, 0.8, mats.red);
      cube(gate, 4, 3.4, 0, 0.8, 6.8, 0.8, mats.red);
      cube(gate, 0, 7.3, 0, 10.2, 0.7, 0.9, mats.red);
      cube(gate, 0, 8.2, 0, 12.4, 0.55, 1.2, mats.black);
      cube(gate, 0, 6.3, 0, 7.4, 0.45, 0.8, mats.redDark);
      cube(gate, -4, 0.55, 0, 1.8, 1.1, 1.8, mats.stoneDark);
      cube(gate, 4, 0.55, 0, 1.8, 1.1, 1.8, mats.stoneDark);
      cube(gate, 0, 5.5, -0.52, 1.6, 1.25, 0.12, mats.gold);
    }

    function buildPagoda() {
      const pagoda = new THREE.Group();
      pagoda.position.set(8, 0.1, 33);
      decorations.add(pagoda);

      cube(pagoda, 0, 0.35, 0, 13, 0.7, 13, mats.stoneDark);
      cube(pagoda, 0, 0.9, 0, 11.5, 0.42, 11.5, mats.stone);

      for (let level = 0; level < 5; level++) {
        const y = 1.35 + level * 3.85;
        const size = 9.6 - level * 1.18;
        const roof = size + 2.8;
        const wallH = 2.2;

        cube(pagoda, 0, y + wallH * 0.5, 0, size, wallH, size, level % 2 ? mats.white : mats.cream);
        for (let sx of [-1, 1]) {
          for (let sz of [-1, 1]) {
            cube(pagoda, sx * (size / 2 - 0.4), y + wallH * 0.55, sz * (size / 2 - 0.4), 0.55, wallH + 0.6, 0.55, mats.red);
          }
        }
        for (let side of [-1, 1]) {
          cube(pagoda, 0, y + 1.1, side * (size / 2 + 0.04), size * 0.45, 0.9, 0.12, mats.black);
          cube(pagoda, side * (size / 2 + 0.04), y + 1.1, 0, 0.12, 0.9, size * 0.45, mats.black);
        }

        for (let step = 0; step < 3; step++) {
          const stepSize = roof - step * 1.0;
          cube(pagoda, 0, y + wallH + 0.12 + step * 0.34, 0, stepSize, 0.36, stepSize, step === 0 ? mats.roofHi : mats.roof);
        }
        for (let side of [-1, 1]) {
          cube(pagoda, 0, y + wallH + 0.08, side * (roof / 2 + 0.38), roof + 0.55, 0.26, 0.46, mats.roof);
          cube(pagoda, side * (roof / 2 + 0.38), y + wallH + 0.08, 0, 0.46, 0.26, roof + 0.55, mats.roof);
        }
        cube(pagoda, 0, y + wallH + 0.64, 0, 1.2, 0.2, 1.2, mats.gold);
      }

      cube(pagoda, 0, 22.6, 0, 0.6, 4.4, 0.6, mats.gold);
      cube(pagoda, 0, 25.1, 0, 1.4, 0.35, 1.4, mats.gold);
      cube(pagoda, 0, 25.8, 0, 0.7, 0.9, 0.7, mats.gold);
    }

    function makeStoneLantern(x, z, rot = 0) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = rot;
      decorations.add(g);
      cube(g, 0, 0.25, 0, 1.2, 0.5, 1.2, mats.stoneDark);
      cube(g, 0, 1.0, 0, 0.55, 1.0, 0.55, mats.stone);
      cube(g, 0, 1.65, 0, 1.25, 0.28, 1.25, mats.stoneDark);
      cube(g, 0, 2.05, 0, 0.95, 0.62, 0.95, mats.cream);
      cube(g, 0, 2.44, 0, 1.45, 0.35, 1.45, mats.stoneDark);
      cube(g, 0, 2.82, 0, 0.75, 0.42, 0.75, mats.stone);
      const light = new THREE.PointLight(0xffa45d, 0.65, 8, 2);
      light.position.set(x, 2.1, z);
      scene.add(light);
    }

    function registerDestructible(group, type, hp, radius, colors) {
      const item = {
        group,
        type,
        hp,
        maxHp: hp,
        radius,
        colors,
        velocity: new THREE.Vector3(),
        shake: 0,
        alive: true,
        collapseTimer: 0
      };
      objects.push(item);
      destructibleRoot.add(group);
      return item;
    }

    function createCherryTree(x, z, size = 1) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const trunkH = 4.2 * size;
      cube(g, 0, trunkH * 0.5, 0, 0.75 * size, trunkH, 0.75 * size, mats.bark);
      cube(g, 0.6 * size, trunkH * 0.78, 0.22 * size, 0.48 * size, 1.7 * size, 0.45 * size, mats.trunkHi);
      cube(g, -0.55 * size, trunkH * 0.72, -0.16 * size, 0.42 * size, 1.4 * size, 0.42 * size, mats.bark);

      const colors = [mats.sakura, mats.sakuraPale, mats.sakuraHot, mats.white];
      for (let i = 0; i < 72; i++) {
        const r = Math.pow(rand(), 0.45) * 3.2 * size;
        const a = rand() * Math.PI * 2;
        const y = trunkH + range(-0.7, 1.8) * size + Math.sin(a * 3) * 0.18;
        cube(g, Math.cos(a) * r * 0.9, y, Math.sin(a) * r * 0.9, range(0.45, 0.95) * size, range(0.38, 0.8) * size, range(0.45, 0.95) * size, pick(colors));
      }
      return registerDestructible(g, "Cherry tree", 6, 3.8 * size, [0xff8fbd, 0xffc5d9, 0x6a3e2d]);
    }

    function createPineTree(x, z, size = 1) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      cube(g, 0, 2.25 * size, 0, 0.8 * size, 4.5 * size, 0.8 * size, mats.bark);
      for (let i = 0; i < 5; i++) {
        const y = (3.2 + i * 1.1) * size;
        const s = (4.8 - i * 0.68) * size;
        cube(g, 0, y, 0, s, 0.75 * size, s, i % 2 ? mats.pineHi : mats.pine);
        cube(g, 0, y + 0.38 * size, 0, s * 0.68, 0.55 * size, s * 0.68, mats.pine);
      }
      cube(g, 0, 8.7 * size, 0, 1.3 * size, 1.1 * size, 1.3 * size, mats.pineHi);
      return registerDestructible(g, "Pine tree", 8, 3.5 * size, [0x1f6d50, 0x31966b, 0x6a3e2d]);
    }

    function createMapleTree(x, z, size = 1) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      cube(g, 0, 2.15 * size, 0, 0.82 * size, 4.3 * size, 0.82 * size, mats.bark);
      const colors = [mats.maple, mats.mapleGold, mats.red, mats.gold];
      for (let i = 0; i < 62; i++) {
        const a = rand() * Math.PI * 2;
        const r = Math.pow(rand(), 0.55) * 3.1 * size;
        const y = (4.3 + range(-0.7, 1.9)) * size;
        cube(g, Math.cos(a) * r, y, Math.sin(a) * r, range(0.48, 1.0) * size, range(0.42, 0.9) * size, range(0.48, 1.0) * size, pick(colors));
      }
      return registerDestructible(g, "Maple tree", 6, 3.6 * size, [0xf05b35, 0xf4a742, 0x6a3e2d]);
    }

    function createBamboo(x, z, size = 1) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      const h = range(5.8, 8.8) * size;
      const segments = Math.floor(h / (0.82 * size));
      for (let i = 0; i < segments; i++) {
        cube(g, 0, (i + 0.55) * 0.82 * size, 0, 0.42 * size, 0.66 * size, 0.42 * size, i % 2 ? mats.bambooHi : mats.bamboo);
        cube(g, 0, (i + 0.95) * 0.82 * size, 0, 0.52 * size, 0.12 * size, 0.52 * size, mats.bambooHi);
      }
      for (let i = 0; i < 5; i++) {
        const a = rand() * Math.PI * 2;
        const y = range(h * 0.55, h * 0.95);
        cube(g, Math.cos(a) * 0.65 * size, y, Math.sin(a) * 0.65 * size, 1.2 * size, 0.12 * size, 0.35 * size, mats.bambooHi).rotation.y = a;
      }
      return registerDestructible(g, "Bamboo", 3, 1.1 * size, [0x2e9d58, 0x8ecf53]);
    }

    function createPot(x, z) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      cube(g, 0, 0.35, 0, 1.2, 0.7, 1.2, mats.potDark);
      cube(g, 0, 0.85, 0, 1.5, 0.35, 1.5, mats.pot);
      cube(g, 0, 1.25, 0, 0.72, 0.45, 0.72, mats.moss);
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        cube(g, Math.cos(a) * 0.38, 1.55, Math.sin(a) * 0.38, 0.22, 0.7, 0.22, mats.sakuraHot);
      }
      return registerDestructible(g, "Garden pot", 2, 1.1, [0xbd6546, 0x7a3529, 0xff8fbd]);
    }

    function createWoodPost(x, z, h = 2.8) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      cube(g, 0, h / 2, 0, 0.55, h, 0.55, mats.wood);
      cube(g, 0, h + 0.22, 0, 0.8, 0.35, 0.8, mats.redDark);
      return registerDestructible(g, "Wooden post", 3, 0.85, [0x8a4a2b, 0x7f171b]);
    }

    function populateGarden() {
      [
        [-18, -22, 1.1], [15, -23, 1.0], [24, -8, 1.18], [-31, -4, 1.0],
        [-26, 28, 1.2], [24, 25, 1.05], [40, 9, 1.0]
      ].forEach(([x, z, s]) => createCherryTree(x, z, s));
      [[-43, 18, 1.05], [36, -28, 1.0], [43, 31, 1.08], [-38, -33, 0.95]].forEach(([x, z, s]) => createPineTree(x, z, s));
      [[-7, 39, 1], [31, 39, 1.08], [-40, 7, 0.95], [14, -38, 1.02]].forEach(([x, z, s]) => createMapleTree(x, z, s));

      for (let i = 0; i < 46; i++) {
        const x = range(35, 53);
        const z = range(-50, 16);
        createBamboo(x, z, range(0.72, 1.18));
      }

      for (let i = 0; i < 12; i++) {
        const side = i % 2 ? 1 : -1;
        createPot(side * range(4.8, 8.4), -35 + i * 5.2 + range(-0.8, 0.8));
      }

      for (let i = -4; i <= 4; i++) {
        createWoodPost(-20 + i * 2.2, 20 + Math.sin(i) * 0.5, 2.4);
      }

      for (let z of [-34, -22, -10, 4]) {
        makeStoneLantern(-5.5, z, 0.2);
        makeStoneLantern(5.5, z, -0.2);
      }
      makeStoneLantern(18, 24, 0.6);
      makeStoneLantern(-2, 30, -0.4);
    }

    function createPetals() {
      const petalGeo = new THREE.BoxGeometry(0.18, 0.08, 0.28);
      const petalMat = makeMat(0xff9fc6, 0.7, 0, true, 0.78, 0xff6fa8, 0.08);
      const mesh = new THREE.InstancedMesh(petalGeo, petalMat, 240);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.castShadow = false;
      scene.add(mesh);
      const petals = [];
      for (let i = 0; i < 240; i++) {
        petals.push({
          x: range(-58, 58),
          y: range(7, 34),
          z: range(-58, 58),
          fall: range(0.9, 2.6),
          sway: range(0.4, 1.4),
          spin: range(0, Math.PI * 2)
        });
      }
      return { mesh, petals };
    }

    const petalSystem = createPetals();

    function createPlayer() {
      const group = new THREE.Group();
      const parts = {};
      parts.body = cube(group, 0, 1.9, 0, 0.85, 1.5, 0.55, mats.playerBlue);
      parts.chest = cube(group, 0, 2.2, -0.08, 1.0, 0.68, 0.42, mats.playerCoat);
      parts.head = cube(group, 0, 3.0, 0, 0.74, 0.74, 0.74, mats.skin);
      parts.hair = cube(group, 0, 3.42, -0.03, 0.8, 0.22, 0.82, mats.black);
      parts.scarf = cube(group, -0.42, 2.53, -0.02, 0.55, 0.18, 0.72, mats.scarf);
      parts.armL = cube(group, -0.72, 2.0, 0, 0.28, 1.25, 0.32, mats.playerCoat);
      parts.armR = cube(group, 0.72, 2.0, 0, 0.28, 1.25, 0.32, mats.playerCoat);
      parts.legL = cube(group, -0.28, 0.85, 0, 0.32, 1.45, 0.34, mats.playerCoat);
      parts.legR = cube(group, 0.28, 0.85, 0, 0.32, 1.45, 0.34, mats.playerCoat);
      parts.footL = cube(group, -0.28, 0.16, -0.14, 0.42, 0.24, 0.72, mats.black);
      parts.footR = cube(group, 0.28, 0.16, -0.14, 0.42, 0.24, 0.72, mats.black);
      parts.sword = cube(group, 0.98, 1.65, -0.34, 0.18, 1.8, 0.24, mats.sword);
      parts.sword.rotation.x = -0.55;
      scene.add(group);
      return {
        group,
        parts,
        pos: new THREE.Vector3(0, 0, -2),
        vel: new THREE.Vector3(),
        vertical: 0,
        facing: 0,
        onGround: true,
        hp: 100,
        invuln: 0,
        roll: 0,
        rollCd: 0,
        attackCd: 0,
        spinCd: 0,
        attackTimer: 0,
        spinTimer: 0,
        step: 0,
        lastGrounded: true,
        dead: false
      };
    }

    const player = createPlayer();

    const keys = new Set();
    const pressed = new Set();
    const pointer = { down: false };
    let targetEnemyCount = Number(enemySlider.value);
    let spawnQueue = targetEnemyCount;
    let koCount = 0;
    let cameraShake = 0;
    let hitStop = 0;
    let toastTimer = 0;

    function showToast(text) {
      toast.textContent = text;
      toast.classList.add("show");
      toastTimer = 1.3;
    }

    function addInput() {
      window.addEventListener("keydown", (e) => {
        const code = e.code;
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)) {
          e.preventDefault();
        }
        if (player.dead) {
          if (code === "KeyR") restartGame();
          return;
        }
        keys.add(code);
        pressed.add(code);
      });
      window.addEventListener("keyup", (e) => {
        keys.delete(e.code);
      });
      window.addEventListener("blur", () => {
        keys.clear();
        pressed.clear();
      });
      window.addEventListener("contextmenu", (e) => e.preventDefault());
      canvas.addEventListener("mousedown", (e) => {
        if (player.dead) return;
        pointer.down = true;
        if (e.button === 0) {
          normalAttack();
        } else if (e.button === 2) {
          e.preventDefault();
          spinAttack();
        }
      });
      window.addEventListener("mouseup", () => {
        pointer.down = false;
      });
      enemySlider.addEventListener("input", () => {
        targetEnemyCount = Number(enemySlider.value);
        enemyTargetReadout.textContent = String(targetEnemyCount);
        trimEnemiesToTarget();
        spawnQueue = Math.max(spawnQueue, Math.max(0, targetEnemyCount - enemies.length));
      });
      restartButton.addEventListener("click", restartGame);
    }

    function restartGame() {
      window.location.reload();
    }

    function trimEnemiesToTarget() {
      while (enemies.length > targetEnemyCount) {
        const enemy = enemies.pop();
        enemyRoot.remove(enemy.group);
      }
    }

    function buildEnemy() {
      const g = new THREE.Group();
      const body = cube(g, 0, 1.05, 0, 0.9, 1.25, 0.65, mats.enemy);
      const head = cube(g, 0, 2.0, 0, 0.72, 0.72, 0.72, mats.enemyHi);
      const hornL = cube(g, -0.28, 2.45, 0, 0.22, 0.42, 0.22, mats.enemyHorn);
      const hornR = cube(g, 0.28, 2.45, 0, 0.22, 0.42, 0.22, mats.enemyHorn);
      const armL = cube(g, -0.7, 1.05, 0, 0.25, 0.95, 0.28, mats.enemyHi);
      const armR = cube(g, 0.7, 1.05, 0, 0.25, 0.95, 0.28, mats.enemyHi);
      const legL = cube(g, -0.26, 0.32, 0, 0.28, 0.65, 0.3, mats.enemy);
      const legR = cube(g, 0.26, 0.32, 0, 0.28, 0.65, 0.3, mats.enemy);
      enemyRoot.add(g);
      return {
        group: g,
        parts: { body, head, hornL, hornR, armL, armR, legL, legR },
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        vertical: 0,
        hp: 4,
        radius: 0.85,
        attackCd: range(0.2, 1.1),
        stun: 0,
        ko: false,
        koTimer: 0,
        spin: new THREE.Vector3(),
        phase: rand() * 100
      };
    }

    function spawnEnemy() {
      const enemy = buildEnemy();
      const side = Math.floor(rand() * 4);
      let x = 0;
      let z = 0;
      if (side === 0) { x = range(-48, 48); z = -54; }
      if (side === 1) { x = 54; z = range(-46, 46); }
      if (side === 2) { x = range(-48, 48); z = 54; }
      if (side === 3) { x = -54; z = range(-46, 46); }
      enemy.pos.set(x, 0, z);
      enemy.group.position.copy(enemy.pos);
      enemies.push(enemy);
    }

    function maintainSpawns(dt) {
      const missing = Math.max(0, targetEnemyCount - enemies.length - spawnQueue);
      if (missing > 0) {
        spawnQueue += missing;
      }
      const batch = Math.min(spawnQueue, 6 + Math.floor(dt * 120));
      for (let i = 0; i < batch; i++) {
        if (enemies.length >= targetEnemyCount) {
          spawnQueue = 0;
          break;
        }
        spawnEnemy();
        spawnQueue--;
      }
    }

    function inputVector() {
      let forwardInput = 0;
      let sideInput = 0;
      if (keys.has("KeyW") || keys.has("ArrowUp")) forwardInput += 1;
      if (keys.has("KeyS") || keys.has("ArrowDown")) forwardInput -= 1;
      if (keys.has("KeyA") || keys.has("ArrowLeft")) sideInput -= 1;
      if (keys.has("KeyD") || keys.has("ArrowRight")) sideInput += 1;
      if (forwardInput === 0 && sideInput === 0) return new THREE.Vector3();

      const forward = tmpVec.copy(player.pos).sub(camera.position);
      forward.y = 0;
      if (forward.lengthSq() < 0.0001) forward.set(-24, 0, 30);
      forward.normalize();

      const right = tmpVec2.set(-forward.z, 0, forward.x).normalize();
      return new THREE.Vector3()
        .addScaledVector(forward, forwardInput)
        .addScaledVector(right, sideInput)
        .normalize();
    }

    function visualFacing() {
      return player.facing + Math.PI;
    }

    function normalAttack() {
      if (player.dead) return;
      if (player.attackCd > 0 || player.spinTimer > 0 || player.roll > 0) return;
      player.attackTimer = 0.22;
      player.attackCd = 0.25;
      createAttackArc(false);
      cameraShake = Math.max(cameraShake, 0.14);
      const hit = performHit(false);
      if (hit) {
        hitStop = 0.055;
      }
    }

    function spinAttack() {
      if (player.dead) return;
      if (player.spinCd > 0 || player.roll > 0) return;
      player.spinTimer = 0.42;
      player.spinCd = 0.72;
      createAttackArc(true);
      cameraShake = Math.max(cameraShake, 0.26);
      const hit = performHit(true);
      if (hit) {
        hitStop = 0.075;
      }
    }

    function startRoll() {
      if (player.dead) return;
      if (player.rollCd > 0 || player.roll > 0 || player.spinTimer > 0) return;
      const dir = inputVector();
      if (dir.lengthSq() === 0) {
        dir.set(Math.sin(player.facing), 0, Math.cos(player.facing));
      }
      player.roll = 0.34;
      player.rollCd = 0.62;
      player.invuln = 0.42;
      player.vel.x = dir.x * 23;
      player.vel.z = dir.z * 23;
      player.facing = Math.atan2(dir.x, dir.z);
      cameraShake = Math.max(cameraShake, 0.12);
      spawnDust(player.pos, 16, 0xd6a56c, 1.1);
      spawnTrail();
    }

    function performHit(spin) {
      const forward = new THREE.Vector3(Math.sin(player.facing), 0, Math.cos(player.facing));
      const origin = player.pos.clone();
      const rangeRadius = spin ? 4.75 : 3.45;
      const damage = spin ? 2 : 1.5;
      let hitAny = false;

      for (const enemy of enemies) {
        if (enemy.ko) continue;
        const delta = tmpVec.copy(enemy.pos).sub(origin);
        const dist = delta.length();
        if (dist > rangeRadius + enemy.radius) continue;
        if (!spin && dist > 0.001 && delta.clone().normalize().dot(forward) < 0.28) continue;
        hitEnemy(enemy, damage, delta.lengthSq() > 0 ? delta.normalize() : forward, spin);
        hitAny = true;
      }

      for (const obj of objects) {
        if (!obj.alive) continue;
        obj.group.getWorldPosition(tmpVec2);
        const delta = tmpVec.copy(tmpVec2).sub(origin);
        const dist = delta.length();
        if (dist > rangeRadius + obj.radius) continue;
        if (!spin && dist > 0.001 && delta.clone().normalize().dot(forward) < 0.18) continue;
        hitDestructible(obj, damage, delta.lengthSq() > 0 ? delta.normalize() : forward, spin);
        hitAny = true;
      }
      return hitAny;
    }

    function hitEnemy(enemy, damage, dir, spin) {
      enemy.hp -= damage;
      enemy.stun = spin ? 0.45 : 0.25;
      enemy.vel.addScaledVector(dir, spin ? 10.5 : 7.4);
      enemy.vertical += spin ? 8.4 : 4.2;
      enemy.spin.set(range(-2, 2), range(-4, 4), range(-2, 2));
      spawnDebrisBurst(enemy.pos.clone().add(new THREE.Vector3(0, 1.5, 0)), [0x813043, 0xe85b57, 0xffdf93], spin ? 12 : 6, 0.55);
      spawnDust(enemy.pos, spin ? 9 : 5, 0xffd39a, 0.8);
      if (enemy.hp <= 0 && !enemy.ko) {
        enemy.ko = true;
        enemy.koTimer = 1.1;
        koCount++;
        spawnDebrisBurst(enemy.pos.clone().add(new THREE.Vector3(0, 1.2, 0)), [0x813043, 0xe85b57, 0xffdf93], 16, 0.9);
      }
    }

    function hitDestructible(obj, damage, dir, spin) {
      obj.hp -= damage;
      obj.shake = 0.34;
      obj.velocity.addScaledVector(dir, spin ? 3.4 : 2.0);
      spawnDust(obj.group.position, spin ? 10 : 5, 0xe3bc8b, 0.8);
      spawnDebrisBurst(obj.group.position.clone().add(new THREE.Vector3(0, 1.7, 0)), obj.colors, spin ? 10 : 5, 0.65);
      if (obj.hp <= 0) {
        collapseDestructible(obj, dir);
      }
    }

    function collapseDestructible(obj, dir) {
      if (!obj.alive) return;
      obj.alive = false;
      obj.group.traverse((child) => {
        if (!child.isMesh || rand() > 0.52) return;
        child.getWorldPosition(tmpVec);
        const color = child.material.color.getHex();
        spawnDebris(color, tmpVec.clone(), child.scale.clone().multiplyScalar(range(0.45, 0.9)), dir, range(0.75, 1.5));
      });
      spawnDebrisBurst(obj.group.position.clone().add(new THREE.Vector3(0, 2.2, 0)), obj.colors, 24, 1.3);
      destructibleRoot.remove(obj.group);
      cameraShake = Math.max(cameraShake, 0.22);
    }

    function spawnDebrisBurst(position, colors, count, power) {
      for (let i = 0; i < count; i++) {
        const dir = new THREE.Vector3(range(-1, 1), range(0.35, 1.4), range(-1, 1)).normalize();
        spawnDebris(pick(colors), position.clone().add(new THREE.Vector3(range(-0.5, 0.5), range(-0.3, 0.7), range(-0.5, 0.5))), new THREE.Vector3(range(0.18, 0.55), range(0.14, 0.48), range(0.18, 0.55)), dir, power);
      }
    }

    function spawnDebris(color, position, scale, dir, power) {
      const mat = makeMat(color, 0.84, 0.01, true, 1);
      const mesh = new THREE.Mesh(boxGeo, mat);
      mesh.position.copy(position);
      mesh.scale.copy(scale);
      mesh.castShadow = true;
      scene.add(mesh);
      const velocity = dir.clone().multiplyScalar(range(4, 8) * power);
      velocity.y += range(3.5, 8.5) * power;
      debris.push({
        mesh,
        velocity,
        rot: new THREE.Vector3(range(-6, 6), range(-6, 6), range(-6, 6)),
        life: range(1.4, 2.8),
        maxLife: 2.8
      });
    }

    function spawnDust(position, count, color, power = 1) {
      for (let i = 0; i < count; i++) {
        const mat = makeMat(color, 0.95, 0, true, 0.75);
        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.position.set(position.x + range(-0.7, 0.7), 0.12, position.z + range(-0.7, 0.7));
        mesh.scale.set(range(0.12, 0.32), range(0.08, 0.18), range(0.12, 0.32));
        scene.add(mesh);
        particles.push({
          mesh,
          velocity: new THREE.Vector3(range(-2, 2), range(1.1, 3.2), range(-2, 2)).multiplyScalar(power),
          life: range(0.35, 0.7),
          maxLife: 0.7
        });
      }
    }

    function createAttackArc(spin) {
      const g = new THREE.Group();
      const count = spin ? 42 : 18;
      const radius = spin ? 3.6 : 2.4;
      const start = spin ? 0 : -0.95;
      const end = spin ? Math.PI * 2 : 0.95;
      for (let i = 0; i < count; i++) {
        const t = i / Math.max(1, count - 1);
        const a = start + (end - start) * t;
        const m = spin ? (i % 2 ? mats.arcBlue : mats.arc) : (i % 2 ? mats.arc : mats.arcBlue);
        const block = cube(g, Math.sin(a) * radius, 1.45 + Math.sin(t * Math.PI) * 0.6, Math.cos(a) * radius, spin ? 0.28 : 0.24, 0.22, spin ? 0.72 : 0.62, m, { cast: false });
        block.rotation.y = a;
      }
      g.position.copy(player.pos);
      g.rotation.y = player.facing;
      scene.add(g);
      attackEffects.push({ group: g, life: spin ? 0.36 : 0.22, maxLife: spin ? 0.36 : 0.22, spin });
    }

    function spawnTrail() {
      for (let i = 0; i < 4; i++) {
        const g = new THREE.Group();
        cube(g, 0, 1.8, 0, 0.85, 1.5, 0.55, mats.ghost, { cast: false });
        cube(g, 0, 2.95, 0, 0.74, 0.74, 0.74, mats.ghost, { cast: false });
        g.position.copy(player.pos).add(new THREE.Vector3(-Math.sin(player.facing) * i * 0.38, 0, -Math.cos(player.facing) * i * 0.38));
        g.rotation.y = visualFacing();
        scene.add(g);
        motionTrails.push({ group: g, life: 0.22 + i * 0.05, maxLife: 0.38 });
      }
    }

    function updatePlayer(dt) {
      if (player.dead) {
        player.vel.multiplyScalar(Math.pow(0.04, dt));
        player.group.position.copy(player.pos);
        return;
      }

      const move = inputVector();
      const running = keys.has("ShiftLeft") || keys.has("ShiftRight");
      const speed = running ? 13.5 : 8.2;
      const accel = running ? 32 : 24;
      const decel = 18;

      if (pressed.has("Space") && player.onGround) {
        player.vertical = 10.5;
        player.onGround = false;
        spawnDust(player.pos, 14, 0xe2c083, 1.05);
      }
      if (pressed.has("KeyE")) {
        startRoll();
      }
      if (pressed.has("KeyJ") || pressed.has("Enter")) {
        normalAttack();
      }
      if (pressed.has("KeyK")) {
        spinAttack();
      }

      if (player.roll <= 0) {
        if (move.lengthSq() > 0) {
          player.vel.x += (move.x * speed - player.vel.x) * Math.min(1, accel * dt);
          player.vel.z += (move.z * speed - player.vel.z) * Math.min(1, accel * dt);
          player.facing = Math.atan2(move.x, move.z);
        } else {
          player.vel.x += (0 - player.vel.x) * Math.min(1, decel * dt);
          player.vel.z += (0 - player.vel.z) * Math.min(1, decel * dt);
        }
      } else {
        player.roll -= dt;
        if (Math.floor(player.roll * 45) % 4 === 0) {
          spawnTrail();
        }
      }

      player.vertical -= 25 * dt;
      player.pos.x += player.vel.x * dt;
      player.pos.z += player.vel.z * dt;
      player.pos.y += player.vertical * dt;
      player.pos.x = clamp(player.pos.x, -worldLimit, worldLimit);
      player.pos.z = clamp(player.pos.z, -worldLimit, worldLimit);
      if (player.pos.y <= 0) {
        if (!player.onGround && player.vertical < -4) {
          spawnDust(player.pos, 18, 0xe0be81, 1.2);
          cameraShake = Math.max(cameraShake, 0.12);
        }
        player.pos.y = 0;
        player.vertical = 0;
        player.onGround = true;
      }

      player.invuln = Math.max(0, player.invuln - dt);
      player.rollCd = Math.max(0, player.rollCd - dt);
      player.attackCd = Math.max(0, player.attackCd - dt);
      player.spinCd = Math.max(0, player.spinCd - dt);
      player.attackTimer = Math.max(0, player.attackTimer - dt);
      player.spinTimer = Math.max(0, player.spinTimer - dt);

      player.group.position.copy(player.pos);
      player.group.rotation.y = visualFacing();
      animatePlayer(dt, move.lengthSq() > 0, running);
    }

    function animatePlayer(dt, moving, running) {
      const p = player.parts;
      const horizontalSpeed = Math.hypot(player.vel.x, player.vel.z);
      player.step += dt * (moving ? (running ? 13.5 : 9.2) : 3.2) * clamp(horizontalSpeed / 8, 0.2, 1.4);
      const swing = Math.sin(player.step);
      const counter = Math.sin(player.step + Math.PI);
      const bob = moving ? Math.abs(Math.sin(player.step * 1.0)) * 0.28 : Math.sin(clock.elapsedTime * 2.1) * 0.04;
      const liftL = Math.max(0, swing) * 0.48;
      const liftR = Math.max(0, counter) * 0.48;

      p.body.position.y = 1.9 + bob;
      p.chest.position.y = 2.2 + bob;
      p.head.position.y = 3.0 + bob * 0.55;
      p.hair.position.y = 3.42 + bob * 0.55;
      p.scarf.position.y = 2.53 + bob;
      p.scarf.rotation.y = Math.sin(clock.elapsedTime * 6) * 0.18;

      p.legL.position.z = -swing * 0.42;
      p.legR.position.z = -counter * 0.42;
      p.legL.position.y = 0.85 + liftL;
      p.legR.position.y = 0.85 + liftR;
      p.footL.position.z = -0.14 - swing * 0.54;
      p.footR.position.z = -0.14 - counter * 0.54;
      p.footL.position.y = 0.16 + liftL * 0.7;
      p.footR.position.y = 0.16 + liftR * 0.7;
      p.legL.rotation.x = swing * 0.72;
      p.legR.rotation.x = counter * 0.72;
      p.footL.rotation.x = -Math.max(0, swing) * 0.5;
      p.footR.rotation.x = -Math.max(0, counter) * 0.5;

      p.armL.rotation.x = counter * 0.55;
      p.armR.rotation.x = swing * 0.55;
      p.armL.position.z = counter * 0.18;
      p.armR.position.z = swing * 0.18;

      p.sword.visible = true;
      p.sword.rotation.set(-0.55, 0, 0.2);
      p.sword.position.set(0.98, 1.65, -0.34);
      if (player.attackTimer > 0) {
        const t = 1 - player.attackTimer / 0.22;
        p.armR.rotation.x = -1.2 + t * 2.4;
        p.sword.rotation.set(-1.2 + t * 2.8, 0, -0.9 + t * 1.6);
        p.sword.position.set(0.9, 1.9, -0.65 + Math.sin(t * Math.PI) * 0.8);
      }
      if (player.spinTimer > 0) {
        const t = 1 - player.spinTimer / 0.42;
        player.group.rotation.y = visualFacing() + t * Math.PI * 4;
        p.body.position.y += Math.sin(t * Math.PI) * 0.35;
        p.sword.rotation.set(-0.15, 0, Math.PI / 2);
        p.sword.position.set(1.35, 2.0, 0);
      }
      if (player.roll > 0) {
        const t = player.roll / 0.34;
        p.body.rotation.x = Math.sin(t * Math.PI * 2) * 0.95;
        p.head.rotation.x = p.body.rotation.x;
      } else {
        p.body.rotation.x *= 0.85;
        p.head.rotation.x *= 0.85;
      }
    }

    function updateEnemies(dt) {
      const playerPos = player.pos;
      for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (enemy.ko) {
          enemy.koTimer -= dt;
          enemy.vertical -= 22 * dt;
          enemy.pos.addScaledVector(enemy.vel, dt);
          enemy.pos.y += enemy.vertical * dt;
          if (enemy.pos.y <= 0) {
            enemy.pos.y = 0;
            enemy.vertical *= -0.18;
          }
          enemy.group.position.copy(enemy.pos);
          enemy.group.rotation.x += (1.45 - enemy.group.rotation.x) * Math.min(1, dt * 5);
          enemy.group.rotation.z += enemy.spin.z * dt;
          enemy.vel.multiplyScalar(Math.pow(0.1, dt));
          if (enemy.koTimer <= 0) {
            enemyRoot.remove(enemy.group);
            enemies.splice(i, 1);
          }
          continue;
        }

        enemy.attackCd -= dt;
        enemy.stun = Math.max(0, enemy.stun - dt);
        const toPlayer = tmpVec.copy(playerPos).sub(enemy.pos);
        toPlayer.y = 0;
        const dist = Math.max(0.001, toPlayer.length());
        const desired = new THREE.Vector3();

        if (enemy.stun <= 0) {
          const ring = 3.2 + (i % 7) * 0.55;
          const orbitAngle = i * goldenAngle + clock.elapsedTime * 0.22;
          const target = tmpVec2.set(
            playerPos.x + Math.cos(orbitAngle) * ring,
            0,
            playerPos.z + Math.sin(orbitAngle) * ring
          );
          desired.copy(target).sub(enemy.pos);
          desired.y = 0;
          if (dist > 9) {
            desired.copy(toPlayer);
          }
          if (desired.lengthSq() > 0) desired.normalize();

          const sep = new THREE.Vector3();
          for (let j = 0; j < enemies.length; j++) {
            if (i === j || enemies[j].ko) continue;
            const other = enemies[j];
            const d = tmpVec2.copy(enemy.pos).sub(other.pos);
            d.y = 0;
            const l2 = d.lengthSq();
            if (l2 > 0.001 && l2 < 4.2) {
              sep.addScaledVector(d.normalize(), (4.2 - l2) * 0.11);
            }
          }
          desired.add(sep).normalize();
          const targetSpeed = dist > 1.8 ? range(3.3, 5.1) : 0.8;
          enemy.vel.x += (desired.x * targetSpeed - enemy.vel.x) * Math.min(1, 9 * dt);
          enemy.vel.z += (desired.z * targetSpeed - enemy.vel.z) * Math.min(1, 9 * dt);
        }

        if (dist < 1.8 && enemy.attackCd <= 0 && player.invuln <= 0) {
          enemy.attackCd = range(1.0, 1.8);
          player.hp = clamp(player.hp - 3, 0, 100);
          if (player.hp <= 0) {
            defeatPlayer();
          } else {
            player.invuln = 0.34;
            const away = tmpVec2.copy(playerPos).sub(enemy.pos).normalize();
            player.vel.addScaledVector(away, 5.5);
          }
          cameraShake = Math.max(cameraShake, 0.18);
          hitStop = 0.045;
          spawnDust(player.pos, 9, 0xffd39a, 0.8);
        }

        enemy.vertical -= 24 * dt;
        enemy.pos.x += enemy.vel.x * dt;
        enemy.pos.z += enemy.vel.z * dt;
        enemy.pos.y += enemy.vertical * dt;
        enemy.pos.x = clamp(enemy.pos.x, -worldLimit, worldLimit);
        enemy.pos.z = clamp(enemy.pos.z, -worldLimit, worldLimit);
        if (enemy.pos.y <= 0) {
          enemy.pos.y = 0;
          enemy.vertical = Math.max(0, enemy.vertical * -0.18);
        }
        enemy.vel.multiplyScalar(Math.pow(enemy.stun > 0 ? 0.18 : 0.5, dt));
        if (dist > 0.01) {
          enemy.group.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
        }
        enemy.group.rotation.x += enemy.spin.x * dt;
        enemy.group.rotation.z += enemy.spin.z * dt;
        enemy.group.rotation.x *= Math.pow(0.08, dt);
        enemy.group.rotation.z *= Math.pow(0.08, dt);
        enemy.spin.multiplyScalar(Math.pow(0.15, dt));
        animateEnemy(enemy, dt);
        enemy.group.position.copy(enemy.pos);
      }
    }

    function animateEnemy(enemy, dt) {
      const speed = Math.hypot(enemy.vel.x, enemy.vel.z);
      const t = clock.elapsedTime * (7 + speed) + enemy.phase;
      const s = Math.sin(t);
      enemy.parts.legL.rotation.x = s * 0.45;
      enemy.parts.legR.rotation.x = -s * 0.45;
      enemy.parts.armL.rotation.x = -s * 0.45;
      enemy.parts.armR.rotation.x = s * 0.45;
      enemy.parts.body.position.y = 1.05 + Math.abs(s) * 0.08;
      enemy.parts.head.position.y = 2.0 + Math.abs(s) * 0.08;
    }

    function updateDestructibles(dt) {
      for (const obj of objects) {
        if (!obj.alive) continue;
        obj.group.position.addScaledVector(obj.velocity, dt);
        obj.velocity.multiplyScalar(Math.pow(0.08, dt));
        obj.shake = Math.max(0, obj.shake - dt);
        if (obj.shake > 0) {
          const amount = obj.shake * 0.22;
          obj.group.rotation.z = Math.sin(clock.elapsedTime * 72) * amount;
          obj.group.rotation.x = Math.cos(clock.elapsedTime * 61) * amount * 0.5;
        } else {
          obj.group.rotation.z *= Math.pow(0.03, dt);
          obj.group.rotation.x *= Math.pow(0.03, dt);
        }
      }
    }

    function updateDebris(dt) {
      for (let i = debris.length - 1; i >= 0; i--) {
        const d = debris[i];
        d.life -= dt;
        d.velocity.y -= 20 * dt;
        d.mesh.position.addScaledVector(d.velocity, dt);
        d.mesh.rotation.x += d.rot.x * dt;
        d.mesh.rotation.y += d.rot.y * dt;
        d.mesh.rotation.z += d.rot.z * dt;
        const ground = d.mesh.scale.y * 0.5;
        if (d.mesh.position.y < ground) {
          d.mesh.position.y = ground;
          d.velocity.y *= -0.45;
          d.velocity.x *= 0.68;
          d.velocity.z *= 0.68;
          d.rot.multiplyScalar(0.75);
        }
        d.mesh.material.opacity = clamp(d.life / d.maxLife, 0, 1);
        if (d.life <= 0) {
          scene.remove(d.mesh);
          d.mesh.material.dispose();
          debris.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.velocity.y -= 8 * dt;
        p.mesh.position.addScaledVector(p.velocity, dt);
        p.mesh.scale.multiplyScalar(1 + dt * 1.6);
        p.mesh.material.opacity = clamp(p.life / p.maxLife, 0, 1) * 0.75;
        if (p.life <= 0) {
          scene.remove(p.mesh);
          p.mesh.material.dispose();
          particles.splice(i, 1);
        }
      }
    }

    function updateAttackEffects(dt) {
      for (let i = attackEffects.length - 1; i >= 0; i--) {
        const e = attackEffects[i];
        e.life -= dt;
        const t = 1 - e.life / e.maxLife;
        e.group.position.copy(player.pos);
        if (e.spin) {
          e.group.rotation.y += dt * 18;
          e.group.scale.setScalar(1 + t * 0.5);
        } else {
          e.group.rotation.y = player.facing + t * 1.1;
          e.group.scale.setScalar(1 + t * 0.25);
        }
        e.group.traverse((child) => {
          if (child.isMesh && child.material.opacity !== undefined) {
            child.material.opacity = clamp(e.life / e.maxLife, 0, 1) * 0.82;
          }
        });
        if (e.life <= 0) {
          scene.remove(e.group);
          attackEffects.splice(i, 1);
        }
      }

      for (let i = motionTrails.length - 1; i >= 0; i--) {
        const t = motionTrails[i];
        t.life -= dt;
        t.group.scale.multiplyScalar(1 + dt * 1.8);
        t.group.traverse((child) => {
          if (child.isMesh) child.material.opacity = clamp(t.life / t.maxLife, 0, 1) * 0.22;
        });
        if (t.life <= 0) {
          scene.remove(t.group);
          motionTrails.splice(i, 1);
        }
      }
    }

    function updateKoi(dt) {
      for (const fish of koi) {
        const a = clock.elapsedTime * fish.speed + fish.offset;
        const x = fish.center.x + Math.cos(a) * fish.radiusX;
        const z = fish.center.z + Math.sin(a * 1.13) * fish.radiusZ;
        fish.group.position.set(x + 13, 0.38 + Math.sin(clock.elapsedTime * 3 + fish.bob) * 0.05, z - 8);
        fish.group.rotation.y = -a + Math.PI * 0.5;
      }
    }

    function updatePetals(dt) {
      const { mesh, petals } = petalSystem;
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y -= p.fall * dt;
        p.x += Math.sin(clock.elapsedTime * p.sway + i) * dt * 0.65;
        p.z += Math.cos(clock.elapsedTime * p.sway * 0.7 + i * 0.5) * dt * 0.55;
        p.spin += dt * p.sway * 2.8;
        if (p.y < 0.1) {
          p.x = range(-58, 58);
          p.y = range(18, 34);
          p.z = range(-58, 58);
        }
        tmpQuat.setFromEuler(new THREE.Euler(p.spin, p.spin * 0.6, p.spin * 0.2));
        tmpScale.setScalar(1);
        tmpMat.compose(tmpVec.set(p.x, p.y, p.z), tmpQuat, tmpScale);
        mesh.setMatrixAt(i, tmpMat);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    function updateCamera(dt) {
      const desired = tmpVec.set(player.pos.x + 24, player.pos.y + 18, player.pos.z - 30);
      camera.position.lerp(desired, 1 - Math.pow(0.001, dt));
      const look = tmpVec2.set(player.pos.x, player.pos.y + 2.2, player.pos.z);
      if (cameraShake > 0) {
        camera.position.x += range(-cameraShake, cameraShake);
        camera.position.y += range(-cameraShake, cameraShake);
        camera.position.z += range(-cameraShake, cameraShake);
      }
      camera.lookAt(look);
      cameraShake *= Math.pow(0.035, dt);
    }

    function updateHud(dt) {
      hpReadout.textContent = String(Math.round(player.hp));
      enemyReadout.textContent = String(enemies.filter((e) => !e.ko).length);
      koReadout.textContent = String(koCount);
      enemyTargetReadout.textContent = String(targetEnemyCount);
      toastTimer -= dt;
      if (toastTimer <= 0) {
        toast.classList.remove("show");
      }
    }

    function defeatPlayer() {
      if (player.dead) return;
      player.dead = true;
      player.hp = 0;
      player.invuln = Number.POSITIVE_INFINITY;
      player.roll = 0;
      player.attackTimer = 0;
      player.spinTimer = 0;
      player.vel.set(0, 0, 0);
      player.vertical = 0;
      keys.clear();
      pressed.clear();
      pointer.down = false;
      applyDefeatPose();
      gameOverPanel.classList.add("show");
      gameOverPanel.setAttribute("aria-hidden", "false");
      showToast("Defeated");
    }

    function applyDefeatPose() {
      const p = player.parts;
      p.body.rotation.x = 1.15;
      p.chest.rotation.x = 0.9;
      p.head.rotation.x = 0.75;
      p.armL.rotation.x = -0.6;
      p.armR.rotation.x = -0.8;
      p.legL.rotation.x = 0.45;
      p.legR.rotation.x = -0.25;
      p.sword.rotation.set(-1.1, 0, -0.35);
      player.group.rotation.y = visualFacing();
    }

    function resize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function init() {
      addLight();
      buildGround();
      buildPond();
      buildBridge();
      buildTorii();
      buildPagoda();
      populateGarden();
      addInput();
      showToast("Sakura wind rises");
      window.addEventListener("resize", resize);
      animate();
    }

    function animate() {
      requestAnimationFrame(animate);
      const rawDt = Math.min(clock.getDelta(), 0.05);
      const simDt = hitStop > 0 ? rawDt * 0.08 : rawDt;
      hitStop = Math.max(0, hitStop - rawDt);

      if (!player.dead) {
        maintainSpawns(simDt);
        updatePlayer(simDt);
        updateEnemies(simDt);
        updateDestructibles(simDt);
      }
      updateDebris(rawDt);
      updateAttackEffects(rawDt);
      updateKoi(rawDt);
      updatePetals(rawDt);
      updateCamera(rawDt);
      updateHud(rawDt);
      pressed.clear();

      renderer.render(scene, camera);
    }

    window.__voxelPagodaDebug = {
      scene,
      renderer,
      camera,
      player,
      enemies,
      objects,
      normalAttack,
      spinAttack,
      startRoll,
      defeatPlayer,
      damagePlayer(amount) {
        if (player.dead) return;
        player.hp = clamp(player.hp - Math.max(0, amount), 0, 100);
        if (player.hp <= 0) defeatPlayer();
      },
      setEnemyCount(count) {
        targetEnemyCount = clamp(Math.round(count / 10) * 10, 0, 100);
        enemySlider.value = String(targetEnemyCount);
        trimEnemiesToTarget();
        spawnQueue = Math.max(spawnQueue, Math.max(0, targetEnemyCount - enemies.length));
      },
      stats() {
        return {
          enemies: enemies.length,
          liveEnemies: enemies.filter((e) => !e.ko).length,
          destructibles: objects.filter((o) => o.alive).length,
          debris: debris.length,
          koCount,
          hp: player.hp,
          dead: player.dead
        };
      }
    };

    init();
  })();

