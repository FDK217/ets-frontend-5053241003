import { NRP, resolveNama, cetakInfo } from './identitas'

// File ini sudah lengkap, TIDAK perlu diedit untuk lolos level manapun -
// ini contoh nyata komponen React (function component) yang akan resmi
// kalian pelajari cara menulisnya di pertemuan 2. Untuk sekarang, cukup
// baca: App merender hasil dari fungsi-fungsi yang kalian isi di
// src/identitas.ts, supaya progresmu kelihatan langsung di browser lewat
// `npm run dev`.
function App() {
  const namaDenganArgs = resolveNama(['Budi'], NRP)
  const namaFallback = resolveNama([], NRP)

  return (
    <main>
      <h1>Pertemuan 1 — Kenalan Project React + TypeScript</h1>
      <p>
        Halaman ini berubah seiring level yang kamu selesaikan di{' '}
        <code>src/identitas.ts</code>. Jalankan <code>npm run levels</code> untuk
        cek progres formal.
      </p>

      <h2>Level 3 — resolveNama</h2>
      <p>
        resolveNama(['Budi'], NRP) → <code>{namaDenganArgs}</code>
      </p>
      <p>
        resolveNama([], NRP) → <code>{namaFallback}</code>
      </p>

      <h2>Level 5 — cetakInfo</h2>
      <pre>{cetakInfo(namaFallback)}</pre>
    </main>
  )
}

export default App
