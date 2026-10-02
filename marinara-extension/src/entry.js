// Pixel World for Marinara (full_page_access extension).
// Floating window with the whole pixel house + a reader for Marinara's Character Tracker:
//   GET /api/chats/<chatId>/game-state  ->  presentCharacters[].customFields["행동"]  ->  interpret()  ->  character acts.
import { mount } from '../../src/app.js';

(function () {
  if (window.__pixelWorldExt) { try { window.__pixelWorldExt.destroy(); } catch (e) { /* ignore */ } }
  const KEY = 'pixelworld.ext.v1';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const cfg = Object.assign({ field: '자세,행동,posture,pose,action,activity', chatId: '', poll: true, sec: 3, autoAdd: true, w: 760, h: 480 }, load());
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* ignore */ } };
  const log = (...a) => { try { (window.marinara && window.marinara.log ? window.marinara.log.info : console.log)('[pixel-world]', ...a); } catch (e) { console.log('[pixel-world]', ...a); } };

  // ---------- window ----------
  const wrap = document.createElement('div');
  wrap.id = 'pixel-world-ext';
  wrap.style.cssText = `position:fixed;right:16px;bottom:16px;width:${cfg.w}px;height:${cfg.h}px;min-width:380px;min-height:280px;max-width:98vw;max-height:96vh;z-index:2147483000;display:flex;flex-direction:column;background:#2a1d4a;border:2px solid #fff;box-shadow:0 6px 24px rgba(0,0,0,.55);resize:both;overflow:hidden;font:12px sans-serif;color:#fff;box-sizing:border-box`;
  const btn = 'cursor:pointer;background:rgba(255,255,255,.12);color:#fff;border:1px solid rgba(255,255,255,.4);padding:1px 7px;font:inherit';
  wrap.innerHTML = `
    <div id="pw-head" style="display:flex;align-items:center;gap:6px;padding:4px 8px;background:#3a2a5e;cursor:move;user-select:none;flex:none">
      <b>Pixel World</b><span id="pw-dot" style="opacity:.8;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">트래커 대기 중…</span>
      <button id="pw-set" style="${btn}" title="트래커 연결 설정">⚙</button>
      <button id="pw-full" style="${btn}" title="크게/작게">⛶</button>
      <button id="pw-min" style="${btn}" title="접기">–</button>
      <button id="pw-x" style="${btn}" title="닫기">✕</button>
    </div>
    <div id="pw-cfg" style="display:none;padding:8px;background:#33244f;border-bottom:1px solid rgba(255,255,255,.25);flex:none;line-height:1.9">
      <label>읽을 트래커 필드 이름 (콤마로 여러 개) <input id="pw-field" style="width:100%;box-sizing:border-box"></label>
      <label>채팅 ID (비우면 자동) <input id="pw-chat" style="width:100%;box-sizing:border-box" placeholder="자동"></label>
      <label><input type="checkbox" id="pw-poll"> 트래커 자동으로 읽기</label> &nbsp;
      <label>주기 <input id="pw-sec" type="number" min="1" max="30" style="width:48px"> 초</label> &nbsp;
      <label><input type="checkbox" id="pw-add"> 섬에 없는 이름은 자동 추가</label>
      <div><button id="pw-now" style="${btn}">지금 읽기</button></div>
    </div>
    <div id="pw-island" style="flex:1;min-height:0;position:relative"></div>
    <div id="pw-log" style="flex:none;padding:3px 8px;background:#33244f;font-size:11px;opacity:.9;max-height:54px;overflow:auto"></div>`;
  document.body.appendChild(wrap);
  const $ = (s) => wrap.querySelector(s);
  const app = mount($('#pw-island'), { global: 'pixelWorld' });

  const lines = [];
  const note = (t) => { lines.unshift(`${new Date().toLocaleTimeString()} ${t}`); lines.length = Math.min(lines.length, 4); $('#pw-log').innerHTML = lines.map(l => `<div>${l.replace(/</g, '&lt;')}</div>`).join(''); };
  const dot = (t) => { $('#pw-dot').textContent = t; };

  // drag / buttons
  $('#pw-head').addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    const r = wrap.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    wrap.style.left = r.left + 'px'; wrap.style.top = r.top + 'px'; wrap.style.right = 'auto'; wrap.style.bottom = 'auto';
    const mv = (ev) => { wrap.style.left = Math.max(0, Math.min(innerWidth - 80, ev.clientX - dx)) + 'px'; wrap.style.top = Math.max(0, Math.min(innerHeight - 30, ev.clientY - dy)) + 'px'; };
    const up = () => { removeEventListener('mousemove', mv); removeEventListener('mouseup', up); };
    addEventListener('mousemove', mv); addEventListener('mouseup', up);
  });
  let full = false, saved = null, mini = false;
  $('#pw-full').onclick = () => {
    full = !full;
    if (full) { saved = wrap.style.cssText; wrap.style.cssText += ';left:24px;top:24px;right:24px;bottom:24px;width:auto;height:auto;resize:none'; } else { wrap.style.cssText = saved; }
    app.resize();
  };
  $('#pw-min').onclick = () => { mini = !mini; $('#pw-island').style.display = mini ? 'none' : ''; $('#pw-log').style.display = mini ? 'none' : ''; wrap.style.height = mini ? 'auto' : cfg.h + 'px'; wrap.style.minHeight = mini ? '0' : '280px'; wrap.style.resize = mini ? 'none' : 'both'; };
  $('#pw-set').onclick = () => { const c = $('#pw-cfg'); c.style.display = c.style.display === 'none' ? 'block' : 'none'; };
  $('#pw-x').onclick = () => destroy();
  $('#pw-field').value = cfg.field; $('#pw-chat').value = cfg.chatId; $('#pw-poll').checked = cfg.poll; $('#pw-sec').value = cfg.sec; $('#pw-add').checked = cfg.autoAdd;
  const readCfg = () => { cfg.field = $('#pw-field').value; cfg.chatId = $('#pw-chat').value.trim(); cfg.poll = $('#pw-poll').checked; cfg.sec = Math.max(1, +$('#pw-sec').value || 3); cfg.autoAdd = $('#pw-add').checked; save(); schedule(); };
  for (const id of ['#pw-field', '#pw-chat', '#pw-poll', '#pw-sec', '#pw-add']) $(id).addEventListener('change', readCfg);
  $('#pw-now').onclick = () => { last.clear(); readTracker(true); };

  // ---------- tracker reader ----------
  const SEP = new Set('·:：/|()[]-–—,'.split(''));
  const cleanName = (t) => t.split('').map(ch => SEP.has(ch) ? ' ' : ch).join('').split(' ').filter(Boolean).join(' ').slice(0, 16);
  const last = new Map();      // tracker character name -> last text we reacted to
  let busy = false, timer = null;
  async function findChatId() {
    if (cfg.chatId) return cfg.chatId;
    try { const c = window.marinara && window.marinara.context && window.marinara.context.get && window.marinara.context.get(); if (c && c.chatId) return c.chatId; } catch (e) { /* ignore */ }
    const m = location.href.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i); if (m) return m[0];
    const r = await fetch('/api/chats', { credentials: 'same-origin' }); if (!r.ok) throw new Error('채팅 목록 ' + r.status);
    const data = await r.json(), list = Array.isArray(data) ? data : (data.chats || data.items || []);
    list.sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
    return list[0] && list[0].id;
  }
  async function readTracker(verbose) {
    if (busy) return; busy = true;
    try {
      const id = await findChatId(); if (!id) { dot('채팅을 찾지 못했어요'); return; }
      const r = await fetch('/api/chats/' + encodeURIComponent(id) + '/game-state', { credentials: 'same-origin' });
      if (!r.ok) { dot('트래커 읽기 실패 (' + r.status + ')'); return; }
      const gs = await r.json(); if (!gs) { dot('트래커 데이터가 아직 없어요 (트래커 에이전트를 켜 주세요)'); return; }
      const want = cfg.field.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      // gather every tracker field we can find: per-character custom fields, Custom Tracker rows, world custom fields
      const rows = [];
      for (const pc of gs.presentCharacters || []) for (const k of Object.keys(pc.customFields || {})) rows.push({ owner: pc.name, key: k, value: pc.customFields[k] });
      for (const f of (gs.playerStats && gs.playerStats.customTrackerFields) || []) rows.push({ owner: null, key: f.name, value: f.value });
      for (const f of gs.worldCustomFields || []) rows.push({ owner: null, key: f.name, value: f.value });
      // a row counts when its name contains a wanted word; for flat rows the rest of the name is the character ("미나 자세", "Dick Grayson · 자세")
      const byOwner = new Map();
      for (const row of rows) {
        const key = String(row.key || ''), low = key.toLowerCase(), val = row.value == null ? '' : String(row.value);
        const kw = want.find(w => low.includes(w)); if (!kw || !val) continue;
        let owner = row.owner;
        if (!owner) { const at = low.indexOf(kw); owner = cleanName(key.slice(0, at) + ' ' + key.slice(at + kw.length)); }
        if (!owner) continue;
        byOwner.set(owner, (byOwner.get(owner) ? byOwner.get(owner) + '. ' : '') + val);
      }
      let roomHint = null;
      for (const row of rows) { const k = String(row.key || '').toLowerCase(); if ((k.includes('장소') || k.includes('위치') || k.includes('location')) && row.value) { const pl = app.placeOf(String(row.value)); if (pl && app.placeIsRoom(pl)) { roomHint = pl; break; } } }
      for (const [name, text] of byOwner) {
        const sig = text + '|' + roomHint; if (last.get(name) === sig) continue; last.set(name, sig);
        if (!app.chars.some(c => c.def.name === name)) { if (cfg.autoAdd && app.addByName(name)) note('섬에 ' + name + ' 추가'); else { note("섬에 '" + name + "'이(가) 없어요"); continue; } }
        const hits = app.interpret(text).filter(x => x.action), hit = hits[hits.length - 1];
        const place = hit && (hit.place || roomHint);
        if (hit) { app.do(name, hit.action, (hit.action === 'intimate' || hit.action === 'chat') ? hit.who.find(n => n !== name && n !== '*') : undefined, place); note(name + ' ← "' + text.slice(0, 30) + '" → ' + hit.action + (place ? ' @' + place : '') + " ('" + hit.keyword + "')"); log('tracker', name, text, hit.action); }
        else note(name + ' ← "' + text.slice(0, 30) + '" → 해당 행동 없음');
      }
      dot('트래커 연결됨 · 필드 ' + rows.length + '개 중 행동 ' + byOwner.size + '명');
      if (verbose && !byOwner.size) note("'" + cfg.field + "' 단어가 들어간 필드가 없어요. 찾은 필드: " + rows.map(x => x.key).slice(0, 12).join(', '));
    } catch (e) { dot('트래커 읽기 오류: ' + e.message); } finally { busy = false; }
  }
  function schedule() { clearInterval(timer); if (cfg.poll) timer = setInterval(() => { if (!document.hidden) readTracker(false); }, cfg.sec * 1000); }
  schedule(); setTimeout(() => readTracker(true), 1500);

  function destroy() { clearInterval(timer); try { app.destroy(); } catch (e) { /* ignore */ } wrap.remove(); delete window.__pixelWorldExt; }
  window.__pixelWorldExt = { destroy, app, readTracker };
  if (window.marinara && window.marinara.onCleanup) window.marinara.onCleanup(destroy);
})();
