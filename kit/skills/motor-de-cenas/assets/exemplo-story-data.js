/* =========================================================
   EXEMPLO de data/story.js — um capítulo fictício de uma
   padaria de bairro, só para mostrar o formato.
   ========================================================= */

// Mapa de rota: exporte sempre, mesmo que seja null (usa o padrão) ou {} sem lugares.
export const mapConfig = {
  bounds: { lonMin: -48, lonMax: -42, latMin: -25, latMax: -21 }, // recorte do mapa
  land: [
    // contorno à mão em coordenadas 1000×520 (desenhe num editor de SVG por cima de um mapa de referência)
    'M0 120 C 200 90 420 110 600 180 C 760 240 880 300 1000 330 L 1000 520 L 0 520 Z',
  ],
};

export const places = {
  sp: { name: 'São Paulo', lat: -23.55, lon: -46.63 },
  santos: { name: 'Santos', lat: -23.96, lon: -46.33, label: [10, 16] }, // [dx, dy, anchor] evita nomes sobrepostos
  rio: { name: 'Rio de Janeiro', lat: -22.91, lon: -43.17, label: [-10, -10, 'end'] },
};

export const story = {
  'a-primeira-loja': {
    n: 1, label: 'Capítulo 1', title: 'A primeira loja', years: '1994–1999',
    route: [['santos', 'sp']],
    previously: 'Uma receita de família passa de mão em mão em Santos durante trinta anos.',
    scenes: [
      { card: 'Santos, março de 1994', art: 'forno', text: 'Dona Lia aluga um forno de segunda mão e assa os primeiros pães na garagem de casa.' },
      { card: 'Rumo a São Paulo', art: 'map', map: { route: 0 }, text: 'Um ano depois, a família sobe a serra com uma kombi e uma receita.' },
      { card: 'São Paulo, 1999', art: 'contador', text: 'Segundo o caderno de vendas, a loja passa de 2 mil pães por dia.' },
    ],
    hook: 'No ano seguinte, alguém de fora bate na porta com uma proposta.',
  },
};

// Ordem do filme. O epílogo, se houver, fica fora e usa allRoads: true.
export const storyOrder = ['a-primeira-loja'];
