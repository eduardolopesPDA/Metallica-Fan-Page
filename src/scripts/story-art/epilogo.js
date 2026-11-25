/* Ilustrações das cenas — Epílogo. Desenhos originais. */
import { clamp, VB } from './util.js';
import { createMap } from '../core/map.js';

/* os seis fios da década, em ano decimal (fatos confirmados na pesquisa) */
const THREADS = [
  { name: 'A estrada', color: '#e8c27a', points: [1983.2, 1983.28, 1984.04, 1986.74, 1991.74] },
  { name: 'A garagem', color: '#d9775a', points: [1981.33, 1983.2, 1985.4, 1987.4] },
  { name: 'Copenhague', color: '#7fb39d', points: [1984.14, 1985.7, 1988.05, 1990.76] },
  { name: 'Cliff', color: '#8fdcff', points: [1982.9, 1983.4, 1984.3, 1985.8, 1986.74, 1988.3] },
  { name: 'Mustaine', color: '#c99ae8', points: [1982.5, 1983.28, 1984.57, 1985.5] },
  { name: 'One e o Grammy', color: '#f2f2f2', points: [1989.05, 1989.14, 1990.15] },
];
const X = y => 170 + (y - 1981) / 10.8 * 600;

export const arts = {
  /* o mapa com a estrada inteira se desenhando */
  'map-all': {
    svg: () => '',
    init(el) { el._map = createMap(el, 'epilogo', { all: true }); },
    update(el, p) { el._map?.setProgress(clamp((p - .05) / .7)); },
  },

  /* os seis fios numa linha do tempo de 1981 a 1991 */
  threads: {
    svg: () => {
      let s = '';
      for (let y = 1981; y <= 1991; y++) s += `<line class="a-soft" x1="${X(y)}" y1="40" x2="${X(y)}" y2="400" style="opacity:.25"/><text class="a-tag" x="${X(y)}" y="430" text-anchor="middle" style="font-size:11px">${y}</text>`;
      THREADS.forEach((t, i) => {
        const yy = 70 + i * 60;
        s += `<text class="a-tag" x="150" y="${yy + 5}" text-anchor="end" style="font-size:12px; fill:${t.color}">${t.name.toUpperCase()}</text>`;
        s += `<line class="thr" data-i="${i}" x1="${X(t.points[0])}" y1="${yy}" x2="${X(t.points.at(-1))}" y2="${yy}" style="stroke:${t.color}; stroke-width:3; stroke-linecap:round; filter: drop-shadow(0 0 6px ${t.color})"/>`;
        const a0 = t.points[0], span = (t.points.at(-1) - a0) || 1;
        t.points.forEach((pt) => { s += `<circle class="tdot" data-i="${i}" data-f="${((pt - a0) / span).toFixed(3)}" cx="${X(pt).toFixed(1)}" cy="${yy}" r="6" style="fill:${t.color}"/>`; });
      });
      s += `<line x1="${X(1986.74)}" y1="40" x2="${X(1986.74)}" y2="400" style="stroke:#fff; stroke-dasharray:4 6; opacity:.5"/><line x1="${X(1991.74)}" y1="40" x2="${X(1991.74)}" y2="400" style="stroke:#fff; stroke-dasharray:4 6; opacity:.5"/>`;
      return `<svg ${VB}>${s}</svg>`;
    },
    init(el) { el.querySelectorAll('.thr').forEach(l => { const L = l.getTotalLength(); l.style.strokeDasharray = L; l.style.strokeDashoffset = L; l.dataset.len = L; }); },
    update(el, p) {
      const k = i => clamp((p - .04 - i * .05) * 2.4);
      el.querySelectorAll('.thr').forEach(l => { l.style.strokeDashoffset = l.dataset.len * (1 - k(Number(l.dataset.i))); });
      el.querySelectorAll('.tdot').forEach(d => { const on = k(Number(d.dataset.i)) >= Number(d.dataset.f) - .001; d.style.opacity = on ? 1 : 0; d.style.transform = on ? 'scale(1)' : 'scale(.2)'; });
    },
  },

  /* os números depois da década */
  numbers: {
    svg: () => `<svg ${VB}>
      <g class="d1"><text class="a-big n1" x="230" y="220" text-anchor="middle" style="font-size:58px">0</text><text class="a-tag" x="230" y="260" text-anchor="middle" style="font-size:12px">CÓPIAS NOS EUA · SOUNDSCAN</text></g>
      <g class="d2"><text class="a-big n2" x="570" y="220" text-anchor="middle" style="font-size:58px">0×</text><text class="a-tag" x="570" y="260" text-anchor="middle" style="font-size:12px">PLATINA · RIAA · 2025</text></g>
    </svg>`,
    update(el, p) {
      const k = clamp(p * 2.2) ** .5;
      const a = el.querySelector('.n1'), b = el.querySelector('.n2');
      if (a) a.textContent = Math.round(16000000 * k).toLocaleString('pt-BR');
      if (b) b.textContent = Math.round(20 * clamp((p - .12) * 2.4) ** .5) + '×';
    },
  },

  /* para Cliff: só a frase, sem imagem */
  cliff: { svg: () => `<svg ${VB}></svg>` },
};
