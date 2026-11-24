/* =========================================================
   MOTOR DE EFEITOS — comum a todos os temas
   - duas camadas de canvas em tela cheia (fundo e frente)
   - um único loop de requestAnimationFrame com "tickers"
   - pausa com a aba oculta, DPR limitado a 2
   - sistema de partículas compartilhado
   ========================================================= */
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(pointer: fine)').matches;
export const rand = (a, b) => a + Math.random() * (b - a);

let W = 0, H = 0, DPR = 1;
const layers = {};
const tickers = new Set();
const resizers = new Set();

function setup(id) {
  const c = document.getElementById(id);
  return c ? { c, ctx: c.getContext('2d') } : null;
}

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  for (const l of Object.values(layers)) {
    if (!l) continue;
    l.c.width = W * DPR; l.c.height = H * DPR;
    l.c.style.width = W + 'px'; l.c.style.height = H + 'px';
    l.ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  resizers.forEach(f => f(W, H));
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(50, now - last); last = now;
  if (!document.hidden) {
    for (const l of Object.values(layers)) if (l) l.ctx.clearRect(0, 0, W, H);
    tickers.forEach(fn => fn(now, dt));
    drawParticles(dt);
  }
  requestAnimationFrame(loop);
}

export function initEngine() {
  layers.back = setup('fx-back');
  layers.front = setup('fx-front');
  resize();
  window.addEventListener('resize', resize);
  requestAnimationFrame(loop);
}

export const ticker = fn => { tickers.add(fn); return () => tickers.delete(fn); };
export const onResize = fn => { resizers.add(fn); if (W) fn(W, H); return () => resizers.delete(fn); };
export const size = () => ({ W, H, DPR });
export const layer = name => layers[name];

/* ---------- partículas ---------- */
const parts = [];
/**
 * kind: 'line' (traço na direção do movimento) | 'dot' | 'drop' (gota que escorre)
 */
export function spawn(p) {
  if (parts.length > 600) return;
  parts.push({ life: 1, decay: .03, gravity: .12, drag: .97, size: 1.4, kind: 'line', color: '255,255,255', layer: 'front', ...p });
}
export function burst(x, y, n, opts = {}) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, s = (opts.speed ?? 4) * Math.random();
    spawn({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - (opts.lift ?? 1), decay: rand(.02, .05), ...opts });
  }
}
function drawParticles() {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    const l = layers[p.layer]; if (!l) continue;
    const ctx = l.ctx;
    p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.vx *= p.drag; p.vy *= p.kind === 'drop' ? .9 : 1; p.life -= p.decay;
    if (p.life <= 0) { parts.splice(i, 1); continue; }
    ctx.save();
    if (p.blend) ctx.globalCompositeOperation = p.blend;
    if (p.kind === 'line') {
      ctx.strokeStyle = `rgba(${p.color},${p.life})`; ctx.lineWidth = p.size;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.5, p.y - p.vy * 2.5); ctx.stroke();
    } else {
      ctx.fillStyle = `rgba(${p.color},${p.kind === 'drop' ? Math.min(1, p.life * 1.5) : p.life})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.kind === 'drop' ? 1 : p.life), 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}
