import footballThumb from "../assets/thumbnails/sakura-football.svg";
import pagodaThumb from "../assets/thumbnails/pagoda-rpg.svg";
import easternClashThumb from "../assets/thumbnails/eastern-clash.svg";

export const games = [
  {
    id: "eastern-clash-shadow-arena",
    title: "Eastern Clash: Shadow Arena",
    deck: "1v1 fighter",
    detail: "A moonlit Eastern martial arts duel with four fighters, two arenas, round rules, guard, throws, specials, ultimates, and NPC AI.",
    href: "/games/eastern-clash-shadow-arena/",
    thumbnail: easternClashThumb,
    accent: "#b73a2f",
    secondary: "#d9ad58",
    stat: "1v1"
  },
  {
    id: "sakura-football",
    title: "Sakura Brick 11v11 Football",
    deck: "Team sport",
    detail: "Full-pitch voxel football with AI opponents, shot charge, sprinting, passing, and a match clock.",
    href: "/games/sakura-football/",
    thumbnail: footballThumb,
    accent: "#2f7df6",
    secondary: "#f3c944",
    stat: "11v11"
  },
  {
    id: "voxel-pagoda-rpg",
    title: "Voxel Sakura Pagoda RPG",
    deck: "Action RPG",
    detail: "A garden combat diorama with destructible objects, enemy waves, rolling, jumping, and slash attacks.",
    href: "/games/voxel-pagoda-rpg/",
    thumbnail: pagodaThumb,
    accent: "#d22f20",
    secondary: "#2eb07f",
    stat: "100 foes"
  },
  {
    id: "natural-ui",
    title: "Natural UI: Tearable Layers",
    deck: "Interaction study",
    detail: "A touch-friendly cloth tearing interaction that peels layered character images with a WASM cloth simulation.",
    href: "/games/naturalUI/",
    thumbnail: "/games/naturalUI/assets/layers/layer-001.jpg",
    accent: "#6b5cff",
    secondary: "#f1d7a8",
    stat: "WASM"
  }
];
