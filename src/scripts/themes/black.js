/* =========================================================
   BLACK ALBUM — tema "Lanterna"
   A página fica no escuro e o visitante a descobre com uma
   lanterna que segue o cursor. Relevo preto no preto, poeira
   na luz e uma serpente original que guia a leitura.
   ========================================================= */
let api, W = 0, H = 0;
const light = { x: 0, y: 0, tx: 0, ty: 0, r: 0, base: 340, boost: 0 };
let lastMove = 0, darkness, lightsOn = false;
const dust = [];

/* ---------- lanterna ---------- */
function paintLight() {
  darkness.style.setProperty('--lx', light.x.toFixed(1) + 'px');
  darkness.style.setProperty('--ly', light.y.toFixed(1) + 'px');
  darkness.style.setProperty('--lr', (light.r + light.boost + (light.sb || 0)).toFixed(1) + 'px');
}
function stepLight(now) {
  const storyOn = document.body.classList.contains('story-on');
  light.sb = (light.sb || 0) + ((storyOn ? Math.max(W, H) * .7 : 0) - (light.sb || 0)) * .05;
  if (storyOn) { light.tx = W / 2; light.ty = H * .45; lastMove = now; }
  const idle = now - lastMove > (api.fine ? 3200 : 2600); // no toque, a luz fica onde você tocou por um tempo
  if (idle && !api.reduce) { // varre a tela sozinha
    light.tx = W / 2 + Math.sin(now / 2600) * W * .32;
    light.ty = H / 2 + Math.sin(now / 1900) * H * .25;
  }
  const k = idle ? .03 : .14;
  light.x += (light.tx - light.x) * k; light.y += (light.ty - light.y) * k;
  paintLight();
  // relevo do título reage à posição da luz
  api.$$('.hero__line').forEach(el => {
    const r = el.getBoundingClientRect();
    const sx = Math.max(-1, Math.min(1, (r.left + r.width / 2 - light.x) / (W * .5)));
    const sy = Math.max(-1, Math.min(1, (r.top + r.height / 2 - light.y) / (H * .5)));
    el.style.setProperty('--sx', sx.toFixed(3)); el.style.setProperty('--sy', sy.toFixed(3));
  });
}
function pulse(amount = 700, dur = 1.3) {
  api.gsap.fromTo(light, { boost: amount }, { boost: 0, duration: dur, ease: 'power3.out' });
}
function drawDust() {
  const ctx = api.layer('front').ctx;
  if (dust.length < 90 && Math.random() < .6) dust.push({ x: light.x + api.rand(-light.r, light.r) * .7, y: light.y + api.rand(-light.r, light.r) * .7, vx: api.rand(-.15, .15), vy: api.rand(-.25, .05), r: api.rand(.5, 1.8), life: 1 });
  for (let i = dust.length - 1; i >= 0; i--) {
    const d = dust[i];
    d.x += d.vx; d.y += d.vy; d.life -= .006;
    if (d.life <= 0) { dust.splice(i, 1); continue; }
    const dist = Math.hypot(d.x - light.x, d.y - light.y) / (light.r + light.boost + 1);
    const a = Math.max(0, 1 - dist) * d.life * .6;
    ctx.fillStyle = `rgba(230,230,230,${a})`;
    ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
  }
}

/* ---------- serpente guia ---------- */
function setupSerpent() {
  const main = api.$('main'), first = api.$('.marquee'), end = api.$('.tracklist');
  if (!main || !first || !end) return;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.classList.add('serpent'); svg.setAttribute('aria-hidden', 'true');
  main.appendChild(svg);
  const body = document.createElementNS(NS, 'path'), scales = document.createElementNS(NS, 'path');
  body.classList.add('serpent__body'); scales.classList.add('serpent__scales');
  const head = document.createElementNS(NS, 'g'); head.classList.add('serpent__head');
  head.innerHTML = `<path d="M-14 -11 C 6 -14 22 -8 26 0 C 22 8 6 14 -14 11 Z" class="serpent__skull"/><circle cx="12" cy="-5" r="2.2" class="serpent__eye"/><circle cx="12" cy="5" r="2.2" class="serpent__eye"/><path d="M26 0 L38 0 M38 0 L44 -4 M38 0 L44 4" class="serpent__tongue"/>`;
  svg.append(body, scales, head);
  const tongue = head.querySelector('.serpent__tongue');
  let L = 0, prog = 0;
  const build = () => {
    const y0 = first.offsetTop + first.offsetHeight + 40, y1 = end.offsetTop - 40;
    svg.setAttribute('viewBox', `0 0 80 ${main.scrollHeight}`);
    svg.style.height = main.scrollHeight + 'px';
    let d = `M40 ${y0}`;
    for (let y = y0, i = 0; y < y1; y += 220, i++) {
      const s = i % 2 ? 1 : -1;
      d += ` C ${40 + 26 * s} ${y + 70}, ${40 + 26 * s} ${y + 150}, 40 ${Math.min(y1, y + 220)}`;
    }
    body.setAttribute('d', d); scales.setAttribute('d', d);
    L = body.getTotalLength();
    body.style.strokeDasharray = scales.style.strokeDasharray = '';
    body.style.strokeDasharray = L; body.style.strokeDashoffset = L * (1 - prog);
  };
  const place = () => {
    const len = Math.max(1, L * prog);
    const p = body.getPointAtLength(len), q = body.getPointAtLength(Math.max(0, len - 2));
    const ang = Math.atan2(p.y - q.y, p.x - q.x) * 180 / Math.PI;
    head.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang})`);
    body.style.strokeDashoffset = L * (1 - prog);
    scales.style.clipPath = `inset(0 0 ${Math.max(0, svg.clientHeight - p.y)}px 0)`;
  };
  build();
  api.onResize(() => { build(); place(); });
  api.ScrollTrigger.create({
    trigger: first, start: 'top center', endTrigger: end, end: 'top center', scrub: true,
    onUpdate: self => { prog = api.reduce ? 1 : self.progress; place(); },
  });
  api.ScrollTrigger.addEventListener('refresh', () => { build(); place(); });
  place();
  if (!api.reduce) setInterval(() => api.gsap.fromTo(tongue, { scaleX: 0 }, { scaleX: 1, duration: .12, yoyo: true, repeat: 3, transformOrigin: '26px 0px' }), 2400);
}

/* ---------- Jason: ondas graves ---------- */
function bassWaves(section) {
  const visual = section.querySelector('.member__visual');
  const c = document.createElement('canvas'); c.className = 'fx-local fx-local--under'; visual.prepend(c);
  const ctx = c.getContext('2d');
  let w = 0, h = 0;
  api.onResize(() => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); });
  api.ticker(now => {
    if (!section.classList.contains('is-live')) return;
    ctx.clearRect(0, 0, w, h);
    for (let k = 0; k < 4; k++) {
      ctx.strokeStyle = `rgba(220,220,220,${.35 - k * .07})`; ctx.lineWidth = 3 - k * .5;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = h * (.35 + k * .1) + Math.sin(x / (90 + k * 20) + now / (700 + k * 120)) * h * .08;
        x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
    }
  });
}

/* ---------- mesa de som ---------- */
function setupMixer() {
  const strips = api.$$('.strip');
  if (!strips.length) return;
  const levels = strips.map(() => 0);
  api.ticker(now => {
    if (!api.$('.mixer').closest('.special').classList.contains('is-live')) return;
    strips.forEach((s, i) => {
      const fader = s.querySelector('input'), cells = s.querySelectorAll('.vu i');
      const target = (fader.value / 100) * (.55 + .45 * Math.abs(Math.sin(now / (300 + i * 70) + i)) * (.7 + Math.random() * .3));
      levels[i] += (target - levels[i]) * .25;
      const lit = Math.round(levels[i] * cells.length);
      cells.forEach((c, k) => c.classList.toggle('on', cells.length - 1 - k < lit));
    });
  });
  strips.forEach(s => s.querySelector('input').addEventListener('input', e => {
    s.style.setProperty('--glow', e.target.value / 100);
  }));
  api.ScrollTrigger.create({ trigger: '.mixer', start: 'top 85%', end: 'bottom 15%', onToggle: self => api.$('.mixer').closest('.special').classList.toggle('is-live', self.isActive) });
}

function whoosh() {
  const { audio } = api;
  if (!audio.on) return;
  const ac = audio.ctx, t = ac.currentTime;
  const src = ac.createBufferSource(); src.buffer = audio.noise(1.2, 'pink');
  const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
  f.frequency.setValueAtTime(180, t); f.frequency.exponentialRampToValueAtTime(1400, t + .35); f.frequency.exponentialRampToValueAtTime(120, t + 1.1);
  const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .25); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
  src.connect(f).connect(g).connect(audio.out); src.start(t); src.stop(t + 1.2);
}

let larsSink;
const theme = {
  name: 'black',
  ease: 'power2.out',
  nameEase: 'power3.out',
  flicker: false,
  sparkColor: '220,220,220',
  progress: p => Math.round((1 - p) * 100),

  init(a) {
    api = a;
    darkness = api.$('#darkness');
    api.onResize((w, h) => { W = w; H = h; light.base = w < 700 ? 230 : 340; if (!light.x) { light.x = light.tx = w / 2; light.y = light.ty = h / 2; } });
    addEventListener('pointermove', e => { light.tx = e.clientX; light.ty = e.clientY; lastMove = performance.now(); });
    api.ticker(now => { stepLight(now); if (!api.reduce && !lightsOn) drawDust(); });

    const btn = api.$('.lights');
    const setLights = on => {
      lightsOn = on; document.body.classList.toggle('lights-on', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.querySelector('.lights__long').textContent = on ? 'Apagar as luzes' : 'Acender as luzes';
      btn.querySelector('.lights__short').textContent = on ? 'Apagar' : 'Luz';
    };
    btn.addEventListener('click', () => setLights(!lightsOn));
    if (api.reduce) setLights(true);

    setupSerpent();
    bassWaves(api.$('#jason'));
    setupMixer();
    const lars = api.$('#lars');
    larsSink = api.gsap.timeline({ repeat: -1, paused: true })
      .to(lars.querySelector('.member__visual'), { y: 6, duration: .18, ease: 'power2.in' })
      .add(() => { api.gsap.fromTo(lars.querySelector('.kick'), { scale: 1.06 }, { scale: 1, duration: .6, ease: 'power2.out' }); if (api.audio.on) api.audio.thump({ from: 90, to: 38, gain: .7, decay: .5 }); }, '<.18')
      .to(lars.querySelector('.member__visual'), { y: 0, duration: .8, ease: 'power2.out' })
      .fromTo(lars.querySelector('.snare'), { scale: 1.06 }, { scale: 1, duration: .4 }, '<.1');
  },

  loader(a, el) {
    const line = el.querySelector('.ld-line');
    return new Promise(resolve => {
      a.gsap.timeline({ onComplete: resolve })
        .to({}, { duration: a.reduce ? 0 : .5 })
        .add(() => a.audio.on && a.audio.thump({ from: 70, to: 40, gain: .8, decay: .6 }))
        .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: a.reduce ? .05 : .7, ease: 'power2.inOut' })
        .add(() => a.audio.on && a.audio.thump({ from: 70, to: 40, gain: .8, decay: .6 }), '+=.2')
        .to(line, { width: 140, height: 140, borderRadius: '50%', duration: a.reduce ? .05 : .5, ease: 'power3.inOut' })
        .to(line, { scale: 9, autoAlpha: 0, duration: a.reduce ? .05 : .6, ease: 'power2.in' });
    });
  },

  heroTitle(tl, a) {
    tl.from('.hero__line', { autoAlpha: 0, y: 40, duration: 1.6, stagger: .3, ease: 'power3.out' }, .2)
      .fromTo(light, { r: 0 }, { r: light.base, duration: 1.8, ease: 'power2.out' }, 0);
  },

  storyCut() { pulse(240, 1); },

  onClick(x, y) {
    lastMove = performance.now();
    light.tx = x; light.ty = y; light.x += (x - light.x) * .6; light.y += (y - light.y) * .6;
    pulse(); whoosh();
    api.burst(x, y, 20, { color: '230,230,230', kind: 'dot', size: 1.5, speed: 2.5, gravity: -.01, decay: .012 });
  },

  onMemberEnter(section) {
    if (lightsOn) return;
    const r = section.querySelector('.member__visual').getBoundingClientRect();
    light.tx = r.left + r.width / 2; light.ty = r.top + r.height / 2; lastMove = performance.now();
    pulse(260, 1.6);
  },
  onMemberLive(section, on) {
    if (section.id === 'lars') (on && !api.reduce ? larsSink.play() : larsSink.pause());
  },

  sound(a) {
    const { audio } = a, ac = audio.ctx;
    const g = ac.createGain(); g.gain.value = 0; g.gain.linearRampToValueAtTime(.08, ac.currentTime + 2);
    const o1 = ac.createOscillator(), o2 = ac.createOscillator();
    o1.frequency.value = 41; o2.frequency.value = 41.6;
    o1.connect(g); o2.connect(g); g.connect(audio.out); o1.start(); o2.start();
    const stopNoise = audio.loop({ type: 'brown', filter: 'lowpass', freq: 160, gain: .04 });
    return () => { g.gain.linearRampToValueAtTime(0, ac.currentTime + .5); o1.stop(ac.currentTime + .6); o2.stop(ac.currentTime + .6); stopNoise(); };
  },
};

export default theme;
