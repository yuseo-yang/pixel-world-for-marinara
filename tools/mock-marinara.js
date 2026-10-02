// Fake Marinara endpoints for local testing of the extension bundle (see tools/csp-harness.html)
window.__mockTracker = { text: '소파에서 TV를 보는 중' };
const realFetch = window.fetch.bind(window);
window.fetch = (url, opts) => {
  const u = String(url);
  if (u === '/api/chats') return Promise.resolve(new Response(JSON.stringify([{ id: '11111111-2222-3333-4444-555555555555', updatedAt: '2026-10-02' }]), { status: 200 }));
  if (u.endsWith('/game-state')) return Promise.resolve(new Response(JSON.stringify({ presentCharacters: [
    { name: '모리', customFields: { '행동': window.__mockTracker.text } },
    { name: '새친구', customFields: { '행동': '창밖을 구경하는 중' } },
    { name: '하루', customFields: { '기분': '좋음' } },
  ] }), { status: 200 }));
  return realFetch(url, opts);
};
