# pixel-world-for-marinara

Voxel pixel-art world where tiny pixel characters live. Plain HTML + three.js (CDN), no build step.

- `index.html` — the house (kitchen / living room / bedroom / bathroom), side menu, character creator
- `island.html` — the earlier floating-island scene

Control from outside (e.g. a Marinara extension): `window.postMessage({ type: 'scene', who: '모리', action: 'sleep' }, '*')`
Actions: sleep, tv, cook, eat, bath, wash, read, view, dress, out, chat, goto_kitchen / goto_living / goto_bedroom / goto_bath
