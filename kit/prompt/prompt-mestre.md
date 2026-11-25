# Prompt mestre

Cole o bloco abaixo no início de uma conversa com um agente de código (Claude Code ou similar) e preencha os campos `{{ }}`. Ele conduz o projeto inteiro em etapas, parando para aprovação. Os prompts de cada etapa estão em [`prompts-por-etapa.md`](prompts-por-etapa.md); para levantar as respostas com um cliente, use o [`briefing.md`](briefing.md).

---

```text
Quero construir um site narrativo cinematográfico: um site que conta uma história em capítulos, em que cada capítulo tem identidade visual própria e a narrativa aparece como um filme guiado pela rolagem.

PROJETO: {{nome}}
TIPO: {{pessoal | freelance para cliente | institucional | homenagem/fan site | educacional/cultural}}
ASSUNTO: {{do que é a história}}
RECORTE: {{período ou conjunto: ex. "os 30 anos da empresa", "cinco discos de 1983 a 1991", "seis projetos"}}
CAPÍTULOS: {{lista em ordem, ou "proponha"}}
PRÓLOGO / EPÍLOGO: {{o que veio antes / como termina, ou "proponha", ou "sem"}}
PÚBLICO E OBJETIVO: {{quem vê e o que deve sentir, entender ou fazer}}
ORIGEM DO CONTEÚDO: {{pesquisa própria | material do cliente | entrevistas | arquivo pessoal}}
QUEM APROVA O CONTEÚDO: {{eu | o cliente | uma equipe}}
IMAGENS: {{só desenho original em código | material da marca/cliente | fotos licenciadas}}
IDIOMA: {{…}}
STACK: {{Astro + GSAP (padrão) | outra}}
HOSPEDAGEM: {{Vercel | Netlify | servidor do cliente | decidir depois}}

Use o kit:
- spec/SPEC-modelo.md: preencha uma cópia como spec deste projeto (spec/exemplos.md mostra casos parecidos);
- spec/contratos.md: o formato dos dados, dos temas e do motor;
- skills, na ordem: pesquisa-e-conteudo → roteiro-cinematografico → identidade-por-capitulo → motor-de-cenas → revisao-visual → entrega-e-publicacao.

Regras que valem o tempo todo:
1. Primeiro o conteúdo e as fontes, depois o roteiro, e só então o código. Nada de código da história antes de eu aprovar conteúdo e roteiro.
2. Nada inventado: nenhuma fala inventada, números com data e origem, cada informação com fonte ou com a aprovação de quem responde pelo conteúdo.
3. Respeite os direitos de imagem e texto do tipo de projeto (em homenagem ou fan site: só visual original e aviso de não oficial).
4. Som, se houver, desligado por padrão. Movimento reduzido sempre respeitado.
5. Ao fim de cada etapa, me mostre o que foi feito e como, com capturas de tela, e espere meu ok.
6. Nunca faça commit, push ou deploy sem minha aprovação explícita para aquela mudança. "Pode seguir" não aprova commit.
7. Antes de publicar, confira se o projeto já existe na hospedagem e se está ligado ao repositório, em vez de criar outro.

Comece pela etapa 0: preencha a spec com o que dei, proponha padrões para o que faltar e me devolva no máximo 5 perguntas que mudam o projeto.
```

---

## Dicas

- **De 3 a 7 capítulos.** Menos que isso não dá filme; mais que isso, cada capítulo fica raso.
- **O recorte dá unidade.** Uma fase, uma década, uma linha de produtos. "A história toda" quase nunca funciona.
- **Freelance:** combine com o cliente, antes de começar, quem aprova cada etapa e quantas rodadas de ajuste estão incluídas. O agente vai parar nesses pontos.
- **Pouco conteúdo?** Use a estrutura de página única (spec, seção 3) e menos cenas por capítulo.
