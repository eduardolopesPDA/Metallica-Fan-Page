# Contratos técnicos

Complemento da [spec modelo](SPEC-modelo.md). Descreve como dados, temas, motor de cenas e ilustrações conversam. Os nomes são sugestões; o que importa é manter o contrato.

A implementação de referência (Astro + GSAP) está nas skills `motor-de-cenas` e `identidade-por-capitulo`.

---

## 1. Dados

Todo conteúdo fica em arquivos de dados (ou num CMS com o mesmo formato). As páginas só leem.

### 1.1 `data/chapters.js` — os capítulos do site

```js
export const chapters = {
  '<slug>': {
    slug: 'expansao',            // também é a URL: /expansao/
    n: 2,
    theme: 'expansao',           // chave do módulo de tema e do CSS
    concept: 'Expansão',         // a palavra que decide o tema
    title: ['A', 'Expansão'],    // linhas do título no hero
    name: 'A Expansão',
    period: '2001–2010',         // ou ano, ou data
    sub: 'Uma frase sobre o capítulo.',
    meta: [['Rótulo', 'valor']], // metadados do hero
    blocks: [],                  // conteúdo próprio do capítulo (pessoas, obras, produtos, números…)
  },
};
export const order = ['<slug-1>', '<slug-2>'];
export function neighbors(slug) {}  // { prev, next }
```

### 1.2 `data/story.js` — o filme

```js
export const places = {           // opcional: só se houver mapa de rota
  sp: { name: 'São Paulo', lat: -23.55, lon: -46.63, label: [8, -8, 'start'] },
};

export const story = {
  '<chapterId>': {                // 'prologo', o slug de cada capítulo, 'epilogo'
    n: 2, label: 'Capítulo 2', title: 'A Expansão', years: '2001–2010',
    route: [['sp', 'rio']],       // opcional: trechos do mapa neste capítulo
    allRoads: false,              // true no epílogo: mostra todos os trechos
    previously: 'Resumo do capítulo anterior, em 1 a 3 frases.',
    scenes: [{
      card: 'São Paulo, março de 2001', // cartela: lugar e data (ou outro marcador)
      art: 'primeira-loja',       // chave da ilustração; 'map' usa o mapa de rota
      text: 'Narração da cena, 1 a 3 frases.',
      map: { route: 0 },          // só em cenas 'map'
      still: false, silence: false, strike: false,
    }],
    hook: 'Gancho para o próximo capítulo.', // null = gancho silencioso
  },
};
export const storyOrder = ['prologo', '<slug-1>', '<slug-2>']; // epílogo fora
```

### 1.3 `data/sources.js` — fontes

```js
export const statuses = [['Confirmado', 'critério', 'uso'] /* … */];
export const sources = [{ group: 'Publicação ou tipo', items: [['Título', 'https://…']] }];
```

## 2. Contrato de tema

Cada capítulo tem um módulo de tema (JS) e uma folha de estilos (CSS). O CSS redefine os tokens (`--bg`, `--ink`, `--ink-strong`, `--muted`, `--accent`, `--line`, `--font-display`, `--font-body`, `--font-mono`) em `[data-theme="<tema>"]`. O JS é um objeto com ganchos opcionais:

| Grupo | Ganchos |
|---|---|
| Configuração | `ease`, `sparkColor`, `progress(p)` (texto do medidor lateral) |
| Ciclo de vida | `init(api)`, `loader(api, el)` → Promise, `heroTitle(tl, api)`, `afterIntro(api)`, `sound(api)` → função que para |
| Blocos | `onBlockEnter(section, api)`, `onBlockLive(section, active, api)` |
| Interação | `onPointerDown(e, api)` → bool (tomar o gesto), `onPointerMove`, `onPointerUp`, `onHoldStart(x, y)`, `onHoldEnd()`, `onClick(x, y, holdMs, api)` |
| Filme | `storyCut(scene, api)` a cada troca de cena; `onStoryScene(scene, active, api)` quando uma cena vira ativa ou deixa de ser |

Durante o filme, o `body` recebe a classe `story-on`. Use-a para esconder controles e aliviar efeitos que cobririam a legenda.

## 3. API do motor

```js
api = {
  gsap, ScrollTrigger,
  reduce,                 // prefers-reduced-motion
  fine,                   // ponteiro fino
  rand(a, b),
  ticker(fn),             // fn(now, dt) a cada quadro, canvas já limpos
  onResize(fn),           // fn(W, H)
  layer('back'|'front'),  // { c, ctx } das camadas de canvas
  burst(x, y, n, opts),   // partículas
  audio,                  // set(on), on, hit(), thump(), loop(), noise()
  shake(power),
  $, $$, wait(ms),
}
```

## 4. Ilustração de cena

```js
export const arts = {
  '<chave>': {
    svg: () => `<svg viewBox="0 0 800 450">…</svg>`, // camadas .d1 .d2 .d3 para profundidade
    init(el, api) {},      // opcional
    update(el, p, api) {}, // opcional: p de 0 a 1 é o progresso local da cena
  },
};
```

- Com movimento reduzido o motor chama `update(el, 1)`: a cena precisa fazer sentido no estado final.
- Linhas que se desenham: `stroke-dasharray` + `stroke-dashoffset` (helpers `prepDraw`/`setDraw`).
- Classes de traço herdam as cores dos tokens do tema, então a mesma ilustração funciona em qualquer capítulo.
- Se o projeto usar imagens em vez de SVG, o contrato é o mesmo: `svg()` devolve a marcação da cena e `update()` anima.

## 5. Marcação do filme

```
section.story[data-chapter][style=--scenes:N]
  div.story__stage                   ← preso na tela (sticky, 100vh)
    header.scene.scene--open         ← rótulo, título, anteriormente, [data-play], pular
    article.scene[data-art][data-cam][data-silence][data-strike]
      div.scene__art  p.scene__card  p.scene__text
    article.scene.scene--hook
    div.story__progress
  div.story__bars  div.minimap  div.story__control   ← movidos para o body
```

- Altura da seção: `N × 130vh + 100vh` (`115vh` por cena no celular).
- Tempo do filme: `g = progresso × N`. A cena `i` ocupa `[i, i+1]`, com fusão de largura 0,18 (smoothstep).
- Câmeras em ciclo: `in`, `left`, `up`, `right`, `out`; cenas `still` sem câmera.
- Rolagem automática: ~9 s por cena (`still` ×1,6), interrompida por roda, toque, teclas e clique.

## 6. Armadilhas conhecidas

| Sintoma | Causa | Solução |
|---|---|---|
| O palco não fica preso | `overflow-x: hidden` no `body` cria um contêiner de rolagem e quebra o `sticky` | `overflow-x: clip` em `html` e `body` |
| Elementos `fixed` do filme somem ou ficam no lugar errado | um `transform` num ancestral (ex.: tremor de tela no `main`) prende o `fixed` a ele | mover os elementos fixos para o `body` ao iniciar |
| Linhas animadas param antes do fim no desktop | `vector-effect: non-scaling-stroke` mede o tracejado em pixels de tela | desligar o `vector-effect` nos elementos com `stroke-dasharray` inline |
| Elementos animados por `transform` ficam parados | o `transform` CSS da profundidade sobrescreve o atributo `transform` do SVG | envolver a camada de profundidade num `<g>` |
| O hub aparece com as cores erradas no carregamento | a função que pinta as cores roda antes da hora | só pintar quando a seção certa estiver na tela |
| Efeitos cobrem a legenda no celular | tamanhos fixos em px | escalar pelo tamanho da tela, reduzir partículas com `story-on`, halo na legenda |
| Projeto duplicado na hospedagem | deploy rodado numa pasta sem vínculo local | conferir os projetos existentes antes; se já está ligado ao repositório, o push basta |
