/* =========================================================
   INSTRUMENTOS — ilustrações vetoriais geradas por código
   Duas camadas por instrumento:
   - .fade    → ilustração realista (acabamento, madeira, metais)
   - .draw    → contornos que se desenham na entrada da seção
   Trastes na posição real (regra da 12ª raiz de 2).
   Modelos: v · x (angular) · superstrat · bass4001 · bassModern · drums
   Desenhos genéricos, sem marcas nem logos.
   ========================================================= */
let uid = 0;
const f = n => Math.round(n * 100) / 100;
const fretAt = (nut, L) => n => nut + L * (1 - Math.pow(2, -n / 12));
const spread = (c, gap, n) => Array.from({ length: n }, (_, i) => c + (i - (n - 1) / 2) * gap);

const CHROME = `<stop offset="0" stop-color="#55606b"/><stop offset=".3" stop-color="#f5f9fc"/><stop offset=".52" stop-color="#8d99a5"/><stop offset=".78" stop-color="#e4ebf2"/><stop offset="1" stop-color="#4a545e"/>`;
const radial = (id, cx, cy, r, stops) => `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`;
const linear = (id, stops) => `<linearGradient id="${id}" x1="0" x2="1">${stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;

function commonDefs(p) {
  return `
    <linearGradient id="${p}chrome" x1="0" x2="1">${CHROME}</linearGradient>
    <linearGradient id="${p}chromeV" x1="0" x2="0" y1="0" y2="1">${CHROME}</linearGradient>
    ${radial(`${p}knob`, .35, .3, .85, [[0, '#7a7f8c'], [.35, '#1d2028'], [1, '#000']])}
    ${radial(`${p}pearl`, .4, .35, .7, [[0, '#fff'], [.6, '#e8e2d2'], [1, '#a9a291']])}
    ${linear(`${p}rosewood`, [[0, '#1c0e07'], [.5, '#462819'], [1, '#180b06']])}
    <linearGradient id="${p}gloss" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    ${radial(`${p}black`, .42, .3, .9, [[0, '#3b4258'], [.4, '#141824'], [1, '#030409']])}
    ${radial(`${p}jetglo`, .42, .3, .9, [[0, '#2f3446'], [.45, '#0f1118'], [1, '#020205']])}
    ${radial(`${p}ivory`, .4, .3, .9, [[0, '#fffdf7'], [.55, '#ede5d0'], [1, '#b3a88e']])}
    ${radial(`${p}white`, .4, .3, .9, [[0, '#ffffff'], [.55, '#eceef0'], [1, '#aeb4ba']])}
    ${radial(`${p}fireglo`, .52, .6, .62, [[0, '#ffcf6b'], [.3, '#f08a2c'], [.58, '#c5281c'], [.82, '#6a0b0a'], [1, '#2a0303']])}
    <linearGradient id="${p}plate" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".35" stop-color="#fff"/><stop offset=".5" stop-color="#9aa5b0"/><stop offset=".7" stop-color="#eef3f7"/><stop offset="1" stop-color="#6b7580"/></linearGradient>
    <filter id="${p}grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".55 .015" numOctaves="2" seed="7" result="t"/>
      <feColorMatrix in="t" type="matrix" values="0 0 0 0 .04  0 0 0 0 .02  0 0 0 0 .01  1.1 0 0 0 -.35" result="g"/>
      <feComposite in="g" in2="SourceGraphic" operator="in" result="gc"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gc"/></feMerge>
    </filter>`;
}

/* ---------- peças ---------- */
function finishShape(p, d, finish, id, edge = .45) {
  return `
    <clipPath id="${p}${id}"><path d="${d}"/></clipPath>
    <path d="${d}" fill="url(#${p}${finish})"/>
    <g clip-path="url(#${p}${id})">
      <path d="${d}" fill="none" stroke="rgba(0,0,0,${edge})" stroke-width="12"/>
      <path d="${d}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2.5" transform="translate(-1.5 -1.5)"/>
      <rect x="70" y="0" width="46" height="760" fill="url(#${p}gloss)" opacity=".35" transform="rotate(22 150 420)"/>
      <rect x="196" y="0" width="14" height="760" fill="url(#${p}gloss)" opacity=".22" transform="rotate(22 150 420)"/>
    </g>`;
}

function neck(p, { nut, end, L, frets, w0, w1, inlay = 'dot', binding = true }) {
  const fy = fretAt(nut, L);
  const xAt = y => { const t = (y - nut) / (end - nut); const w = w0 + (w1 - w0) * t; return [150 - w / 2, 150 + w / 2]; };
  const [a0, b0] = xAt(nut), [a1, b1] = xAt(end);
  const d = `M${f(a0)} ${nut} L${f(b0)} ${nut} L${f(b1)} ${end} L${f(a1)} ${end} Z`;
  let s = `<path d="${d}" fill="url(#${p}rosewood)" filter="url(#${p}grain)"/>`;
  if (binding) s += `<path d="M${f(a0)} ${nut} L${f(a1)} ${end} M${f(b0)} ${nut} L${f(b1)} ${end}" stroke="#efe9d8" stroke-width="1.3" opacity=".85"/>`;
  [3, 5, 7, 9, 12, 15, 17, 19, 21, 24].filter(n => n <= frets).forEach(n => {
    const y = (fy(n - 1) + fy(n)) / 2;
    const [l, r] = xAt(y);
    if (inlay === 'triangle') {
      const h = (fy(n) - fy(n - 1)) * .34;
      s += `<polygon points="${f(l + 2.5)},${f(y + h)} ${f(r - 2.5)},${f(y + h)} ${f(r - 2.5)},${f(y - h)}" fill="url(#${p}pearl)" opacity=".92"/>`;
    } else if (n === 12 || n === 24) {
      const o = (r - l) * .24;
      s += `<circle cx="${f(150 - o)}" cy="${f(y)}" r="2.6" fill="url(#${p}pearl)"/><circle cx="${f(150 + o)}" cy="${f(y)}" r="2.6" fill="url(#${p}pearl)"/>`;
    } else {
      s += `<circle cx="150" cy="${f(y)}" r="2.7" fill="url(#${p}pearl)"/>`;
    }
  });
  for (let n = 1; n <= frets; n++) {
    const y = fy(n);
    if (y > end) break;
    const [l, r] = xAt(y);
    s += `<line x1="${f(l)}" y1="${f(y + 1)}" x2="${f(r)}" y2="${f(y + 1)}" stroke="rgba(0,0,0,.55)" stroke-width=".8"/>`;
    s += `<line x1="${f(l)}" y1="${f(y)}" x2="${f(r)}" y2="${f(y)}" stroke="#d9e1e8" stroke-width="1.3"/>`;
  }
  s += `<rect x="${f(a0 - 1)}" y="${nut - 3}" width="${f(b0 - a0 + 2)}" height="4" rx="1" fill="#f2ecdc"/>`;
  return { svg: s, outline: d };
}

function humbucker(p, cx, cy, { w = 40, h = 18, ring = '#0d0e12', poles = 6 } = {}) {
  const x = cx - w / 2, y = cy - h / 2;
  let s = `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="3.5" fill="${ring}" stroke="rgba(255,255,255,.2)" stroke-width=".8"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h / 2 - .4}" rx="1.6" fill="#15161b" stroke="#30333c" stroke-width=".6"/>`;
  s += `<rect x="${x}" y="${cy + .4}" width="${w}" height="${h / 2 - .4}" rx="1.6" fill="#15161b" stroke="#30333c" stroke-width=".6"/>`;
  for (let i = 0; i < poles; i++) {
    const px = f(x + w * (i + .5) / poles);
    s += `<circle cx="${px}" cy="${f(cy - h / 4)}" r="1.6" fill="url(#${p}chrome)"/><circle cx="${px}" cy="${f(cy + h / 4)}" r="1.6" fill="#8b949c"/>`;
  }
  return s;
}

function soapbar(p, cx, cy, n, w = 46) {
  let s = `<rect x="${cx - w / 2}" y="${cy - 8}" width="${w}" height="16" rx="7" fill="#101114" stroke="#33363e" stroke-width=".8"/>`;
  spread(cx, (w - 12) / (n - 1 || 1), n).forEach(x => { s += `<circle cx="${f(x)}" cy="${cy}" r="2" fill="#3a3e46"/>`; });
  return s;
}

function tuneOMatic(p, cx, y, w = 46, n = 6) {
  let s = `<circle cx="${cx - w / 2 - 3}" cy="${y}" r="3.4" fill="url(#${p}chrome)"/><circle cx="${cx + w / 2 + 3}" cy="${y}" r="3.4" fill="url(#${p}chrome)"/>`;
  s += `<rect x="${cx - w / 2}" y="${y - 3.5}" width="${w}" height="7" rx="2" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".5"/>`;
  spread(cx, w / (n + .5), n).forEach(x => { s += `<rect x="${f(x - 2.4)}" y="${y - 2.6}" width="4.8" height="5.2" rx="1" fill="url(#${p}chrome)" stroke="#59626b" stroke-width=".4"/>`; });
  return s;
}

function knob(p, cx, cy, r = 7.5) {
  return `<circle cx="${cx + 1.5}" cy="${cy + 2.5}" r="${r + 1}" fill="rgba(0,0,0,.45)"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}knob)" stroke="#000" stroke-width=".6"/>
    <circle cx="${cx}" cy="${cy}" r="${r * .48}" fill="#c9a24a" opacity=".9"/>
    <circle cx="${cx - r * .25}" cy="${cy - r * .3}" r="${r * .2}" fill="#fff" opacity=".35"/>
    <line x1="${cx}" y1="${cy - r * .5}" x2="${cx}" y2="${cy - r * .95}" stroke="#f1e6c8" stroke-width="1"/>`;
}

function toggle(p, cx, cy) {
  return `<circle cx="${cx}" cy="${cy}" r="7" fill="#e9e1cd" stroke="#b3aa94" stroke-width=".6"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="url(#${p}chrome)"/>
    <line x1="${cx}" y1="${cy}" x2="${cx - 5}" y2="${cy - 9}" stroke="#cfd8e0" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="${cx - 5}" cy="${cy - 9}" r="2.4" fill="#f4efe2"/>`;
}

function tuner(p, px, py, bx, by) {
  return `<line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#bfc8d0" stroke-width="3.2" stroke-linecap="round"/>
    <ellipse cx="${bx}" cy="${by}" rx="6.5" ry="4.4" fill="url(#${p}chromeV)" stroke="#3b444d" stroke-width=".5"/>
    <circle cx="${px}" cy="${py}" r="3.8" fill="#6f7983"/><circle cx="${px}" cy="${py}" r="2.3" fill="url(#${p}chrome)"/>`;
}

function strings(nutY, endY, nutXs, endXs, widths) {
  let s = '<g class="strings">';
  nutXs.forEach((x, i) => { s += `<line x1="${f(x)}" y1="${nutY}" x2="${f(endXs[i])}" y2="${endY}" stroke="#e2eaf1" stroke-width="${widths[i]}" opacity=".92"/>`; });
  return s + '</g>';
}
const headStrings = (nutY, nutXs, posts, widths) =>
  nutXs.map((x, i) => `<line x1="${f(x)}" y1="${nutY}" x2="${posts[i][0]}" y2="${posts[i][1]}" stroke="#d6dfe7" stroke-width="${widths[i] * .9}" opacity=".85"/>`).join('');
const outlines = (...ds) => `<g class="outline">${ds.map(d => `<path class="draw" d="${d}"/>`).join('')}</g>`;
const W6 = [1.5, 1.3, 1.1, .9, .7, .6];

/* =======================================================
   Guitarra em V
   ======================================================= */
function vGuitar(p, { finish = 'black' }) {
  const nut = 78, L = 360, bridgeY = nut + L;
  const bodyD = 'M150 296 C 132 296 121 304 115 322 L 44 590 C 40 606 50 622 68 620 L 92 618 C 100 617 104 613 107 606 L 150 490 L 193 606 C 196 613 200 617 208 618 L 232 620 C 250 622 260 606 256 590 L 185 322 C 179 304 168 296 150 296 Z';
  const headD = 'M137 80 L163 80 L176 24 C 178 15 172 9 163 12 L150 19 L137 12 C 128 9 122 15 124 24 Z';
  const nk = neck(p, { nut, end: 345, L, frets: 22, w0: 24, w1: 30 });
  const nutXs = spread(150, 3.5, 6), brXs = spread(150, 4.3, 6);
  const posts = [[139, 28], [140.5, 45], [142, 62], [158, 62], [159.5, 45], [161, 28]];
  return `<defs>${commonDefs(p)}</defs>
  <g class="fade">
    ${finishShape(p, bodyD, finish, 'b')}
    ${toggle(p, 102, 424)}
    ${knob(p, 202, 522)}${knob(p, 216, 556)}${knob(p, 190, 566)}
    <circle cx="232" cy="596" r="5" fill="url(#${p}chrome)" stroke="#222" stroke-width=".6"/>
    ${finishShape(p, headD, finish, 'h')}
    ${posts.map((q, i) => tuner(p, q[0], q[1], i < 3 ? 116 : 184, q[1] + 2)).join('')}
    ${nk.svg}
    ${humbucker(p, 150, 372)}${humbucker(p, 150, 412)}
    ${tuneOMatic(p, 150, bridgeY)}
    <path d="M124 452 L176 452 L150 480 Z" fill="url(#${p}chrome)" stroke="#3e464e" stroke-width=".6"/>
    ${brXs.map(x => `<circle cx="${f(x)}" cy="457" r="1.3" fill="#3b434b"/>`).join('')}
    ${strings(nut, 457, nutXs, brXs, W6)}
    ${headStrings(nut, nutXs, posts, W6)}
  </g>
  ${outlines(bodyD, headD, nk.outline)}`;
}

/* =======================================================
   Guitarra angular (escudo configurável)
   ======================================================= */
function angularGuitar(p, { finish = 'ivory', guard = 'black' }) {
  const nut = 78, L = 360, bridgeY = nut + L;
  const bodyD = 'M138 300 L104 238 Q96 226 86 234 L80 240 Q74 246 76 256 L88 470 L62 548 Q58 562 70 568 L118 588 Q128 592 134 584 L178 512 L220 562 Q228 570 238 564 L262 540 Q270 530 264 520 L236 440 L226 360 Q224 348 214 342 L166 300 Z';
  const headD = 'M138 80 L162 80 L182 22 C 185 12 178 5 169 7 L142 16 C 133 19 130 26 132 34 Z';
  const guardD = 'M128 336 L176 336 L196 356 L202 440 L184 476 L146 534 L112 528 L106 470 L114 356 Z';
  const [gFill, gEdge] = guard === 'white' ? ['#f4efe2', '#1a1b20'] : ['#0c0d11', '#f4efe2'];
  const nk = neck(p, { nut, end: 345, L, frets: 22, w0: 24, w1: 30, binding: false });
  const nutXs = spread(150, 3.5, 6), brXs = spread(150, 4.3, 6);
  const posts = Array.from({ length: 6 }, (_, i) => [f(156 + 16 * i / 5), f(68 - 48 * i / 5)]).reverse();
  return `<defs>${commonDefs(p)}</defs>
  <g class="fade">
    ${finishShape(p, bodyD, finish, 'b', finish === 'ivory' ? .28 : .45)}
    <path d="${guardD}" fill="${gFill}" stroke="${gEdge}" stroke-width="1.6"/>
    ${toggle(p, 102, 298)}
    ${knob(p, 224, 478)}${knob(p, 236, 505)}${knob(p, 224, 532)}
    ${finishShape(p, headD, finish, 'h', finish === 'ivory' ? .28 : .45)}
    ${posts.map(q => tuner(p, q[0], q[1], q[0] + 22, q[1] + 2)).join('')}
    ${nk.svg}
    ${humbucker(p, 150, 372)}${humbucker(p, 150, 412)}
    ${tuneOMatic(p, 150, bridgeY)}
    <rect x="126" y="455" width="48" height="8" rx="4" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".5"/>
    ${strings(nut, 459, nutXs, brXs, W6)}
    ${headStrings(nut, nutXs, posts, W6)}
  </g>
  ${outlines(bodyD, headD, nk.outline)}`;
}

/* =======================================================
   Superstrat: corpo de cintura dupla com chifres pontudos,
   mão pontuda, trava na pestana e ponte de alavanca
   ======================================================= */
function superstrat(p, { finish = 'black' }) {
  const nut = 78, L = 360, bridgeY = nut + L;
  const bodyD = 'M138 340 C 130 326 122 300 110 292 C 100 286 88 290 88 302 C 88 330 92 360 84 392 C 72 420 58 470 68 520 C 80 580 130 612 170 606 C 218 600 248 560 240 504 C 236 470 222 444 226 420 C 230 392 238 372 232 348 C 228 330 214 326 206 336 C 196 348 184 360 166 362 Z';
  const headD = 'M139 80 L161 80 L172 30 L177 6 L150 26 L132 36 Z';
  const nk = neck(p, { nut, end: 352, L, frets: 24, w0: 24, w1: 30, binding: false });
  const nutXs = spread(150, 3.5, 6), brXs = spread(150, 4.3, 6);
  const posts = Array.from({ length: 6 }, (_, i) => [f(157 + 12 * i / 5), f(70 - 46 * i / 5)]).reverse();
  return `<defs>${commonDefs(p)}</defs>
  <g class="fade">
    ${finishShape(p, bodyD, finish, 'b', finish === 'white' ? .3 : .45)}
    ${knob(p, 206, 500)}${knob(p, 220, 528)}
    <rect x="192" y="466" width="16" height="5" rx="2" fill="#15161b" transform="rotate(-30 200 468)"/>
    <rect x="198" y="462" width="4" height="8" rx="1" fill="#e9e1cd" transform="rotate(-30 200 468)"/>
    ${finishShape(p, headD, finish, 'h', finish === 'white' ? .3 : .45)}
    ${posts.map(q => tuner(p, q[0], q[1], q[0] + 18, q[1] + 2)).join('')}
    ${nk.svg}
    <rect x="135" y="${nut - 9}" width="30" height="7" rx="1.5" fill="#1b1d22" stroke="#59626b" stroke-width=".5"/>
    ${[141, 150, 159].map(x => `<circle cx="${x}" cy="${nut - 5.5}" r="1.6" fill="url(#${p}chrome)"/>`).join('')}
    ${humbucker(p, 150, 374)}${humbucker(p, 150, 412)}
    <rect x="122" y="428" width="56" height="24" rx="3" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".6"/>
    ${brXs.map(x => `<rect x="${f(x - 2.4)}" y="${bridgeY - 6}" width="4.8" height="9" rx="1" fill="url(#${p}chrome)" stroke="#59626b" stroke-width=".4"/>`).join('')}
    ${brXs.map(x => `<rect x="${f(x - 2)}" y="452" width="4" height="10" rx="1.6" fill="url(#${p}chrome)" stroke="#59626b" stroke-width=".4"/>`).join('')}
    <path d="M178 444 C 196 446 204 470 214 520" fill="none" stroke="#c9d2da" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="214" cy="521" r="3" fill="#15161b"/>
    ${strings(nut, bridgeY, nutXs, brXs, W6)}
    ${headStrings(nut - 6, nutXs, posts, W6)}
  </g>
  ${outlines(bodyD, headD, nk.outline)}`;
}

/* =======================================================
   Baixo estilo "4001" (cresting wave, escudo em 2 níveis,
   capa cromada na ponte). Sem logo nem cordal em "R".
   ======================================================= */
function bass4001(p, { finish = 'fireglo' }) {
  const nut = 64, L = 430, bridgeY = nut + L;
  const bodyD = 'M138 330 C 128 312 116 280 110 262 C 106 248 96 242 90 252 C 80 270 76 300 78 330 C 80 360 84 390 78 420 C 62 450 56 520 76 568 C 96 610 150 622 196 606 C 236 592 250 540 238 488 C 232 462 220 448 222 426 C 224 404 236 386 232 364 C 230 346 216 340 206 348 C 196 356 192 372 178 376 C 170 378 164 372 162 362 Z';
  const headD = 'M138 66 L162 66 C 168 52 178 40 178 24 C 178 10 166 2 152 4 C 140 6 132 12 128 20 C 124 30 126 44 132 54 Z';
  const guardLow = 'M132 376 L164 376 C 172 378 178 378 184 372 C 192 362 200 354 210 356 C 222 360 226 376 222 392 C 218 410 212 426 214 440 C 216 452 226 466 230 488 C 236 520 228 554 210 572 C 196 584 176 582 170 566 L166 524 L134 524 L128 470 Z';
  const guardHigh = 'M178 474 C 198 464 222 478 224 506 C 226 536 212 560 192 562 C 180 563 174 552 174 538 Z';
  const coverD = 'M124 466 L176 466 C 180 466 182 469 182 473 L178 512 C 178 516 175 518 171 518 L129 518 C 125 518 122 516 122 512 L118 473 C 118 469 120 466 124 466 Z';
  const nk = neck(p, { nut, end: 368, L, frets: 20, w0: 22, w1: 31, inlay: 'triangle' });
  const nutXs = spread(150, 5, 4), brXs = spread(150, 6.6, 4), tailXs = spread(150, 7, 4);
  const widths = [2, 1.7, 1.35, 1.05];
  const posts = [[140, 28], [141, 48], [160, 48], [164, 26]];
  return `<defs>${commonDefs(p)}</defs>
  <g class="fade">
    ${finishShape(p, bodyD, finish, 'b', .4)}
    <path d="${bodyD}" fill="none" stroke="#f3efe4" stroke-width="3.2"/>
    <path d="${bodyD}" fill="none" stroke="#111" stroke-width="3.2" stroke-dasharray="2.6 2.6"/>
    <path d="${guardLow}" fill="rgba(0,0,0,.35)" transform="translate(1.5 2.5)"/>
    <path d="${guardLow}" fill="#f4f0e6" stroke="#cfc7b3" stroke-width="1"/>
    <path d="${guardHigh}" fill="rgba(0,0,0,.4)" transform="translate(2.5 4)"/>
    <path d="${guardHigh}" fill="#fbf8f1" stroke="#d6cfbd" stroke-width="1.2"/>
    ${toggle(p, 206, 386)}
    ${knob(p, 192, 490, 7)}${knob(p, 212, 504, 7)}${knob(p, 190, 528, 7)}${knob(p, 210, 542, 7)}
    ${finishShape(p, headD, 'black', 'h')}
    <path d="M144 56 L156 56 L158 66 L142 66 Z" fill="#f4f0e6" stroke="#cfc7b3" stroke-width=".5"/>
    ${posts.map((q, i) => tuner(p, q[0], q[1], i < 2 ? 116 : 188, q[1] + 2)).join('')}
    ${nk.svg}
    <rect x="131" y="384" width="38" height="17" rx="8" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".6"/>
    <rect x="135" y="391.5" width="30" height="2" rx="1" fill="#4b545c"/>
    <rect x="129" y="446" width="42" height="13" rx="3" fill="#111216" stroke="#3a3d45" stroke-width=".8"/>
    ${brXs.map(x => `<circle cx="${f(x)}" cy="452.5" r="2" fill="url(#${p}chrome)"/>`).join('')}
    <rect x="126" y="${bridgeY - 6}" width="48" height="12" rx="2" fill="url(#${p}chromeV)"/>
    ${strings(nut, 532, nutXs, tailXs, widths)}
    ${headStrings(nut, nutXs, posts, widths)}
    <path d="${coverD}" fill="rgba(0,0,0,.45)" transform="translate(2 3)"/>
    <path d="${coverD}" fill="url(#${p}plate)" stroke="#59626b" stroke-width=".7"/>
    <rect x="128" y="526" width="44" height="12" rx="3" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".6"/>
    ${tailXs.map(x => `<circle cx="${f(x)}" cy="532" r="1.5" fill="#3b434b"/>`).join('')}
  </g>
  ${outlines(bodyD, headD, nk.outline)}`;
}

/* =======================================================
   Baixo moderno ativo (4 ou 5 cordas), cintura dupla,
   dois captadores tipo "soapbar"
   ======================================================= */
function bassModern(p, { finish = 'black', strings: n = 4 }) {
  n = Number(n) || 4;
  const nut = 64, L = 430, bridgeY = nut + L;
  const bodyD = 'M138 372 C 128 352 118 318 104 300 C 94 288 82 292 82 306 C 82 340 90 380 82 412 C 70 446 58 500 70 548 C 84 600 130 624 170 618 C 220 610 250 568 242 512 C 238 480 222 456 226 432 C 230 404 240 380 234 352 C 230 334 216 328 208 340 C 198 356 186 372 166 376 Z';
  const headD = 'M138 66 L162 66 C 170 50 176 36 172 18 C 168 6 156 2 146 4 C 134 6 126 16 128 30 C 130 44 134 56 138 66 Z';
  const five = n === 5;
  const nk = neck(p, { nut, end: 368, L, frets: 21, w0: five ? 27 : 22, w1: five ? 36 : 31, binding: false });
  const nutXs = spread(150, five ? 4.4 : 5, n), brXs = spread(150, five ? 5.8 : 6.6, n);
  const widths = five ? [2.3, 2, 1.7, 1.35, 1.05] : [2, 1.7, 1.35, 1.05];
  const posts = five ? [[140, 18], [141, 36], [142, 54], [159, 46], [161, 24]] : [[140, 24], [141, 46], [159, 46], [160, 24]];
  const left = five ? 3 : 2;
  return `<defs>${commonDefs(p)}</defs>
  <g class="fade">
    ${finishShape(p, bodyD, finish, 'b', .45)}
    ${knob(p, 200, 522, 7)}${knob(p, 214, 548, 7)}${knob(p, 198, 572, 7)}
    ${finishShape(p, headD, finish, 'h')}
    ${posts.map((q, i) => tuner(p, q[0], q[1], i < left ? 118 : 182, q[1] + 2)).join('')}
    ${nk.svg}
    ${soapbar(p, 150, 412, n)}${soapbar(p, 150, 452, n)}
    <rect x="122" y="${bridgeY - 8}" width="56" height="18" rx="2" fill="url(#${p}chromeV)" stroke="#3e464e" stroke-width=".6"/>
    ${brXs.map(x => `<rect x="${f(x - 2.4)}" y="${bridgeY - 5}" width="4.8" height="10" rx="1" fill="url(#${p}chrome)" stroke="#59626b" stroke-width=".4"/>`).join('')}
    ${strings(nut, bridgeY + 6, nutXs, brXs, widths)}
    ${headStrings(nut, nutXs, posts, widths)}
  </g>
  ${outlines(bodyD, headD, nk.outline)}`;
}

/* =======================================================
   Bateria
   ======================================================= */
const SHELLS = {
  blue: ['#010207', '#1a2440', '#4f66a0', '#121a30', '#0c1222', '#26324f'],
  red: ['#120203', '#4a0b0e', '#b02a2f', '#3a0709', '#2a0507', '#6a1418'],
  wine: ['#12030a', '#3d0d1f', '#93304f', '#2e0816', '#220510', '#5a1a30'],
  silver: ['#2a2e33', '#8b939b', '#e6ebef', '#6b737a', '#4a5157', '#a3abb3'],
  jet: ['#000', '#0c0c0c', '#3a3a3a', '#0a0a0a', '#050505', '#1c1c1c'],
};
function drumDefs(p, finish) {
  const s = SHELLS[finish] || SHELLS.blue;
  return `
    ${linear(`${p}shell`, [[0, s[0]], [.18, s[1]], [.28, s[2]], [.36, s[3]], [.75, s[4]], [.9, s[5]], [1, s[0]]])}
    ${radial(`${p}head`, .45, .4, .7, [[0, '#fdfcf7'], [.7, '#e3ded0'], [1, '#b5ae9c']])}
    ${radial(`${p}bronze`, .5, .5, .5, [[0, '#fff4c8'], [.14, '#e9c060'], [.22, '#b8842a'], [.55, '#d7a646'], [.85, '#8f5e18'], [1, '#5b3a0c']])}
    ${radial(`${p}reso`, .42, .38, .7, [[0, s[2]], [.25, s[1]], [.7, s[4]], [1, s[0]]])}`;
}
function stand(x, y0, bot, w = 26) {
  return `<line x1="${x}" y1="${y0}" x2="${x}" y2="${bot - 22}" stroke="#aeb8c2" stroke-width="3"/>
    <line x1="${x}" y1="${bot - 26}" x2="${x - w}" y2="${bot}" stroke="#8d97a1" stroke-width="2.4"/>
    <line x1="${x}" y1="${bot - 26}" x2="${x + w}" y2="${bot}" stroke="#8d97a1" stroke-width="2.4"/>
    <line x1="${x}" y1="${bot - 26}" x2="${x + 3}" y2="${bot + 2}" stroke="#727c86" stroke-width="2.4"/>`;
}
function cymbal(p, cx, cy, rx, ry, rot, cls) {
  let s = `<g class="${cls}"><g transform="rotate(${rot} ${cx} ${cy})">`;
  s += `<ellipse cx="${cx}" cy="${cy + 3}" rx="${rx}" ry="${ry}" fill="rgba(0,0,0,.3)"/>`;
  s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#${p}bronze)"/>`;
  for (let i = 1; i <= 6; i++) s += `<ellipse cx="${cx}" cy="${cy}" rx="${f(rx * i / 7)}" ry="${f(ry * i / 7)}" fill="none" stroke="rgba(80,45,5,.25)" stroke-width=".6"/>`;
  s += `<ellipse cx="${cx}" cy="${cy - 1.5}" rx="${f(rx * .17)}" ry="${f(ry * .6)}" fill="#f0cf7a" stroke="rgba(255,245,210,.75)" stroke-width=".6"/>`;
  s += `<circle cx="${cx}" cy="${cy - 2.5}" r="2" fill="#3a3f47"/>`;
  s += `<path d="M${f(cx - rx * .8)} ${f(cy - ry * .35)} Q ${cx} ${f(cy - ry * 1.1)} ${f(cx + rx * .5)} ${f(cy - ry * .6)}" stroke="rgba(255,255,255,.6)" stroke-width="1.2" fill="none"/>`;
  s += `<ellipse class="draw" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  return s + '</g></g>';
}
function cyl(p, { cx, y0, w, h, ry, lugs, cls, shell }) {
  const l = cx - w / 2, r = cx + w / 2, bot = y0 + h, rx = w / 2;
  const shellD = `M${l} ${y0} V${bot} A${rx} ${ry} 0 0 0 ${r} ${bot} V${y0} A${rx} ${ry} 0 0 0 ${l} ${y0} Z`;
  let s = `<g class="${cls}"><path d="${shellD}" fill="${shell}"/>`;
  for (let k = 0; k < lugs; k++) {
    const th = (-72 + 144 * k / (lugs - 1)) * Math.PI / 180;
    const x = f(cx + Math.sin(th) * rx * .94);
    const yo = Math.cos(th) * ry;
    const lw = f(2 + 4 * Math.cos(th));
    s += `<line x1="${x}" y1="${f(y0 + yo + 2)}" x2="${x}" y2="${f(bot + yo - 2)}" stroke="#a7b1bb" stroke-width=".9" opacity=".85"/>`;
    s += `<rect x="${f(x - lw / 2)}" y="${f(y0 + h * .32 + yo)}" width="${lw}" height="${f(h * .36)}" rx="1.2" fill="url(#${p}chrome)"/>`;
  }
  s += `<path d="M${l} ${bot} A${rx} ${ry} 0 0 0 ${r} ${bot}" fill="none" stroke="#c9d2da" stroke-width="3.5"/>`;
  s += `<ellipse cx="${cx}" cy="${y0}" rx="${rx}" ry="${ry}" fill="url(#${p}head)"/>`;
  s += `<ellipse cx="${cx}" cy="${y0}" rx="${rx}" ry="${ry}" fill="none" stroke="#dfe6ec" stroke-width="3.5"/>`;
  s += `<path d="M${l} ${y0} A${rx} ${ry} 0 0 0 ${r} ${y0}" fill="none" stroke="#5f6a74" stroke-width="1" transform="translate(0 2.4)"/>`;
  s += `<path class="draw" d="${shellD}"/>`;
  return s + '</g>';
}
function kick(p, cx, cy, R, mark) {
  let s = `<g class="kick">`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 8}" fill="#05070e"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R + 4}" fill="none" stroke="url(#${p}shell)" stroke-width="8"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#${p}reso)"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${R - 3}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1.5"/>`;
  s += `<circle class="kick-ring" cx="${cx}" cy="${cy}" r="${R * .5}" fill="none" stroke-width="2"/>`;
  if (mark) s += `<text class="kick-mark" x="${cx}" y="${cy + 10}">${mark}</text>`;
  s += `<circle cx="${f(cx + R * .52)}" cy="${f(cy + R * .44)}" r="12" fill="#000" stroke="#c9d2da" stroke-width="2"/>`;
  for (let i = 0; i < 10; i++) {
    const deg = i * 36 + 18, a = deg * Math.PI / 180;
    const x = f(cx + Math.cos(a) * (R + 7)), y = f(cy + Math.sin(a) * (R + 7));
    s += `<rect x="${f(x - 3)}" y="${f(y - 8)}" width="6" height="16" rx="1.5" fill="url(#${p}chrome)" transform="rotate(${deg + 90} ${x} ${y})"/>`;
  }
  s += `<ellipse cx="${f(cx - R * .35)}" cy="${f(cy - R * .45)}" rx="${f(R * .45)}" ry="${f(R * .18)}" fill="#fff" opacity=".07" transform="rotate(-30 ${f(cx - R * .35)} ${f(cy - R * .45)})"/>`;
  s += `<circle class="draw" cx="${cx}" cy="${cy}" r="${R + 8}"/>`;
  return s + '</g>';
}
function drumKit(p, { finish = 'blue', mark = '' }) {
  const sh = `url(#${p}shell)`;
  return `<defs>${commonDefs(p)}${drumDefs(p, finish)}</defs>
  <g class="fade">
    ${stand(92, 88, 432)}${stand(372, 96, 432)}${stand(54, 214, 432, 22)}
    <rect x="40" y="426" width="30" height="8" rx="2" fill="#2a2f38" stroke="#8d97a1" stroke-width=".8"/>
    <line x1="150" y1="384" x2="122" y2="432" stroke="#9aa4ae" stroke-width="3"/>
    <line x1="310" y1="384" x2="338" y2="432" stroke="#9aa4ae" stroke-width="3"/>
    <line x1="230" y1="224" x2="230" y2="182" stroke="#c4cdd5" stroke-width="5"/>
    <line x1="230" y1="192" x2="196" y2="194" stroke="#c4cdd5" stroke-width="4"/>
    <line x1="230" y1="188" x2="266" y2="186" stroke="#c4cdd5" stroke-width="4"/>
    <line x1="342" y1="372" x2="334" y2="434" stroke="#9aa4ae" stroke-width="3"/>
    <line x1="422" y1="372" x2="432" y2="434" stroke="#9aa4ae" stroke-width="3"/>
    <line x1="96" y1="330" x2="96" y2="404" stroke="#aeb8c2" stroke-width="3"/>
    <line x1="96" y1="404" x2="70" y2="432" stroke="#8d97a1" stroke-width="2.4"/><line x1="96" y1="404" x2="122" y2="432" stroke="#8d97a1" stroke-width="2.4"/>
  </g>
  ${cymbal(p, 92, 88, 64, 11, 12, 'cymbal cymbal--l')}
  ${cymbal(p, 372, 96, 74, 12, -10, 'cymbal cymbal--r')}
  <g class="hat">${cymbal(p, 54, 220, 44, 7, 0, 'hat__bottom')}${cymbal(p, 54, 211, 44, 7, 0, 'hat__top')}</g>
  ${cyl(p, { cx: 180, y0: 148, w: 84, h: 60, ry: 15, lugs: 6, cls: 'tom tom--1', shell: sh })}
  ${cyl(p, { cx: 282, y0: 140, w: 90, h: 66, ry: 16, lugs: 6, cls: 'tom tom--2', shell: sh })}
  ${kick(p, 230, 318, 100, mark)}
  ${cyl(p, { cx: 382, y0: 262, w: 100, h: 118, ry: 20, lugs: 7, cls: 'floor', shell: sh })}
  ${cyl(p, { cx: 96, y0: 284, w: 96, h: 40, ry: 15, lugs: 8, cls: 'snare', shell: `url(#${p}chrome)` })}`;
}

const builders = { v: vGuitar, x: angularGuitar, superstrat, bass4001, bassModern, drums: drumKit };

export function buildInstruments(root = document) {
  root.querySelectorAll('svg[data-instrument]').forEach(svg => {
    const build = builders[svg.dataset.instrument];
    if (build && !svg.childElementCount) svg.innerHTML = build(`i${uid++}-`, { ...svg.dataset });
  });
}
