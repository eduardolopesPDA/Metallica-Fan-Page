---
name: revisao-visual
description: Revisa um site animado e narrativo em celular, tablet, desktop e movimento reduzido, capturando cada cena do filme em folhas de contato e checando rolagem lateral, erros de console, legenda coberta, efeitos exagerados e animações paradas. Use ao fim de cada etapa visual e antes de entregar ou publicar um site com scrollytelling, canvas ou muitas animações.
---

# Revisão visual

Sites animados quebram de jeitos que não aparecem numa captura só: uma cena no meio do filme, um efeito que acumula, um tamanho de tela que ninguém abriu. Esta revisão olha **todas as cenas, em todas as larguras**, e junta tudo em folhas de contato para dar para ver de uma vez.

## Matriz mínima

| Largura | Movimento | Por quê |
|---|---|---|
| 390 × 844 (celular) | normal | onde os efeitos ficam grandes demais e a legenda aperta |
| 820 × 1180 (tablet) | normal | onde layouts de duas colunas quebram |
| 1440 × 900 (desktop) | normal | onde a arte é ampliada (e traços animados podem parar antes do fim) |
| 1440 × 900 | reduzido | onde o conteúdo precisa estar inteiro sem animação |

## Ferramenta

[`assets/folhas-de-contato.cjs`](assets/folhas-de-contato.cjs) abre cada página com Puppeteer, rola até 62% de cada cena (legenda já visível, animação no meio), captura a tela e monta uma folha de contato por página. Também imprime um relatório:
- rolagem lateral em px;
- erros de console;
- legenda × controle, legenda × pontos de progresso, cartela × minimapa;
- legenda fora da tela;
- arte invadindo a legenda (pela caixa do desenho).

Configuração por variáveis de ambiente: `BASE_URL`, `PAGES` (caminhos separados por `|`), `BROWSER` (Chrome/Edge para `puppeteer-core`), `OUT`. Argumentos: `mobile | tablet | desktop` e, opcionalmente, `reduce`.

O relatório automático encontra sobreposições, mas **não substitui olhar as folhas**. Abra cada uma.

## O que procurar nas folhas

| Problema | Como aparece | Causa comum |
|---|---|---|
| Animação parada | elemento sempre na posição inicial em todas as larguras, mas certo com movimento reduzido | `transform` CSS sobrescrevendo atributo `transform` do SVG |
| Traço incompleto | linhas que "se desenham" param antes do fim só no desktop | `vector-effect: non-scaling-stroke` com `stroke-dasharray` |
| Efeito gigante no celular | rachaduras, partículas ou manchas cobrindo meia tela | tamanhos fixos em px |
| Efeito sobre a legenda | texto difícil de ler sobre partículas | efeitos na camada da frente durante o filme |
| Resto de efeito anterior | mancha ou partícula do hero aparecendo na abertura do filme | efeitos com vida longa; apague-os rápido com `story-on` |
| Arte cortada | desenho saindo pela lateral no celular | elementos perto da borda do viewBox + câmera panorâmica |
| Paleta errada | seção com cores de outro capítulo no carregamento | pintura de cores rodando antes da hora |
| Cena vazia | nada aparece | chave `art` sem ilustração correspondente |

## Processo

1. Gere o build de produção e sirva localmente (o preview do framework).
2. Rode as quatro linhas da matriz.
3. Abra as folhas e anote cada problema com página, cena e largura.
4. Corrija pela causa, não pela cena: se uma regra quebra uma cena, provavelmente quebra outras.
5. Rode de novo só as páginas afetadas e compare antes e depois.
6. Teste também a **rolagem automática** em pelo menos uma página por largura: ela anda (~1 cena a cada 9 s) e para com um gesto.
7. Confira as páginas sem filme (fontes, créditos, contato) em celular e desktop.

## Relato

Ao terminar, mostre à pessoa:
- a matriz rodada e o resultado do relatório;
- cada problema encontrado, a causa e a correção;
- 2 a 4 capturas ou folhas de contato representativas (de preferência antes e depois);
- o que ficou de fora e por quê.

## Antes de entregar

- [ ] Quatro linhas da matriz rodadas, todas as páginas.
- [ ] Zero rolagem lateral, zero erros de console.
- [ ] Nenhuma legenda coberta ou fora da tela.
- [ ] Nenhuma animação parada; traços completos no desktop.
- [ ] Movimento reduzido legível em todas as cenas.
- [ ] Rolagem automática anda e para.
