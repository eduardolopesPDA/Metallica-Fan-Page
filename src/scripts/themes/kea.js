/* =========================================================
   KILL 'EM ALL — tema "Impacto"
   Fanzine xerocado: cada clique é uma martelada na tela
   (rachadura de vidro + onda de choque + respingo de tinta).
   Segurar o clique carrega o golpe.
   ========================================================= */
import { setupEggs, toast } from '../core/eggs.js';
import { albums } from '../../data/albums.js';

let api, W = 0, H = 0;
const cracks = [], rings = [], splats = [];
let holding = null;

const INK = '22,18,15', RED = '179,18,27';

/* ---------- rachadura de vidro ---------- */
function jagged(x, y, ang, len, steps) {
  const pts = [{ x, y }];
  let cx = x, cy = y, a = ang;
  for (let i = 0; i < steps; i++) {
    a += api.rand(-.35, .35);
    const l = len / steps * api.rand(.6, 1.4);
    cx += Math.cos(a) * l; cy += Math.sin(a) * l;
    pts.push({ x: cx, y: cy });
  }
  return pts;
}
function crack(x, y, power = .6) {
  const n = Math.round(8 + power * 8), R = (70 + power * 230) * Math.max(.55, Math.min(1, W / 900));
  const rays = [];
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + api.rand(-.2, .2);
    const ray = jagged(x, y, ang, R * api.rand(.55, 1.1), 8);
    rays.push(ray);
    if (Math.random() < .6) { const p = ray[Math.floor(api.rand(2, 6))]; rays.push(jagged(p.x, p.y, ang + api.rand(-.9, .9), R * .35, 4)); }
  }
  // anéis de teia ligando os raios
  const webs = [.25, .5].map(k => rays.slice(0, n).map(r => r[Math.min(r.length - 1, Math.round(k * 8))]));
  cracks.push({ rays, webs, born: performance.now(), life: 2600 + power * 1600 });
  if (cracks.length > 14) cracks.shift();
}
function drawCracks(now) {
  const ctx = api.layer('front').ctx;
  for (let i = cracks.length - 1; i >= 0; i--) {
    const c = cracks[i];
    const t = (now - c.born) / c.life;
    if (t >= 1) { cracks.splice(i, 1); continue; }
    const grow = Math.min(1, (now - c.born) / 140);
    const a = 1 - Math.pow(t, 3);
    ctx.save(); ctx.lineJoin = 'round';
    const path = new Path2D();
    for (const r of c.rays) {
      const m = Math.max(2, Math.round(r.length * grow));
      path.moveTo(r[0].x, r[0].y);
      for (let k = 1; k < m; k++) path.lineTo(r[k].x, r[k].y);
    }
    if (grow >= 1) for (const w of c.webs) { w.forEach((p, k) => (k ? path.lineTo(p.x, p.y) : path.moveTo(p.x, p.y))); path.closePath(); }
    ctx.strokeStyle = `rgba(255,255,255,${a * .8})`; ctx.lineWidth = 2.2; ctx.translate(1, 1); ctx.stroke(path);
    ctx.strokeStyle = `rgba(${INK},${a})`; ctx.lineWidth = 1.1; ctx.translate(-1, -1); ctx.stroke(path);
    ctx.restore();
  }
}

/* ---------- onda de choque ---------- */
function drawRings(dt) {
  const ctx = api.layer('front').ctx;
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.r += dt * r.speed; r.a -= dt / 520;
    if (r.a <= 0) { rings.splice(i, 1); continue; }
    ctx.strokeStyle = `rgba(${INK},${r.a})`; ctx.lineWidth = 3 * r.a + .5;
    ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx.stroke();
  }
}

/* ---------- respingo de tinta que escorre ---------- */
function splat(x, y, power) {
  const blobs = Array.from({ length: Math.round(6 + power * 10) }, () => {
    const a = Math.random() * Math.PI * 2, d = Math.pow(Math.random(), 2) * (40 + power * 120);
    return { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: api.rand(2, 6 + power * 10) * (1 - d / 260) + 1 };
  });
  const drips = blobs.filter(b => b.r > 6).map(b => ({ x: b.x, y: b.y, w: b.r * .45, len: 0, max: api.rand(20, 90 + power * 80) }));
  splats.push({ blobs, drips, born: performance.now(), life: 7000 });
  if (splats.length > 10) splats.shift();
  api.burst(x, y, 18, { color: RED, kind: 'dot', size: 3, speed: 9, gravity: .35, decay: .025 });
}
function drawSplats(now, dt) {
  const storyOn = document.body.classList.contains('story-on');
  const ctx = api.layer('back').ctx;
  for (let i = splats.length - 1; i >= 0; i--) {
    const s = splats[i];
    const t = (now - s.born) / s.life;
    if (t >= 1) { splats.splice(i, 1); continue; }
    // dentro do filme o sangue da abertura desbota rápido (pula para os últimos 0,9 s)
    if (storyOn && s.born + s.life - now > 900) { s.life = 3000; s.born = now - 2100; continue; }
    const a = t < .7 ? .92 : .92 * (1 - (t - .7) / .3);
    ctx.fillStyle = `rgba(${RED},${a})`;
    for (const b of s.blobs) { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); }
    for (const d of s.drips) {
      if (d.len < d.max) d.len += dt * .03 * (1 - d.len / d.max) + .02;
      ctx.fillRect(d.x - d.w / 2, d.y, d.w, d.len);
      ctx.beginPath(); ctx.arc(d.x, d.y + d.len, d.w * .7, 0, Math.PI * 2); ctx.fill();
    }
  }
}

/* ---------- martelada ---------- */
function hammer(x, y, power = .6) {
  crack(x, y, power);
  rings.push({ x, y, r: 6, a: 1, speed: .9 + power }, { x, y, r: 2, a: .7, speed: .5 + power * .6 });
  splat(x, y, power);
  api.shake(.5 + power * 1.8);
  const { audio } = api;
  if (audio.on) {
    audio.thump({ from: 180, to: 38, gain: .6 + power * .5, decay: .35 + power * .2, type: 'triangle' });
    audio.hit({ buffer: audio.noise(.3), type: 'lowpass', freq: 1800, gain: .5 + power * .3, decay: .18 });
  }
}

/* ---------- efeitos por integrante ---------- */
function metronome(section) {
  const visual = section.querySelector('.member__visual');
  visual.insertAdjacentHTML('beforeend', `<div class="metro" aria-hidden="true"><div class="metro__arm"></div><span class="metro__bpm">120</span><small>BPM</small></div>`);
  const arm = visual.querySelector('.metro__arm'), bpm = visual.querySelector('.metro__bpm');
  const kick = section.querySelector('.kick'), snare = section.querySelector('.snare');
  let tempo = 120, side = 1, tween;
  const tick = () => {
    if (!section.classList.contains('is-live') || api.reduce) { tween = null; return; }
    const beat = 60 / tempo;
    side *= -1;
    api.gsap.to(arm, { rotate: 26 * side, duration: beat, ease: 'sine.inOut' });
    api.gsap.fromTo(side > 0 ? kick : snare, { scale: 1.08 }, { scale: 1, duration: beat * .8, ease: 'power2.out' });
    tempo = tempo >= 220 ? 120 : tempo + 4;
    bpm.textContent = tempo;
    tween = api.gsap.delayedCall(beat, tick);
  };
  return on => { if (on && !tween) tick(); };
}

function scribble(section) {
  const visual = section.querySelector('.member__visual');
  const c = document.createElement('canvas'); c.className = 'fx-local fx-local--under'; visual.prepend(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0, last = 0;
  api.onResize(() => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); });
  api.ticker(now => {
    if (!section.classList.contains('is-live') || now - last < 90) return; // traço "de caneta", 11 quadros/s
    last = now;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = `rgba(${RED},.85)`; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const k = x / w, env = Math.sin(k * Math.PI);
        const y = h * .5 + Math.sin(k * 26 + now / 120) * h * .14 * env + api.rand(-7, 7) * env;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  });
}

function warp(section) {
  // filtro de distorção aplicado ao baixo durante o solo
  document.body.insertAdjacentHTML('beforeend', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="kea-warp"><feTurbulence type="turbulence" baseFrequency="0.012 0.04" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="0" xChannelSelector="R" yChannelSelector="G"/></filter></svg>`);
  const disp = document.querySelector('#kea-warp feDisplacementMap'), turb = document.querySelector('#kea-warp feTurbulence');
  api.ticker(now => {
    if (!section.classList.contains('is-solo') || api.reduce) return;
    const k = (Math.sin(now / 380) + 1) / 2;
    disp.setAttribute('scale', (6 + k * 22).toFixed(1));
    turb.setAttribute('baseFrequency', `${(0.008 + k * 0.01).toFixed(4)} ${(0.03 + k * 0.03).toFixed(4)}`);
  });
}

let metroLive;
const theme = {
  name: 'kea',
  sparkColor: RED,
  progress: p => Math.round(60 + p * 160),

  init(a) {
    api = a;
    api.onResize((w, h) => { W = w; H = h; });
    api.ticker((now, dt) => { drawSplats(now, dt); drawCracks(now); drawRings(dt); if (holding) chargeFx(); });
    metroLive = metronome(api.$('#lars'));
    scribble(api.$('#kirk'));
    warp(api.$('#cliff'));
    setupSpecial();
    setupJcard();
    setupEggs({ words: ['dave', 'mustaine'], onTrigger: mustaineEgg });
  },

  loader(a, el) {
    const reels = el.querySelectorAll('.reel'), counter = el.querySelector('#tape');
    const v = { n: 0 };
    return new Promise(resolve => {
      a.gsap.timeline({ onComplete: resolve })
        .to(reels, { rotate: -1440, duration: a.reduce ? .2 : 1.8, ease: 'power1.inOut', transformOrigin: '50% 50%' }, 0)
        .to(v, { n: 99, duration: a.reduce ? .2 : 1.8, ease: 'power1.inOut', onUpdate: () => { counter.textContent = String(Math.round(v.n)).padStart(3, '0'); } }, 0)
        .to(el.querySelector('.play'), { y: 4, duration: .08, yoyo: true, repeat: 1 })
        .add(() => a.audio.on && a.audio.hit({ buffer: a.audio.noise(.08), type: 'highpass', freq: 2000, gain: .4, decay: .06 }));
    });
  },

  heroTitle(tl, a) {
    tl.from('.hero__line .ch', {
      scale: 2.6, autoAlpha: 0, rotate: () => a.rand(-18, 18), duration: .22, ease: 'power4.in',
      stagger: { each: .045, from: 'random' },
    }, .25)
      .from('.scrap', { scale: 1.6, autoAlpha: 0, rotate: () => a.rand(-30, 30), duration: .25, ease: 'power4.in', stagger: .08 }, .6);
  },

  afterIntro() {
    hammer(W / 2, H * .44, 1);
    if (api.reduce) return;
    // desalinhamento da serigrafia tremendo no hero
    const title = api.$('.hero__title');
    setInterval(() => {
      if (window.scrollY > H) return;
      title.style.setProperty('--mx', api.rand(-6, 9).toFixed(1) + 'px');
      title.style.setProperty('--my', api.rand(-3, 6).toFixed(1) + 'px');
    }, 140);
    // pancada de bumbo ambiente
    const kick = () => setTimeout(() => {
      if (!document.hidden) { api.shake(.25); api.audio.on && api.audio.thump({ from: 120, to: 45, gain: .5, decay: .25 }); }
      kick();
    }, api.rand(2200, 3600));
    kick();
  },

  storyCut(scene) {
    if (scene.classList.contains('scene--hook')) return;
    crack(api.rand(W * .15, W * .85), api.rand(H * .2, H * .7), .3);
  },

  onHoldStart(x, y) { holding = { x, y, t: performance.now() }; },
  onHoldEnd() { holding = null; },
  onPointerMove(e) { if (holding) { holding.x = e.clientX; holding.y = e.clientY; } },
  onClick(x, y, hold) { hammer(x, y, Math.min(1, .35 + hold / 1100)); },

  onMemberEnter(section) {
    const r = section.querySelector('.member__name').getBoundingClientRect();
    hammer(r.left + r.width * api.rand(.3, .7), r.top + r.height * .5, .7);
  },
  onMemberLive(section, on) {
    if (section.id === 'lars') metroLive(on);
    if (section.id === 'cliff') section.classList.toggle('is-solo', on);
  },

  sound(a) { return a.audio.loop({ type: 'white', filter: 'highpass', freq: 4200, gain: .03 }); },

  tracklistIn(a) {
    a.gsap.from('.tracks li', { x: -30, rotate: () => a.rand(-2, 2), autoAlpha: 0, stagger: .05, duration: .3, ease: 'power4.in', scrollTrigger: { trigger: '.tracklist', start: 'top 75%' } });
  },
};

function chargeFx() {
  const k = Math.min(1, (performance.now() - holding.t) / 1100);
  if (Math.random() < k) {
    const a = Math.random() * Math.PI * 2, d = 30 + (1 - k) * 30;
    api.spawn({ x: holding.x + Math.cos(a) * d, y: holding.y + Math.sin(a) * d, vx: -Math.cos(a) * 2, vy: -Math.sin(a) * 2, color: RED, kind: 'dot', size: 2, gravity: 0, decay: .06 });
  }
}

/* ---------- seção especial: fita "da garagem ao estúdio" ---------- */
function setupSpecial() {
  const sec = api.$('.tape-story');
  if (!sec) return;
  api.gsap.to(sec.querySelectorAll('.big-reel'), {
    rotate: 720, ease: 'none', transformOrigin: '50% 50%',
    scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
  });
  api.gsap.from(sec.querySelector('.tape-ribbon'), { scaleY: 0, transformOrigin: 'top', ease: 'none', scrollTrigger: { trigger: sec, start: 'top 60%', end: 'bottom 70%', scrub: true } });
  sec.querySelectorAll('.milestone').forEach((m, i) => {
    api.gsap.from(m, { x: i % 2 ? 60 : -60, rotate: i % 2 ? 6 : -6, autoAlpha: 0, duration: .35, ease: 'power4.in', scrollTrigger: { trigger: m, start: 'top 82%' } });
  });
}

/* ---------- easter egg: Dave Mustaine ----------
   Um ônibus atravessa a tela de Nova York para a Califórnia (da direita para a esquerda,
   como num mapa), as faixas com crédito dele acendem e um flyer conta a história. */
function mustaineEgg() {
  const data = albums['kill-em-all'].mustaine;
  hammer(W / 2, H * .45, .8);
  toast(data);
  api.$$('.tracks li.has-dm').forEach(li => { li.classList.remove('is-dm'); void li.offsetWidth; li.classList.add('is-dm'); });
  api.$('.bus')?.remove();
  document.body.insertAdjacentHTML('beforeend', `
    <div class="bus" aria-hidden="true">
      <svg viewBox="0 0 260 110">
        <rect x="10" y="14" width="236" height="70" rx="12" fill="#f3ecdb" stroke="#0f0d0b" stroke-width="4"/>
        <rect x="10" y="62" width="236" height="10" fill="#b3121b"/>
        ${[30, 70, 110, 150].map(x => `<rect x="${x}" y="26" width="30" height="24" rx="3" fill="#0f0d0b"/>`).join('')}
        <rect x="200" y="26" width="34" height="46" rx="4" fill="none" stroke="#0f0d0b" stroke-width="3"/>
        <rect x="16" y="22" width="12" height="40" rx="4" fill="#0f0d0b"/>
        <circle cx="62" cy="88" r="15" fill="#0f0d0b"/><circle cx="62" cy="88" r="6" fill="#f3ecdb"/>
        <circle cx="198" cy="88" r="15" fill="#0f0d0b"/><circle cx="198" cy="88" r="6" fill="#f3ecdb"/>
      </svg>
      <span class="bus__sign">Nova York → Califórnia</span>
    </div>`);
  const bus = api.$('.bus');
  if (api.reduce) { setTimeout(() => bus.remove(), 4000); return; }
  api.gsap.timeline({ onComplete: () => bus.remove() })
    .fromTo(bus, { x: W + 40 }, { x: -340, duration: 7, ease: 'none' })
    .to(bus.querySelector('svg'), { y: -2, duration: .12, repeat: 56, yoyo: true, ease: 'none' }, 0);
  const dust = api.ticker(() => {
    if (!bus.isConnected) return dust();
    const r = bus.getBoundingClientRect();
    if (Math.random() < .5) api.spawn({ x: r.right - 10, y: r.bottom - 8, vx: api.rand(.5, 2), vy: api.rand(-1, 0), color: '93,85,74', kind: 'dot', size: api.rand(2, 5), gravity: -.01, decay: .02 });
  });
  if (api.audio.on) api.audio.thump({ from: 60, to: 50, gain: .25, decay: 2.5, type: 'sawtooth' });
}

/* ---------- encarte J-card: cabeça de leitura segue a faixa ---------- */
function setupJcard() {
  const card = api.$('.tracklist__groups');
  if (!card) return;
  const head = document.createElement('span');
  head.className = 'playhead'; head.setAttribute('aria-hidden', 'true');
  card.appendChild(head);
  card.querySelectorAll('.tracks li').forEach(li => li.addEventListener('mouseenter', () => {
    const r = li.getBoundingClientRect(), c = card.getBoundingClientRect();
    api.gsap.to(head, { x: r.left - c.left - 18, y: r.top - c.top + r.height / 2 - 8, duration: .35, ease: 'power3.out', autoAlpha: 1 });
  }));
}

export default theme;
