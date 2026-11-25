---
name: identidade-por-capitulo
description: Cria uma identidade visual e de movimento própria para cada capítulo de um site narrativo, a partir de um conceito de uma palavra (cor, tipografia, efeito principal, interação, som, ritmo e reação aos cortes do filme), e implementa como módulos de tema sobre um mesmo esqueleto. Use quando um site tiver várias páginas ou seções que precisam parecer mundos diferentes sem perder a unidade.
---

# Identidade por capítulo

A pergunta desta skill: dá para manter a mesma estrutura em várias páginas e ainda fazer cada uma parecer um mundo diferente? Dá, se cada capítulo tiver **um conceito de uma palavra** que decide todo o resto.

## 1. Escolha a palavra

A palavra resume o capítulo em uma sensação: Cru, Eletricidade, Controle, Ruptura, Escuridão, Expansão, Silêncio, Precisão, Calor. Ela vem do conteúdo: o que mais marcou aquele período, projeto ou produto?

Teste: se você trocar as palavras de dois capítulos e nada parecer errado, elas estão genéricas demais.

## 2. Derive as decisões

A partir da palavra, preencha (no roteiro ou na spec):

| Eixo | Pergunta | Exemplo: "Eletricidade" | Exemplo: "Controle" |
|---|---|---|---|
| Paleta | que cores essa palavra tem? | azul elétrico, branco-gelo, ciano | vermelho-teatro, dourado, creme |
| Tipografia | que letra fala assim? | display com cortes afiados | serifada clássica |
| Efeito principal | o que acontece na tela sozinho? | raios gerados por código, chuva | cordas que seguram os elementos |
| Interação | o que o clique faz? | dispara um raio no ponto | agarrar e puxar uma corda |
| Som (opcional) | que som essa palavra tem? | trovão sintetizado | corda dedilhada |
| Ritmo | como as coisas se movem? | rápido, com estalo | pendular, com peso |
| Reação ao corte | o que pisca na troca de cena? | raio distante | a cortina fecha e abre |
| Seção especial | qual interação só existe aqui? | — | um teatro de marionetes |

Regras de contraste entre capítulos: dois capítulos vizinhos devem diferir em pelo menos três eixos (cor, tipografia e movimento são os mais visíveis). Teste com os olhos semicerrados, numa folha de contato com uma captura de cada capítulo.

**Com marca:** as identidades variam dentro dela. Mantenha o logo, uma família tipográfica de apoio e as regras de espaçamento; varie paleta derivada, título, efeito e ritmo.

## 3. Implemente como tema

Um esqueleto, vários temas. O contrato completo está em `spec/contratos.md` do kit; resumo:

- **CSS** (`styles/themes/<tema>.css`): redefine os tokens em `[data-theme="<tema>"]`: `--bg`, `--ink`, `--ink-strong`, `--muted`, `--accent`, `--line`, `--font-display`, `--font-body`, `--font-mono`. Decoração própria fica aqui também.
- **JS** (`scripts/themes/<tema>.js`): um objeto com ganchos opcionais: `init`, `loader`, `heroTitle`, `afterIntro`, `sound`, `onClick`, `onHoldStart/End`, `onPointerDown/Move/Up`, `onBlockEnter`, `storyCut`, `onStoryScene`.
- **Página**: chama `boot(tema)`; o esqueleto e o motor são os mesmos em todas.

A pasta [assets/](assets/) traz duas peças do projeto de referência que servem a qualquer tema:
- `engine.js`: duas camadas de canvas em tela cheia (fundo e frente), um único loop de `requestAnimationFrame` com "tickers", pausa com a aba oculta, DPR limitado a 2 e um sistema de partículas.
- `audio.js`: áudio sintetizado com Web Audio (ruído, batidas, tons), desligado por padrão, com a preferência salva em `localStorage`. Troque a chave de armazenamento pelo nome do seu projeto.

## 4. Regras de efeitos

- **Proporcionais à tela.** Tamanhos em função de `W`/`H` (ex.: `raio * Math.max(.55, Math.min(1, W / 900))`). Um efeito que fica bom em 1440 px cobre metade de um celular.
- **Durante o filme** (`body.story-on`): menos partículas, efeitos de corte curtos, nada fixo sobre a legenda. Se o fundo for agitado, dê um halo à legenda (`text-shadow` na cor do fundo).
- **Movimento reduzido:** nada de tremor, câmera ou efeito ambiente; o conteúdo continua inteiro.
- **Som:** sempre desligado ao abrir; só toca depois de um gesto e se a pessoa ligar.
- **Aba oculta:** pause os loops.
- **Clique nunca bloqueia leitura:** efeitos de clique somem sozinhos em poucos segundos.

## 5. Reação aos cortes do filme

`storyCut(scene, api)` roda a cada troca de cena (exceto com movimento reduzido). Bons cortes são curtos (até ~1 s visível), ficam nas bordas ou no fundo e combinam com a palavra: rachadura, raio distante, gongo de luz, cortina, carimbo. `onStoryScene(scene, active)` deixa o tema reagir a cenas marcadas: pausar efeitos em `silence`, disparar o efeito forte em `strike`.

## Antes de entregar

- [ ] Cada capítulo reconhecível sem ler o título (folha de contato).
- [ ] Vizinhos diferem em pelo menos 3 eixos.
- [ ] Contraste de texto adequado em todas as paletas.
- [ ] Efeitos proporcionais à tela e aliviados durante o filme.
- [ ] Som desligado por padrão; movimento reduzido respeitado.
- [ ] Com marca: logo e regras da marca preservados.
