// Sate Senja — loop utama: baca masukan, jalankan dunia, gambar layar.
// Satu-satunya file yang tahu tentang canvas, waktu, dan parameter URL.

import { INGREDIENTS, ING_BY_ID, SHIFTS, UPGRADES, FLAMES } from './config.js';
import { createWorld, startShift, addIngredient, clearSkewer, trashGrill, servePlate, liftGrill, setFlame, buyUpgrade, update } from './world.js';
import { render, LAYOUT } from './render.js';
import { createInput } from './input.js';
import { sfx, toggleMute } from './audio.js';
import { worldForShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = createInput(canvas);

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
let world = shot ? worldForShot(shot) : createWorld();

// Mode tangkapan layar: dunia dibekukan di adegan yang ditata, supaya
// screenshot deterministik. Timer dan pesanan tidak berjalan di sini.
const FROZEN = !!shot;
let last = performance.now();
let t = 0;

function inBox(p, box) {
  return p.x >= box.x && p.x <= box.x + box.w && p.y >= box.y && p.y <= box.y + box.h;
}

function handlePlayClick(click) {
  // Tombol suara selalu aktif.
  if (inBox(click, LAYOUT.mute)) {
    world.muted = toggleMute();
    return;
  }
  // Bahan di meja.
  for (const bin of LAYOUT.bins) {
    if (inBox(click, bin)) { addIngredient(world, bin.id); return; }
  }
  if (inBox(click, LAYOUT.lift)) { liftGrill(world); return; }
  if (inBox(click, LAYOUT.serve)) { servePlate(world); return; }
  if (inBox(click, LAYOUT.trash)) {
    if (world.skewer.length) clearSkewer(world);
    else trashGrill(world);
    return;
  }
  for (const f of LAYOUT.flames) {
    if (inBox(click, f)) { setFlame(world, f.level); return; }
  }
}

function handlePlayKey(key) {
  if (key === 'm') { world.muted = toggleMute(); return; }
  const ing = INGREDIENTS.find((g) => g.key === key);
  if (ing) { addIngredient(world, ing.id); return; }
  if (key === 'q') { setFlame(world, 1); return; }
  if (key === 'w') { setFlame(world, 2); return; }
  if (key === 'e') { setFlame(world, 3); return; }
  if (key === ' ') { servePlate(world); return; }
  if (key === 'Enter') { liftGrill(world); return; }
  if (key === 'Backspace' || key === 'Delete') {
    if (world.skewer.length) clearSkewer(world);
    else trashGrill(world);
  }
}

function handleTitleClick(click) {
  if (inBox(click, LAYOUT.startButton)) {
    sfx.click();
    startShift(world, 0);
  }
}

function handleShopClick(click) {
  UPGRADES.forEach((up, i) => {
    if (inBox(click, LAYOUT.shopCards[i])) buyUpgrade(world, up.id);
  });
  if (inBox(click, LAYOUT.nextShiftButton)) {
    sfx.click();
    startShift(world, world.shiftIndex + 1);
  }
}

function handleEndClick(click) {
  if (inBox(click, LAYOUT.againButton)) {
    sfx.click();
    const fresh = createWorld();
    fresh.muted = world.muted;
    world = fresh;
    startShift(world, 0);
  }
}

function handleEndKey(key) {
  if (key === 'Enter' || key === ' ') {
    sfx.click();
    const fresh = createWorld();
    fresh.muted = world.muted;
    world = fresh;
    startShift(world, 0);
  }
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  t += dt;
  if (!FROZEN) update(world, dt);

  const clicks = input.takeClicks();
  const keys = input.takeKeys();
  const hover = { x: input.hoverX, y: input.hoverY };

  if (!FROZEN) {
    for (const click of clicks) {
      if (world.screen === 'title') handleTitleClick(click);
      else if (world.screen === 'play') handlePlayClick(click);
      else if (world.screen === 'shop') handleShopClick(click);
      else if (world.screen === 'win' || world.screen === 'lose') handleEndClick(click);
    }
    for (const key of keys) {
      if (world.screen === 'title' && (key === 'Enter' || key === ' ')) {
        sfx.click();
        startShift(world, 0);
      } else if (world.screen === 'play') {
        handlePlayKey(key);
      } else if (world.screen === 'shop') {
        if (key === 'Enter' || key === ' ') {
          sfx.click();
          startShift(world, world.shiftIndex + 1);
        } else {
          const n = parseInt(key, 10);
          if (n >= 1 && n <= 3) buyUpgrade(world, UPGRADES[n - 1].id);
        }
      } else if (world.screen === 'win' || world.screen === 'lose') {
        handleEndKey(key);
      }
      if (key === 'm' && world.screen !== 'play') world.muted = toggleMute();
    }
  }

  render(ctx, world, t, hover);
  requestAnimationFrame(frame);
}

// Paparkan keadaan untuk pengujian otomatis di browser.
window.__sateSenja = {
  get world() { return world; },
  startShift: (i) => startShift(world, i),
};

requestAnimationFrame(frame);
