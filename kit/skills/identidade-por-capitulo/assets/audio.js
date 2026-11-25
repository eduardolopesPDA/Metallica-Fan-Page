/* =========================================================
   ÁUDIO — Web Audio puro, sem arquivos.
   Desligado por padrão; a escolha fica salva e vale para todas as
   páginas, mas o navegador só libera o som depois de um gesto.
   ========================================================= */
const KEY = 'meu-projeto-som'; // troque pelo nome do projeto
let ac = null, master = null, enabled = false;
const listeners = new Set();

export const audio = {
  get on() { return enabled; },
  get ctx() { return ac; },
  get out() { return master; },
  set(on) {
    if (on && !ac) {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = .85; master.connect(ac.destination);
    }
    if (on) ac.resume();
    enabled = on;
    try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
    listeners.forEach(f => f(on));
  },
  listen(f) { listeners.add(f); },
  stored() { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } },

  /** buffer de ruído: 'white' | 'brown' | 'pink' */
  noise(seconds, type = 'white') {
    const len = Math.floor(ac.sampleRate * seconds);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
      else if (type === 'pink') { last = .97 * last + .03 * w; d[i] = (last * 4 + w * .3) * .5; }
      else d[i] = w;
    }
    return buf;
  },

  /** toca um buffer de ruído filtrado com envelope simples; devolve o gain */
  hit({ buffer, type = 'lowpass', freq = 800, q = 1, gain = .5, attack = .005, decay = .4, delay = 0, to = master }) {
    if (!enabled || !ac) return null;
    const t = ac.currentTime + delay;
    const src = ac.createBufferSource(); src.buffer = buffer;
    const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
    src.connect(f).connect(g).connect(to);
    src.start(t); src.stop(t + attack + decay + .05);
    return g;
  },

  /** oscilador com queda de frequência (pancadas, bumbo) */
  thump({ from = 140, to: toF = 40, gain = .8, decay = .35, delay = 0, type = 'sine' }) {
    if (!enabled || !ac) return;
    const t = ac.currentTime + delay;
    const o = ac.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(from, t); o.frequency.exponentialRampToValueAtTime(toF, t + decay);
    const g = ac.createGain();
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(master); o.start(t); o.stop(t + decay + .05);
  },

  /** ruído em loop para ambiente; devolve stop() */
  loop({ type = 'white', filter = 'lowpass', freq = 1000, q = .7, gain = .05, fade = 1.2 }) {
    if (!ac) return () => {};
    const src = ac.createBufferSource(); src.buffer = this.noise(4, type); src.loop = true;
    const f = ac.createBiquadFilter(); f.type = filter; f.frequency.value = freq; f.Q.value = q;
    const g = ac.createGain(); g.gain.value = 0;
    g.gain.linearRampToValueAtTime(gain, ac.currentTime + fade);
    src.connect(f).connect(g).connect(master); src.start();
    return () => {
      g.gain.cancelScheduledValues(ac.currentTime);
      g.gain.setValueAtTime(g.gain.value, ac.currentTime);
      g.gain.linearRampToValueAtTime(0, ac.currentTime + .5);
      src.stop(ac.currentTime + .6);
    };
  },
};
