/* Ilustrações das cenas — Capítulo 5 · Black Album. Desenhos originais. */
import { clamp, VB, rnd, prepDraw, setDraw, envelope, envelopeUpdate } from './util.js';

export const arts = {
  /* o mesmo envelope do capítulo 4; agora é o nome deles */
  'envelope-win': {
    svg: () => `<svg ${VB}>${envelope('GRAMMY · 1990', 'METALLICA · ONE')}</svg>`,
    update: envelopeUpdate,
  },

  /* a ficha do estúdio: "só mixagem" riscado, "produção" escrito */
  'studio-card': {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="230" y="60" width="340" height="330" rx="4"/>
        <text class="a-tag" x="260" y="104">FICHA DE ESTÚDIO</text><line class="a-soft" x1="260" y1="120" x2="540" y2="120"/>
        <text class="a-tag" x="260" y="170" style="font-size:13px">PRODUTOR</text><text class="a-big" x="260" y="214" style="font-size:30px">BOB ROCK</text>
        <text class="a-tag" x="260" y="270" style="font-size:13px">FUNÇÃO</text>
        <text class="a-tag" x="260" y="306" style="font-size:18px">SÓ MIXAGEM</text><path class="a-hl strike" d="M254 300 L 410 300"/>
        <text class="a-big new" x="260" y="356" style="font-size:28px; fill: var(--accent)">PRODUÇÃO</text></g>
    </svg>`,
    init: el => prepDraw(el, '.strike'),
    update(el, p) { setDraw(el, '.strike', (p - .2) * 4); const n = el.querySelector('.new'); if (n) n.style.opacity = clamp((p - .45) * 4); },
  },

  /* o gravador de fita no quarto escuro, a luz vermelha acesa */
  'tape-recorder': {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="250" y="230" width="300" height="150" rx="10"/>
        <rect class="a-dark" x="290" y="260" width="140" height="80" rx="6"/><circle class="a-line" cx="330" cy="300" r="18"/><circle class="a-line" cx="390" cy="300" r="18"/>
        <circle class="rec" cx="500" cy="270" r="9" style="fill: #ff3b30"/><text class="a-tag" x="500" y="304" text-anchor="middle" style="font-size:11px">REC</text></g>
      <path class="a-wave riff" d=""/>
    </svg>`,
    update(el, p) {
      const r = el.querySelector('.rec'); if (r) r.style.opacity = Math.sin(p * 40) > 0 ? 1 : .25;
      const w = el.querySelector('.riff'); if (!w) return;
      const end = 120 + 560 * clamp(p * 1.4);
      let d = ''; for (let x = 120; x <= end; x += 4) { const k = (x - 120) / 560, seg = Math.floor(k * 8) % 4; const y = 150 + Math.sin(x / 14) * (seg === 3 ? 34 : 18) * Math.sign(Math.sin(x / 70) + .2); d += (x === 120 ? 'M' : ' L') + x + ' ' + y.toFixed(1); }
      w.setAttribute('d', d);
    },
  },

  /* o violão no quarto de hotel; as cordas viram arcos de orquestra */
  'violin-arcs': {
    svg: () => `<svg ${VB}>
      <g class="d3">${Array.from({ length: 7 }, (_, i) => `<path class="arc" data-i="${i}" d="M${300 - i * 30} 300 Q 400 ${170 - i * 26} ${500 + i * 30} 300" style="fill: none; stroke: #f0c27a; stroke-width: 2; filter: drop-shadow(0 0 8px #f0c27a)"/>`).join('')}</g>
      <g class="d1" transform="rotate(-20 400 330)">
        <path class="a-line a-fillsoft" d="M380 300 C 350 300 340 338 360 358 C 328 378 338 432 400 432 C 462 432 472 378 440 358 C 460 338 450 300 420 300 Z"/>
        <circle class="a-line" cx="400" cy="368" r="11"/><rect class="a-line" x="394" y="150" width="12" height="152"/>
      </g>
    </svg>`,
    update(el, p) { el.querySelectorAll('.arc').forEach(a => { a.style.opacity = clamp((p * 1.5 - Number(a.dataset.i) / 9) * 5) * .9; }); },
  },

  /* o calendário de outubro a junho e os faders que não param */
  calendar: {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="140" y="90" width="220" height="250" rx="6"/><rect class="a-accentfill" x="140" y="90" width="220" height="50" rx="6" opacity=".6"/>
        <text class="a-tag yr" x="250" y="124" text-anchor="middle">1990</text><text class="a-big mo" x="250" y="250" text-anchor="middle" style="font-size:56px">OUT</text></g>
      <g class="d2"><rect class="a-line a-fillsoft" x="430" y="120" width="250" height="230" rx="6"/>${Array.from({ length: 6 }, (_, i) => `<line class="a-soft" x1="${465 + i * 36}" y1="150" x2="${465 + i * 36}" y2="320"/><rect class="a-line fd" data-i="${i}" x="${455 + i * 36}" y="230" width="20" height="14" rx="2"/>`).join('')}</g>
    </svg>`,
    update(el, p) {
      const months = ['OUT', 'NOV', 'DEZ', 'JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN'];
      const i = Math.min(8, Math.floor(clamp(p * 1.15) * 9));
      const m = el.querySelector('.mo'), y = el.querySelector('.yr');
      if (m) m.textContent = months[i]; if (y) y.textContent = i < 3 ? '1990' : '1991';
      el.querySelectorAll('.fd').forEach(f => { f.setAttribute('transform', `translate(0 ${(Math.sin(p * 26 + Number(f.dataset.i) * 1.7) * 60).toFixed(1)})`); });
    },
  },

  /* o contador de vendas da primeira semana */
  counter: {
    svg: () => `<svg ${VB}>
      <g class="d1"><text class="a-big num" x="400" y="240" text-anchor="middle" style="font-size:110px">0</text><text class="a-tag" x="400" y="300" text-anchor="middle">CÓPIAS NA PRIMEIRA SEMANA</text></g>
      <g class="d2 n1"><circle class="a-line a-fillsoft" cx="400" cy="380" r="34"/><text class="a-big" x="400" y="394" text-anchor="middle" style="font-size:30px">Nº 1</text></g>
    </svg>`,
    update(el, p) {
      const n = el.querySelector('.num'); if (n) n.textContent = Math.round(598000 * clamp(p * 1.6) ** .6).toLocaleString('pt-BR');
      const b = el.querySelector('.n1'); if (b) b.style.opacity = clamp((p - .6) * 4);
    },
  },

  /* duas datas lado a lado, ligadas pela linha da estrada */
  'two-dates': {
    svg: () => `<svg ${VB}>
      <g class="d1"><text class="a-big" x="200" y="210" text-anchor="middle" style="font-size:50px">27.09.1986</text><text class="a-tag" x="200" y="250" text-anchor="middle" style="font-size:12px">SUÉCIA</text></g>
      <g class="d2"><text class="a-big d2t" x="600" y="210" text-anchor="middle" style="font-size:50px">28.09.1991</text><text class="a-tag d2t" x="600" y="250" text-anchor="middle" style="font-size:12px">MOSCOU</text></g>
      <path class="a-under road" d="M200 280 C 300 380 500 380 600 280"/>
    </svg>`,
    init: el => prepDraw(el, '.road'),
    update(el, p) { setDraw(el, '.road', (p - .15) * 2); el.querySelectorAll('.d2t').forEach(t => { t.style.opacity = clamp((p - .55) * 4); }); },
  },
};
