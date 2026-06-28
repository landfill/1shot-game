# Toy Arcade

Vite 기반 멀티 페이지 게임 런처입니다. 메인 페이지에서 Three.js 게임을 썸네일로 선택해 각각의 게임 페이지로 진입합니다.

## Games

- Sakura Brick 11v11 Football: `/games/sakura-football/`
- Voxel Sakura Pagoda RPG: `/games/voxel-pagoda-rpg/`
- Eastern Clash: Shadow Arena: `/games/eastern-clash-shadow-arena/`
- Natural UI: Tearable Layers: `/games/naturalUI/`
- Vibe Fighter: `/games/vibe-fighter/`
- Hero Quest: `/games/hero-quest/`

Eastern Clash uses image-generated realistic side-facing character cutouts under `src/assets/characters/eastern-clash/` as the visible fighter layer, while the Three.js game loop keeps lightweight procedural hitboxes and strike effects for browser performance.

## Requirements

- Node.js 22 이상 권장
- npm

## Setup

```bash
npm install
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

`npm run dev`는 로컬 개발 서버를 실행합니다. 기본 호스트는 `127.0.0.1`이며, Vite가 사용 가능한 포트를 선택합니다.

## Project Structure

```text
.
├── index.html
├── games/
│   ├── sakura-football/
│   │   └── index.html
│   ├── eastern-clash-shadow-arena/
│   │   └── index.html
│   ├── voxel-pagoda-rpg/
│   │   └── index.html
│   ├── naturalUI/
│   │   ├── index.html
│   │   └── assets/
│   ├── vibe-fighter/
│   │   ├── index.html
│   │   ├── assets/
│   │   └── configs/
│   └── hero-quest/
│       ├── index.html
│       ├── game.js
│       ├── style.css
│       └── assets/
├── src/
│   ├── assets/thumbnails/
│   ├── data/games.js
│   ├── games/
│   │   ├── sakura-football/
│   │   │   ├── game.css
│   │   │   └── game.js
│   │   ├── eastern-clash-shadow-arena/
│   │   │   ├── game.css
│   │   │   └── game.js
│   │   └── voxel-pagoda-rpg/
│   │       ├── game.css
│   │       └── game.js
│   ├── main.js
│   └── styles/
└── vite.config.js
```

## Notes

- `index.html`은 게임 선택용 메인 런처입니다.
- 각 게임은 별도 HTML, CSS, JavaScript 파일로 분리되어 유지보수 범위를 좁힙니다.
- `games/naturalUI/`, `games/vibe-fighter/`, `games/hero-quest/`는 이미 빌드된 정적 앱이므로 Vite build 후 `dist/games/`로 그대로 복사됩니다.
- `vibe-fighter-main/`은 Vibe Fighter의 원본 Phaser/Vite 프로젝트입니다. 하위 게임 경로에 배포할 때는 이 프로젝트를 빌드해 `games/vibe-fighter/`를 갱신합니다.
- `hero-quest-main/`은 Hero Quest 에셋팩입니다. `games/hero-quest/`는 해당 에셋을 사용하는 정적 Canvas 게임입니다.
- `voxel-pagoda-rpg.html`은 기존 직접 접근 경로를 새 RPG 게임 경로로 넘기는 호환용 리다이렉트 페이지입니다.
