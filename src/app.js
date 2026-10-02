import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const CSS = `.pw { position: relative; width: 100%; height: 100%; overflow: hidden; background: #2a1d4a; color: #fff; font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; }

  .pw { --bg: rgba(36,22,60,.82); --bd: rgba(255,255,255,.35); --ac: #ffaa64; }
  
  canvas.gl { display: block; }
  button { font: inherit; color: inherit; cursor: pointer; }
  #rail { position: absolute; left: 0; top: 0; bottom: 0; width: 56px; background: rgba(28,16,48,.88); border-right: 2px solid var(--bd); display: flex; flex-direction: column; align-items: center; padding-top: 10px; gap: 6px; z-index: 5; }
  #rail .logo { font-weight: 800; font-size: 11px; letter-spacing: .05em; margin-bottom: 8px; opacity: .85; text-align: center; line-height: 1.1; }
  #rail button { width: 44px; height: 48px; background: transparent; border: 2px solid transparent; font-size: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; }
  #rail button span { font-size: 10px; font-weight: 700; opacity: .85; }
  #rail button:hover { background: rgba(255,255,255,.08); }
  #rail button.on { background: rgba(255,170,100,.9); border-color: #fff; color: #3a1f4a; }
  #panel { position: absolute; left: 56px; top: 0; bottom: 0; width: 340px; background: var(--bg); border-right: 2px solid var(--bd); backdrop-filter: blur(6px); transform: translateX(-110%); transition: transform .22s; z-index: 4; overflow-y: auto; padding: 14px 16px 30px; box-sizing: border-box; }
  #panel.open { transform: none; }
  #panel h2 { margin: 0 0 12px; font-size: 16px; letter-spacing: .04em; }
  #panel h3 { margin: 16px 0 6px; font-size: 12px; opacity: .8; font-weight: 700; }
  .sec { display: none; } .sec.on { display: block; }
  .row { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
  .chip { background: rgba(255,255,255,.08); border: 2px solid var(--bd); padding: 4px 9px; font-size: 12px; font-weight: 700; }
  .chip.on { background: var(--ac); color: #3a1f4a; border-color: #fff; }
  .chip.dis { opacity: .35; pointer-events: none; }
  .sw { width: 22px; height: 22px; border: 2px solid rgba(255,255,255,.4); padding: 0; }
  .sw.on { border-color: #fff; outline: 2px solid var(--ac); }
  input[type=color] { width: 28px; height: 26px; padding: 0; border: 2px solid var(--bd); background: none; }
  input[type=text], select { background: rgba(0,0,0,.3); color: #fff; border: 2px solid var(--bd); padding: 5px 8px; font: inherit; font-size: 13px; width: 100%; box-sizing: border-box; }
  .btn { background: var(--ac); color: #3a1f4a; border: 2px solid #fff; padding: 7px 14px; font-weight: 800; font-size: 13px; }
  .btn.sub { background: rgba(255,255,255,.1); color: #fff; border-color: var(--bd); }
  .btn.danger { background: #c4402e; color: #fff; }
  #previews { display: flex; gap: 8px; justify-content: center; background: rgba(0,0,0,.28); border: 2px solid var(--bd); padding: 10px 6px 6px; margin-bottom: 10px; }
  #previews div { text-align: center; font-size: 10px; opacity: .85; } #previews canvas { image-rendering: pixelated; display: block; margin: 0 auto 2px; }
  .card { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,.07); border: 2px solid var(--bd); padding: 6px 8px; margin-bottom: 7px; cursor: pointer; }
  .card.sel { border-color: var(--ac); background: rgba(255,170,100,.15); }
  .card canvas { image-rendering: pixelated; width: 36px; height: 44px; } .card .t { flex: 1; font-size: 13px; font-weight: 700; } .card .t small { display: block; font-weight: 400; font-size: 11px; opacity: .8; }
  .card button { padding: 3px 7px; font-size: 11px; background: rgba(255,255,255,.1); border: 2px solid var(--bd); }
  label.tg { display: flex; justify-content: space-between; align-items: center; font-size: 13px; padding: 6px 0; } label.tg input { width: 18px; height: 18px; }
  input[type=range] { width: 100%; }
  #toast { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%); background: var(--bg); border: 2px solid var(--bd); padding: 8px 16px; font-size: 13px; opacity: 0; transition: opacity .25s; z-index: 6; pointer-events: none; }
  #bubbles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .bubble { position: absolute; transform: translate(-50%, -100%); background: #fff; color: #2b1d33; font-size: 12px; font-weight: 700; padding: 3px 7px; border: 2px solid #2b1d33; box-shadow: 0 2px 0 rgba(0,0,0,.25); white-space: nowrap; opacity: 0; transition: opacity .25s; }
  .bubble::after { content: ""; position: absolute; left: 50%; bottom: -7px; margin-left: -4px; border: 4px solid transparent; border-top-color: #2b1d33; }
  .bubble.show { opacity: 1; } .pw.nobubble .bubble { display: none; }
  .name { position: absolute; transform: translate(-50%, 0); font-size: 11px; font-weight: 700; text-shadow: 0 1px 0 #2b1d33, 0 0 4px #2b1d33; opacity: 0; transition: opacity .2s; white-space: nowrap; }
  .name.show { opacity: .95; }
  #roomtags .rt { position: absolute; transform: translate(-50%, -50%); font-size: 12px; font-weight: 800; letter-spacing: .12em; padding: 2px 8px; background: rgba(28,16,48,.55); border: 2px solid rgba(255,255,255,.3); opacity: .85; pointer-events: none; }
  .pw.noroomtag #roomtags { display: none; }
`;
const HTML = `<div class="pw"><canvas id="gl" class="gl"></canvas>
<div id="bubbles"></div><div id="roomtags" style="position:absolute;inset:0;pointer-events:none"></div>

<div id="rail">
  <div class="logo">PIXEL<br>HOUSE</div>
  <button data-p="cast">👥<span>친구들</span></button>
  <button data-p="create">✨<span>캐릭터</span></button>
  <button data-p="scene">🎬<span>장면</span></button>
  <button data-p="settings">⚙️<span>설정</span></button>
</div>

<div id="panel">
  <div class="sec" id="s-cast">
    <h2>👥 친구들</h2>
    <div id="castList"></div>
    <button class="btn" id="newChar" style="width:100%;margin-top:6px">＋ 새 캐릭터 만들기</button>
  </div>

  <div class="sec" id="s-create">
    <h2 id="createTitle">✨ 캐릭터 만들기</h2>
    <div id="previews"><div><canvas id="pv0"></canvas>앞</div><div><canvas id="pv1"></canvas>걷기</div><div><canvas id="pv2"></canvas>뒤</div></div>
    <input type="text" id="cName" maxlength="8" placeholder="이름 (최대 8자)">
    <h3>헤어스타일</h3><div class="row" id="o-hairStyle"></div>
    <h3>머리 색</h3><div class="row" id="o-hair"></div>
    <h3>눈 색</h3><div class="row" id="o-eye"></div>
    <h3>피부색</h3><div class="row" id="o-skin"></div>
    <h3>상의</h3><div class="row" id="o-top"></div>
    <h3>상의 색</h3><div class="row" id="o-topC"></div>
    <h3>하의 <small id="dressNote" style="opacity:.7"></small></h3><div class="row" id="o-bottom"></div>
    <h3>하의 색</h3><div class="row" id="o-botC"></div>
    <h3>모자</h3><div class="row" id="o-hat"></div>
    <h3>모자 색</h3><div class="row" id="o-hatC"></div>
    <div class="row" style="margin-top:18px">
      <button class="btn" id="cSave">집에 추가하기</button>
      <button class="btn sub" id="cRand">🎲 랜덤</button>
      <button class="btn sub" id="cCancel">취소</button>
    </div>
  </div>

  <div class="sec" id="s-scene">
    <h2>🎬 장면 테스트</h2>
    <h3>누구에게?</h3><select id="sceneWho"></select>
    <h3>이동</h3><div class="row" id="sceneGo"></div>
    <h3>장소 (선택)</h3><select id="scenePlace"></select>
    <h3>행동</h3><div class="row" id="sceneAct"></div>
    <h3>이야기 읽기 테스트</h3>
    <textarea id="storyIn" rows="4" placeholder="예) 모리는 소파에 앉아 TV를 봤다. 별이는 졸려서 침대로 갔다." style="width:100%;box-sizing:border-box;background:rgba(0,0,0,.3);color:#fff;border:2px solid var(--bd);padding:6px 8px;font:inherit;font-size:13px;resize:vertical"></textarea>
    <div class="row" style="margin-top:6px"><button class="btn" id="storyGo">읽고 반응하기</button><button class="btn sub" id="storyEx">예시 넣기</button></div>
    <div id="storyOut" style="margin-top:8px;font-size:12px;line-height:1.55"></div>
    <p style="font-size:11px;opacity:.7;margin-top:16px;line-height:1.5">나중에 마리나라 확장에서 <code>postMessage({type:'scene', who:'모리', action:'sleep'})</code> 로 같은 명령을 보낼 수 있게 해 둔 자리예요.</p>
  </div>

  <div class="sec" id="s-settings">
    <h2>⚙️ 설정</h2>
    <h3>시간대</h3><div class="row" id="setTod"></div>
    <h3>표시</h3>
    <label class="tg">말풍선<input type="checkbox" id="setBubble" checked></label>
    <label class="tg">방 이름표<input type="checkbox" id="setRoomTag" checked></label>
    <label class="tg">이름표 항상 보기<input type="checkbox" id="setNames"></label>
    <label class="tg">빛 번짐(블룸)<input type="checkbox" id="setBloom" checked></label>
    <h3>움직임</h3>
    <label class="tg">스스로 움직이기<input type="checkbox" id="setAuto" checked></label>
    <label class="tg">카메라 천천히 회전<input type="checkbox" id="setRotate"></label>
    <div style="font-size:12px;margin-top:8px">걷는 속도 <span id="spdVal">1.0</span>×</div><input type="range" id="setSpeed" min="0.5" max="2.5" step="0.1" value="1">
    <h3>데이터</h3>
    <div class="row"><button class="btn sub" id="resetCast">기본 캐릭터로 되돌리기</button></div>
  </div>
</div>
<div id="toast"></div></div>`;

export function mount(host, opts = {}) {
  const sr = host.shadowRoot || host.attachShadow({ mode: 'open' });
  sr.innerHTML = `<style>${CSS}</style>${HTML}`;
  const R = sr.querySelector('.pw'), $ = (s) => sr.querySelector(s), $$ = (s) => sr.querySelectorAll(s);
  const VW = () => R.clientWidth || 800, VH = () => R.clientHeight || 450;
  let alive = true;


// =====================================================================
// utils
// =====================================================================
const S = 0.5;
function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(21);
const pick = (a, r = Math.random) => a[Math.floor(r() * a.length)];
function hash(i, j, s = 0) { let h = Math.imul(i | 0, 374761393) ^ Math.imul(j | 0, 668265263) ^ Math.imul((s | 0) + 1, 2147483647); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y, s = 0) { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
const _ca = new THREE.Color(), _cb = new THREE.Color();
function lerpHex(a, b, t) { _ca.setHex(a); _cb.setHex(b); return _ca.lerp(_cb, t).getHex(); }
const C = (h) => new THREE.Color(h), V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const css = (c) => typeof c === 'number' ? '#' + c.toString(16).padStart(6, '0') : c;
const shade = (h, f) => { const r = Math.min(255, ((h >> 16) & 255) * f) | 0, g = Math.min(255, ((h >> 8) & 255) * f) | 0, b = Math.min(255, (h & 255) * f) | 0; return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); };
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } } };

class Voxels {
  constructor(size = S) { this.size = size; this.d = []; }
  add(i, j, k, c, sc = 1) { this.d.push([i, j, k, c, sc]); }
  box(i0, j0, k0, i1, j1, k1, c) { for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) for (let k = k0; k <= k1; k++) this.add(i, j, k, typeof c === 'function' ? c(i, j, k) : c); }
  build(mat, { shadow = true, jit = 0.04 } = {}) {
    const n = this.d.length, sz = this.size;
    const m = new THREE.InstancedMesh(new THREE.BoxGeometry(sz, sz, sz), mat, Math.max(n, 1));
    const M = new THREE.Matrix4(), col = new THREE.Color();
    for (let q = 0; q < n; q++) {
      const [i, j, k, c, sc] = this.d[q];
      M.makeScale(sc, sc, sc); M.setPosition(i * sz, k * sz, j * sz); m.setMatrixAt(q, M);
      col.setHex(c); if (jit) col.offsetHSL(0, 0, (hash(i * 7 + 3, j * 13 + 1, Math.floor(k * 4)) - .5) * jit * 2);
      m.setColorAt(q, col);
    }
    m.count = n; m.castShadow = m.receiveShadow = shadow; m.frustumCulled = false; return m;
  }
}

// =====================================================================
// renderer / scene / camera
// =====================================================================
const renderer = new THREE.WebGLRenderer({ canvas: $('#gl'), antialias: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(VW(), VH());
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x8d5aa8, 0.008);
const camera = new THREE.PerspectiveCamera(36, VW() / VH(), 0.5, 1800);
camera.position.set(0, 19, 31);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0.5); controls.enableDamping = true; controls.dampingFactor = 0.07; controls.enablePan = false;
controls.minDistance = 9; controls.maxDistance = 58; controls.minPolarAngle = 0.35; controls.maxPolarAngle = 1.3;
controls.minAzimuthAngle = -0.85; controls.maxAzimuthAngle = 0.85;
controls.autoRotateSpeed = 0.5;

// =====================================================================
// time-of-day presets
// =====================================================================
const PRE = {
  dusk: { top: C(0x3a2a78), mid: C(0xcf6a92), hor: C(0xf8a86c), fog: C(0x8d5aa8), keyCol: C(0xffb078), keyInt: 2.6, hSky: C(0xb090d8), hGnd: C(0x5a4068), hInt: 0.8, den: 0.0085, stars: 0.3, glow: 1.0, win: C(0xffb070), lamp: 0.75, bloom: 0.45, expo: 1.15, tint: C(0xffeee2), sun: V3(-0.9, 0.16, -0.4), disc: C(0xffc890), discK: 1, key: V3(-0.3, 0.8, 0.5) },
  night: { top: C(0x070a26), mid: C(0x1b1f66), hor: C(0x3d3a88), fog: C(0x1d1b52), keyCol: C(0x8aa6ff), keyInt: 0.7, hSky: C(0x4a52a0), hGnd: C(0x241c40), hInt: 0.85, den: 0.0105, stars: 1.0, glow: 1.9, win: C(0x1e2a66), lamp: 1.5, bloom: 0.75, expo: 1.3, tint: C(0xc0c4f0), sun: V3(0.55, 0.45, -0.7), disc: C(0xbfd0ff), discK: 0.65, key: V3(0.35, 0.8, 0.5) },
  day: { top: C(0x3d86e0), mid: C(0x8ccdf2), hor: C(0xe8f4ff), fog: C(0xb4d8f0), keyCol: C(0xfff0d8), keyInt: 3.2, hSky: C(0xcfeaff), hGnd: C(0x8a8a68), hInt: 1.3, den: 0.006, stars: 0.0, glow: 0.5, win: C(0xdff2ff), lamp: 0.12, bloom: 0.15, expo: 1.1, tint: C(0xffffff), sun: V3(-0.5, 0.65, -0.5), disc: C(0xfff4c8), discK: 1, key: V3(-0.3, 0.9, 0.5) },
};
const clone = (p) => { const o = {}; for (const k in p) o[k] = p[k].clone ? p[k].clone() : p[k]; return o; };
const cur = clone(PRE.dusk);
const settings = Object.assign({ mode: 'dusk', bubble: true, roomtag: true, names: false, bloom: true, auto: true, rotate: false, speed: 1 }, store.get('house.settings.v1', {}));
let mode = settings.mode;
Object.assign(cur, clone(PRE[mode]));
function stepEnv(dt, snap) {
  const t = PRE[mode], k = snap ? 1 : 1 - Math.exp(-dt * 2.2);
  for (const key in cur) { const a = cur[key], b = t[key]; if (typeof a === 'number') cur[key] = a + (b - a) * k; else a.lerp(b, k); }
}

// =====================================================================
// sky / stars / mist sea / clouds
// =====================================================================
const skyMat = new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { top: { value: cur.top }, mid: { value: cur.mid }, hor: { value: cur.hor }, sunDir: { value: cur.sun }, disc: { value: cur.disc }, discK: { value: 1 } },
  vertexShader: `varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform vec3 top, mid, hor, sunDir, disc; uniform float discK; varying vec3 vD;
    void main(){ vec3 d = normalize(vD); float h = d.y;
      vec3 c = mix(hor, mid, smoothstep(-0.02, 0.2, h)); c = mix(c, top, smoothstep(0.12, 0.7, h));
      float s = max(dot(d, normalize(sunDir)), 0.0);
      c += disc * (pow(s, 14.0) * 0.5 + pow(s, 160.0) * 0.5) * discK;
      c += disc * smoothstep(0.9988, 0.9992, s) * 2.5 * discK;
      gl_FragColor = vec4(c, 1.0); }`,
});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(1000, 32, 16), skyMat));
const starGeo = new THREE.BufferGeometry(); { const n = 1500, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const u = rnd(), v = rnd() * 0.97 + 0.03, th = u * Math.PI * 2, r = Math.sqrt(1 - v * v); p.set([Math.cos(th) * r * 900, v * 900, Math.sin(th) * r * 900], i * 3); } starGeo.setAttribute('position', new THREE.BufferAttribute(p, 3)); }
const starMat = new THREE.PointsMaterial({ color: 0xdfe6ff, size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0.3, depthWrite: false, fog: false });
scene.add(new THREE.Points(starGeo, starMat));
const seaTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); x.fillStyle = '#e6e6e6'; x.fillRect(0, 0, 256, 256);
  const r = mulberry32(5); for (let i = 0; i < 260; i++) { const px = r() * 256, py = r() * 256, rad = 14 + r() * 40, l = r() < .5 ? 255 : 196; for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) { const g = x.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, rad); g.addColorStop(0, `rgba(${l},${l},${l},.22)`); g.addColorStop(1, `rgba(${l},${l},${l},0)`); x.fillStyle = g; x.fillRect(px + ox - rad, py + oy - rad, rad * 2, rad * 2); } }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(22, 22); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const seaMat = new THREE.MeshBasicMaterial({ map: seaTex, color: 0x9a70b8 });
const sea = new THREE.Mesh(new THREE.CircleGeometry(1300, 48), seaMat); sea.rotation.x = -Math.PI / 2; sea.position.y = -26; scene.add(sea);
const clouds = [];
{ const cm = new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0 });
  for (let n = 0; n < 30; n++) {
    const a = rnd() * Math.PI * 2, dist = 30 + rnd() * 120, base = 5 + rnd() * 7, v = new Voxels(1.5), rx = base * (1 + rnd() * .6), rz = base * (0.8 + rnd() * .5);
    for (let L = 0; L < 5; L++) { const f = 1 - L * 0.19, ox = (rnd() - .5) * 2, oz = (rnd() - .5) * 2;
      for (let i = -Math.ceil(rx); i <= Math.ceil(rx); i++) for (let j = -Math.ceil(rz); j <= Math.ceil(rz); j++) { const d = Math.hypot((i - ox) / (rx * f), (j - oz) / (rz * f)) + vnoise(i * .4 + n, j * .4, 2) * .25; if (d > 1) continue; v.add(i, j, L, lerpHex(0xb9a3e4, 0xf1e6ff, L / 4 * .8 + hash(i, j, n) * .2)); } }
    const m = v.build(cm, { shadow: false, jit: 0.02 }); m.position.set(Math.cos(a) * dist, -25 + rnd() * 9, Math.sin(a) * dist); scene.add(m); clouds.push({ m, sp: 0.1 + rnd() * 0.25 });
  } }

// =====================================================================
// lights
// =====================================================================
const key = new THREE.DirectionalLight(0xffb078, 2.6);
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
Object.assign(key.shadow.camera, { left: -20, right: 20, top: 14, bottom: -14, near: 1, far: 100 });
key.shadow.normalBias = 0.03; key.shadow.bias = -0.0004; scene.add(key, key.target);
const hemi = new THREE.HemisphereLight(0xb090d8, 0x5a4068, 1.15); scene.add(hemi);
const lampLights = [[-5, 3.6, -4], [7, 3.6, -4.5], [-6, 3.6, 4], [7, 3.6, 4]].map(p => { const l = new THREE.PointLight(0xffc890, 8, 14, 1.7); l.position.set(...p); scene.add(l); return l; });

// =====================================================================
// the house
// =====================================================================
const I0 = -24, I1 = 23, J0 = -16, J1 = 15, WALL_H = 9, PART_H = 3, PV = 4, PH = 0;
const roomOf = (i, j) => j < PH ? (i < PV ? 'kitchen' : 'bedroom') : (i < PV ? 'living' : 'bath');
const ROOM_KO = { kitchen: '주방', bedroom: '안방', living: '거실', bath: '화장실' };
const WALLC = { kitchen: 0xf2dca4, bedroom: 0xdcc4ec, living: 0xe8cfb4, bath: 0xc4e6f2 };
const TRIM = 0x8a5a36;
const voxMat = new THREE.MeshStandardMaterial({ roughness: 0.9, metalness: 0 });
const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const winMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const tvMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const k2 = (i, j) => i * 1000 + j;
const staticBlk = new Set();            // walls / partitions (never change)
let blk = new Set();                     // staticBlk + furniture footprints (rebuilt)
const chars = [];
const house = new THREE.Group(); scene.add(house);
const wallV = new Voxels(), glowS = new Voxels(), winV = new Voxels();
const inR = (v, a, b) => v >= a && v <= b;

// --- floor (rebuilt whenever furniture/rugs change) ---
function floorCol(i, j) {
  for (const it of LAYOUT) if (it.type === 'rug') { const r = { i0: it.i, i1: it.i + it.p.w - 1, j0: it.j, j1: it.j + it.p.d - 1 }; if (inR(i, r.i0, r.i1) && inR(j, r.j0, r.j1)) { const edge = i === r.i0 || i === r.i1 || j === r.j0 || j === r.j1; return edge ? it.p.b : ((i + j) % 4 === 0 ? lerpHex(it.p.a, it.p.b, .2) : it.p.a); } }
  const rm = roomOf(i, j);
  if (rm === 'kitchen') return (i + j) & 1 ? 0xf2ecde : 0xe0d4ba;
  if (rm === 'bath') return (i + j) & 1 ? 0xf4fbff : 0xbfe0ee;
  const base = (j & 1) ? 0xc89a60 : 0xbb8c54; return hash(i >> 3, j, 4) < 0.18 ? lerpHex(base, 0xe8c088, .5) : base;
}
let floorMesh = null;
function buildFloor() {
  const v = new Voxels();
  for (let i = I0 - 1; i <= I1 + 1; i++) for (let j = J0 - 1; j <= J1 + 1; j++) v.add(i, j, 0, floorCol(i, j));
  for (let L = 1; L <= 7; L++) {   // plinth (stepped, floating chunk)
    const shrink = [0, 0, 1, 3, 6, 9, 12, 15][L], col = [0, 0x8a5a36, 0x6a4a5e, 0x584a70, 0x483c62, 0x3a2e52, 0x2e2444, 0x241c38][L];
    for (let i = I0 - 2 + shrink; i <= I1 + 2 - shrink; i++) for (let j = J0 - 2 + shrink; j <= J1 + 2 - shrink * 0.7; j++) v.add(i, Math.round(j), -L, hash(i, j, L) < .15 ? lerpHex(col, 0xffffff, .08) : col);
  }
  if (floorMesh) { house.remove(floorMesh); floorMesh.geometry.dispose(); floorMesh.dispose(); }
  floorMesh = v.build(voxMat, { jit: 0.035 }); house.add(floorMesh);
}

// --- windows (glass = glow-ish emissive pane, frame = wood) ---
const WINDOWS = [
  { ax: 'j', pos: J0 - 1, a0: -10, a1: -5, k0: 5, k1: 8 },    // kitchen (back wall)
  { ax: 'j', pos: J0 - 1, a0: 14, a1: 19, k0: 4, k1: 8 },     // bedroom (back wall)
  { ax: 'i', pos: I0 - 1, a0: 2, a1: 4, k0: 4, k1: 8 },       // living (left wall)
  { ax: 'i', pos: I0 - 1, a0: 12, a1: 14, k0: 4, k1: 8 },
  { ax: 'i', pos: I1 + 1, a0: -13, a1: -10, k0: 4, k1: 7 },   // bedroom (right wall)
  { ax: 'i', pos: I1 + 1, a0: 8, a1: 10, k0: 5, k1: 7 },      // bath (right wall, small)
];
function winAt(i, j, k) {
  for (const w of WINDOWS) {
    const a = w.ax === 'j' ? i : j, p = w.ax === 'j' ? j : i; if (p !== w.pos || !inR(a, w.a0, w.a1) || !inR(k, w.k0, w.k1)) continue;
    const edge = a === w.a0 || a === w.a1 || k === w.k0 || k === w.k1, mun = a === Math.floor((w.a0 + w.a1) / 2) || k === Math.floor((w.k0 + w.k1) / 2);
    return edge || (mun && (w.a1 - w.a0 > 2)) ? 'frame' : 'glass';
  }
  return null;
}
function wallVox(i, j, k, rm) {
  const w = winAt(i, j, k);
  if (w === 'glass') { winV.add(i, j, k, 0xffffff); return; }
  if (w === 'frame') { wallV.add(i, j, k, 0xf4ecdc); return; }
  let col = WALLC[rm];
  if (k === 1) col = lerpHex(col, TRIM, .55);
  else if (k === WALL_H) col = 0xf4ecdc;
  else if (rm === 'bath' && k <= 3) col = (i + j + k) & 1 ? 0xf4fbff : 0xd8eef6;
  else if ((k + (i | 0) + j) % 5 === 0 && hash(i, j, k) < 0.2) col = lerpHex(col, 0xffffff, .12);
  wallV.add(i, j, k, col);
}
// outer walls
for (let i = I0 - 1; i <= I1 + 1; i++) for (let k = 1; k <= WALL_H; k++) wallVox(i, J0 - 1, k, i < PV ? 'kitchen' : 'bedroom');
for (let j = J0; j <= J1; j++) for (let k = 1; k <= WALL_H; k++) { wallVox(I0 - 1, j, k, j < PH ? 'kitchen' : 'living'); wallVox(I1 + 1, j, k, j < PH ? 'bedroom' : 'bath'); }
for (let j = J0 - 1; j <= J1; j++) { staticBlk.add(k2(I0 - 1, j)); staticBlk.add(k2(I1 + 1, j)); }
for (let i = I0 - 1; i <= I1 + 1; i++) staticBlk.add(k2(i, J0 - 1));
// partitions (low) with doorways
const GAPV = [[-9, -6], [6, 9]], GAPH = [[-18, -6], [12, 15]];
const inGapV = (j) => GAPV.some(([a, b]) => inR(j, a, b)), inGapH = (i) => GAPH.some(([a, b]) => inR(i, a, b));
const gapEdgeV = (j) => GAPV.some(([a, b]) => j === a - 1 || j === b + 1), gapEdgeH = (i) => GAPH.some(([a, b]) => i === a - 1 || i === b + 1);
function part(i, j, edge) { const h = edge ? 6 : PART_H; for (let k = 1; k <= h; k++) wallV.add(i, j, k, edge ? (k === 6 ? 0xc4402e : TRIM) : (k === PART_H ? 0xd8c8b0 : (k === 1 ? 0xb89a78 : 0xf1e8d8))); }
for (let j = J0; j <= J1; j++) if (!inGapV(j)) { part(PV, j, gapEdgeV(j)); staticBlk.add(k2(PV, j)); }
for (let i = I0; i <= I1; i++) if (i !== PV && !inGapH(i)) { part(i, PH, gapEdgeH(i)); staticBlk.add(k2(i, PH)); }
// front edge trim + entrance arch
for (let i = I0 - 1; i <= I1 + 1; i++) { const gate = inR(i, -9, -6); for (let k = 1; k <= (gate && (i === -9 || i === -6) ? 6 : 1); k++) wallV.add(i, J1 + 1, k, gate ? (k === 6 ? 0xc4402e : TRIM) : TRIM); if (!(inR(i, -8, -7))) staticBlk.add(k2(i, J1 + 1)); }
for (let i = -9; i <= -6; i++) wallV.add(i, J1 + 1, 6, 0xc4402e);
glowS.add(-10, J1 + 1, 4, 0xffc860, .8); glowS.add(-5, J1 + 1, 4, 0xffc860, .8);

// =====================================================================
// FURNITURE: catalog (look + footprint + what it can be used for) and layout (where it stands)
//   local coords: x = across, z = depth. z=0 is the back (against a wall), +z is the front (where users face).
//   a placement {type, i, j, rot, p} rotates that by rot*90deg clockwise (seen from above) around its footprint.
//   slots = the things a character can DO at it (kind, where to stand, where to end up, which way to face, pose, height).
//   Everything below the LAYOUT is generic: move/rotate/add/remove an entry, call rebuildFurniture(), and the voxels,
//   collision, walking targets and activities all follow.
// =====================================================================
const BOOK = [0xd8402e, 0x4aa0d8, 0xf4d85a, 0x6abf6a, 0x9a7ae8, 0xf0a0c0, 0xf08a2a];
const CATALOG = {
  counter: { name: '조리대', size: (p) => [p.w || 4, 2],
    build({ P, w, p }) { for (let x = 0; x < w; x++) for (let z = 0; z < 2; z++) { const c = (x % 3 === 0 && z === 1) ? 0x946236 : 0xb4824c; P(x, z, 1, c); P(x, z, 2, c); P(x, z, 3, 0xf1ebe0); } for (const it of (p.items || [])) P(it.x, it.z, it.k, it.col, it.sc); } },
  sink: { name: '싱크대', size: () => [3, 2],
    build({ P }) { for (let x = 0; x < 3; x++) for (let z = 0; z < 2; z++) { P(x, z, 1, 0xb4824c); P(x, z, 2, 0xb4824c); P(x, z, 3, 0x7ac8f0); } P(1, 0, 4, 0x8a8a96, .35); P(1, 0, 4.45, 0x8a8a96, .35); },
    slots: () => [{ kind: 'cook', walk: [1, 2], at: [1, 2], face: [0, -1], pose: 'stand', txt: '설거지 중', say: ['쓱싹쓱싹', '♪'] }] },
  stove: { name: '가스레인지', size: () => [3, 2],
    build({ P, G }) { for (let x = 0; x < 3; x++) for (let z = 0; z < 2; z++) { P(x, z, 1, 0x6a6a76); P(x, z, 2, 0x6a6a76); P(x, z, 3, 0x2a2a30); } G(1, 1, 3.75, 0xff8a30, .5); P(2, 1, 4, 0x9a9aa8, .9); P(2, 1, 4.55, 0x7a7a88, .5); },
    slots: () => [{ kind: 'cook', walk: [1, 2], at: [1, 2], face: [0, -1], pose: 'stand', txt: '요리 중', say: ['보글보글', '맛있겠다', '간 맞추는 중'], steam: true }],
    emit: () => [{ type: 'steam', x: 2, z: 1, k: 5 }] },
  upper_cabinet: { name: '벽 찬장', size: (p) => [p.w || 4, 1], noBlock: true,
    build({ P, w }) { for (let x = 0; x < w; x++) for (let k = 6; k <= 8; k++) P(x, 0, k, (k === 6 && x % 3 === 0) ? 0x6a4228 : 0x8a5a3a); for (let x = 1; x < w; x += 3) P(x, 1, 7, 0xe8c878, .3); } },
  fridge: { name: '냉장고', size: () => [2, 2],
    build({ P, box }) { box(0, 0, 1, 1, 1, 7, (x, z, k) => k === 5 ? 0xb8c0c8 : 0xe8eef2); P(1, 2, 3, 0x8a8a96, .4); P(1, 2, 6, 0x8a8a96, .4); } },
  table: { name: '식탁', size: (p) => [p.w || 6, p.d || 4],
    build({ P, w, d }) { for (let x = 0; x < w; x++) for (let z = 0; z < d; z++) P(x, z, 2, 0xc8975c); for (const [x, z] of [[0, 0], [w - 1, 0], [0, d - 1], [w - 1, d - 1]]) P(x, z, 1, 0x8a5a36); P(3, 1, 3, 0xf4f4f8, .6); P(3, 1, 3.45, 0xf08a2a, .4); P(2, 2, 3.3, 0xd8402e, .35); P(4, 2, 3.3, 0xf4d85a, .35); } },
  chair: { name: '의자', size: () => [1, 2],      // back at z=0, seat at z=1, user faces +z
    build({ P, p }) { P(0, 0, 1, 0xb84a38); P(0, 0, 2, 0xb84a38); if ((p.backH || 3) >= 3) P(0, 0, 3, 0xb84a38); P(0, 1, 1, 0xd8604a); },
    slots: (b) => [{ kind: 'eat', walk: [b.p.side || -1, 1], at: [0, 1], face: [0, 1], pose: 'sit', y: .75, txt: '식사 중', say: ['냠냠', '맛있다!', '잘 먹겠습니다', '한 입 더!'] }] },
  bed: { name: '침대', size: () => [8, 6],         // head at x=7
    build({ P, box }) { box(0, 0, 1, 0, 5, 2, 0x8a5a36); box(7, 0, 1, 7, 5, 5, 0x8a5a36); for (let x = 1; x <= 6; x++) for (let z = 0; z < 6; z++) { P(x, z, 1, 0x8a5a36); P(x, z, 2, x >= 5 ? 0xf8f4ec : ((x + z) % 2 ? 0xe88aa8 : 0xf0a0b8)); } P(6, 1, 2.75, 0xffffff, .6); P(6, 4, 2.75, 0xffffff, .6); P(2, 4, 2.9, 0xb8844c, .6); P(2, 4, 3.3, 0xb8844c, .4); },
    slots: () => [{ kind: 'sleep', walk: [3, 6], at: [4, 3], face: [1, 0], pose: 'lie', y: 1.25, txt: '자는 중', say: ['zzz', 'zZ…', '쿨쿨'] }] },
  nightstand: { name: '협탁', size: () => [2, 2],
    build({ P, G, box }) { box(0, 0, 1, 1, 1, 2, 0xa0683c); P(1, 0, 3, 0xf4ecdc, .5); G(1, 0, 3.75, 0xffd890, .7); } },
  wardrobe: { name: '옷장', size: () => [4, 2],
    build({ P, box }) { box(0, 0, 1, 3, 1, 8, (x, z) => (x === 1 && z === 1) ? 0x6a4228 : 0x8a5a3a); P(1, 2, 4, 0xe8c878, .3); P(2, 2, 4, 0xe8c878, .3); },
    slots: () => [{ kind: 'dress', walk: [1, 2], at: [1, 2], face: [0, -1], pose: 'stand', txt: '옷 고르는 중', say: ['뭐 입지?', '이거 어때?'] }] },
  dresser: { name: '화장대', size: () => [3, 2],
    build({ P, box }) { box(0, 0, 1, 2, 1, 3, 0xb4824c); for (let x = 0; x < 3; x++) for (let k = 5; k <= 7; k++) P(x, 0, k, (x === 0 || x === 2 || k === 5 || k === 7) ? 0x8a5a36 : 0xc8ecf8); } },
  curtain: { name: '커튼', size: () => [1, 1], noBlock: true, build({ P }) { for (let k = 4; k <= 8; k++) P(0, 0, k, 0xb078d8); } },
  plant: { name: '화분', size: () => [3, 3],
    build({ P, p }) { P(1, 1, 1, 0xc4602e); P(1, 1, 2, 0xc4602e, .9); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = 0; c <= 2; c++) if (Math.abs(a) + Math.abs(b) + (c ? 0 : 1) <= 2 && hash(a + (p.seed || 0), b, c) < .85) P(1 + a, 1 + b, 3 + c, hash(a + 9, b, c) < .5 ? 0x4f9a3a : 0x6fb64a); } },
  bathtub: { name: '욕조', size: () => [8, 5],
    build({ P }) { for (let x = 0; x < 8; x++) for (let z = 0; z < 5; z++) { const edge = x === 0 || z === 0 || z === 4 || x === 7; P(x, z, 1, edge ? 0xf4f4f8 : ((x + z) % 3 ? 0x7ad0f0 : 0x9ae0f8)); if (edge) P(x, z, 2, 0xf4f4f8); }
      for (const [x, z] of [[2.2, 1], [4.2, 3], [6.2, 1], [3.2, 3], [5.2, 2]]) P(x, z, 1.7, 0xffffff, .5); P(1, 1, 1.75, 0xffd84a, .45); P(0, 2, 3, 0x9a9aa8, .4); P(0, 2, 3.6, 0x9a9aa8, .4); P(1, 2, 3.6, 0x9a9aa8, .4); },
    slots: () => [{ kind: 'bath', walk: [3, 5], at: [3, 2], face: [0, 1], pose: 'bath', y: 0.95, txt: '목욕 중', say: ['으아~ 시원해', '♪', '거품 거품'] }],
    emit: () => [{ type: 'bubbles', x: 4, z: 2, k: 2 }] },
  toilet: { name: '변기', size: () => [2, 3],
    build({ box }) { box(0, 0, 1, 1, 0, 4, 0xf4f4f8); box(0, 1, 1, 1, 2, 2, 0xf4f4f8); box(0, 2, 3, 1, 2, 3, 0xe8e8f0); } },
  vanity: { name: '세면대', size: () => [4, 2],
    build({ P, box }) { box(0, 0, 1, 3, 1, 3, 0xc8b090); box(1, 0, 3, 2, 1, 3, 0xcff0ff); for (let x = 0; x < 4; x++) for (let k = 5; k <= 8; k++) P(x, -1, k, (x === 0 || x === 3 || k === 5 || k === 8) ? 0x8a5a36 : 0xcff0ff); },
    slots: () => [{ kind: 'wash', walk: [1, 2], at: [1, 2], face: [0, -1], pose: 'stand', txt: '세수 중', say: ['쓱쓱', '양치 중…'] }] },
  washer: { name: '세탁기', size: () => [3, 3],
    build({ box }) { box(0, 0, 1, 2, 2, 4, (x, z, k) => (x === 1 && z === 2 && k >= 2 && k <= 3) ? 0x6aa8d8 : 0xf4f4f8); },
    slots: () => [{ kind: 'wash', walk: [1, -1], at: [1, -1], face: [0, 1], pose: 'stand', txt: '빨래 중', say: ['뽀송뽀송', '돌아간다~'] }] },
  basket: { name: '빨래바구니', size: () => [2, 2], build({ P, box }) { box(0, 0, 1, 1, 1, 2, 0xb4824c); P(0, 0, 3, 0xe8574a, .5); P(1, 0, 3, 0x4aa0d8, .5); } },
  tv_unit: { name: 'TV장', size: (p) => [p.w || 7, 1],
    build({ P, T, w }) { for (let x = 0; x < w; x++) { P(x, 0, 1, 0x8a5a3a); P(x, 0, 2, 0x8a5a3a); }
      for (let x = 1; x < w - 1; x++) for (let k = 3; k <= 6; k++) { const scr = x >= 2 && x <= w - 3 && k >= 4 && k <= 5; if (scr) T(x, 0, k, 0xffffff); else P(x, 0, k, 0x22222a); }
      for (let x = 2; x <= w - 3; x++) for (let k = 7; k <= 8; k++) P(x, 0, k, (x + k) % 2 ? 0xf0a040 : (x === 3 ? 0x6ab8d8 : 0xd8604a)); } },
  sofa: { name: '소파', size: () => [11, 4],    // back at z=0, three seats facing +z
    build({ P }) { for (let z = 0; z < 4; z++) for (const x of [0, 10]) for (let k = 1; k <= 3; k++) P(x, z, k, 0xb84a38);
      for (let x = 1; x <= 9; x++) { for (let z = 1; z <= 3; z++) { P(x, z, 1, 0xd8604a); P(x, z, 2, (x % 3 === 1 && z >= 2) ? 0xc4503c : 0xe87a62); } for (let k = 1; k <= 3; k++) P(x, 0, k, k === 3 ? 0xc4503c : 0xd8604a); } },
    slots: () => [[3, ['재밌다', 'ㅋㅋㅋ', '다음 화!']], [5, ['어, 저거다', '헉']], [7, ['과자 먹고 싶다', '♪']]].map(([x, say]) => ({ kind: 'tv', walk: [x, 4], at: [x, 2], face: [0, 1], pose: 'sit', y: 1.25, txt: 'TV 보는 중', say })) },
  coffee_table: { name: '테이블', size: () => [3, 5],
    build({ P }) { for (let x = 0; x < 3; x++) for (let z = 0; z < 5; z++) P(x, z, 2, 0xa07040); for (const [x, z] of [[0, 0], [2, 0], [0, 4], [2, 4]]) P(x, z, 1, 0x7a4a2c); P(1, 2, 3, 0xd8402e, .55); P(0, 1, 3, 0xf4ecdc, .4); } },
  floor_lamp: { name: '스탠드', size: () => [1, 1], build({ P, G }) { for (let k = 1; k <= 6; k++) P(0, 0, k, 0x4a3a30); G(0, 0, 7, 0xffd890, 1.1); } },
  bookshelf: { name: '책장', size: () => [4, 2],
    build({ box }) { box(0, 0, 1, 3, 1, 7, (x, z, k) => (k % 2 === 1 || z === 0) ? 0x8a5a3a : (hash(x, k, 6) < .12 ? 0x8a5a3a : BOOK[Math.floor(hash(x, k, 7) * BOOK.length)])); },
    slots: () => [{ kind: 'read', walk: [1, 2], at: [1, 2], face: [0, -1], pose: 'stand', txt: '책 고르는 중', say: ['이 책 재밌나?', '흠…'] }] },
  armchair: { name: '안락의자', size: () => [3, 4],
    build({ box }) { box(0, 0, 1, 2, 0, 2, 0x3a88c0); box(0, 1, 1, 2, 3, 1, 0x4aa0d8); box(0, 1, 2, 2, 3, 2, 0x5ab8e8); },
    slots: () => [{ kind: 'read', walk: [1, 4], at: [1, 2], face: [0, 1], pose: 'sit', y: 1.25, txt: '책 읽는 중', say: ['…', '한 장만 더'] }] },
  rug: { name: '러그', size: (p) => [p.w, p.d], noBlock: true, floor: true },
};
const FURN_TYPES = Object.keys(CATALOG);

const LAYOUT = [
  // kitchen
  { type: 'counter', i: -23, j: -16, p: { w: 2 } }, { type: 'sink', i: -21, j: -16 },
  { type: 'counter', i: -18, j: -16, p: { w: 2, items: [{ x: 0, z: 1, k: 3.7, col: 0xf4ecdc, sc: .35 }] } }, { type: 'stove', i: -16, j: -16 },
  { type: 'counter', i: -13, j: -16, p: { w: 10, items: [{ x: 7, z: 1, k: 4, col: 0xd8402e, sc: .8 }, { x: 4, z: 1, k: 3.75, col: 0xf08a2a, sc: .45 }, { x: 5, z: 1, k: 3.75, col: 0xd8402e, sc: .4 }] } },
  { type: 'upper_cabinet', i: -23, j: -16, p: { w: 12 } }, { type: 'fridge', i: -24, j: -13, rot: 3 },
  { type: 'table', i: -12, j: -9, p: { w: 6, d: 4 } },
  { type: 'chair', i: -11, j: -11, rot: 0, p: { backH: 3, side: -1 } }, { type: 'chair', i: -8, j: -11, rot: 0, p: { backH: 3, side: 1 } },
  { type: 'chair', i: -11, j: -5, rot: 2, p: { backH: 2, side: 1 } }, { type: 'chair', i: -8, j: -5, rot: 2, p: { backH: 2, side: -1 } },
  { type: 'plant', i: -3, j: -15 }, { type: 'rug', i: -13, j: -11, p: { w: 8, d: 8, a: 0xe8785a, b: 0xc4503c } },
  // bedroom
  { type: 'bed', i: 16, j: -12 }, { type: 'nightstand', i: 22, j: -14 }, { type: 'nightstand', i: 22, j: -6 },
  { type: 'wardrobe', i: 5, j: -16 }, { type: 'dresser', i: 10, j: -16 }, { type: 'curtain', i: 13, j: -16 }, { type: 'curtain', i: 20, j: -16 },
  { type: 'plant', i: 5, j: -4, p: { seed: 3 } }, { type: 'rug', i: 9, j: -11, p: { w: 8, d: 8, a: 0xf0a8c0, b: 0xd8809c } },
  // bathroom
  { type: 'bathtub', i: 16, j: 1 }, { type: 'toilet', i: 21, j: 9, rot: 1 }, { type: 'vanity', i: 21, j: 12, rot: 1 },
  { type: 'washer', i: 6, j: 13 }, { type: 'basket', i: 11, j: 14 }, { type: 'rug', i: 17, j: 7, p: { w: 5, d: 3, a: 0x8ad0e8, b: 0x5aa8c8 } },
  // living room
  { type: 'tv_unit', i: -24, j: 5, rot: 3, p: { w: 7 } }, { type: 'sofa', i: -16, j: 3, rot: 1 }, { type: 'coffee_table', i: -20, j: 6 },
  { type: 'floor_lamp', i: -11, j: 14 }, { type: 'bookshelf', i: 0, j: 1 }, { type: 'armchair', i: -6, j: 11, rot: 1 },
  { type: 'plant', i: 1, j: 12, p: { seed: 7 } },
  { type: 'rug', i: -22, j: 3, p: { w: 12, d: 11, a: 0x3a9aa4, b: 0x2a6f7a } }, { type: 'rug', i: -9, j: 13, p: { w: 4, d: 3, a: 0x7a5a3c, b: 0x5a3f28 } },
];
LAYOUT.forEach((it, n) => { it.id = it.id || it.type + '-' + n; it.rot = it.rot || 0; it.p = it.p || {}; });

// rotate a local point/direction into world cells
function xform(it, w, d) {
  const r = (it.rot || 0) & 3;
  return {
    W: r & 1 ? d : w, D: r & 1 ? w : d,
    pt: (x, z) => r === 0 ? [x, z] : r === 1 ? [(d - 1) - z, x] : r === 2 ? [(w - 1) - x, (d - 1) - z] : [z, (w - 1) - x],
    fc: (dx, dz) => r === 0 ? [dx, dz] : r === 1 ? [-dz, dx] : r === 2 ? [-dx, -dz] : [dz, -dx],
  };
}
const footprint = (it) => { const def = CATALOG[it.type], [w, d] = def.size(it.p), t = xform(it, w, d); return { i0: it.i, j0: it.j, i1: it.i + t.W - 1, j1: it.j + t.D - 1 }; };

// slots that belong to the building itself, not to furniture
function archSpots() {
  const out = [{ kind: 'out', walk: [-8, 15], at: [-8, 15], face: [0, 1], pose: 'stand', txt: '외출 중', say: ['다녀올게!', '금방 올게~'], arch: true }];
  for (const w of WINDOWS) {
    const mid = Math.floor((w.a0 + w.a1) / 2); let ci, cj, face;
    if (w.ax === 'j') { ci = mid; cj = w.pos + 2; face = [0, -1]; } else { const left = w.pos === I0 - 1; ci = left ? w.pos + 2 : w.pos - 2; cj = mid; face = [left ? -1 : 1, 0]; }
    if (!blk.has(k2(ci, cj)) && inR(ci, I0, I1) && inR(cj, J0, J1)) out.push({ kind: 'view', walk: [ci, cj], at: [ci, cj], face, pose: 'stand', txt: '창밖 구경 중', say: ['노을 예쁘다', '구름이다', '저 구름 봐!', '…'], arch: true });
  }
  return out;
}

// (re)build everything that depends on the layout
const emitters = [];
let furnMesh = null, glowMesh = null, tvMesh = null;
function rebuildFurniture() {
  const furn = new Voxels(), glow = new Voxels(), tvV = new Voxels();
  blk = new Set(staticBlk); emitters.length = 0; const slots = [];
  for (const it of LAYOUT) {
    const def = CATALOG[it.type]; if (!def) continue;
    const [w, d] = def.size(it.p), t = xform(it, w, d);
    const wc = (x, z) => { const [X, Z] = t.pt(x, z); return [it.i + X, it.j + Z]; };
    const put = (v) => (x, z, k, c, sc = 1) => { const [a, b] = wc(x, z); v.add(a, b, k, c, sc); };
    const P = put(furn), G = put(glow), T = put(tvV);
    const box = (x0, z0, k0, x1, z1, k1, c) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let k = k0; k <= k1; k++) P(x, z, k, typeof c === 'function' ? c(x, z, k) : c); };
    const b = { P, G, T, box, w, d, p: it.p }; if (def.build) def.build(b);
    if (!def.noBlock) for (let x = 0; x < w; x++) for (let z = 0; z < d; z++) blk.add(k2(...wc(x, z)));
    if (def.slots) for (const s of def.slots(b)) { const f = t.fc(...s.face); slots.push({ ...s, walk: wc(...s.walk), at: wc(...s.at), face: f, owner: it.id }); }
    if (def.emit) for (const e of def.emit(b)) { const [X, Z] = t.pt(e.x, e.z); emitters.push({ type: e.type, x: (it.i + X) * S, z: (it.j + Z) * S, y: e.k * S, owner: it.id }); }
  }
  SPOTS = slots.concat(archSpots());
  if (furnMesh) { house.remove(furnMesh, glowMesh, tvMesh); for (const m of [furnMesh, glowMesh, tvMesh]) { m.geometry.dispose(); m.dispose(); } }
  furnMesh = furn.build(voxMat, { jit: 0.04 }); glowMesh = glow.build(glowMat, { shadow: false, jit: 0 }); tvMesh = tvV.build(tvMat, { shadow: false, jit: 0 });
  house.add(furnMesh, glowMesh, tvMesh);
  buildFloor(); rebuildNav();
  for (const c of chars) { leaveSpot(c); c.plan = null; c.path = null; c.state = 'idle'; c.timer = 0.4; if (!isWalk(...pos2(c))) { const [ci, cj] = pos2(c), n = walkList.reduce((best, q) => Math.hypot(q[0] - ci, q[1] - cj) < Math.hypot(best[0] - ci, best[1] - cj) ? q : best, walkList[0]); c.pos.set(n[0] * S, 0, n[1] * S); } }
}
// edit API (future interior-edit UI): move / rotate / add / remove, validated against walls and other furniture
function canPlace(it, ignoreId) {
  const f = footprint(it), def = CATALOG[it.type];
  if (!(inR(f.i0, I0, I1) && inR(f.i1, I0, I1) && inR(f.j0, J0, J1) && inR(f.j1, J0, J1))) return false;
  if (def.noBlock) return true;
  for (let i = f.i0; i <= f.i1; i++) for (let j = f.j0; j <= f.j1; j++) { if (staticBlk.has(k2(i, j))) return false; }
  for (const o of LAYOUT) { if (o.id === ignoreId || o === it || CATALOG[o.type].noBlock) continue; const g = footprint(o); if (f.i0 <= g.i1 && f.i1 >= g.i0 && f.j0 <= g.j1 && f.j1 >= g.j0) return false; }
  return true;
}
function moveFurniture(id, i, j, rot) { const it = LAYOUT.find(o => o.id === id); if (!it) return false; const t = { ...it, i, j, rot: rot ?? it.rot }; if (!canPlace(t, id)) return false; Object.assign(it, { i, j, rot: t.rot }); rebuildFurniture(); return true; }
function addFurniture(type, i, j, rot = 0, p = {}) { const it = { id: type + '-' + Math.random().toString(36).slice(2, 6), type, i, j, rot, p }; if (!CATALOG[type] || !canPlace(it)) return null; LAYOUT.push(it); rebuildFurniture(); return it.id; }
function removeFurniture(id) { const n = LAYOUT.findIndex(o => o.id === id); if (n < 0) return false; LAYOUT.splice(n, 1); rebuildFurniture(); return true; }

// static architecture meshes (walls, windows, entrance lanterns)
house.add(wallV.build(voxMat, { jit: 0.025 })); house.add(winV.build(winMat, { shadow: false, jit: 0 })); house.add(glowS.build(glowMat, { shadow: false, jit: 0 }));

// room labels (projected)
const ROOMTAG_POS = { kitchen: [-13, -8], bedroom: [14, -9], living: [-10, 8], bath: [14, 8] };
const roomTagEls = {}; for (const r in ROOMTAG_POS) { const e = document.createElement('div'); e.className = 'rt'; e.textContent = ROOM_KO[r]; $('#roomtags').appendChild(e); roomTagEls[r] = e; }

// steam particles (kitchen pot)
const DOT = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.35, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
function makePoints(n, size, color, blending, opacity = 1) { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); const p = new THREE.Points(geo, new THREE.PointsMaterial({ map: DOT, size, color, transparent: true, opacity, blending, depthWrite: false })); p.frustumCulled = false; scene.add(p); return p; }
const steam = makePoints(18, 0.8, 0xffffff, THREE.NormalBlending, 0.35), steamS = Array.from({ length: 18 }, () => ({ t: Math.random() * 3 }));
const dust = makePoints(50, 0.14, 0xfff0c8, THREE.AdditiveBlending, 0.6), dustS = Array.from({ length: 50 }, () => ({ x: (Math.random() - .5) * 22, y: .8 + Math.random() * 3, z: (Math.random() - .5) * 14, ph: Math.random() * 6, sp: .2 + Math.random() * .4 }));
const bubblesTub = makePoints(10, 0.3, 0xffffff, THREE.NormalBlending, 0.7), bubS = Array.from({ length: 10 }, () => ({ t: Math.random() * 4 }));

// =====================================================================
// walkability + A*
// =====================================================================
const OFF = 30, N = 64, walk = new Uint8Array(N * N);
const isWalk = (i, j) => i + OFF >= 0 && j + OFF >= 0 && i + OFF < N && j + OFF < N && walk[(i + OFF) * N + j + OFF] === 1;
const walkList = [], roomCells = { kitchen: [], bedroom: [], living: [], bath: [] };
function rebuildNav() {
  walk.fill(0); walkList.length = 0; for (const r in roomCells) roomCells[r].length = 0;
  for (let i = I0; i <= I1; i++) for (let j = J0; j <= J1; j++) if (!blk.has(k2(i, j))) walk[(i + OFF) * N + j + OFF] = 1;
  for (const i of [-8, -7]) walk[(i + OFF) * N + J1 + 1 + OFF] = 1;
  for (let i = I0; i <= I1; i++) for (let j = J0; j <= J1; j++) if (isWalk(i, j)) { walkList.push([i, j]); roomCells[roomOf(i, j)].push([i, j]); }
}
function findPath(si, sj, ti, tj) {
  if (!isWalk(ti, tj) || !isWalk(si, sj)) return null;
  const idx = (i, j) => (i + OFF) * N + j + OFF, g = new Map([[idx(si, sj), 0]]), came = new Map(), closed = new Set(), open = [[0, si, sj]];
  while (open.length) {
    let bi = 0; for (let q = 1; q < open.length; q++) if (open[q][0] < open[bi][0]) bi = q;
    const [, i, j] = open.splice(bi, 1)[0], id = idx(i, j); if (closed.has(id)) continue; closed.add(id);
    if (i === ti && j === tj) { const out = [[i, j]]; let k = id; while (came.has(k)) { const p = came.get(k); out.push([p[0], p[1]]); k = idx(p[0], p[1]); } return out.reverse(); }
    for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) {
      if (!di && !dj) continue; const ni = i + di, nj = j + dj; if (!isWalk(ni, nj)) continue;
      if (di && dj && (!isWalk(i + di, j) || !isWalk(i, j + dj))) continue;
      const cost = g.get(id) + (di && dj ? 1.414 : 1), nid = idx(ni, nj); if (g.has(nid) && g.get(nid) <= cost) continue;
      g.set(nid, cost); came.set(nid, [i, j]);
      const dx = Math.abs(ti - ni), dy = Math.abs(tj - nj); open.push([cost + (dx + dy) + (1.414 - 2) * Math.min(dx, dy), ni, nj]);
    }
  }
  return null;
}

// =====================================================================
// activity spots
// =====================================================================
const FLOOR = 0.25;
let SPOTS = [];   // rebuilt from the furniture layout (slots) + architecture (windows, front door)
rebuildFurniture();
const ACT_KINDS = ['cook', 'eat', 'sleep', 'view', 'dress', 'bath', 'wash', 'tv', 'read', 'out'];
const ACT_KO = { sleep: '잠자기', tv: 'TV 보기', cook: '요리', eat: '식사', bath: '목욕', wash: '씻기·빨래', read: '독서', view: '창밖 구경', dress: '옷 고르기', out: '외출', chat: '대화', intimate: '19♥' };
const GO_KO = { kitchen: '주방', living: '거실', bedroom: '안방', bath: '화장실' };
// words the future Marinara extension will map onto actions
const KEYWORDS = { sleep: ['잠', '자다', '침대', '꿈', 'sleep'], tv: ['tv', '티비', '텔레비전', '소파'], cook: ['요리', '부엌', '주방', 'cook'], eat: ['식사', '밥', '먹', 'eat'], bath: ['목욕', '욕조', 'bath'], wash: ['씻', '세수', '양치', '빨래'], read: ['책', '독서'], view: ['창밖', '창문'], out: ['외출', '나가', '산책'], chat: ['대화', '수다', '이야기'] };

// ---------- reading a story line: sentence -> who + what ----------
const ACTION_WORDS = [
  ['sleep', ['잠', '자러', '자고', '자는', '잔다', '잤', '졸', '침대에 누', '눕', '꿈나라', '취침', '낮잠', 'sleep']],
  ['tv', ['tv', '티비', '텔레비전', '시청', '드라마', '영화']],
  ['cook', ['요리', '조리', '끓', '볶', '설거지', 'cook']],
  ['eat', ['식사', '밥', '먹', '식탁', '간식', '점심', '저녁을', '아침을']],
  ['bath', ['목욕', '샤워', '욕조', 'bath']],
  ['wash', ['세수', '양치', '씻', '빨래', '세탁']],
  ['read', ['독서', '책을', '책장', '읽']],
  ['dress', ['갈아입', '옷장', '옷을']],
  ['view', ['창밖', '창문', '노을', '구경']],
  ['out', ['외출', '나갔', '나가', '산책', '집을 나', '장보']],
  ['chat', ['대화', '수다', '얘기', '말을 걸', '이야기를 나', '속삭']],
];
const NSFW_WORDS = ['섹스', '성관계', '정사', '잠자리를', '몸을 섞', '애무', '알몸', '나체', '옷을 벗', '벗겼', '절정', '삽입', '쾌감', '오르가', 'sex', 'nsfw', 'naked', 'orgasm', 'moan'];
// where it happens: furniture first, then rooms
const PLACES = [
  ['table', ['식탁', '밥상']], ['bed', ['침대', '이불']], ['sofa', ['소파']], ['bathtub', ['욕조', '욕탕']], ['vanity', ['세면대']], ['washer', ['세탁기']],
  ['sink', ['싱크대']], ['stove', ['가스레인지', '레인지']], ['bookshelf', ['책장', '서재']], ['armchair', ['안락의자']], ['wardrobe', ['옷장']], ['door', ['현관', '문 앞']], ['window', ['창가', '창문']],
  ['living', ['거실']], ['kitchen', ['주방', '부엌']], ['bedroom', ['안방', '침실']], ['bath', ['화장실', '욕실']],
];
const PLACE_INFO = { table: { furn: ['table'], kinds: ['eat'] }, bed: { furn: ['bed'], kinds: ['sleep'] }, sofa: { furn: ['sofa'], kinds: ['tv'] }, bathtub: { furn: ['bathtub'], kinds: ['bath'] }, vanity: { furn: ['vanity'], kinds: ['wash'] }, washer: { furn: ['washer'], kinds: ['wash'] }, sink: { furn: ['sink'], kinds: ['cook'] }, stove: { furn: ['stove'], kinds: ['cook'] }, bookshelf: { furn: ['bookshelf'], kinds: ['read'] }, armchair: { furn: ['armchair'], kinds: ['read'] }, wardrobe: { furn: ['wardrobe'], kinds: ['dress'] }, door: { kinds: ['out'] }, window: { kinds: ['view'] }, living: { room: 'living' }, kitchen: { room: 'kitchen' }, bedroom: { room: 'bedroom' }, bath: { room: 'bath' } };
const PLACE_KO = { table: '식탁', bed: '침대', sofa: '소파', bathtub: '욕조', vanity: '세면대', washer: '세탁기', sink: '싱크대', stove: '가스레인지', bookshelf: '책장', armchair: '안락의자', wardrobe: '옷장', door: '현관', window: '창가', living: '거실', kitchen: '주방', bedroom: '안방', bath: '화장실' };
const placeOf = (text) => { const low = String(text).toLowerCase(); for (const [id, ws] of PLACES) if (ws.some(w => low.includes(w))) return id; return null; };
const placeIsRoom = (id) => !!(PLACE_INFO[id] && PLACE_INFO[id].room);
const layoutOf = (id) => LAYOUT.find(o => o.id === id);
function placeSpots(place) {          // activity spots that belong to this place
  const inf = PLACE_INFO[place]; if (!inf) return [];
  if (inf.room) return SPOTS.filter(s => roomOf(s.at[0], s.at[1]) === inf.room);
  let list = []; if (inf.furn) list = SPOTS.filter(s => { const it = s.owner && layoutOf(s.owner); return it && inf.furn.includes(it.type); });
  if (!list.length && inf.kinds) list = SPOTS.filter(s => inf.kinds.includes(s.kind));
  return list;
}
function placeCells(place) {          // free standing cells at/near this place (nearest first for furniture)
  const inf = PLACE_INFO[place]; if (!inf) return [];
  if (inf.room) return roomCells[inf.room].slice();
  if (place === 'door') return [[-8, 15], [-7, 15], [-9, 14], [-8, 14], [-7, 14]].filter(([i, j]) => isWalk(i, j));
  if (place === 'window') return SPOTS.filter(s => s.kind === 'view').map(s => s.at);
  const cells = [];
  for (const it of LAYOUT) if (inf.furn && inf.furn.includes(it.type)) { const f = footprint(it), cx = (f.i0 + f.i1) / 2, cz = (f.j0 + f.j1) / 2; for (let i = f.i0 - 1; i <= f.i1 + 1; i++) for (let j = f.j0 - 1; j <= f.j1 + 1; j++) if ((i < f.i0 || i > f.i1 || j < f.j0 || j > f.j1) && isWalk(i, j)) cells.push([i, j, Math.hypot(i - cx, j - cz)]); }
  cells.sort((a, b) => a[2] - b[2]); return cells.map(c => [c[0], c[1]]);
}
function pairCells(list, random) {
  if (!list || list.length < 2) return null;
  const a = random ? list[Math.floor(Math.random() * list.length)] : list[Math.floor(Math.random() * Math.min(list.length, 4))];
  const b = list.find(x => x !== a && Math.hypot(x[0] - a[0], x[1] - a[1]) <= 1.5) || list.find(x => x !== a); return b ? [a, b] : null;
}
function interpret(text) {
  const out = [];
  for (const m of String(text).matchAll(/[^.!?\n]+[.!?]?/g)) {
    const sent = m[0].trim(); if (!sent) continue; const low = sent.toLowerCase();
    let action = null, kw = null;
    const adult = NSFW_WORDS.find(w => low.includes(w)); if (adult) { action = 'intimate'; kw = adult; }
    if (!action) for (const [a, ws] of ACTION_WORDS) { const w = ws.find(w => low.includes(w)); if (w) { action = a; kw = w; break; } }
    let place = null, pkw = null;
    for (const [id, ws] of PLACES) { const w = ws.find(w => low.includes(w)); if (w) { place = id; pkw = w; break; } }
    if (!action && place) { const inf = PLACE_INFO[place]; action = inf.room ? 'goto_' + inf.room : inf.kinds[0]; kw = pkw; }
    const names = chars.filter(c => sent.includes(c.def.name)).map(c => c.def.name);
    out.push({ sentence: sent, who: names.length ? names : ['*'], action, keyword: kw, place, placeKeyword: pkw });
  }
  return out;
}
function applyStory(text) {
  const res = interpret(text);
  for (const r of res) if (r.action) {
    if (r.action === 'intimate') { if (r.who[0] !== '*') doAction(r.who[0], 'intimate', r.who[1], r.place); }
    else if (r.action === 'chat' && r.who.length >= 2) doAction(r.who[0], 'chat', r.who[1], r.place); else for (const w of r.who) doAction(w, r.action, undefined, r.place);
  }
  return res;
}
const actLabel = (a) => a.startsWith('goto_') ? GO_KO[a.slice(5)] + '(으)로 이동' : (ACT_KO[a] || a);

// =====================================================================
// pixel-art sprites (generated in code)
// =====================================================================
const FW = 18, FH = 22, PX = 0.088;
const OUT = [0x2b, 0x1d, 0x33];
function drawFrame(dst, dx, dy, dir, fr, st) {
  const cv = document.createElement('canvas'); cv.width = FW; cv.height = FH; const x = cv.getContext('2d');
  const bob = fr === 1 || fr === 2 ? 1 : 0, sitF = fr === 3;
  const P = (px, py, w, h, col, b = 1) => { x.fillStyle = css(col); x.fillRect(1 + px, 1 + py + (b ? bob : 0), w, h); };
  const { skin, hair, eye, top, topC, bottom, botC, hat, hatC, hairStyle: hs } = st;
  const skinD = shade(skin, .88), hc = css(hair), hd = shade(hair, .75), hl = shade(hair, 1.25);
  const tC = css(topC), tD = shade(topC, .78), bC = css(botC), bD = shade(botC, .75), shoe = '#3a2a30', lash = '#2a1d2a', eC = css(eye);
  const hatD = shade(hatC, .78), hatL = shade(hatC, 1.15), mouth = '#c85a64', tie = '#f06a9a';
  const dress = top === 'dress', long = top === 'hood' || top === 'shirt';
  const lift = (s) => (fr === 1 && s === 'l') || (fr === 2 && s === 'r') ? 1 : 0;
  const leg = (lx, w, up, dark) => {
    if (bottom === 'pants' && !dress) P(lx, 15, w, 4 - up, dark ? bD : bC, 0);
    else if (bottom === 'shorts' && !dress) { P(lx, 15, w, 2, dark ? bD : bC, 0); P(lx, 17, w, 2 - up, skin, 0); }
    else P(lx, 15, w, 4 - up, skin, 0);
    P(lx, 19 - up, w, 1, shoe, 0);
  };
  const hatDraw = (side) => {
    if (hat === 'cap') { P(5, 2, 6, 2, hatC); P(6, 1, 4, 1, hatC); if (side === 'f') P(4, 4, 8, 1, hatD); else if (side === 's') P(9, 4, 3, 1, hatD); else P(5, 4, 6, 1, hatD); }
    else if (hat === 'straw') { P(6, 1, 4, 2, hatC); P(6, 2, 4, 1, hatD); P(3, 3, 10, 1, hatL); if (side !== 'b') P(4, 4, 8, 1, hatD); }
  };
  if (dir < 2) {                                    // front / back
    if (sitF) { const lc = (bottom === 'pants' || bottom === 'shorts') && !dress ? bC : css(skin); P(5, 15, 6, 1, lc, 0); P(7, 16, 2, 1, lc, 0); P(5, 16, 2, 1, shoe, 0); P(9, 16, 2, 1, shoe, 0); }
    else { leg(5, 3, lift('l'), false); leg(8, 3, lift('r'), true); }
    const sw = fr === 1 ? 1 : fr === 2 ? -1 : 0, aL = sw > 0 ? 1 : 0, aR = sw < 0 ? 1 : 0;
    const arm = (ax, off, col) => { if (long) { P(ax, 10 + off, 1, 3, col); P(ax, 13 + off, 1, 1, skin); } else { P(ax, 10 + off, 1, 2, col); P(ax, 12 + off, 1, 2, skin); } };
    arm(3, aL, tC); arm(12, aR, tD);
    P(4, 9, 8, 6, tC); P(10, 10, 2, 5, tD);
    if (dress) { P(3, 15, 10, 2, tC); P(3, 16, 10, 1, tD); }
    else if (bottom === 'skirt') { P(4, 14, 8, 1, bC); P(3, 15, 10, 2, bC); P(3, 16, 10, 1, bD); }
    else P(4, 14, 8, 1, bC);
    if (dir === 0) {
      if (top === 'tee' || dress) P(7, 9, 2, 1, skin);
      if (top === 'hood') { P(5, 9, 6, 1, tD); P(7, 10, 1, 2, '#f4f0e8'); P(9, 10, 1, 2, '#f4f0e8'); P(6, 12, 4, 2, tD); }
      if (top === 'shirt') { P(6, 9, 4, 1, '#f4f4f8'); P(8, 11, 1, 1, '#f4f4f8'); P(8, 13, 1, 1, '#f4f4f8'); }
      if (dress) P(7, 10, 2, 1, tD);
    } else if (top === 'hood') P(5, 9, 6, 2, tD);
    P(5, 3, 6, 6, skin);
    if (dir === 0) { P(6, 6, 1, 1, lash); P(6, 7, 1, 1, eC); P(9, 6, 1, 1, lash); P(9, 7, 1, 1, eC); P(5, 7, 1, 1, '#f09a9a'); P(10, 7, 1, 1, '#f09a9a'); P(8, 8, 1, 1, mouth); }
    if (dir === 0) {
      if (hs !== 'spiky') { P(6, 2, 4, 1, hc); P(5, 3, 6, 1, hc); }
      if (hs === 'short' || hs === 'pony' || hs === 'twin' || hs === 'bun') { P(5, 4, 2, 1, hc); P(9, 4, 2, 1, hc); P(5, 5, 1, 1, hc); P(10, 5, 1, 1, hc); P(7, 4, 1, 1, hc); }
      if (hs === 'bob') { P(5, 4, 6, 1, hc); P(4, 3, 1, 6, hc); P(11, 3, 1, 6, hc); P(5, 5, 1, 3, hc); P(10, 5, 1, 3, hc); P(7, 3, 2, 1, hl); }
      if (hs === 'long') { P(5, 4, 2, 1, hc); P(9, 4, 2, 1, hc); P(5, 5, 1, 4, hc); P(10, 5, 1, 4, hc); P(4, 9, 2, 5, hc); P(10, 9, 2, 5, hc); P(4, 13, 2, 1, hd); P(10, 13, 2, 1, hd); }
      if (hs === 'twin') { P(3, 5, 2, 5, hc); P(11, 5, 2, 5, hc); P(3, 5, 2, 1, tie); P(11, 5, 2, 1, tie); P(3, 9, 2, 1, hd); P(11, 9, 2, 1, hd); }
      if (hs === 'spiky') { P(5, 2, 6, 2, hc); P(5, 1, 1, 1, hc); P(7, 0, 1, 2, hc); P(9, 1, 1, 1, hc); P(10, 0, 1, 1, hc); P(5, 4, 1, 2, hc); P(10, 4, 1, 2, hc); P(7, 4, 1, 1, hc); }
      if (hs === 'bun') P(7, 0, 2, 2, hc);
      if (hs === 'pony') P(11, 3, 1, 2, tie);
      hatDraw('f');
    } else {
      P(5, 2, 6, 6, hc); P(5, 8, 6, 1, hd);
      if (hs === 'long') { P(5, 8, 6, 5, hc); P(5, 12, 6, 1, hd); }
      if (hs === 'bob') { P(4, 2, 8, 7, hc); P(4, 8, 8, 1, hd); }
      if (hs === 'twin') { P(4, 2, 8, 6, hc); P(3, 5, 2, 5, hc); P(11, 5, 2, 5, hc); P(3, 5, 2, 1, tie); P(11, 5, 2, 1, tie); }
      if (hs === 'pony') { P(7, 5, 2, 1, tie); P(7, 6, 2, 6, hc); P(7, 12, 2, 1, hd); }
      if (hs === 'spiky') { P(5, 1, 1, 1, hc); P(7, 0, 1, 2, hc); P(9, 1, 1, 1, hc); P(10, 0, 1, 1, hc); }
      if (hs === 'bun') P(7, 0, 2, 2, hc);
      hatDraw('b');
    }
  } else {                                           // side (facing right)
    const sw = fr === 1 ? 1 : fr === 2 ? -1 : 0;
    const L = fr === 0 ? [[6, 0, true], [8, 0, false]] : fr === 1 ? [[4, 1, true], [9, 0, false]] : [[9, 1, true], [4, 0, false]];
    if (sitF) { const lc = (bottom === 'pants' || bottom === 'shorts') && !dress ? bC : css(skin); P(6, 15, 5, 2, lc, 0); P(11, 15, 2, 2, shoe, 0); }
    else for (const [lx, up, dk] of L) leg(lx, 2, up, dk);
    P(5, 9, 6, 6, tC); P(5, 9, 1, 6, tD);
    if (dress) { P(4, 15, 8, 2, tC); P(4, 16, 8, 1, tD); } else if (bottom === 'skirt') { P(5, 14, 6, 1, bC); P(4, 15, 8, 2, bC); P(4, 16, 8, 1, bD); } else P(5, 14, 6, 1, bC);
    const ax = 7 + sw; if (long) { P(ax, 10, 2, 3, tD); P(ax, 13, 2, 1, skin); } else { P(ax, 10, 2, 2, tD); P(ax, 12, 2, 2, skin); }
    if (hs === 'long') { P(4, 3, 3, 10, hc); P(4, 12, 3, 1, hd); }
    P(5, 3, 6, 6, skin); P(9, 6, 1, 1, lash); P(9, 7, 1, 1, eC); P(10, 7, 1, 1, skinD); P(9, 8, 1, 1, mouth);
    if (hs !== 'spiky') { P(5, 2, 6, 2, hc); P(5, 3, 4, 3, hc); P(5, 6, 2, 2, hd); P(9, 4, 1, 1, hc); }
    if (hs === 'bob') { P(4, 3, 4, 6, hc); P(4, 8, 4, 1, hd); }
    if (hs === 'twin') { P(4, 5, 2, 5, hc); P(4, 5, 2, 1, tie); }
    if (hs === 'pony') { const tx = fr ? 2 : 3; P(tx, 4, 2, 1, tie); P(tx, 5, 2, 6, hc); P(tx, 10, 2, 1, hd); }
    if (hs === 'spiky') { P(5, 2, 6, 2, hc); P(5, 3, 4, 3, hc); P(5, 1, 1, 1, hc); P(7, 0, 1, 2, hc); P(9, 1, 1, 1, hc); P(5, 6, 2, 2, hd); }
    if (hs === 'bun') P(4, 1, 3, 2, hc);
    hatDraw('s');
  }
  const img = x.getImageData(0, 0, FW, FH), d = img.data, o = new Uint8ClampedArray(d);
  const A = (i, j) => (i < 0 || j < 0 || i >= FW || j >= FH) ? 0 : d[(j * FW + i) * 4 + 3];
  for (let j = 0; j < FH; j++) for (let i = 0; i < FW; i++) if (!A(i, j) && (A(i - 1, j) || A(i + 1, j) || A(i, j - 1) || A(i, j + 1))) { const q = (j * FW + i) * 4; o[q] = OUT[0]; o[q + 1] = OUT[1]; o[q + 2] = OUT[2]; o[q + 3] = 255; }
  for (let q = 3; q < d.length; q += 4) if (d[q]) o[q] = 255;
  x.putImageData(new ImageData(o, FW, FH), 0, 0);
  dst.drawImage(cv, dx, dy);
}
function atlasCanvas(st) { const cv = document.createElement('canvas'); cv.width = FW * 4; cv.height = FH * 3; const ctx = cv.getContext('2d'); for (let dir = 0; dir < 3; dir++) for (let fr = 0; fr < 4; fr++) drawFrame(ctx, fr * FW, dir * FH, dir, fr, st); return cv; }
function makeAtlas(st) { const t = new THREE.CanvasTexture(atlasCanvas(st)); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; t.colorSpace = THREE.SRGBColorSpace; t.repeat.set(1 / 4, 1 / 3); return t; }

// ---------- creator options ----------
const OPT = {
  hairStyle: [['short', '짧은머리'], ['bob', '단발'], ['long', '긴머리'], ['twin', '양갈래'], ['pony', '포니테일'], ['spiky', '뾰족머리'], ['bun', '올림머리']],
  top: [['tee', '티셔츠'], ['hood', '후드티'], ['shirt', '셔츠'], ['dress', '원피스']],
  bottom: [['pants', '긴바지'], ['shorts', '반바지'], ['skirt', '치마']],
  hat: [['none', '없음'], ['cap', '캡모자'], ['straw', '밀짚모자']],
};
const PAL = {
  hair: [0x262230, 0x5a3a28, 0x8a5a3a, 0xe8c05a, 0xc4502e, 0xe87aa8, 0x5a7ae0, 0x9a7ae8, 0xe8e4f0, 0x3fb08a],
  eye: [0x2a1d2a, 0x6a4228, 0x3a7ad8, 0x3fb08a, 0x9a5ae0, 0xe8574a, 0xe8b83a, 0x7a8a98],
  skin: [0xffe0c8, 0xf6d3b0, 0xe7b48f, 0xc98e66, 0x8d5a3c, 0x5a3a2a],
  cloth: [0xe8574a, 0xf08a4a, 0xf4d85a, 0x6abf6a, 0x5ac0b0, 0x4aa0d8, 0x9a7ae8, 0xf0a0c0, 0xf4f0e8, 0x3b4a7a, 0x4a3a5a, 0x262230],
};
const DEFAULTS = [
  { id: 'c1', name: '모리', skin: 0xf6d3b0, hair: 0x5a3a28, eye: 0x6a4228, hairStyle: 'short', top: 'hood', topC: 0xe8574a, bottom: 'pants', botC: 0x3b4a7a, hat: 'none', hatC: 0xf4d85a },
  { id: 'c2', name: '별이', skin: 0xffe0c8, hair: 0xe87aa8, eye: 0x9a5ae0, hairStyle: 'twin', top: 'dress', topC: 0xf4d85a, bottom: 'skirt', botC: 0x6a4a8a, hat: 'none', hatC: 0xf4d85a },
  { id: 'c3', name: '하루', skin: 0xe7b48f, hair: 0x262230, eye: 0x3a7ad8, hairStyle: 'spiky', top: 'tee', topC: 0x4aa0d8, bottom: 'shorts', botC: 0x4a3a5a, hat: 'cap', hatC: 0xe8574a },
  { id: 'c4', name: '루나', skin: 0xf6d3b0, hair: 0x5a7ae0, eye: 0x3fb08a, hairStyle: 'long', top: 'shirt', topC: 0xf4f0e8, bottom: 'skirt', botC: 0x3b4a7a, hat: 'none', hatC: 0xf4d85a },
];
let cast = store.get('house.cast.v1', null) || DEFAULTS.map(d => ({ ...d }));

// =====================================================================
// characters
// =====================================================================
const bubbleLayer = $('#bubbles');
const LEAN = 0.3;   // 0 = perfectly upright, 1 = full camera-facing (leans back and sinks into furniture)
const QUAD = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);   // upright quad, pivot at bottom centre (yaw-only billboard)
const shadowGeo = new THREE.CircleGeometry(0.34, 14).rotateX(-Math.PI / 2);
const SAYS = { chat: ['안녕!', '오늘 뭐 했어?', '♪', '배고파…', '후후', '♥', '이리 와봐!', '같이 TV 볼래?'], wander: ['♪', '흠~', '…!', '뭐 하지?'] };
const ACT_TXT = { idle: '멍하니 있는 중', chat: '수다 떠는 중', wander: '집 안을 거니는 중' };
const nextId = () => 'c' + Math.random().toString(36).slice(2, 8);
function spawnChar(def, at) {
  const tex = makeAtlas(def), mat = new THREE.MeshBasicMaterial({ map: tex, alphaTest: 0.5, color: 0xffffff, side: THREE.DoubleSide });
  const sp = new THREE.Mesh(QUAD, mat); sp.rotation.order = 'YXZ'; sp.scale.set(FW * PX, FH * PX, 1); scene.add(sp);
  const sh = new THREE.Mesh(shadowGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 })); scene.add(sh);
  const el = document.createElement('div'); el.className = 'bubble'; bubbleLayer.appendChild(el);
  const nm = document.createElement('div'); nm.className = 'name'; nm.textContent = def.name; bubbleLayer.appendChild(nm);
  const [si, sj] = at || pick(walkList);
  const ch = { def, sp, sh, tex, mat, el, nm, pos: new THREE.Vector3(si * S, 0, sj * S), path: null, pi: 0, state: 'idle', timer: 0.5 + Math.random() * 2, kind: 'wander', spot: null, pose: 'stand', spotY: FLOOR, face: new THREE.Vector2(0, 1), phase: Math.random() * 5, say: '', sayT: 0, chatCd: 3 + Math.random() * 6, speed: 1.2 + Math.random() * 0.3, hidden: false, act: ACT_TXT.idle, forced: false };
  sp.userData.char = ch; chars.push(ch); return ch;
}
function removeChar(ch) { scene.remove(ch.sp); scene.remove(ch.sh); ch.el.remove(); ch.nm.remove(); ch.tex.dispose(); chars.splice(chars.indexOf(ch), 1); if (selected === ch) selected = null; }
function refreshChar(ch) { ch.tex.dispose(); ch.tex = makeAtlas(ch.def); ch.mat.map = ch.tex; ch.mat.needsUpdate = true; ch.nm.textContent = ch.def.name; }

const cell = (v) => Math.round(v / S);
const pos2 = (c) => [cell(c.pos.x), cell(c.pos.z)];
function leaveSpot(c) { if (c.spot && (c.pose !== 'stand' || c.hidden)) { c.pos.set(c.spot.walk[0] * S, 0, c.spot.walk[1] * S); } c.pose = 'stand'; c.hidden = false; c.spot = null; }
function occupied(spot, except) { return chars.some(o => o !== except && (o.spot === spot || (o.plan && o.plan.spot === spot))); }
function goSpot(c, spot, forced = false) {
  leaveSpot(c); const [ci, cj] = pos2(c), p = findPath(ci, cj, spot.walk[0], spot.walk[1]);
  if (!p) { c.state = 'idle'; c.timer = 1; return false; }
  c.plan = { spot }; c.path = p; c.pi = 1; c.state = p.length < 2 ? 'walk' : 'walk'; c.kind = spot.kind; c.act = spot.txt; c.forced = forced;
  if (p.length < 2) { c.path = [p[0], p[0]]; c.pi = 1; }
  return true;
}
function goCell(c, ti, tj, txt = ACT_TXT.wander, forced = false) {
  leaveSpot(c); const [ci, cj] = pos2(c), p = findPath(ci, cj, ti, tj); if (!p || p.length < 2) { c.state = 'idle'; c.timer = 0.6; return false; }
  c.plan = { spot: null }; c.path = p; c.pi = 1; c.state = 'walk'; c.kind = 'wander'; c.act = txt; c.forced = forced; return true;
}
function chooseAct(c) {
  const W = { dusk: { tv: 3, cook: 2, eat: 2, read: 1.2, view: 1.2, wash: 1, bath: 1, sleep: .4, dress: .6, wander: 1.5, out: .5 }, night: { tv: 2, cook: .4, eat: .4, read: 1, view: .6, wash: 1.5, bath: 1.5, sleep: 5, dress: .6, wander: .5, out: .1 }, day: { tv: 1.5, cook: 2.5, eat: 2.5, read: 1.5, view: 1.5, wash: 1, bath: .5, sleep: .3, dress: .8, wander: 2, out: 1.5 } }[mode];
  let tot = 0; for (const k in W) tot += W[k]; let r = Math.random() * tot, kind = 'wander'; for (const k in W) { r -= W[k]; if (r <= 0) { kind = k; break; } }
  if (kind === 'wander') { const [ci, cj] = pos2(c), near = walkList.filter(([i, j]) => Math.hypot(i - ci, j - cj) > 4 && Math.hypot(i - ci, j - cj) < 14); const [ti, tj] = pick(near.length ? near : walkList); goCell(c, ti, tj); return; }
  const free = SPOTS.filter(s => s.kind === kind && !occupied(s, c)); if (!free.length) { c.state = 'idle'; c.timer = 1.5; return; }
  goSpot(c, pick(free));
}
function faceToward(c, x, z) { const dx = x - c.pos.x, dz = z - c.pos.z, l = Math.hypot(dx, dz) || 1; c.face.set(dx / l, dz / l); }
function speak(c, arr) { c.say = pick(arr); c.sayT = 2.8; }
function arrive(c) {
  const sp = c.plan && c.plan.spot; c.state = 'act'; c.path = null;
  if (sp) {
    c.spot = sp; c.pose = sp.pose; c.spotY = sp.y ?? FLOOR; c.pos.set(sp.at[0] * S, 0, sp.at[1] * S); c.face.set(sp.face[0], sp.face[1]);
    if (sp.kind === 'out') { c.hidden = true; c.timer = 10 + Math.random() * 14; }
    else c.timer = sp.kind === 'sleep' ? 22 + Math.random() * 20 : sp.kind === 'bath' ? 14 + Math.random() * 10 : 10 + Math.random() * 14;
    if (Math.random() < .85) speak(c, sp.say);
  } else if (c.kind === 'intimate') {   // adult scenes are never drawn: the two just stand close with a "19♥" bubble
    c.timer = 20 + Math.random() * 8; c.say = '19♥'; c.sayT = c.timer; c.act = '둘만의 시간 (19♥)'; if (c.partner) faceToward(c, c.partner.pos.x, c.partner.pos.z);
  } else { c.timer = 0.8 + Math.random() * 2; if (Math.random() < .3) speak(c, SAYS.wander); }
}
function startChat(a, b) {
  for (const [p, q] of [[a, b], [b, a]]) { leaveSpot(p); p.state = 'chat'; p.path = null; p.timer = 4 + Math.random() * 2; p.chatCd = 16 + Math.random() * 10; p.act = ACT_TXT.chat; p.forced = false; faceToward(p, q.pos.x, q.pos.z); }
  speak(a, SAYS.chat); b.sayT = -1.2;
}

const camFwd = new THREE.Vector3(), camRight = new THREE.Vector3(), tmpV = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
function stepChars(t, dt) {
  camera.getWorldDirection(camFwd); camFwd.y = 0; camFwd.normalize(); camRight.crossVectors(camFwd, UP).normalize(); const camYaw = Math.atan2(-camFwd.x, -camFwd.z); const camLean = (Math.PI / 2 - controls.getPolarAngle()) * LEAN;
  for (const c of chars) {
    c.chatCd -= dt; c.sayT -= dt; let moving = false;
    if (c.state === 'idle') { c.timer -= dt; if (c.timer <= 0 && settings.auto) chooseAct(c); }
    else if (c.state === 'walk') {
      const tgt = c.path[c.pi], tx = tgt[0] * S, tz = tgt[1] * S, dx = tx - c.pos.x, dz = tz - c.pos.z, d = Math.hypot(dx, dz), step = c.speed * settings.speed * dt;
      if (d <= step) { c.pos.x = tx; c.pos.z = tz; c.pi++; if (c.pi >= c.path.length) arrive(c); } else { c.pos.x += dx / d * step; c.pos.z += dz / d * step; c.face.set(dx / d, dz / d); moving = true; }
    } else if (c.state === 'act') {
      c.timer -= dt;
      if (c.timer <= 0) { const wasOut = c.hidden; leaveSpot(c); c.state = 'idle'; c.timer = 0.3 + Math.random() * 1.5; c.act = ACT_TXT.idle; c.forced = false; if (wasOut) speak(c, ['다녀왔어!', '밖에 좋더라']); }
      else if (c.spot && c.spot.kind !== 'sleep' && Math.random() < dt * 0.1) speak(c, c.spot.say);
    } else if (c.state === 'chat') { c.timer -= dt; if (c.timer <= 0) { c.state = 'idle'; c.timer = 0.3; } else if (c.sayT <= 0) speak(c, SAYS.chat); }
    if ((c.state === 'walk' || c.state === 'idle') && c.chatCd <= 0 && !c.hidden && settings.auto) for (const o of chars) {
      if (o === c || o.hidden || (o.state !== 'walk' && o.state !== 'idle') || o.chatCd > 0) continue;
      if (Math.hypot(o.pos.x - c.pos.x, o.pos.z - c.pos.z) < 1.1) { startChat(c, o); break; }
    }
    if (c.state === 'walk' && c.kind === 'chat' && c.partner && Math.hypot(c.partner.pos.x - c.pos.x, c.partner.pos.z - c.pos.z) < 1.4 && !c.partner.hidden) { startChat(c, c.partner); c.partner = null; }
    c.phase += moving ? dt * c.speed * settings.speed * 4.2 : 0;
    const frame = moving ? (Math.floor(c.phase) % 2 === 0 ? 1 : 2) : 0;
    const a = c.face.x * camFwd.x + c.face.y * camFwd.z, b = c.face.x * camRight.x + c.face.y * camRight.z;
    let dir, flip = 1, col = frame; if (Math.abs(b) > Math.abs(a)) { dir = 2; flip = b >= 0 ? 1 : -1; } else dir = a > 0 ? 1 : 0;
    let crop = 1, rot = 0, baseY = FLOOR, lying = false;
    if (c.pose === 'sit') { crop = 0.82; baseY = c.spotY; col = 3; }
    else if (c.pose === 'bath') { crop = 0.55; baseY = c.spotY; col = 0; dir = 0; flip = 1; }
    else if (c.pose === 'lie') { lying = true; rot = -Math.PI / 2; baseY = c.spotY + 0.28; col = 0; dir = 0; flip = 1; }
    const tex = c.tex, vb = 1 - (dir + 1) / 3;
    tex.repeat.set(flip / 4, crop / 3); tex.offset.x = (flip > 0 ? col : col + 1) / 4; tex.offset.y = vb + (1 - crop) / 3;
    const sh = FH * PX * crop; c.sp.scale.set(FW * PX, sh, 1); c.mat.color.copy(cur.tint);
    c.sp.rotation.set(-camLean, camYaw, rot);                              // stays upright, only turns around Y to face the camera
    const nx = -camFwd.x * 0.12, nz = -camFwd.z * 0.12;             // nudge toward camera so feet never sink into furniture
    if (lying) c.sp.position.set(c.pos.x - camRight.x * sh / 2 + nx, baseY, c.pos.z - camRight.z * sh / 2 + nz);
    else c.sp.position.set(c.pos.x + nx, baseY - (crop < 1 ? 0 : PX), c.pos.z + nz);
    c.sp.visible = !c.hidden;
    c.sh.position.set(c.pos.x, FLOOR + 0.03, c.pos.z); c.sh.visible = !c.hidden && c.pose === 'stand';
    c.topY = lying ? baseY + 0.7 : baseY + FH * PX * crop + 0.1;
  }
}

// ---------- external commands ----------
function findChars(who) { if (!who || who === '*' || who === 'all') return chars.slice(); return chars.filter(c => c.def.name === who || c.def.id === who); }
function doAction(who, action, partner, place) {
  const targets = findChars(who); if (!targets.length) return false;
  for (const c of targets) {
    if (action === 'chat') {
      const o = (partner && findChars(partner)[0]) || chars.filter(x => x !== c && !x.hidden).sort((p, q) => Math.hypot(p.pos.x - c.pos.x, p.pos.z - c.pos.z) - Math.hypot(q.pos.x - c.pos.x, q.pos.z - c.pos.z))[0]; if (!o) continue;
      leaveSpot(o); o.state = 'idle'; o.timer = 3; const [oi, oj] = pos2(o); const near = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]].map(([a, b]) => [oi + a, oj + b]).filter(([i, j]) => isWalk(i, j));
      const pc = place ? pairCells(placeCells(place), placeIsRoom(place)) : null;
      if (pc) { for (const [p, cell, mate] of [[c, pc[0], o], [o, pc[1], c]]) { const ok = goCell(p, cell[0], cell[1], PLACE_KO[place] + '에서 대화하러 가는 중', true); p.kind = 'chat'; p.partner = mate; p.chatCd = 0; if (!ok) { p.plan = { spot: null }; arrive(p); } } }
      else if (near.length && goCell(c, ...near[0], '대화하러 가는 중', true)) { c.kind = 'chat'; c.partner = o; c.chatCd = 0; o.chatCd = 0; }
    } else if (action === 'intimate') {
      if (c.kind === 'intimate' && c.state !== 'idle') continue;
      const o = (partner && findChars(partner)[0]) || chars.filter(x => x !== c && !x.hidden).sort((p, q) => Math.hypot(p.pos.x - c.pos.x, p.pos.z - c.pos.z) - Math.hypot(q.pos.x - c.pos.x, q.pos.z - c.pos.z))[0]; if (!o || o === c) continue;
      // where: the place named in the text (sofa, table, bathtub, a room...); with no place, beside the bed
      let cells = place ? pairCells(placeCells(place), placeIsRoom(place)) : null;
      if (!cells) { const bed = SPOTS.find(s => s.kind === 'sleep'), base = bed ? bed.walk : [0, 3]; cells = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1]].map(([a, b]) => [base[0] + a, base[1] + b]).filter(([i, j]) => isWalk(i, j)); }
      if (cells.length < 2) continue;
      for (const [p, cell, mate] of [[c, cells[0], o], [o, cells[1], c]]) {
        const ok = goCell(p, cell[0], cell[1], '둘만의 시간 (19♥)', true); p.kind = 'intimate'; p.partner = mate; p.chatCd = 90;
        if (!ok) { p.plan = { spot: null }; arrive(p); }
      }
    } else if (action.startsWith('goto_')) {
      const room = action.slice(5), list = roomCells[room]; if (!list) continue; const [ti, tj] = pick(list); goCell(c, ti, tj, ROOM_KO[room] + '(으)로 이동 중', true);
    } else if (ACT_KINDS.includes(action)) {
      let all = SPOTS.filter(s => s.kind === action);
      if (place) { const ps = placeSpots(place), narrowed = all.filter(s => ps.includes(s)); if (narrowed.length) all = narrowed; }   // prefer the spot at the named place
      const free = all.filter(s => !occupied(s, c)); goSpot(c, pick(free.length ? free : all), true);
    }
  }
  return true;
}
const onMsg = (e) => { const d = e.data; if (d && d.type === 'scene' && typeof d.action === 'string') doAction(d.who, d.action, d.partner, d.place); else if (d && d.type === 'story' && typeof d.text === 'string') applyStory(d.text); }; window.addEventListener('message', onMsg);

// =====================================================================
// overlay (bubbles / names / room tags)
// =====================================================================
const selCard = null; let selected = null;
function updateOverlay() {
  const W = VW(), H = VH();
  for (const c of chars) {
    tmpV.set(c.pos.x, c.topY ?? 2.2, c.pos.z).project(camera);
    const vis = !c.hidden && tmpV.z < 1 && Math.abs(tmpV.x) < 1.1 && Math.abs(tmpV.y) < 1.1;
    const x = (tmpV.x * .5 + .5) * W, y = (-tmpV.y * .5 + .5) * H;
    c.el.style.left = x + 'px'; c.el.style.top = (y - 2) + 'px'; if (c.el.textContent !== c.say) c.el.textContent = c.say; c.el.classList.toggle('show', vis && c.sayT > 0);
    c.nm.style.left = x + 'px'; c.nm.style.top = (y + 2) + 'px'; c.nm.classList.toggle('show', vis && (settings.names || c === selected));
  }
  if (settings.roomtag) for (const r in ROOMTAG_POS) { tmpV.set(ROOMTAG_POS[r][0] * S, 0.4, ROOMTAG_POS[r][1] * S).project(camera); roomTagEls[r].style.left = (tmpV.x * .5 + .5) * W + 'px'; roomTagEls[r].style.top = (-tmpV.y * .5 + .5) * H + 'px'; }
}
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
renderer.domElement.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const rc = renderer.domElement.getBoundingClientRect(); ndc.set((e.clientX - rc.left) / rc.width * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hit = ray.intersectObjects(chars.filter(c => !c.hidden).map(c => c.sp), false)[0];
  selected = hit ? hit.object.userData.char : null; renderCast();
});

// =====================================================================
// UI: side panel
// =====================================================================
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.style.opacity = 1; clearTimeout(toast.h); toast.h = setTimeout(() => t.style.opacity = 0, 1800); }
let openPanel = null;
function showPanel(name) {
  if (openPanel === name) name = null; openPanel = name;
  $('#panel').classList.toggle('open', !!name);
  $$('#rail button').forEach(b => b.classList.toggle('on', b.dataset.p === name || (name === 'create' && b.dataset.p === 'create')));
  $$('.sec').forEach(s => s.classList.toggle('on', s.id === 's-' + name));
  if (name === 'cast') renderCast(); if (name === 'create') { if (!editing) startCreate(null); } if (name === 'scene') renderScene();
}
$$('#rail button').forEach(b => b.addEventListener('click', () => { if (b.dataset.p === 'create') editing = editing; showPanel(b.dataset.p); }));

// --- cast list ---
function thumb(def) { const cv = document.createElement('canvas'); cv.width = FW; cv.height = FH; const x = cv.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(atlasCanvas(def), 0, 0, FW, FH, 0, 0, FW, FH); return cv; }
function renderCast() {
  const box = $('#castList'); box.innerHTML = '';
  chars.forEach(c => {
    const d = document.createElement('div'); d.className = 'card' + (c === selected ? ' sel' : '');
    d.appendChild(thumb(c.def));
    const t = document.createElement('div'); t.className = 't'; t.innerHTML = `${c.def.name}<small>${c.act}</small>`; d.appendChild(t);
    const e = document.createElement('button'); e.textContent = '수정'; e.onclick = (ev) => { ev.stopPropagation(); startCreate(c); showPanel('create'); openPanel === 'create' || showPanel('create'); }; d.appendChild(e);
    const x = document.createElement('button'); x.textContent = '삭제'; x.onclick = (ev) => { ev.stopPropagation(); if (chars.length <= 1) return toast('최소 1명은 있어야 해요'); removeChar(c); cast = chars.map(k => k.def); store.set('house.cast.v1', cast); renderCast(); renderScene(); }; d.appendChild(x);
    d.onclick = () => { selected = selected === c ? null : c; renderCast(); };
    box.appendChild(d);
  });
  $('#newChar').style.display = chars.length >= 8 ? 'none' : '';
}
const castTimer = setInterval(() => { if (openPanel === 'cast') renderCast(); }, 1500);
$('#newChar').onclick = () => { startCreate(null); openPanel = null; showPanel('create'); };

// --- creator ---
let draft = null, editing = null, dirty = true, pvAtlas = null;
const rows = {};
function chipRow(key) { const el = $('#o-' + key); el.innerHTML = ''; OPT[key].forEach(([v, label]) => { const b = document.createElement('button'); b.className = 'chip'; b.textContent = label; b.dataset.v = v; b.onclick = () => { draft[key] = v; syncCreator(); }; el.appendChild(b); }); }
function swRow(key, list) { const el = $('#o-' + key); el.innerHTML = ''; list.forEach(c => { const b = document.createElement('button'); b.className = 'sw'; b.style.background = css(c); b.dataset.v = c; b.onclick = () => { draft[key] = c; syncCreator(); }; el.appendChild(b); }); const inp = document.createElement('input'); inp.type = 'color'; inp.oninput = () => { draft[key] = parseInt(inp.value.slice(1), 16); syncCreator(true); }; el.appendChild(inp); rows[key] = inp; }
['hairStyle', 'top', 'bottom', 'hat'].forEach(chipRow);
swRow('hair', PAL.hair); swRow('eye', PAL.eye); swRow('skin', PAL.skin); swRow('topC', PAL.cloth); swRow('botC', PAL.cloth); swRow('hatC', PAL.cloth);
function syncCreator(fromPicker) {
  for (const key of ['hairStyle', 'top', 'bottom', 'hat']) $$('#o-' + key + ' .chip').forEach(b => b.classList.toggle('on', b.dataset.v === draft[key]));
  for (const key of ['hair', 'eye', 'skin', 'topC', 'botC', 'hatC']) { $$('#o-' + key + ' .sw').forEach(b => b.classList.toggle('on', +b.dataset.v === draft[key])); if (!fromPicker) rows[key].value = css(draft[key]); }
  const dress = draft.top === 'dress'; $('#o-bottom').classList.toggle('dis', dress); $('#o-botC').classList.toggle('dis', dress); $('#dressNote').textContent = dress ? '(원피스는 하의가 없어요)' : '';
  $$('#o-bottom .chip').forEach(b => b.classList.toggle('dis', dress));
  $('#o-hatC').style.opacity = draft.hat === 'none' ? .35 : 1;
  dirty = true;
}
function startCreate(ch) {
  editing = ch; draft = ch ? { ...ch.def } : { id: nextId(), name: '', skin: pick(PAL.skin), hair: pick(PAL.hair), eye: pick(PAL.eye), hairStyle: pick(OPT.hairStyle)[0], top: pick(OPT.top)[0], topC: pick(PAL.cloth), bottom: pick(OPT.bottom)[0], botC: pick(PAL.cloth), hat: 'none', hatC: pick(PAL.cloth) };
  $('#cName').value = draft.name; $('#createTitle').textContent = ch ? '✏️ 캐릭터 수정' : '✨ 캐릭터 만들기'; $('#cSave').textContent = ch ? '저장하기' : '집에 추가하기'; syncCreator();
}
$('#cName').oninput = (e) => { draft.name = e.target.value; };
$('#cRand').onclick = () => { const n = draft.name, id = draft.id; draft = { id, name: n, skin: pick(PAL.skin), hair: pick(PAL.hair), eye: pick(PAL.eye), hairStyle: pick(OPT.hairStyle)[0], top: pick(OPT.top)[0], topC: pick(PAL.cloth), bottom: pick(OPT.bottom)[0], botC: pick(PAL.cloth), hat: Math.random() < .25 ? pick(OPT.hat.slice(1))[0] : 'none', hatC: pick(PAL.cloth) }; syncCreator(); };
$('#cCancel').onclick = () => { editing = null; openPanel = 'create'; showPanel('create'); };
$('#cSave').onclick = () => {
  const name = (draft.name || '').trim(); if (!name) return toast('이름을 입력해 주세요');
  if (chars.some(c => c !== editing && c.def.name === name)) return toast('같은 이름이 이미 있어요');
  draft.name = name;
  if (editing) { editing.def = { ...draft }; refreshChar(editing); toast(name + ' 저장했어요'); }
  else { if (chars.length >= 8) return toast('최대 8명까지예요'); const ch = spawnChar({ ...draft }, [-7, 14]); ch.state = 'idle'; ch.timer = 0.4; speak(ch, ['안녕! 잘 부탁해', '여기가 우리 집이구나!']); toast(name + ' 입주 완료!'); }
  cast = chars.map(c => c.def); store.set('house.cast.v1', cast); editing = null; openPanel = 'create'; showPanel('cast'); renderScene();
};
// preview animation
const pvCtx = [0, 1, 2].map(i => { const c = $('#pv' + i); c.width = FW * 5; c.height = FH * 5; return c.getContext('2d'); });
function drawPreview(ts) {
  if (!alive) return; requestAnimationFrame(drawPreview);
  if (openPanel !== 'create' || !draft) return;
  if (dirty) { pvAtlas = atlasCanvas(draft); dirty = false; }
  const frames = [[0, 0], [Math.floor(ts / 200) % 2 + 1, 2], [0, 1]];
  frames.forEach(([col, row], n) => { const x = pvCtx[n]; x.imageSmoothingEnabled = false; x.clearRect(0, 0, FW * 5, FH * 5); x.fillStyle = 'rgba(255,255,255,.07)'; x.fillRect(0, 0, FW * 5, FH * 5); x.drawImage(pvAtlas, col * FW, row * FH, FW, FH, 0, 0, FW * 5, FH * 5); });
}
requestAnimationFrame(drawPreview);

// --- scene tester ---
function renderScene() {
  const sel = $('#sceneWho'), keep = sel.value; sel.innerHTML = '<option value="*">모두</option>' + chars.map(c => `<option value="${c.def.id}">${c.def.name}</option>`).join(''); if ([...sel.options].some(o => o.value === keep)) sel.value = keep;
  const pl = $('#scenePlace'); if (!pl.options.length) pl.innerHTML = '<option value="">장소 지정 안 함</option>' + Object.keys(PLACE_KO).map(k => '<option value="' + k + '">' + PLACE_KO[k] + '</option>').join('');
  const mk = (el, obj, pre) => { el.innerHTML = ''; for (const k in obj) { const b = document.createElement('button'); b.className = 'chip'; b.textContent = obj[k]; b.onclick = () => doAction(sel.value, pre + k, undefined, pre === 'goto_' ? undefined : (pl.value || undefined)); el.appendChild(b); } };
  mk($('#sceneGo'), GO_KO, 'goto_'); mk($('#sceneAct'), ACT_KO, '');
}
$('#storyEx').onclick = () => { $('#storyIn').value = chars.slice(0, 3).map((c, n) => [c.def.name + '는 소파에 앉아 TV를 봤다.', c.def.name + '는 졸려서 침대로 가서 잠들었다.', c.def.name + '는 주방에서 요리를 시작했다.'][n]).join('\n'); };
$('#storyGo').onclick = () => {
  const res = applyStory($('#storyIn').value), box = $('#storyOut'); box.innerHTML = '';
  if (!res.length) { box.textContent = '읽을 문장이 없어요.'; return; }
  for (const r of res) { const d = document.createElement('div'); d.style.cssText = 'padding:4px 0;border-top:1px solid rgba(255,255,255,.15)';
    d.textContent = r.action ? `✔ "${r.sentence}" → ${r.who.join(', ') === '*' ? '모두' : r.who.join(', ')}: ${actLabel(r.action)} (키워드 '${r.keyword}'${r.place ? ', 장소 ' + PLACE_KO[r.place] : ''})` : `— "${r.sentence}" → 반응 없음`; box.appendChild(d); }
};
function addByName(name) {
  name = String(name || '').trim().slice(0, 16); if (!name || chars.some(c => c.def.name === name) || chars.length >= 8) return false;
  const def = { id: nextId(), name, skin: pick(PAL.skin), hair: pick(PAL.hair), eye: pick(PAL.eye), hairStyle: pick(OPT.hairStyle)[0], top: pick(OPT.top)[0], topC: pick(PAL.cloth), bottom: pick(OPT.bottom)[0], botC: pick(PAL.cloth), hat: 'none', hatC: pick(PAL.cloth) };
  spawnChar(def, [-7, 14]); cast = chars.map(c => c.def); store.set('house.cast.v1', cast); renderCast(); renderScene(); return true;
}
// --- settings ---
function applySettings() {
  R.classList.toggle('nobubble', !settings.bubble); R.classList.toggle('noroomtag', !settings.roomtag);
  bloom.enabled = settings.bloom; controls.autoRotate = settings.rotate; $('#spdVal').textContent = (+settings.speed).toFixed(1);
  $$('#setTod .chip').forEach(b => b.classList.toggle('on', b.dataset.m === mode)); store.set('house.settings.v1', { ...settings, mode });
}
{ const el = $('#setTod'); [['dusk', '🌇 노을'], ['night', '🌙 밤'], ['day', '☀️ 낮']].forEach(([m, l]) => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.m = m; b.textContent = l; b.onclick = () => { mode = m; applySettings(); }; el.appendChild(b); }); }
const bind = (id, key, num) => { const el = $(id); if (el.type === 'checkbox') el.checked = !!settings[key]; else el.value = settings[key]; el.oninput = () => { settings[key] = el.type === 'checkbox' ? el.checked : +el.value; applySettings(); }; };
bind('#setBubble', 'bubble'); bind('#setRoomTag', 'roomtag'); bind('#setNames', 'names'); bind('#setBloom', 'bloom'); bind('#setAuto', 'auto'); bind('#setRotate', 'rotate'); bind('#setSpeed', 'speed');
$('#resetCast').onclick = () => { if (!confirm('캐릭터를 기본 4명으로 되돌릴까요?')) return; [...chars].forEach(removeChar); cast = DEFAULTS.map(d => ({ ...d })); store.set('house.cast.v1', cast); cast.forEach(d => spawnChar({ ...d })); renderCast(); renderScene(); };

// =====================================================================
// post + loop
// =====================================================================
const rt = new THREE.WebGLRenderTarget(VW() * renderer.getPixelRatio(), VH() * renderer.getPixelRatio(), { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(VW(), VH()), 0.45, 0.55, 0.62); composer.addPass(bloom);
const vig = new ShaderPass(VignetteShader); vig.uniforms.offset.value = 1.0; vig.uniforms.darkness.value = 1.0; composer.addPass(vig);
composer.addPass(new OutputPass());

cast.forEach(d => spawnChar({ ...d }));
applySettings();

function applyEnv() {
  skyMat.uniforms.discK.value = cur.discK;
  scene.fog.color.copy(cur.fog); scene.fog.density = cur.den;
  key.color.copy(cur.keyCol); key.intensity = cur.keyInt; key.position.copy(cur.key).normalize().multiplyScalar(50); key.target.position.set(0, 0, 0);
  hemi.color.copy(cur.hSky); hemi.groundColor.copy(cur.hGnd); hemi.intensity = cur.hInt;
  glowMat.color.setScalar(cur.glow); winMat.color.copy(cur.win); starMat.opacity = cur.stars; bloom.strength = cur.bloom; renderer.toneMappingExposure = cur.expo;
  seaMat.color.copy(cur.fog).multiplyScalar(1.12).lerp(cur.hor, 0.08);
  for (const l of lampLights) l.intensity = 9 * cur.lamp;
}
let last = performance.now() / 1000, T = 0;
function frame() {
  const now = performance.now() / 1000, dt = Math.min(0.05, now - last); last = now; T += dt;
  stepEnv(dt); applyEnv();
  const tvOn = chars.some(c => c.spot && c.spot.kind === 'tv' && c.state === 'act');
  tvMat.color.set(tvOn ? lerpHex(0x5ab0ff, 0xffd0a0, (Math.sin(T * 3) * .5 + .5) * (Math.sin(T * 1.3) * .5 + .5)) : 0x14141c).multiplyScalar(tvOn ? 1.2 + cur.glow * 0.3 : 1);
  clouds.forEach(c => { c.m.position.x += c.sp * dt; if (c.m.position.x > 160) c.m.position.x = -160; });
  let a = steam.geometry.attributes.position; const se = emitters.find(e => e.type === 'steam'), cooking = !!se && chars.some(c => c.spot && c.spot.steam && c.state === 'act');
  steamS.forEach((s, q) => { s.t += dt * (cooking ? .6 : 0); if (s.t > 3) s.t = 0; a.setXYZ(q, se ? se.x + Math.sin(s.t * 2 + q) * .2 : 0, cooking ? se.y + s.t * .6 : -50, se ? se.z + Math.cos(s.t + q) * .15 : 0); }); a.needsUpdate = true;
  a = dust.geometry.attributes.position; dustS.forEach((d, q) => a.setXYZ(q, d.x + Math.sin(T * d.sp + d.ph) * .8, d.y + Math.sin(T * d.sp * 1.4 + d.ph) * .4, d.z + Math.cos(T * d.sp * .7 + d.ph) * .6)); a.needsUpdate = true;
  const be = emitters.find(e => e.type === 'bubbles'); a = bubblesTub.geometry.attributes.position; bubS.forEach((s, q) => { s.t = (s.t + dt * .5) % 2; a.setXYZ(q, be ? be.x + Math.sin(q * 5 + s.t) * 1.4 + (q % 3) * .3 - .4 : 0, be ? be.y - .8 + s.t * .3 : -50, be ? be.z + (q % 4) * .25 - .3 : 0); }); a.needsUpdate = true;
  stepChars(T, dt); updateOverlay();
  if (selected && !selected.hidden) controls.target.lerp(tmpV.set(selected.pos.x, 1.2, selected.pos.z), 0.05); else controls.target.lerp(tmpV.set(0, 1.5, 0.5), 0.04);
  controls.update(); composer.render();
}
renderer.setAnimationLoop(frame);
const onResize = () => { if (!VW() || !VH()) return; renderer.setSize(VW(), VH()); composer.setSize(VW(), VH()); camera.aspect = VW() / VH(); camera.updateProjectionMatrix(); }; const ro = new ResizeObserver(onResize); ro.observe(R);
const api = { addByName, placeOf, placeIsRoom, do: doAction, chars, setMode: (m) => { mode = m; stepEnv(0, true); applySettings(); }, KEYWORDS, interpret, applyStory, tick: (sec, dt = 0.05) => { for (let q = 0; q < sec / dt; q++) { T += dt; stepChars(T, dt); } return chars.map(c => c.def.name + ':' + c.state + ':' + c.kind + ':' + c.pos.x.toFixed(1) + ',' + c.pos.z.toFixed(1)).join(' '); }, camera, controls, showPanel, layout: LAYOUT, catalog: CATALOG, rebuild: rebuildFurniture, move: moveFurniture, add: addFurniture, remove: removeFurniture, spots: () => SPOTS };
api.destroy = () => { alive = false; renderer.setAnimationLoop(null); ro.disconnect(); clearInterval(castTimer); window.removeEventListener('message', onMsg); for (const c of [...chars]) removeChar(c); renderer.dispose(); sr.innerHTML = ''; if (opts.global && window[opts.global] === api) delete window[opts.global]; };
api.resize = onResize;
if (opts.global) window[opts.global] = api;

requestAnimationFrame(() => requestAnimationFrame(() => { api.ready = true; window.__ready = true; }));

  return api;
}
