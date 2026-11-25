---
name: motor-de-cenas
description: Implementa um "filme" guiado pela rolagem para sites narrativos — palco preso na tela, cenas que se fundem, câmera, camadas de profundidade, cartela datilografada, legenda palavra por palavra, letterbox, mapa de rota opcional e rolagem automática que para com qualquer gesto. Use quando for transformar um roteiro aprovado em scrollytelling cinematográfico, em Astro, Vite ou qualquer site com GSAP e ScrollTrigger.
---

# Motor de cenas

Transforma um roteiro (capítulos e cenas) num filme que roda com a rolagem. A implementação de referência está em [assets/](assets/) e funciona com qualquer tema, porque só usa os tokens CSS (`--bg`, `--ink`, `--accent`, `--font-*`).

## Peças

| Arquivo | Papel |
|---|---|
| `assets/story.js` | o motor: monta as cenas, calcula o tempo do filme, aplica câmera, profundidade, cartela, legenda, chama os ganchos do tema e cuida da rolagem automática |
| `assets/Story.astro` | a marcação de um capítulo (abertura, cenas, gancho, progresso, letterbox, minimapa, controle). Em outro framework, reproduza o mesmo HTML |
| `assets/story.css` | o palco, as cenas, a legenda, o letterbox, os controles e as classes de traço das ilustrações (`.a-line`, `.a-soft`, `.a-fillsoft`, `.a-tag`, `.a-big`, `.a-glow`…) |
| `assets/map.js` | mapa de rota opcional; trechos que se acumulam de capítulo em capítulo |
| `assets/util.js` | utilidades das ilustrações: `clamp`, `VB`, `prepDraw`/`setDraw`, `person()` (silhueta genérica), `stamp()`, `envelope()` |
| `assets/exemplo-story-data.js` | exemplo de `data/story.js` |
| `assets/exemplo-story-art.js` | exemplo de ilustrações de um capítulo |

Dependências: GSAP com ScrollTrigger. Nada mais.

## Como funciona

- A seção do capítulo tem altura `N × 130vh + 100vh` (115vh no celular), em que N é o número de cenas contando abertura e gancho.
- Dentro dela, um **palco** `position: sticky` de 100vh guarda todas as cenas empilhadas.
- O progresso da rolagem na seção vira o **tempo do filme** `g = progresso × N`. A cena `i` vive em `[i, i+1]` e o progresso local `p` (0 a 1) alimenta a cena.
- A **fusão** entre cenas usa smoothstep com largura 0,18.
- Em cada cena:
  - a cartela é datilografada nos primeiros 14% de `p`;
  - a legenda revela palavra por palavra entre 6% e 56%;
  - a câmera (`in`, `left`, `up`, `right`, `out`, em ciclo) transforma a ilustração;
  - as camadas `.d1`, `.d2` e `.d3` se deslocam em velocidades diferentes;
  - `art.update(el, p)` anima o desenho.
- Na troca de cena: flash de película (`.is-cut`) e os ganchos do tema `storyCut(scene)` e `onStoryScene(scene, active)`.
- Enquanto o filme está na tela, o `body` ganha `story-on`.

## Passo a passo

1. **Dados.** Escreva `data/story.js` a partir do roteiro aprovado (formato em `assets/exemplo-story-data.js`). Exporte sempre `places`, `story`, `storyOrder` e `mapConfig` (pode ser `null`).
2. **Ilustrações.** Um arquivo por capítulo em `scripts/story-art/` (formato em `assets/exemplo-story-art.js`). Cada cena do roteiro vira uma chave.
3. **Marcação.** Coloque o componente do filme logo depois do hero:
   ```astro
   <Story chapterId="a-primeira-loja" chapter={story['a-primeira-loja']} skipTo="conteudo"
          next={{ href: '/a-expansao/', name: 'A expansão', year: '2000' }} />
   ```
4. **Estilo.** Importe `story.css` na página ou no layout.
5. **Inicialização**, depois que o tema e o ScrollTrigger estiverem prontos:
   ```js
   import { initStory } from './core/story.js';
   import { arts } from './story-art/a-primeira-loja.js';
   initStory({ gsap, ScrollTrigger, reduce, theme }, arts);
   ```
   `theme` é o módulo de tema do capítulo (pode ser `{}`).
6. **Reações do tema.** Implemente `storyCut` e `onStoryScene` no tema (skill `identidade-por-capitulo`).
7. **Prototipe um capítulo** e mostre antes de fazer os outros.

**Sem mapa:** remova a `div.minimap` do componente, não use cenas `map` e exporte `places = {}` e `mapConfig = null`.

**Sem Astro:** o motor só precisa do HTML descrito em `spec/contratos.md` (seção "Marcação do filme"). Gere-o com o template do seu framework.

## Rolagem automática

- Os botões com `[data-play]` (o "Assistir como filme" da abertura e o controle fixo) alternam entre tocar e pausar.
- Velocidade: `SCENE_SECONDS = 9` por cena; cenas `still` duram 1,6×.
- Para com roda, toque, teclas de rolagem, clique e ao sair da seção.
- Os botões ganham `aria-pressed` e `.is-playing`.

## Armadilhas (todas já resolvidas no código de referência)

| Sintoma | Causa | Solução |
|---|---|---|
| O palco não fica preso | `overflow-x: hidden` no `body` | `overflow-x: clip` em `html` e `body` |
| Letterbox, minimapa e controle somem | `transform` num ancestral prende o `fixed` | o motor move esses elementos para o `body` |
| Linhas que se desenham param antes do fim | `vector-effect: non-scaling-stroke` mede o tracejado em pixels de tela | regra em `story.css` desliga o `vector-effect` em elementos com `stroke-dasharray` inline |
| Elementos com profundidade não se mexem | o `transform` CSS da profundidade sobrescreve o atributo `transform` animado | o motor envolve cada camada `.d*` num `<g>` |
| Um controle da página aparece sobre o filme | inline style vence a regra | esconda com `body.story-on … { opacity: 0 !important; visibility: hidden !important }` |
| Mapa com nomes sobrepostos | cidades próximas | `label: [dx, dy, anchor]` em cada lugar |

## Acessibilidade e movimento reduzido

- As legendas são texto real no HTML, legível por leitor de tela.
- "Pular a história" leva direto ao conteúdo seguinte.
- Com `prefers-reduced-motion`: sem câmera, sem profundidade, sem flash de corte, legenda inteira de uma vez e `update(el, 1)`.
- No celular, o minimapa e os pontos de progresso somem e a arte ganha mais espaço.

## Antes de entregar

- [ ] Cada capítulo testado do começo ao fim, com rolagem manual e automática.
- [ ] Legenda nunca coberta por arte, controle ou efeito (390, 820 e 1440 px).
- [ ] Animações por atributo funcionando (nada parado na posição inicial).
- [ ] Movimento reduzido: todas as cenas fazem sentido no estado final.
- [ ] Zero rolagem lateral e zero erros de console.
