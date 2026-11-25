/* =========================================================
   FOLHAS DE CONTATO — captura todas as cenas do filme de cada
   página e checa problemas comuns.

   Configuração por variáveis de ambiente:
     BASE_URL   endereço do site (padrão http://localhost:4321)
     PAGES      caminhos separados por "|" (padrão: "|" = só a home)
                ex.: "|capitulo-1/|capitulo-2/|epilogo/"
     BROWSER    caminho do Chrome/Edge (se usar puppeteer-core)
     OUT        pasta de saída (padrão ./capturas)
   Argumentos: <mobile|tablet|desktop> [reduce]

   Para cada página: uma captura por cena + uma folha de contato,
   e um relatório com rolagem lateral, erros de console e
   sobreposições (legenda × controle, legenda × pontos,
   cartela × minimapa, legenda fora da tela, arte sobre a legenda).
   ========================================================= */
let puppeteer;
try { puppeteer = require('puppeteer'); } catch { puppeteer = require('puppeteer-core'); }
const fs = require('fs');
const path = require('path');

const [mode = 'mobile', reduce] = process.argv.slice(2);
const BASE = (process.env.BASE_URL || 'http://localhost:4321').replace(/\/$/, '');
const PAGES = (process.env.PAGES ?? '').split('|');
const OUT = path.resolve(process.env.OUT || 'capturas');
const VP = {
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
  tablet: { width: 820, height: 1180, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900 },
}[mode];
const toURL = p => 'file:///' + p.split(path.sep).join('/');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await puppeteer.launch({ headless: 'new', args: ['--hide-scrollbars'], ...(process.env.BROWSER ? { executablePath: process.env.BROWSER } : {}) });
  const report = [];
  for (const pg of PAGES) {
    const p = await b.newPage();
    await p.setViewport(VP);
    if (reduce) await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errs.push(m.text()); });
    await p.goto(`${BASE}/${pg}`, { waitUntil: 'load', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000)); // loader e abertura

    const info = await p.evaluate(() => {
      const s = document.querySelector('.story');
      if (!s) return null;
      let t = 0, el = s; while (el) { t += el.offsetTop; el = el.offsetParent; }
      return { top: t, h: s.offsetHeight, n: s.querySelectorAll('.scene').length };
    });
    const name = pg.replace(/\//g, '') || 'home';
    const shots = [], issues = [];
    for (let i = 0; info && i < info.n; i++) {
      // 62% da cena: a legenda já apareceu e a animação está no meio
      const y = info.top + (i + .62) / info.n * (info.h - VP.height);
      await p.evaluate(y => window.scrollTo(0, y), Math.round(y));
      await new Promise(r => setTimeout(r, 1300));
      const found = await p.evaluate(() => {
        const vis = [...document.querySelectorAll('.scene')].find(s => getComputedStyle(s).visibility !== 'hidden' && Number(getComputedStyle(s).opacity) > .6);
        if (!vis) return [];
        const R = el => el && el.getBoundingClientRect();
        const shown = el => el && getComputedStyle(el).display !== 'none' && Number(getComputedStyle(el).opacity) > .1;
        const hit = (a, b) => a && b && a.width && b.width && a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2;
        const text = R(vis.querySelector('.scene__text')), card = R(vis.querySelector('.scene__card'));
        const ctl = document.querySelector('.story__control'), mini = document.querySelector('.minimap'), dots = document.querySelector('.story__progress');
        const out = [];
        if (shown(ctl) && hit(text, R(ctl))) out.push('legenda × controle');
        if (shown(mini) && hit(card, R(mini))) out.push('cartela × minimapa');
        if (shown(dots) && hit(text, R(dots))) out.push('legenda × pontos');
        if (text && (text.bottom > innerHeight || text.top < 0)) out.push('legenda fora da tela');
        const svg = vis.querySelector('.scene__art svg');
        if (svg && text && svg.getBBox) {
          const bb = svg.getBBox(), m = svg.getScreenCTM();
          if (m && bb.height) { const bottom = m.f + (bb.y + bb.height) * m.d; if (bottom > text.top + 4) out.push(`arte sobre a legenda (${Math.round(bottom - text.top)}px)`); }
        }
        return out;
      });
      if (found.length) issues.push(`cena ${i}: ${found.join(', ')}`);
      const f = path.join(OUT, `${mode}${reduce ? '-r' : ''}-${name}-${String(i).padStart(2, '0')}.png`);
      await p.screenshot({ path: f });
      shots.push(f);
    }
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    report.push({ name, n: info ? info.n : 0, overflow, errs, issues, shots });
    await p.close();
  }

  // uma folha de contato por página
  const sheet = await b.newPage();
  const cols = mode === 'desktop' ? 4 : 6, w = mode === 'desktop' ? 480 : 260;
  for (const r of report) {
    if (!r.shots.length) continue;
    const html = `<body style="margin:0;background:#333;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:6px;padding:6px;font:12px sans-serif;color:#fff">${r.shots.map((s, i) => `<div><img src="${toURL(s)}" style="width:${w}px;display:block"><span>${i}</span></div>`).join('')}</body>`;
    const tmp = path.join(OUT, '_folha.html');
    fs.writeFileSync(tmp, html);
    await sheet.setViewport({ width: cols * (w + 6) + 6, height: 400 });
    await sheet.goto(toURL(tmp), { waitUntil: 'load' });
    await sheet.screenshot({ path: path.join(OUT, `FOLHA-${mode}${reduce ? '-r' : ''}-${r.name}.png`), fullPage: true });
  }

  for (const r of report) {
    console.log(`${r.name}: ${r.n} cenas | rolagem lateral ${r.overflow}px | ${r.errs.length ? r.errs.join(' / ') : 'sem erros'}${r.issues.length ? '\n   ' + r.issues.join('\n   ') : ''}`);
  }
  await b.close();
})();
