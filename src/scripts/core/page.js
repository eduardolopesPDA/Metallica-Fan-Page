/* =========================================================
   COREOGRAFIA COMUM — cada página chama boot(tema).
   O tema pode fornecer:
     loader(api, el) → Promise   heroTitle(tl, api)   init(api)   afterIntro(api)
     onClick(x, y, holdMs, api)  onHoldStart(x, y, api)
     onPointerDown(e, api) → true se "capturou" o ponteiro (ex.: puxar corda)
     onPointerMove(e, api)       onPointerUp(e, api)
     onMemberEnter(section, api) onMemberLive(section, on, api)
     progress(p) → texto do trilho   sound(api) → função que para o ambiente
     ease, nameEase, flicker, sparkColor
   ========================================================= */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initEngine, reduce, fine, rand, ticker, onResize, size, layer, spawn, burst } from './engine.js';
import { audio } from './audio.js';
import { buildInstruments } from './instruments.js';

gsap.registerPlugin(ScrollTrigger);

export const $ = (s, el = document) => el.querySelector(s);
export const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));

export function splitChars(el) {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.classList.add('is-split');
  el.textContent = '';
  for (const c of text) {
    const s = document.createElement('span');
    s.className = 'ch';
    s.setAttribute('aria-hidden', 'true');
    s.style.display = 'inline-block';
    s.textContent = c === ' ' ? ' ' : c;
    el.appendChild(s);
  }
  return $$('.ch', el);
}

export function shake(power = 1) {
  if (reduce || power <= 0) return;
  gsap.fromTo('main', { x: 0, y: 0 }, {
    x: () => rand(-7, 7) * power, y: () => rand(-5, 5) * power,
    duration: .045, repeat: 9, yoyo: true, ease: 'none', clearProps: 'transform',
  });
}

export function boot(theme) {
  initEngine();
  $$('[data-split]').forEach(splitChars);
  buildInstruments();

  const api = { gsap, ScrollTrigger, reduce, fine, rand, ticker, onResize, size, layer, spawn, burst, audio, shake, $, $$, wait, theme };

  setupSound(theme, api);
  theme.init?.(api);
  setupMembers(theme, api);
  setupNav();
  setupRail(theme);
  setupTracklist(theme, api);
  setupCursor();
  setupPointer(theme, api);
  setupAnchors();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  const loaderEl = $('.loader');
  const loaded = theme.loader ? theme.loader(api, loaderEl) : wait(400);
  Promise.race([Promise.resolve(loaded), wait(8000)]).then(() => {
    gsap.to(loaderEl, {
      autoAlpha: 0, duration: .5, onComplete: () => {
        loaderEl.remove();
        document.body.classList.remove('is-loading');
        ScrollTrigger.refresh();
      },
    });
    heroIntro(theme, api);
    theme.afterIntro?.(api);
  });
  return api;
}

/* ---------- hero ---------- */
function heroIntro(theme, api) {
  const tl = gsap.timeline({ defaults: { ease: theme.ease || 'expo.out' } });
  tl.from('.nav', { y: -40, autoAlpha: 0, duration: 1 }, .1)
    .from('.hero__eyebrow > *', { y: 20, autoAlpha: 0, stagger: .06, duration: .8 }, .2);
  if (theme.heroTitle) theme.heroTitle(tl, api);
  else {
    tl.from('.hero__line:first-child .ch', { yPercent: 120, autoAlpha: 0, rotate: () => rand(-20, 20), stagger: .04, duration: 1 }, .25)
      .from('.hero__line--big .ch', { autoAlpha: 0, scale: 2.4, filter: 'blur(14px)', stagger: { each: .05, from: 'random' }, duration: .9, ease: 'power4.out' }, .3)
      .add(() => gsap.set('.hero__line .ch', { clearProps: 'filter' }));
  }
  tl.from('.hero__sub', { y: 30, autoAlpha: 0, duration: 1 }, .9)
    .from('.hero__meta > div', { y: 30, autoAlpha: 0, stagger: .08, duration: .9 }, 1)
    .from('.hero__actions > *', { y: 20, autoAlpha: 0, stagger: .1, duration: .8 }, 1.15)
    .from('.rail', { x: 30, autoAlpha: 0, duration: .8 }, 1.2);

  if (!theme.keepHeroTitle) {
    gsap.to('.hero__title', {
      yPercent: 35, autoAlpha: .2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }
}

/* ---------- integrantes ---------- */
function setupMembers(theme, api) {
  const ease = theme.ease || 'expo.out';
  $$('.member').forEach(section => {
    const first = $$('.member__name > span:first-child .ch', section);
    const second = $$('.member__name .outline .ch', section);
    const draws = $$('.instrument .draw', section);
    draws.forEach(p => {
      const len = p.getTotalLength ? p.getTotalLength() : 600;
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    });
    const tl = gsap.timeline({ paused: true, defaults: { ease } });
    tl.from($('.member__index', section), { x: -30, autoAlpha: 0, duration: .8 }, 0)
      .from(first, { autoAlpha: 0, y: () => rand(-60, 60), x: () => rand(-20, 20), rotate: () => rand(-25, 25), stagger: { each: .05, from: 'random' }, duration: .7, ease: theme.nameEase || 'back.out(2)' }, .05)
      .from(second, { autoAlpha: 0, yPercent: 100, stagger: .035, duration: .8 }, .2)
      .to(draws, { strokeDashoffset: 0, duration: 1.6, stagger: .05, ease: theme.drawEase || 'power2.inOut' }, .1)
      .fromTo($$('.instrument .fade, .instrument > g:not(.outline)', section),
        { opacity: 0, filter: 'brightness(3) blur(4px)' },
        { opacity: 1, filter: 'brightness(1) blur(0px)', duration: 1.1, stagger: .04, ease: 'power2.out', clearProps: 'filter' }, .7)
      .from($('.halo', section), { scale: .3, autoAlpha: 0, duration: 1.4 }, 0)
      .from($$('.member__lead, .member__text', section), { y: 30, autoAlpha: 0, stagger: .12, duration: .9 }, .45)
      .from($$('.facts > div', section), { y: 20, autoAlpha: 0, stagger: .07, duration: .7 }, .7)
      .from($('.meter', section), { y: 20, autoAlpha: 0, duration: .7 }, .9)
      .add(() => chargeMeter(section, theme), 1.1);
    if (theme.flicker !== false) tl.add(() => flicker(first.concat(second)), .55);
    const stamp = $('.member__stamp', section);
    if (stamp) tl.from(stamp, { scale: 3, autoAlpha: 0, rotate: -30, duration: .35, ease: 'power4.in' }, 1.2);
    const memorial = $('.memorial', section);
    if (memorial) tl.from(memorial, { autoAlpha: 0, letterSpacing: '.6em', duration: 1.4 }, 1.4);

    ScrollTrigger.create({
      trigger: section, start: 'top 62%', once: true,
      onEnter: () => { tl.play(); setTimeout(() => theme.onMemberEnter?.(section, api), 120); },
    });
    ScrollTrigger.create({
      trigger: section, start: 'top 80%', end: 'bottom 20%',
      onToggle: self => { section.classList.toggle('is-live', self.isActive); theme.onMemberLive?.(section, self.isActive, api); },
    });
    gsap.fromTo($('.instrument', section), { yPercent: 6 }, {
      yPercent: -6, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.fromTo($('.member__ghost', section), { yPercent: -30 }, {
      yPercent: -70, ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function flicker(chars) {
  if (reduce) return;
  chars.forEach(c => {
    if (Math.random() > .55) gsap.fromTo(c, { opacity: .15 }, { opacity: 1, duration: .05, repeat: 6, yoyo: true, ease: 'steps(1)', delay: rand(0, .4) });
  });
}

function chargeMeter(section, theme) {
  const meter = $('.meter', section);
  const value = Number(meter.dataset.value);
  $$('.meter__cells i', meter).forEach((c, i) => {
    if (i >= value) return;
    gsap.delayedCall(i * .09, () => {
      c.classList.add('on');
      if (theme.sparkColor) {
        const r = c.getBoundingClientRect();
        burst(r.left + r.width / 2, r.top + r.height / 2, 6, { color: theme.sparkColor, speed: 3 });
      }
    });
  });
}

/* ---------- nav, trilho, faixas ---------- */
function setupNav() {
  $$('.member').forEach(section => {
    ScrollTrigger.create({
      trigger: section, start: 'top 50%', end: 'bottom 50%',
      onToggle: self => $(`.nav__links a[data-target="${section.id}"]`)?.classList.toggle('is-active', self.isActive),
    });
  });
}

function setupRail(theme) {
  const value = $('#rail-value'), bar = $('.rail__track span');
  if (!value) return;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: self => {
      value.textContent = theme.progress ? theme.progress(self.progress) : Math.round(self.progress * 100);
      bar.style.height = self.progress * 100 + '%';
    },
  });
}

function setupTracklist(theme, api) {
  if (theme.tracklistIn) return theme.tracklistIn(api);
  gsap.from('.tracks li', {
    x: -40, autoAlpha: 0, stagger: .06, duration: .8, ease: theme.ease || 'expo.out',
    scrollTrigger: { trigger: '.tracklist', start: 'top 75%' },
  });
}

function setupCursor() {
  const cursor = $('.cursor');
  if (!cursor || !fine) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: .15, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: .15, ease: 'power3' });
  addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
  document.addEventListener('pointerover', e => cursor.classList.toggle('is-hover', !!e.target.closest('a, button, input, .tracks li, [data-grab]')));
}

function setupPointer(theme, api) {
  let downAt = 0, dx = 0, dy = 0, claimed = false;
  addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    claimed = !!theme.onPointerDown?.(e, api);
    if (claimed) return;
    if (e.target.closest('a, button, input, label, .no-fx')) { downAt = 0; return; }
    downAt = performance.now(); dx = e.clientX; dy = e.clientY;
    theme.onHoldStart?.(dx, dy, api);
  });
  addEventListener('pointermove', e => theme.onPointerMove?.(e, api));
  // no toque, o navegador cancela o ponteiro quando começa a rolar: solta o que estiver preso
  addEventListener('pointercancel', e => { if (claimed) { claimed = false; theme.onPointerUp?.(e, api); } downAt = 0; theme.onHoldEnd?.(api); });
  addEventListener('pointerup', e => {
    if (claimed) { claimed = false; theme.onPointerUp?.(e, api); return; }
    if (!downAt) return;
    const hold = performance.now() - downAt; downAt = 0;
    theme.onHoldEnd?.(api);
    if (Math.hypot(e.clientX - dx, e.clientY - dy) > 12) return;
    theme.onClick?.(e.clientX, e.clientY, hold, api);
  });
}

function setupAnchors() {
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
}

/* ---------- som ---------- */
function setupSound(theme, api) {
  const btn = $('.sound');
  if (!btn) return;
  let stopAmbient = null;
  const label = $('.sound__label', btn);
  const paint = on => { btn.setAttribute('aria-pressed', String(on)); label.textContent = on ? 'Som on' : 'Som off'; };
  audio.listen(on => {
    paint(on);
    if (on && !stopAmbient && theme.sound) stopAmbient = theme.sound(api);
    if (!on && stopAmbient) { stopAmbient(); stopAmbient = null; }
  });
  btn.addEventListener('click', () => audio.set(!audio.on));
  // escolha salva: liga no primeiro gesto (exigência dos navegadores)
  if (audio.stored()) {
    paint(true);
    const arm = e => { if (e.target?.closest?.('.sound')) return; if (!audio.on) audio.set(true); removeEventListener('pointerdown', arm); removeEventListener('keydown', arm); };
    addEventListener('pointerdown', arm); addEventListener('keydown', arm);
  }
}
