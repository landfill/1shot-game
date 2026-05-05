import { games } from "./data/games.js";
import "./styles/main.css";

const app = document.querySelector("#app");

function renderGameCard(game, index) {
  return `
    <article class="game-card" style="--accent: ${game.accent}; --secondary: ${game.secondary}; --delay: ${index * 90}ms">
      <a class="thumb-link" href="${game.href}" aria-label="Open ${game.title}">
        <img class="game-thumb" src="${game.thumbnail}" alt="">
      </a>
      <div class="game-copy">
        <div class="game-meta">
          <span>${game.deck}</span>
          <b>${game.stat}</b>
        </div>
        <h2>${game.title}</h2>
        <p>${game.detail}</p>
        <a class="play-link" href="${game.href}">
          <span>Play</span>
          <span aria-hidden="true">></span>
        </a>
      </div>
    </article>
  `;
}

app.innerHTML = `
  <section class="masthead">
    <div>
      <p class="eyebrow">Toy Arcade</p>
      <h1>Two handmade voxel games in one cabinet.</h1>
    </div>
    <p class="mast-copy">A stadium under sakura lights and a shrine garden brawl, framed as two quick cabinets for the same shelf.</p>
  </section>
  <section class="game-grid" aria-label="Game library">
    ${games.map(renderGameCard).join("")}
  </section>
`;
