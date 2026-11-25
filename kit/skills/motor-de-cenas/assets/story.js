/* =========================================================
   MOTOR DAS CENAS — "A história"
   - um palco único (sticky, 100vh) com todas as cenas empilhadas
   - o progresso do scroll na seção vira um "tempo de filme" g:
     a cena i ocupa o intervalo [i, i+1] e faz fusão com a vizinha
   - cada cena: cartela datilografada, legenda que surge palavra a
     palavra (desfoque → nítido), câmera (zoom/panorâmica) e camadas
     em profundidade (.d1 .d2 .d3) dentro da ilustração
   - rolagem automática: o filme roda sozinho e para se a pessoa mexer
   - o tema pode reagir: storyCut(cena) a cada corte, onStoryScene(cena, ativa)
   ========================================================= */
import { createMap } from './map.js';

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = t => t * t * (3 - 2 * t); // smoothstep
const FADE = .18;                     // largura da fusão entre cenas
const SCENE_SECONDS = 9;              // duração de cada cena na rolagem automática

function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  return words.map((w, i) => {
    const s = document.createElement('span');
    s.className = 'w';
    s.textContent = w;
    el.appendChild(s);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    return s;
  });
}

/* a profundidade vai num <g> em volta do elemento: o transform CSS dela
   sobrescreveria o atributo transform que a ilustração anima (skate, ônibus, cheque) */
function depthWrap(d) {
  if (!(d instanceof SVGElement) || d.tagName === 'svg') return d;
  const g = document.createElementNS(d.namespaceURI, 'g');
  d.before(g); g.appendChild(d);
  return g;
}

const CAMERA = {
  in: p => `scale(${(1.16 - .16 * p).toFixed(4)})`,
  out: p => `scale(${(1 + .1 * p).toFixed(4)})`,
  left: p => `scale(1.08) translateX(${((.5 - p) * 6).toFixed(2)}%)`,
  right: p => `scale(1.08) translateX(${((p - .5) * 6).toFixed(2)}%)`,
  up: p => `scale(1.08) translateY(${((.5 - p) * 5).toFixed(2)}%)`,
};

export function initStory(api, arts = {}) {
  const sec = document.querySelector('.story');
  if (!sec) return null;
  const { ScrollTrigger, reduce, theme } = api;
  const chapterId = sec.dataset.chapter;
  // elementos fixos saem do <main>: o tremor da tela deixa um transform nele, que prenderia o "fixed" ao main
  sec.querySelectorAll('.story__bars, .minimap, .story__control').forEach(el => document.body.appendChild(el));

  const mini = createMap(document.querySelector('.minimap'), chapterId, { mini: true });
  const dots = [...sec.querySelectorAll('.story__progress i')];

  /* ---------- preparar as cenas ---------- */
  const scenes = [...sec.querySelectorAll('.scene')].map((el, i) => {
    const artEl = el.querySelector('.scene__art');
    const text = el.querySelector('.scene__text');
    const card = el.querySelector('.scene__card');
    const key = el.dataset.art;
    let art = null;
    if (key === 'map') {
      const m = createMap(artEl, chapterId, { only: Number(el.dataset.mapRoute) });
      art = { update: (_, p) => m.setProgress(clamp((p - .1) / .6)) };
    } else if (key && arts[key]) {
      artEl.innerHTML = arts[key].svg();
      art = arts[key];
      art.init?.(artEl, api);
    }
    const cardText = card ? card.textContent : '';
    return {
      el, i, art, artEl, card, cardText,
      words: text ? splitWords(text) : [],
      cam: CAMERA[el.dataset.cam] || null,
      depth: artEl ? [...artEl.querySelectorAll('.d1, .d2, .d3')].map(d => ({ d: depthWrap(d), k: d.classList.contains('d3') ? 3 : d.classList.contains('d2') ? 2 : 1 })) : [],
      still: el.classList.contains('scene--still'),
      shownCard: -1,
    };
  });
  const N = scenes.length;

  function renderScene(s, p, opacity) {
    s.el.style.opacity = opacity.toFixed(3);
    s.el.style.visibility = opacity > .001 ? 'visible' : 'hidden';
    if (opacity <= .001) return;
    if (s.card) {
      const n = Math.ceil(clamp(p / .14) * s.cardText.length);
      if (n !== s.shownCard) { s.card.textContent = s.cardText.slice(0, n); s.shownCard = n; }
      s.card.classList.toggle('is-typing', n < s.cardText.length);
    }
    const k = s.still || reduce ? 1 : clamp((p - .06) / .5);
    const shown = Math.ceil(k * s.words.length);
    s.words.forEach((w, j) => w.classList.toggle('on', j < shown));
    if (s.cam && !reduce && s.artEl) s.artEl.style.transform = s.cam(p);
    if (!reduce) s.depth.forEach(({ d, k }) => { d.style.transform = `translate(${((p - .5) * k * -14).toFixed(1)}px, ${((p - .5) * k * -6).toFixed(1)}px)`; });
    s.art?.update?.(s.artEl, reduce ? 1 : p, api);
  }

  /* ---------- tempo do filme ---------- */
  let active = -1;
  function render(progress) {
    const g = progress * N;
    for (const s of scenes) {
      const local = clamp(g - s.i);
      const fadeIn = s.i === 0 ? 1 : ease(clamp((g - s.i + FADE / 2) / FADE));
      const fadeOut = s.i === N - 1 ? 1 : ease(clamp((s.i + 1 + FADE / 2 - g) / FADE));
      renderScene(s, local, Math.min(fadeIn, fadeOut));
    }
    const now = Math.min(N - 1, Math.floor(g));
    if (now !== active) {
      if (active >= 0) theme.onStoryScene?.(scenes[active].el, false, api);
      theme.onStoryScene?.(scenes[now].el, true, api);
      if (active >= 0 && !reduce) {
        const stage = sec.querySelector('.story__stage');
        stage.classList.remove('is-cut'); void stage.offsetWidth; stage.classList.add('is-cut');
        theme.storyCut?.(scenes[now].el, api);
      }
      active = now;
      dots.forEach((d, j) => d.classList.toggle('on', j <= now));
    }
    mini.setProgress(progress);
  }

  const st = ScrollTrigger.create({
    trigger: sec, start: 'top top', end: 'bottom bottom',
    onUpdate: self => render(self.progress),
    onToggle: self => document.body.classList.toggle('story-on', self.isActive),
    onLeave: () => stop(), onLeaveBack: () => stop(),
  });
  render(0);

  /* ---------- rolagem automática ---------- */
  let playing = false, raf = 0, last = 0, y = 0;
  const buttons = [...document.querySelectorAll('[data-play]')];
  const paint = () => buttons.forEach(b => { b.setAttribute('aria-pressed', String(playing)); b.classList.toggle('is-playing', playing); });
  function tick(t) {
    const dt = Math.min(64, t - (last || t)); last = t;
    const span = st.end - st.start;
    const g = st.progress * N;
    const cur = scenes[Math.min(N - 1, Math.floor(g))];
    const secs = cur && cur.still ? SCENE_SECONDS * 1.6 : SCENE_SECONDS; // cenas paradas duram mais
    y += (span / N) / secs * (dt / 1000);
    if (y >= st.end - 2) { window.scrollTo(0, st.end); stop(); return; }
    window.scrollTo(0, Math.round(y));
    raf = requestAnimationFrame(tick);
  }
  function play() {
    if (playing) return;
    playing = true; last = 0;
    if (window.scrollY < st.start || window.scrollY >= st.end - 2) window.scrollTo(0, st.start + 1);
    y = window.scrollY;
    paint();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    if (!playing) return;
    playing = false; cancelAnimationFrame(raf); paint();
  }
  buttons.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); playing ? stop() : play(); }));
  // qualquer gesto da pessoa assume o controle de volta
  const interrupt = e => { if (playing && !e.target.closest?.('[data-play]')) stop(); };
  addEventListener('wheel', interrupt, { passive: true });
  addEventListener('touchstart', interrupt, { passive: true });
  addEventListener('keydown', e => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) interrupt(e); });
  addEventListener('pointerdown', interrupt);

  return { play, stop };
}
