# pixel-world-for-marinara work log

Repo: https://github.com/yuseo-yang/pixel-world-for-marinara (public, GitHub Pages from `main`) — live: https://yuseo-yang.github.io/pixel-world-for-marinara/
Earlier notes (island + first house versions): `D:\1work\pixel-island\work-log\pixel-house.md`

## 2026-10-02 / 03
- Island (`island.html`) -> interior dollhouse (kitchen / living / bedroom / bathroom). Side menu (friends, character creator, scene tester, settings). Creator: 7 hairs, 4 tops, 3 bottoms, 3 hats, colour swatches + pickers.
- Sprites: upright yaw-only quads (LEAN=0.3), dedicated seated frame, tub/sofa/chair heights tied to furniture tops.
- Furniture is data: `CATALOG` (look + footprint + slots) + `LAYOUT` (placements) -> `rebuildFurniture()`; edit API `move/add/remove` (no editor UI yet, layout not persisted).
- Structure: `index.html` shell + `src/app.js` (`mount(host)` in Shadow DOM). `marinara-extension/` bundles app + three.js with esbuild (`npm run build:ext` -> `pixel-world.personal-extension.zip`).
- Marinara facts (read from source): CSP `frame-src 'self'` blocks iframes, COOP blocks popups -> embed the app inside the extension (full_page_access). Tracker data: `GET /api/chats/:id/game-state`; Custom Tracker rows live in `playerStats.customTrackerFields` ("미나 자세", "Dick Grayson · 자세"); per-character fields in `presentCharacters[].customFields`.
- Story/tracker reading: sentence -> who + action + place (식탁/침대/소파/욕조/거실...). Adult words -> two characters stand close with a "19♥" bubble (nothing drawn). Words are hand-written lists in `src/app.js` (ACTION_WORDS, PLACES, NSFW_WORDS).
- Background: sky/clouds removed; plain colour / image (cover or tiled) composited in the last pass. Gotcha: UnrealBloomPass forces alpha=1 -> bloom blendMaterial patched to keep dst alpha. No MSAA (FXAA instead).
- Performance: static shadow map, quality low/mid/high, DOM updates on change only, pause when minimised, slower walking.
- Verified: loads under a Marinara-like CSP (tools/csp-harness.html + mock tracker), keyword/place interpretation, furniture move, background colour/tile. NOT verified: real FPS (preview pane throttles rAF), real Marinara import beyond the first run (user confirmed it renders), night/day lighting after the background change, small screens.
- Open ideas: furniture edit UI + persistence, user-extendable keyword lists, auto-find the active chat id in Marinara (currently latest chat or manual id), sprite lean slider.
- Repo has an untracked leftover `pixel-world-test.personal-extension.zip` (old test build) — safe to delete.
