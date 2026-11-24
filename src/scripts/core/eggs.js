/* =========================================================
   EASTER EGGS — comum aos temas
   Três jeitos de achar:
   1. digitar uma palavra secreta (ex.: "dave")
   2. tocar 3 vezes nos créditos "DM" da lista de faixas
      (cada toque mostra uma curiosidade da faixa)
   3. clicar num elemento marcado com [data-egg]
   ========================================================= */
import gsap from 'gsap';

let pop = null, toastEl = null, cooldown = 0;

function closePop() { if (pop) { pop.remove(); pop = null; } }

function showPop(btn) {
  closePop();
  pop = document.createElement('div');
  pop.className = 'egg-pop';
  pop.setAttribute('role', 'status');
  pop.textContent = btn.dataset.note;
  document.body.appendChild(pop);
  const r = btn.getBoundingClientRect(), pw = Math.min(300, innerWidth - 32);
  pop.style.width = pw + 'px';
  pop.style.left = Math.max(16, Math.min(innerWidth - pw - 16, r.left + r.width / 2 - pw / 2)) + 'px';
  const below = r.bottom + 12, h = pop.offsetHeight;
  pop.style.top = (below + h > innerHeight - 12 ? r.top - h - 12 : below) + 'px';
  gsap.from(pop, { autoAlpha: 0, y: 6, duration: .25, ease: 'power2.out' });
}

export function toast({ kicker, title, text, stamp }) {
  toastEl?.remove();
  toastEl = document.createElement('aside');
  toastEl.className = 'egg-toast';
  toastEl.setAttribute('role', 'dialog');
  toastEl.setAttribute('aria-label', title);
  toastEl.innerHTML = `
    ${stamp ? `<span class="egg-toast__stamp" aria-hidden="true">${stamp}</span>` : ''}
    <p class="egg-toast__kicker">${kicker}</p>
    <h3 class="egg-toast__title">${title}</h3>
    <p class="egg-toast__text">${text}</p>
    <button type="button" class="egg-toast__close">Fechar</button>`;
  document.body.appendChild(toastEl);
  const el = toastEl;
  const close = () => gsap.to(el, { autoAlpha: 0, y: 30, duration: .3, onComplete: () => el.remove() });
  el.querySelector('.egg-toast__close').addEventListener('click', close);
  el.querySelector('.egg-toast__close').focus({ preventScroll: true });
  addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', esc); } });
  gsap.from(el, { autoAlpha: 0, y: 60, rotate: -4, duration: .6, ease: 'back.out(1.6)' });
  if (el.querySelector('.egg-toast__stamp')) gsap.from(el.querySelector('.egg-toast__stamp'), { scale: 3, autoAlpha: 0, rotate: -25, duration: .3, delay: .45, ease: 'power4.in' });
  setTimeout(() => { if (el.isConnected) close(); }, 16000);
  return el;
}

export function setupEggs({ words = [], onTrigger }) {
  const fire = (source) => {
    const now = performance.now();
    if (now < cooldown) return;
    cooldown = now + 4000;
    closePop();
    onTrigger(source);
  };

  // 1. palavra secreta
  let buffer = '';
  addEventListener('keydown', e => {
    if (e.target.closest?.('input, textarea')) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-12);
    if (words.some(w => buffer.endsWith(w))) { buffer = ''; fire('keyboard'); }
  });

  // 2. créditos "DM": curiosidade a cada toque, o egg completo no terceiro
  let taps = 0;
  document.querySelectorAll('.cred-dm').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    taps++;
    if (taps >= 3) { taps = 0; fire('credits'); return; }
    showPop(btn);
  }));
  addEventListener('scroll', closePop, { passive: true });
  addEventListener('pointerdown', e => { if (pop && !e.target.closest('.cred-dm, .egg-pop')) closePop(); });

  // 3. elementos marcados
  document.querySelectorAll('[data-egg]').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.addEventListener('click', () => fire('element'));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') fire('element'); });
  });

  return fire;
}
