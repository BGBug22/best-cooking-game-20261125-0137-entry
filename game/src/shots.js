// Sate Senja — keadaan khusus untuk tangkapan layar.
// ?shot=start|play|win|lose menata satu adegan yang sama persis setiap
// kali dibuka, supaya screenshot menunjukkan loop lengkap permainan:
// judul → main → menang / kalah. Bukan jalan pintas main: semua adegan
// memakai keadaan dunia yang sama seperti saat bermain sungguhan.

import { RECIPES, SHIFTS } from './config.js';
import { createWorld, startShift } from './world.js';

const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));

export function worldForShot(shot) {
  const world = createWorld();
  if (shot === 'start') {
    world.screen = 'title';
    return world;
  }
  if (shot === 'play') {
    // Shift 2 yang sedang ramai: tiga pesanan, satu tusukan setengah jadi
    // di atas panggangan, timer berjalan, piring siap disajikan.
    startShift(world, 1);
    world.timeLeft = 47;
    world.coins = 85;
    world.orders = [
      {
        id: 901, recipe: RECIPE_BY_ID['ayam-manis'], patience: 26, maxPatience: 42,
        customer: { name: 'Bu Ratna', shirt: '#e2574c', skin: '#f0c08a', hat: 'sanggul' }, bornAt: 0,
      },
      {
        id: 902, recipe: RECIPE_BY_ID['sapi-pedas'], patience: 14, maxPatience: 42,
        customer: { name: 'Pak Dedi', shirt: '#3f7d5a', skin: '#d9a066', hat: 'peci' }, bornAt: 0,
      },
      {
        id: 903, recipe: RECIPE_BY_ID['tahu-pedas'], patience: 38, maxPatience: 42,
        customer: { name: 'Mbak Sari', shirt: '#d9a441', skin: '#f2c795', hat: 'pita' }, bornAt: 0,
      },
    ];
    world.grill = { recipe: RECIPE_BY_ID['ayam-manis'], cook: 0.68, flame: 2, perfectPlayed: true };
    world.plate = { recipe: RECIPE_BY_ID['tahu-pedas'], perfect: true };
    world.stats.served = 7;
    world.stats.perfect = 4;
    world.stats.earned = 85;
    world.message = '';
    world.messageUntil = 0;
    return world;
  }
  if (shot === 'win') {
    startShift(world, 2);
    world.screen = 'win';
    world.coins = 214;
    world.grade = 'S';
    world.stats = { served: 19, perfect: 9, burnt: 0, expired: 1, wrong: 2, earned: 214 };
    world.runHistory = SHIFTS.map((s, i) => ({
      shift: s.name, coins: [64, 128, 214][i], served: [6, 12, 19][i], target: s.target, won: true,
    }));
    return world;
  }
  if (shot === 'lose') {
    startShift(world, 1);
    world.screen = 'lose';
    world.hearts = 0;
    world.coins = 73;
    world.stats = { served: 8, perfect: 2, burnt: 2, expired: 3, wrong: 4, earned: 73 };
    return world;
  }
  return world;
}
