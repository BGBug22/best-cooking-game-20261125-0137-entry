// Sate Senja — semua gambar digambar prosedural di canvas 2D.
// Tidak ada file gambar: dapur, pelanggan, bara, dan asap dilukis dengan
// bentuk dan gradien, supaya game tetap utuh tanpa jaringan.

import { INGREDIENTS, ING_BY_ID, FLAMES, COIN_NAME, SHIFTS, UPGRADES } from './config.js';
import { shiftConfig } from './world.js';

// Semua kotak klik dihitung dari sini, supaya gambar dan masukan selalu sama.
export const LAYOUT = {
  bins: INGREDIENTS.map((g, i) => ({
    x: 24 + i * 154, y: 612, w: 142, h: 92, id: g.id,
  })),
  grill: { x: 400, y: 402, w: 420, h: 150 },
  skewerBoard: { x: 400, y: 330, w: 420, h: 62 },
  plate: { x: 856, y: 402, w: 190, h: 150 },
  serve: { x: 1072, y: 402, w: 184, h: 150 },
  trash: { x: 1072, y: 330, w: 184, h: 62 },
  flames: [1, 2, 3].map((lv, i) => ({
    x: 400 + i * 142, y: 560, w: 134, h: 40, level: lv,
  })),
  lift: { x: 856, y: 330, w: 190, h: 62 },
  startButton: { x: 440, y: 560, w: 400, h: 72 },
  againButton: { x: 440, y: 580, w: 400, h: 72 },
  nextShiftButton: { x: 440, y: 600, w: 400, h: 64 },
  shopCards: [0, 1, 2].map((i) => ({
    x: 90 + i * 380, y: 220, w: 340, h: 300,
  })),
  mute: { x: 1216, y: 8, w: 52, h: 44 },
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(ctx, str, x, y, size, color, align = 'center', font = 'bold', family = 'Verdana, sans-serif') {
  ctx.fillStyle = color;
  ctx.font = `${font} ${size}px ${family}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
}

function heart(ctx, x, y, s, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 20, s / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-11, -4, -6, -12, 0, -6);
  ctx.bezierCurveTo(6, -12, 11, -4, 0, 6);
  ctx.closePath();
  ctx.fillStyle = filled ? '#e33d5e' : 'rgba(255,255,255,0.18)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

function coinIcon(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd94d';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#b8860b';
  ctx.stroke();
  text(ctx, 'R', x, y + 1, r * 1.1, '#8a5a00');
}

// Gambar satu bahan sebagai bentuk sederhana di atas piring kecil.
export function drawIngredient(ctx, id, x, y, s) {
  const g = ING_BY_ID[id];
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = g.color;
  ctx.strokeStyle = g.dark;
  ctx.lineWidth = 2;
  switch (id) {
    case 'ayam': {
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.62, s * 0.45, -0.4, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.4, s * 0.25);
      ctx.lineTo(s * 0.85, s * 0.7);
      ctx.lineWidth = s * 0.16;
      ctx.strokeStyle = '#efe3c8';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.88, s * 0.72, s * 0.16, 0, Math.PI * 2);
      ctx.fillStyle = '#efe3c8';
      ctx.fill();
      break;
    }
    case 'sapi': {
      ctx.beginPath();
      ctx.moveTo(-s * 0.6, -s * 0.3);
      ctx.quadraticCurveTo(0, -s * 0.75, s * 0.6, -s * 0.25);
      ctx.quadraticCurveTo(s * 0.75, s * 0.4, 0, s * 0.55);
      ctx.quadraticCurveTo(-s * 0.7, s * 0.4, -s * 0.6, -s * 0.3);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-s * 0.3, -s * 0.1);
      ctx.lineTo(s * 0.25, s * 0.15);
      ctx.stroke();
      break;
    }
    case 'tahu': {
      ctx.fillRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
      ctx.strokeRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.9);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(-s * 0.55, -s * 0.45, s * 1.1, s * 0.28);
      break;
    }
    case 'bawang': {
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, s * (0.62 - i * 0.16), 0, Math.PI * 2);
        ctx.strokeStyle = i === 0 ? g.dark : '#cbb3e8';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.fillStyle = g.dark;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.6);
      ctx.lineTo(s * 0.12, -s * 0.85);
      ctx.lineTo(-s * 0.12, -s * 0.85);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'cabai': {
      ctx.beginPath();
      ctx.moveTo(-s * 0.6, -s * 0.2);
      ctx.quadraticCurveTo(0, -s * 0.7, s * 0.55, -s * 0.45);
      ctx.quadraticCurveTo(s * 0.75, -s * 0.1, s * 0.3, s * 0.35);
      ctx.quadraticCurveTo(-s * 0.2, s * 0.5, -s * 0.6, -s * 0.2);
      ctx.fill(); ctx.stroke();
      ctx.strokeStyle = '#3f7d2a';
      ctx.lineWidth = s * 0.14;
      ctx.beginPath();
      ctx.moveTo(s * 0.5, -s * 0.45);
      ctx.quadraticCurveTo(s * 0.8, -s * 0.7, s * 0.95, -s * 0.6);
      ctx.stroke();
      break;
    }
    case 'kecap': {
      ctx.fillRect(-s * 0.28, -s * 0.55, s * 0.56, s * 1.1);
      ctx.strokeRect(-s * 0.28, -s * 0.55, s * 0.56, s * 1.1);
      ctx.fillStyle = '#d9a441';
      ctx.fillRect(-s * 0.28, -s * 0.15, s * 0.56, s * 0.3);
      ctx.fillStyle = g.dark;
      ctx.fillRect(-s * 0.16, -s * 0.8, s * 0.32, s * 0.28);
      break;
    }
    case 'kacang': {
      ctx.beginPath();
      ctx.ellipse(-s * 0.22, -s * 0.1, s * 0.3, s * 0.42, 0.5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(s * 0.28, s * 0.15, s * 0.3, s * 0.42, -0.5, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      break;
    }
    case 'lontong': {
      ctx.save();
      ctx.rotate(0.5);
      ctx.fillRect(-s * 0.6, -s * 0.3, s * 1.2, s * 0.6);
      ctx.strokeRect(-s * 0.6, -s * 0.3, s * 1.2, s * 0.6);
      ctx.strokeStyle = '#2f7d3a';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(i * s * 0.35, -s * 0.3);
        ctx.lineTo(i * s * 0.35, s * 0.3);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }
    default:
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
  }
  ctx.restore();
}

function drawCustomer(ctx, cust, x, y, s, patienceShare, waiting) {
  // Tubuh
  ctx.fillStyle = cust.shirt;
  rr(ctx, x - 34 * s, y, 68 * s, 78 * s, 12 * s);
  ctx.fill();
  // Kepala
  ctx.fillStyle = cust.skin;
  ctx.beginPath();
  ctx.arc(x, y - 28 * s, 26 * s, 0, Math.PI * 2);
  ctx.fill();
  // Topi / rambut sesuai pelanggan
  ctx.fillStyle = cust.shirt;
  if (cust.hat === 'peci') {
    ctx.fillRect(x - 22 * s, y - 52 * s, 44 * s, 12 * s);
  } else if (cust.hat === 'topi') {
    ctx.beginPath();
    ctx.ellipse(x, y - 48 * s, 30 * s, 8 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 18 * s, y - 66 * s, 36 * s, 18 * s);
  } else if (cust.hat === 'pita') {
    ctx.beginPath();
    ctx.moveTo(x - 26 * s, y - 46 * s);
    ctx.lineTo(x - 8 * s, y - 52 * s);
    ctx.lineTo(x - 26 * s, y - 58 * s);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 26 * s, y - 46 * s);
    ctx.lineTo(x + 8 * s, y - 52 * s);
    ctx.lineTo(x + 26 * s, y - 58 * s);
    ctx.closePath();
    ctx.fill();
  } else if (cust.hat === 'sanggul') {
    ctx.beginPath();
    ctx.arc(x, y - 52 * s, 10 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - 26 * s, y - 56 * s, 52 * s, 10 * s);
  }
  // Mata
  ctx.fillStyle = '#241a12';
  ctx.beginPath();
  ctx.arc(x - 9 * s, y - 30 * s, 2.6 * s, 0, Math.PI * 2);
  ctx.arc(x + 9 * s, y - 30 * s, 2.6 * s, 0, Math.PI * 2);
  ctx.fill();
  // Mulut: senyum bila sabar, cemberut bila hampir habis
  ctx.strokeStyle = '#241a12';
  ctx.lineWidth = 2.2 * s;
  ctx.beginPath();
  if (patienceShare > 0.35) {
    ctx.arc(x, y - 22 * s, 8 * s, 0.15 * Math.PI, 0.85 * Math.PI);
  } else {
    ctx.arc(x, y - 12 * s, 8 * s, 1.15 * Math.PI, 1.85 * Math.PI);
  }
  ctx.stroke();
  // Bar sabar di atas kepala
  const bw = 74 * s;
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  rr(ctx, x - bw / 2, y - 74 * s, bw, 8 * s, 4 * s);
  ctx.fill();
  ctx.fillStyle = patienceShare > 0.5 ? '#7ddb6a' : patienceShare > 0.25 ? '#ffcf3d' : '#e33d2e';
  rr(ctx, x - bw / 2 + 1, y - 74 * s + 1, (bw - 2) * Math.max(0, patienceShare), 6 * s, 3 * s);
  ctx.fill();
  // Nama
  text(ctx, cust.name, x, y + 92 * s, 13 * s, '#ffe9c4', 'center', 'bold');
  if (waiting) {
    text(ctx, '…', x + 30 * s, y - 60 * s, 26, '#fff', 'center', 'bold');
  }
}

function drawNightSky(ctx, t) {
  const sky = ctx.createLinearGradient(0, 0, 0, 720);
  sky.addColorStop(0, '#1a2340');
  sky.addColorStop(0.45, '#4a2b4d');
  sky.addColorStop(0.75, '#8a4a2e');
  sky.addColorStop(1, '#c97b33');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 1280, 720);
  // Bintang
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 40; i++) {
    const sx = (i * 173) % 1280;
    const sy = (i * 97) % 180;
    const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.7 + i));
    ctx.globalAlpha = tw * 0.8;
    ctx.fillRect(sx, sy, 2.4, 2.4);
  }
  ctx.globalAlpha = 1;
  // Bulan
  ctx.beginPath();
  ctx.arc(1120, 84, 42, 0, Math.PI * 2);
  ctx.fillStyle = '#ffeec2';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(1106, 74, 34, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(26,35,64,0.55)';
  ctx.fill();
  // Lampu gantung pasar malam
  for (let i = 0; i < 9; i++) {
    const lx = 60 + i * 145;
    const sway = Math.sin(t * 0.9 + i * 1.3) * 4;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lx, 0);
    ctx.lineTo(lx + sway, 34);
    ctx.stroke();
    const cols = ['#ff5a4e', '#ffcf3d', '#7ddb6a', '#5ab8ff'];
    ctx.fillStyle = cols[i % 4];
    ctx.beginPath();
    ctx.arc(lx + sway, 44, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,220,120,0.25)';
    ctx.beginPath();
    ctx.arc(lx + sway, 44, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawOrderTicket(ctx, order, x, y, w, h, index) {
  const urgent = order.patience / order.maxPatience < 0.3;
  ctx.fillStyle = urgent ? '#fff1f1' : '#fff8e7';
  rr(ctx, x, y, w, h, 10);
  ctx.fill();
  ctx.strokeStyle = urgent ? '#e33d2e' : '#d9b06a';
  ctx.lineWidth = urgent ? 3 : 2;
  ctx.stroke();
  // Nomor dan nama resep
  ctx.fillStyle = '#e33d2e';
  ctx.beginPath();
  ctx.arc(x + 22, y + 22, 14, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, String(index + 1), x + 22, y + 23, 15, '#fff', 'center', 'bold');
  text(ctx, order.recipe.name, x + 44, y + 22, 16, '#3a2412', 'left', 'bold');
  // Langkah resep sebagai gambar bahan berurutan
  const stepW = (w - 24) / Math.max(3, order.recipe.steps.length);
  order.recipe.steps.forEach((id, i) => {
    const cx = x + 18 + stepW * i + stepW / 2;
    drawIngredient(ctx, id, cx, y + 50, 15);
    if (i < order.recipe.steps.length - 1) {
      text(ctx, '›', cx + stepW / 2, y + 50, 18, '#8a6a3a', 'center', 'bold');
    }
  });
  // Api yang diminta
  const flame = FLAMES[order.recipe.heat - 1];
  text(ctx, `Api: ${flame.name}`, x + 14, y + 74, 13, '#7a4a1a', 'left', 'bold');
  text(ctx, `+${order.recipe.base} RASA`, x + w - 14, y + 74, 13, '#2f7d3a', 'right', 'bold');
  // Bar sabar
  const share = Math.max(0, order.patience / order.maxPatience);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  rr(ctx, x + 12, y + h - 13, w - 24, 8, 4);
  ctx.fill();
  ctx.fillStyle = share > 0.5 ? '#7ddb6a' : share > 0.25 ? '#ffcf3d' : '#e33d2e';
  rr(ctx, x + 13, y + h - 12, (w - 26) * share, 6, 3);
  ctx.fill();
}

function drawGrill(ctx, world, t) {
  const L = LAYOUT.grill;
  // Meja panggangan
  ctx.fillStyle = '#4a2f1d';
  rr(ctx, L.x - 14, L.y - 8, L.w + 28, L.h + 26, 12);
  ctx.fill();
  ctx.fillStyle = '#5d3a22';
  rr(ctx, L.x - 8, L.y - 2, L.w + 16, L.h + 14, 10);
  ctx.fill();
  // Bara
  const glow = world.grill ? 0.5 + 0.5 * Math.sin(t * 6) * 0.15 : 0.25;
  for (let i = 0; i < 9; i++) {
    const bx = L.x + 30 + i * 42;
    const by = L.y + L.h - 42 + Math.sin(i * 2.1) * 5;
    const pulse = 10 + Math.sin(t * 5 + i) * 3;
    ctx.beginPath();
    ctx.arc(bx, by, pulse + 6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239, 125, 46, ${0.25 + glow * 0.3})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx, by, pulse, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? '#e33d2e' : '#ff8c2e';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx - 3, by - 3, pulse * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd94d';
    ctx.fill();
  }
  // Sate di atas bara
  if (world.grill) {
    const g = world.grill;
    const skewerY = L.y + 52;
    ctx.strokeStyle = '#d9b06a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(L.x + 24, skewerY);
    ctx.lineTo(L.x + L.w - 24, skewerY);
    ctx.stroke();
    g.recipe.steps.forEach((id, i) => {
      const cx = L.x + 70 + i * ((L.w - 140) / Math.max(1, g.recipe.steps.length - 1 || 1));
      const burn = Math.max(0, (g.cook - 0.85) / 0.15);
      drawIngredient(ctx, id, cx, skewerY, 20);
      if (burn > 0) {
        ctx.fillStyle = `rgba(20,10,5,${burn * 0.75})`;
        ctx.beginPath();
        ctx.arc(cx, skewerY, 17, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    // Meteran masak
    const flame = FLAMES[g.flame - 1];
    const [lo, hi] = flame.perfect;
    const mx = L.x + 20, mw = L.w - 40, my = L.y + L.h - 18;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    rr(ctx, mx, my, mw, 12, 6);
    ctx.fill();
    ctx.fillStyle = '#7ddb6a';
    rr(ctx, mx + mw * lo, my + 1, mw * (hi - lo), 10, 5);
    ctx.fill();
    ctx.fillStyle = g.cook >= lo && g.cook <= hi ? '#ffd94d' : '#ff8c2e';
    rr(ctx, mx + 1, my + 1, (mw - 2) * Math.min(1, g.cook), 10, 5);
    ctx.fill();
    text(ctx, g.cook >= lo && g.cook <= hi ? 'SEMPURNA! ANGKAT!' : g.cook < lo ? 'Masih mentah…' : 'Cepat angkat!', L.x + L.w / 2, L.y + 16, 13, '#ffe9c4', 'center', 'bold');
  } else {
    text(ctx, 'Panggangan kosong — tusuk bahan dulu', L.x + L.w / 2, L.y + 60, 15, 'rgba(255,233,196,0.75)', 'center', 'bold');
    text(ctx, 'Lalu sate naik ke sini sendiri', L.x + L.w / 2, L.y + 86, 13, 'rgba(255,233,196,0.5)', 'center', 'bold');
  }
}

function drawSkewerBoard(ctx, world) {
  const B = LAYOUT.skewerBoard;
  ctx.fillStyle = '#6b4423';
  rr(ctx, B.x, B.y, B.w, B.h, 10);
  ctx.fill();
  ctx.fillStyle = '#8a5a30';
  rr(ctx, B.x + 4, B.y + 4, B.w - 8, B.h - 8, 8);
  ctx.fill();
  text(ctx, 'TUSUKAN:', B.x + 14, B.y + B.h / 2, 14, '#ffe9c4', 'left', 'bold');
  const recipe = world.skewerRecipe;
  if (!world.skewer.length && !recipe) {
    text(ctx, 'Klik bahan di bawah sesuai resep →', B.x + 120, B.y + B.h / 2, 14, 'rgba(255,233,196,0.7)', 'left', 'bold');
    return;
  }
  const steps = recipe ? recipe.steps : [];
  const startX = B.x + 130;
  const stepW = (B.w - 150) / Math.max(1, steps.length);
  steps.forEach((id, i) => {
    const cx = startX + stepW * i + stepW / 2;
    if (i < world.skewer.length) {
      drawIngredient(ctx, id, cx, B.y + B.h / 2, 16);
    } else {
      ctx.globalAlpha = 0.35;
      drawIngredient(ctx, id, cx, B.y + B.h / 2, 16);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, B.y + B.h / 2, 19, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    if (i < steps.length - 1) text(ctx, '›', cx + stepW / 2, B.y + B.h / 2, 16, '#ffe9c4', 'center', 'bold');
  });
  if (recipe) text(ctx, recipe.name, B.x + B.w - 12, B.y + 14, 11, '#ffd94d', 'right', 'bold');
}

function drawPlate(ctx, world) {
  const P = LAYOUT.plate;
  ctx.fillStyle = '#3a2412';
  rr(ctx, P.x, P.y, P.w, P.h, 12);
  ctx.fill();
  text(ctx, 'PIRING SAJI', P.x + P.w / 2, P.y + 20, 13, '#ffe9c4', 'center', 'bold');
  // Piring putih
  ctx.beginPath();
  ctx.ellipse(P.x + P.w / 2, P.y + 86, 74, 46, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fdf6e3';
  ctx.fill();
  ctx.strokeStyle = '#d9b06a';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(P.x + P.w / 2, P.y + 86, 52, 30, 0, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(217,176,106,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  if (world.plate) {
    const r = world.plate.recipe;
    ctx.strokeStyle = '#d9b06a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(P.x + 30, P.y + 86);
    ctx.lineTo(P.x + P.w - 30, P.y + 86);
    ctx.stroke();
    r.steps.forEach((id, i) => {
      const cx = P.x + 52 + i * ((P.w - 104) / Math.max(1, r.steps.length - 1 || 1));
      drawIngredient(ctx, id, cx, P.y + 86, 17);
    });
    text(ctx, r.name, P.x + P.w / 2, P.y + P.h - 16, 13, '#ffe9c4', 'center', 'bold');
    if (world.plate.perfect) {
      text(ctx, '★ SEMPURNA ★', P.x + P.w / 2, P.y + P.h - 36, 12, '#ffd94d', 'center', 'bold');
    }
  } else {
    text(ctx, 'Belum ada hidangan', P.x + P.w / 2, P.y + 86, 13, 'rgba(255,233,196,0.6)', 'center', 'bold');
  }
}

function drawButton(ctx, box, label, sub, enabled, hover) {
  ctx.fillStyle = enabled ? (hover ? '#ffb03a' : '#f28c1e') : 'rgba(120,100,80,0.7)';
  rr(ctx, box.x, box.y, box.w, box.h, 12);
  ctx.fill();
  ctx.strokeStyle = enabled ? '#ffd94d' : 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, label, box.x + box.w / 2, box.y + box.h / 2 - (sub ? 10 : 0), 20, enabled ? '#2a1608' : 'rgba(255,255,255,0.5)', 'center', 'bold');
  if (sub) text(ctx, sub, box.x + box.w / 2, box.y + box.h / 2 + 16, 12, enabled ? '#5b2f0e' : 'rgba(255,255,255,0.4)', 'center', 'bold');
}

function drawBins(ctx, world, hover) {
  LAYOUT.bins.forEach((bin) => {
    const g = ING_BY_ID[bin.id];
    const isHover = hover.x >= bin.x && hover.x <= bin.x + bin.w && hover.y >= bin.y && hover.y <= bin.y + bin.h;
    const nextSet = world.skewerCandidates && world.screen === 'play'
      ? [...new Set(world.skewerCandidates.map((r) => r.steps[world.skewer.length]).filter(Boolean))]
      : [];
    const isNext = nextSet.includes(bin.id);
    ctx.fillStyle = isNext ? '#7a4a1a' : '#4a2f1d';
    rr(ctx, bin.x, bin.y, bin.w, bin.h, 10);
    ctx.fill();
    ctx.strokeStyle = isNext ? '#ffd94d' : isHover ? '#ffb03a' : '#6b4423';
    ctx.lineWidth = isNext ? 3 : 2;
    ctx.stroke();
    drawIngredient(ctx, bin.id, bin.x + bin.w / 2, bin.y + 34, 22);
    text(ctx, g.name, bin.x + bin.w / 2, bin.y + 66, 14, '#ffe9c4', 'center', 'bold');
    text(ctx, `[${g.key}]`, bin.x + bin.w - 10, bin.y + 16, 11, 'rgba(255,233,196,0.6)', 'right', 'bold');
    if (isNext) text(ctx, 'BERIKUTNYA', bin.x + bin.w / 2, bin.y + 84, 10, '#ffd94d', 'center', 'bold');
  });
}

function drawHud(ctx, world) {
  const cfg = shiftConfig(world);
  ctx.fillStyle = 'rgba(20,12,6,0.85)';
  ctx.fillRect(0, 0, 1280, 64);
  ctx.fillStyle = '#f28c1e';
  ctx.fillRect(0, 64, 1280, 3);
  text(ctx, cfg.name.toUpperCase(), 24, 34, 20, '#ffd94d', 'left', 'bold');
  // Timer shift
  const t = Math.max(0, Math.ceil(world.timeLeft));
  const mm = Math.floor(t / 60);
  const ss = String(t % 60).padStart(2, '0');
  const low = world.timeLeft < 20;
  text(ctx, `WAKTU ${mm}:${ss}`, 640, 26, 22, low ? '#ff6a5e' : '#fff', 'center', 'bold');
  // Target
  const pct = Math.min(1, world.coins / cfg.target);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  rr(ctx, 520, 44, 240, 10, 5);
  ctx.fill();
  ctx.fillStyle = pct >= 1 ? '#7ddb6a' : '#ffd94d';
  rr(ctx, 521, 45, 238 * pct, 8, 4);
  ctx.fill();
  text(ctx, `Target ${cfg.target} RASA`, 640, 60, 10, '#ffe9c4', 'center', 'bold');
  // Koin dan hati
  coinIcon(ctx, 1000, 26, 15);
  text(ctx, `${world.coins} ${COIN_NAME}`, 1022, 26, 20, '#ffd94d', 'left', 'bold');
  for (let i = 0; i < world.maxHearts; i++) {
    heart(ctx, 1120 + i * 30, 26, 22, i < world.hearts);
  }
  // Tombol suara: pengeras suara digambar, garis silang bila bisu.
  const M = LAYOUT.mute;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  rr(ctx, M.x, M.y, M.w, M.h, 8);
  ctx.fill();
  const mx = M.x + 16, my = M.y + M.h / 2;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(mx, my - 5);
  ctx.lineTo(mx + 8, my - 10);
  ctx.lineTo(mx + 8, my + 10);
  ctx.lineTo(mx, my + 5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  if (world.muted) {
    ctx.beginPath();
    ctx.moveTo(mx + 14, my - 8);
    ctx.lineTo(mx + 26, my + 8);
    ctx.moveTo(mx + 26, my - 8);
    ctx.lineTo(mx + 14, my + 8);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(mx + 10, my, 9, -0.9, 0.9);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mx + 10, my, 14, -0.8, 0.8);
    ctx.stroke();
  }
}

function drawPlay(ctx, world, t, hover) {
  drawNightSky(ctx, t);
  // Dinding lapak dan meja kayu
  ctx.fillStyle = '#2c1c10';
  ctx.fillRect(0, 250, 1280, 470);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, 250, 1280, 14);
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(0, 264, 1280, 8);
  // Papan pesanan (kiri)
  ctx.fillStyle = '#3a2412';
  rr(ctx, 16, 76, 288, 340, 12);
  ctx.fill();
  ctx.strokeStyle = '#d9b06a';
  ctx.lineWidth = 2;
  ctx.stroke();
  text(ctx, 'PAPAN PESANAN', 160, 100, 16, '#ffd94d', 'center', 'bold');
  if (!world.orders.length) {
    text(ctx, 'Belum ada pesanan…', 160, 200, 14, 'rgba(255,233,196,0.7)', 'center', 'bold');
  }
  world.orders.forEach((o, i) => drawOrderTicket(ctx, o, 28, 116 + i * 100, 264, 94, i));
  // Pelanggan berdiri di belakang meja
  world.orders.forEach((o, i) => {
    const cx = 430 + i * 190;
    drawCustomer(ctx, o.customer, cx, 170, 1, Math.max(0, o.patience / o.maxPatience), true);
  });
  if (!world.orders.length) {
    text(ctx, 'Pelanggan segera datang…', 640, 200, 15, 'rgba(255,233,196,0.6)', 'center', 'bold');
  }
  // Papan tusuk + panggangan + piring + tombol
  drawSkewerBoard(ctx, world);
  drawGrill(ctx, world, t);
  drawPlate(ctx, world);
  // Tombol angkat / sajikan / buang
  const canLift = !!world.grill && world.grill.cook >= FLAMES[world.grill.flame - 1].perfect[0];
  drawButton(ctx, LAYOUT.lift, 'ANGKAT', 'dari panggangan', canLift, hoverIn(hover, LAYOUT.lift));
  drawButton(ctx, LAYOUT.serve, 'SAJIKAN', 'Spasi — ke pelanggan', !!world.plate, hoverIn(hover, LAYOUT.serve));
  drawButton(ctx, LAYOUT.trash, 'BUANG', 'tusukan / sate', !!(world.skewer.length || world.grill || world.plate), hoverIn(hover, LAYOUT.trash));
  // Tombol api
  FLAMES.forEach((f, i) => {
    const box = LAYOUT.flames[i];
    const active = world.grill && world.grill.flame === f.level;
    ctx.fillStyle = active ? f.color : 'rgba(120,90,60,0.8)';
    rr(ctx, box.x, box.y, box.w, box.h, 10);
    ctx.fill();
    ctx.strokeStyle = active ? '#ffd94d' : 'rgba(255,255,255,0.25)';
    ctx.lineWidth = active ? 3 : 2;
    ctx.stroke();
    text(ctx, f.name, box.x + box.w / 2, box.y + box.h / 2, 14, active ? '#2a1608' : '#ffe9c4', 'center', 'bold');
  });
  drawBins(ctx, world, hover);
  drawHud(ctx, world);
  // Pesan tengah layar
  if (world.message && world.elapsed < world.messageUntil) {
    ctx.font = 'bold 17px Verdana, sans-serif';
    const w = ctx.measureText(world.message).width + 48;
    ctx.fillStyle = 'rgba(20,12,6,0.85)';
    rr(ctx, 640 - w / 2, 300, w, 44, 22);
    ctx.fill();
    text(ctx, world.message, 640, 322, 17, '#ffd94d', 'center', 'bold');
  }
  // Asap
  world.smoke.forEach((p) => {
    ctx.fillStyle = `rgba(220,220,220,${Math.max(0, p.life * 0.35)})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8 + (1.6 - p.life) * 10, 0, Math.PI * 2);
    ctx.fill();
  });
  // Angka koin melayang
  world.floaters.forEach((f) => {
    text(ctx, f.text, f.x, f.y, 22, f.color, 'center', 'bold');
  });
  // Goyang layar saat salah tusuk
  if (world.elapsed < world.shakeUntil) {
    ctx.fillStyle = 'rgba(227,61,46,0.12)';
    ctx.fillRect(0, 0, 1280, 720);
  }
}

function hoverIn(hover, box) {
  return hover.x >= box.x && hover.x <= box.x + box.w && hover.y >= box.y && hover.y <= box.y + box.h;
}

function drawTitle(ctx, world, t) {
  drawNightSky(ctx, t);
  // Lapak di bawah
  ctx.fillStyle = '#2c1c10';
  ctx.fillRect(0, 480, 1280, 240);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, 480, 1280, 12);
  drawGrill(ctx, { ...world, grill: null }, t);
  // Papan nama besar
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  rr(ctx, 190, 96, 900, 300, 18);
  ctx.fill();
  ctx.strokeStyle = '#d9b06a';
  ctx.lineWidth = 3;
  ctx.stroke();
  text(ctx, 'SATE SENJA', 640, 168, 76, '#ffd94d', 'center', 'bold', 'Georgia, serif');
  text(ctx, '— Tusuk, Bakar, Saji —', 640, 226, 26, '#ffb03a', 'center', 'bold', 'Georgia, serif');
  text(ctx, 'Game masak pasar malam: rakit sate sesuai resep, atur api arang,', 640, 272, 17, '#ffe9c4', 'center', 'bold');
  text(ctx, 'dan sajikan sebelum pelanggan kehabisan sabar.', 640, 298, 17, '#ffe9c4', 'center', 'bold');
  // MENANG / KALAH tertulis di layar
  ctx.fillStyle = 'rgba(125,219,106,0.16)';
  rr(ctx, 240, 322, 390, 56, 10);
  ctx.fill();
  text(ctx, 'MENANG: kumpulkan target RASA', 435, 340, 15, '#7ddb6a', 'center', 'bold');
  text(ctx, 'di 3 shift malam.', 435, 362, 15, '#7ddb6a', 'center', 'bold');
  ctx.fillStyle = 'rgba(227,61,46,0.16)';
  rr(ctx, 650, 322, 390, 56, 10);
  ctx.fill();
  text(ctx, 'KALAH: hati habis karena pelanggan', 845, 340, 15, '#ff8a7a', 'center', 'bold');
  text(ctx, 'pergi, atau target tak tercapai.', 845, 362, 15, '#ff8a7a', 'center', 'bold');
  // Tombol mulai
  const B = LAYOUT.startButton;
  const pulse = 0.85 + 0.15 * Math.sin(t * 3);
  ctx.save();
  ctx.globalAlpha = pulse;
  drawButton(ctx, B, 'MULAI MASAK', 'klik atau tekan Enter', true, false);
  ctx.restore();
  text(ctx, 'Klik bahan (atau tombol 1–8) • Q/W/E atur api • Spasi sajikan • M bisukan suara', 640, 660, 14, 'rgba(255,233,196,0.8)', 'center', 'bold');
  text(ctx, 'Dapur orisinal — nama, gambar, dan bunyi dibuat sendiri untuk make.fun', 640, 688, 12, 'rgba(255,233,196,0.5)', 'center', 'bold');
}

function drawShop(ctx, world, t) {
  drawNightSky(ctx, t);
  ctx.fillStyle = 'rgba(20,12,6,0.78)';
  ctx.fillRect(0, 0, 1280, 720);
  const next = SHIFTS[world.shiftIndex + 1];
  text(ctx, 'ISTIRAHAT SEBENTAR', 640, 70, 30, '#ffd94d', 'center', 'bold', 'Georgia, serif');
  text(ctx, `Shift selesai! Koin RASA kamu: ${world.coins}  •  Berikutnya: ${next ? next.name : '—'} (target ${next ? next.target : '—'} RASA)`, 640, 112, 17, '#ffe9c4', 'center', 'bold');
  text(ctx, 'Belanjakan koinmu untuk upgrade — atau simpan untuk skor akhir.', 640, 140, 14, 'rgba(255,233,196,0.75)', 'center', 'bold');
  UPGRADES.forEach((up, i) => {
    const box = LAYOUT.shopCards[i];
    const owned = world.ownedUpgrades.includes(up.id);
    const afford = world.coins >= up.cost;
    ctx.fillStyle = owned ? 'rgba(125,219,106,0.18)' : '#3a2412';
    rr(ctx, box.x, box.y, box.w, box.h, 14);
    ctx.fill();
    ctx.strokeStyle = owned ? '#7ddb6a' : afford ? '#ffd94d' : 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();
    text(ctx, up.id === 'arang-super' ? 'API' : up.id === 'senyum' ? 'SENYUM' : 'HATI', box.x + box.w / 2, box.y + 52, 34, '#ffd94d', 'center', 'bold');
    text(ctx, up.name, box.x + box.w / 2, box.y + 108, 20, '#fff', 'center', 'bold');
    // Bungkus deskripsi
    const words = up.desc.split(' ');
    let line = '';
    let ly = box.y + 150;
    const lines = [];
    words.forEach((w) => {
      if ((line + ' ' + w).trim().length > 26) { lines.push(line.trim()); line = w; }
      else line += ' ' + w;
    });
    lines.push(line.trim());
    lines.forEach((ln) => { text(ctx, ln, box.x + box.w / 2, ly, 14, '#ffe9c4', 'center', 'bold'); ly += 22; });
    text(ctx, owned ? 'SUDAH DIBELI' : `${up.cost} RASA  [${i + 1}]`, box.x + box.w / 2, box.y + box.h - 40, 18, owned ? '#7ddb6a' : afford ? '#ffd94d' : '#ff8a7a', 'center', 'bold');
  });
  drawButton(ctx, LAYOUT.nextShiftButton, 'LANJUT SHIFT', 'Enter', true, false);
  if (world.message && world.elapsed < world.messageUntil) {
    text(ctx, world.message, 640, 690, 16, '#ff8a7a', 'center', 'bold');
  }
}

function drawStatsGrid(ctx, world, y0) {
  const s = world.stats;
  const rows = [
    ['Hidangan disajikan', String(s.served)],
    ['Sajian sempurna', String(s.perfect)],
    ['Sate gosong', String(s.burnt)],
    ['Pelanggan pergi', String(s.expired)],
    ['Tusukan salah', String(s.wrong)],
    ['Total RASA didapat', String(s.earned)],
  ];
  rows.forEach(([label, val], i) => {
    const y = y0 + i * 34;
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)';
    rr(ctx, 400, y - 15, 480, 30, 8);
    ctx.fill();
    text(ctx, label, 420, y, 16, '#ffe9c4', 'left', 'bold');
    text(ctx, val, 860, y, 16, '#ffd94d', 'right', 'bold');
  });
}

function drawWin(ctx, world, t) {
  drawNightSky(ctx, t);
  ctx.fillStyle = 'rgba(20,12,6,0.8)';
  ctx.fillRect(0, 0, 1280, 720);
  text(ctx, 'LAPAK TUTUP — KAMU MENANG!', 640, 80, 40, '#ffd94d', 'center', 'bold', 'Georgia, serif');
  text(ctx, 'Tiga shift malam dilewati. Pelanggan pulang kenyang, lapak Sate Senja jadi buah bibir pasar.', 640, 122, 16, '#ffe9c4', 'center', 'bold');
  // Piala
  ctx.fillStyle = '#ffd94d';
  ctx.beginPath();
  ctx.moveTo(590, 150);
  ctx.lineTo(690, 150);
  ctx.lineTo(678, 210);
  ctx.quadraticCurveTo(640, 240, 602, 210);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#b8860b';
  ctx.fillRect(628, 236, 24, 14);
  ctx.fillRect(606, 250, 68, 10);
  text(ctx, `GRADE ${world.grade || 'A'}`, 640, 300, 44, '#ffd94d', 'center', 'bold', 'Georgia, serif');
  text(ctx, `Total koin RASA: ${world.coins}`, 640, 340, 20, '#fff', 'center', 'bold');
  drawStatsGrid(ctx, world, 390);
  const B = LAYOUT.againButton;
  drawButton(ctx, B, 'MAIN LAGI', 'Enter — shift baru, resep baru', true, false);
}

function drawLose(ctx, world, t) {
  drawNightSky(ctx, t);
  ctx.fillStyle = 'rgba(20,12,6,0.82)';
  ctx.fillRect(0, 0, 1280, 720);
  const reason = world.hearts <= 0
    ? 'Semua hati habis — pelanggan pergi satu per satu.'
    : 'Waktu habis dan target RASA tidak tercapai.';
  text(ctx, 'LAPAK TUTUP LEBIH AWAL', 640, 80, 40, '#ff8a7a', 'center', 'bold', 'Georgia, serif');
  text(ctx, reason, 640, 122, 17, '#ffe9c4', 'center', 'bold');
  text(ctx, `Kamu berhenti di ${SHIFTS[world.shiftIndex].name} dengan ${world.coins} RASA.`, 640, 152, 16, '#ffe9c4', 'center', 'bold');
  // Piring kosong
  ctx.beginPath();
  ctx.ellipse(640, 230, 90, 56, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fdf6e3';
  ctx.fill();
  ctx.strokeStyle = '#d9b06a';
  ctx.lineWidth = 3;
  ctx.stroke();
  text(ctx, 'piring kosong…', 640, 232, 16, '#8a6a3a', 'center', 'bold');
  drawStatsGrid(ctx, world, 320);
  const B = LAYOUT.againButton;
  drawButton(ctx, B, 'COBA LAGI', 'Enter — mulai dari Shift 1', true, false);
}

export function render(ctx, world, t, hover) {
  ctx.clearRect(0, 0, 1280, 720);
  if (world.screen === 'title') drawTitle(ctx, world, t);
  else if (world.screen === 'play') drawPlay(ctx, world, t, hover);
  else if (world.screen === 'shop') drawShop(ctx, world, t);
  else if (world.screen === 'win') drawWin(ctx, world, t);
  else if (world.screen === 'lose') drawLose(ctx, world, t);
}
