// Sate Senja — semua bunyi dibuat dengan WebAudio, tanpa file suara.
// Desis panggangan, denting koin, dan bunyi-bunyi kecil lainnya disintesis
// dari osilator dan noise, supaya game tetap jalan tanpa jaringan.

let ctx = null;
let sizzleNode = null;
let sizzleGain = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  const c = ensureCtx();
  if (!c || muted) return;
  const t0 = c.currentTime + when;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst(dur, vol, filterFreq) {
  const c = ensureCtx();
  if (!c || muted) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;
  filter.Q.value = 0.8;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

// Desis panggangan yang menyala selama ada sate di atas bara.
export function startSizzle() {
  const c = ensureCtx();
  if (!c || muted || sizzleNode) return;
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3200;
  sizzleGain = c.createGain();
  sizzleGain.gain.value = 0.0;
  sizzleGain.gain.linearRampToValueAtTime(0.045, c.currentTime + 0.4);
  src.connect(filter).connect(sizzleGain).connect(c.destination);
  src.start();
  sizzleNode = src;
}

export function stopSizzle() {
  if (!sizzleNode || !ctx) return;
  const node = sizzleNode;
  const gain = sizzleGain;
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.25);
  setTimeout(() => { try { node.stop(); } catch (_) { /* sudah berhenti */ } }, 300);
  sizzleNode = null;
  sizzleGain = null;
}

export const sfx = {
  // Tusuk bahan ke tusuk sate: bunyi "tuk" pendek.
  add() { tone(420, 0.07, 'triangle', 0.22, 0, 620); },
  // Bahan salah: bunyi rendah yang menolak.
  wrong() { tone(160, 0.16, 'square', 0.12, 0, 110); },
  // Sate naik ke panggangan: desis mulai.
  grill() { noiseBurst(0.25, 0.25, 2400); tone(300, 0.1, 'sine', 0.15, 0, 520); },
  // Zona sempurna tercapai: denting kecil.
  perfect() { tone(880, 0.12, 'sine', 0.2); tone(1318, 0.18, 'sine', 0.16, 0.09); },
  // Sajian diterima: koin berdenting dua kali.
  serve() {
    tone(988, 0.1, 'sine', 0.22);
    tone(1319, 0.16, 'sine', 0.22, 0.08);
    tone(1568, 0.2, 'sine', 0.18, 0.16);
  },
  // Pesanan baru masuk: bel kecil warung.
  order() { tone(1047, 0.09, 'sine', 0.14); tone(784, 0.12, 'sine', 0.12, 0.08); },
  // Pelanggan pergi kecewa: nada turun.
  expire() { tone(392, 0.22, 'sawtooth', 0.08, 0, 220); tone(262, 0.3, 'sawtooth', 0.07, 0.18, 180); },
  // Sate gosong: bunyi asap.
  burnt() { noiseBurst(0.4, 0.2, 900); tone(220, 0.3, 'sawtooth', 0.08, 0, 130); },
  // Koin belanja di toko antar shift.
  buy() { tone(659, 0.09, 'triangle', 0.2); tone(880, 0.09, 'triangle', 0.2, 0.07); tone(1175, 0.16, 'triangle', 0.2, 0.14); },
  // Menang: arpeggio naik tiga nada.
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.2, i * 0.13));
    tone(1319, 0.5, 'triangle', 0.18, 0.55);
  },
  // Kalah: nada turun pelan.
  lose() {
    [392, 330, 262, 196].forEach((f, i) => tone(f, 0.3, 'triangle', 0.16, i * 0.18));
  },
  // Klik tombol biasa.
  click() { tone(660, 0.05, 'sine', 0.14); },
};

export function toggleMute() {
  muted = !muted;
  if (muted) stopSizzle();
  return muted;
}

export function isMuted() { return muted; }
