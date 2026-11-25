# Sate Senja — Tusuk, Bakar, Saji

[![make.fun](https://img.shields.io/badge/make.fun-bounty-blue)](https://make.fun/bounty/best-cooking-game-20261125-0137)
[![game](https://img.shields.io/badge/game-Sate%20Senja-orange)](https://github.com/BGBug22/best-cooking-game-20261125-0137-entry)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/BGBug22/best-cooking-game-20261125-0137-entry/blob/main/LICENSE)

Game masak pasar malam untuk bounty **best-cooking-game-20261125-0137**
di [make.fun](https://make.fun/bounty/best-cooking-game-20261125-0137).
Buka `game/index.html` di desktop Chrome — tanpa jaringan, tanpa build.

## Satu kalimat

**Tusuk bahan sesuai resep, atur api arang, dan sajikan sebelum pelanggan
kehabisan sabar.**

## Cara main

1. **Tusuk** — klik bahan di meja (atau tombol `1`–`8`) mengikuti urutan
   resep di papan pesanan. Bahan yang harus ditusuk berikutnya menyala kuning.
2. **Bakar** — tusukan yang lengkap naik sendiri ke panggangan. Atur api
   (`Q` kecil / `W` sedang / `E` besar): api besar cepat matang tapi zona
   sempurnanya sempit; api kecil lambat tapi aman.
3. **Angkat & sajikan** — tekan tombol **ANGKAT** saat meteran masuk zona
   hijau, lalu **SAJIKAN** (`Spasi`) ke pelanggan yang memesan hidangan itu.
   Sajian sempurna di zona hijau memberi bonus koin.

## Menang dan kalah

- **MENANG:** kumpulkan target koin **RASA** di tiga shift malam
  (60 → 120 → 190). Antar shift ada toko upgrade: Arang Super, Senyum
  Pelanggan, dan Hati Tambahan.
- **KALAH:** hati habis karena pelanggan pergi kecewa, atau waktu shift
  habis sebelum target tercapai. Sate yang gosong harus dibuang.

## Isi game

- 12 resep warung (Sate Ayam Manis, Sate Senja Spesial, dan lain-lain),
  8 bahan, 3 tingkat api dengan zona sempurna berbeda.
- 3 shift dengan pesanan makin cepat dan pelanggan makin tak sabar.
- Pelanggan bernama (Bu Ratna, Pak Dedi, Mbak Sari, …) dengan bar sabar.
- Bunyi disintesis WebAudio: desis panggangan, denting koin, bel pesanan.
- Layar judul, toko antar shift, layar menang (grade S/A/B/C + statistik),
  dan layar kalah — semua lengkap dengan tombol main lagi.

## Main lokal

```sh
node serve.ts
# buka http://localhost:8080
```

## Struktur

- `game/index.html` — halaman game
- `game/src/config.js` — bahan, resep, shift, upgrade
- `game/src/world.js` — aturan main dan keadaan permainan
- `game/src/render.js` — semua gambar (canvas 2D prosedural)
- `game/src/audio.js` — bunyi WebAudio
- `game/src/input.js` — mouse dan keyboard
- `game/src/shots.js` — adegan untuk screenshot
- `game/src/main.js` — loop utama
- `main.ts` — pengantar entry (menyalin game + screenshot, menulis dossier)
- `vendor/makefun-game.ts` — pustaka make.fun dari kit, tanpa perubahan

Nama, gambar, dan bunyi dalam game ini orisinal, dibuat untuk bounty ini.
