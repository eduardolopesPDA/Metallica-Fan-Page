/* =========================================================
   A HISTÓRIA — narração do "filme em sete partes".
   Texto do roteiro aprovado; só fatos confirmados na pesquisa
   ou atribuídos a quem conta. Cada cena: cartela (lugar e data),
   narração (legenda) e a chave da ilustração (art).
   route: trechos do mapa percorridos no capítulo.
   ========================================================= */

export const places = {
  la: { name: 'Los Angeles', lat: 34.05, lon: -118.24 },
  sf: { name: 'San Francisco', lat: 37.9, lon: -122.3 },
  ny: { name: 'Nova York', lat: 40.7, lon: -73.8, label: [8, 22] },
  rochester: { name: 'Rochester', lat: 43.16, lon: -77.61, label: [-10, -8, 'end'] },
  boston: { name: 'Boston', lat: 42.36, lon: -71.06, label: [10, -10] },
  copenhagen: { name: 'Copenhague', lat: 55.68, lon: 12.57 },
  cardiff: { name: 'Cardiff', lat: 51.48, lon: -3.18, label: [-10, 18, 'end'] },
  stockholm: { name: 'Estocolmo', lat: 59.33, lon: 18.07 },
  ljungby: { name: 'Ljungby', lat: 56.83, lon: 13.94, label: [-10, 18, 'end'] },
  london: { name: 'Londres', lat: 51.5, lon: -0.13 },
  vancouver: { name: 'Vancouver', lat: 49.28, lon: -123.12 },
  moscow: { name: 'Moscou', lat: 55.75, lon: 37.62 },
};

export const story = {
  prologo: {
    n: 0, label: 'Prólogo', title: 'Um anúncio de jornal', years: '1981–1983',
    route: [['la', 'sf']],
    scenes: [
      { card: 'Los Angeles, abril de 1981', art: 'classifieds', text: 'Um garoto dinamarquês de 17 anos paga por algumas linhas nos classificados de um jornal. Procura gente para tocar metal pesado.' },
      { card: 'Maio de 1981', art: 'two-silhouettes', text: 'No primeiro ensaio aparece um guitarrista de Downey chamado James Hetfield. Ainda não é uma banda. É um começo.' },
      { card: 'Europa, verão de 1981', art: 'ticket', text: 'Segundo a revista Metal Forces, Lars passa o verão atrás das bandas que ama na Inglaterra. Volta em outubro decidido.' },
      { card: 'Outubro de 1981', art: 'name-list', text: 'Um amigo, Ron Quintana, está escolhendo o nome do seu fanzine. Lars o convence a ficar com “Metal Mania”. O outro nome da lista fica para a banda: Metallica.' },
      { card: 'Anaheim, 14 de março de 1982', art: 'small-stage', text: 'O primeiro show. Cerca de 200 pessoas, quase todas amigas. Na primeira música, uma corda de Dave Mustaine arrebenta. Hetfield, só cantando, espera no palco.' },
      { card: 'Junho e julho de 1982', art: 'tapes', text: 'Primeiro disco: uma música numa coletânea, com o nome da banda impresso errado. Logo depois, uma fita demo começa a ser copiada de mão em mão pelo mundo.' },
      { card: 'Los Angeles, fim de 1982', art: 'map', map: { route: 0 }, text: 'Num clube de Los Angeles, Hetfield e Lars veem um baixista tocar como ninguém. Cliff Burton aceita entrar com uma condição: a banda tem que se mudar para San Francisco.' },
      { card: 'El Cerrito, março de 1983', art: 'garage', text: 'Eles se mudam para uma casa em El Cerrito, com uma garagem para ensaiar. Em 5 de março, Cliff toca o primeiro show com a banda.' },
    ],
    hook: 'Do outro lado do país, numa loja de discos de Nova Jersey, alguém coloca a fita deles para tocar.',
  },

  'kill-em-all': {
    n: 1, label: 'Capítulo 1', title: "Kill 'Em All", years: '1983',
    route: [['sf', 'ny'], ['ny', 'rochester']],
    previously: 'Uma banda formada por um anúncio de jornal ganha um nome emprestado, um baixista que exigiu mudar de cidade e uma fita que corre o mundo. Agora ela vai atravessar o país.',
    scenes: [
      { card: 'Nova Jersey, 1982', art: 'record-store', text: 'Jon e Marsha Zazula têm uma loja de discos. Quando ouvem a fita, decidem apostar tudo: criam uma gravadora e fazem uma segunda hipoteca da casa para lançar o disco.' },
      { card: 'Estrada, março de 1983', art: 'map', map: { route: 0 }, text: 'Com esse dinheiro, alugam um caminhão de mudança só de ida. Dois dirigem. Os outros dormem atrás, entre os amplificadores.' },
      { card: 'Queens, abril de 1983', art: 'corridor', text: 'Em Nova York, descobrem que vão morar numa sala de ensaio, num prédio decadente. A banda Anthrax, vizinha de sala, empresta uma geladeira e um forno elétrico.' },
      { card: 'San Francisco, 1º de abril de 1983', art: 'phone', text: 'Do outro lado do país, o telefone toca na casa de Kirk Hammett, guitarrista do Exodus. É um convite para um teste em Nova York.' },
      { card: 'Nova York, 11 de abril de 1983, 9h', art: 'bus-clock', text: 'Dave Mustaine é acordado e dispensado da banda. Uma hora depois, está num ônibus de volta para a Califórnia. No caminho, começa a escrever as músicas da próxima banda dele.' },
      { card: 'Rochester, 10 de maio de 1983', art: 'studio-tape', text: 'Kirk já está na banda. Em menos de três semanas, com o produtor Paul Curcio, eles gravam dez músicas. Segundo a Metal Hammer, Lars jurava que o estúdio era assombrado.' },
      { card: 'Maio de 1983', art: 'rejected', text: 'O disco ia se chamar “Metal Up Your Ass”. As distribuidoras recusam. Irritado com elas, Cliff sugere outro título, e ele pega: Kill ’Em All.' },
      { card: '25 de julho de 1983', art: 'flyers', text: 'O disco sai. A primeira turnê pelos EUA passa por lugares como Bald Knob, no Arkansas, para plateias que nunca tinham ouvido nada parecido.' },
    ],
    hook: 'No inverno seguinte, em Boston, alguém leva tudo o que eles têm.',
  },

  'ride-the-lightning': {
    n: 2, label: 'Capítulo 2', title: 'Ride the Lightning', years: '1984',
    route: [['ny', 'boston'], ['boston', 'copenhagen']],
    previously: 'A banda atravessou o país num caminhão de mudança, trocou de guitarrista em Nova York e gravou o primeiro disco em três semanas. Ele saiu, mas eles continuam sem nada.',
    scenes: [
      { card: 'Boston, janeiro de 1984', art: 'theft', silence: true, text: 'Numa noite de inverno, roubam o equipamento da banda: a bateria de Lars, o amplificador de Kirk e o Marshall favorito de Hetfield. A turnê só continua porque o Anthrax empresta o deles.' },
      { card: 'Nova Jersey, início de 1984', art: 'sofa', text: 'Sem casa e sem equipamento, Hetfield dorme no sofá de um amigo. Ali, com um violão, ele começa um dedilhado lento. Vira Fade to Black, a primeira balada da banda.' },
      { card: '1983', art: 'book', text: 'Kirk está lendo um romance de Stephen King e anota uma expressão usada para a morte na cadeira elétrica. Mostra a Hetfield. Ela vira o título do disco.' },
      { card: 'Castro Valley', art: 'tv', text: 'Na casa dos pais de Cliff, a banda assiste a Os Dez Mandamentos na TV. A cena da praga dá origem a Creeping Death.' },
      { card: 'Copenhague, 20 de fevereiro de 1984', art: 'map', map: { route: 1 }, text: 'Lars leva a banda para a cidade onde nasceu. No estúdio Sweet Silence está Flemming Rasmussen, o produtor de um disco do Rainbow que ele admira.' },
      { card: 'Sweet Silence, fevereiro e março de 1984', art: 'amps', text: 'Sem dinheiro para hotel, eles dormem num estúdio inacabado no andar de cima e gravam das 19h às 4h. Para substituir o que foi roubado, Rasmussen consegue nove amplificadores emprestados com bandas da cidade.' },
      { card: '27 de julho de 1984', art: 'return', strike: true, text: 'O disco sai. Tem músicas de oito minutos, uma balada e uma instrumental. O thrash ficou maior.' },
      { card: 'Nova York, agosto de 1984', art: 'contract', text: 'Um executivo da Elektra leva colegas a um show da banda. Na manhã seguinte chega a proposta. Em 12 de setembro, eles assinam com uma grande gravadora e ganham novos empresários.' },
    ],
    hook: 'Pela primeira vez, eles têm estrutura para fazer exatamente o disco que imaginam.',
  },

  'master-of-puppets': {
    n: 3, label: 'Capítulo 3', title: 'Master of Puppets', years: '1985–1986',
    route: [['sf', 'copenhagen'], ['copenhagen', 'cardiff'], ['cardiff', 'stockholm'], ['stockholm', 'ljungby']],
    previously: 'Depois de perder o equipamento num roubo, a banda gravou de madrugada em Copenhague, dormindo no estúdio, e saiu de lá com o disco que a levou a uma grande gravadora.',
    scenes: [
      { card: 'El Cerrito, maio de 1985', art: 'garage-strings', text: 'As músicas novas nascem na garagem da casa da banda. São mais longas, cheias de partes, quase sinfônicas.' },
      { card: 'Copenhague, setembro de 1985', art: 'danish', text: 'De volta ao Sweet Silence com Flemming Rasmussen. Desta vez há dinheiro para hotel. No estúdio, Lars e o produtor conversam em dinamarquês, e os outros não entendem nada.' },
      { card: '3 de março de 1986', art: 'chart', text: 'O disco sai sem single, sem clipe e sem tocar no rádio. Mesmo assim, chega ao nº 29 da parada americana e fica lá mais de um ano.' },
      { card: 'Estados Unidos, primavera de 1986', art: 'arena', text: 'Pela primeira vez em arenas, abrindo para Ozzy Osbourne. Na passagem de som, a banda toca Black Sabbath, e Ozzy acha que estão tirando sarro dele.' },
      { card: '26 de julho de 1986', art: 'skate', text: 'Hetfield quebra o pulso andando de skate. Pelo resto da turnê, ele só canta, e o técnico John Marshall assume a guitarra base.' },
      { card: 'Estocolmo, 26 de setembro de 1986', art: 'last-show', text: 'Show na Solnahallen. A noite está tão boa que a banda toca uma música a mais.' },
      { card: 'Suécia, 27 de setembro de 1986', art: 'black', still: true, text: 'Pouco antes das 7h, perto de Ljungby, o ônibus da turnê sai da estrada a caminho de Copenhague. Cliff Burton morre no acidente. Tinha 24 anos.' },
      { card: 'Castro Valley, outubro de 1986', art: 'bass-wall', still: true, text: 'No funeral, segundo relatos, Orion, a música de Cliff, toca nos alto-falantes. Na véspera, Hetfield, Lars e Kirk tinham decidido seguir em frente.' },
    ],
    hook: null,
  },

  'and-justice-for-all': {
    n: 4, label: 'Capítulo 4', title: '...And Justice for All', years: '1986–1989',
    route: [['sf', 'la'], ['la', 'london'], ['copenhagen', 'la']],
    previously: 'Master of Puppets levou a banda às arenas. Na madrugada de 27 de setembro de 1986, na Suécia, Cliff Burton morreu no acidente com o ônibus da turnê. Os três decidiram seguir.',
    scenes: [
      { card: 'San Francisco, outubro de 1986', art: 'queue', text: 'Mais de cinquenta baixistas fazem teste. Jason Newsted, do Flotsam and Jetsam, é o último da fila. Na audição final, diante da família Burton, a mãe de Cliff o abraça e diz que ele é o escolhido.' },
      { card: 'Reseda, 8 de novembro de 1986', art: 'ticket-stamp', text: 'Primeiro show de Jason, sem anúncio, num clube para mil pessoas, abrindo para o Metal Church.' },
      { card: '1986–1988', art: 'hotel-door', text: 'Os primeiros anos são duros para o novato: trotes, contas debitadas no quarto dele, madrugadas acordado à força. Anos depois, Hetfield admitiria que o luto por Cliff virou rancor contra Jason.' },
      { card: 'El Cerrito, 1987', art: 'garage-carpet', text: 'A banda se reencontra numa garagem: a de Lars, que Jason forra com carpete para abafar o som. Dali sai um EP de covers, gravado em poucos dias.' },
      { card: 'Los Angeles, janeiro de 1988', art: 'map', map: { route: 2 }, text: 'O disco novo começa com outro produtor, que sai em três semanas. Flemming Rasmussen atravessa o oceano para terminar o trabalho.' },
      { card: '1988', art: 'fader', text: 'O resultado é o disco mais longo e técnico da banda. Na mixagem, o baixo de Jason quase desaparece. Até hoje, cada um dos envolvidos dá uma explicação diferente.' },
      { card: 'Turnê Damaged Justice, 1988–1989', art: 'scale-fall', text: 'Todas as noites, no fim da faixa-título, uma estátua gigante da Justiça desaba no palco.' },
      { card: 'Long Beach, 7 de dezembro de 1988', art: 'morse', text: 'O primeiro videoclipe da banda, para One, é filmado num armazém. Ele usa cenas de um filme de 1971 sobre um soldado que só consegue se comunicar em código Morse.' },
      { card: 'Los Angeles, 22 de fevereiro de 1989', art: 'envelope-lose', text: 'Na primeira vez que o Grammy premia o metal, a banda toca One ao vivo na cerimônia e perde para o Jethro Tull.' },
    ],
    hook: 'Eles chegaram ao limite desse som. A próxima mudança vai ser a maior de todas.',
  },

  'black-album': {
    n: 5, label: 'Capítulo 5', title: 'Black Album', years: '1990–1991',
    route: [['la', 'vancouver'], ['vancouver', 'la'], ['la', 'moscow']],
    previously: 'Jason entrou com a bênção da mãe de Cliff, a banda gravou o disco mais complexo da carreira, lançou o primeiro clipe e perdeu o Grammy para o Jethro Tull.',
    scenes: [
      { card: 'Los Angeles, fevereiro de 1990', art: 'envelope-win', text: 'Um ano depois da derrota, o Grammy chega: Melhor Performance de Metal, com One.' },
      { card: '1990', art: 'studio-card', text: 'Lars quer um som grave e enorme, como o de um disco do Mötley Crüe produzido por Bob Rock. A banda chama Rock só para mixar. Ele responde que só aceita se for para produzir.' },
      { card: 'Madrugada', art: 'tape-recorder', text: 'De madrugada, no quarto, depois de passar o dia ouvindo Soundgarden, Kirk cria um riff. Lars reorganiza a ordem das partes. Vira Enter Sandman.' },
      { card: 'Na estrada', art: 'violin-arcs', text: 'Longe de casa, Hetfield compõe uma canção para a namorada e no começo nem quer mostrá-la à banda. Vira Nothing Else Matters, com arranjo de orquestra de Michael Kamen.' },
      { card: 'North Hollywood, outubro de 1990 a junho de 1991', art: 'calendar', text: 'Oito meses de estúdio, dezenas de takes por música e muita tensão com o produtor. Três integrantes se divorciam no período. O disco custa perto de um milhão de dólares.' },
      { card: '12 de agosto de 1991', art: 'counter', text: 'O disco preto sai e estreia em primeiro lugar nos Estados Unidos, com quase 600 mil cópias na primeira semana.' },
      { card: 'Moscou, 28 de setembro de 1991', art: 'map', map: { route: 2 }, text: 'Um mês depois de uma tentativa de golpe, um festival gratuito reúne centenas de milhares de pessoas num aeródromo. Há confrontos com a polícia. Quando o Metallica sobe ao palco, a violência diminui.' },
      { card: 'Cinco anos e um dia', art: 'two-dates', text: 'O show de Moscou acontece cinco anos e um dia depois daquela madrugada na Suécia.' },
    ],
    hook: null,
  },

  epilogo: {
    n: 6, label: 'Epílogo', title: 'Dez anos numa linha', years: '1981–1991',
    route: [], allRoads: true, // o mapa mostra a estrada inteira
    previously: 'Cinco anos e um dia depois daquela madrugada na Suécia, o Metallica tocou para centenas de milhares de pessoas em Moscou.',
    scenes: [
      { card: '1981 → 1991', art: 'map-all', text: 'Dez anos separam um anúncio de classificados de um palco em Moscou.' },
      { card: 'Os fios', art: 'threads', text: 'A estrada, a garagem, Copenhague, Cliff, Mustaine e o Grammy: tudo o que aconteceu nesses cinco discos se cruza nessa linha.' },
      { card: 'Depois', art: 'numbers', text: 'O disco preto se torna o primeiro da era de contagem digital a passar 16 milhões de cópias nos EUA e, em 2025, chega a 20 vezes platina.' },
      { card: 'Para Cliff', art: 'cliff', still: true, text: 'Cliff Burton, 1962–1986.' },
    ],
    hook: 'Fim.',
  },
};

export const storyOrder = ['prologo', 'kill-em-all', 'ride-the-lightning', 'master-of-puppets', 'and-justice-for-all', 'black-album'];
