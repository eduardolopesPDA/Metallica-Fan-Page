/* =========================================================
   Ilustrações das cenas — Capítulo 2 · Ride the Lightning
   svg() devolve o desenho; update(el, p) anima com o progresso da cena.
   Grupos .d1 / .d2 / .d3 são camadas de profundidade (parallax).
   Desenhos originais.
   ========================================================= */
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const VB = 'viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet"';
export const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function prepDraw(el, sel) {
  el.querySelectorAll(sel).forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.len = L; });
}
export function setDraw(el, sel, k) {
  el.querySelectorAll(sel).forEach(p => { p.style.strokeDashoffset = p.dataset.len * (1 - clamp(k)); });
}

export const arts = {
  /* Boston: a van aberta e vazia na neve */
  theft: {
    svg: () => `<svg ${VB}>
      <g class="d1">
        <line class="a-line" x1="660" y1="384" x2="660" y2="110"/><path class="a-line" d="M660 110 Q 680 98 704 112"/>
        <path class="a-cone" d="M704 122 L 630 384 L 780 384 Z"/><circle class="a-glow" cx="704" cy="118" r="7"/>
      </g>
      <line class="a-soft" x1="0" y1="384" x2="800" y2="384"/>
      <g class="d2">
        <rect class="a-line" x="190" y="214" width="290" height="150" rx="10"/>
        <path class="a-line" d="M480 254 L 560 254 L 600 304 L 600 364 L 480 364 Z"/>
        <path class="a-line" d="M496 266 L 552 266 L 582 304 L 496 304 Z"/>
        <rect class="a-dark" x="196" y="220" width="278" height="138"/>
        <g class="ghost">
          <circle class="a-ghost" cx="268" cy="304" r="40"/>
          <rect class="a-ghost" x="326" y="262" width="62" height="86" rx="4"/>
          <rect class="a-ghost" x="400" y="262" width="62" height="86" rx="4"/>
          <text class="a-tag" x="335" y="244">VAZIO</text>
        </g>
        <g class="door"><path class="a-line a-fillsoft" d="M190 216 L 140 232 L 140 346 L 190 362 Z"/></g>
        <circle class="a-line" cx="252" cy="370" r="24"/><circle class="a-line" cx="540" cy="370" r="24"/>
      </g>
      <g class="d3"><g class="snow">${Array.from({ length: 70 }, (_, i) => `<circle class="a-snow" cx="${(rnd(i) * 800).toFixed(0)}" cy="${(rnd(i + 99) * 560 - 140).toFixed(0)}" r="${(1 + rnd(i + 7) * 2.4).toFixed(1)}"/>`).join('')}</g></g>
    </svg>`,
    update(el, p) {
      el.querySelector('.door')?.setAttribute('transform', `translate(190 0) scale(${(.12 + .88 * clamp(p * 2.2)).toFixed(3)} 1) translate(-190 0)`);
      el.querySelector('.snow')?.setAttribute('transform', `translate(${(-p * 40).toFixed(1)} ${(p * 120).toFixed(1)})`);
      const g = el.querySelector('.ghost'); if (g) g.style.opacity = clamp((p - .25) * 3);
    },
  },

  /* Nova Jersey: o sofá, o violão e o dedilhado que vira luz */
  sofa: {
    svg: () => `<svg ${VB}>
      <g class="d1">
        <path class="a-line" d="M190 250 L190 196 Q190 176 212 176 L588 176 Q610 176 610 196 L610 250"/>
        <path class="a-line a-fillsoft" d="M160 300 Q160 250 210 250 L590 250 Q640 250 640 300 L640 360 L160 360 Z"/>
        <rect class="a-line" x="136" y="262" width="52" height="98" rx="22"/><rect class="a-line" x="612" y="262" width="52" height="98" rx="22"/>
        <line class="a-line" x1="190" y1="360" x2="184" y2="390"/><line class="a-line" x1="610" y1="360" x2="616" y2="390"/>
      </g>
      <g class="d2"><g transform="rotate(-18 560 330)">
        <path class="a-line a-fillsoft" d="M538 300 C 508 300 498 338 518 358 C 486 378 496 432 548 432 C 600 432 610 378 578 358 C 598 338 588 300 558 300 Z"/>
        <circle class="a-line" cx="548" cy="368" r="11"/>
        <rect class="a-line" x="542" y="150" width="12" height="152"/><rect class="a-line" x="538" y="128" width="20" height="24" rx="3"/>
        ${[544, 547, 550, 553].map(x => `<line class="a-string" x1="${x}" y1="150" x2="${x}" y2="410"/>`).join('')}
      </g></g>
      <g class="d3"><path class="a-wave" d=""/><path class="a-wave a-wave--2" d="" opacity=".4"/></g>
    </svg>`,
    update(el, p) {
      const waves = el.querySelectorAll('.a-wave'); if (!waves.length) return;
      waves.forEach((w, n) => {
        const amp = (34 - n * 14) * clamp(p * 1.6), reach = 60 + 700 * p;
        let d = '';
        for (let x = 0; x <= 800; x += 6) {
          const env = Math.exp(-Math.abs(x - 520) / reach);
          const y = 110 + n * 26 + Math.sin(x / (22 + n * 6) + p * 18 + n) * amp * env;
          d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(1);
        }
        w.setAttribute('d', d);
      });
    },
  },

  /* Um livro aberto; uma linha sublinhada vira o título */
  book: {
    svg: () => {
      const lines = side => Array.from({ length: 11 }, (_, i) => {
        const x0 = side ? 425 : 186, len = 120 + rnd(i + side * 20) * 70, y = 142 + i * 20;
        return `<line class="${side && i === 5 ? 'a-hl' : 'a-text'}" x1="${x0}" y1="${y}" x2="${(x0 + len).toFixed(0)}" y2="${y}"/>`;
      }).join('');
      return `<svg ${VB}>
        <g class="d1">
          <path class="a-line a-fillsoft" d="M400 120 Q 300 100 166 112 L 166 370 Q 300 358 400 380 Z"/>
          <path class="a-line a-fillsoft" d="M400 120 Q 500 100 634 112 L 634 370 Q 500 358 400 380 Z"/>
          ${lines(0)}${lines(1)}
          <path class="a-under" d="M425 250 L 590 250"/>
        </g>
        <g class="d3"><text class="a-title" x="400" y="74" text-anchor="middle">RIDE THE LIGHTNING</text></g>
      </svg>`;
    },
    init: el => prepDraw(el, '.a-under'),
    update(el, p) {
      setDraw(el, '.a-under', (p - .1) * 3);
      const t = el.querySelector('.a-title'); if (t) { const k = clamp((p - .45) * 2.5); t.style.opacity = k; t.setAttribute('transform', `translate(0 ${(30 * (1 - k)).toFixed(1)})`); }
    },
  },

  /* Uma TV antiga; a névoa escorre da tela */
  tv: {
    svg: () => `<svg ${VB}>
      <defs><filter id="fog-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter></defs>
      <g class="d1">
        <rect class="a-line" x="250" y="330" width="300" height="14" rx="3"/><line class="a-line" x1="280" y1="344" x2="270" y2="400"/><line class="a-line" x1="520" y1="344" x2="530" y2="400"/>
        <line class="a-line" x1="380" y1="170" x2="340" y2="110"/><line class="a-line" x1="420" y1="170" x2="460" y2="104"/>
        <rect class="a-line a-fillsoft" x="300" y="170" width="200" height="160" rx="14"/>
        <rect class="a-screen" x="316" y="186" width="136" height="110" rx="18"/>
        <circle class="a-line" cx="476" cy="210" r="7"/><circle class="a-line" cx="476" cy="240" r="7"/>
      </g>
      <g class="d3"><g filter="url(#fog-blur)">${Array.from({ length: 7 }, (_, i) => `<ellipse class="a-fog" data-i="${i}" cx="384" cy="290" rx="${40 + i * 6}" ry="${16 + i * 3}"/>`).join('')}</g></g>
    </svg>`,
    update(el, p) {
      el.querySelectorAll('.a-fog').forEach(f => {
        const i = Number(f.dataset.i), dir = i % 2 ? 1 : -1;
        f.setAttribute('transform', `translate(${(dir * p * (120 + i * 40)).toFixed(1)} ${(p * (60 + i * 12)).toFixed(1)})`);
        f.style.opacity = clamp(p * 2) * (.5 - i * .04);
      });
      const sc = el.querySelector('.a-screen'); if (sc) sc.style.opacity = .7 + .3 * Math.abs(Math.sin(p * 40));
    },
  },

  /* Copenhague: nove amplificadores emprestados e o relógio das 19h às 4h */
  amps: {
    svg: () => {
      let s = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const x = 150 + c * 128, y = 96 + r * 98, i = r * 3 + c;
        s += `<g class="amp" data-i="${i}"><rect class="a-line a-fillsoft" x="${x}" y="${y}" width="112" height="84" rx="5"/>
          <rect class="a-grille" x="${x + 10}" y="${y + 22}" width="92" height="54" rx="3"/>
          ${[0, 1, 2, 3].map(k => `<circle class="a-knob" cx="${x + 20 + k * 14}" cy="${y + 12}" r="3"/>`).join('')}</g>`;
      }
      return `<svg ${VB}><g class="d2">${s}</g>
        <g class="d1">
          <circle class="a-line" cx="640" cy="150" r="54"/>
          ${Array.from({ length: 12 }, (_, k) => { const a = k / 12 * Math.PI * 2; return `<line class="a-soft" x1="${(640 + Math.sin(a) * 46).toFixed(1)}" y1="${(150 - Math.cos(a) * 46).toFixed(1)}" x2="${(640 + Math.sin(a) * 52).toFixed(1)}" y2="${(150 - Math.cos(a) * 52).toFixed(1)}"/>`; }).join('')}
          <line class="a-hand a-hour" x1="640" y1="150" x2="640" y2="118"/><line class="a-hand a-min" x1="640" y1="150" x2="640" y2="106"/>
          <text class="a-tag" x="640" y="236" text-anchor="middle">19h → 4h</text>
        </g>
      </svg>`;
    },
    update(el, p) {
      el.querySelectorAll('.amp').forEach(a => {
        const k = clamp((p * 1.4 - Number(a.dataset.i) / 9) * 6);
        a.style.opacity = k; a.setAttribute('transform', `translate(0 ${((1 - k) * -26).toFixed(1)})`);
      });
      const hours = 19 + 9 * p;
      el.querySelector('.a-hour')?.setAttribute('transform', `rotate(${((hours % 12) / 12 * 360).toFixed(1)} 640 150)`);
      el.querySelector('.a-min')?.setAttribute('transform', `rotate(${((hours * 360) % 360).toFixed(1)} 640 150)`);
    },
  },

  /* O raio volta */
  return: {
    svg: () => `<svg ${VB}>
      <g class="d3">${Array.from({ length: 24 }, (_, i) => `<line class="a-soft" x1="${(rnd(i) * 800).toFixed(0)}" y1="${(rnd(i + 5) * 450).toFixed(0)}" x2="${(rnd(i) * 800 - 14).toFixed(0)}" y2="${(rnd(i + 5) * 450 + 40).toFixed(0)}"/>`).join('')}</g>
      <g class="d1"><path class="a-bolt" d="M438 26 L 334 232 L 414 232 L 352 424 L 506 178 L 424 178 L 486 26 Z"/></g>
      <text class="a-tag a-date" x="400" y="446" text-anchor="middle">27.07.1984</text>
    </svg>`,
    init: el => prepDraw(el, '.a-bolt'),
    update(el, p) {
      setDraw(el, '.a-bolt', p * 2.4);
      el.querySelector('.a-bolt')?.classList.toggle('is-full', p > .45);
    },
  },

  /* Nova York: o contrato e a assinatura */
  contract: {
    svg: () => `<svg ${VB}>
      <g class="d1"><g transform="rotate(-4 400 225)">
        <rect class="a-line a-fillsoft" x="250" y="40" width="300" height="380" rx="4"/>
        <text class="a-tag" x="400" y="84" text-anchor="middle">CONTRATO</text>
        ${Array.from({ length: 9 }, (_, i) => `<line class="a-text" x1="282" y1="${110 + i * 22}" x2="${(282 + 180 + rnd(i + 3) * 56).toFixed(0)}" y2="${110 + i * 22}"/>`).join('')}
        <line class="a-soft" x1="282" y1="370" x2="518" y2="370"/>
        <path class="a-sign" d="M290 356 C 300 326 318 372 330 344 S 356 318 370 350 S 398 372 410 338 S 440 322 452 352 S 486 366 506 340"/>
        <text class="a-tag" x="282" y="392">12.09.1984</text>
      </g></g>
      <g class="pen"><line class="a-line" x1="0" y1="0" x2="60" y2="-60"/><circle class="a-glow" cx="0" cy="0" r="3"/></g>
    </svg>`,
    init: el => prepDraw(el, '.a-sign'),
    update(el, p) {
      const s = el.querySelector('.a-sign'), pen = el.querySelector('.pen'); if (!s) return;
      const k = clamp((p - .1) * 1.8), L = Number(s.dataset.len);
      s.style.strokeDashoffset = L * (1 - k);
      const pt = s.getPointAtLength(L * k);
      const a = -4 * Math.PI / 180, cx = 400, cy = 225;
      const x = cx + (pt.x - cx) * Math.cos(a) - (pt.y - cy) * Math.sin(a), y = cy + (pt.x - cx) * Math.sin(a) + (pt.y - cy) * Math.cos(a);
      pen?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      if (pen) pen.style.opacity = k > 0 && k < 1 ? 1 : .35;
    },
  },
};
