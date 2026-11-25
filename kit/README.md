# Kit — Site narrativo cinematográfico

Um kit para construir sites que contam uma história em capítulos, em que cada capítulo tem identidade visual própria e a narrativa aparece como um filme guiado pela rolagem. Serve para projeto pessoal, trabalho freelance, site institucional, homenagem ou projeto cultural: a história de uma banda, os anos de uma empresa, um portfólio, uma biografia, um lançamento, a história de um lugar.

## Por que existe

O kit nasceu de um projeto real: um fan site sobre cinco discos de uma banda, com uma página por disco e um filme que conecta as histórias entre eles. No caminho, ficou claro que o valor estava menos no assunto e mais no método, que funciona para qualquer história que se divida em capítulos:

1. **Primeiro o conteúdo, depois o roteiro, e só então o código.** Cada etapa é aprovada antes da próxima.
2. **Um conceito de uma palavra por capítulo**, que decide cor, tipografia, efeito, som e ritmo. Mesma estrutura, mundos diferentes.
3. **Uma história que conecta**: cada capítulo começa com um "anteriormente" e termina num gancho.
4. **Confiança**: cada informação tem status e fonte, nada é inventado, e os direitos de imagem são respeitados.
5. **Cuidado com quem vê**: som desligado por padrão, movimento reduzido respeitado, legenda sempre legível no celular.

O kit reúne o método, os modelos de texto e o código de referência para que outras pessoas não precisem redescobrir tudo, nem cair nas mesmas armadilhas técnicas.

## O que tem aqui

### `spec/`
- **SPEC-modelo.md**: modelo de especificação para preencher em cada projeto (objetivo, capítulos, mapa do site, filme, identidade, conteúdo, direitos, requisitos, processo, critérios de aceite).
- **exemplos.md**: o mesmo formato aplicado a seis projetos diferentes, da discografia ao aniversário de empresa.
- **contratos.md**: o formato dos dados, o contrato dos temas, a API do motor e as armadilhas técnicas conhecidas.

### `prompt/`
- **prompt-mestre.md**: o prompt que inicia o projeto com um agente de código e define as regras do processo.
- **prompts-por-etapa.md**: um prompt para cada etapa e prompts de ajuste.
- **briefing.md**: as perguntas para levantar com o cliente, a equipe ou você mesmo antes de começar.

### `skills/`
Seis skills, uma por etapa do processo:

| Skill | Etapa |
|---|---|
| `pesquisa-e-conteudo` | levantar e organizar os fatos, com status e fontes (pesquisa própria ou material do cliente) |
| `roteiro-cinematografico` | transformar o conteúdo em capítulos e cenas conectados |
| `identidade-por-capitulo` | criar o conceito e o tema de cada capítulo; inclui motor de canvas e áudio de referência |
| `motor-de-cenas` | implementar o filme guiado pela rolagem; inclui o motor, o componente, o CSS, o mapa de rota e exemplos |
| `revisao-visual` | revisar todas as cenas em celular, tablet, desktop e movimento reduzido; inclui o script de folhas de contato |
| `entrega-e-publicacao` | commits aprovados, verificação da hospedagem, README e entrega ao cliente |

## Como as peças se encaixam

```
briefing ─► spec preenchida ─► pesquisa-e-conteudo ─► roteiro-cinematografico
                                                            │
     entrega-e-publicacao ◄── revisao-visual ◄── motor-de-cenas ◄── identidade-por-capitulo
```

O prompt mestre conduz essa sequência e para em cada aprovação.

## Limites

O código de referência foi escrito para Astro com GSAP e ScrollTrigger, mas o motor só depende do HTML descrito nos contratos e pode ser levado para outros frameworks. O mapa de rota usa contornos desenhados à mão; para outra região, é preciso desenhar os contornos e ajustar o recorte. O kit não substitui revisão jurídica sobre direitos de imagem e marcas em projetos comerciais.
