// Sate Senja — keadaan permainan dan semua aturan main.
// Satu-satunya tempat logika skor, pesanan, api, dan shift hidup.
// Render tidak pernah mengubah angka di sini; ia hanya menggambarnya.

import {
  INGREDIENTS, ING_BY_ID, RECIPES, SHIFTS, UPGRADES, FLAMES,
  START_HEARTS, MAX_ORDERS, PERFECT_BONUS, COIN_NAME,
} from './config.js';
import { sfx, startSizzle, stopSizzle } from './audio.js';

const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

// Nama dan warna pelanggan yang mengantre di depan lapak.
const CUSTOMERS = [
  { name: 'Bu Ratna', shirt: '#e2574c', skin: '#f0c08a', hat: 'sanggul' },
  { name: 'Pak Dedi', shirt: '#3f7d5a', skin: '#d9a066', hat: 'peci' },
  { name: 'Mbak Sari', shirt: '#d9a441', skin: '#f2c795', hat: 'pita' },
  { name: 'Mas Joko', shirt: '#4a6fa5', skin: '#c98d54', hat: 'topi' },
  { name: 'Nak Budi', shirt: '#7d5ba6', skin: '#f0c08a', hat: 'rambut' },
  { name: 'Kak Lilis', shirt: '#c65d8a', skin: '#e8b57e', hat: 'sanggul' },
];

let orderSeq = 0;

export function createWorld() {
  return {
    screen: 'title', // title | play | shop | win | lose
    shiftIndex: 0,
    coins: 0,
    hearts: START_HEARTS,
    maxHearts: START_HEARTS,
    timeLeft: 0,
    orders: [],          // { id, recipe, patience, maxPatience, customer, bornAt }
    skewer: [],          // id bahan yang sudah ditusuk, sesuai urutan
    skewerRecipe: null,  // resep yang ditampilkan di papan tusuk (kandidat pertama)
    skewerCandidates: null, // resep-resep yang masih cocok dengan tusukan
    grill: null,         // { recipe, cook, flame, perfectPlayed }
    flame: 2,            // api yang dipilih pemain (1-3)
    plate: null,         // { recipe, perfect } — hidangan siap disajikan
    spawnTimer: 0,
    elapsed: 0,
    stats: { served: 0, perfect: 0, burnt: 0, expired: 0, wrong: 0, earned: 0 },
    upgrades: { cookSpeed: 0, patienceBonus: 0, maxHearts: 0 },
    ownedUpgrades: [],
    message: '',         // teks singkat di tengah layar (mis. "SATE GOSONG!")
    messageUntil: 0,
    shakeUntil: 0,
    floaters: [],        // { x, y, text, color, until } — angka koin melayang
    smoke: [],           // partikel asap dari panggangan
    shopBought: false,
    runHistory: [],      // ringkasan tiap shift yang sudah selesai
    muted: false,
  };
}

function pickRecipe(pool, avoidId) {
  const choices = pool.filter((id) => id !== avoidId);
  const list = choices.length ? choices : pool;
  return RECIPE_BY_ID[list[Math.floor(Math.random() * list.length)]];
}

function pickCustomer(used) {
  const free = CUSTOMERS.filter((c) => !used.includes(c.name));
  const list = free.length ? free : CUSTOMERS;
  return list[Math.floor(Math.random() * list.length)];
}

export function shiftConfig(world) {
  return SHIFTS[world.shiftIndex];
}

export function startShift(world, index) {
  const cfg = SHIFTS[index];
  world.shiftIndex = index;
  world.screen = 'play';
  world.timeLeft = cfg.duration;
  world.orders = [];
  world.skewer = [];
  world.skewerRecipe = null;
  world.skewerCandidates = null;
  world.grill = null;
  world.plate = null;
  world.spawnTimer = 2.5;
  world.elapsed = 0;
  world.message = cfg.name;
  world.messageUntil = world.elapsed + 2.2;
  spawnOrder(world, true);
  spawnOrder(world, true);
}

function spawnOrder(world, first = false) {
  const cfg = shiftConfig(world);
  if (world.orders.length >= MAX_ORDERS) return;
  const used = world.orders.map((o) => o.customer.name);
  const lastRecipe = world.orders.length ? world.orders[world.orders.length - 1].recipe.id : null;
  const patience = cfg.patience + world.upgrades.patienceBonus;
  const order = {
    id: ++orderSeq,
    recipe: pickRecipe(cfg.pool, lastRecipe),
    patience,
    maxPatience: patience,
    customer: pickCustomer(used),
    bornAt: world.elapsed,
    first,
  };
  world.orders.push(order);
  if (!first) sfx.order();
}

// Bahan pertama tidak menentukan resep secara unik (ayam membuka empat
// resep), jadi tusukan menerima bahan apa pun yang masih cocok dengan
// salah satu resep. Begitu tusukan sama panjang dengan satu resep yang
// cocok, resep itulah yang naik ke panggangan.
export function addIngredient(world, ingId) {
  if (world.screen !== 'play' || world.grill || world.plate) return;
  const ing = ING_BY_ID[ingId];
  if (!ing) return;

  const candidates = world.skewer.length === 0
    ? RECIPES.filter((r) => r.steps[0] === ingId)
    : (world.skewerCandidates || []).filter((r) => r.steps[world.skewer.length] === ingId);

  if (!candidates.length) {
    // Salah urutan: tusukan tidak bertambah, pemain kehilangan sedikit waktu.
    world.stats.wrong += 1;
    world.shakeUntil = world.elapsed + 0.35;
    const nextSet = [...new Set(
      (world.skewerCandidates || []).map((r) => r.steps[world.skewer.length]).filter(Boolean),
    )];
    world.message = nextSet.length
      ? `Bukan ${ing.name}! Berikutnya: ${nextSet.map((id) => ING_BY_ID[id].name).join(' / ')}.`
      : `Bukan ${ing.name}!`;
    world.messageUntil = world.elapsed + 1.4;
    sfx.wrong();
    return;
  }

  world.skewer.push(ingId);
  world.skewerCandidates = candidates;
  world.skewerRecipe = candidates[0];
  sfx.add();
  const done = candidates.find((r) => r.steps.length === world.skewer.length);
  if (done) {
    // Tusukan lengkap — naik ke panggangan dengan api yang diminta resep.
    world.flame = done.heat;
    world.grill = { recipe: done, cook: 0, flame: done.heat, perfectPlayed: false };
    world.skewer = [];
    world.skewerRecipe = null;
    world.skewerCandidates = null;
    sfx.grill();
    startSizzle();
  }
}

// Buang tusukan yang sedang dirakit (tombol tempat sampah).
export function clearSkewer(world) {
  if (world.screen !== 'play' || world.grill || world.plate) return;
  if (!world.skewer.length) return;
  world.skewer = [];
  world.skewerRecipe = null;
  world.skewerCandidates = null;
  sfx.click();
}

// Buang sate gosong / piring yang tidak laku.
export function trashGrill(world) {
  if (world.screen !== 'play') return;
  if (world.grill) {
    world.grill = null;
    stopSizzle();
    sfx.click();
  } else if (world.plate) {
    world.plate = null;
    sfx.click();
  }
}

// Sajikan piring ke pesanan yang cocok. Koin = dasar + tip sabar + bonus sempurna.
export function servePlate(world) {
  if (world.screen !== 'play' || !world.plate) return false;
  const dish = world.plate.recipe;
  const idx = world.orders.findIndex((o) => o.recipe.id === dish.id);
  if (idx === -1) {
    world.message = 'Tidak ada yang memesan ini!';
    world.messageUntil = world.elapsed + 1.4;
    sfx.wrong();
    return false;
  }
  const order = world.orders[idx];
  const patienceShare = order.patience / order.maxPatience;
  const tip = Math.round(dish.tip * patienceShare) + (world.plate.perfect ? PERFECT_BONUS : 0);
  const earned = dish.base + tip;
  world.coins += earned;
  world.stats.earned += earned;
  world.stats.served += 1;
  if (world.plate.perfect) world.stats.perfect += 1;
  world.orders.splice(idx, 1);
  world.floaters.push({
    x: 640, y: 300, text: `+${earned} ${COIN_NAME}`, color: '#ffd94d', until: world.elapsed + 1.2,
  });
  world.plate = null;
  sfx.serve();
  return true;
}

export function setFlame(world, level) {
  if (world.screen !== 'play' || !world.grill) return;
  const clamped = Math.max(1, Math.min(3, level));
  world.flame = clamped;
  world.grill.flame = clamped;
  sfx.click();
}

export function buyUpgrade(world, upgradeId) {
  const up = UPGRADES.find((u) => u.id === upgradeId);
  if (!up || world.ownedUpgrades.includes(upgradeId)) return false;
  if (world.coins < up.cost) {
    world.message = 'Koin RASA belum cukup!';
    world.messageUntil = world.elapsed + 1.4;
    sfx.wrong();
    return false;
  }
  world.coins -= up.cost;
  world.ownedUpgrades.push(upgradeId);
  up.apply(world.upgrades);
  if (upgradeId === 'hati') {
    world.maxHearts += 1;
    world.hearts = world.maxHearts;
  }
  sfx.buy();
  return true;
}

function gradeFor(stats, coins) {
  if (stats.perfect >= 8 && stats.burnt === 0 && stats.expired === 0) return 'S';
  if (stats.perfect >= 5 && stats.burnt <= 1) return 'A';
  if (stats.served >= 12) return 'B';
  return 'C';
}

function endShift(world, won) {
  const cfg = shiftConfig(world);
  world.runHistory.push({
    shift: cfg.name, coins: world.coins, served: world.stats.served,
    target: cfg.target, won,
  });
  stopSizzle();
  if (!won) {
    world.screen = 'lose';
    sfx.lose();
    return;
  }
  if (world.shiftIndex >= SHIFTS.length - 1) {
    world.screen = 'win';
    world.grade = gradeFor(world.stats, world.coins);
    sfx.win();
  } else {
    world.screen = 'shop';
    sfx.win();
  }
}

export function update(world, dt) {
  world.elapsed += dt;

  // Partikel asap selalu bergerak, di layar apa pun.
  for (let i = world.smoke.length - 1; i >= 0; i--) {
    const p = world.smoke[i];
    p.y -= 26 * dt;
    p.x += Math.sin(p.y * 0.05) * 8 * dt;
    p.life -= dt;
    if (p.life <= 0) world.smoke.splice(i, 1);
  }
  for (let i = world.floaters.length - 1; i >= 0; i--) {
    const f = world.floaters[i];
    f.y -= 34 * dt;
    if (world.elapsed > f.until) world.floaters.splice(i, 1);
  }

  if (world.screen !== 'play') return;

  // Timer shift.
  world.timeLeft -= dt;
  if (world.timeLeft <= 0) {
    world.timeLeft = 0;
    endShift(world, world.coins >= shiftConfig(world).target);
    return;
  }

  // Pesanan baru.
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    spawnOrder(world);
    world.spawnTimer = shiftConfig(world).spawnEvery;
  }

  // Sabar pelanggan menipis; yang habis pergi dan hati berkurang.
  for (let i = world.orders.length - 1; i >= 0; i--) {
    const o = world.orders[i];
    o.patience -= dt;
    if (o.patience <= 0) {
      world.orders.splice(i, 1);
      world.stats.expired += 1;
      world.hearts -= 1;
      world.message = `${o.customer.name} pergi kecewa! (−1 ❤️)`;
      world.messageUntil = world.elapsed + 1.6;
      sfx.expire();
      if (world.hearts <= 0) {
        world.hearts = 0;
        endShift(world, false);
        return;
      }
    }
  }

  // Memasak di panggangan.
  if (world.grill) {
    const g = world.grill;
    const flame = FLAMES[g.flame - 1];
    const speed = flame.speed * (1 + world.upgrades.cookSpeed);
    g.cook += (dt * speed) / 9; // 9 detik di api sedang sampai matang penuh
    const [lo, hi] = flame.perfect;
    if (!g.perfectPlayed && g.cook >= lo && g.cook <= hi) {
      g.perfectPlayed = true;
      sfx.perfect();
    }
    if (Math.random() < dt * 6) {
      world.smoke.push({
        x: 560 + Math.random() * 160, y: 470, life: 1.4 + Math.random(),
      });
    }
    if (g.cook >= 1) {
      // Gosong: sate hangus, harus dibuang.
      world.grill = null;
      world.stats.burnt += 1;
      world.message = 'GOSONG! Angkat sebelum meteran penuh.';
      world.messageUntil = world.elapsed + 1.8;
      stopSizzle();
      sfx.burnt();
    }
  }

  // Sate matang sempurna / matang: angkat otomatis ke piring saat pemain
  // menekan tombol angkat — di sini hanya menandai siap diangkat.
}

// Apakah sate di panggangan sudah masuk zona bisa disajikan?
export function grillReady(world) {
  if (!world.grill) return false;
  const flame = FLAMES[world.grill.flame - 1];
  const [lo] = flame.perfect;
  return world.grill.cook >= lo;
}

// Apakah sate di zona sempurna (bonus koin)?
export function grillPerfect(world) {
  if (!world.grill) return false;
  const flame = FLAMES[world.grill.flame - 1];
  const [lo, hi] = flame.perfect;
  return world.grill.cook >= lo && world.grill.cook <= hi;
}

// Angkat sate dari panggangan ke piring saji.
export function liftGrill(world) {
  if (world.screen !== 'play' || !world.grill || !grillReady(world)) return false;
  const perfect = grillPerfect(world);
  world.plate = { recipe: world.grill.recipe, perfect };
  world.grill = null;
  stopSizzle();
  sfx.click();
  return true;
}

// Daftar resep yang bisa dirakit dari bahan pertama di tusukan.
export function currentTargetRecipe(world) {
  return world.skewerRecipe;
}

export function orderMatchesPlate(world) {
  if (!world.plate) return false;
  return world.orders.some((o) => o.recipe.id === world.plate.recipe.id);
}
