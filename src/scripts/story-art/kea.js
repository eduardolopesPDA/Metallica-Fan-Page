/* Ilustrações das cenas — Capítulo 1 · Kill 'Em All (traço de fanzine). Desenhos originais. */
import { clamp, VB, rnd, prepDraw, setDraw, typeText, stamp, person } from './util.js';

export const arts = {
  /* a loja de discos, o toca-discos e o cheque de US$ 1.500 */
  'record-store': {
    svg: () => {
      let recs = '';
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) recs += `<rect class="a-line" x="${140 + i * 30 + (r % 2) * 6}" y="${86 + r * 70}" width="${16 + rnd(i + r * 9) * 8}" height="56" rx="1"/>`;
      return `<svg ${VB}>
        <g class="d1"><line class="a-soft" x1="120" y1="80" x2="680" y2="80"/>${recs}<line class="a-soft" x1="120" y1="290" x2="680" y2="290"/></g>
        <g class="d2"><rect class="a-line a-fillsoft" x="400" y="300" width="300" height="90"/>
          <rect class="a-line" x="560" y="270" width="120" height="30" rx="3"/><g class="disc"><circle class="a-line" cx="620" cy="262" r="26"/><circle class="a-accentfill" cx="620" cy="262" r="8"/></g></g>
        <g class="d3 check"><rect class="a-line a-fillsoft" x="120" y="320" width="230" height="92" rx="3"/>
          <text class="a-tag" x="138" y="356">PAGUE A</text><line class="a-text" x1="138" y1="372" x2="300" y2="372"/>
          <text class="a-big" x="330" y="402" text-anchor="end" style="font-size:30px">US$ 1.500</text></g>
      </svg>`;
    },
    update(el, p) {
      el.querySelector('.disc')?.setAttribute('transform', `rotate(${(p * 900).toFixed(1)} 620 262)`);
      el.querySelector('.check')?.setAttribute('transform', `translate(${(-260 + 300 * clamp((p - .15) * 2)).toFixed(1)} 0)`);
    },
  },

  /* o corredor do prédio de salas de ensaio em Queens */
  corridor: {
    svg: () => {
      let doors = '';
      for (let i = 0; i < 4; i++) {
        const t = i / 4, x1 = 120 + t * 230, x2 = 120 + (t + .18) * 230, y1 = 70 + t * 120, y2 = 400 - t * 110;
        doors += `<path class="a-line a-fillsoft" d="M${x1} ${y1 + 40} L${x2} ${y1 + 62} L${x2} ${y2 - 20} L${x1} ${y2}"/>`;
        doors += `<path class="a-line a-fillsoft" d="M${800 - x1} ${y1 + 40} L${800 - x2} ${y1 + 62} L${800 - x2} ${y2 - 20} L${800 - x1} ${y2}"/>`;
        doors += `<text class="a-tag" x="${x1 + 8}" y="${y1 + 80}" style="font-size:12px">${12 + i}</text>`;
      }
      return `<svg ${VB}>
        <g class="d1"><path class="a-soft" d="M0 20 L 360 210 M800 20 L 440 210 M0 440 L 360 250 M800 440 L 440 250"/><rect class="a-line" x="360" y="210" width="80" height="40"/></g>
        <g class="d2">${doors}</g>
        <g class="d3 room" opacity="0"><rect class="a-dark" x="560" y="250" width="150" height="100"/><rect class="a-line" x="572" y="320" width="120" height="22" rx="4"/><rect class="a-line" x="610" y="270" width="36" height="46" rx="3"/></g>
      </svg>`;
    },
    update(el, p) { const r = el.querySelector('.room'); if (r) r.style.opacity = clamp((p - .45) * 3); },
  },

  /* o telefone de disco tocando; o fio atravessa o país */
  phone: {
    svg: () => `<svg ${VB}>
      <g class="d1 ph"><path class="a-line a-fillsoft" d="M150 360 L 190 250 L 330 250 L 370 360 Z"/>
        <circle class="a-line" cx="260" cy="310" r="40"/>${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 1.6 - 2.4; return `<circle class="a-line" cx="${(260 + Math.cos(a) * 28).toFixed(1)}" cy="${(310 + Math.sin(a) * 28).toFixed(1)}" r="5"/>`; }).join('')}
        <path class="a-line a-fillsoft hand" d="M170 236 Q 160 214 184 206 L 336 206 Q 360 214 350 236 L 330 244 Q 324 228 300 228 L 220 228 Q 196 228 190 244 Z"/></g>
      <path class="a-under cord" d="M360 330 C 450 400 520 260 600 300 S 720 360 790 300"/>
      <text class="a-tag" x="690" y="270" style="font-size:12px">NOVA YORK</text>
    </svg>`,
    init: el => prepDraw(el, '.cord'),
    update(el, p) {
      const ring = p < .35 ? Math.sin(p * 220) * 3 : 0;
      el.querySelector('.hand')?.setAttribute('transform', `translate(0 ${(-Math.abs(ring)).toFixed(1)}) rotate(${(ring).toFixed(1)} 260 220)`);
      setDraw(el, '.cord', (p - .3) * 2);
    },
  },

  /* 9h da manhã; o ônibus sai do terminal no sentido oposto */
  'bus-clock': {
    svg: () => `<svg ${VB}>
      <g class="d1"><circle class="a-line a-fillsoft" cx="160" cy="140" r="70"/>${Array.from({ length: 12 }, (_, k) => { const a = k / 12 * Math.PI * 2; return `<line class="a-soft" x1="${(160 + Math.sin(a) * 58).toFixed(1)}" y1="${(140 - Math.cos(a) * 58).toFixed(1)}" x2="${(160 + Math.sin(a) * 66).toFixed(1)}" y2="${(140 - Math.cos(a) * 66).toFixed(1)}"/>`; }).join('')}
        <line class="a-hand" x1="160" y1="140" x2="160" y2="96"/><line class="a-hand" x1="160" y1="140" x2="124" y2="140"/><text class="a-tag" x="160" y="236" text-anchor="middle">9H</text></g>
      <line class="a-soft" x1="0" y1="392" x2="800" y2="392"/>
      <g class="d2 bus"><rect class="a-line a-fillsoft" x="300" y="290" width="260" height="90" rx="12"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect class="a-line" x="${330 + i * 42}" y="304" width="32" height="28" rx="3"/>`).join('')}
        <rect class="a-accentfill" x="300" y="346" width="260" height="8"/>
        <circle class="a-line" cx="350" cy="384" r="16"/><circle class="a-line" cx="510" cy="384" r="16"/>
        <text class="a-tag" x="430" y="282" text-anchor="middle" style="font-size:12px">← CALIFÓRNIA</text></g>
    </svg>`,
    update(el, p) { el.querySelector('.bus')?.setAttribute('transform', `translate(${(260 - 700 * clamp((p - .15) * 1.3)).toFixed(1)} 0)`); },
  },

  /* o gravador de rolo em Rochester */
  'studio-tape': {
    svg: () => {
      const reel = (cx, cls) => `<g class="${cls}"><circle class="a-line a-fillsoft" cx="${cx}" cy="170" r="70"/><circle class="a-line" cx="${cx}" cy="170" r="14"/>${[0, 120, 240].map(a => `<rect class="a-line" x="${cx - 6}" y="112" width="12" height="40" rx="3" transform="rotate(${a} ${cx} 170)"/>`).join('')}</g>`;
      return `<svg ${VB}>
        <g class="d2"><rect class="a-line a-fillsoft" x="200" y="80" width="400" height="300" rx="10"/>${reel(300, 'r1')}${reel(500, 'r2')}
          <path class="a-line" d="M300 240 L 360 300 L 440 300 L 500 240"/><rect class="a-dark" x="330" y="320" width="140" height="40" rx="3"/>
          <text class="a-tag ctr" x="400" y="347" text-anchor="middle">10 MAI</text></g>
        <g class="d1"><ellipse class="a-line cym" cx="690" cy="120" rx="70" ry="10"/><line class="a-line" x1="690" y1="128" x2="690" y2="390"/></g>
      </svg>`;
    },
    update(el, p) {
      el.querySelector('.r1')?.setAttribute('transform', `rotate(${(p * 1440).toFixed(0)} 300 170)`);
      el.querySelector('.r2')?.setAttribute('transform', `rotate(${(p * 1440).toFixed(0)} 500 170)`);
      el.querySelector('.cym')?.setAttribute('transform', `rotate(${(Math.sin(p * 30) * 8).toFixed(1)} 690 120)`);
      const c = el.querySelector('.ctr'); if (c) c.textContent = `${Math.round(10 + 17 * clamp(p * 1.3))} MAI`;
    },
  },

  /* o título recusado leva uma martelada; o novo aparece */
  rejected: {
    svg: () => `<svg ${VB}>
      <g class="d2"><rect class="a-line a-fillsoft" x="240" y="60" width="320" height="320"/>
        <g class="old"><text class="a-big" x="400" y="190" text-anchor="middle" style="font-size:34px">METAL UP</text><text class="a-big" x="400" y="236" text-anchor="middle" style="font-size:34px">YOUR ASS</text></g>
        <g class="st"><rect class="a-line" x="300" y="260" width="200" height="54" style="stroke: var(--accent); stroke-width: 4"/><text class="a-big" x="400" y="300" text-anchor="middle" style="font-size:30px; fill: var(--accent)">RECUSADO</text></g>
        <g class="new" opacity="0"><text class="a-big" x="400" y="210" text-anchor="middle" style="font-size:46px">KILL 'EM ALL</text></g></g>
      <g class="d1">${Array.from({ length: 9 }, (_, i) => { const a = i / 9 * Math.PI * 2; return `<path class="a-hl crack" d="M400 220 L${(400 + Math.cos(a) * 90 + rnd(i) * 20).toFixed(0)} ${(220 + Math.sin(a) * 80).toFixed(0)} L${(400 + Math.cos(a + .1) * 200).toFixed(0)} ${(220 + Math.sin(a + .1) * 170).toFixed(0)}"/>`; }).join('')}</g>
    </svg>`,
    init: el => prepDraw(el, '.crack'),
    update(el, p) {
      stamp(el.querySelector('.st'), (p - .2) * 5, 400, 287);
      setDraw(el, '.crack', (p - .45) * 6);
      const old = el.querySelector('.old'), nw = el.querySelector('.new'), st = el.querySelector('.st');
      const k = clamp((p - .55) * 4);
      if (old) old.style.opacity = 1 - k; if (st && p > .55) st.style.opacity = 1 - k; if (nw) nw.style.opacity = k;
    },
  },

  /* a parede de flyers da primeira turnê */
  flyers: {
    svg: () => {
      let f = '';
      for (let i = 0; i < 12; i++) {
        const x = 110 + (i % 6) * 100 + rnd(i) * 20, y = 80 + Math.floor(i / 6) * 150 + rnd(i + 9) * 30, r = (rnd(i + 4) - .5) * 14;
        f += `<g class="fl" data-i="${i}" transform="rotate(${r.toFixed(1)} ${x + 40} ${y + 60})"><rect class="a-line a-fillsoft" x="${x}" y="${y}" width="80" height="116"/><text class="a-tag" x="${x + 40}" y="${y + 34}" text-anchor="middle" style="font-size:11px">AO VIVO</text><line class="a-text" x1="${x + 12}" y1="${y + 60}" x2="${x + 68}" y2="${y + 60}"/><line class="a-text" x1="${x + 12}" y1="${y + 78}" x2="${x + 56}" y2="${y + 78}"/><rect class="a-accentfill" x="${x + 36}" y="${y - 4}" width="8" height="10"/></g>`;
      }
      return `<svg ${VB}><g class="d2">${f}</g><g class="d1"><text class="a-big" x="400" y="430" text-anchor="middle" style="font-size:28px">25.07.1983</text></g></svg>`;
    },
    update(el, p) { el.querySelectorAll('.fl').forEach(g => { g.style.opacity = clamp((p * 1.5 - Number(g.dataset.i) / 14) * 8); }); },
  },
};
