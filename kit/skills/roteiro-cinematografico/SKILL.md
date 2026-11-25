---
name: roteiro-cinematografico
description: Transforma um documento de conteúdo aprovado em roteiro de um filme guiado pela rolagem, com prólogo, capítulos conectados por "anteriormente" e gancho, cenas com cartela, narração curta e ideia de ilustração, e epílogo. Use depois da pesquisa e antes do código, em sites narrativos de qualquer assunto (banda, empresa, pessoa, produto, lugar, portfólio).
---

# Roteiro cinematográfico

O roteiro é a ponte entre os fatos e o código. Ele decide o que entra, em que ordem e com que imagem. Escreva tudo antes de abrir o editor de código, e só use informações aprovadas no documento de conteúdo.

## Estrutura

```
Prólogo (opcional)  →  Capítulo 1  →  …  →  Capítulo N  →  Epílogo (opcional)
```

Cada capítulo:
1. **Abertura**: rótulo ("Capítulo 2 · 2001–2010"), título, **anteriormente** (1 a 3 frases que retomam o fim do capítulo anterior).
2. **De 6 a 10 cenas.**
3. **Gancho**: uma frase que abre o próximo capítulo sem contá-lo. O último capítulo antes do epílogo pode ter gancho silencioso (só o ano ou a palavra "Epílogo").

Modelo em [references/modelo-roteiro.md](references/modelo-roteiro.md).

## A cena

| Parte | Regra |
|---|---|
| Cartela | lugar e data ("Boston, janeiro de 1984"), ou outro marcador curto ("Madrugada", "Na estrada"). Máximo de 40 caracteres. |
| Narração | 1 a 3 frases, cerca de 20 a 45 palavras. Ela aparece palavra por palavra, então frases curtas e concretas funcionam melhor. |
| Ilustração | **um objeto que conta o acontecimento** (ver abaixo). |
| Tipo especial | `still`, `silence`, `strike` ou `map`, quando fizer sentido. |
| Origem | de qual informação do documento de conteúdo a cena vem. |

## Ilustração: o objeto que conta

Cada cena tem uma imagem simples que resume o acontecimento por um objeto, não por um retrato. Isso evita rostos e fotos, funciona em traço e é mais memorável.

| Acontecimento | Objeto |
|---|---|
| um roubo | um caminhão de porta aberta, vazio, com contornos tracejados onde estavam as coisas |
| um convite | um telefone tocando, com o fio indo até o nome de uma cidade |
| uma recusa | um cartaz carimbado "RECUSADO" |
| um contrato | um papel com a assinatura se desenhando |
| um sucesso | um contador subindo, um gráfico que sobe |
| uma decisão a dois | duas silhuetas e um objeto entre elas |
| uma viagem | o mapa de rota com o trecho se desenhando |
| um prêmio | um envelope que abre e mostra um nome |
| um fim | um objeto sozinho sob um foco de luz |

Regras: no máximo 3 elementos principais por cena; silhuetas genéricas para pessoas; nada de capas, logos ou fotos se o projeto for uma homenagem.

## Tipos especiais

- **`still`**: tela preta, só a frase. Para perdas, mortes, viradas sérias. Use pouco (uma ou duas vezes no filme inteiro).
- **`silence`**: os efeitos do tema param. Para o momento antes de algo grande, ou um luto.
- **`strike`**: o efeito mais forte do tema. Para o clímax do capítulo.
- **`map`**: uma viagem ou mudança de lugar. Os trechos se acumulam de capítulo em capítulo.

## Voz

- **Terceira pessoa** por padrão. Primeira pessoa só em projeto pessoal ou de marca, e consistente no filme inteiro.
- **Presente narrativo** ("Eles se mudam para…") dá ritmo de filme.
- **Nenhuma fala inventada.** Falas entre aspas só com autor e origem; prefira discurso indireto ("Segundo a revista X, Lars jurava que…").
- **Informação de uma fonte só** entra atribuída ("segundo…", "segundo relatos").
- Nada de adjetivos de propaganda ("lendário", "icônico"). Os fatos fazem o trabalho.

## Conexão entre capítulos

- O **anteriormente** de um capítulo retoma o gancho do anterior.
- Pelo menos 3 **fios** do documento de conteúdo reaparecem em capítulos diferentes.
- O **epílogo** retoma tudo: o mapa com a estrada inteira, uma linha do tempo com os fios, os números do legado, uma homenagem se houver, "Fim."

## Ritmo

- Alterne cenas de lugar, de objeto e de número. Três cenas de documento seguidas cansam.
- Uma cena forte (`strike` ou `still`) por capítulo, no máximo.
- Comece o capítulo perto da ação, não no contexto.
- Termine a cena numa informação, não num adjetivo.

## Reações do tema

Para cada capítulo, escreva também:
- **reação ao corte**: o que acontece na tela a cada troca de cena (uma rachadura, um raio distante, uma cortina, um pulso de luz). Deve ser curta e não cobrir a legenda;
- **como o tema trata `silence` e `strike`** naquele capítulo.

## Antes de entregar

- [ ] Toda cena aponta para uma informação aprovada.
- [ ] Nenhuma fala inventada; tudo de fonte única atribuído.
- [ ] Cada capítulo tem anteriormente e gancho que se encaixam.
- [ ] Pelo menos 3 fios atravessam capítulos.
- [ ] Narrações dentro do tamanho; cartelas curtas.
- [ ] Cada ilustração é um objeto concreto, com no máximo 3 elementos.

Entregue num documento editável e peça aprovação explícita antes do código.
