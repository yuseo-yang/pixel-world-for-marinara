# pixel-world-for-marinara

Voxel pixel-art house where tiny pixel characters live. Runs standalone in a browser **or** inside
[Marinara Engine](https://github.com/Pasta-Devs/Marinara-Engine) as an extension that reads the **Character Tracker**.

- Live: https://yuseo-yang.github.io/pixel-world-for-marinara/
- `index.html` + `src/app.js` — the app (three.js from CDN when standalone)
- `island.html` — earlier floating-island scene
- `marinara-extension/` — Marinara extension (floating window + tracker reader); `npm run build:ext` bundles everything
  (three.js included, because Marinara's CSP only allows its own scripts) into `pixel-world.personal-extension.zip`

## Use inside Marinara
1. Allow external extensions: env `ENABLE_EXTERNAL_EXTENSIONS=true`, and Settings > Advanced > Danger Zone > third-party imports.
2. Import `pixel-world.personal-extension.zip`, check the code fingerprint, approve (it needs `full_page_access`).
3. In your roleplay chat, add a **Character Tracker** custom field named `행동` (or `자세`, `상태`, `action`, `pose`, `activity`, `posture`)
   that summarises what the character is doing right now, e.g. "소파에서 TV를 보는 중".
4. The extension polls `GET /api/chats/<chatId>/game-state` every few seconds, reads that field per character,
   turns the sentence into an action (sleep / tv / cook / eat / bath / wash / read / view / dress / out / chat / goto_*) and the
   matching pixel character does it. Characters that are not on the island yet are added automatically.

## Control from code
`window.pixelWorld` (extension) / `window.house` (standalone): `do(who, action)`, `interpret(text)`, `applyStory(text)`,
`addByName(name)`, `layout`, `move/add/remove` (furniture). `postMessage({type:'scene', who, action})` and
`postMessage({type:'story', text})` also work on the standalone page.

## Dev
`python -m http.server 5196` then open `index.html`. `tools/csp-harness.html` loads the built extension under a CSP like Marinara's, with a fake tracker API.
