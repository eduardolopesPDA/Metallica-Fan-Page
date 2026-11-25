/* =========================================================
   MAPA DE ROTA — desenho original e simplificado.
   Cada capítulo desenha seus trechos por cima dos trechos dos
   capítulos anteriores, que ficam esmaecidos.
   Configure em data/story.js:
     export const mapConfig = {
       bounds: { lonMin, lonMax, latMin, latMax }, // recorte do mundo
       land: ['M… Z', …],                           // contornos em coordenadas 1000×520
     };
   Com mapConfig = null, usa o recorte do projeto de referência
   (América do Norte e Europa desenhadas à mão). O export precisa
   existir, mesmo nulo: o bundler recusa importar um nome que não existe.
   ========================================================= */
import { places, story, storyOrder, mapConfig } from '../../data/story.js';

const W = 1000, H = 520;
const B = mapConfig?.bounds || { lonMin: -130, lonMax: 45, latMin: 28, latMax: 66 };
export const project = ({ lat, lon }) => ({
  x: (lon - B.lonMin) / (B.lonMax - B.lonMin) * W,
  y: (B.latMax - lat) / (B.latMax - B.latMin) * H,
});

const LAND = mapConfig?.land || [
  // América do Norte
  'M10 70 C 120 40 260 50 340 80 C 390 100 410 150 390 200 C 375 235 372 270 362 305 C 352 345 340 372 310 400 C 270 430 230 460 180 476 C 130 488 80 478 50 452 C 30 430 20 400 16 360 C 8 280 4 180 10 70 Z',
  // Europa
  'M640 300 C 650 250 680 210 700 190 C 720 160 760 150 780 160 C 790 120 800 80 830 50 C 860 30 900 30 930 50 C 950 70 980 70 1000 80 L 1000 360 C 950 380 900 370 860 360 C 820 380 780 390 740 380 C 700 380 660 360 640 330 Z',
  // Ilhas Britânicas
  'M700 160 C 708 140 732 138 740 156 C 750 176 744 204 726 208 C 708 208 694 182 700 160 Z',
];

function arc(a, b) {
  const p = project(places[a]), q = project(places[b]);
  const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
  const d = Math.hypot(q.x - p.x, q.y - p.y);
  return `M${p.x.toFixed(1)} ${p.y.toFixed(1)} Q ${mx.toFixed(1)} ${(my - d * .22).toFixed(1)} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
}

/**
 * Desenha o mapa dentro de `host` para o capítulo `chapterId`.
 * opts.mini: versão pequena, sem nomes.  opts.only: índice de um trecho do capítulo para destacar.
 * Devolve { setProgress(p) } — p de 0 a 1 percorre os trechos atuais em sequência.
 */
export function createMap(host, chapterId, opts = {}) {
  if (!host) return { setProgress() {} };
  const idx = storyOrder.indexOf(chapterId);
  // opts.all (ou capítulo com allRoads): a estrada inteira, como no epílogo
  if (story[chapterId]?.allRoads) opts = { ...opts, all: true };
  const done = opts.all ? [] : storyOrder.slice(0, Math.max(0, idx)).flatMap(id => story[id].route);
  let current = opts.all ? storyOrder.flatMap(id => story[id].route) : (story[chapterId]?.route || []);
  if (opts.only != null) current = current.slice(0, opts.only + 1);
  const used = new Set([...done, ...current].flat());

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('class', 'map' + (opts.mini ? ' map--mini' : ''));
  let s = '';
  for (let x = 0; x <= W; x += 100) s += `<line class="map__grid" x1="${x}" y1="0" x2="${x}" y2="${H}"/>`;
  for (let y = 0; y <= H; y += 104) s += `<line class="map__grid" x1="0" y1="${y}" x2="${W}" y2="${y}"/>`;
  s += LAND.map(d => `<path class="map__land" d="${d}"/>`).join('');
  s += done.map(([a, b]) => `<path class="map__done" d="${arc(a, b)}"/>`).join('');
  s += current.map(([a, b]) => `<path class="map__current" d="${arc(a, b)}"/>`).join('');
  for (const [id, pl] of Object.entries(places)) {
    if (!used.has(id)) continue;
    const { x, y } = project(pl);
    s += `<circle class="map__dot" data-place="${id}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${opts.mini ? 5 : 4.5}"/>`;
    const [dx, dy, anchor = 'start'] = pl.label || [9, -8];
    if (!opts.mini) s += `<text class="map__label" x="${(x + dx).toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}">${pl.name}</text>`;
  }
  svg.innerHTML = s;
  host.appendChild(svg);

  const segs = [...svg.querySelectorAll('.map__current')].map(el => {
    const L = el.getTotalLength(); el.style.strokeDasharray = L; el.style.strokeDashoffset = L; return { el, L };
  });
  const dots = Object.fromEntries([...svg.querySelectorAll('.map__dot')].map(d => [d.dataset.place, d]));
  const endOf = current.map(([, b]) => b);

  return {
    setProgress(p) {
      const n = segs.length || 1;
      segs.forEach((sg, i) => {
        const k = Math.max(0, Math.min(1, p * n - i));
        sg.el.style.strokeDashoffset = sg.L * (1 - k);
        dots[endOf[i]]?.classList.toggle('is-lit', k >= 1);
      });
      if (current[0]) dots[current[0][0]]?.classList.add('is-lit');
    },
  };
}
