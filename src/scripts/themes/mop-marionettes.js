/* =========================================================
   MASTER OF PUPPETS — marionetes da banda
   Bonecos de madeira gerados em SVG, com peças separadas
   (cabeça, braço, antebraço, coxa, canela) que giram nos pinos.
   Olhos em "x". Cada um tem traços da época:
   - James: cabelo comprido loiro, guitarra em V
   - Lars: cabelo escuro e faixa vermelha na cabeça, baquetas e caixa
   - Kirk: cabelo escuro cacheado, guitarra branca
   - Cliff: cabelo ruivo comprido, calça boca de sino, baixo
   Cordas na cabeça, nas mãos e nos joelhos (desenhadas pelo mop.js).
   ========================================================= */
const CFG = {
  james: { name: 'James', hair: '#e2c36a', style: 'long', shirt: '#1b1b20', pants: '#23262f', instr: 'v', color: '#121214' },
  lars: { name: 'Lars', hair: '#3b2416', style: 'medium', band: '#c8102e', shirt: '#d8d2c4', pants: '#2c3a56', instr: 'sticks' },
  kirk: { name: 'Kirk', hair: '#1c1410', style: 'curly', shirt: '#141416', pants: '#1c1f27', instr: 'strat', color: '#f2efe6' },
  cliff: { name: 'Cliff', hair: '#9a4a22', style: 'long', shirt: '#3e5a80', pants: '#4f72a0', bells: true, instr: 'bass', color: '#161616' },
};
const GUITARIST = { head: 0, lUp: 70, lLow: -140, rUp: -25, rLow: 70, lTh: 4, lSh: 0, rTh: -4, rSh: 0 };
const DRUMMER = { head: 0, lUp: 28, lLow: -40, rUp: -28, rLow: 40, lTh: 12, lSh: -8, rTh: -12, rSh: 8 };
const JOINTS = { head: [100, 92], lUp: [78, 104], lLow: [78, 150], rUp: [122, 104], rLow: [122, 150], lTh: [90, 186], lSh: [90, 248], rTh: [110, 186], rSh: [110, 248] };
const STROKE = '#3a220f';

const limb = (x, y, w, h, fill) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="${fill}" stroke="${STROKE}" stroke-width="1.2"/>`;
const pin = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#c9a24a" stroke="#6b4f1a" stroke-width=".8"/>`;
const att = (x, y, part) => `<circle class="att" data-part="${part}" cx="${x}" cy="${y}" r="2" fill="transparent"/>`;

function hair(c) {
  const h = c.hair;
  if (c.style === 'curly') {
    let s = `<path d="M74 58 C 76 24 124 24 126 58 C 118 40 82 40 74 58 Z" fill="${h}"/>`;
    for (let i = 0; i < 7; i++) {
      const y = 46 + i * 12, r = 9 - i * .4;
      s += `<circle cx="${73 - i * .6}" cy="${y}" r="${r}" fill="${h}"/><circle cx="${127 + i * .6}" cy="${y}" r="${r}" fill="${h}"/>`;
    }
    return { back: s, front: `<path d="M76 50 C 82 30 118 30 124 50 C 112 40 88 40 76 50 Z" fill="${h}"/>` };
  }
  if (c.style === 'medium') {
    return {
      back: `<path d="M75 60 C 72 28 128 28 125 60 L 127 84 L 117 80 L 116 60 L 84 60 L 83 80 L 73 84 Z" fill="${h}"/>`,
      front: `<path d="M77 52 C 82 30 118 30 123 52 C 110 42 90 42 77 52 Z" fill="${h}"/>`,
    };
  }
  return { // comprido e liso
    back: `<path d="M74 58 C 70 92 72 120 80 136 L 92 132 C 88 104 88 78 96 62 Z" fill="${h}"/><path d="M126 58 C 130 92 128 120 120 136 L 108 132 C 112 104 112 78 104 62 Z" fill="${h}"/><path d="M74 58 C 76 24 124 24 126 58 C 118 40 82 40 74 58 Z" fill="${h}"/>`,
    front: `<path d="M76 52 C 80 30 120 30 124 52 C 112 38 88 38 76 52 Z" fill="${h}"/>`,
  };
}

function instrument(c) {
  const g = (inner) => `<g transform="translate(116 170) rotate(32) scale(1.25)">${inner}</g>`;
  const neck = (len) => `<rect x="${-len}" y="-3" width="${len - 10}" height="6" fill="#3a2314" stroke="${STROKE}" stroke-width=".8"/><rect x="${-len - 10}" y="-5" width="12" height="10" rx="2" fill="${c.color}" stroke="${STROKE}" stroke-width=".8"/><line x1="${-len}" y1="0" x2="16" y2="0" stroke="#d9e1e8" stroke-width=".6"/>`;
  if (c.instr === 'v') return g(`${neck(72)}<path d="M-14 0 L22 -20 L27 -13 L6 0 L27 13 L22 20 Z" fill="${c.color}" stroke="#888" stroke-width="1"/>`);
  if (c.instr === 'strat') return g(`${neck(70)}<path d="M-12 -10 C -4 -19 10 -17 14 -10 C 22 -15 31 -11 29 -2 C 31 6 22 15 14 10 C 10 17 -4 19 -12 10 C -17 4 -17 -4 -12 -10 Z" fill="${c.color}" stroke="#555" stroke-width="1"/><rect x="2" y="-5" width="4" height="10" fill="#222"/>`);
  if (c.instr === 'bass') return g(`${neck(90)}<path d="M-12 -12 C -2 -22 14 -20 18 -12 C 28 -16 36 -10 33 -1 C 36 9 26 18 16 13 C 10 21 -4 22 -12 12 C -18 5 -18 -5 -12 -12 Z" fill="${c.color}" stroke="#777" stroke-width="1"/>`);
  return '';
}

function build(id) {
  const c = CFG[id];
  const wood = `url(#wood-${id})`;
  const hr = hair(c);
  const stick = (x1, x2) => c.instr === 'sticks' ? `<line x1="${x1}" y1="192" x2="${x2}" y2="246" stroke="#e8d3a8" stroke-width="3.2" stroke-linecap="round"/>` : '';
  const shin = (x) => c.bells
    ? `<path d="M${x - 6} 248 L${x + 6} 248 L${x + 12} 306 L${x - 12} 306 Z" fill="${c.pants}" stroke="${STROKE}" stroke-width="1.2"/>`
    : limb(x, 248, 12, 56, c.pants);
  const leg = (side, x) => `
    <g class="p-${side}Th">${limb(x, 186, 14, 62, c.pants)}${pin(x, 248)}${att(x, 248, side + 'Knee')}
      <g class="p-${side}Sh">${shin(x)}<ellipse cx="${x}" cy="309" rx="${c.bells ? 13 : 11}" ry="5" fill="#141210"/></g>
    </g>`;
  const arm = (side, x, dir) => `
    <g class="p-${side}Up">${limb(x, 104, 13, 46, c.shirt)}
      <g class="p-${side}Low">${limb(x, 150, 10, 42, wood)}<circle cx="${x}" cy="194" r="7" fill="${wood}" stroke="${STROKE}" stroke-width="1.2"/>${stick(x, x + dir * 8)}${att(x, 194, side + 'Hand')}</g>
      ${pin(x, 150)}${pin(x, 104)}
    </g>`;
  const drum = c.instr === 'sticks' ? `
    <g class="prop">
      <line x1="156" y1="214" x2="156" y2="330" stroke="#aeb8c2" stroke-width="2.5"/>
      <ellipse cx="156" cy="212" rx="26" ry="5" fill="#d7a646" stroke="#8f5e18"/>
      <path d="M58 270 V300 A42 10 0 0 0 142 300 V270" fill="#7a1f2e" stroke="${STROKE}"/>
      <ellipse cx="100" cy="270" rx="42" ry="10" fill="#efe9dc" stroke="#c9d2da" stroke-width="2.5"/>
      <line x1="76" y1="306" x2="66" y2="334" stroke="#aeb8c2" stroke-width="2.5"/><line x1="124" y1="306" x2="134" y2="334" stroke="#aeb8c2" stroke-width="2.5"/>
    </g>` : '';

  return `
  <defs><radialGradient id="wood-${id}" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#e8bd84"/><stop offset=".6" stop-color="#b98249"/><stop offset="1" stop-color="#7a4f26"/></radialGradient></defs>
  <g class="p-body">
    ${leg('l', 90)}${leg('r', 110)}
    <path d="M80 98 Q100 92 120 98 L124 188 Q100 196 76 188 Z" fill="${c.shirt}" stroke="${STROKE}" stroke-width="1.2"/>
    <rect x="77" y="178" width="46" height="8" fill="#2a1d14"/>
    ${instrument(c)}
    <g class="p-head">
      <rect x="95" y="80" width="10" height="16" fill="${wood}" stroke="${STROKE}" stroke-width="1"/>
      ${hr.back}
      <ellipse cx="100" cy="58" rx="23" ry="27" fill="${wood}" stroke="${STROKE}" stroke-width="1.4"/>
      ${hr.front}
      ${c.band ? `<rect x="76" y="40" width="48" height="8" rx="3" fill="${c.band}" stroke="#6b0718" stroke-width=".8"/><path d="M124 44 L134 52 L131 56 Z M124 44 L136 44 L134 48 Z" fill="${c.band}"/>` : ''}
      <g stroke="#2a1508" stroke-width="2.6" stroke-linecap="round">
        <path d="M86 52 L94 60 M94 52 L86 60"/><path d="M106 52 L114 60 M114 52 L106 60"/>
        <path d="M94 72 Q100 75 106 72" fill="none" stroke-width="1.6"/>
      </g>
      <circle cx="84" cy="66" r="3.5" fill="#d9775a" opacity=".35"/><circle cx="116" cy="66" r="3.5" fill="#d9775a" opacity=".35"/>
      ${pin(100, 92)}
      ${att(100, 31, 'head')}
    </g>
    <rect x="86" y="100" width="28" height="12" rx="2" fill="#c99a5b" stroke="${STROKE}" stroke-width=".8"/>
    <text x="100" y="108.8" text-anchor="middle" font-family="IM Fell English SC, Georgia, serif" font-size="8" fill="#2a1508">${c.name}</text>
    ${arm('l', 78, -1)}${arm('r', 122, 1)}
  </g>
  ${drum}`;
}

/* ---------- animação ---------- */
const NAMES = ['head', 'lUp', 'lLow', 'rUp', 'rLow', 'lTh', 'lSh', 'rTh', 'rSh'];
function perform(id, t, beat) {
  const TAU = Math.PI * 2, o = {};
  if (id === 'lars') { o.lLow = 24 * Math.sin(TAU * beat); o.rLow = 24 * Math.sin(TAU * beat + Math.PI); o.head = 5 * Math.sin(TAU * beat * .5); }
  if (id === 'james') { o.rLow = 16 * Math.sin(TAU * beat * 2); o.head = 8 * Math.sin(TAU * beat * .5); }
  if (id === 'kirk') { o.rLow = 18 * Math.sin(TAU * beat * 3); o.head = 9 * Math.sin(TAU * beat * .5 + 1.2); o.lLow = 6 * Math.sin(TAU * beat); }
  if (id === 'cliff') { o.rLow = 12 * Math.sin(TAU * beat); o.head = 16 * Math.sin(TAU * beat * .25); }
  return o;
}

export function createShow(api, { pluck }) {
  const stage = document.querySelector('.show__stage');
  if (!stage) return null;
  const list = [...stage.querySelectorAll('.marionette')].map((svg, i) => {
    const id = svg.dataset.member;
    svg.innerHTML = build(id);
    const parts = Object.fromEntries(NAMES.map(n => [n, svg.querySelector(`.p-${n}`)]));
    const zero = () => Object.fromEntries(NAMES.map(n => [n, 0]));
    return { id, svg, parts, body: svg.querySelector('.p-body'), base: id === 'lars' ? DRUMMER : GUITARIST, off: zero(), vel: zero(), target: null, lift: 0, liftV: 0, phase: i * 1.7 };
  });
  const wires = list.flatMap(m => [...m.svg.querySelectorAll('.att')].map(el => ({ el, m, part: el.dataset.part, chain: null, rest: null })));

  let live = false;
  api.ScrollTrigger.create({
    trigger: stage, start: 'top 75%', end: 'bottom 10%',
    onToggle: self => { live = self.isActive; },
    onEnter: () => {
      api.gsap.to('.show__curtain--l', { xPercent: -100, duration: 1.6, ease: 'power3.inOut' });
      api.gsap.to('.show__curtain--r', { xPercent: 100, duration: 1.6, ease: 'power3.inOut' });
    },
  });

  function update(now, dt) {
    if (!live && !list.some(m => m.target)) return;
    const t = now / 1000, beat = t * (api.reduce ? 0 : 3); // ~180 BPM
    const k = Math.min(2, dt / 16);
    for (const m of list) {
      const anim = live && !api.reduce ? perform(m.id, t, beat) : {};
      for (const n of NAMES) {
        const goal = m.target?.[n];
        if (goal != null) { m.off[n] += (goal - m.off[n]) * .25 * k; m.vel[n] = 0; }
        else { m.vel[n] += (-m.off[n] * .08 - m.vel[n] * .12) * k; m.off[n] += m.vel[n] * k; }
        const a = m.base[n] + (anim[n] || 0) + m.off[n];
        const [cx, cy] = JOINTS[n];
        m.parts[n].setAttribute('transform', `rotate(${a.toFixed(2)} ${cx} ${cy})`);
      }
      const liftGoal = m.target?.lift;
      if (liftGoal != null) { m.lift += (liftGoal - m.lift) * .2 * k; m.liftV = 0; }
      else { m.liftV += (-m.lift * .1 - m.liftV * .14) * k; m.lift += m.liftV * k; }
      const sway = api.reduce ? 0 : Math.sin(t * 1.4 + m.phase) * 2.5;
      const bob = live && !api.reduce ? Math.abs(Math.sin(Math.PI * beat)) * -3 : 0;
      m.body.setAttribute('transform', `translate(0 ${(bob + m.lift).toFixed(2)}) rotate(${sway.toFixed(2)} 100 0)`);
    }
  }

  /* puxar uma corda: quanto mais alto o ponteiro acima do ponto de repouso, mais a peça sobe */
  function pull(w, x, y) {
    if (!w.rest) { const r = w.el.getBoundingClientRect(); w.rest = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    const up = Math.max(-.3, Math.min(1.6, (w.rest.y - y) / 70)), side = Math.max(-1.2, Math.min(1.2, (x - w.rest.x) / 70));
    const T = w.m.target = {};
    if (w.part === 'head') { T.head = side * 22; T.lift = -up * 26; }
    if (w.part === 'lHand') { T.lUp = up * 70 + side * -20; T.lLow = -up * 40; }
    if (w.part === 'rHand') { T.rUp = -up * 70 + side * -20; T.rLow = up * 40; }
    if (w.part === 'lKnee') { T.lTh = up * 55; T.lSh = -up * 40; }
    if (w.part === 'rKnee') { T.rTh = -up * 55; T.rSh = up * 40; }
  }
  function release(w) { w.m.target = null; w.rest = null; }
  function jump(m) {
    m.liftV = -7; m.vel.lUp += 14; m.vel.rUp -= 14; m.vel.head += (Math.random() - .5) * 20;
    pluck(150 + list.indexOf(m) * 40, .35);
  }
  const visible = () => { const r = stage.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };

  return { list, wires, update, pull, release, jump, visible };
}
