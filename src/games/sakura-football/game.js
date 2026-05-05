import * as THREE from "three";

    const PITCH = {
      length: 110,
      width: 68,
      halfLength: 55,
      halfWidth: 34,
      penaltyDepth: 16.5,
      penaltyWidth: 40,
      goalDepth: 4.5,
      goalWidth: 14,
      centerRadius: 9.15
    };

    const COLORS = {
      home: 0x2f7df6,
      away: 0xf04c45,
      keeper: 0xf3c944,
      grassA: 0x2f7d3f,
      grassB: 0x276f36,
      line: 0xf8f4e7,
      sakura: 0xffa9ca,
      wood: 0x91372e,
      water: 0x3aa9c8,
      lotus: 0xffb2d4,
      dark: 0x171a20
    };

    const TEAM = {
      HOME: "home",
      AWAY: "away"
    };

    const POSITIONS = [
      { role: "GK", name: "Keeper 1", x: -48, z: 0 },
      { role: "LB", name: "Back 3", x: -34, z: -24 },
      { role: "CB", name: "Back 4", x: -37, z: -8 },
      { role: "CB", name: "Back 5", x: -37, z: 8 },
      { role: "RB", name: "Back 2", x: -34, z: 24 },
      { role: "DM", name: "Mid 6", x: -21, z: 0 },
      { role: "LM", name: "Wing 7", x: -11, z: -24 },
      { role: "CM", name: "Mid 8", x: -6, z: -7 },
      { role: "CM", name: "Mid 10", x: -6, z: 7 },
      { role: "RM", name: "Wing 11", x: -11, z: 24 },
      { role: "ST", name: "Striker 9", x: 12, z: 0 }
    ];

    const el = {
      game: document.getElementById("game"),
      homeScore: document.getElementById("homeScore"),
      awayScore: document.getElementById("awayScore"),
      clock: document.getElementById("clock"),
      selectedName: document.getElementById("selectedName"),
      possessionText: document.getElementById("possessionText"),
      stamina: document.getElementById("stamina"),
      powerFill: document.getElementById("powerFill"),
      powerText: document.getElementById("powerText"),
      toast: document.getElementById("toast"),
      toastTitle: document.getElementById("toastTitle"),
      toastBody: document.getElementById("toastBody"),
      matchOver: document.getElementById("matchOver"),
      finalText: document.getElementById("finalText"),
      restartButton: document.getElementById("restartButton")
    };

    const state = {
      matchDuration: 180,
      timeLeft: 180,
      score: { home: 0, away: 0 },
      players: [],
      homePlayers: [],
      awayPlayers: [],
      selectedIndex: 7,
      keys: new Set(),
      charge: 0,
      charging: false,
      ended: false,
      pausedAfterGoal: 0,
      possession: null,
      lastTouchTeam: null,
      gamepadButtons: [],
      cameraTarget: new THREE.Vector3(),
      cameraLook: new THREE.Vector3(),
      lastTime: performance.now()
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141820);
    scene.fog = new THREE.Fog(0x141820, 95, 190);

    const camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 420);
    camera.position.set(-28, 50, 56);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.game.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xd9f3ff, 0x24331f, 1.2);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1d2, 2.55);
    sun.position.set(-38, 68, 32);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.left = -84;
    sun.shadow.camera.right = 84;
    sun.shadow.camera.top = 66;
    sun.shadow.camera.bottom = -66;
    sun.shadow.camera.near = 8;
    sun.shadow.camera.far = 150;
    scene.add(sun);

    const materials = {
      grassA: new THREE.MeshStandardMaterial({ color: COLORS.grassA, roughness: 0.92, metalness: 0.02 }),
      grassB: new THREE.MeshStandardMaterial({ color: COLORS.grassB, roughness: 0.96, metalness: 0.02 }),
      pitchLine: new THREE.MeshStandardMaterial({ color: COLORS.line, roughness: 0.66 }),
      home: new THREE.MeshStandardMaterial({ color: COLORS.home, roughness: 0.58, metalness: 0.06 }),
      away: new THREE.MeshStandardMaterial({ color: COLORS.away, roughness: 0.58, metalness: 0.06 }),
      keeper: new THREE.MeshStandardMaterial({ color: COLORS.keeper, roughness: 0.5, metalness: 0.08 }),
      skin: new THREE.MeshStandardMaterial({ color: 0xf0c28f, roughness: 0.72 }),
      black: new THREE.MeshStandardMaterial({ color: 0x101014, roughness: 0.76 }),
      white: new THREE.MeshStandardMaterial({ color: 0xf8f4ea, roughness: 0.42 }),
      ball: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.36, metalness: 0.03 }),
      ballBand: new THREE.MeshStandardMaterial({ color: 0x191919, roughness: 0.5 }),
      wood: new THREE.MeshStandardMaterial({ color: COLORS.wood, roughness: 0.78 }),
      darkWood: new THREE.MeshStandardMaterial({ color: 0x5c201d, roughness: 0.8 }),
      stone: new THREE.MeshStandardMaterial({ color: 0x9ea5a6, roughness: 0.84 }),
      roof: new THREE.MeshStandardMaterial({ color: 0x293746, roughness: 0.58 }),
      sakura: new THREE.MeshStandardMaterial({ color: COLORS.sakura, roughness: 0.68 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x6b4634, roughness: 0.84 }),
      water: new THREE.MeshStandardMaterial({ color: COLORS.water, roughness: 0.28, metalness: 0.02, transparent: true, opacity: 0.72 }),
      lotus: new THREE.MeshStandardMaterial({ color: COLORS.lotus, roughness: 0.64 }),
      accent: new THREE.MeshStandardMaterial({ color: COLORS.keeper, roughness: 0.46, metalness: 0.08 })
    };

    const pitchGroup = new THREE.Group();
    const worldGroup = new THREE.Group();
    const playersGroup = new THREE.Group();
    scene.add(pitchGroup, worldGroup, playersGroup);

    const tmpVec = new THREE.Vector3();
    const tmpVec2 = new THREE.Vector3();
    const tmp2 = new THREE.Vector2();

    const ball = createBall();
    scene.add(ball.group);

    buildPitch();
    buildSurroundings();
    createTeams();
    resetKickoff("home", true);
    updateHud();

    el.restartButton.addEventListener("click", () => restartMatch());

    window.addEventListener("keydown", (event) => {
      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "ShiftLeft", "ShiftRight", "Space"].includes(event.code)) {
        event.preventDefault();
      }
      if (event.repeat) return;
      state.keys.add(event.code);
      if (event.code === "KeyQ") switchPlayer();
      if (event.code === "KeyJ") passBall(false);
      if (event.code === "KeyK") passBall(true);
      if (event.code === "KeyR") {
        if (state.ended) restartMatch();
        else resetKickoff("home", false);
      }
      if (event.code === "Space") beginCharge();
    });

    window.addEventListener("keyup", (event) => {
      state.keys.delete(event.code);
      if (event.code === "Space") releaseShot();
    });

    window.addEventListener("resize", onResize);

    requestAnimationFrame(loop);

    function buildPitch() {
      const base = new THREE.Mesh(
        new THREE.PlaneGeometry(PITCH.length + 8, PITCH.width + 8),
        new THREE.MeshStandardMaterial({ color: 0x204c28, roughness: 1 })
      );
      base.rotation.x = -Math.PI / 2;
      base.receiveShadow = true;
      pitchGroup.add(base);

      const bandWidth = PITCH.length / 12;
      for (let i = 0; i < 12; i++) {
        const x = -PITCH.halfLength + bandWidth * i + bandWidth / 2;
        const strip = new THREE.Mesh(new THREE.PlaneGeometry(bandWidth + 0.05, PITCH.width), i % 2 === 0 ? materials.grassA : materials.grassB);
        strip.position.set(x, 0.012, 0);
        strip.rotation.x = -Math.PI / 2;
        strip.receiveShadow = true;
        pitchGroup.add(strip);
      }

      addLine(0, -PITCH.halfWidth, PITCH.length, 0.28, 0);
      addLine(0, PITCH.halfWidth, PITCH.length, 0.28, 0);
      addLine(-PITCH.halfLength, 0, PITCH.width, 0.28, Math.PI / 2);
      addLine(PITCH.halfLength, 0, PITCH.width, 0.28, Math.PI / 2);
      addLine(0, 0, PITCH.width, 0.24, Math.PI / 2);
      addCircle(0, 0, PITCH.centerRadius, 0.18);
      addDisc(0, 0, 0.48);

      addPenaltyArea(-1);
      addPenaltyArea(1);
      addGoal(-1);
      addGoal(1);
      addCornerArcs();
    }

    function addLine(x, z, length, width, rotationY) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(length, 0.035, width), materials.pitchLine);
      line.position.set(x, 0.06, z);
      line.rotation.y = rotationY;
      line.receiveShadow = true;
      pitchGroup.add(line);
      return line;
    }

    function addCircle(x, z, radius, tube) {
      const curve = new THREE.Mesh(
        new THREE.TorusGeometry(radius, tube, 8, 96),
        materials.pitchLine
      );
      curve.position.set(x, 0.08, z);
      curve.rotation.x = Math.PI / 2;
      curve.receiveShadow = true;
      pitchGroup.add(curve);
      return curve;
    }

    function addDisc(x, z, radius) {
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.04, 24), materials.pitchLine);
      disc.position.set(x, 0.08, z);
      disc.receiveShadow = true;
      pitchGroup.add(disc);
    }

    function addPenaltyArea(side) {
      const goalX = side * PITCH.halfLength;
      const innerX = goalX - side * PITCH.penaltyDepth;
      const boxCenterX = goalX - side * PITCH.penaltyDepth / 2;
      const sixDepth = 5.5;
      const sixWidth = 18.3;
      const sixCenterX = goalX - side * sixDepth / 2;

      addLine(boxCenterX, -PITCH.penaltyWidth / 2, PITCH.penaltyDepth, 0.22, 0);
      addLine(boxCenterX, PITCH.penaltyWidth / 2, PITCH.penaltyDepth, 0.22, 0);
      addLine(innerX, 0, PITCH.penaltyWidth, 0.22, Math.PI / 2);

      addLine(sixCenterX, -sixWidth / 2, sixDepth, 0.2, 0);
      addLine(sixCenterX, sixWidth / 2, sixDepth, 0.2, 0);
      addLine(goalX - side * sixDepth, 0, sixWidth, 0.2, Math.PI / 2);
      addDisc(goalX - side * 11, 0, 0.38);
    }

    function addGoal(side) {
      const x = side * (PITCH.halfLength + PITCH.goalDepth / 2);
      const postX = side * (PITCH.halfLength + 0.08);
      const backX = side * (PITCH.halfLength + PITCH.goalDepth);
      const cross = new THREE.Mesh(new THREE.BoxGeometry(PITCH.goalDepth, 0.26, 0.26), materials.white);
      cross.position.set(x, 2.45, -PITCH.goalWidth / 2);
      cross.castShadow = true;
      pitchGroup.add(cross);

      const cross2 = cross.clone();
      cross2.position.z = PITCH.goalWidth / 2;
      pitchGroup.add(cross2);

      const back = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, PITCH.goalWidth), materials.white);
      back.position.set(backX, 2.45, 0);
      back.castShadow = true;
      pitchGroup.add(back);

      for (const z of [-PITCH.goalWidth / 2, PITCH.goalWidth / 2]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.8, 12), materials.white);
        post.position.set(postX, 2.4, z);
        post.castShadow = true;
        pitchGroup.add(post);

        const backPost = post.clone();
        backPost.position.x = backX;
        pitchGroup.add(backPost);
      }

      for (let i = 0; i < 5; i++) {
        const net = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.5, PITCH.goalWidth), materials.pitchLine);
        net.position.set(postX + side * (i * PITCH.goalDepth / 4), 1.25, 0);
        net.material = new THREE.MeshStandardMaterial({ color: COLORS.line, transparent: true, opacity: 0.24, roughness: 0.6 });
        pitchGroup.add(net);
      }
    }

    function addCornerArcs() {
      const points = [
        [-PITCH.halfLength, -PITCH.halfWidth],
        [-PITCH.halfLength, PITCH.halfWidth],
        [PITCH.halfLength, -PITCH.halfWidth],
        [PITCH.halfLength, PITCH.halfWidth]
      ];
      for (const [x, z] of points) {
        const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 18), materials.pitchLine);
        dot.position.set(x, 0.1, z);
        pitchGroup.add(dot);
      }
    }

    function buildSurroundings() {
      const outer = new THREE.Mesh(
        new THREE.PlaneGeometry(190, 150),
        new THREE.MeshStandardMaterial({ color: 0x17211f, roughness: 0.9 })
      );
      outer.rotation.x = -Math.PI / 2;
      outer.position.y = -0.03;
      outer.receiveShadow = true;
      worldGroup.add(outer);

      buildToriiGate(0, -53);
      buildPagoda(-82, 34);
      buildLotusPond(78, -42);
      buildSakuraGarden();
      buildStoneLanterns();
    }

    function buildToriiGate(x, z) {
      const gate = new THREE.Group();
      gate.position.set(x, 0, z);
      const pillarGeo = new THREE.BoxGeometry(1.4, 13, 1.4);
      const beamGeo = new THREE.BoxGeometry(34, 1.5, 2.1);
      const topGeo = new THREE.BoxGeometry(38, 1.2, 2.4);
      for (const px of [-13, 13]) {
        const pillar = new THREE.Mesh(pillarGeo, materials.wood);
        pillar.position.set(px, 6.5, 0);
        pillar.castShadow = true;
        gate.add(pillar);
      }
      const beam = new THREE.Mesh(beamGeo, materials.wood);
      beam.position.set(0, 11.8, 0);
      beam.castShadow = true;
      gate.add(beam);
      const top = new THREE.Mesh(topGeo, materials.darkWood);
      top.position.set(0, 14.1, 0);
      top.castShadow = true;
      gate.add(top);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(20, 1.2, 1.7), materials.wood);
      cap.position.set(0, 8.8, 0);
      cap.castShadow = true;
      gate.add(cap);
      worldGroup.add(gate);
    }

    function buildPagoda(x, z) {
      const pagoda = new THREE.Group();
      pagoda.position.set(x, 0, z);
      for (let i = 0; i < 5; i++) {
        const level = new THREE.Mesh(new THREE.BoxGeometry(12 - i * 1.3, 3.2, 12 - i * 1.3), materials.wood);
        level.position.y = 1.6 + i * 4;
        level.castShadow = true;
        pagoda.add(level);

        const roof = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 1.2, 0.8, 16 - i * 1.2), materials.roof);
        roof.position.y = 3.5 + i * 4;
        roof.castShadow = true;
        pagoda.add(roof);
      }
      const spire = new THREE.Mesh(new THREE.ConeGeometry(2.3, 5.4, 4), materials.accent);
      spire.position.y = 23.5;
      spire.rotation.y = Math.PI / 4;
      spire.castShadow = true;
      pagoda.add(spire);
      worldGroup.add(pagoda);
    }

    function buildLotusPond(x, z) {
      const pond = new THREE.Group();
      pond.position.set(x, 0.02, z);
      const water = new THREE.Mesh(new THREE.CircleGeometry(15, 48), materials.water);
      water.rotation.x = -Math.PI / 2;
      water.receiveShadow = true;
      pond.add(water);
      for (let i = 0; i < 15; i++) {
        const angle = i * 2.399;
        const radius = 2 + (i % 5) * 2.2;
        const pad = new THREE.Mesh(new THREE.CircleGeometry(0.9 + (i % 3) * 0.18, 16), new THREE.MeshStandardMaterial({ color: 0x4e9c53, roughness: 0.76 }));
        pad.position.set(Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius);
        pad.rotation.x = -Math.PI / 2;
        pond.add(pad);
        if (i % 3 === 0) {
          const lotus = new THREE.Mesh(new THREE.SphereGeometry(0.44, 12, 8), materials.lotus);
          lotus.position.set(pad.position.x, 0.4, pad.position.z);
          lotus.scale.set(1, 0.45, 1);
          lotus.castShadow = true;
          pond.add(lotus);
        }
      }
      worldGroup.add(pond);
    }

    function buildSakuraGarden() {
      const spots = [
        [-77, -28], [-70, -48], [-55, -50], [-84, -4],
        [70, 35], [84, 18], [62, 50], [91, -6],
        [-10, 55], [18, 54], [42, 51]
      ];
      spots.forEach(([x, z], i) => buildSakuraTree(x, z, 4.4 + (i % 3) * 0.45));
    }

    function buildSakuraTree(x, z, scale) {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.8, scale * 2.2, 8), materials.trunk);
      trunk.position.y = scale * 1.1;
      trunk.castShadow = true;
      tree.add(trunk);
      const crownOffsets = [
        [0, 0, 0], [-0.95, -0.1, 0.2], [0.95, 0.08, -0.2],
        [0.35, 0.45, 0.85], [-0.25, 0.42, -0.9]
      ];
      for (const [cx, cy, cz] of crownOffsets) {
        const crown = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.9, 14, 10), materials.sakura);
        crown.position.set(cx * scale, scale * 2.45 + cy * scale, cz * scale);
        crown.scale.set(1.12, 0.78, 1);
        crown.castShadow = true;
        tree.add(crown);
      }
      worldGroup.add(tree);
    }

    function buildStoneLanterns() {
      const positions = [[-62, -41], [-46, -42], [46, -42], [62, -41], [-68, 42], [68, 42]];
      for (const [x, z] of positions) {
        const lantern = new THREE.Group();
        lantern.position.set(x, 0, z);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.3, 0.8, 8), materials.stone);
        base.position.y = 0.4;
        base.castShadow = true;
        lantern.add(base);
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 2.2, 8), materials.stone);
        stem.position.y = 1.9;
        stem.castShadow = true;
        lantern.add(stem);
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.3, 1.8), materials.accent);
        lamp.position.y = 3.35;
        lamp.castShadow = true;
        lantern.add(lamp);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(1.65, 0.9, 4), materials.roof);
        roof.position.y = 4.45;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        lantern.add(roof);
        worldGroup.add(lantern);
      }
    }

    function createBall() {
      const group = new THREE.Group();
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.72, 28, 18), materials.ball);
      sphere.castShadow = true;
      group.add(sphere);
      const band1 = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.025, 8, 36), materials.ballBand);
      band1.rotation.x = Math.PI / 2;
      group.add(band1);
      const band2 = band1.clone();
      band2.rotation.y = Math.PI / 2;
      group.add(band2);
      return {
        group,
        position: new THREE.Vector3(0, 0.74, 0),
        velocity: new THREE.Vector3(),
        radius: 0.72,
        owner: null
      };
    }

    function createTeams() {
      state.players.length = 0;
      state.homePlayers.length = 0;
      state.awayPlayers.length = 0;
      playersGroup.clear();

      POSITIONS.forEach((spot, index) => {
        const player = createPlayer(TEAM.HOME, index, spot);
        state.players.push(player);
        state.homePlayers.push(player);
        playersGroup.add(player.group);
      });

      POSITIONS.forEach((spot, index) => {
        const mirrored = {
          role: spot.role,
          name: spot.name,
          x: -spot.x,
          z: -spot.z
        };
        const player = createPlayer(TEAM.AWAY, index, mirrored);
        state.players.push(player);
        state.awayPlayers.push(player);
        playersGroup.add(player.group);
      });
    }

    function createPlayer(team, index, spot) {
      const group = new THREE.Group();
      const isKeeper = spot.role === "GK";
      const shirt = isKeeper ? materials.keeper : (team === TEAM.HOME ? materials.home : materials.away);
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 2.3, 1.1), shirt);
      body.position.y = 1.75;
      body.castShadow = true;
      group.add(body);

      const head = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.92, 1.1), materials.skin);
      head.position.y = 3.45;
      head.castShadow = true;
      group.add(head);

      const hair = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.28, 1.16), materials.black);
      hair.position.y = 4.03;
      hair.castShadow = true;
      group.add(hair);

      const legGeo = new THREE.BoxGeometry(0.42, 1.22, 0.48);
      for (const lx of [-0.38, 0.38]) {
        const leg = new THREE.Mesh(legGeo, materials.black);
        leg.position.set(lx, 0.61, 0);
        leg.castShadow = true;
        group.add(leg);
      }

      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.055, 6, 44), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x2f7df6, emissiveIntensity: 0.55 }));
      ring.position.y = 0.08;
      ring.rotation.x = Math.PI / 2;
      ring.visible = false;
      group.add(ring);

      const player = {
        team,
        index,
        role: spot.role,
        name: `${team === TEAM.HOME ? "Blue" : "Red"} ${spot.name}`,
        group,
        ring,
        position: new THREE.Vector3(spot.x, 0, spot.z),
        velocity: new THREE.Vector3(),
        home: new THREE.Vector3(spot.x, 0, spot.z),
        target: new THREE.Vector3(spot.x, 0, spot.z),
        radius: 1.05,
        speed: isKeeper ? 10.5 : 11.7,
        sprintSpeed: isKeeper ? 12.2 : 15.7,
        stamina: 1,
        isKeeper,
        hasBall: false,
        faceDir: team === TEAM.HOME ? 1 : -1,
        tackleCooldown: 0,
        aiJitter: Math.random() * 10
      };

      player.group.position.copy(player.position);
      return player;
    }

    function loop(now) {
      const rawDt = Math.min((now - state.lastTime) / 1000, 0.05);
      state.lastTime = now;
      const dt = state.ended ? 0 : rawDt;

      readGamepad();
      if (!state.ended) {
        tickMatch(dt);
        tickInput(dt);
        tickAi(dt);
        tickPlayers(dt);
        tickBall(dt);
        tickPossession(dt);
        tickCamera(dt);
        updateHud();
      } else {
        tickCamera(rawDt);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    function tickMatch(dt) {
      if (state.pausedAfterGoal > 0) {
        state.pausedAfterGoal -= dt;
        if (state.pausedAfterGoal <= 0) {
          resetKickoff(state.lastTouchTeam === TEAM.HOME ? TEAM.AWAY : TEAM.HOME, false);
        }
        return;
      }

      state.timeLeft = Math.max(0, state.timeLeft - dt);
      if (state.timeLeft <= 0) {
        endMatch();
      }
    }

    function tickInput(dt) {
      const selected = getSelectedPlayer();
      const move = getMoveVector();
      const sprinting = isSprinting();

      if (move.lengthSq() > 0.001) {
        move.normalize();
        selected.faceDir = move.x || selected.faceDir;
        const speed = sprinting && selected.stamina > 0.04 ? selected.sprintSpeed : selected.speed;
        selected.velocity.x += move.x * speed * 4.3 * dt;
        selected.velocity.z += move.z * speed * 4.3 * dt;
        selected.stamina = clamp(selected.stamina + (sprinting ? -0.28 : 0.12) * dt, 0, 1);
      } else {
        selected.stamina = clamp(selected.stamina + 0.18 * dt, 0, 1);
      }

      if (state.charging) {
        state.charge = clamp(state.charge + dt * 0.82, 0, 1);
      }
    }

    function tickAi(dt) {
      const selected = getSelectedPlayer();
      for (const player of state.players) {
        player.tackleCooldown = Math.max(0, player.tackleCooldown - dt);
        if (player === selected) continue;
        if (player.team === TEAM.HOME) {
          updateHomeSupport(player, dt);
        } else {
          updateAwayAi(player, dt);
        }
      }
    }

    function updateHomeSupport(player, dt) {
      const attackBias = ball.position.x > -12 ? 7 : 0;
      player.target.copy(player.home);
      player.target.x = clamp(player.home.x + attackBias + ball.position.x * 0.12, -50, 45);
      player.target.z = clamp(player.home.z + ball.position.z * 0.1, -30, 30);
      if (ball.owner && ball.owner.team === TEAM.AWAY) {
        const dist = flatDistance(player.position, ball.position);
        if (dist < 16 || player.isKeeper && ball.position.x < -37) {
          player.target.set(ball.position.x - 1.4, 0, ball.position.z);
        }
      }
      if (ball.owner && ball.owner.team === TEAM.HOME && player !== ball.owner) {
        const lane = player.index % 2 === 0 ? -1 : 1;
        player.target.x = clamp(ball.position.x + 8 + lane * 1.6, -44, 50);
        player.target.z = clamp(player.home.z * 0.7 + lane * 5 + ball.position.z * 0.16, -30, 30);
      }
      moveTowardTarget(player, dt, player.speed * 0.84);
    }

    function updateAwayAi(player, dt) {
      const pressure = getNearest(state.awayPlayers, ball.position, player.isKeeper ? Infinity : 42);
      const ownGoalX = PITCH.halfLength;
      const attackGoalX = -PITCH.halfLength;
      player.target.copy(player.home);

      if (ball.owner && ball.owner.team === TEAM.AWAY) {
        if (player === ball.owner) {
          const lane = Math.sign(player.position.z || 1);
          player.target.set(attackGoalX + 7, 0, clamp(player.position.z - lane * 3, -24, 24));
        } else {
          const widthSupport = player.index % 2 === 0 ? -1 : 1;
          player.target.x = clamp(ball.position.x - 11 - player.index * 0.25, -47, 38);
          player.target.z = clamp(player.home.z * 0.58 + widthSupport * 5 + ball.position.z * 0.18, -30, 30);
        }
      } else if (pressure === player || player.isKeeper && ball.position.x > 38) {
        player.target.set(ball.position.x, 0, ball.position.z);
      } else {
        player.target.x = clamp(player.home.x + ball.position.x * 0.08, -36, 50);
        player.target.z = clamp(player.home.z + ball.position.z * 0.12, -30, 30);
      }

      if (player.isKeeper) {
        player.target.x = clamp(ball.position.x, ownGoalX - 8, ownGoalX - 2.4);
        player.target.z = clamp(ball.position.z, -PITCH.goalWidth / 2 + 1.2, PITCH.goalWidth / 2 - 1.2);
      }

      moveTowardTarget(player, dt, player.speed * (pressure === player ? 1.06 : 0.82));

      if (ball.owner === player) {
        aiUseBall(player, dt);
      }
    }

    function aiUseBall(player, dt) {
      player.aiJitter -= dt;
      const goalDist = Math.abs(player.position.x + PITCH.halfLength);
      if (goalDist < 27 && Math.abs(player.position.z) < 17 && player.aiJitter < 8.5) {
        shootToward(player, new THREE.Vector3(-PITCH.halfLength - 2, 0, clamp(player.position.z * 0.22, -4, 4)), 0.82);
        player.aiJitter = 2.4 + Math.random() * 1.7;
        return;
      }

      const closeHome = getNearest(state.homePlayers, player.position, 8);
      if (closeHome && player.aiJitter <= 0) {
        const mate = chooseBestTeammate(state.awayPlayers, player, true);
        if (mate) {
          kickTo(player, mate.position, 30, true);
          player.aiJitter = 1.8 + Math.random() * 1.4;
        }
      }
    }

    function moveTowardTarget(player, dt, maxSpeed) {
      tmpVec.copy(player.target).sub(player.position);
      tmpVec.y = 0;
      const dist = tmpVec.length();
      if (dist > 0.2) {
        tmpVec.normalize();
        player.faceDir = tmpVec.x || player.faceDir;
        player.velocity.x += tmpVec.x * maxSpeed * 3.2 * dt;
        player.velocity.z += tmpVec.z * maxSpeed * 3.2 * dt;
      }
      player.stamina = clamp(player.stamina + 0.11 * dt, 0, 1);
    }

    function tickPlayers(dt) {
      for (const player of state.players) {
        const max = player.sprintSpeed + 1;
        const speed = Math.hypot(player.velocity.x, player.velocity.z);
        if (speed > max) {
          player.velocity.x = (player.velocity.x / speed) * max;
          player.velocity.z = (player.velocity.z / speed) * max;
        }
        player.position.x += player.velocity.x * dt;
        player.position.z += player.velocity.z * dt;
        player.position.x = clamp(player.position.x, -PITCH.halfLength + 1.3, PITCH.halfLength - 1.3);
        player.position.z = clamp(player.position.z, -PITCH.halfWidth + 1.3, PITCH.halfWidth - 1.3);
        player.velocity.multiplyScalar(Math.pow(0.012, dt));
      }

      resolvePlayerCollisions();

      for (const player of state.players) {
        player.group.position.copy(player.position);
        const angle = Math.atan2(player.velocity.x || player.faceDir * 0.001, player.velocity.z || 0.001);
        player.group.rotation.y = angle;
        player.ring.visible = player === getSelectedPlayer();
        player.ring.material.emissiveIntensity = 0.35 + Math.sin(performance.now() * 0.008) * 0.2;
      }
    }

    function resolvePlayerCollisions() {
      const minDist = 2.05;
      for (let i = 0; i < state.players.length; i++) {
        for (let j = i + 1; j < state.players.length; j++) {
          const a = state.players[i];
          const b = state.players[j];
          const dx = b.position.x - a.position.x;
          const dz = b.position.z - a.position.z;
          const distSq = dx * dx + dz * dz;
          if (distSq > 0.001 && distSq < minDist * minDist) {
            const dist = Math.sqrt(distSq);
            const push = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const nz = dz / dist;
            a.position.x -= nx * push;
            a.position.z -= nz * push;
            b.position.x += nx * push;
            b.position.z += nz * push;
          }
        }
      }
    }

    function tickBall(dt) {
      if (state.pausedAfterGoal > 0) {
        ball.velocity.multiplyScalar(0.92);
      }

      if (ball.owner) {
        const owner = ball.owner;
        const forward = owner.team === TEAM.HOME ? 1 : -1;
        const dirX = owner.velocity.lengthSq() > 1 ? Math.sign(owner.velocity.x || forward) : forward;
        const dirZ = clamp(owner.velocity.z * 0.08, -0.6, 0.6);
        ball.position.set(owner.position.x + dirX * 1.35, 0.74, owner.position.z + dirZ * 1.3);
        ball.velocity.set(owner.velocity.x * 0.75, 0, owner.velocity.z * 0.75);
      } else {
        ball.position.addScaledVector(ball.velocity, dt);
        ball.velocity.multiplyScalar(Math.pow(0.68, dt));
        ball.group.rotation.x += ball.velocity.z * dt * 1.2;
        ball.group.rotation.z -= ball.velocity.x * dt * 1.2;
      }

      if (!ball.owner) {
        if (ball.position.z > PITCH.halfWidth - ball.radius) {
          ball.position.z = PITCH.halfWidth - ball.radius;
          ball.velocity.z *= -0.52;
        }
        if (ball.position.z < -PITCH.halfWidth + ball.radius) {
          ball.position.z = -PITCH.halfWidth + ball.radius;
          ball.velocity.z *= -0.52;
        }
      }

      if (checkGoal()) {
        ball.group.position.copy(ball.position);
        return;
      }

      const inGoalMouth = Math.abs(ball.position.z) <= PITCH.goalWidth / 2;
      if (!ball.owner && !inGoalMouth && Math.abs(ball.position.x) > PITCH.halfLength - ball.radius) {
        ball.position.x = clamp(ball.position.x, -PITCH.halfLength + ball.radius, PITCH.halfLength - ball.radius);
        ball.velocity.x *= -0.42;
      }

      ball.group.position.copy(ball.position);
    }

    function tickPossession(dt) {
      if (state.pausedAfterGoal > 0) return;
      if (ball.owner) {
        resolveTackles();
        return;
      }
      let nearest = null;
      let nearestDist = Infinity;
      for (const player of state.players) {
        const d = flatDistance(player.position, ball.position);
        const pickup = player.isKeeper ? 2.75 : 1.85;
        if (d < pickup && d < nearestDist && player.tackleCooldown <= 0) {
          nearest = player;
          nearestDist = d;
        }
      }
      if (nearest) {
        giveBall(nearest);
      }

      for (const player of state.players) {
        if (player.team === TEAM.AWAY && player.tackleCooldown <= 0 && flatDistance(player.position, ball.position) < 2.15) {
          player.tackleCooldown = 0.8;
        }
      }
    }

    function resolveTackles() {
      const owner = ball.owner;
      const challengers = owner.team === TEAM.HOME ? state.awayPlayers : state.homePlayers;
      for (const challenger of challengers) {
        if (challenger.tackleCooldown > 0) continue;
        const distance = flatDistance(challenger.position, owner.position);
        const reach = challenger.isKeeper ? 2.75 : 2.18;
        if (distance > reach) continue;

        challenger.tackleCooldown = 0.85;
        owner.tackleCooldown = 0.45;
        const ownerSpeed = Math.hypot(owner.velocity.x, owner.velocity.z);
        const challengerSpeed = Math.hypot(challenger.velocity.x, challenger.velocity.z);
        const winBias = challenger.isKeeper ? 0.22 : 0;
        const win = challengerSpeed + winBias + Math.random() * 1.4 > ownerSpeed * 0.62 + distance * 0.18;

        if (win) {
          giveBall(challenger);
        } else {
          releaseBall();
          tmpVec.copy(owner.position).sub(challenger.position);
          tmpVec.y = 0;
          if (tmpVec.lengthSq() < 0.01) {
            tmpVec.set(owner.team === TEAM.HOME ? 1 : -1, 0, 0);
          }
          tmpVec.normalize();
          ball.position.set(owner.position.x + tmpVec.x * 1.35, 0.74, owner.position.z + tmpVec.z * 1.35);
          ball.velocity.set(tmpVec.x * 13, 0, tmpVec.z * 13);
        }
        return;
      }
    }

    function checkGoal() {
      const inMouth = Math.abs(ball.position.z) <= PITCH.goalWidth / 2;
      if (!inMouth || state.pausedAfterGoal > 0) return false;

      if (ball.position.x > PITCH.halfLength) {
        scoreGoal(TEAM.HOME);
        return true;
      } else if (ball.position.x < -PITCH.halfLength) {
        scoreGoal(TEAM.AWAY);
        return true;
      }

      return false;
    }

    function scoreGoal(team) {
      state.score[team] += 1;
      state.lastTouchTeam = team;
      releaseBall();
      ball.velocity.set(0, 0, 0);
      state.pausedAfterGoal = 2.2;
      showToast("Goal", `${team === TEAM.HOME ? "Sakura Blue" : "Koi Red"} scores`);
      updateHud();
    }

    function giveBall(player) {
      if (ball.owner) ball.owner.hasBall = false;
      ball.owner = player;
      player.hasBall = true;
      state.possession = player.team;
      state.lastTouchTeam = player.team;
      ball.velocity.set(0, 0, 0);
    }

    function releaseBall() {
      if (ball.owner) {
        ball.owner.hasBall = false;
      }
      ball.owner = null;
    }

    function beginCharge() {
      if (state.ended || state.pausedAfterGoal > 0) return;
      state.charging = true;
    }

    function releaseShot() {
      if (!state.charging) return;
      const power = Math.max(0.18, state.charge);
      state.charging = false;
      state.charge = 0;
      const selected = getSelectedPlayer();
      if (ball.owner === selected || flatDistance(selected.position, ball.position) < 3.2) {
        const target = new THREE.Vector3(PITCH.halfLength + 2, 0, clamp(selected.position.z * 0.22, -5.6, 5.6));
        shootToward(selected, target, power);
      }
    }

    function shootToward(player, target, power) {
      const speed = 34 + power * 34;
      kickTo(player, target, speed, false);
    }

    function passBall(through) {
      if (state.ended || state.pausedAfterGoal > 0) return;
      const selected = getSelectedPlayer();
      if (ball.owner !== selected && flatDistance(selected.position, ball.position) > 3) return;
      const mate = chooseBestTeammate(state.homePlayers, selected, through);
      if (mate) {
        const lead = through ? new THREE.Vector3(9, 0, mate.position.z > selected.position.z ? 3 : -3) : new THREE.Vector3();
        tmpVec.copy(mate.position).add(lead);
        kickTo(selected, tmpVec, through ? 35 : 27, true);
      }
    }

    function kickTo(player, target, speed, pass) {
      if (ball.owner !== player && flatDistance(player.position, ball.position) > 3.2) return;
      releaseBall();
      tmpVec.copy(target).sub(player.position);
      tmpVec.y = 0;
      if (tmpVec.lengthSq() < 0.01) {
        tmpVec.set(player.team === TEAM.HOME ? 1 : -1, 0, 0);
      }
      tmpVec.normalize();
      ball.position.set(player.position.x + tmpVec.x * 1.5, 0.74, player.position.z + tmpVec.z * 1.5);
      ball.velocity.set(tmpVec.x * speed, 0, tmpVec.z * speed);
      if (!pass) {
        ball.velocity.z += (Math.random() - 0.5) * 2.2;
      }
      state.lastTouchTeam = player.team;
    }

    function chooseBestTeammate(teamPlayers, from, through) {
      let best = null;
      let bestScore = -Infinity;
      const direction = from.team === TEAM.HOME ? 1 : -1;
      for (const mate of teamPlayers) {
        if (mate === from || mate.isKeeper) continue;
        const dx = (mate.position.x - from.position.x) * direction;
        const distance = flatDistance(from.position, mate.position);
        if (distance < 5 || distance > 44) continue;
        const progress = through ? dx * 2.2 : Math.max(dx, -3);
        const width = -Math.abs(mate.position.z - from.position.z) * 0.25;
        const open = nearestOpponentDistance(mate, from.team) * 0.8;
        const score = progress + width + open - distance * 0.08 + Math.random() * 2;
        if (score > bestScore) {
          bestScore = score;
          best = mate;
        }
      }
      return best;
    }

    function nearestOpponentDistance(player, team) {
      const opponents = team === TEAM.HOME ? state.awayPlayers : state.homePlayers;
      let best = Infinity;
      for (const opponent of opponents) {
        best = Math.min(best, flatDistance(player.position, opponent.position));
      }
      return best;
    }

    function switchPlayer() {
      if (state.ended) return;
      const current = getSelectedPlayer();
      if (ball.owner && ball.owner.team === TEAM.HOME) {
        state.selectedIndex = ball.owner.index;
        return;
      }
      let bestIndex = current.index;
      let bestDist = Infinity;
      for (const p of state.homePlayers) {
        const d = flatDistance(p.position, ball.position);
        if (p !== current && d < bestDist) {
          bestDist = d;
          bestIndex = p.index;
        }
      }
      state.selectedIndex = bestIndex;
    }

    function resetKickoff(team = "home", initial = false) {
      state.pausedAfterGoal = 0;
      state.ended = false;
      el.matchOver.classList.remove("show");
      releaseBall();
      state.charge = 0;
      state.charging = false;

      for (const player of state.homePlayers) {
        player.position.copy(player.home);
        player.velocity.set(0, 0, 0);
        player.stamina = 1;
      }
      for (const player of state.awayPlayers) {
        player.position.copy(player.home);
        player.velocity.set(0, 0, 0);
        player.stamina = 1;
      }

      const kickoffPlayer = team === TEAM.HOME ? state.homePlayers[10] : state.awayPlayers[10];
      kickoffPlayer.position.x = team === TEAM.HOME ? -1.8 : 1.8;
      kickoffPlayer.position.z = 0;
      state.selectedIndex = team === TEAM.HOME ? kickoffPlayer.index : 7;
      ball.position.set(team === TEAM.HOME ? 0.7 : -0.7, 0.74, 0);
      ball.velocity.set(0, 0, 0);
      giveBall(kickoffPlayer);
      if (!initial) {
        showToast("Kickoff", team === TEAM.HOME ? "Sakura Blue restart" : "Koi Red restart");
      }
      updateHud();
    }

    function restartMatch() {
      state.score.home = 0;
      state.score.away = 0;
      state.timeLeft = state.matchDuration;
      resetKickoff("home", false);
    }

    function endMatch() {
      state.ended = true;
      state.timeLeft = 0;
      releaseBall();
      el.finalText.textContent = `Sakura Blue ${state.score.home} - ${state.score.away} Koi Red`;
      el.matchOver.classList.add("show");
      showToast("Full Time", `Sakura Blue ${state.score.home} - ${state.score.away} Koi Red`);
    }

    function tickCamera(dt) {
      const selected = getSelectedPlayer();
      const focus = ball.owner ? ball.owner.position : ball.position;
      tmpVec.copy(focus).lerp(selected.position, 0.35);
      state.cameraTarget.set(
        clamp(tmpVec.x - 18, -56, 36),
        46,
        clamp(tmpVec.z + 42, -6, 66)
      );
      state.cameraLook.set(clamp(tmpVec.x + 8, -36, 42), 0, clamp(tmpVec.z, -24, 24));
      camera.position.lerp(state.cameraTarget, 1 - Math.pow(0.0002, dt));
      camera.lookAt(state.cameraLook);
    }

    function updateHud() {
      el.homeScore.textContent = state.score.home;
      el.awayScore.textContent = state.score.away;
      const seconds = Math.ceil(state.timeLeft);
      const m = Math.floor(seconds / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      el.clock.textContent = `${m}:${s}`;

      const selected = getSelectedPlayer();
      el.selectedName.textContent = `Selected: ${selected.name}`;
      el.stamina.style.transform = `scaleX(${selected.stamina.toFixed(3)})`;
      el.powerFill.style.width = `${Math.round(state.charge * 100)}%`;
      el.powerText.textContent = `${Math.round(state.charge * 100)}%`;

      if (ball.owner) {
        el.possessionText.textContent = `${ball.owner.team === TEAM.HOME ? "Sakura Blue" : "Koi Red"} possession`;
      } else {
        el.possessionText.textContent = "Loose ball";
      }
    }

    function showToast(title, body) {
      el.toastTitle.textContent = title;
      el.toastBody.textContent = body;
      el.toast.classList.remove("show");
      void el.toast.offsetWidth;
      el.toast.classList.add("show");
    }

    function getMoveVector() {
      tmpVec2.set(0, 0);
      if (state.keys.has("KeyW") || state.keys.has("ArrowUp")) tmpVec2.y -= 1;
      if (state.keys.has("KeyS") || state.keys.has("ArrowDown")) tmpVec2.y += 1;
      if (state.keys.has("KeyA") || state.keys.has("ArrowLeft")) tmpVec2.x -= 1;
      if (state.keys.has("KeyD") || state.keys.has("ArrowRight")) tmpVec2.x += 1;

      const pad = navigator.getGamepads ? navigator.getGamepads()[0] : null;
      if (pad) {
        const ax = Math.abs(pad.axes[0]) > 0.15 ? pad.axes[0] : 0;
        const ay = Math.abs(pad.axes[1]) > 0.15 ? pad.axes[1] : 0;
        tmpVec2.x += ax;
        tmpVec2.y += ay;
      }

      return new THREE.Vector3(tmpVec2.x, 0, tmpVec2.y);
    }

    function isSprinting() {
      if (state.keys.has("ShiftLeft") || state.keys.has("ShiftRight")) return true;
      const pad = navigator.getGamepads ? navigator.getGamepads()[0] : null;
      return !!(pad && pad.buttons[7] && pad.buttons[7].value > 0.35);
    }

    function readGamepad() {
      const pad = navigator.getGamepads ? navigator.getGamepads()[0] : null;
      if (!pad) return;
      const pressed = pad.buttons.map((button) => button.pressed || button.value > 0.45);
      if (pressed[0] && !state.gamepadButtons[0]) switchPlayer();
      if (pressed[3] && !state.gamepadButtons[3]) passBall(false);
      if (pressed[1] && !state.gamepadButtons[1]) passBall(true);
      if (pressed[4] && !state.gamepadButtons[4]) beginCharge();
      if (!pressed[4] && state.gamepadButtons[4]) releaseShot();
      state.gamepadButtons = pressed;
    }

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    }

    function getSelectedPlayer() {
      return state.homePlayers[state.selectedIndex] || state.homePlayers[7];
    }

    function getNearest(players, point, maxDistance = Infinity) {
      let best = null;
      let bestD = maxDistance;
      for (const p of players) {
        const d = flatDistance(p.position, point);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
      return best;
    }

    function flatDistance(a, b) {
      const dx = a.x - b.x;
      const dz = a.z - b.z;
      return Math.sqrt(dx * dx + dz * dz);
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

