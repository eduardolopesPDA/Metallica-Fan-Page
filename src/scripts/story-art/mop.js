/* Ilustrações das cenas — Capítulo 3 · Master of Puppets. Desenhos originais.
   As duas últimas cenas (setembro e outubro de 1986) são sóbrias, sem movimento. */
import { clamp, VB, rnd, prepDraw, setDraw, person } from './util.js';

export const arts = {
  /* a garagem de El Cerrito, com cordas descendo do teto */
  'garage-strings': {
    svg: () => `<svg ${VB}>
      <g class="d1"><path class="a-line a-fillsoft" d="M120 400 L 120 90 L 680 90 L 680 400"/><line class="a-soft" x1="120" y1="400" x2="680" y2="400"/>
        <rect class="a-line" x="160" y="300" width="80" height="100" rx="3"/><rect class="a-line" x="560" y="300" width="80" height="100" rx="3"/></g>
      <g class="d2">${[260, 350, 450, 540].map((x, i) => `<g class="str" data-i="${i}"><line class="a-line" x1="${x}" y1="90" x2="${x}" y2="250" style="stroke-width:1.2"/><rect class="a-line a-fillsoft" x="${x - 26}" y="250" width="52" height="8" rx="3"/><line class="a-line" x1="${x - 20}" y1="258" x2="${x - 20}" y2="330" style="stroke-width:1"/><line class="a-line" x1="${x + 20}" y1="258" x2="${x + 20}" y2="330" style="stroke-width:1"/></g>`).join('')}</g>
    </svg>`,
    update(el, p) { el.querySelectorAll('.str').forEach(g => { const i = Number(g.dataset.i); g.setAttribute('transform', `rotate(${(Math.sin(p * 9 + i) * 4).toFixed(2)} ${[260, 350, 450, 540][i]} 90)`); }); },
  },

  /* dois balões em dinamarquês sobre a mesa de som */
  danish: {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="170" y="300" width="460" height="90" rx="6"/>${Array.from({ length: 12 }, (_, i) => `<line class="a-soft" x1="${200 + i * 36}" y1="316" x2="${200 + i * 36}" y2="374"/><rect class="a-line fd" data-i="${i}" x="${192 + i * 36}" y="340" width="16" height="10" rx="2"/>`).join('')}</g>
      <g class="d2"><g class="b1"><path class="a-line a-fillsoft" d="M150 90 L 380 90 Q 400 90 400 110 L 400 170 Q 400 190 380 190 L 230 190 L 196 226 L 204 190 L 150 190 Q 130 190 130 170 L 130 110 Q 130 90 150 90 Z"/><text class="a-big" x="265" y="155" text-anchor="middle" style="font-size:34px">Æ Ø Å …</text></g>
        <g class="b2"><path class="a-line a-fillsoft" d="M420 120 L 650 120 Q 670 120 670 140 L 670 200 Q 670 220 650 220 L 600 220 L 608 256 L 574 220 L 420 220 Q 400 220 400 200 L 400 140 Q 400 120 420 120 Z"/><text class="a-big" x="535" y="185" text-anchor="middle" style="font-size:34px">… å ø æ</text></g></g>
    </svg>`,
    update(el, p) {
      const b1 = el.querySelector('.b1'), b2 = el.querySelector('.b2');
      if (b1) b1.style.opacity = clamp((p - .1) * 4); if (b2) b2.style.opacity = clamp((p - .35) * 4);
      el.querySelectorAll('.fd').forEach(f => { f.setAttribute('transform', `translate(0 ${(Math.sin(p * 8 + Number(f.dataset.i)) * 18).toFixed(1)})`); });
    },
  },

  /* a linha da parada subindo semana a semana, puxada por uma corda */
  chart: {
    svg: () => {
      // posições da parada: estreia no 128, chega ao 29 (eixo invertido)
      const pts = [128, 110, 92, 78, 66, 55, 46, 39, 34, 31, 29, 29, 30, 32].map((r, i) => `${(140 + i * 40).toFixed(0)},${(110 + (r - 29) / 99 * 260).toFixed(0)}`);
      return `<svg ${VB}>
        <g class="d1"><line class="a-soft" x1="120" y1="80" x2="120" y2="390"/><line class="a-soft" x1="120" y1="390" x2="700" y2="390"/>
          <text class="a-tag" x="110" y="116" text-anchor="end" style="font-size:12px">Nº 29</text><text class="a-tag" x="110" y="376" text-anchor="end" style="font-size:12px">Nº 128</text></g>
        <g class="d2"><polyline class="a-under line" points="${pts.join(' ')}"/><line class="a-line pull" x1="540" y1="0" x2="540" y2="110" style="stroke-width:1.2"/></g>
      </svg>`;
    },
    init: el => prepDraw(el, '.line'),
    update(el, p) {
      setDraw(el, '.line', p * 1.4);
      const pull = el.querySelector('.pull'); if (pull) pull.style.opacity = clamp((p - .55) * 4);
    },
  },

  /* a arena vazia vista do palco */
  arena: {
    svg: () => `<svg ${VB}>
      <g class="d3">${Array.from({ length: 7 }, (_, r) => `<path class="a-soft" d="M${60 + r * 20} ${120 + r * 34} Q 400 ${60 + r * 40} ${740 - r * 20} ${120 + r * 34}"/>`).join('')}</g>
      <g class="d2"><path class="a-line a-fillsoft" d="M140 440 L 220 360 L 580 360 L 660 440 Z"/><line class="a-line" x1="400" y1="360" x2="400" y2="290"/><circle class="a-line" cx="400" cy="284" r="8"/></g>
      <path class="a-cone spot" d="M400 0 L 330 360 L 470 360 Z"/>
    </svg>`,
    update(el, p) { const s = el.querySelector('.spot'); if (s) s.style.opacity = clamp((p - .2) * 3) * (.8 + .2 * Math.sin(p * 30)); },
  },

  /* o skate que para; a guitarra passa de uma silhueta para a outra */
  skate: {
    svg: () => `<svg ${VB}>
      <line class="a-soft" x1="0" y1="380" x2="800" y2="380"/>
      <g class="d2 board"><rect class="a-line a-fillsoft" x="0" y="352" width="140" height="12" rx="6"/><circle class="a-line" cx="26" cy="372" r="8"/><circle class="a-line" cx="114" cy="372" r="8"/></g>
      <g class="d1">${person(330, 300, 150)}${person(560, 300, 150)}</g>
      <g class="d3 gtr"><path class="a-line a-fillsoft" d="M-20 0 L 20 -14 L 26 -6 L 6 2 L 26 10 L 20 18 Z"/><rect class="a-line" x="-80" y="-3" width="62" height="6"/></g>
    </svg>`,
    update(el, p) {
      el.querySelector('.board')?.setAttribute('transform', `translate(${(-150 + 380 * Math.min(1, clamp(p * 2.2))).toFixed(1)} 0)`);
      const k = clamp((p - .4) * 2.2);
      el.querySelector('.gtr')?.setAttribute('transform', `translate(${(340 + 220 * k).toFixed(1)} ${(240 - Math.sin(k * Math.PI) * 60).toFixed(1)}) rotate(-30)`);
    },
  },

  /* o último show: o palco cheio de luz, a cortina que demora a fechar */
  'last-show': {
    svg: () => `<svg ${VB}>
      <g class="d3">${Array.from({ length: 5 }, (_, i) => `<path class="a-cone beam" data-i="${i}" d="M${200 + i * 100} 40 L ${170 + i * 100} 330 L ${230 + i * 100} 330 Z"/>`).join('')}</g>
      <g class="d2"><rect class="a-line a-fillsoft" x="140" y="330" width="520" height="40"/>${person(280, 330, 110)}${person(360, 330, 110)}${person(440, 330, 110)}${person(520, 330, 110)}</g>
      <rect class="a-dark cur-l" x="120" y="30" width="0" height="350"/><rect class="a-dark cur-r" x="680" y="30" width="0" height="350"/>
    </svg>`,
    update(el, p) {
      el.querySelectorAll('.beam').forEach(b => { const i = Number(b.dataset.i); b.setAttribute('transform', `rotate(${(Math.sin(p * 12 + i) * 10).toFixed(1)} ${200 + i * 100} 40)`); });
      const k = clamp((p - .7) * 2.2) * 280;
      el.querySelector('.cur-l')?.setAttribute('width', k.toFixed(0));
      const r = el.querySelector('.cur-r'); if (r) { r.setAttribute('width', k.toFixed(0)); r.setAttribute('x', (680 - k).toFixed(0)); }
    },
  },

  /* 27 de setembro de 1986: tela preta, só a legenda */
  black: { svg: () => `<svg ${VB}></svg>` },

  /* um baixo encostado na parede, iluminado de cima, e as datas */
  'bass-wall': {
    svg: () => `<svg ${VB}>
      <path d="M400 0 L 320 420 L 480 420 Z" style="fill: rgba(255,255,255,.07)"/>
      <line x1="200" y1="420" x2="600" y2="420" style="stroke: rgba(255,255,255,.3)"/>
      <g transform="rotate(8 400 300)" style="fill: none; stroke: #e8e8e8; stroke-width: 1.6">
        <rect x="394" y="90" width="12" height="190"/><rect x="390" y="66" width="20" height="26" rx="3"/>
        <path d="M384 280 C 350 280 330 320 348 350 C 326 372 340 420 400 420 C 460 420 474 372 452 350 C 470 320 450 280 416 280 Z"/>
      </g>
      <text class="dates" x="400" y="40" text-anchor="middle" style="font-family: var(--font-mono); font-size: 18px; letter-spacing: .3em; fill: #f2f2f2">10.02.1962 — 27.09.1986</text>
    </svg>`,
    update(el, p) { const d = el.querySelector('.dates'); if (d) d.style.opacity = clamp((p - .3) * 2); },
  },
};
