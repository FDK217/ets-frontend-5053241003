export type Jenis = 'ruang' | 'alat'

export interface SumberDaya {
  id: number
  nama: string
  jenis: Jenis
  stok: number
}

// Data yang DIKIRIM ke server saat membuat sumber daya (tanpa id)
export interface SumberDayaInput {
  nama: string
  jenis: Jenis
  stok: number
}

export interface Peminjaman {
  id: number
  sumber_daya_id: number
  peminjam: string
  tanggal: string
  slot_mulai: number
  slot_selesai: number
  jumlah: number
  status: string
}

// Data yang DIKIRIM ke server saat membuat/mengganti peminjaman
export interface PeminjamanInput {
  sumber_daya_id: number
  peminjam: string
  tanggal: string
  slot_mulai: number
  slot_selesai: number
  jumlah: number
}

// Nilai filter disimpan sebagai string karena berasal dari <select>/<input>
export interface FilterPeminjaman {
  sumber_daya_id: string
  tanggal: string
  status: string
}

export const FILTER_KOSONG: FilterPeminjaman = {
  sumber_daya_id: '',
  tanggal: '',
  status: '',
}

export const STATUS_MENAHAN_SLOT = ['aktif', 'diajukan', 'disetujui']
