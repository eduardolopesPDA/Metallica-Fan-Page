/* Utilidades das ilustrações das cenas */
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const VB = 'viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet"';
/** pseudo-aleatório fixo: o desenho sai igual sempre */
export const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
/** prepara caminhos para serem "desenhados" (stroke-dashoffset) */
export function prepDraw(el, sel) {
  el.querySelectorAll(sel).forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.len = L; });
}
export function setDraw(el, sel, k) {
  el.querySelectorAll(sel).forEach(p => { p.style.strokeDashoffset = p.dataset.len * (1 - clamp(k)); });
}
/** mostra um texto letra por letra (tspan com data-full) */
export function typeText(el, sel, k) {
  el.querySelectorAll(sel).forEach(t => { const full = t.dataset.full || (t.dataset.full = t.textContent); t.textContent = full.slice(0, Math.ceil(clamp(k) * full.length)); });
}
/** aparece com escala (carimbo) */
export function stamp(node, k, cx, cy, rot = -8) {
  if (!node) return;
  const s = 1 + 1.6 * (1 - clamp(k));
  node.style.opacity = clamp(k * 3);
  node.setAttribute('transform', `translate(${cx} ${cy}) rotate(${rot}) scale(${s.toFixed(3)}) translate(${-cx} ${-cy})`);
}
/** silhueta simples de pessoa (cabeça + tronco), em pé em (x, y) = pés */
export const person = (x, y, h = 120, cls = 'a-line a-fillsoft') =>
  `<circle class="${cls}" cx="${x}" cy="${y - h + h * .12}" r="${h * .12}"/><path class="${cls}" d="M${x - h * .2} ${y} L${x - h * .17} ${y - h * .62} Q${x} ${y - h * .74} ${x + h * .17} ${y - h * .62} L${x + h * .2} ${y} Z"/>`;
/** envelope com cartão (Grammy) */
export const envelope = (label, winner) => `
  <g class="d2"><rect class="a-line a-fillsoft" x="250" y="170" width="300" height="190" rx="6"/>
    <g class="card"><rect class="a-line" x="272" y="150" width="256" height="150" rx="4" style="fill: var(--bg)"/>
      <text class="a-tag" x="400" y="196" text-anchor="middle">${label}</text>
      <text class="a-big a-winner" x="400" y="262" text-anchor="middle" style="font-size:34px">${winner}</text></g>
    <path class="a-line a-fillsoft" d="M250 176 L400 270 L550 176 L550 360 L250 360 Z"/>
    <path class="a-line flap" d="M250 172 L400 262 L550 172"/></g>`;
export function envelopeUpdate(el, p) {
  const card = el.querySelector('.card'), flap = el.querySelector('.flap');
  const k = clamp((p - .1) * 2.2);
  flap?.setAttribute('transform', `translate(0 172) scale(1 ${(1 - 2 * clamp(k * 1.6)).toFixed(3)}) translate(0 -172)`);
  card?.setAttribute('transform', `translate(0 ${(70 - 150 * clamp((k - .3) * 1.6)).toFixed(1)})`);
}
