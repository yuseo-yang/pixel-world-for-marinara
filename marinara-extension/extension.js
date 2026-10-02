// Pixel World test extension (full_page_access): shows the pixel house in a small floating window and
// sends it scene commands. Step 1 = prove the connection works. Step 2 (toggle) = see if chat text can be read.
(() => {
  const ISLAND_URL = 'https://yuseo-yang.github.io/pixel-world-for-marinara/';
  const KEYWORDS = { sleep: ['잠', '자다', '침대', 'sleep'], tv: ['tv', '티비', '소파'], cook: ['요리', '부엌', '주방'], eat: ['식사', '밥', '먹'], bath: ['목욕', '욕조'], wash: ['씻', '세수', '양치', '빨래'], read: ['책', '독서'], out: ['외출', '나가'], chat: ['대화', '수다', '이야기'] };
  const log = (...a) => { try { (window.marinara && marinara.log ? marinara.log.info : console.log)('[pixel-world]', ...a); } catch { console.log('[pixel-world]', ...a); } };

  const root = document.createElement('div');
  root.id = 'pixel-world-ext';
  root.style.cssText = 'position:fixed;right:16px;bottom:16px;width:420px;z-index:2147483000;background:#2a1d4a;border:2px solid #fff;font:12px sans-serif;color:#fff;box-shadow:0 4px 18px rgba(0,0,0,.5)';
  root.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;padding:4px 6px;background:#3a2a5e">
      <b style="flex:1">Pixel World</b>
      <label style="cursor:pointer"><input type="checkbox" id="pw-auto"> 채팅 키워드 감지</label>
      <button id="pw-min" style="cursor:pointer">_</button>
    </div>
    <div id="pw-body">
      <iframe id="pw-frame" src="${ISLAND_URL}" style="width:100%;height:240px;border:0;display:block"></iframe>
      <div style="padding:6px;display:flex;flex-wrap:wrap;gap:4px" id="pw-btns"></div>
      <div id="pw-status" style="padding:0 6px 6px;opacity:.8">연결 대기 중…</div>
    </div>`;
  document.body.appendChild(root);
  const frame = root.querySelector('#pw-frame'), status = root.querySelector('#pw-status');
  const send = (action, who = '*') => { frame.contentWindow.postMessage({ type: 'scene', who, action }, '*'); status.textContent = `보냄: ${action} → ${who} (${new Date().toLocaleTimeString()})`; log('sent', action, who); };

  for (const [label, action] of [['잠자기', 'sleep'], ['TV', 'tv'], ['요리', 'cook'], ['식사', 'eat'], ['목욕', 'bath'], ['독서', 'read'], ['외출', 'out'], ['대화', 'chat']]) {
    const b = document.createElement('button'); b.textContent = label; b.style.cssText = 'cursor:pointer;padding:2px 8px'; b.onclick = () => send(action); root.querySelector('#pw-btns').appendChild(b);
  }
  root.querySelector('#pw-min').onclick = () => { const body = root.querySelector('#pw-body'); body.style.display = body.style.display === 'none' ? '' : 'none'; };

  // optional: watch the page for new text and map keywords to actions (this is the real "read the story" test)
  let obs = null;
  root.querySelector('#pw-auto').onchange = (e) => {
    if (obs) { obs.disconnect(); obs = null; }
    if (!e.target.checked) return;
    obs = new MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) {
        if (!(n instanceof HTMLElement) || root.contains(n)) continue;
        const text = (n.textContent || '').toLowerCase(); if (text.length < 4) continue;
        for (const act in KEYWORDS) if (KEYWORDS[act].some(k => text.includes(k))) { log('keyword', act, text.slice(0, 40)); send(act); return; }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    status.textContent = '채팅 키워드 감지 켜짐';
  };
  window.addEventListener('message', (e) => { if (e.source === frame.contentWindow) status.textContent = '섬에서 응답: ' + JSON.stringify(e.data).slice(0, 80); });
  if (window.marinara && marinara.onCleanup) marinara.onCleanup(() => { if (obs) obs.disconnect(); root.remove(); });
})();
