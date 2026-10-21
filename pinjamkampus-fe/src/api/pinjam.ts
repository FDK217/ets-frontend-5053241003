import type {
  FilterPeminjaman,
  Peminjaman,
  PeminjamanInput,
  SumberDaya,
  SumberDayaInput,
} from '../types'

const BASE_URL = 'http://localhost:8080'

// Error dari server (400/404/409). Pesannya ditulis server untuk pengguna.
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, options)
  } catch {
    // fetch hanya melempar error jika server tidak terjangkau
    throw new Error('Terjadi error: gagal menghubungi server. Coba lagi nanti.')
  }

  if (!res.ok) {
    let pesan = `Terjadi error pada server (status ${res.status}).`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) pesan = body.error
    } catch {
      // body bukan JSON: pakai pesan bawaan di atas
    }
    throw new ApiError(res.status, pesan)
  }

  if (res.status === 204) return undefined as T
  return (await res.json()) as T
}

function jsonBody(data: unknown, method: 'POST' | 'PUT' = 'POST'): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

// Mengubah error apa pun menjadi teks yang aman ditampilkan
export function pesanError(e: unknown): string {
  return e instanceof Error ? e.message : 'Terjadi error yang tidak diketahui.'
}

// ---------- Sumber daya (F1) ----------
export function getSumberDaya(): Promise<SumberDaya[]> {
  return request<SumberDaya[]>('/sumber-daya')
}

export function createSumberDaya(data: SumberDayaInput): Promise<SumberDaya> {
  return request<SumberDaya>('/sumber-daya', jsonBody(data))
}

// ---------- Peminjaman (F2, F3) ----------
export function getPeminjamanList(filter: FilterPeminjaman): Promise<Peminjaman[]> {
  const params = new URLSearchParams()
  if (filter.sumber_daya_id) params.set('sumber_daya_id', filter.sumber_daya_id)
  if (filter.tanggal) params.set('tanggal', filter.tanggal)
  if (filter.status) params.set('status', filter.status)
  const qs = params.toString()
  return request<Peminjaman[]>(`/peminjaman${qs ? `?${qs}` : ''}`)
}

export function getPeminjaman(id: number): Promise<Peminjaman> {
  return request<Peminjaman>(`/peminjaman/${id}`)
}

export function createPeminjaman(data: PeminjamanInput): Promise<Peminjaman> {
  return request<Peminjaman>('/peminjaman', jsonBody(data))
}

// ---------- Ubah dan hapus (F6) ----------
export function updatePeminjaman(id: number, data: PeminjamanInput): Promise<Peminjaman> {
  return request<Peminjaman>(`/peminjaman/${id}`, jsonBody(data, 'PUT'))
}

export function deletePeminjaman(id: number): Promise<void> {
  return request<void>(`/peminjaman/${id}`, { method: 'DELETE' })
}
