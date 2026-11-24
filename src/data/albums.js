/* =========================================================
   Conteúdo de cada álbum. Um objeto por disco: metadados,
   formação (textos, fatos, instrumento) e faixas.
   Fatos escritos de memória — revisar com fontes antes de publicar.
   ========================================================= */

const JAMES = { id: 'james', first: 'James', last: 'Hetfield', born: '03.08.1963', from: 'Downey, Califórnia', since: 'Cofundador, 1981' };
const LARS = { id: 'lars', first: 'Lars', last: 'Ulrich', born: '26.12.1963', from: 'Gentofte, Dinamarca', since: 'Cofundador, 1981' };
const KIRK = { id: 'kirk', first: 'Kirk', last: 'Hammett', born: '18.11.1962', from: 'San Francisco, Califórnia', since: 'Desde abril de 1983' };
const CLIFF = { id: 'cliff', first: 'Cliff', last: 'Burton', born: '10.02.1962', from: 'Castro Valley, Califórnia', since: 'De 1982 a 1986' };
const JASON = { id: 'jason', first: 'Jason', last: 'Newsted', born: '04.03.1963', from: 'Battle Creek, Michigan', since: 'De 1986 a 2001' };

const m = (base, extra) => ({ ...base, ...extra });

export const LEGEND = 'JH James Hetfield · LU Lars Ulrich · KH Kirk Hammett · CB Cliff Burton · JN Jason Newsted · DM Dave Mustaine';

export const albums = {
  'kill-em-all': {
    slug: 'kill-em-all', n: 1, year: 1983, theme: 'kea', concept: 'Cru',
    title: ["Kill 'Em", 'All'], name: "Kill 'Em All",
    eyebrow: ['Metallica', '1983', '1º álbum'],
    sub: 'Dez faixas cruas, rápidas e sem polimento. A estreia que ajudou a acender o thrash metal.',
    meta: [['Lançamento', '25.07.1983'], ['Gravadora', 'Megaforce'], ['Estúdio', 'Music America · EUA']],
    meter: { label: 'BPM', max: 220 },
    members: [
      m(JAMES, {
        role: 'Vocal & guitarra base', credits: 9, highlight: 'Seek & Destroy',
        lead: 'Aos 19 anos, Hetfield já tinha a mão direita que definiria o thrash: palhetadas para baixo, rápidas e precisas, em riffs que soam como uma britadeira.',
        text: 'Ele assina 9 das 10 faixas e canta com a fúria de quem ainda tocava em bares e garagens. <b>Seek & Destroy</b> virou hino de estrada logo de cara.',
        instrument: { type: 'v', finish: 'black' },
      }),
      m(LARS, {
        role: 'Bateria', credits: 8, highlight: 'Whiplash',
        lead: 'O dinamarquês que começou tudo com um anúncio em jornal. Em 1983, a bateria dele era pura urgência: mais velocidade do que técnica.',
        text: 'Lars ajudou a escrever 8 das 10 faixas. <b>Whiplash</b>, uma homenagem a quem bate cabeça na frente do palco, mostra a pressa da banda em tocar cada vez mais rápido.',
        instrument: { type: 'drums', finish: 'red', mark: '1983' },
      }),
      m(KIRK, {
        role: 'Guitarra solo', credits: 0, highlight: 'The Four Horsemen',
        lead: 'Kirk entrou em abril de 1983, vindo do Exodus, poucas semanas antes da gravação. Aprendeu o repertório às pressas e gravou os solos de um disco que não ajudou a compor.',
        text: 'Por isso o medidor dele marca zero aqui. Mesmo assim, os solos de <b>The Four Horsemen</b> e <b>Phantom Lord</b> já mostram a velocidade e o vibrato que viraram sua marca.',
        instrument: { type: 'v', finish: 'black' },
        stamp: 'Recém-chegado',
      }),
      m(CLIFF, {
        role: 'Baixo', credits: 1, highlight: '(Anesthesia) – Pulling Teeth', since: 'Desde o fim de 1982',
        lead: 'Recém-chegado de San Francisco, Cliff trouxe formação clássica e um baixo tocado como guitarra solo, com distorção e wah-wah.',
        text: 'O cartão de visitas dele está no disco: <b>(Anesthesia) – Pulling Teeth</b>, um solo de baixo inteiro, algo raro num álbum de metal em 1983.',
        instrument: { type: 'bass4001', finish: 'jetglo' },
      }),
    ],
    tracks: [
      ['Hit the Lights', 'JH LU', '4:17'], ['The Four Horsemen', 'JH LU DM', '7:13'], ['Motorbreath', 'JH', '3:08'],
      ['Jump in the Fire', 'JH LU DM', '4:41'], ['(Anesthesia) – Pulling Teeth', 'CB', '4:14'], ['Whiplash', 'JH LU', '4:09'],
      ['Phantom Lord', 'JH LU DM', '5:02'], ['No Remorse', 'JH LU', '6:26'], ['Seek & Destroy', 'JH LU', '6:55'], ['Metal Militia', 'JH LU DM', '5:11'],
    ],
    // easter egg: Dave Mustaine
    dmNotes: {
      'The Four Horsemen': 'Nasceu como The Mechanix, uma música de Mustaine. O Metallica reescreveu a letra e criou uma parte nova no meio; ele gravou a versão original depois, com o Megadeth.',
      'Jump in the Fire': 'Uma das músicas da época em que Mustaine ainda estava na banda. Ele saiu antes da gravação, mas o crédito ficou.',
      'Phantom Lord': 'Já tocada nos shows e nas demos de 1982, com Mustaine na guitarra solo. O crédito dele continua no disco.',
      'Metal Militia': 'Mais uma da era Mustaine: escrita com ele, gravada sem ele.',
    },
    mustaine: {
      kicker: 'Dave Mustaine · guitarra solo, 1981–1983',
      title: 'Fora da banda, dentro do disco',
      stamp: 'Dispensado · abr 1983',
      text: 'Dave Mustaine foi o guitarrista solo do Metallica até abril de 1983, quando foi dispensado em Nova York, semanas antes da gravação, e mandado de volta para a Califórnia de ônibus. O crédito dele ficou em quatro faixas deste disco. Ainda em 1983, ele fundou o Megadeth.',
    },
    timeline: [
      ['1981', 'Lars e James se conhecem por um anúncio de jornal em Los Angeles e formam a banda.'],
      ['1982', 'As primeiras demos circulam em fitas copiadas e trocadas entre fãs.'],
      ['1983', 'Com Cliff Burton, a banda se muda para a região de San Francisco.'],
      ['Abr 1983', 'Dave Mustaine sai. Kirk Hammett, do Exodus, assume a guitarra solo.'],
      ['Mai 1983', 'Gravação do disco em Rochester, Nova York, em poucas semanas.'],
      ['Jul 1983', 'Kill ’Em All chega às lojas pela Megaforce.'],
    ],
  },

  'ride-the-lightning': {
    slug: 'ride-the-lightning', n: 2, year: 1984, theme: 'rtl', concept: 'Eletricidade',
    title: ['Ride the', 'Lightning'], name: 'Ride the Lightning',
    eyebrow: ['Metallica', '1984', '2º álbum'],
    sub: 'Oito faixas, quatro músicos e uma tempestade gravada em Copenhague. O disco em que o thrash aprendeu a ser épico.',
    meta: [['Lançamento', '27.07.1984'], ['Gravadora', 'Megaforce'], ['Estúdio', 'Sweet Silence · DK']],
    meter: { label: 'V', max: 2000000 },
    members: [
      m(JAMES, {
        role: 'Vocal & guitarra base', credits: 8, highlight: 'Fade to Black',
        lead: 'A voz e a mão direita do Metallica. Em Ride the Lightning, os riffs de Hetfield ficam mais pesados, mais longos e mais ambiciosos — e ele arrisca cantar com melodia pela primeira vez.',
        text: 'Do ataque de <b>Fight Fire with Fire</b> à primeira balada da banda, <b>Fade to Black</b>, o disco mostra um compositor descobrindo dinâmica, atmosfera e narrativa.',
        instrument: { type: 'v', finish: 'black' },
      }),
      m(LARS, {
        role: 'Bateria', credits: 8, highlight: 'Fight Fire with Fire',
        lead: 'O dinamarquês que pôs o anúncio no jornal que deu origem ao Metallica. Ride the Lightning foi gravado justamente na terra dele: no Sweet Silence Studios, em Copenhague.',
        text: 'Ao lado do produtor <b>Flemming Rasmussen</b>, Lars ajudou a moldar um som de bateria mais seco e encorpado. É ele quem dispara o pedal duplo de <b>Fight Fire with Fire</b>.',
        instrument: { type: 'drums', finish: 'blue', mark: '1984' },
      }),
      m(KIRK, {
        role: 'Guitarra solo', credits: 3, highlight: 'Creeping Death',
        lead: 'Cofundador do Exodus e aluno de Joe Satriani, Kirk entrou em abril de 1983. Ride the Lightning é o primeiro disco em que ele compõe com a banda desde o começo.',
        text: 'Os solos ficam mais melódicos e cheios de wah-wah, e as ideias dele aparecem em <b>Fade to Black</b>, <b>Trapped Under Ice</b> e <b>Creeping Death</b>, cuja ponte nasceu de um riff dos tempos de Exodus.',
        instrument: { type: 'x', finish: 'ivory', guard: 'black' },
      }),
      m(CLIFF, {
        role: 'Baixo', credits: 7, highlight: 'For Whom the Bell Tolls',
        lead: 'Formação clássica, baixo com distorção e wah-wah, e um gosto que ia de Bach a Lovecraft. Cliff mudou a forma como o Metallica pensava harmonia.',
        text: 'A introdução de <b>For Whom the Bell Tolls</b> — que muita gente jura ser guitarra — é o baixo dele. Cliff também assina a instrumental <b>The Call of Ktulu</b>, que fecha o disco.',
        instrument: { type: 'bass4001', finish: 'fireglo' },
      }),
    ],
    tracks: [
      ['Fight Fire with Fire', 'JH LU CB', '4:45'], ['Ride the Lightning', 'JH LU CB DM', '6:37'], ['For Whom the Bell Tolls', 'JH LU CB', '5:10'],
      ['Fade to Black', 'JH LU CB KH', '6:57'], ['Trapped Under Ice', 'JH LU KH', '4:04'], ['Escape', 'JH LU CB', '4:24'],
      ['Creeping Death', 'JH LU CB KH', '6:36'], ['The Call of Ktulu', 'JH LU CB DM', '8:53'],
    ],
    // easter egg: Dave Mustaine
    dmNotes: {
      'Ride the Lightning': 'A faixa-título aproveita ideias da época em que Mustaine ainda estava na banda — por isso o nome dele nos créditos, um ano depois de sair.',
      'The Call of Ktulu': 'A instrumental partiu de uma ideia composta com Mustaine. Ele divide o crédito com Hetfield, Ulrich e Burton.',
    },
    mustaine: {
      kicker: 'Dave Mustaine · um ano depois',
      title: 'Outra tempestade se formava',
      stamp: 'Crédito: DM',
      text: 'Um ano depois de sair, Dave Mustaine ainda aparece aqui: a faixa-título e The Call of Ktulu têm crédito para ele. Enquanto isso, em Los Angeles, o Megadeth — a banda que ele fundou em 1983 — preparava o primeiro disco.',
    },
  },

  'master-of-puppets': {
    slug: 'master-of-puppets', n: 3, year: 1986, theme: 'mop', concept: 'Controle',
    title: ['Master of', 'Puppets'], name: 'Master of Puppets',
    eyebrow: ['Metallica', '1986', '3º álbum'],
    sub: 'Oito faixas sobre controle: vício, guerra, loucura e manipulação. O disco em que o thrash ganhou estrutura de sinfonia.',
    meta: [['Lançamento', '03.03.1986'], ['Gravadora', 'Elektra'], ['Estúdio', 'Sweet Silence · DK']],
    meter: { label: '% de tensão', max: 100 },
    members: [
      m(JAMES, {
        role: 'Vocal & guitarra base', credits: 8, highlight: 'Master of Puppets',
        lead: 'Aqui Hetfield escreve como quem constrói catedrais: músicas longas, em partes, com riffs que mudam de forma sem perder o peso.',
        text: 'A faixa-título passa dos oito minutos e abre espaço para uma passagem limpa no meio da tempestade. Ele assina as oito faixas do disco.',
        instrument: { type: 'x', finish: 'black', guard: 'white' },
      }),
      m(LARS, {
        role: 'Bateria', credits: 7, highlight: 'Battery',
        lead: 'De volta ao Sweet Silence, em Copenhague, com Flemming Rasmussen, Lars ajudou a dar ao disco uma bateria maior e mais controlada.',
        text: '<b>Battery</b> abre o álbum com uma introdução acústica que explode em velocidade, e é a bateria dele que dita o ataque. Lars assina sete das oito faixas.',
        instrument: { type: 'drums', finish: 'wine', mark: '1986' },
      }),
      m(KIRK, {
        role: 'Guitarra solo', credits: 5, highlight: 'Welcome Home (Sanitarium)',
        lead: 'Mais confiante, Kirk passa a compor de verdade: as ideias dele estão em cinco das oito faixas.',
        text: 'Os solos ficam mais longos e cantáveis, como em <b>Welcome Home (Sanitarium)</b>, em que a guitarra limpa e o solo crescem junto com a música.',
        instrument: { type: 'superstrat', finish: 'white', guard: 'black' },
      }),
      m(CLIFF, {
        role: 'Baixo', credits: 3, highlight: 'Orion',
        lead: 'No último álbum com a banda, Cliff deixa sua marca mais bonita: Orion, uma instrumental de oito minutos em que o baixo assume a melodia.',
        text: 'Ele também assina a faixa-título e <b>Damage, Inc.</b>, aberta por camadas de baixo com efeito. Cliff morreu em 27 de setembro de 1986, num acidente com o ônibus da turnê, na Suécia.',
        instrument: { type: 'bassModern', finish: 'black', strings: 4 },
      }),
    ],
    tracks: [
      ['Battery', 'JH LU', '5:12'], ['Master of Puppets', 'JH LU CB KH', '8:35'], ['The Thing That Should Not Be', 'JH LU KH', '6:36'],
      ['Welcome Home (Sanitarium)', 'JH LU KH', '6:27'], ['Disposable Heroes', 'JH KH', '8:16'], ['Leper Messiah', 'JH LU', '5:40'],
      ['Orion', 'JH LU CB', '8:27'], ['Damage, Inc.', 'JH LU CB KH', '5:32'],
    ],
    themes: [
      'Ataque e fúria: a abertura que transforma velocidade em arma.',
      'O vício como titereiro: quem usa acaba sendo usado.',
      'Horror cósmico inspirado em H.P. Lovecraft: algo antigo dorme no fundo do mar.',
      'A vida vista de dentro de um hospício, por quem foi trancado e quer sair.',
      'O soldado tratado como peça descartável numa guerra que não escolheu.',
      'A fé transformada em negócio pelos pregadores da televisão.',
      'Instrumental: oito minutos sem palavras, com a melodia no baixo de Cliff.',
      'Destruição sem motivo: o fecho mais violento do disco.',
    ],
  },

  'and-justice-for-all': {
    slug: 'and-justice-for-all', n: 4, year: 1988, theme: 'justice', concept: 'Ruptura',
    title: ['...And Justice', 'for All'], name: '...And Justice for All',
    eyebrow: ['Metallica', '1988', '4º álbum'],
    sub: 'Nove faixas longas, técnicas e frias sobre um sistema que falha. O disco mais complexo da banda.',
    meta: [['Lançamento', '25.08.1988'], ['Gravadora', 'Elektra'], ['Estúdio', 'One on One · LA']],
    meter: { label: 'processo', max: 9999 },
    members: [
      m(JAMES, {
        role: 'Vocal & guitarra base', credits: 9, highlight: 'One',
        lead: 'Os riffs de Hetfield ficam secos, cortantes e cheios de mudanças de compasso, a serviço de músicas que passam dos nove minutos.',
        text: 'As letras miram injustiça, censura e guerra. <b>One</b>, sobre um soldado mutilado, virou o primeiro videoclipe da banda e rendeu o primeiro Grammy.',
        instrument: { type: 'x', finish: 'black', guard: 'white' },
      }),
      m(LARS, {
        role: 'Bateria', credits: 9, highlight: '...And Justice for All',
        lead: 'A bateria de Lars ficou no centro da mixagem, seca e precisa, conduzindo estruturas longas e cheias de viradas.',
        text: 'Na faixa-título, com quase dez minutos, cada mudança de andamento passa pelas mãos dele. Lars assina as nove faixas.',
        instrument: { type: 'drums', finish: 'silver', mark: '1988' },
      }),
      m(KIRK, {
        role: 'Guitarra solo', credits: 4, highlight: 'Dyers Eve',
        lead: 'Os solos de Kirk ficam mais técnicos, encaixados em músicas que pedem precisão milimétrica.',
        text: 'Ele colabora em quatro faixas, entre elas <b>Eye of the Beholder</b> e <b>Dyers Eve</b>, a mais rápida e agressiva do disco.',
        instrument: { type: 'superstrat', finish: 'black', guard: 'black' },
      }),
      m(JASON, {
        role: 'Baixo', credits: 1, highlight: 'Blackened',
        lead: 'Jason Newsted entrou no fim de 1986, vindo do Flotsam and Jetsam, com a missão impossível de ocupar o lugar de Cliff.',
        text: 'Ele assina <b>Blackened</b>, a faixa de abertura. O baixo quase inaudível na mixagem final virou uma das discussões mais famosas da história do metal.',
        instrument: { type: 'bassModern', finish: 'black', strings: 4 },
      }),
    ],
    tracks: [
      ['Blackened', 'JH LU JN', '6:41'], ['...And Justice for All', 'JH LU KH', '9:44'], ['Eye of the Beholder', 'JH LU KH', '6:25'],
      ['One', 'JH LU', '7:24'], ['The Shortest Straw', 'JH LU', '6:35'], ['Harvester of Sorrow', 'JH LU', '5:42'],
      ['The Frayed Ends of Sanity', 'JH LU KH', '7:40'], ['To Live Is to Die', 'JH LU CB', '9:48'], ['Dyers Eve', 'JH LU KH', '5:13'],
    ],
  },

  'black-album': {
    slug: 'black-album', n: 5, year: 1991, theme: 'black', concept: 'Escuridão',
    title: ['The Black Album', 'Metallica'], name: 'Black Album',
    eyebrow: ['Metallica', '1991', '5º álbum'],
    sub: 'Doze faixas, preto no preto. Menos velocidade, mais peso — e o disco que levou o Metallica ao mundo inteiro.',
    meta: [['Lançamento', '12.08.1991'], ['Gravadora', 'Elektra'], ['Estúdio', 'One on One · LA']],
    meter: { label: '% de luz', max: 100 },
    members: [
      m(JAMES, {
        role: 'Vocal & guitarra base', credits: 12, highlight: 'Nothing Else Matters',
        lead: 'Com o produtor Bob Rock, Hetfield trocou as músicas longas por canções diretas e pesadíssimas — e cantou como nunca antes.',
        text: '<b>Nothing Else Matters</b>, uma balada nascida ao violão dele, ganhou arranjo de orquestra e levou a banda a um público totalmente novo.',
        instrument: { type: 'x', finish: 'black', guard: 'black' },
      }),
      m(LARS, {
        role: 'Bateria', credits: 12, highlight: 'Sad but True',
        lead: 'Lars simplificou as viradas e apostou no groove: menos notas, mais peso em cada batida.',
        text: '<b>Enter Sandman</b> e <b>Sad but True</b> mostram a nova fórmula, com andamento médio e uma bateria enorme, gravada camada por camada.',
        instrument: { type: 'drums', finish: 'jet', mark: '1991' },
      }),
      m(KIRK, {
        role: 'Guitarra solo', credits: 4, highlight: 'Enter Sandman',
        lead: 'Kirk fez do wah-wah sua assinatura, em solos mais curtos, cantáveis e com espaço para respirar.',
        text: 'O riff principal de <b>Enter Sandman</b> nasceu de uma ideia dele gravada em casa — e virou a música mais conhecida da banda.',
        instrument: { type: 'superstrat', finish: 'black', guard: 'black' },
      }),
      m(JASON, {
        role: 'Baixo', credits: 1, highlight: 'My Friend of Misery',
        lead: 'No segundo disco com a banda, o baixo de Jason finalmente aparece: grave, encorpado e colado ao bumbo.',
        text: 'Ele assina <b>My Friend of Misery</b>, aberta por uma linha de baixo que conduz uma das faixas mais sombrias do álbum.',
        instrument: { type: 'bassModern', finish: 'black', strings: 5 },
      }),
    ],
    tracks: [
      ['Enter Sandman', 'JH LU KH', '5:31'], ['Sad but True', 'JH LU', '5:24'], ['Holier Than Thou', 'JH LU', '3:47'],
      ['The Unforgiven', 'JH LU KH', '6:26'], ['Wherever I May Roam', 'JH LU', '6:44'], ["Don't Tread on Me", 'JH LU', '4:00'],
      ['Through the Never', 'JH LU KH', '4:04'], ['Nothing Else Matters', 'JH LU', '6:28'], ['Of Wolf and Man', 'JH LU KH', '4:16'],
      ['The God That Failed', 'JH LU', '5:08'], ['My Friend of Misery', 'JH LU JN', '6:49'], ['The Struggle Within', 'JH LU', '3:53'],
    ],
  },
};

export const order = ['kill-em-all', 'ride-the-lightning', 'master-of-puppets', 'and-justice-for-all', 'black-album'];

/** soma as durações "m:ss" → "mm:ss" */
export function totalTime(tracks) {
  const s = tracks.reduce((acc, [, , d]) => { const [mm, ss] = d.split(':').map(Number); return acc + mm * 60 + ss; }, 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function neighbors(slug) {
  const i = order.indexOf(slug);
  return { prev: order[i - 1] ? albums[order[i - 1]] : null, next: order[i + 1] ? albums[order[i + 1]] : null };
}
