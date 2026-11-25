// Sate Senja — pengantar entry untuk make.fun (Node 22, pustaka standar saja).
//
// Program ini menyerahkan game ke penilai: ia menyalin game/ dan screenshots/
// dari samping file ini ke direktori keluaran, lalu menulis dossier.json di
// sana dengan buildDossier dari vendor/makefun-game.ts. Di luar wadah penilai,
// MAKEFUN_OUTPUT_DIR menggantikan /output:
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Tidak ada jaringan, tidak ada dependensi, tidak ada langkah build: game
// adalah file statis yang dibuka desktop Chrome apa adanya.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'game'), join(outDir, 'game'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// Batas yang sama dengan yang dipakai penilai untuk menolak entry yang
// kebesaran: teks dossier 160 KiB, maksimal 4 screenshot @ 256 KiB,
// game/ maksimal 993 file dan 48 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
