/* =========================================================
   ...AND JUSTICE FOR ALL — tema "Fratura"
   Pedra, tribunal e rachaduras que se acumulam na tela.
   Animações secas e mecânicas: steps() e linear, nada elástico.
   ========================================================= */
let api, W = 0, H = 0;
const cracks = [], shards = [], bills = [];

/* ---------- notas de dinheiro caindo ----------
   Nota fictícia desenhada uma vez num canvas fora da tela (sprite) e
   reaproveitada: cada nota cai balançando e "vira" no ar (escala vertical
   pelo cosseno da fase), mostrando o verso mais escuro. */
let billSprite = null;
function makeBillSprite() {
  const w = 132, h = 60, d = 2;
  const c = document.createElement('canvas'); c.width = w * d; c.height = h * d;
  const x = c.getContext('2d'); x.scale(d, d);
  const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#d6dccb'); g.addColorStop(.5, '#c3cdb6'); g.addColorStop(1, '#b4c0a5');
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  x.strokeStyle = '#3f6e5c'; x.lineWidth = 2; x.strokeRect(3, 3, w - 6, h - 6);
  x.setLineDash([2, 2]); x.lineWidth = 1; x.strokeRect(7, 7, w - 14, h - 14); x.setLineDash([]);
  x.fillStyle = '#a9b79a'; x.beginPath(); x.ellipse(w / 2, h / 2, 17, 20, 0, 0, Math.PI * 2); x.fill(); x.stroke();
  // balancinha no medalhão
  x.strokeStyle = '#2f5546'; x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(w / 2, h / 2 - 11); x.lineTo(w / 2, h / 2 + 11); x.moveTo(w / 2 - 10, h / 2 - 7); x.lineTo(w / 2 + 10, h / 2 - 7);
  x.moveTo(w / 2 - 14, h / 2 + 2); x.quadraticCurveTo(w / 2 - 10, h / 2 + 6, w / 2 - 6, h / 2 + 2);
  x.moveTo(w / 2 + 6, h / 2 + 2); x.quadraticCurveTo(w / 2 + 10, h / 2 + 6, w / 2 + 14, h / 2 + 2); x.stroke();
  x.fillStyle = '#2f5546'; x.font = '700 12px Cinzel, Georgia, serif'; x.textBaseline = 'middle';
  x.fillText('88', 12, 17); x.fillText('88', w - 30, h - 16);
  x.font = '700 7px Cinzel, Georgia, serif'; x.textAlign = 'center'; x.fillText('JUSTIÇA À VENDA', w / 2 + 32, 17);
  // traços de guilhoché
  x.strokeStyle = 'rgba(63,110,92,.35)'; x.lineWidth = .6;
  for (let i = 0; i < 6; i++) { x.beginPath(); x.ellipse(24, h / 2 + 6, 8 + i * 2, 6 + i, 0, 0, Math.PI * 2); x.stroke(); }
  billSprite = c;
}
function spawnBill(x, y, o = {}) {
  if (bills.length > 46 || api.reduce) return;
  bills.push({
    x, y, vx: o.vx ?? api.rand(-.3, .3), vy: o.vy ?? api.rand(.5, 1.2),
    phase: Math.random() * Math.PI * 2, spin: api.rand(.02, .06), rot: api.rand(-.6, .6), vr: api.rand(-.012, .012),
    sway: api.rand(.4, 1.2), s: o.s ?? api.rand(.45, .85), a: o.a ?? api.rand(.55, .9),
  });
}
function drawBills(dt) {
  if (!billSprite) return;
  const ctx = api.layer('back').ctx, k = dt / 16;
  for (let i = bills.length - 1; i >= 0; i--) {
    const b = bills[i];
    b.phase += b.spin * k; b.rot += b.vr * k;
    b.x += (Math.sin(b.phase * .5) * b.sway + b.vx) * k;
    b.y += b.vy * k; b.vy = Math.min(b.vy + .004 * k, 1.6);
    if (b.y > H + 80) { bills.splice(i, 1); continue; }
    const flip = Math.cos(b.phase);
    ctx.save();
    ctx.globalAlpha = b.a;
    ctx.translate(b.x, b.y); ctx.rotate(b.rot);
    ctx.scale(b.s, b.s * Math.max(.12, Math.abs(flip)));
    ctx.drawImage(billSprite, -66, -30, 132, 60);
    if (flip < 0) { ctx.fillStyle = 'rgba(20,30,26,.35)'; ctx.fillRect(-66, -30, 132, 60); } // verso
    ctx.restore();
  }
}
function rustle() {
  const { audio } = api;
  if (audio.on) audio.hit({ buffer: audio.noise(.3, 'pink'), type: 'bandpass', freq: 4200, q: .8, gain: .12, decay: .22 });
}

/* ---------- rachaduras ramificadas ---------- */
function crack(x, y, o = {}) {
  const segs = [];
  const grow = (x0, y0, ang, len, depth, t0) => {
    const steps = 6 + Math.floor(Math.random() * 6);
    let cx = x0, cy = y0, a = ang, t = t0;
    for (let i = 0; i < steps; i++) {
      a += api.rand(-.45, .45);
      const l = len / steps * api.rand(.6, 1.4);
      const nx = cx + Math.cos(a) * l, ny = cy + Math.sin(a) * l;
      segs.push({ x1: cx, y1: cy, x2: nx, y2: ny, t, w: Math.max(.5, (o.width ?? 2) * (1 - depth * .3) * (1 - i / steps * .6)) });
      if (depth < 3 && Math.random() < .28) grow(nx, ny, a + api.rand(-1.1, 1.1), len * .5, depth + 1, t + 12);
      cx = nx; cy = ny; t += 12;
    }
  };
  const n = o.rays ?? 3 + Math.floor(Math.random() * 3);
  const base = o.angle ?? Math.random() * Math.PI * 2;
  for (let i = 0; i < n; i++) grow(x, y, base + (o.angle != null ? api.rand(-.5, .5) : (i / n) * Math.PI * 2 + api.rand(-.3, .3)), o.len ?? api.rand(120, 320), 0, 0);
  cracks.push({ segs, born: performance.now(), life: o.life ?? 26000, glow: o.glow });
  while (cracks.reduce((s, c) => s + c.segs.length, 0) > 3200) cracks.shift();
}
function drawCracks(now) {
  const ctx = api.layer('front').ctx;
  ctx.lineCap = 'round';
  for (let i = cracks.length - 1; i >= 0; i--) {
    const c = cracks[i], age = now - c.born;
    if (age > c.life) { cracks.splice(i, 1); continue; }
    const a = age > c.life - 3000 ? (c.life - age) / 3000 : 1;
    for (const s of c.segs) {
      if (age < s.t) continue;
      const k = Math.min(1, (age - s.t) / 40);
      const x2 = s.x1 + (s.x2 - s.x1) * k, y2 = s.y1 + (s.y2 - s.y1) * k;
      if (c.glow) {
        const g = Math.max(0, 1 - age / 1400);
        ctx.strokeStyle = `rgba(160,230,200,${g})`; ctx.lineWidth = s.w * 2.5; ctx.shadowColor = 'rgba(127,179,157,.9)'; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.shadowBlur = 0;
        continue;
      }
      ctx.strokeStyle = `rgba(230,226,215,${.28 * a})`; ctx.lineWidth = s.w * .6;
      ctx.beginPath(); ctx.moveTo(s.x1 + 1, s.y1 + 1); ctx.lineTo(x2 + 1, y2 + 1); ctx.stroke();
      ctx.strokeStyle = `rgba(0,0,0,${.8 * a})`; ctx.lineWidth = s.w;
      ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(x2, y2); ctx.stroke();
    }
  }
}

/* ---------- estilhaços ---------- */
function shatter(x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const s = api.rand(6, 16);
    shards.push({ x: x + api.rand(-20, 20), y: y + api.rand(-20, 20), vx: api.rand(-2, 2), vy: api.rand(-3, 0), r: api.rand(0, 6), vr: api.rand(-.2, .2), pts: [[0, -s], [s * .8, s * .6], [-s * .7, s * .4]], life: 1 });
  }
}
function drawShards() {
  const ctx = api.layer('front').ctx;
  for (let i = shards.length - 1; i >= 0; i--) {
    const s = shards[i];
    s.x += s.vx; s.y += s.vy; s.vy += .25; s.r += s.vr; s.life -= .012;
    if (s.life <= 0 || s.y > H + 40) { shards.splice(i, 1); continue; }
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.r);
    ctx.fillStyle = `rgba(150,156,150,${s.life})`; ctx.strokeStyle = `rgba(0,0,0,${s.life})`;
    ctx.beginPath(); s.pts.forEach(([px, py], k) => (k ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
}

/* ---------- som ---------- */
function gavel(gain = .8) {
  const { audio } = api;
  if (!audio.on) return;
  audio.thump({ from: 170, to: 60, gain, decay: .18, type: 'triangle' });
  audio.hit({ buffer: audio.noise(.1), type: 'bandpass', freq: 1400, q: 2, gain: gain * .7, decay: .06 });
}
function crackSound() {
  const { audio } = api;
  if (audio.on) audio.hit({ buffer: audio.noise(.2), type: 'highpass', freq: 2600, gain: .35, decay: .12 });
}

/* ---------- balança acompanha o cursor ---------- */
function setupScale() {
  const svg = api.$('.hero-scale');
  if (!svg) return;
  const beam = svg.querySelector('.beam'), panL = svg.querySelector('.pan--l'), panR = svg.querySelector('.pan--r');
  const R = 150, px = 200, py = 92;
  let target = 0, ang = 0;
  addEventListener('pointermove', e => { target = (e.clientX / W - .5) * 22; });
  api.ticker(() => {
    ang += (target - ang) * .08;
    const rad = ang * Math.PI / 180;
    beam.setAttribute('transform', `rotate(${ang.toFixed(2)} ${px} ${py})`);
    panL.setAttribute('transform', `translate(${(-Math.cos(rad) * R + R).toFixed(1)} ${(-Math.sin(rad) * R).toFixed(1)})`);
    panR.setAttribute('transform', `translate(${(Math.cos(rad) * R - R).toFixed(1)} ${(Math.sin(rad) * R).toFixed(1)})`);
    // balança pendida: as notas escorrem do prato mais baixo
    if (Math.abs(ang) > 6 && window.scrollY < H && Math.random() < .07 * (Math.abs(ang) / 11)) {
      const r = (ang > 0 ? panR : panL).getBoundingClientRect();
      spawnBill(r.left + r.width / 2 + api.rand(-12, 12), r.bottom - 6, { vx: (ang > 0 ? 1 : -1) * api.rand(.3, 1.1), vy: api.rand(.4, .9), a: .9 });
      if (Math.random() < .2) rustle();
    }
  });
}

/* ---------- Lars: metrônomo que troca de compasso ---------- */
function meterChanger(section) {
  const visual = section.querySelector('.member__visual');
  visual.insertAdjacentHTML('beforeend', `<div class="meterbox" aria-hidden="true"><span class="meterbox__sig">4/4</span><span class="meterbox__beats"></span></div>`);
  const sig = visual.querySelector('.meterbox__sig'), beatsEl = visual.querySelector('.meterbox__beats');
  const kick = section.querySelector('.kick'), snare = section.querySelector('.snare'), cym = section.querySelector('.cymbal--r');
  const meters = [[4, 4, .42], [7, 8, .24], [5, 4, .4]];
  let m = 0, beat = 0, bars = 0, call = null;
  const tick = () => {
    if (!section.classList.contains('is-live') || api.reduce) { call = null; return; }
    const [n, d, dur] = meters[m];
    if (beat === 0) { sig.textContent = `${n}/${d}`; beatsEl.innerHTML = '<i></i>'.repeat(n); }
    beatsEl.querySelectorAll('i').forEach((el, k) => el.classList.toggle('on', k === beat));
    const g = api.gsap;
    if (beat === 0) { g.fromTo(kick, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'steps(3)' }); g.fromTo(cym, { rotate: -6 }, { rotate: 0, duration: dur, ease: 'steps(3)' }); }
    else g.fromTo(beat % 2 ? snare : kick, { scale: 1.08 }, { scale: 1, duration: dur, ease: 'steps(3)' });
    beat++;
    if (beat >= n) { beat = 0; bars++; if (bars % 2 === 0) m = (m + 1) % meters.length; }
    call = g.delayedCall(dur, tick);
  };
  return on => { if (on && !call) tick(); };
}

/* ---------- Jason: easter egg do baixo ---------- */
function bassEgg(section) {
  const content = section.querySelector('.member__content');
  content.insertAdjacentHTML('beforeend', `<div class="bass-egg"><canvas aria-hidden="true"></canvas><button type="button" class="tool-btn" aria-pressed="false">Aumentar o baixo</button><p>Uma piscadela, com carinho, para a mixagem mais discutida do metal.</p></div>`);
  const c = content.querySelector('.bass-egg canvas'), btn = content.querySelector('.bass-egg button'), ctx = c.getContext('2d');
  const amp = { v: .05 };
  let w = 0, h = 0;
  api.onResize(() => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); });
  btn.addEventListener('click', () => {
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', on); btn.textContent = on ? 'Baixo no volume certo' : 'Aumentar o baixo';
    api.gsap.to(amp, { v: on ? 1 : .05, duration: 1.2, ease: 'steps(10)' });
    section.classList.toggle('bass-up', on);
    if (on && api.audio.on) api.audio.thump({ from: 70, to: 41, gain: .9, decay: 1.2 });
  });
  api.ticker(now => {
    if (!section.classList.contains('is-live')) return;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#3f6e5c'; ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = h / 2 + Math.sin(x / 18 + now / 160) * (h * .42) * amp.v * (.6 + .4 * Math.sin(x / 70 + now / 900));
      x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  });
}

/* ---------- One: luz em código Morse ---------- */
function setupMorse() {
  const sec = api.$('.morse');
  if (!sec) return;
  const light = sec.querySelector('.morse__light'), letters = sec.querySelectorAll('.morse__word span');
  const code = { O: '---', N: '-.', E: '.' }, U = 170;
  const seq = [];
  ['O', 'N', 'E'].forEach((L, li) => {
    [...code[L]].forEach((s, si) => { seq.push({ on: true, d: s === '-' ? 3 : 1 }); seq.push({ on: false, d: si === code[L].length - 1 ? 3 : 1, reveal: si === code[L].length - 1 ? li : null }); });
  });
  seq[seq.length - 1].d = 9;
  let i = 0, timer = null;
  const beep = d => { const { audio } = api; if (!audio.on) return; const ac = audio.ctx, o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 620; g.gain.value = .07; o.connect(g).connect(audio.out); o.start(); o.stop(ac.currentTime + d * U / 1000); };
  const run = () => {
    const s = seq[i];
    light.classList.toggle('is-on', s.on);
    if (s.on) beep(s.d);
    if (s.reveal != null) letters[s.reveal].classList.add('is-shown');
    i = (i + 1) % seq.length;
    if (i === 0) setTimeout(() => letters.forEach(l => l.classList.remove('is-shown')), s.d * U - 50);
    timer = setTimeout(run, s.d * U);
  };
  api.ScrollTrigger.create({
    trigger: sec, start: 'top 70%', end: 'bottom 30%',
    onToggle: self => { if (self.isActive && !timer && !api.reduce) run(); if (!self.isActive && timer) { clearTimeout(timer); timer = null; } },
  });
  if (api.reduce) letters.forEach(l => l.classList.add('is-shown'));
}

let meterLive;
const theme = {
  name: 'justice',
  ease: 'steps(8)',
  nameEase: 'steps(6)',
  drawEase: 'steps(14)',
  flicker: false,
  sparkColor: '127,179,157',
  progress: p => `1988/${String(Math.round(p * 9999)).padStart(4, '0')}`,

  init(a) {
    api = a;
    api.onResize((w, h) => { W = w; H = h; });
    api.ticker((now, dt) => { drawBills(dt); drawCracks(now); drawShards(); });
    document.fonts.ready.then(makeBillSprite);
    // chuva de dinheiro ambiente, lenta, atrás do conteúdo
    setInterval(() => { if (!document.hidden && bills.length < 12) spawnBill(api.rand(0, W), -40); }, 900);
    setupScale();
    meterLive = meterChanger(api.$('#lars'));
    bassEgg(api.$('#jason'));
    setupMorse();
    // Kirk: o solo desenha rachaduras brilhantes
    const kirk = api.$('#kirk');
    setInterval(() => {
      if (!kirk.classList.contains('is-live') || api.reduce || document.hidden) return;
      const r = kirk.querySelector('.member__visual').getBoundingClientRect();
      crack(r.left + r.width * api.rand(.2, .8), r.top + r.height * api.rand(.2, .8), { glow: true, rays: 2, len: 160, life: 1500, width: 1.4 });
    }, 900);
  },

  loader(a, el) {
    const g = a.gsap, hits = 3;
    const tl = g.timeline();
    const head = el.querySelector('.ld-gavel'), beam = el.querySelector('.ld-beam');
    for (let i = 0; i < hits; i++) {
      tl.to(head, { rotate: -38, duration: a.reduce ? .01 : .22, ease: 'steps(3)', svgOrigin: '250 150' })
        .to(head, { rotate: 0, duration: a.reduce ? .01 : .06, ease: 'none', svgOrigin: '250 150' })
        .add(() => { gavel(.6); }, '>')
        .to(beam, { rotate: (i + 1) * 4 * (i % 2 ? -1 : 1), duration: .1, ease: 'steps(2)', svgOrigin: '90 70' }, '<');
    }
    const crackPath = el.querySelector('.ld-crack path');
    const L = crackPath.getTotalLength();
    crackPath.style.strokeDasharray = L; crackPath.style.strokeDashoffset = L;
    tl.to(crackPath, { strokeDashoffset: 0, duration: a.reduce ? .05 : .35, ease: 'steps(9)' })
      .to(el.querySelector('.ld-center'), { autoAlpha: 0, duration: .05 })
      .to(el.querySelector('.ld-half--l'), { xPercent: -110, rotate: -3, duration: a.reduce ? .05 : .7, ease: 'power3.in' })
      .to(el.querySelector('.ld-half--r'), { xPercent: 110, rotate: 3, duration: a.reduce ? .05 : .7, ease: 'power3.in' }, '<');
    return new Promise(r => tl.eventCallback('onComplete', r));
  },

  heroTitle(tl, a) {
    a.$$('.hero__line .ch').forEach((ch, i) => {
      tl.from(ch, { autoAlpha: 0, duration: .01 }, .25 + i * .07)
        .add(() => {
          const r = ch.getBoundingClientRect();
          a.burst(r.left + r.width / 2, r.top + r.height * .7, 5, { color: '190,190,180', kind: 'dot', size: 1.6, speed: 2.4, gravity: .2 });
          if (a.audio.on && i % 2 === 0) a.audio.hit({ buffer: a.audio.noise(.05), type: 'highpass', freq: 3200, gain: .12, decay: .03 });
        }, '<');
    });
    tl.from('.hero-scale', { autoAlpha: 0, duration: .6, ease: 'steps(6)' }, .2);
  },

  afterIntro() {
    const r = api.$('.hero__title').getBoundingClientRect();
    crack(r.left + r.width * .5, r.bottom - 10, { rays: 4, len: 260, width: 2.2 });
    crackSound();
  },

  storyCut(scene) {
    const side = Math.random() < .5 ? 0 : W;
    crack(side, api.rand(H * .2, H * .8), { angle: side ? Math.PI : 0, rays: 2, len: api.rand(160, 300), width: 2, life: 9000 });
    gavel(.35);
  },

  onClick(x, y) {
    crack(x, y, { width: 2.2 });
    shatter(x, y);
    for (let i = 0; i < 7; i++) spawnBill(x + api.rand(-140, 140), api.rand(-120, -30), { vy: api.rand(.8, 1.6), a: .9 });
    rustle();
    crackSound(); gavel(.4);
    api.shake(.4);
  },

  onMemberEnter(section) {
    const r = section.querySelector('.member__name').getBoundingClientRect();
    crack(r.left + r.width * .6, r.top + r.height * .5, { rays: 3, len: 200 });
    // e uma rachadura nova entrando pela borda da tela
    const side = Math.random() < .5 ? 0 : W;
    crack(side, api.rand(H * .2, H * .8), { angle: side ? Math.PI : 0, rays: 2, len: api.rand(220, 420), width: 2.6 });
    gavel(.5); crackSound();
  },
  onMemberLive(section, on) {
    if (section.id === 'lars') meterLive(on);
  },

  sound(a) {
    const stopRoom = a.audio.loop({ type: 'brown', filter: 'lowpass', freq: 220, gain: .035 });
    let alive = true;
    const type = () => { if (!alive) return; a.audio.hit({ buffer: a.audio.noise(.04), type: 'highpass', freq: 3000, gain: .07, decay: .025 }); setTimeout(type, a.rand(250, 1400)); };
    type();
    return () => { alive = false; stopRoom(); };
  },

  tracklistIn(a) {
    a.$$('.tracks li').forEach((li, i) => {
      a.gsap.from(li, { autoAlpha: 0, duration: .01, delay: i * .12, scrollTrigger: { trigger: '.tracklist', start: 'top 70%' }, onComplete: () => { li.classList.add('is-filed'); if (i % 3 === 0) gavel(.3); } });
    });
  },
};

export default theme;
