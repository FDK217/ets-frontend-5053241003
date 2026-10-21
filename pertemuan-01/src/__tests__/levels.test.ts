// File ini disediakan dosen untuk mengecek progres level secara otomatis.
// JANGAN DIUBAH — perubahan pada file ini tidak akan dipakai saat penilaian
// (dosen menimpa ulang file ini sebelum menjalankan grading).
import { readFileSync } from 'node:fs'
import { test, expect } from 'vitest'

import { NRP, resolveNama, cetakInfo } from '../identitas'

function readFile(path: string): string {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return ''
  }
}

function section(readme: string, heading: string): string {
  const headingRe = /^##\s+(.+?)\s*$/gim
  const matches = [...readme.matchAll(headingRe)]
  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].trim().toLowerCase() === heading.toLowerCase()) {
      const start = matches[i].index! + matches[i][0].length
      const end = i + 1 < matches.length ? matches[i + 1].index! : readme.length
      return readme.slice(start, end).trim()
    }
  }
  return ''
}

function filled(text: string, minLen: number): boolean {
  const t = text.trim()
  if (t === '' || t.toLowerCase() === '(tulis di sini)') return false
  return t.length >= minLen
}

test('Level 1 - Kenalan Struktur Project & Identitas di README', () => {
  const readme = readFile('../README.md')

  const struktur = section(readme, 'Struktur Project')
  expect(
    filled(struktur, 60),
    "section '## Struktur Project' belum diisi memadai (minimal 60 karakter)",
  ).toBe(true)
  const lowStruktur = struktur.toLowerCase()
  for (const kata of ['main.tsx', 'app.tsx']) {
    expect(lowStruktur.includes(kata), `penjelasan harus menyebut ${kata}`).toBe(true)
  }

  const ident = section(readme, 'Identitas')
  expect(ident, "section '## Identitas' tidak ditemukan di README.md").not.toBe('')

  expect(
    /NRP:\s*\d{6,12}/.test(ident),
    "NRP belum diisi dengan format angka yang benar, mis. 'NRP: 5025201012'",
  ).toBe(true)

  const namaMatch = /Nama:\s*(.+)/i.exec(ident)
  const namaOk =
    namaMatch !== null &&
    namaMatch[1].trim() !== '' &&
    !namaMatch[1].toLowerCase().includes('nama lengkap')
  expect(namaOk, 'Nama belum diisi dengan nama asli').toBe(true)

  const kelasMatch = /Kelas:\s*(.+)/i.exec(ident)
  expect(
    kelasMatch !== null && kelasMatch[1].trim() !== '',
    'Kelas belum diisi',
  ).toBe(true)
})

test('Level 2 - Penjelasan Commit vs Push', () => {
  const readme = readFile('../README.md')
  const s = section(readme, 'Commit vs Push')
  expect(
    filled(s, 40),
    `section '## Commit vs Push' belum diisi memadai (minimal 40 karakter, saat ini ${s.trim().length})`,
  ).toBe(true)
  const low = s.toLowerCase()
  expect(
    low.includes('commit') && low.includes('push'),
    "penjelasan harus menyebut kata 'commit' dan 'push'",
  ).toBe(true)
})

test('Level 3 - resolveNama berfungsi benar', () => {
  expect(resolveNama([], 'fallback')).toBe('fallback')
  expect(resolveNama(['Budi'], 'fallback')).toBe('Budi')
})

test('Level 4 - NRP di kode cocok dengan README', () => {
  expect(
    /^\d{6,12}$/.test(NRP),
    'konstanta NRP di identitas.ts belum diganti dari nilai default',
  ).toBe(true)
  const readme = readFile('../README.md')
  const ident = section(readme, 'Identitas')
  expect(
    ident.includes(NRP),
    `NRP di identitas.ts (${NRP}) tidak sama dengan NRP di README.md bagian Identitas`,
  ).toBe(true)
})

test('Level 5 - cetakInfo mencetak versi Node', () => {
  const out = cetakInfo('Budi')
  expect(out.includes('Budi'), 'cetakInfo harus memuat nama yang diberikan').toBe(true)
  expect(out.includes(NRP), 'cetakInfo harus memuat NRP').toBe(true)
  expect(
    /v\d+\.\d+\.\d+/.test(out),
    "cetakInfo harus memuat hasil process.version, mis. 'v22.14.0'",
  ).toBe(true)
})
