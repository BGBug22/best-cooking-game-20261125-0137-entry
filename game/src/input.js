// Sate Senja — masukan pemain: klik mouse dan tombol keyboard.
// Modul ini hanya mencatat "apa yang ditekan di mana", tanpa aturan main.

export function createInput(canvas) {
  const input = {
    mouseX: 0,
    mouseY: 0,
    // Klik yang belum dibaca oleh loop game (dikonsumsi sekali).
    clicks: [],
    keys: [],
    hoverX: 0,
    hoverY: 0,
  };

  function toGame(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 1280,
      y: ((e.clientY - rect.top) / rect.height) * 720,
    };
  }

  canvas.addEventListener('mousemove', (e) => {
    const p = toGame(e);
    input.mouseX = p.x;
    input.mouseY = p.y;
    input.hoverX = p.x;
    input.hoverY = p.y;
  });

  canvas.addEventListener('click', (e) => {
    const p = toGame(e);
    input.clicks.push({ x: p.x, y: p.y });
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    input.keys.push(k);
    if ([' ', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
  });

  // Ambil dan kosongkan semua klik sejak frame terakhir.
  input.takeClicks = () => {
    const out = input.clicks;
    input.clicks = [];
    return out;
  };

  input.takeKeys = () => {
    const out = input.keys;
    input.keys = [];
    return out;
  };

  // Apakah sebuah titik klik jatuh di dalam kotak ini?
  input.hit = (click, box) =>
    click.x >= box.x && click.x <= box.x + box.w &&
    click.y >= box.y && click.y <= box.y + box.h;

  return input;
}
