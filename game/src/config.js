// Sate Senja — data dasar: bahan, resep, shift, dan ekonomi permainan.
// Semua angka di sini adalah aturan main, bukan hasil jiplakan dari game lain.

export const VIEW_W = 1280;
export const VIEW_H = 720;

// Delapan bahan di meja dapur. key = tombol keyboard, color = warna gambar,
// price = nilai rasa (dipakai untuk skor akhir, bukan untuk belanja).
export const INGREDIENTS = [
  { id: 'ayam',   name: 'Ayam',   key: '1', color: '#f2b880', dark: '#c98a4b', emoji: '🍗', price: 4 },
  { id: 'sapi',   name: 'Sapi',   key: '2', color: '#d96a5f', dark: '#a03d33', emoji: '🥩', price: 5 },
  { id: 'tahu',   name: 'Tahu',   key: '3', color: '#f7ead0', dark: '#d9c39a', emoji: '🧈', price: 3 },
  { id: 'bawang', name: 'Bawang', key: '4', color: '#e8d8ff', dark: '#a98fd0', emoji: '🧅', price: 2 },
  { id: 'cabai',  name: 'Cabai',  key: '5', color: '#e33d2e', dark: '#a11f16', emoji: '🌶️', price: 3 },
  { id: 'kecap',  name: 'Kecap',  key: '6', color: '#5b3a1e', dark: '#3a2412', emoji: '🫙', price: 2 },
  { id: 'kacang', name: 'Kacang', key: '7', color: '#d9a441', dark: '#9c6f1d', emoji: '🥜', price: 3 },
  { id: 'lontong',name: 'Lontong',key: '8', color: '#fdf6e3', dark: '#cfc39a', emoji: '🍚', price: 3 },
];

export const ING_BY_ID = Object.fromEntries(INGREDIENTS.map((g) => [g.id, g]));

// Dua belas resep warung. steps = urutan tusuk yang benar.
// heat = api yang diminta pelanggan (1 kecil, 2 sedang, 3 besar).
// base = koin dasar, serveBonus = koin tambahan bila disajikan di zona sempurna.
export const RECIPES = [
  { id: 'ayam-manis',  name: 'Sate Ayam Manis',  steps: ['ayam', 'kecap', 'kacang'],            heat: 2, base: 12, tip: 6 },
  { id: 'sapi-bawang', name: 'Sate Sapi Bawang', steps: ['sapi', 'bawang', 'kecap'],            heat: 2, base: 14, tip: 6 },
  { id: 'tahu-pedas',  name: 'Sate Tahu Pedas',  steps: ['tahu', 'cabai', 'kacang'],            heat: 1, base: 11, tip: 7 },
  { id: 'campur',      name: 'Sate Campur',      steps: ['ayam', 'sapi', 'tahu'],               heat: 2, base: 15, tip: 7 },
  { id: 'ayam-pedas',  name: 'Sate Ayam Pedas',  steps: ['ayam', 'cabai', 'cabai'],             heat: 3, base: 14, tip: 8 },
  { id: 'sapi-manis',  name: 'Sate Sapi Manis',  steps: ['sapi', 'kecap', 'kecap'],              heat: 1, base: 13, tip: 6 },
  { id: 'lontong-ayam',name: 'Sate Lontong Ayam',steps: ['ayam', 'lontong', 'kacang'],          heat: 2, base: 13, tip: 6 },
  { id: 'senja',       name: 'Sate Senja Spesial',steps: ['sapi', 'cabai', 'bawang', 'kecap'], heat: 3, base: 20, tip: 10 },
  { id: 'tahu-manis',  name: 'Sate Tahu Manis',  steps: ['tahu', 'kecap', 'kacang'],            heat: 1, base: 11, tip: 6 },
  { id: 'sapi-pedas',  name: 'Sate Sapi Pedas',  steps: ['sapi', 'cabai', 'bawang'],            heat: 3, base: 16, tip: 8 },
  { id: 'ayam-lontong',name: 'Sate Ayam Lontong',steps: ['ayam', 'lontong', 'kecap'],           heat: 2, base: 12, tip: 6 },
  { id: 'tahu-campur', name: 'Sate Tahu Campur', steps: ['tahu', 'ayam', 'cabai'],              heat: 2, base: 14, tip: 7 },
];

// Tiga shift malam. target = koin yang harus dikumpulkan sebelum waktu habis.
// spawnEvery = jeda pesanan baru, patience = sabar pelanggan (detik),
// pool = resep yang boleh muncul di shift itu.
export const SHIFTS = [
  {
    name: 'Shift 1 — Buka Lapak',
    duration: 100, target: 60, spawnEvery: 13, patience: 46,
    pool: ['ayam-manis', 'sapi-bawang', 'tahu-pedas', 'tahu-manis', 'ayam-lontong'],
    intro: 'Pelanggan pertama datang. Tusuk sesuai resep, bakar di api yang pas.',
  },
  {
    name: 'Shift 2 — Ramai Senja',
    duration: 110, target: 120, spawnEvery: 11, patience: 42,
    pool: ['ayam-manis', 'sapi-bawang', 'tahu-pedas', 'campur', 'ayam-pedas', 'sapi-manis', 'lontong-ayam'],
    intro: 'Lapak mulai ramai! Pesanan datang lebih cepat, pelanggan lebih tak sabar.',
  },
  {
    name: 'Shift 3 — Puncak Malam',
    duration: 120, target: 190, spawnEvery: 9, patience: 38,
    pool: ['ayam-manis', 'sapi-bawang', 'tahu-pedas', 'campur', 'ayam-pedas', 'sapi-manis', 'lontong-ayam', 'senja', 'sapi-pedas', 'tahu-campur'],
    intro: 'Puncak malam! Sate Senja Spesial masuk daftar. Jangan sampai ada yang gosong.',
  },
];

// Tiga peningkatan yang dijual antar shift. cost dalam koin RASA.
export const UPGRADES = [
  {
    id: 'arang-super', name: 'Arang Super', icon: '🔥',
    desc: 'Bara lebih panas: masakan matang 25% lebih cepat di semua shift.',
    cost: 30, apply: (u) => { u.cookSpeed += 0.25; },
  },
  {
    id: 'senyum', name: 'Senyum Pelanggan', icon: '😊',
    desc: 'Teh manis gratis untuk yang menunggu: sabar pelanggan +10 detik.',
    cost: 25, apply: (u) => { u.patienceBonus += 10; },
  },
  {
    id: 'hati', name: 'Hati Tambahan', icon: '❤️',
    desc: 'Semangat baru: hati maksimal +1 (langsung terisi penuh).',
    cost: 40, apply: (u) => { u.maxHearts += 1; },
  },
];

export const FLAMES = [
  { level: 1, name: 'Api Kecil', color: '#f2a541', speed: 0.55, perfect: [0.45, 0.95] },
  { level: 2, name: 'Api Sedang', color: '#ef7d2e', speed: 1.0, perfect: [0.55, 0.9] },
  { level: 3, name: 'Api Besar', color: '#e33d2e', speed: 1.7, perfect: [0.62, 0.86] },
];

export const COIN_NAME = 'RASA';
export const START_HEARTS = 3;
export const MAX_ORDERS = 3;
export const PERFECT_BONUS = 5;
