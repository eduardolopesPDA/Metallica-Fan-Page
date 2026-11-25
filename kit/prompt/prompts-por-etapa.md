# Prompts por etapa

Para conduzir o projeto passo a passo. Funcionam depois do [prompt mestre](prompt-mestre.md) ou sozinhos, desde que o agente tenha acesso à spec e às skills do kit. Troque `{{ }}` pelos dados do projeto.

---

## Etapa 0 — Briefing

```text
Etapa 0: briefing. Com base no que sei do projeto ({{resumo}}), preencha uma cópia de spec/SPEC-modelo.md em spec/SPEC.md. Para cada campo vazio, proponha um padrão e marque como "proposta". No fim, liste no máximo 5 perguntas que mudam o projeto.
```

## Etapa 1 — Conteúdo

**Com pesquisa própria:**
```text
Etapa 1: conteúdo. Use a skill pesquisa-e-conteudo.
Pesquise {{assunto e recorte}} em fontes independentes e monte o documento de conteúdo: um bloco por capítulo (mais prólogo e epílogo), cada fato com data, lugar, status e fontes; uma seção de correções dos dados que já existem; de 4 a 6 "fios" que atravessam capítulos; e a lista de fontes agrupada. Diga quais sites bloquearam o acesso. Sem roteiro e sem código.
```

**Com material do cliente:**
```text
Etapa 1: conteúdo. Use a skill pesquisa-e-conteudo.
Organize o material em {{pasta/arquivos}} no documento de conteúdo: um bloco por capítulo, cada informação com sua origem (documento, entrevista, pessoa). Marque o que precisa de confirmação do cliente e o que falta. Monte uma lista de perguntas para o cliente. Sem roteiro e sem código.
```

## Etapa 2 — Roteiro

```text
O conteúdo está aprovado. Etapa 2: roteiro. Use a skill roteiro-cinematografico.
Escreva o filme: prólogo, um capítulo por {{unidade}} e epílogo. Para cada capítulo: rótulo, título, período, "anteriormente", de 6 a 10 cenas (cartela, narração de 1 a 3 frases, ideia da ilustração, tipo especial se houver) e o gancho. Indique de qual informação do documento de conteúdo vem cada cena. Sem código.
```

## Etapa 3 — Identidade

```text
O roteiro está aprovado. Etapa 3: identidade. Use a skill identidade-por-capitulo.
Proponha o conceito de cada capítulo numa tabela (palavra, paleta, tipografia, efeito principal, interação, som, ritmo, reação ao corte, seção especial). {{Se houver marca: as identidades devem variar dentro da marca.}} Depois que eu aprovar, monte uma página de capítulo completa como modelo e me mostre.
```

## Etapa 4 — Base do site

```text
Etapa 4: base. Monte o hub ({{linha do tempo / mapa / grade}}), o layout comum das páginas de capítulo, os dados em data/chapters.js e os temas de todos os capítulos. Mostre capturas de cada página.
```

## Etapa 5 — O filme

```text
Etapa 5: o filme. Use a skill motor-de-cenas.
Implemente o motor de cenas, o componente do filme{{, o mapa de rota}} e os capítulos do roteiro aprovado. Ligue as reações de cada tema aos cortes e inclua a rolagem automática. Faça primeiro um capítulo protótipo e me mostre antes dos outros.
```

## Etapa 6 — Fechamento

```text
Etapa 6: fechamento. Monte o epílogo (capítulo final + créditos que sobem) e a página de fontes (status explicados + fontes agrupadas). O último capítulo leva ao epílogo, e todas as páginas ganham o link para as fontes no rodapé.
```

## Etapa 7 — Revisão

```text
Etapa 7: revisão. Use a skill revisao-visual.
Capture todas as cenas de todas as páginas em 390 px, 820 px e 1440 px com movimento reduzido. Procure rolagem lateral, erros de console, legenda coberta e animações paradas. Monte folhas de contato, corrija e me mostre o antes e depois.
```

## Etapa 8 — Entrega

```text
Etapa 8: entrega. Use a skill entrega-e-publicacao.
Proponha os commits (mensagem e arquivos) e espere minha aprovação. Antes de publicar, confira se o projeto já existe na hospedagem. {{Se for cliente: prepare o material de handoff.}}
```

---

## Prompts de ajuste

```text
As animações de {{página}} estão fracas. Proponha 3 melhorias concretas de ritmo, câmera ou ilustração antes de mudar.
```

```text
A cena {{n}} de {{capítulo}} está poluída. Simplifique a ilustração mantendo a ideia e garanta a legenda legível.
```

```text
Confira esta informação antes de manter: "{{frase}}". Diga o status e a origem; se não for confirmada, atribua ou tire.
```

```text
Adicione rolagem automática ao filme: um botão "Assistir como filme" e um controle fixo, que param com qualquer gesto.
```
