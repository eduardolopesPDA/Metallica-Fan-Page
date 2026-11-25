/* Ilustrações das cenas — Capítulo 4 · ...And Justice for All. Desenhos originais. */
import { clamp, VB, rnd, prepDraw, setDraw, stamp, person, envelope, envelopeUpdate } from './util.js';

export const arts = {
  /* a fila de baixistas que vai sumindo até sobrar o último */
  queue: {
    svg: () => `<svg ${VB}>
      <line class="a-soft" x1="40" y1="380" x2="760" y2="380"/>
      <g class="d2">${Array.from({ length: 9 }, (_, i) => `<g class="q" data-i="${i}">${person(90 + i * 76, 380, 150, i === 8 ? 'a-line a-fillsoft' : 'a-soft')}<rect class="${i === 8 ? 'a-line' : 'a-soft'}" x="${90 + i * 76 + 18}" y="280" width="16" height="96" rx="6"/></g>`).join('')}</g>
    </svg>`,
    update(el, p) {
      el.querySelectorAll('.q').forEach(q => { const i = Number(q.dataset.i); q.style.opacity = i === 8 ? 1 : clamp(1 - (p * 1.4 - i / 10) * 6); });
      const last = el.querySelector('.q[data-i="8"]'); last?.setAttribute('transform', `translate(${(-300 * clamp((p - .55) * 2.5)).toFixed(1)} 0)`);
    },
  },

  /* o ingresso sem nome sendo carimbado */
  'ticket-stamp': {
    svg: () => `<svg ${VB}>
      <g class="d2"><rect class="a-line a-fillsoft" x="200" y="140" width="400" height="170" rx="8"/><line class="a-soft" x1="480" y1="140" x2="480" y2="310" stroke-dasharray="5 6"/>
        <text class="a-tag" x="230" y="190">ADMITE UM</text><line class="a-text" x1="230" y1="232" x2="440" y2="232"/><line class="a-text" x1="230" y1="262" x2="400" y2="262"/></g>
      <g class="d1 st"><rect class="a-line" x="300" y="196" width="230" height="70" rx="6" style="stroke-width:4"/><text class="a-tag" x="415" y="226" text-anchor="middle" style="font-size:14px">RESEDA</text><text class="a-tag" x="415" y="252" text-anchor="middle" style="font-size:14px">08.11.1986</text></g>
    </svg>`,
    update: (el, p) => stamp(el.querySelector('.st'), (p - .25) * 4, 415, 231, -9),
  },

  /* a porta do quarto do hotel e as batidas de madrugada */
  'hotel-door': {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="300" y="60" width="200" height="340"/><circle class="a-line" cx="470" cy="240" r="9"/><rect class="a-line" x="372" y="92" width="56" height="26" rx="3"/><text class="a-tag" x="400" y="111" text-anchor="middle" style="font-size:13px">4:00</text></g>
      <g class="d2">${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2, x = 400 + Math.cos(a) * 30, y = 200 + Math.sin(a) * 40; return `<path class="a-hl knock" d="M${x.toFixed(0)} ${y.toFixed(0)} L${(x + Math.cos(a) * (60 + rnd(i) * 50)).toFixed(0)} ${(y + Math.sin(a) * (60 + rnd(i) * 40)).toFixed(0)}"/>`; }).join('')}</g>
    </svg>`,
    init: el => prepDraw(el, '.knock'),
    update: (el, p) => setDraw(el, '.knock', (p - .15) * 2.5),
  },

  /* a garagem de Lars, forrada com faixas de carpete */
  'garage-carpet': {
    svg: () => `<svg ${VB}>
      <g class="d1"><path class="a-line" d="M120 400 L 120 80 L 680 80 L 680 400"/><line class="a-soft" x1="120" y1="400" x2="680" y2="400"/></g>
      <g class="d2">${Array.from({ length: 10 }, (_, i) => `<rect class="strip" data-i="${i}" x="${130 + i * 54}" y="90" width="48" height="300" style="fill: color-mix(in srgb, var(--accent) 22%, transparent); stroke: var(--accent); stroke-width:1; stroke-dasharray: 3 4"/>`).join('')}</g>
      <g class="d3">${person(560, 400, 170)}</g>
    </svg>`,
    update(el, p) { el.querySelectorAll('.strip').forEach(s => { const k = clamp((p * 1.5 - Number(s.dataset.i) / 12) * 6); s.style.opacity = k; s.setAttribute('height', (300 * k).toFixed(0)); }); },
  },

  /* a mesa de som: o fader do baixo desce sozinho */
  fader: {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="180" y="60" width="440" height="340" rx="8"/>
        ${['VOZ', 'GUITARRA', 'BATERIA', 'BAIXO'].map((n, i) => `<line class="a-soft" x1="${260 + i * 100}" y1="100" x2="${260 + i * 100}" y2="330"/><rect class="a-line ${i === 3 ? 'bassfd' : ''}" x="${244 + i * 100}" y="${130 + (i * 23) % 50}" width="32" height="20" rx="3" style="${i === 3 ? 'fill: var(--accent)' : ''}"/><text class="a-tag" x="${260 + i * 100}" y="370" text-anchor="middle" style="font-size:11px">${n}</text>`).join('')}</g>
      <path class="a-wave bw" d=""/>
    </svg>`,
    update(el, p) {
      const k = clamp((p - .15) * 1.8);
      el.querySelector('.bassfd')?.setAttribute('transform', `translate(0 ${(190 * k).toFixed(1)})`);
      const w = el.querySelector('.bw'); if (!w) return;
      let d = ''; for (let x = 200; x <= 600; x += 5) { const y = 30 + Math.sin(x / 9 + p * 20) * 18 * (1 - k * .95); d += (x === 200 ? 'M' : ' L') + x + ' ' + y.toFixed(1); }
      w.setAttribute('d', d);
    },
  },

  /* a balança gigante racha e desaba, em passos secos */
  'scale-fall': {
    svg: () => `<svg ${VB}>
      <g class="d1"><line class="a-line" x1="400" y1="110" x2="400" y2="390"/><path class="a-line a-fillsoft" d="M320 400 H 480 L 460 382 H 340 Z"/><circle class="a-line a-fillsoft" cx="400" cy="104" r="10"/></g>
      <g class="d2"><g class="beam"><line class="a-line" x1="190" y1="110" x2="610" y2="110"/></g>
        <g class="pl"><line class="a-line" x1="190" y1="110" x2="150" y2="230"/><line class="a-line" x1="190" y1="110" x2="230" y2="230"/><path class="a-line a-fillsoft" d="M138 230 Q 190 262 242 230 Z"/></g>
        <g class="pr"><line class="a-line" x1="610" y1="110" x2="570" y2="230"/><line class="a-line" x1="610" y1="110" x2="650" y2="230"/><path class="a-line a-fillsoft" d="M558 230 Q 610 262 662 230 Z"/></g></g>
      <g class="d3">${Array.from({ length: 7 }, (_, i) => `<path class="a-hl cr" d="M400 ${130 + i * 36} l ${(rnd(i) * 40 - 20).toFixed(0)} 18 l ${(rnd(i + 3) * 30 - 15).toFixed(0)} 16"/>`).join('')}</g>
    </svg>`,
    init: el => prepDraw(el, '.cr'),
    update(el, p) {
      const step = v => Math.floor(clamp(v) * 6) / 6; // movimento em steps, seco
      setDraw(el, '.cr', step((p - .1) * 2));
      const f = step((p - .45) * 2);
      el.querySelector('.beam')?.setAttribute('transform', `translate(0 ${(f * 260).toFixed(0)}) rotate(${(f * 18).toFixed(0)} 400 110)`);
      el.querySelector('.pl')?.setAttribute('transform', `translate(${(-f * 60).toFixed(0)} ${(f * 170).toFixed(0)}) rotate(${(-f * 40).toFixed(0)} 190 110)`);
      el.querySelector('.pr')?.setAttribute('transform', `translate(${(f * 40).toFixed(0)} ${(f * 150).toFixed(0)}) rotate(${(f * 55).toFixed(0)} 610 110)`);
    },
  },

  /* a luz em Morse soletrando o nome da música */
  morse: {
    svg: () => `<svg ${VB}>
      <g class="d1"><circle class="lamp" cx="400" cy="170" r="70" style="fill: #2a2d2c"/></g>
      <g class="d2"><text class="a-big m-o" x="320" y="350" text-anchor="middle">O</text><text class="a-big m-n" x="400" y="350" text-anchor="middle">N</text><text class="a-big m-e" x="480" y="350" text-anchor="middle">E</text>
        <text class="a-tag" x="400" y="410" text-anchor="middle">— — —   — ·   ·</text></g>
    </svg>`,
    update(el, p) {
      // sequência O (---) N (-.) E (.) em unidades de tempo
      const seq = [3, 1, 3, 1, 3, 3, 3, 1, 1, 3, 1, 4];
      const total = seq.reduce((a, b) => a + b, 0);
      let t = (p * 1.2 % 1) * total, on = false, idx = 0;
      for (; idx < seq.length; idx++) { if (t < seq[idx]) { on = idx % 2 === 0; break; } t -= seq[idx]; }
      const lamp = el.querySelector('.lamp');
      if (lamp) { lamp.style.fill = on ? '#f4fff9' : '#2a2d2c'; lamp.style.filter = on ? 'drop-shadow(0 0 30px rgba(200,255,230,.8))' : 'none'; }
      const shown = p * 1.2 >= 1 ? 3 : [6, 10, 12].filter(n => idx >= n).length;
      ['.m-o', '.m-n', '.m-e'].forEach((s, i) => { const n = el.querySelector(s); if (n) n.style.opacity = i < shown ? 1 : .1; });
    },
  },

  /* o envelope do Grammy: não é o nome deles */
  'envelope-lose': {
    svg: () => `<svg ${VB}>${envelope('GRAMMY · 1989', 'JETHRO TULL')}</svg>`,
    update: envelopeUpdate,
  },
};
