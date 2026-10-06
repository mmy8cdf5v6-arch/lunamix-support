// Builds the public Lunamix support site (GitHub Pages) from each edition's store Markdown.
import fs from 'node:fs';
import { esc, inline } from './inline.mjs';
const editions = [
  { dir: 'kids', name: 'Lunamix Kids', src: '../Project/docs/store' },
  { dir: 'girlie', name: 'Lunamix Girlie', src: './girlie/source' },
  { dir: 'fashionista', name: 'Lunamix Fashionista', src: '../Fashionista-Edition/docs/store' },
  { dir: 'heroes', name: 'Lunamix Heroes', src: '../Heroes-Edition/docs/store' },
  { dir: 'monsters', name: 'Lunamix Monsters', src: '../Monsters-Edition/docs/store' },
  { dir: 'fc', name: 'Lunamix FC', src: '../Football-Edition/docs/store' },
  { dir: 'dinosaurs', name: 'Lunamix Dinosaurs', src: '../../dinosaurs/docs/store/release-1.0' },
];
function md(src) {
  const out = []; let para = [];
  const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; } };
  for (const line of src.split('\n')) {
    if (/^# /.test(line)) { flush(); out.push(`<h1>${inline(line.slice(2))}</h1>`); }
    else if (/^## /.test(line)) { flush(); out.push(`<h2>${inline(line.slice(3))}</h2>`); }
    else if (!line.trim()) flush(); else para.push(line.trim());
  }
  flush(); return out.join('\n');
}
const page = (title, body, nav) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title>
<style>:root{--paper:#fffaf0;--ink:#414458;--muted:#747487;--lilac:#8A5CE6;--pink:#F062A8}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.6 ui-rounded,'Arial Rounded MT Bold',system-ui,sans-serif}main{max-width:720px;margin:auto;padding:32px 20px 60px}h1{color:var(--lilac);font-size:30px;line-height:1.2;margin:0 0 16px}h2{color:var(--pink);font-size:20px;margin:28px 0 6px}a{color:var(--lilac)}nav{display:flex;gap:16px;margin-bottom:24px;font-size:15px}footer{margin-top:40px;color:var(--muted);font-size:14px}</style></head>
<body><main><nav>${nav}</nav>${body}<footer>Lunamix apps by Tolga Yeniyurt</footer></main></body></html>`;
let index = '<h1>Lunamix apps — support</h1>';
for (const e of editions) {
  const nav = `<a href="../">All apps</a><a href="support.html">Support</a><a href="privacy.html">Privacy</a>`;
  fs.mkdirSync(e.dir, { recursive: true });
  fs.writeFileSync(`${e.dir}/support.html`, page(`${e.name} Support`, md(fs.readFileSync(`${e.src}/support.en.md`, 'utf8')), nav));
  fs.writeFileSync(`${e.dir}/privacy.html`, page(`${e.name} Privacy Policy`, md(fs.readFileSync(`${e.src}/privacy-policy.en.md`, 'utf8')), nav));
  index += `<h2>${esc(e.name)}</h2><p><a href="${e.dir}/support.html">Support</a> · <a href="${e.dir}/privacy.html">Privacy Policy</a></p>`;
}
fs.writeFileSync('index.html', page('Lunamix apps — support', index, ''));
console.log('built', editions.map(e => e.dir).join(', '));
