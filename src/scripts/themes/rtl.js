/* =========================================================
   RIDE THE LIGHTNING — tema "Tempestade"
   Raios procedurais (deslocamento de ponto médio + galhos),
   clarão no ponto do impacto, chuva, trovão sintetizado.
   ========================================================= */
import { setupEggs, toast } from '../core/eggs.js';
import { albums } from '../../data/albums.js';

let api, W = 0, H = 0;
let boltRGB = '120,190,255', midRGB = '190,230,255'; // vira vermelho no easter egg
const bolts = [];
let drops = [];
let charge = 0, charging = false;

/* ---------- geometria ---------- */
function subdivide(x1, y1, x2, y2, disp, iterations = 7) {
  let pts = [{ x: x1, y: y1 }, { x: x2, y: y2 }];
  let d = disp;
  for (let i = 0; i < iterations; i++) {
    const next = [pts[0]];
    for (let j = 0; j < pts.length - 1; j++) {
      const a = pts[j], b = pts[j + 1];
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
      const off = (Math.random() - .5) * d;
      next.push({ x: (a.x + b.x) / 2 + (-dy / len) * off, y: (a.y + b.y) / 2 + (dx / len) * off }, b);
    }
    pts = next; d *= .52;
  }
  return pts;
}
function buildBolt(x1, y1, x2, y2, width, depth, out) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const pts = subdivide(x1, y1, x2, y2, len * .28, depth === 0 ? 5 : 7);
  out.push({ pts, width });
  if (depth > 0) {
    const n = 1 + Math.floor(Math.random() * 3);
    for (let k = 0; k < n; k++) {
      const p = pts[Math.floor(pts.length * (.15 + Math.random() * .6))];
      const ang = Math.atan2(y2 - y1, x2 - x1) + (Math.random() < .5 ? -1 : 1) * (.3 + Math.random() * .7);
      const bl = len * (.18 + Math.random() * .32);
      buildBolt(p.x, p.y, p.x + Math.cos(ang) * bl, p.y + Math.sin(ang) * bl, width * .45, depth - 1, out);
    }
  }
  return out;
}

export function strike(x, y, o = {}) {
  const x1 = o.x1 ?? x + (Math.random() - .5) * W * .35;
  const segs = buildBolt(x1, o.y1 ?? -30, x, y, o.width ?? 3, o.branches ?? 2, []);
  bolts.push({ segs, born: performance.now(), dur: o.dur ?? 650, flicker: Array.from({ length: 6 }, () => Math.random() > .35) });
  api.burst(x, y, 26, { color: '190,235,255', speed: 7, blend: 'lighter' });
  const intensity = o.intensity ?? .7;
  if (o.flash !== false) flash(x, y, intensity);
  if (o.thunder !== false) thunder(intensity, o.delay ?? (intensity > .8 ? 40 : 250 + Math.random() * 600));
  if (o.shake) api.shake(o.shake);
}

function flash(x, y, intensity) {
  const el = document.getElementById('flash');
  if (!el) return;
  el.style.setProperty('--fx', (x / W) * 100 + '%');
  el.style.setProperty('--fy', (y / H) * 100 + '%');
  const pk = Math.min(1, .35 + intensity * .65);
  el.animate([{ opacity: 0 }, { opacity: pk, offset: .06 }, { opacity: .1, offset: .18 }, { opacity: pk * .75, offset: .28 }, { opacity: .05, offset: .5 }, { opacity: pk * .3, offset: .6 }, { opacity: 0 }],
    { duration: 700 + intensity * 400 });
}

function drawBolts(now) {
  const ctx = api.layer('front').ctx;
  for (let i = bolts.length - 1; i >= 0; i--) {
    const b = bolts[i];
    const t = (now - b.born) / b.dur;
    if (t >= 1) { bolts.splice(i, 1); continue; }
    const on = t < .12 || b.flicker[Math.floor(t * b.flicker.length)];
    const a = Math.pow(1 - t, 1.4) * (on ? 1 : .25);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const s of b.segs) {
      const path = new Path2D();
      path.moveTo(s.pts[0].x, s.pts[0].y);
      for (let k = 1; k < s.pts.length; k++) path.lineTo(s.pts[k].x, s.pts[k].y);
      ctx.shadowColor = `rgba(${boltRGB},${a})`; ctx.shadowBlur = 28;
      ctx.strokeStyle = `rgba(${boltRGB},${a * .45})`; ctx.lineWidth = s.width * 5; ctx.stroke(path);
      ctx.shadowBlur = 10; ctx.strokeStyle = `rgba(${midRGB},${a * .8})`; ctx.lineWidth = s.width * 2; ctx.stroke(path);
      ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = Math.max(.6, s.width * .7); ctx.stroke(path);
    }
    ctx.restore();
  }
}

/* ---------- chuva ---------- */
function makeDrop() {
  const z = Math.random();
  return { x: Math.random() * (W + 200) - 100, y: Math.random() * H, len: 10 + z * 22, speed: 9 + z * 16, alpha: .12 + z * .35, w: .6 + z * .9 };
}
function drawRain() {
  const ctx = api.layer('back').ctx;
  ctx.lineCap = 'round';
  for (const d of drops) {
    d.y += d.speed; d.x -= d.speed * .22;
    if (d.y > H + 20 || d.x < -40) { d.y = -20 - Math.random() * 80; d.x = Math.random() * (W + 200); }
    ctx.strokeStyle = `rgba(180,215,255,${d.alpha})`; ctx.lineWidth = d.w;
    ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.len * .22, d.y - d.len); ctx.stroke();
  }
}

/* ---------- som ---------- */
function thunder(intensity = .7, delayMs = 300) {
  const { audio } = api;
  if (!audio.on) return;
  const ac = audio.ctx, t0 = ac.currentTime + delayMs / 1000;
  const dur = 2.2 + intensity * 2.5 + Math.random();
  const src = ac.createBufferSource(); src.buffer = audio.noise(dur, 'brown');
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(380 + intensity * 500, t0); lp.frequency.exponentialRampToValueAtTime(70, t0 + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(.5 + intensity * .9, t0 + .06);
  for (let i = 1; i < 5; i++) g.gain.exponentialRampToValueAtTime((.25 + Math.random() * .5) * intensity + .05, t0 + (dur * i) / 6 + Math.random() * .2);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(lp).connect(g).connect(audio.out); src.start(t0); src.stop(t0 + dur + .1);
  if (intensity > .75) audio.hit({ buffer: audio.noise(.35), type: 'highpass', freq: 1500, gain: .7 * intensity, decay: .3, delay: Math.max(0, delayMs / 1000 - .03) });
}

/* ---------- efeitos por integrante ---------- */
function arcs(section) {
  const visual = section.querySelector('.member__visual');
  const c = document.createElement('canvas'); c.className = 'fx-local'; visual.appendChild(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0, last = 0, list = [];
  api.onResize(() => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); });
  api.ticker(now => {
    if (!section.classList.contains('is-live') || api.reduce) { if (list.length) { ctx.clearRect(0, 0, w, h); list = []; } return; }
    if (now - last > api.rand(90, 220)) {
      last = now;
      const a = { x: w / 2 + api.rand(-w * .22, w * .22), y: h / 2 + api.rand(-h * .42, h * .1) };
      const b = { x: w / 2 + api.rand(-w * .25, w * .25), y: h / 2 + api.rand(0, h * .42) };
      list.push({ pts: subdivide(a.x, a.y, b.x, b.y, 70, 6), life: 1 });
    }
    ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
    for (let i = list.length - 1; i >= 0; i--) {
      const arc = list[i]; arc.life -= .09;
      if (arc.life <= 0) { list.splice(i, 1); continue; }
      ctx.beginPath(); arc.pts.forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.shadowColor = 'rgba(143,220,255,1)'; ctx.shadowBlur = 14;
      ctx.strokeStyle = `rgba(160,220,255,${arc.life * .7})`; ctx.lineWidth = 3; ctx.stroke();
      ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(255,255,255,${arc.life})`; ctx.lineWidth = 1; ctx.stroke();
    }
  });
}

function scope(section) {
  const visual = section.querySelector('.member__visual');
  const c = document.createElement('canvas'); c.className = 'fx-local fx-local--under'; visual.prepend(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0;
  api.onResize(() => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); });
  api.ticker(now => {
    if (!section.classList.contains('is-live')) return;
    const t = now / 1000, wah = (Math.sin(t * 2.4) + 1) / 2;
    ctx.clearRect(0, 0, w, h);
    for (const L of [{ amp: h * .12, alpha: .9, width: 2 }, { amp: h * .07, alpha: .35, width: 6 }]) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const k = x / w, env = Math.sin(k * Math.PI);
        const y = h / 2 + Math.sin(k * (18 + wah * 30) + t * 9) * L.amp * env + Math.sin(k * 77 + t * 23) * L.amp * .35 * env * wah + (Math.random() - .5) * 6 * env * wah;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = `rgba(143,220,255,${L.alpha})`; ctx.lineWidth = L.width; ctx.shadowColor = 'rgba(143,220,255,.9)'; ctx.shadowBlur = 12; ctx.stroke();
    }
    ctx.shadowBlur = 0;
  });
}

function drumBeat(section) {
  const { gsap } = api;
  const svg = section.querySelector('.instrument--drums');
  const kick = svg.querySelector('.kick'), snare = svg.querySelector('.snare');
  const toms = svg.querySelectorAll('.tom, .floor'), cyms = svg.querySelectorAll('.cymbal, .hat');
  const beat = gsap.timeline({ paused: true, repeat: -1 });
  for (let i = 0; i < 16; i++) {
    const t = i * .11;
    beat.fromTo(kick, { scale: 1.06 }, { scale: 1, duration: .1, ease: 'power2.out' }, t);
    if (i % 8 === 4) beat.fromTo(snare, { scale: 1.12, y: 3 }, { scale: 1, y: 0, duration: .2, ease: 'power3.out' }, t);
    if (i === 0) beat.fromTo(cyms, { rotate: -8 }, { rotate: 0, duration: .5, ease: 'elastic.out(1, .3)' }, t);
    if (i >= 12) beat.fromTo(toms[i - 12] || toms[0], { scale: 1.12 }, { scale: 1, duration: .15 }, t);
  }
  return beat;
}

let beat;
const theme = {
  name: 'rtl',
  sparkColor: '143,220,255',
  progress: p => (Math.round(p * 2000) * 1000).toLocaleString('pt-BR'),

  init(a) {
    api = a;
    api.onResize((w, h) => { W = w; H = h; drops = Array.from({ length: Math.min(Math.round((w * h) / 6500), 360) }, makeDrop); });
    api.ticker(now => { drawBolts(now); if (!api.reduce) drawRain(); });
    const $ = api.$;
    arcs($('#james')); arcs($('#cliff')); scope($('#kirk'));
    beat = drumBeat($('#lars'));
    $('#cliff').insertAdjacentHTML('afterbegin', `<svg class="tentacles" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true">
      <path d="M80 420 C 40 320, 140 260, 90 160 S 130 40, 110 10"/><path d="M260 420 C 300 330, 200 270, 250 190 S 220 90, 260 60"/>
      <path d="M940 420 C 900 320, 1010 260, 960 170 S 1000 60, 980 30"/><path d="M1110 420 C 1150 330, 1060 260, 1120 180 S 1090 100, 1130 70"/>
      <path d="M600 420 C 560 360, 650 330, 610 270"/></svg>`);
    setupCharge();
    setupEggs({ words: ['dave', 'mustaine'], onTrigger: mustaineEgg });
  },

  loader(a, el) {
    const v = { n: 0 };
    return new Promise(resolve => {
      a.gsap.timeline({ onComplete: resolve })
        .to(v, { n: 10000, duration: a.reduce ? .2 : 2, ease: 'power2.in', onUpdate: () => { el.querySelector('#volts').textContent = Math.round(v.n).toLocaleString('pt-BR'); } })
        .to(el.querySelector('.loader__bar span'), { width: '100%', duration: a.reduce ? .2 : 2, ease: 'power2.in' }, 0);
    });
  },

  afterIntro() {
    strike(W / 2, H * .5, { x1: W / 2 + api.rand(-60, 60), y1: -40, width: 6, branches: 3, intensity: 1, dur: 900, shake: 1.6 });
    setTimeout(() => strike(W * .18, H * .7, { width: 3, intensity: .6, thunder: false }), 140);
    setTimeout(() => strike(W * .84, H * .62, { width: 3, intensity: .6, thunder: false }), 260);
    if (api.reduce) return;
    const next = () => setTimeout(() => {
      if (!document.hidden) {
        const far = Math.random() < .6;
        strike(api.rand(W * .05, W * .95), api.rand(H * .25, H * (far ? .55 : .9)), {
          width: far ? 1.6 : 3, branches: far ? 1 : 2, intensity: far ? .35 : .7, dur: far ? 450 : 650,
          delay: far ? api.rand(900, 1800) : api.rand(250, 700), shake: far ? 0 : .5,
        });
      }
      next();
    }, api.rand(2600, 7000));
    next();
    setInterval(() => {
      if (window.scrollY > H * .8 || Math.random() < .4) return;
      const chars = api.$$('.hero__line--big .ch');
      const c = chars[Math.floor(Math.random() * chars.length)];
      if (c) api.gsap.fromTo(c, { y: 0 }, { y: api.rand(-14, -4), duration: .06, repeat: 3, yoyo: true, ease: 'none' });
    }, 900);
  },

  onClick(x, y) { strike(x, y, { width: 3.4, branches: 2, intensity: .9, delay: 30, shake: .8 }); },

  onMemberEnter(section) {
    const r = section.querySelector('.member__name').getBoundingClientRect();
    strike(r.left + r.width * api.rand(.2, .6), r.top + r.height * .3, { width: 4, branches: 3, intensity: .95, shake: 1 });
  },
  onMemberLive(section, on) {
    if (section.id === 'lars') (on && !api.reduce ? beat.play() : beat.pause());
  },

  sound(a) {
    const r = document.querySelector('.sound').getBoundingClientRect();
    strike(r.left + r.width / 2, r.bottom + 4, { width: 2.4, branches: 1, intensity: .9, delay: 20, shake: .6 });
    return a.audio.loop({ type: 'white', filter: 'bandpass', freq: 2500, q: .4, gain: .05 });
  },
};

/* ---------- easter egg: Dave Mustaine ----------
   Por alguns segundos a tempestade fica vermelha — outra tempestade
   se formava em Los Angeles — e um cartão conta os créditos dele no disco. */
let redTimer = null;
function mustaineEgg() {
  document.body.classList.add('egg-red');
  boltRGB = '255,70,55'; midRGB = '255,170,150';
  for (let i = 0; i < 5; i++) setTimeout(() => strike(i ? api.rand(W * .1, W * .9) : W / 2, i ? api.rand(H * .3, H * .9) : H * .5, { width: i ? 3 : 6, branches: 3, intensity: i ? .7 : 1, delay: 30, thunder: i % 2 === 0, shake: i ? .4 : 1.4 }), i * 260);
  toast(albums['ride-the-lightning'].mustaine);
  api.$$('.tracks li.has-dm').forEach(li => { li.classList.remove('is-dm'); void li.offsetWidth; li.classList.add('is-dm'); });
  clearTimeout(redTimer);
  redTimer = setTimeout(() => { document.body.classList.remove('egg-red'); boltRGB = '120,190,255'; midRGB = '190,230,255'; }, 10000);
}

/* ---------- seção especial: medidor de carga ---------- */
function setupCharge() {
  const dial = document.querySelector('.charge');
  if (!dial) return;
  const fill = dial.querySelector('.charge__fill'), pct = dial.querySelector('.charge__pct');
  const circ = 2 * Math.PI * 120;
  fill.style.strokeDasharray = circ;
  const paint = () => { fill.style.strokeDashoffset = circ * (1 - charge); pct.textContent = Math.round(charge * 100) + '%'; };
  paint();
  const start = e => { e.preventDefault(); charging = true; dial.classList.add('is-charging'); };
  const stop = () => { charging = false; dial.classList.remove('is-charging'); };
  dial.addEventListener('pointerdown', start);
  addEventListener('pointerup', stop);
  dial.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); charging = true; } });
  dial.addEventListener('keyup', stop);
  api.ticker((now, dt) => {
    if (charging) charge = Math.min(1, charge + dt / 2200);
    else if (charge > 0 && charge < 1) charge = Math.max(0, charge - dt / 3000);
    if (charge >= 1) {
      charge = 0; charging = false; dial.classList.remove('is-charging');
      for (let i = 0; i < 9; i++) setTimeout(() => strike(api.rand(W * .05, W * .95), api.rand(H * .3, H * .95), { width: 4, branches: 3, intensity: 1, delay: 20, thunder: i % 3 === 0 }), i * 70);
      api.shake(2.2);
    }
    if (charging && Math.random() < .5) {
      const r = dial.getBoundingClientRect();
      const a = Math.random() * Math.PI * 2;
      api.spawn({ x: r.left + r.width / 2 + Math.cos(a) * 120, y: r.top + r.height / 2 + Math.sin(a) * 120, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, color: '190,235,255', blend: 'lighter', gravity: 0 });
    }
    paint();
  });
}

export default theme;
