import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

global.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = `data:application/octet-stream;base64,${Buffer.from(buffer).toString("base64")}`;
      this.onloadend?.();
    });
  }
};

const outputPath = "src/assets/characters/eastern-clash/rigs/eastern-humanoid.glb";
const skin = new THREE.MeshStandardMaterial({ color: 0xc99672, roughness: 0.72 });
const cloth = new THREE.MeshStandardMaterial({ color: 0x283955, roughness: 0.82 });
const dark = new THREE.MeshStandardMaterial({ color: 0x12151d, roughness: 0.86 });
const accent = new THREE.MeshStandardMaterial({ color: 0xb3342a, roughness: 0.68 });
const metal = new THREE.MeshStandardMaterial({ color: 0xd6dde3, roughness: 0.38, metalness: 0.28 });
const wood = new THREE.MeshStandardMaterial({ color: 0x8a552e, roughness: 0.6 });

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const sphereGeo = new THREE.SphereGeometry(0.5, 24, 16);
const cylGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 18);

function node(name, parent, x, y, z) {
  const group = new THREE.Group();
  group.name = name;
  group.position.set(x, y, z);
  parent.add(group);
  return group;
}

function mesh(name, parent, geometry, material, x, y, z, sx, sy, sz) {
  const item = new THREE.Mesh(geometry, material);
  item.name = `${name}Mesh`;
  item.position.set(x, y, z);
  item.scale.set(sx, sy, sz);
  item.castShadow = true;
  item.receiveShadow = true;
  parent.add(item);
  return item;
}

const root = new THREE.Group();
root.name = "EasternHumanoidRig";

const hips = node("Hips", root, 0, 1.02, 0);
mesh("Hips", hips, boxGeo, dark, 0, 0, 0, 0.72, 0.42, 0.38);

const torso = node("Torso", root, 0, 1.64, 0);
mesh("Torso", torso, boxGeo, cloth, 0, 0, 0, 0.9, 0.98, 0.46);
mesh("ChestAccent", torso, boxGeo, accent, 0, 0.34, 0.03, 0.96, 0.16, 0.5);

const neck = node("Neck", root, 0, 2.24, 0);
mesh("Neck", neck, cylGeo, skin, 0, 0, 0, 0.18, 0.24, 0.18);
const head = node("Head", root, 0, 2.64, 0);
mesh("Head", head, sphereGeo, skin, 0, 0, 0, 0.42, 0.52, 0.38);
mesh("Hair", head, boxGeo, dark, 0, 0.3, -0.04, 0.48, 0.16, 0.42);

const armL = node("ArmL", root, -0.58, 2.08, 0);
mesh("ArmL", armL, boxGeo, cloth, 0, -0.36, 0, 0.22, 0.72, 0.22);
const foreL = node("ForeL", armL, 0, -0.72, 0.03);
mesh("ForeL", foreL, boxGeo, skin, 0, -0.34, 0, 0.18, 0.68, 0.18);
const handL = node("HandL", foreL, 0, -0.7, 0.02);
mesh("HandL", handL, sphereGeo, skin, 0, 0, 0, 0.18, 0.16, 0.18);

const armR = node("ArmR", root, 0.58, 2.08, 0);
mesh("ArmR", armR, boxGeo, cloth, 0, -0.36, 0, 0.22, 0.72, 0.22);
const foreR = node("ForeR", armR, 0, -0.72, 0.03);
mesh("ForeR", foreR, boxGeo, skin, 0, -0.34, 0, 0.18, 0.68, 0.18);
const handR = node("HandR", foreR, 0, -0.7, 0.02);
mesh("HandR", handR, sphereGeo, skin, 0, 0, 0, 0.18, 0.16, 0.18);

const legL = node("LegL", root, -0.28, 0.98, 0);
mesh("LegL", legL, boxGeo, dark, 0, -0.42, 0, 0.24, 0.84, 0.24);
const shinL = node("ShinL", legL, 0, -0.82, 0.02);
mesh("ShinL", shinL, boxGeo, dark, 0, -0.38, 0, 0.2, 0.76, 0.2);
const footL = node("FootL", shinL, 0, -0.78, 0.16);
mesh("FootL", footL, boxGeo, dark, 0, 0, 0.12, 0.28, 0.12, 0.46);

const legR = node("LegR", root, 0.28, 0.98, 0);
mesh("LegR", legR, boxGeo, dark, 0, -0.42, 0, 0.24, 0.84, 0.24);
const shinR = node("ShinR", legR, 0, -0.82, 0.02);
mesh("ShinR", shinR, boxGeo, dark, 0, -0.38, 0, 0.2, 0.76, 0.2);
const footR = node("FootR", shinR, 0, -0.78, 0.16);
mesh("FootR", footR, boxGeo, dark, 0, 0, 0.12, 0.28, 0.12, 0.46);

const sword = node("WeaponSword", handR, 0, -0.18, 0.42);
mesh("WeaponSword", sword, boxGeo, metal, 0, -0.56, 0, 0.08, 0.08, 1.55);
const staff = node("WeaponStaff", handR, 0, -0.18, 0.22);
mesh("WeaponStaff", staff, cylGeo, wood, 0, -0.72, 0, 0.06, 2.2, 0.06);
staff.rotation.x = Math.PI / 2;
const daggerL = node("WeaponDaggerL", handL, -0.02, -0.15, 0.25);
mesh("WeaponDaggerL", daggerL, boxGeo, metal, 0, -0.28, 0, 0.06, 0.08, 0.62);
const daggerR = node("WeaponDaggerR", handR, 0.02, -0.15, 0.25);
mesh("WeaponDaggerR", daggerR, boxGeo, metal, 0, -0.28, 0, 0.06, 0.08, 0.62);

function n(target, prop, times, values) {
  return new THREE.NumberKeyframeTrack(`${target.name}.${prop}`, times, values);
}

function clip(name, duration, tracks) {
  return new THREE.AnimationClip(name, duration, tracks);
}

function attackTimes(duration) {
  return [0, duration * 0.32, duration * 0.58, duration];
}

const animations = [
  clip("idle", 1.2, [
    n(torso, "rotation[z]", [0, 0.6, 1.2], [-0.025, 0.025, -0.025]),
    n(head, "rotation[x]", [0, 0.6, 1.2], [0.02, -0.03, 0.02]),
    n(armL, "rotation[z]", [0, 0.6, 1.2], [-0.28, -0.34, -0.28]),
    n(armR, "rotation[z]", [0, 0.6, 1.2], [0.28, 0.34, 0.28])
  ]),
  clip("walk", 0.65, [
    n(legL, "rotation[x]", [0, 0.325, 0.65], [0.46, -0.46, 0.46]),
    n(legR, "rotation[x]", [0, 0.325, 0.65], [-0.46, 0.46, -0.46]),
    n(shinL, "rotation[x]", [0, 0.325, 0.65], [0.1, 0.42, 0.1]),
    n(shinR, "rotation[x]", [0, 0.325, 0.65], [0.42, 0.1, 0.42]),
    n(armL, "rotation[x]", [0, 0.325, 0.65], [-0.2, 0.38, -0.2]),
    n(armR, "rotation[x]", [0, 0.325, 0.65], [0.38, -0.2, 0.38])
  ]),
  clip("dash", 0.38, [
    n(torso, "rotation[z]", [0, 0.19, 0.38], [-0.16, -0.22, -0.16]),
    n(armL, "rotation[x]", [0, 0.19, 0.38], [0.25, -0.45, 0.25]),
    n(armR, "rotation[x]", [0, 0.19, 0.38], [-0.55, 0.2, -0.55]),
    n(legL, "rotation[x]", [0, 0.19, 0.38], [0.6, -0.4, 0.6]),
    n(legR, "rotation[x]", [0, 0.19, 0.38], [-0.45, 0.62, -0.45])
  ]),
  clip("guard", 0.5, [
    n(armL, "rotation[x]", [0, 0.12, 0.5], [-0.7, -1.05, -1.05]),
    n(armR, "rotation[x]", [0, 0.12, 0.5], [-0.7, -1.1, -1.1]),
    n(foreL, "rotation[x]", [0, 0.12, 0.5], [-0.55, -0.22, -0.22]),
    n(foreR, "rotation[x]", [0, 0.12, 0.5], [-0.55, -0.18, -0.18])
  ]),
  clip("hit", 0.32, [
    n(torso, "rotation[x]", [0, 0.12, 0.32], [-0.08, -0.34, -0.08]),
    n(head, "rotation[x]", [0, 0.12, 0.32], [-0.02, -0.24, -0.02]),
    n(armL, "rotation[x]", [0, 0.12, 0.32], [0.1, 0.45, 0.1]),
    n(armR, "rotation[x]", [0, 0.12, 0.32], [0.1, 0.48, 0.1])
  ]),
  clip("knockdown", 0.7, [
    n(torso, "rotation[x]", [0, 0.26, 0.7], [-0.2, -1.0, -1.0]),
    n(head, "rotation[x]", [0, 0.26, 0.7], [-0.12, -0.5, -0.5]),
    n(legL, "rotation[x]", [0, 0.26, 0.7], [0.2, 0.8, 0.8]),
    n(legR, "rotation[x]", [0, 0.26, 0.7], [-0.1, 0.3, 0.3])
  ])
];

function attackClip(name, duration, pose) {
  const t = attackTimes(duration);
  const tracks = [
    n(torso, "rotation[y]", t, pose.torsoY),
    n(torso, "rotation[z]", t, pose.torsoZ),
    n(armR, "rotation[x]", t, pose.armRX),
    n(armR, "rotation[z]", t, pose.armRZ),
    n(foreR, "rotation[x]", t, pose.foreRX),
    n(handR, "rotation[z]", t, pose.handRZ),
    n(armL, "rotation[x]", t, pose.armLX),
    n(legR, "rotation[x]", t, pose.legRX),
    n(shinR, "rotation[x]", t, pose.shinRX),
    n(footR, "rotation[z]", t, pose.footRZ)
  ];
  if (pose.weaponRZ) {
    tracks.push(n(sword, "rotation[z]", t, pose.weaponRZ));
    tracks.push(n(staff, "rotation[z]", t, pose.weaponRZ));
    tracks.push(n(daggerR, "rotation[z]", t, pose.weaponRZ));
  }
  animations.push(clip(name, duration, tracks));
}

attackClip("light", 0.33, {
  torsoY: [0, -0.12, -0.2, 0],
  torsoZ: [0, -0.04, -0.08, 0],
  armRX: [0.18, -1.05, -0.32, 0.18],
  armRZ: [0.28, 0.55, 0.18, 0.28],
  foreRX: [-0.7, -0.2, -0.08, -0.7],
  handRZ: [0, -0.12, 0.08, 0],
  armLX: [0.18, -0.18, 0.1, 0.18],
  legRX: [0.04, 0.02, -0.08, 0.04],
  shinRX: [0, 0.04, 0.02, 0],
  footRZ: [0, 0.02, -0.04, 0],
  weaponRZ: [0, 0.28, -0.18, 0]
});

attackClip("low", 0.42, {
  torsoY: [0, -0.06, -0.14, 0],
  torsoZ: [0, 0.12, 0.18, 0],
  armRX: [0.18, -0.4, -0.18, 0.18],
  armRZ: [0.28, 0.35, 0.2, 0.28],
  foreRX: [-0.7, -0.42, -0.25, -0.7],
  handRZ: [0, 0.03, 0.08, 0],
  armLX: [0.18, -0.25, -0.12, 0.18],
  legRX: [0.04, -0.86, -1.2, 0.04],
  shinRX: [0, 0.55, 0.22, 0],
  footRZ: [0, -0.28, -0.38, 0],
  weaponRZ: [0, -0.18, -0.28, 0]
});

attackClip("heavy", 0.63, {
  torsoY: [0, 0.24, -0.42, 0],
  torsoZ: [0, 0.08, -0.16, 0],
  armRX: [0.18, -1.42, -0.18, 0.18],
  armRZ: [0.28, 0.76, 0.08, 0.28],
  foreRX: [-0.7, -0.24, 0.08, -0.7],
  handRZ: [0, -0.2, 0.16, 0],
  armLX: [0.18, -0.65, -0.28, 0.18],
  legRX: [0.04, -0.1, 0.18, 0.04],
  shinRX: [0, 0.14, 0.08, 0],
  footRZ: [0, -0.06, 0.1, 0],
  weaponRZ: [0, 0.55, -0.36, 0]
});

attackClip("jumpHeavy", 0.59, {
  torsoY: [0, 0.14, -0.3, 0],
  torsoZ: [0, -0.08, -0.2, 0],
  armRX: [0.18, -0.8, -0.25, 0.18],
  armRZ: [0.28, 0.5, 0.2, 0.28],
  foreRX: [-0.7, -0.25, -0.08, -0.7],
  handRZ: [0, -0.12, 0.08, 0],
  armLX: [0.18, -0.32, -0.18, 0.18],
  legRX: [0.04, -0.4, -1.12, 0.04],
  shinRX: [0, 0.2, 0.1, 0],
  footRZ: [0, 0.22, 0.34, 0],
  weaponRZ: [0, 0.32, -0.12, 0]
});

attackClip("rush", 0.57, {
  torsoY: [0, 0.26, -0.5, 0],
  torsoZ: [0, -0.14, -0.24, 0],
  armRX: [0.18, -1.36, -0.08, 0.18],
  armRZ: [0.28, 0.68, -0.02, 0.28],
  foreRX: [-0.7, -0.18, 0.12, -0.7],
  handRZ: [0, -0.22, 0.2, 0],
  armLX: [0.18, -0.5, -0.24, 0.18],
  legRX: [0.04, 0.42, -0.25, 0.04],
  shinRX: [0, 0.16, 0.34, 0],
  footRZ: [0, 0.1, -0.08, 0],
  weaponRZ: [0, 0.5, -0.42, 0]
});

attackClip("chain", 0.51, {
  torsoY: [0, -0.28, 0.38, 0],
  torsoZ: [0, -0.08, 0.16, 0],
  armRX: [0.18, -0.7, -1.2, 0.18],
  armRZ: [0.28, -0.22, 0.64, 0.28],
  foreRX: [-0.7, -0.3, -0.04, -0.7],
  handRZ: [0, 0.16, -0.18, 0],
  armLX: [0.18, -0.9, -0.32, 0.18],
  legRX: [0.04, 0.12, -0.12, 0.04],
  shinRX: [0, 0.06, 0.1, 0],
  footRZ: [0, 0.08, -0.06, 0],
  weaponRZ: [0, -0.36, 0.46, 0]
});

attackClip("grab", 0.53, {
  torsoY: [0, 0.04, -0.08, 0],
  torsoZ: [0, -0.08, -0.1, 0],
  armRX: [0.18, -0.95, -1.2, 0.18],
  armRZ: [0.28, 0.48, 0.62, 0.28],
  foreRX: [-0.7, -0.14, -0.08, -0.7],
  handRZ: [0, -0.05, 0.04, 0],
  armLX: [0.18, -0.95, -1.18, 0.18],
  legRX: [0.04, -0.04, 0.08, 0.04],
  shinRX: [0, 0.05, 0.04, 0],
  footRZ: [0, -0.04, 0.06, 0],
  weaponRZ: [0, 0.08, 0.12, 0]
});

attackClip("special", 0.69, {
  torsoY: [0, 0.42, -0.58, 0],
  torsoZ: [0, 0.08, -0.2, 0],
  armRX: [0.18, -1.22, -0.12, 0.18],
  armRZ: [0.28, 0.8, -0.12, 0.28],
  foreRX: [-0.7, -0.12, 0.18, -0.7],
  handRZ: [0, -0.26, 0.24, 0],
  armLX: [0.18, -0.95, -0.4, 0.18],
  legRX: [0.04, 0.14, -0.18, 0.04],
  shinRX: [0, 0.12, 0.12, 0],
  footRZ: [0, 0.08, -0.08, 0],
  weaponRZ: [0, 0.78, -0.62, 0]
});

attackClip("ultimate", 0.96, {
  torsoY: [0, 0.74, -0.82, 0],
  torsoZ: [0, -0.18, 0.24, 0],
  armRX: [0.18, -1.48, -0.04, 0.18],
  armRZ: [0.28, 0.9, -0.2, 0.28],
  foreRX: [-0.7, -0.08, 0.22, -0.7],
  handRZ: [0, -0.38, 0.34, 0],
  armLX: [0.18, -1.32, -0.7, 0.18],
  legRX: [0.04, 0.3, -0.42, 0.04],
  shinRX: [0, 0.24, 0.28, 0],
  footRZ: [0, 0.14, -0.16, 0],
  weaponRZ: [0, 1.05, -0.82, 0]
});

await mkdir(dirname(outputPath), { recursive: true });

const exporter = new GLTFExporter();
await new Promise((resolve, reject) => {
  exporter.parse(
    root,
    async (result) => {
      try {
        await writeFile(outputPath, Buffer.from(result));
        console.log(`Wrote ${outputPath} (${result.byteLength} bytes)`);
        resolve();
      } catch (error) {
        reject(error);
      }
    },
    reject,
    { binary: true }
  );
});
