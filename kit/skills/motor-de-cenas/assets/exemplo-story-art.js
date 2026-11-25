/* =========================================================
   EXEMPLO de scripts/story-art/<capitulo>.js — as ilustrações
   do capítulo de exemplo. Cada chave é o "art" de uma cena.
   - svg(): o desenho (viewBox 800×450). Camadas .d1 .d2 .d3 = profundidade.
   - init(el, api): opcional, roda uma vez.
   - update(el, p, api): opcional, p de 0 a 1 = progresso local da cena.
     Com movimento reduzido o motor chama update(el, 1): o estado final
     precisa fazer sentido sozinho.
   ========================================================= */
import { clamp, VB, prepDraw, setDraw } from './util.js';

export const arts = {
  /* um forno que acende e solta fumaça */
  forno: {
    svg: () => `<svg ${VB}>
      <line class="a-soft" x1="120" y1="360" x2="680" y2="360"/>
      <g class="d1">
        <rect class="a-line a-fillsoft" x="300" y="200" width="200" height="160" rx="10"/>
        <rect class="a-line" x="330" y="250" width="140" height="70" rx="35"/>
        <rect class="a-glow fogo" x="345" y="265" width="110" height="40" rx="20" style="opacity:0"/>
      </g>
      <g class="d3">
        <path class="a-line fumaca" d="M400 200 C 380 170 420 150 400 120 C 380 90 420 70 400 40"/>
      </g>
    </svg>`,
    init(el) { prepDraw(el, '.fumaca'); },
    update(el, p) {
      const fogo = el.querySelector('.fogo');
      if (fogo) fogo.style.opacity = clamp((p - .1) * 3);
      setDraw(el, '.fumaca', (p - .3) * 2);
    },
  },

  /* um contador que sobe até o número da narração */
  contador: {
    svg: () => `<svg ${VB}>
      <g class="d1"><text class="a-big n" x="400" y="230" text-anchor="middle" style="font-size:72px">0</text></g>
      <g class="d2"><text class="a-tag" x="400" y="275" text-anchor="middle">PÃES POR DIA · 1999</text></g>
    </svg>`,
    update(el, p) {
      const n = el.querySelector('.n');
      if (n) n.textContent = Math.round(2000 * clamp(p * 1.8) ** .5).toLocaleString('pt-BR');
    },
  },
};
