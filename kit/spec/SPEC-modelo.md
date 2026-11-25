# Spec modelo — Site narrativo cinematográfico

Modelo de especificação para sites que contam uma história em capítulos, com cada capítulo com identidade visual própria e a narrativa apresentada como um filme guiado pela rolagem.

Serve para projeto pessoal, trabalho freelance, site institucional, homenagem ou projeto cultural. Copie este arquivo para o seu projeto, preencha os campos `{{ }}` e apague as orientações em itálico quando terminar. Exemplos de como o mesmo formato vira projetos diferentes estão em [`exemplos.md`](exemplos.md), e os contratos técnicos em [`contratos.md`](contratos.md).

---

## 1. O projeto

| Campo | Preencha |
|---|---|
| Nome | {{nome do projeto}} |
| Tipo | {{pessoal / freelance para cliente / institucional / homenagem ou fan site / educacional ou cultural}} |
| Assunto | {{do que é a história: uma banda, uma empresa, uma pessoa, um produto, uma cidade, um portfólio…}} |
| Recorte | {{o período ou o conjunto contado: ex. "1983–1991", "os 30 anos da empresa", "seis projetos de 2020 a 2025"}} |
| Público | {{quem vai ver e o que procura}} |
| Objetivo | {{o que a pessoa deve sentir, entender ou fazer ao sair}} |
| Idioma(s) | {{pt-BR, en…}} |
| Responsável pelo conteúdo | {{quem aprova textos e fatos: você, o cliente, uma equipe}} |
| Prazo e marcos | {{datas de aprovação e entrega}} |

_Escreva o objetivo em uma frase. Se não couber numa frase, o recorte está grande demais._

## 2. A ideia em três camadas

Todo site deste formato tem três camadas. Defina cada uma antes de qualquer tela.

1. **Capítulos com identidade.** O conteúdo se divide em {{3 a 7}} capítulos (discos, fases, projetos, produtos, décadas…). Cada capítulo ganha **um conceito de uma palavra** que decide cor, tipografia, efeito principal, interação, som e ritmo. Mesma estrutura, mundos diferentes.
2. **Uma história que conecta.** Um filme guiado pela rolagem atravessa os capítulos: cada um começa com um "anteriormente" e termina num gancho para o próximo. Opcionalmente, um prólogo (o que veio antes) e um epílogo (como termina e o que ficou).
3. **Confiança.** Tudo o que é afirmado vem de uma fonte ou foi aprovado por quem responde pelo conteúdo.

| Capítulo | Período / item | Conceito (1 palavra) | Por que essa palavra |
|---|---|---|---|
| {{1}} | {{…}} | {{…}} | {{…}} |
| {{2}} | {{…}} | {{…}} | {{…}} |

## 3. Mapa do site

_Escolha a estrutura. A padrão funciona para a maioria dos casos._

**Estrutura A — páginas por capítulo (padrão):**
```
/                 Hub: abertura + prólogo + navegação entre capítulos
/<capitulo>/      Uma página por capítulo: hero, filme, conteúdo próprio
/epilogo/         Fim do filme + créditos (opcional)
/fontes/          Fontes e como cada informação foi tratada (recomendado)
```

**Estrutura B — página única:** todos os capítulos numa só página, cada um como uma seção longa com sua identidade. Melhor para landing pages, campanhas e projetos com pouco conteúdo por capítulo.

Estrutura escolhida: {{A / B / outra}}

### 3.1 Hub
- Abertura curta com um objeto-símbolo do assunto ({{ex.: toca-discos, maquete, linha de produção, câmera}}).
- Prólogo do filme, se houver.
- Navegação entre capítulos: {{linha do tempo horizontal / mapa / grade / lista}}. Se for linha do tempo, o fundo pode interpolar entre as cores dos capítulos conforme a rolagem.

### 3.2 Página de capítulo
Esqueleto comum (adapte os blocos do meio ao assunto):
1. Loader temático (opcional)
2. Hero: título, subtítulo, metadados
3. **O filme** (capítulo da história)
4. Blocos de conteúdo do capítulo: {{ex.: integrantes, equipe, obras, produtos, números, depoimentos}}
5. Seção especial interativa do capítulo: {{uma ideia por capítulo}}
6. Rodapé: anterior / hub / próximo, e link para as fontes

### 3.3 Epílogo (opcional)
Capítulo final do filme (o caminho inteiro, os fios que ligam os capítulos, o legado) e créditos que sobem: quem fez, quem participou, dedicatória, avisos.

### 3.4 Fontes (recomendado sempre que houver fatos)
Explica os status das informações e lista as fontes agrupadas.

## 4. O filme

### 4.1 Narrativa
- Prólogo: {{sim / não}}. Epílogo: {{sim / não}}.
- Cada capítulo: abertura (rótulo, título, "anteriormente", "Assistir como filme", "Pular") → {{6 a 10}} cenas → gancho.
- Cada cena: **cartela** (lugar e data, ou outro marcador), **narração** de 1 a 3 frases e **ilustração**.
- Voz da narração: {{terceira pessoa (padrão) / primeira pessoa, em projeto pessoal ou de marca}}.
- Cenas especiais disponíveis: `still` (tela preta, só texto), `silence` (efeitos pausam), `strike` (efeito forte), `map` (mapa de rota).

### 4.2 Linguagem visual
- Palco preso na tela com as cenas fundindo umas nas outras.
- Câmera por cena (aproximação, panorâmicas, afastamento) e camadas de profundidade.
- Cartela datilografada, legenda palavra por palavra, letterbox, pontos de progresso.
- Corte entre cenas com reação do tema do capítulo.
- Mapa de rota opcional, que acumula os caminhos de capítulo em capítulo: {{sim / não}}.

### 4.3 Rolagem automática
Botão "Assistir como filme" e controle fixo. Cerca de 9 s por cena. Para com qualquer gesto e ao sair da seção.

### 4.4 Ilustrações
- Tipo: {{SVG desenhado em código (padrão) / ilustrações da marca / fotos licenciadas / mistura}}.
- _Em homenagens e fan sites, use só material original (seção 7). Em projetos de cliente, use o que o cliente tem direito de usar._

## 5. Identidade por capítulo

Para cada capítulo, preencha antes de codar (a skill `identidade-por-capitulo` ajuda):

| Campo | Capítulo {{1}} | Capítulo {{2}} |
|---|---|---|
| Conceito | | |
| Paleta (3 a 5 cores) | | |
| Tipografia de título | | |
| Efeito principal | | |
| Interação (clique, arrastar, segurar) | | |
| Som (opcional) | | |
| Ritmo das animações | | |
| Reação ao corte do filme | | |
| Seção especial | | |

_Se o projeto tem uma marca, as identidades de capítulo variam dentro dela: mesma família tipográfica, paletas derivadas, mesmo logo._

## 6. Conteúdo e fontes

**Origem do conteúdo:** {{pesquisa própria / material do cliente / entrevistas / arquivo pessoal / mistura}}.

Cada informação factual recebe um status:

| Status | Critério | Uso |
|---|---|---|
| Confirmado | 2+ fontes confiáveis e independentes, ou documento oficial | entra como fato |
| Uma fonte / aprovado pelo responsável | só uma fonte, ou informação dada pelo próprio cliente | entra atribuída ("segundo…") ou com a aprovação registrada |
| Versões diferentes | fontes divergem | entra só o que é comum |
| Não confirmado | sem fonte sólida | fica de fora |

Regras:
- Nenhuma fala entre aspas sem autor e origem. Nenhuma fala inventada.
- Números sempre com data e quem mediu.
- Em projeto de cliente, o cliente aprova o texto final por escrito (e-mail, documento comentado).

## 7. Direitos e limites

| Tipo de projeto | Imagens e marcas | Textos de terceiros |
|---|---|---|
| Homenagem / fan site | só material original; nenhuma capa, foto, logo ou marca reproduzida; aviso de "não oficial" | nenhuma letra ou trecho longo; citações curtas com fonte |
| Cliente / institucional | material do cliente ou licenciado, com a origem registrada | conforme contrato |
| Pessoal | material próprio ou licenciado | citações curtas com fonte |

Restrições específicas deste projeto: {{…}}

## 8. Requisitos técnicos

- Stack: {{Astro + GSAP com ScrollTrigger (referência) / Next.js / Vite / outra}}.
- Conteúdo em arquivos de dados ou CMS, nunca espalhado pelo HTML: {{arquivos JS/JSON / CMS: qual}}.
- Efeitos em canvas com um único loop de animação, pausa com a aba oculta, DPR limitado.
- Som (se houver) sintetizado ou em arquivos leves, **sempre desligado por padrão**, com a preferência salva.
- `prefers-reduced-motion`: todo o conteúdo acessível, sem câmera nem efeitos de corte.
- Sem rolagem lateral de 320 px a 1920 px.
- Acessibilidade: HTML semântico, foco visível, legendas no HTML (legíveis por leitor de tela), contraste da legenda sobre efeitos.
- Desempenho: {{metas, ex.: LCP < 2,5 s no 4G}}.
- Hospedagem: {{Vercel / Netlify / servidor do cliente}}. Domínio: {{…}}.
- Medição: {{nenhuma / analytics do cliente}}.

As armadilhas técnicas conhecidas e o contrato do motor estão em [`contratos.md`](contratos.md).

## 9. Processo e aprovações

| Etapa | Entrega | Aprovação |
|---|---|---|
| 0. Briefing | esta spec preenchida | responsável pelo conteúdo |
| 1. Conteúdo | documento de fatos com status e fontes, ou conteúdo do cliente organizado | **explícita** |
| 2. Roteiro | capítulos e cenas por escrito | **explícita** |
| 3. Identidade | tabela de conceitos + uma página modelo | **explícita** |
| 4. Base | hub, páginas de capítulo, dados | revisão com capturas |
| 5. Filme | motor + capítulos + reações dos temas | revisão com capturas |
| 6. Fechamento | epílogo, fontes, créditos | revisão com capturas |
| 7. Revisão | celular, tablet, desktop, movimento reduzido | relatório |
| 8. Entrega | commit, publicação, handoff | **explícita a cada commit, push e deploy** |

_Em trabalho freelance, alinhe com o cliente quantas rodadas de ajuste cada etapa inclui._

## 10. Critérios de aceite

- [ ] Cada capítulo é reconhecível sem ler o título.
- [ ] A história pode ser seguida do começo ao fim, e cada capítulo começa onde o anterior terminou.
- [ ] Nenhuma informação sem status ou aprovação; nada "não confirmado" no site.
- [ ] Direitos de imagem e texto respeitados conforme a seção 7.
- [ ] Som desligado ao abrir (se houver som).
- [ ] Rolagem automática roda e para com qualquer gesto.
- [ ] Zero rolagem lateral e zero erros de console em 390, 820 e 1440 px.
- [ ] Nenhuma legenda coberta por arte, controle ou efeito.
- [ ] Movimento reduzido: todas as cenas prontas e legíveis.
- [ ] {{critérios específicos do projeto ou do contrato}}
