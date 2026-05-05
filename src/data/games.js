import footballThumb from "../assets/thumbnails/sakura-football.svg";
import pagodaThumb from "../assets/thumbnails/pagoda-rpg.svg";

export const games = [
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
  }
];
