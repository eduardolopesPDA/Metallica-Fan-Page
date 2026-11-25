/* =========================================================
   MASTER OF PUPPETS — tema "Cordas"
   Títulos, instrumentos e cards ficam pendurados em cordas
   (cadeias Verlet) presas a uma cruzeta no topo. O visitante
   pode agarrar e puxar as cordas; soltar dedilha a corda
   (síntese Karplus-Strong).
   ========================================================= */
import { createShow } from './mop-marionettes.js';

let api, W = 0, H = 0;
const puppets = [];
let barY = 78, lastScroll = 0, grab = null, show = null;

/* cordas das marionetes: mesma física Verlet, o pivô na cruzeta segue o boneco devagar */
function simulateWire(c, ax, ay, k) {
  const pts = c.pts, n = pts.length;
  const len = Math.hypot(ax - c.px, ay - barY) / (n - 1) * 1.015;
  for (const q of pts) {
    const vx = (q.x - q.ox) * .98, vy = (q.y - q.oy) * .98;
    q.ox = q.x; q.oy = q.y; q.x += vx; q.y += vy + .25 * k;
  }
  for (let it = 0; it < 6; it++) {
    pts[0].x = c.px; pts[0].y = barY;
    pts[n - 1].x = ax; pts[n - 1].y = ay;
    if (grab && grab.chain === c) { pts[grab.idx].x = grab.x; pts[grab.idx].y = grab.y; }
    for (let j = 0; j < n - 1; j++) {
      const q1 = pts[j], q2 = pts[j + 1];
      const dx = q2.x - q1.x, dy = q2.y - q1.y, d = Math.hypot(dx, dy) || 1;
      const diff = (d - len) / d * .5;
      if (j > 0) { q1.x += dx * diff; q1.y += dy * diff; }
      if (j < n - 2) { q2.x -= dx * diff; q2.y -= dy * diff; }
    }
  }
}
function stepWires(dt) {
  if (!show) return;
  const vis = show.visible(), k = dt / 16;
  for (const w of show.wires) {
    w.alpha = (w.alpha || 0) + ((vis ? 1 : 0) - (w.alpha || 0)) * .12;
    if (w.alpha < .02) { w.chain = null; continue; }
    const r = w.el.getBoundingClientRect();
    const ax = r.left + r.width / 2, ay = r.top + r.height / 2;
    if (!w.chain) w.chain = makeChain(ax, ax, ay);
    w.chain.px += (ax - w.chain.px) * .04;
    simulateWire(w.chain, ax, ay, k);
  }
}
function drawChain(ctx, c, alpha) {
  const pts = c.pts;
  ctx.strokeStyle = `rgba(${BONE},${.7 * alpha})`;
  ctx.lineWidth = grab && grab.chain === c ? 1.8 : 1.1;
  ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
  for (let j = 1; j < pts.length - 1; j++) {
    const mx = (pts[j].x + pts[j + 1].x) / 2, my = (pts[j].y + pts[j + 1].y) / 2;
    ctx.quadraticCurveTo(pts[j].x, pts[j].y, mx, my);
  }
  const last = pts[pts.length - 1]; ctx.lineTo(last.x, last.y); ctx.stroke();
  ctx.fillStyle = `rgba(${GOLD},${alpha})`;
  ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 2.4, 0, Math.PI * 2); ctx.fill();
}

const BONE = '239,227,207', GOLD = '217,164,65';

/* ---------- som: corda dedilhada (Karplus-Strong) ---------- */
const ksCache = new Map();
function pluck(freq = 196, gain = .35) {
  const { audio } = api;
  if (!audio.on) return;
  const ac = audio.ctx, key = Math.round(freq);
  let buf = ksCache.get(key);
  if (!buf) {
    const sr = ac.sampleRate, len = Math.floor(sr * 1.8), N = Math.max(2, Math.round(sr / freq));
    buf = ac.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < N; i++) d[i] = Math.random() * 2 - 1;
    for (let i = N; i < len; i++) d[i] = .996 * .5 * (d[i - N] + d[i - N - 1 < 0 ? 0 : i - N - 1]);
    ksCache.set(key, buf);
  }
  const src = ac.createBufferSource(); src.buffer = buf;
  const g = ac.createGain(); g.gain.value = gain;
  src.connect(g).connect(audio.out); src.start();
}

/* ---------- marionetes ---------- */
function puppet(el, attach, opts = {}) {
  const p = { el, attach, theta: 0, omega: 0, sign: puppets.length % 2 ? 1 : -1, yOff: opts.yOff || 0, chains: [], cut: false, alpha: 0, k: opts.k ?? 9 };
  el.style.transformOrigin = '50% 0';
  puppets.push(p);
  return p;
}
function frame(p) {
  const host = p.el.offsetParent;
  if (!host) return null;
  const r = host.getBoundingClientRect();
  return { x: r.left + p.el.offsetLeft, y: r.top + p.el.offsetTop, w: p.el.offsetWidth, h: p.el.offsetHeight };
}
function attachPoint(f, fx, theta, yOff) {
  const dx = (fx - .5) * f.w, y = f.h * yOff;
  return { x: f.x + f.w / 2 + dx * Math.cos(theta) - y * Math.sin(theta), y: f.y + dx * Math.sin(theta) + y * Math.cos(theta) };
}
function makeChain(px, ax, ay) {
  const N = 12, pts = [];
  for (let i = 0; i < N; i++) { const t = i / (N - 1); const x = px + (ax - px) * t, y = barY + (ay - barY) * t; pts.push({ x, y, ox: x, oy: y }); }
  return { pts, px };
}

function step(dt) {
  const s = window.scrollY, ds = s - lastScroll; lastScroll = s;
  const k = dt / 16;
  for (const p of puppets) {
    const f = frame(p);
    if (!f) continue;
    const visible = f.y < H && f.y + f.h > 0 && !p.dead;
    p.alpha += ((visible ? 1 : 0) - p.alpha) * .12;

    // pêndulo amortecido + empurrão da rolagem
    if (!api.reduce) {
      p.omega += (-p.k * p.theta - 1.4 * p.omega) * dt / 1000 + ds * .00018 * p.sign;
      p.theta += p.omega * dt / 1000;
      p.theta = Math.max(-.35, Math.min(.35, p.theta));
    }
    p.el.style.rotate = (p.theta * 57.3).toFixed(2) + 'deg';
    if (p.alpha < .02) { p.chains = []; continue; }

    p.attach.forEach((fx, i) => {
      const a = attachPoint(f, fx, p.theta, p.yOff);
      let c = p.chains[i];
      if (!c) c = p.chains[i] = makeChain(attachPoint(f, fx, 0, p.yOff).x, a.x, a.y);
      c.px = attachPoint(f, fx, 0, p.yOff).x;
      const pts = c.pts, n = pts.length;
      const len = Math.hypot(a.x - c.px, a.y - barY) / (n - 1) * 1.015;
      for (let j = 0; j < n; j++) {
        const q = pts[j];
        const vx = (q.x - q.ox) * .98, vy = (q.y - q.oy) * .98;
        q.ox = q.x; q.oy = q.y; q.x += vx; q.y += vy + .25 * k;
      }
      for (let it = 0; it < 6; it++) {
        pts[0].x = c.px; pts[0].y = barY;
        if (!p.cut) { pts[n - 1].x = a.x; pts[n - 1].y = a.y; }
        if (grab && grab.chain === c) { pts[grab.idx].x = grab.x; pts[grab.idx].y = grab.y; }
        for (let j = 0; j < n - 1; j++) {
          const q1 = pts[j], q2 = pts[j + 1];
          const dx = q2.x - q1.x, dy = q2.y - q1.y, d = Math.hypot(dx, dy) || 1;
          if (p.cut && j === n - 2) continue;
          const diff = (d - len) / d * .5;
          if (j > 0) { q1.x += dx * diff; q1.y += dy * diff; }
          q2.x -= dx * diff; q2.y -= dy * diff;
        }
      }
      // puxar a corda inclina a marionete
      if (grab && grab.chain === c) p.omega += (grab.x - c.px) * .00045 * (dt / 16);
    });
  }
}

function drawStrings() {
  const ctx = api.layer('front').ctx;
  ctx.lineCap = 'round';
  for (const p of puppets) {
    if (p.alpha < .02) continue;
    for (const c of p.chains) {
      const pts = c.pts;
      ctx.strokeStyle = `rgba(${BONE},${.7 * p.alpha * (p.fade ?? 1)})`;
      ctx.lineWidth = grab && grab.chain === c ? 1.8 : 1.1;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let j = 1; j < pts.length - 1; j++) {
        const mx = (pts[j].x + pts[j + 1].x) / 2, my = (pts[j].y + pts[j + 1].y) / 2;
        ctx.quadraticCurveTo(pts[j].x, pts[j].y, mx, my);
      }
      const last = pts[pts.length - 1]; ctx.lineTo(last.x, last.y); ctx.stroke();
      ctx.fillStyle = `rgba(${GOLD},${p.alpha})`;
      ctx.beginPath(); ctx.arc(pts[0].x, pts[0].y, 2.4, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (show) for (const w of show.wires) if (w.chain && w.alpha > .02) drawChain(ctx, w.chain, w.alpha);
}

/* ---------- poeira no ar ---------- */
let dust = [];
function drawDust() {
  const ctx = api.layer('back').ctx;
  for (const d of dust) {
    d.y -= d.v; d.x += Math.sin((d.y + d.s) / 60) * .25;
    if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
    ctx.fillStyle = `rgba(255,214,160,${d.a})`;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
  }
}

/* ---------- homenagem: as cordas do Cliff se soltam ---------- */
function farewell(section) {
  const p = puppets.find(q => q.el === section.querySelector('.puppet'));
  if (!p || p.cut) return;
  p.cut = true;
  pluck(98, .4);
  const visual = section.querySelector('.member__visual');
  api.gsap.to(p.el, { y: -90, opacity: .18, duration: 4, ease: 'power1.inOut' });
  api.gsap.to(p, { fade: 0, duration: 3, onComplete: () => { p.dead = true; } });
  const r = visual.getBoundingClientRect();
  for (let i = 0; i < 70; i++) {
    setTimeout(() => api.spawn({ x: r.left + r.width * api.rand(.3, .7), y: r.top + r.height * api.rand(.2, .9), vx: api.rand(-.3, .3), vy: api.rand(-1.6, -.4), gravity: -.01, drag: .99, color: GOLD, kind: 'dot', size: api.rand(1.5, 3), decay: .006 }), i * 40);
  }
}

const theme = {
  name: 'mop',
  sparkColor: GOLD,
  ease: 'elastic.out(1, .6)',
  nameEase: 'elastic.out(1, .5)',
  flicker: false,
  keepHeroTitle: true,
  progress: p => Math.round(p * 100),

  init(a) {
    api = a;
    api.onResize((w, h) => { W = w; H = h; dust = Array.from({ length: 70 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: api.rand(.6, 2), v: api.rand(.1, .45), a: api.rand(.15, .5), s: Math.random() * 500 })); });
    const bar = api.$('.control-bar'); if (bar) barY = bar.getBoundingClientRect().bottom - 2;
    show = createShow(api, { pluck });
    api.ticker((now, dt) => { show?.update(now, dt); step(dt); stepWires(dt); drawStrings(); if (!api.reduce) drawDust(); });

    // quem está pendurado
    api.$$('.hero__line').forEach(el => puppet(el, [.15, .85], { k: 7 }));
    const attach = { james: [.27], lars: [.2, .8], kirk: [.27], cliff: [.72] };
    api.$$('.member').forEach(sec => {
      puppet(sec.querySelector('.puppet'), attach[sec.id] || [.5], { yOff: .015 });
      sec.querySelector('.member__visual').insertAdjacentHTML('beforeend', '<span class="stage-curtain stage-curtain--l"></span><span class="stage-curtain stage-curtain--r"></span>');
    });
    api.$$('.string-card').forEach(card => puppet(card.querySelector('.string-card__inner'), [.5], { k: 11 }));

    api.ScrollTrigger.create({ trigger: '#cliff', start: 'bottom 85%', once: true, onEnter: () => farewell(api.$('#cliff')) });
    api.$$('.string-card').forEach((card, i) => card.addEventListener('click', () => {
      card.classList.toggle('is-open');
      card.setAttribute('aria-expanded', card.classList.contains('is-open'));
      const p = puppets.find(q => q.el === card.querySelector('.string-card__inner'));
      if (p) p.omega += api.rand(1.5, 2.5) * (Math.random() < .5 ? -1 : 1);
      pluck(130 + i * 28, .3);
    }));
  },

  loader(a, el) {
    const strings = el.querySelectorAll('.ld-string');
    strings.forEach(s => { const L = s.getTotalLength(); s.style.strokeDasharray = L; s.style.strokeDashoffset = L; });
    return new Promise(resolve => {
      a.gsap.timeline({ onComplete: resolve })
        .from(el.querySelector('.ld-bar'), { y: -120, duration: a.reduce ? .1 : .9, ease: 'bounce.out' })
        .to(strings, { strokeDashoffset: 0, duration: a.reduce ? .1 : .22, stagger: a.reduce ? 0 : .16, ease: 'power2.in' })
        .to(el.querySelector('.ld-bar'), { y: -14, duration: .25, ease: 'power3.in' })
        .to(el.querySelector('.ld-bar'), { y: 0, duration: .5, ease: 'elastic.out(1, .4)' });
    });
  },

  heroTitle(tl, a) {
    tl.from('.hero__line', { y: () => -a.size().H * .6, duration: 1.6, ease: 'elastic.out(1, .45)', stagger: .15 }, .2)
      .from('.hero__line .ch', { autoAlpha: 0, duration: .4, stagger: .03 }, .3)
      .to('.curtain--l', { xPercent: -82, duration: 1.8, ease: 'power3.inOut' }, .1)
      .to('.curtain--r', { xPercent: 82, duration: 1.8, ease: 'power3.inOut' }, .1);
  },

  afterIntro() {
    puppets.slice(0, 2).forEach((p, i) => { p.omega = (i ? 1 : -1) * 1.6; });
  },

  storyCut(scene) {
    let cur = document.querySelector('.story-curtain');
    if (!cur) { document.body.insertAdjacentHTML('beforeend', '<div class="story-curtain" aria-hidden="true"><i></i><i></i></div>'); cur = document.querySelector('.story-curtain'); }
    if (scene.classList.contains('scene--still')) return;
    cur.classList.remove('is-on'); void cur.offsetWidth; cur.classList.add('is-on');
    pluck(api.rand(120, 220), .2);
  },

  onPointerDown(e) {
    let best = null, bd = 16;
    for (const p of puppets) {
      if (p.alpha < .5 || p.cut) continue;
      for (const c of p.chains) c.pts.forEach((q, idx) => {
        if (idx === 0 || idx === c.pts.length - 1) return;
        const d = Math.hypot(q.x - e.clientX, q.y - e.clientY);
        if (d < bd) { bd = d; best = { chain: c, idx, p }; }
      });
    }
    if (show) for (const w of show.wires) {
      if (!w.chain || w.alpha < .5) continue;
      w.chain.pts.forEach((q, idx) => {
        if (idx === 0 || idx === w.chain.pts.length - 1) return;
        const d = Math.hypot(q.x - e.clientX, q.y - e.clientY);
        if (d < bd) { bd = d; best = { chain: w.chain, idx, wire: w }; }
      });
    }
    if (!best) return false;
    grab = { ...best, x: e.clientX, y: e.clientY };
    document.body.classList.add('is-pulling');
    return true;
  },
  onPointerMove(e) {
    if (!grab) return;
    grab.x = e.clientX; grab.y = e.clientY;
    if (grab.wire) show.pull(grab.wire, grab.x, grab.y);
  },
  onPointerUp() {
    if (!grab) return;
    if (grab.wire) show.release(grab.wire);
    const c = grab.chain, len = Math.hypot(c.pts.at(-1).x - c.px, c.pts.at(-1).y - barY);
    pluck(Math.max(70, Math.min(440, 52000 / Math.max(len, 60))), .4);
    grab = null;
    document.body.classList.remove('is-pulling');
  },

  onClick(x, y) {
    // clique numa marionete: ela pula e ergue os braços
    const hit = document.elementFromPoint(x, y)?.closest('.marionette');
    const m = hit && show?.list.find(q => q.svg === hit);
    if (m) { show.jump(m); return; }
    for (const p of puppets) if (p.alpha > .5) p.omega += api.rand(.8, 1.6) * (x < W / 2 ? -1 : 1);
    pluck(api.rand(110, 330), .25);
    api.burst(x, y, 14, { color: GOLD, kind: 'dot', size: 2, speed: 3, gravity: .02 });
  },

  onMemberEnter(section) {
    api.gsap.to(section.querySelectorAll('.stage-curtain--l'), { xPercent: -100, duration: 1.4, ease: 'power3.inOut' });
    api.gsap.to(section.querySelectorAll('.stage-curtain--r'), { xPercent: 100, duration: 1.4, ease: 'power3.inOut' });
    const p = puppets.find(q => q.el === section.querySelector('.puppet'));
    if (p) p.omega += 2.2 * p.sign;
    pluck(160 + Math.random() * 80, .3);
  },
  onMemberLive(section, on) {
    if (!on || api.reduce) return;
    // a bateria do Lars faz todas as cordas do palco tremerem no ritmo
    if (section.id === 'lars' && !section._beat) {
      section._beat = api.gsap.timeline({ repeat: -1 })
        .add(() => { if (section.classList.contains('is-live')) puppets.forEach(p => { if (p.alpha > .5) p.omega += .35 * (Math.random() < .5 ? -1 : 1); }); }, 0)
        .fromTo(section.querySelector('.kick'), { scale: 1.07 }, { scale: 1, duration: .2 }, 0)
        .fromTo(section.querySelector('.snare'), { scale: 1.1 }, { scale: 1, duration: .2 }, .24)
        .to({}, { duration: .24 });
    }
  },

  sound(a) { return a.audio.loop({ type: 'brown', filter: 'bandpass', freq: 420, q: .6, gain: .05 }); },
};

export default theme;
