// Fungsi validasi murni (tanpa React) supaya mudah dijelaskan dan diuji.

export function bilanganBulat(teks: string): number | null {
  const t = teks.trim()
  if (!/^-?\d+$/.test(t)) return null
  return Number(t)
}

// "2026-02-30" lolos format tetapi bukan tanggal yang ada -> false
export function tanggalValid(teks: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(teks)) return false
  const [y, m, d] = teks.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return (
    dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
  )
}
