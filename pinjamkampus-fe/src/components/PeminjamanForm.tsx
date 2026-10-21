import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createPeminjaman, pesanError, updatePeminjaman } from '../api/pinjam'
import type { Peminjaman, SumberDaya } from '../types'
import { bilanganBulat, tanggalValid } from '../validasi'

interface Props {
  sumberDaya: SumberDaya[]
  awal: Peminjaman | null // null = mode buat; berisi data = mode edit
  onSaved: () => void
  onBatalEdit: () => void
}

interface FormState {
  sumberDayaId: string
  peminjam: string
  tanggal: string
  slotMulai: string
  slotSelesai: string
  jumlah: string
}

const FORM_KOSONG: FormState = {
  sumberDayaId: '',
  peminjam: '',
  tanggal: '',
  slotMulai: '',
  slotSelesai: '',
  jumlah: '',
}

function dariPeminjaman(p: Peminjaman): FormState {
  return {
    sumberDayaId: String(p.sumber_daya_id),
    peminjam: p.peminjam,
    tanggal: p.tanggal,
    slotMulai: String(p.slot_mulai),
    slotSelesai: String(p.slot_selesai),
    jumlah: String(p.jumlah),
  }
}

export default function PeminjamanForm({ sumberDaya, awal, onSaved, onBatalEdit }: Props) {
  // Nilai awal dihitung sekali. App memberi `key` baru setiap masuk/keluar mode edit,
  // sehingga komponen dibuat ulang dengan isian yang benar.
  const [form, setForm] = useState<FormState>(awal ? dariPeminjaman(awal) : FORM_KOSONG)
  const [error, setError] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)
  const sedangKirim = useRef(false)
  const modeEdit = awal !== null

  // Satu fungsi untuk semua kolom: salin objek lama, ganti satu field (tanpa mutasi)
  function ubah(field: keyof FormState, nilai: string) {
    setForm((lama) => ({ ...lama, [field]: nilai }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sedangKirim.current) return // klik ganda: abaikan
    setError('')

    const peminjam = form.peminjam.trim()
    const sd = sumberDaya.find((s) => String(s.id) === form.sumberDayaId)
    const mulai = bilanganBulat(form.slotMulai)
    const selesai = bilanganBulat(form.slotSelesai)
    const jumlah = bilanganBulat(form.jumlah)

    if (!sd) return setError('Pilih sumber daya terlebih dahulu.')
    if (peminjam === '') return setError('Nama peminjam wajib diisi.')
    if (peminjam.length > 50) return setError('Nama peminjam maksimal 50 karakter.')
    if (!tanggalValid(form.tanggal)) return setError('Tanggal wajib diisi dengan tanggal yang valid.')
    if (mulai === null || mulai < 1 || mulai > 8) return setError('Slot mulai harus bilangan bulat 1 sampai 8.')
    if (selesai === null || selesai < 1 || selesai > 8) return setError('Slot selesai harus bilangan bulat 1 sampai 8.')
    if (selesai < mulai) return setError('Slot selesai tidak boleh lebih kecil dari slot mulai.')
    if (jumlah === null || jumlah < 1 || jumlah > sd.stok) {
      return setError(`Jumlah harus bilangan bulat antara 1 dan ${sd.stok}.`)
    }

    const data = {
      sumber_daya_id: sd.id,
      peminjam,
      tanggal: form.tanggal,
      slot_mulai: mulai,
      slot_selesai: selesai,
      jumlah,
    }

    sedangKirim.current = true
    setMenyimpan(true)
    try {
      if (awal) {
        await updatePeminjaman(awal.id, data) // PUT: mengganti keenam field
      } else {
        await createPeminjaman(data) // POST
      }
      setForm(FORM_KOSONG) // dikosongkan HANYA setelah berhasil
      onSaved() // App mengambil ulang daftar dan kembali ke mode buat
    } catch (err) {
      setError(pesanError(err)) // 400/404/409: isian dibiarkan, daftar tidak berubah
    } finally {
      sedangKirim.current = false
      setMenyimpan(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Form peminjaman</h2>
      <div>
        <label htmlFor="pm-sd">Sumber daya</label>
        <select id="pm-sd" value={form.sumberDayaId} onChange={(e) => ubah('sumberDayaId', e.target.value)}>
          <option value="">-- pilih --</option>
          {sumberDaya.map((sd) => (
            <option key={sd.id} value={sd.id}>
              {sd.nama}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="pm-peminjam">Peminjam</label>
        <input id="pm-peminjam" type="text" value={form.peminjam} onChange={(e) => ubah('peminjam', e.target.value)} />
      </div>
      <div>
        <label htmlFor="pm-tanggal">Tanggal</label>
        <input id="pm-tanggal" type="date" value={form.tanggal} onChange={(e) => ubah('tanggal', e.target.value)} />
      </div>
      <div>
        <label htmlFor="pm-mulai">Slot mulai</label>
        <input id="pm-mulai" type="number" value={form.slotMulai} onChange={(e) => ubah('slotMulai', e.target.value)} />
      </div>
      <div>
        <label htmlFor="pm-selesai">Slot selesai</label>
        <input id="pm-selesai" type="number" value={form.slotSelesai} onChange={(e) => ubah('slotSelesai', e.target.value)} />
      </div>
      <div>
        <label htmlFor="pm-jumlah">Jumlah</label>
        <input id="pm-jumlah" type="number" value={form.jumlah} onChange={(e) => ubah('jumlah', e.target.value)} />
      </div>
      <button type="submit" disabled={menyimpan}>
        {modeEdit ? 'Simpan perubahan' : 'Simpan peminjaman'}
      </button>
      {modeEdit && (
        <button type="button" onClick={onBatalEdit} disabled={menyimpan}>
          Batal edit
        </button>
      )}
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
