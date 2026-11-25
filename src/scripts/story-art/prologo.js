/* Ilustrações das cenas — Prólogo (1981–1983), em preto e branco. Desenhos originais. */
import { clamp, VB, rnd, prepDraw, setDraw, typeText, stamp, person } from './util.js';

export const arts = {
  /* a página de classificados e o anúncio sendo datilografado */
  classifieds: {
    svg: () => {
      let cols = '';
      for (let c = 0; c < 4; c++) for (let i = 0; i < 14; i++) {
        const x = 120 + c * 150, y = 70 + i * 24;
        if (c === 1 && i >= 4 && i <= 9) continue;
        cols += `<line class="a-text" x1="${x}" y1="${y}" x2="${(x + 70 + rnd(c * 20 + i) * 50).toFixed(0)}" y2="${y}"/>`;
      }
      return `<svg ${VB}>
        <g class="d1"><rect class="a-line a-fillsoft" x="100" y="40" width="600" height="380" rx="2"/>${cols}</g>
        <g class="d2"><rect class="a-line" x="262" y="160" width="146" height="128"/>
          <text class="a-tag" x="274" y="190" style="font-size:12px"><tspan class="t1">PROCURA-SE</tspan></text>
          <text class="a-tag" x="274" y="214" style="font-size:12px"><tspan class="t2">MÚSICOS P/</tspan></text>
          <text class="a-tag" x="274" y="238" style="font-size:12px"><tspan class="t3">METAL PESADO</tspan></text></g>
      </svg>`;
    },
    update(el, p) {
      ['.t1', '.t2', '.t3'].forEach((s, i) => typeText(el, s, (p - .05 - i * .12) * 5));
    },
  },

  /* duas silhuetas, um amplificador e o cabo que as liga */
  'two-silhouettes': {
    svg: () => `<svg ${VB}>
      <line class="a-soft" x1="60" y1="380" x2="740" y2="380"/>
      <g class="d2">${person(220, 380, 200)}${person(580, 380, 200)}
        <path class="a-line" d="M600 250 L 660 200 M612 262 L 676 214"/></g>
      <g class="d1"><rect class="a-line a-fillsoft" x="352" y="290" width="96" height="90" rx="4"/><rect class="a-grille" x="362" y="312" width="76" height="58" rx="3"/></g>
      <path class="a-under cable" d="M250 300 C 300 380 340 380 360 360 M440 360 C 470 390 520 370 560 300"/>
    </svg>`,
    init: el => prepDraw(el, '.cable'),
    update: (el, p) => setDraw(el, '.cable', (p - .15) * 2),
  },

  /* o bilhete de avião que vai e volta; carimbo de outubro */
  ticket: {
    svg: () => `<svg ${VB}>
      <g class="d1"><path class="a-soft" d="M60 300 C 200 280 260 250 300 200 M520 120 C 600 110 700 140 760 180"/><text class="a-tag" x="110" y="340" style="font-size:12px">EUA</text><text class="a-tag" x="640" y="110" style="font-size:12px">EUROPA</text></g>
      <path class="a-under flight" d="M150 290 Q 400 40 640 150"/>
      <g class="d2"><rect class="a-line a-fillsoft" x="260" y="250" width="280" height="120" rx="8"/>
        <line class="a-soft" x1="440" y1="250" x2="440" y2="370" stroke-dasharray="4 5"/>
        <text class="a-tag" x="280" y="292">LAX → LHR</text><line class="a-text" x1="280" y1="320" x2="410" y2="320"/><line class="a-text" x1="280" y1="342" x2="380" y2="342"/>
        <g class="st"><rect class="a-line" x="448" y="290" width="84" height="44" rx="4" style="stroke-width:3"/><text class="a-tag" x="490" y="318" text-anchor="middle" style="font-size:13px">OUT 1981</text></g></g>
    </svg>`,
    init: el => prepDraw(el, '.flight'),
    update(el, p) { setDraw(el, '.flight', p * 1.8); stamp(el.querySelector('.st'), (p - .6) * 4, 490, 312); },
  },

  /* a lista de nomes: um riscado, outro circulado */
  'name-list': {
    svg: () => `<svg ${VB}>
      <g class="d1"><rect class="a-line a-fillsoft" x="250" y="50" width="300" height="350" rx="3" transform="rotate(2 400 225)"/></g>
      <g class="d2" transform="rotate(2 400 225)">
        <text class="a-tag" x="290" y="110" style="font-size:20px">Metal Mania</text>
        <line class="a-text" x1="290" y1="160" x2="440" y2="160"/>
        <text class="a-tag" x="290" y="220" style="font-size:20px">Metallica</text>
        <line class="a-text" x1="290" y1="270" x2="420" y2="270"/><line class="a-text" x1="290" y1="320" x2="460" y2="320"/>
        <path class="a-hl strike" d="M282 104 L 470 102"/>
        <path class="a-under circle" d="M280 214 C 280 186 470 184 476 212 C 482 240 290 246 278 222"/>
      </g>
    </svg>`,
    init: el => prepDraw(el, '.strike, .circle'),
    update(el, p) { setDraw(el, '.strike', (p - .15) * 4); setDraw(el, '.circle', (p - .4) * 3); },
  },

  /* o palquinho do bar e a corda que arrebenta */
  'small-stage': {
    svg: () => `<svg ${VB}>
      <g class="d1"><path class="a-soft" d="M120 380 L 220 250 L 580 250 L 680 380"/><line class="a-soft" x1="220" y1="250" x2="220" y2="80"/><line class="a-soft" x1="580" y1="250" x2="580" y2="80"/></g>
      <g class="d2">${person(330, 300, 150)}${person(470, 300, 150)}
        <line class="a-line" x1="400" y1="300" x2="400" y2="200"/><circle class="a-line" cx="400" cy="194" r="8"/>
        <rect class="a-line a-fillsoft" x="520" y="250" width="60" height="50" rx="3"/></g>
      <path class="a-wave snap" d=""/>
      <g class="d3">${Array.from({ length: 16 }, (_, i) => `<circle class="a-ink" cx="${(140 + rnd(i) * 520).toFixed(0)}" cy="${(400 + rnd(i + 30) * 40).toFixed(0)}" r="${(7 + rnd(i + 9) * 5).toFixed(1)}" opacity=".35"/>`).join('')}</g>
    </svg>`,
    update(el, p) {
      const s = el.querySelector('.snap'); if (!s) return;
      const k = clamp((p - .3) * 2);
      if (k <= 0) { s.setAttribute('d', 'M484 220 L 520 196'); return; }
      let d = 'M484 220';
      for (let t = 0; t <= 1; t += .05) { const r = 10 + 60 * t * k, a = t * 10 * k; d += ` L${(484 + 30 * t + Math.cos(a) * r * .6).toFixed(1)} ${(220 - 40 * t * k + Math.sin(a) * r * .5).toFixed(1)}`; }
      s.setAttribute('d', d);
    },
  },

  /* o nome impresso errado e as fitas se espalhando pelo mundo */
  tapes: {
    svg: () => {
      const cass = (x, y, i) => `<g class="cass" data-i="${i}"><rect class="a-line a-fillsoft" x="${x - 22}" y="${y - 14}" width="44" height="28" rx="3"/><circle class="a-line" cx="${x - 9}" cy="${y}" r="5"/><circle class="a-line" cx="${x + 9}" cy="${y}" r="5"/></g>`;
      let tapes = '';
      for (let i = 0; i < 18; i++) { const a = rnd(i) * Math.PI * 2, r = 60 + rnd(i + 40) * 140; tapes += cass(560 + Math.cos(a) * r, 230 + Math.sin(a) * r * .6, i); }
      return `<svg ${VB}>
        <g class="d1"><ellipse class="a-soft" cx="560" cy="230" rx="200" ry="150"/><ellipse class="a-soft" cx="560" cy="230" rx="90" ry="150"/><line class="a-soft" x1="360" y1="230" x2="760" y2="230"/></g>
        <g class="d2"><rect class="a-line a-fillsoft" x="70" y="150" width="230" height="150" rx="4"/>
          <text class="a-tag" x="92" y="200" style="font-size:22px">METTALLICA</text><path class="a-hl miss" d="M152 192 L 170 172"/>
          <text class="a-tag" x="92" y="250" style="font-size:12px">HIT THE LIGHTS · 1982</text></g>
        <g class="d3">${tapes}</g>
      </svg>`;
    },
    init: el => prepDraw(el, '.miss'),
    update(el, p) {
      setDraw(el, '.miss', (p - .1) * 4);
      el.querySelectorAll('.cass').forEach(c => { c.style.opacity = clamp((p * 1.6 - .3 - Number(c.dataset.i) / 24) * 5); });
    },
  },

  /* a casa de El Cerrito, a garagem que se abre */
  garage: {
    svg: () => `<svg ${VB}>
      <g class="d3">${Array.from({ length: 30 }, (_, i) => `<circle class="a-ink" cx="${(rnd(i) * 800).toFixed(0)}" cy="${(rnd(i + 50) * 160).toFixed(0)}" r="${(.8 + rnd(i + 3) * 1.6).toFixed(1)}"/>`).join('')}</g>
      <line class="a-soft" x1="40" y1="380" x2="760" y2="380"/>
      <g class="d1"><path class="a-line a-fillsoft" d="M180 380 L 180 220 L 330 130 L 480 220 L 480 380 Z"/><rect class="a-line" x="230" y="250" width="60" height="50"/>
        <rect class="a-line a-fillsoft" x="480" y="250" width="200" height="130"/>
        <rect class="a-light" x="490" y="262" width="180" height="118"/>
        <g class="band">${person(530, 378, 70, 'a-ink')}${person(570, 378, 70, 'a-ink')}${person(610, 378, 70, 'a-ink')}${person(645, 378, 70, 'a-ink')}</g>
        <rect class="a-line door" x="490" y="262" width="180" height="118" style="fill: var(--bg)"/></g>
      <path class="a-cone" d="M490 380 L 440 450 L 720 450 L 670 380 Z"/>
    </svg>`,
    update(el, p) {
      const d = el.querySelector('.door'), k = clamp((p - .1) * 2.4);
      if (d) { d.setAttribute('height', (118 * (1 - k)).toFixed(1)); }
      const c = el.querySelector('.a-cone'); if (c) c.style.opacity = k;
    },
  },
};
