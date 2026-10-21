# Pertemuan 1 — Perkenalan: Setup Repo, Project React + TypeScript, & Program Pertama

Tugas ini bersifat **onboarding**: memastikan environment (Node.js, IDE, akses git organization) siap, kalian terbiasa dengan alur git yang dipakai sepanjang semester, **dan** sudah pernah melihat langsung struktur sebuah project React + TypeScript (Vite) — sebelum masuk lebih dalam ke JSX di pertemuan 2. Kompleksitas *kode* sengaja ringan (kalian belum diminta menulis JSX sendiri) — tapi **semua 5 level dicek otomatis lewat `npm run levels`**, termasuk bagian yang biasanya reflektif (penjelasan di README.md di root repo kalian). Ikuti persis nama fungsi dan nama heading README yang diminta — pengecekan otomatis mencocokkan teks/perilaku secara presisi, bukan menilai "kira-kira sudah benar".

Nilai mengikuti **level tertinggi yang lolos test secara berurutan** (kalau Level 3 gagal, Level 5 tidak dihitung meski lolos) — kerjakan sejauh kemampuan. Kalian **boleh mengerjakan tidak berurutan** (mis. Level 3 dulu sebelum Level 1/2) — `npm run levels` tetap menunjukkan level mana saja yang benar-benar sudah lolos apa adanya. Tapi untuk nilai akhir, tetap usahakan level dasar (terutama Level 1–3) beres duluan, karena Level 4 secara khusus mencocokkan isi kode dengan README Level 1 — tidak akan lolos kalau Level 1 belum diisi.

## Cara Kerja Folder Ini

Ini **project Vite + React + TypeScript sungguhan** — sama jenisnya dengan yang akan kalian pakai sepanjang semester (mulai pertemuan 2 kalian akan menulis JSX-nya sendiri). Semua file di folder ini **sudah ada** (ikut ter-fetch bersama folder `pertemuan-01/`) — tidak perlu disalin dari mana pun.

```bash
cd pertemuan-01
npm install       # sekali di awal
npm run dev       # lihat progresmu di browser (App.tsx merender hasil identitas.ts)
npm run levels    # cek level mana yang sudah lolos
npm run build     # pastikan project tetap bisa di-build
```

Semua level akan **gagal (FAIL)** di awal — itu normal, kalian belum mengedit apa-apa. Jalankan ulang `npm run levels` tiap kali selesai mengedit `src/identitas.ts` atau `README.md` (di root repo) untuk melihat level mana yang sudah lolos.

**Jangan edit `src/__tests__/levels.test.ts` maupun `src/App.tsx`/`src/main.tsx`** — App.tsx dan main.tsx sudah lengkap sengaja (belum waktunya kalian menulis JSX, itu materi pertemuan 2), dan perubahan di file test tidak berpengaruh saat penilaian (dosen menimpa ulang file ini dengan versi asli). Dosen memantau progres dengan menjalankan `npm run levels` yang sama terhadap kode yang kalian push — tidak ada CI/GitHub Actions, jadi tidak perlu setup apa pun selain langkah di atas.

Level 1 dan 2 diisi di **`README.md` milik repo kalian sendiri** (bukan file di folder ini) — heading yang dicek sudah disiapkan di sana.

---

## Level 1 — Kenalan Struktur Project & Identitas

Buka (baca saja, **jangan diedit**) `index.html`, `src/main.tsx`, dan `src/App.tsx` — ini kali pertama kalian melihat langsung susunan sebuah project React + TypeScript. Lalu isi **dua** bagian di README:

- `## Struktur Project`: jelaskan dengan bahasamu sendiri (minimal ±60 karakter) apa peran `main.tsx` dan apa peran `App.tsx` masing-masing.
- `## Identitas`: isi Nama, NRP (angka asli kalian), dan Kelas.

**Dicek otomatis:** `## Struktur Project` terisi memadai dan menyebut `main.tsx` dan `App.tsx`; `## Identitas` — `Nama:` dan `Kelas:` terisi (bukan teks contoh), `NRP:` berupa angka.

## Level 2 — Penjelasan Commit vs Push

Isi `## Commit vs Push`: jelaskan dengan bahasamu sendiri (minimal ±40 karakter) apa bedanya `git commit` dan `git push`, dan beri satu contoh situasi nyata seseorang commit tapi lupa push — apa akibatnya bagi rekan satu tim?

**Dicek otomatis:** section terisi memadai dan menyebut kata "commit" dan "push".

## Level 3 — Fungsi `resolveNama`

Di `pertemuan-01/src/identitas.ts`, implementasikan:
```ts
export function resolveNama(args: string[], fallback: string): string
```
Kembalikan `args[0]` kalau `args` tidak kosong, kalau tidak kembalikan `fallback`.

**Dicek otomatis:** `resolveNama([], "fallback")` harus `"fallback"`; `resolveNama(["Budi"], "fallback")` harus `"Budi"`.

## Level 4 — Konstanta `NRP`

Ganti nilai `export const NRP = '0000000000'` di `identitas.ts` dengan NRP kalian sungguhan — **harus sama persis** dengan yang ditulis di README bagian Identitas.

**Dicek otomatis:** `NRP` berformat angka, dan nilainya harus ditemukan di dalam section `## Identitas` README.

## Level 5 — Fungsi `cetakInfo`

Implementasikan:
```ts
export function cetakInfo(nama: string): string
```
Kembalikan string yang memuat `nama`, `NRP`, dan hasil `process.version`, misalnya:
```
Nama: Budi
NRP: 5025201012
v22.14.0
```

**Dicek otomatis:** `cetakInfo("Budi")` harus memuat `"Budi"`, memuat `NRP`, dan memuat pola versi Node (`v<angka>.<angka>.<angka>`).

Sampai di sini, jalankan `npm run dev` dan buka alamat yang muncul di terminal (biasanya `http://localhost:5173`) — pastikan halamannya tampil tanpa error dan menunjukkan hasil `resolveNama`/`cetakInfo` kalian. Coba juga ubah sedikit teks apa pun di dalam `<h1>` pada `App.tsx`, simpan filenya, lalu lihat browser: halaman ter-update **otomatis tanpa reload manual** — itu namanya *Hot Module Replacement* (HMR), salah satu alasan Vite terasa cepat untuk development (langkah ini tidak dicek otomatis, cukup dicoba sendiri).
