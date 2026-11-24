/* =========================================================
   HOME — toca-discos na abertura e linha do tempo horizontal.
   O fundo interpola entre as cores de cada disco conforme o scroll.
   ========================================================= */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { audio } from './core/audio.js';

gsap.registerPlugin(ScrollTrigger);

const INTRO = { bg: '#000000', ink: '#f2f2f2', muted: 'rgba(242,242,242,.6)', line: 'rgba(255,255,255,.18)' };
const PALETTE = {
  kea: { bg: '#e6ddc7', ink: '#15120f', muted: 'rgba(21,18,15,.62)', line: 'rgba(21,18,15,.25)' },
  rtl: { bg: '#0a2aa8', ink: '#e6f6ff', muted: 'rgba(230,246,255,.7)', line: 'rgba(143,220,255,.3)' },
  mop: { bg: '#5a1209', ink: '#efe3cf', muted: 'rgba(239,227,207,.7)', line: 'rgba(239,227,207,.25)' },
  justice: { bg: '#1b1e1d', ink: '#dcd8cc', muted: 'rgba(220,216,204,.65)', line: 'rgba(220,216,204,.2)' },
  black: { bg: '#000000', ink: '#d8d8d8', muted: 'rgba(216,216,216,.55)', line: 'rgba(255,255,255,.12)' },
};

export function initHome() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = matchMedia('(min-width: 801px)').matches;
  const root = document.body;
  const paint = (c) => {
    root.style.setProperty('--bg', c.bg); root.style.setProperty('--ink', c.ink);
    root.style.setProperty('--ink-strong', c.ink); root.style.setProperty('--muted', c.muted); root.style.setProperty('--line', c.line);
  };
  paint(INTRO);

  /* ---------- abertura: braço do toca-discos desce ---------- */
  gsap.set('.tt-arm', { rotate: -28 });
  const intro = gsap.timeline({ delay: .2, onComplete: () => root.classList.remove('is-loading') });
  intro.to('.tt-arm', { rotate: 0, duration: reduce ? .01 : 1.4, ease: 'power2.inOut' })
    .from('.intro__text > *', { y: 30, autoAlpha: 0, stagger: .12, duration: .9, ease: 'expo.out' }, reduce ? 0 : .8)
    .from('.home-nav', { y: -30, autoAlpha: 0, duration: .8, ease: 'expo.out' }, .9);
  root.classList.remove('is-loading');

  /* ---------- linha do tempo ---------- */
  const track = document.querySelector('.timeline__track');
  const stations = [...document.querySelectorAll('.station')];
  const head = document.querySelector('.ruler__head');
  const YEARS = { kea: 1983, rtl: 1984, mop: 1986, justice: 1988, black: 1991 };

  const colorize = () => {
    const vc = innerWidth / 2, vcy = innerHeight / 2;
    const pos = stations.map(s => { const r = s.getBoundingClientRect(); return desktop ? r.left + r.width / 2 : r.top + r.height / 2; });
    const c0 = desktop ? vc : vcy;
    let a = 0;
    for (let i = 0; i < pos.length; i++) if (pos[i] <= c0) a = i;
    const b = Math.min(stations.length - 1, a + 1);
    const t = a === b ? 0 : gsap.utils.clamp(0, 1, (c0 - pos[a]) / (pos[b] - pos[a]));
    const ka = stations[a].dataset.themeKey, kb = stations[b].dataset.themeKey;
    paint(gsap.utils.interpolate(PALETTE[ka], PALETTE[kb], t));
    stations.forEach((s, i) => s.classList.toggle('is-current', i === (t < .5 ? a : b)));
    if (head) {
      const year = YEARS[ka] + (YEARS[kb] - YEARS[ka]) * t;
      head.style.left = ((year - 1983) / 8) * 100 + '%';
    }
  };

  if (desktop) {
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.timeline', pin: true, scrub: reduce ? true : .8, end: () => '+=' + dist(), invalidateOnRefresh: true, onUpdate: colorize },
    });
  } else {
    ScrollTrigger.create({ trigger: '.timeline', start: 'top bottom', end: 'bottom top', onUpdate: colorize });
  }
  // a intro fica preta; as cores entram junto com a linha do tempo
  ScrollTrigger.create({ trigger: '.timeline', start: 'top 60%', onEnter: colorize, onLeaveBack: () => paint(INTRO) });
  colorize();
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  /* ---------- entrar num disco: o disco para e a agulha levanta ---------- */
  document.querySelectorAll('.disc, .station__cta').forEach(link => link.addEventListener('click', e => {
    if (reduce || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    const vinyl = link.closest('.station').querySelector('.disc__vinyl');
    gsap.to(vinyl, { rotate: '+=200', scale: 1.08, duration: .45, ease: 'power2.out', onComplete: () => { location.href = link.href; } });
    if (audio.on) audio.hit({ buffer: audio.noise(.2), type: 'highpass', freq: 2000, gain: .2, decay: .15 });
  }));

  /* ---------- cursor ---------- */
  const cursor = document.querySelector('.cursor');
  if (cursor && matchMedia('(pointer: fine)').matches) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: .15 }), yTo = gsap.quickTo(cursor, 'y', { duration: .15 });
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
  }

  /* ---------- som: chiado de vinil ---------- */
  const btn = document.querySelector('.sound'), label = btn.querySelector('.sound__label');
  let stop = null, crackle = null;
  const startCrackle = () => {
    stop = audio.loop({ type: 'pink', filter: 'bandpass', freq: 3200, q: .5, gain: .02 });
    const pop = () => { audio.hit({ buffer: audio.noise(.02), type: 'highpass', freq: 2500, gain: Math.random() * .12, decay: .01 }); crackle = setTimeout(pop, 60 + Math.random() * 500); };
    pop();
  };
  audio.listen(on => {
    btn.setAttribute('aria-pressed', String(on)); label.textContent = on ? 'Som on' : 'Som off';
    if (on && !stop) startCrackle();
    if (!on && stop) { stop(); stop = null; clearTimeout(crackle); }
  });
  btn.addEventListener('click', () => audio.set(!audio.on));
  if (audio.stored()) {
    btn.setAttribute('aria-pressed', 'true'); label.textContent = 'Som on';
    const arm = e => { if (e.target.closest?.('.sound')) return; if (!audio.on) audio.set(true); removeEventListener('pointerdown', arm); };
    addEventListener('pointerdown', arm);
  }
}
