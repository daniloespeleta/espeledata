/* render-pdf.js — HTML -> PDF via Edge/Chrome DevTools Protocol (no deps).
 * Removes the browser header/footer (displayHeaderFooter:false) and honors
 * the page's @page size/margins. Node 22+ (global fetch + WebSocket).
 *
 *   node render-pdf.js "<edge.exe>" "file:///.../resume.html" "out.pdf"
 */
'use strict';
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EDGE = process.argv[2];
const URL = process.argv[3];
const OUT = process.argv[4];
const PORT = 9300 + Math.floor(Math.random() * 600);
const profile = path.join(os.tmpdir(), 'edgecdp_' + Date.now());
const sleep = ms => new Promise(r => setTimeout(r, ms));

const edge = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--user-data-dir=' + profile, '--remote-debugging-port=' + PORT,
  '--remote-allow-origins=*', 'about:blank',
], { stdio: 'ignore' });

(async () => {
  let pageWs = null;
  for (let i = 0; i < 60 && !pageWs; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      const page = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) pageWs = page.webSocketDebuggerUrl;
    } catch (e) { /* not up yet */ }
    if (!pageWs) await sleep(250);
  }
  if (!pageWs) throw new Error('DevTools page target not found');

  const ws = new WebSocket(pageWs);
  let id = 0, loaded = false;
  const pending = {};
  const send = (method, params = {}) => new Promise(res => { const mid = ++id; pending[mid] = res; ws.send(JSON.stringify({ id: mid, method, params })); });
  await new Promise(r => ws.addEventListener('open', r));
  ws.addEventListener('message', ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending[m.id]) { pending[m.id](m.result); delete pending[m.id]; }
    if (m.method === 'Page.loadEventFired') loaded = true;
  });

  await send('Page.enable');
  await send('Page.navigate', { url: URL });
  for (let i = 0; i < 80 && !loaded; i++) await sleep(150);
  await sleep(1400); // let webfonts finish

  const r = await send('Page.printToPDF', {
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,   // honor @page size + margins from the HTML
  });
  fs.writeFileSync(OUT, Buffer.from(r.data, 'base64'));
  ws.close();
  edge.kill();
  console.log('PDF written: ' + OUT);
  process.exit(0);
})().catch(e => { try { edge.kill(); } catch (_) {} console.error(String(e)); process.exit(1); });
