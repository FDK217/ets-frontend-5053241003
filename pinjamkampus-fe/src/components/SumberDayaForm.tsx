import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { createSumberDaya, pesanError } from '../api/pinjam'
import type { Jenis, SumberDaya } from '../types'
import { bilanganBulat } from '../validasi'

interface Props {
  onCreated: (baru: SumberDaya) => void
}

export default function SumberDayaForm({ onCreated }: Props) {
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState<Jenis>('ruang')
  const [stok, setStok] = useState('')
  const [error, setError] = useState('')
  const [menyimpan, setMenyimpan] = useState(false)
  const sedangKirim = useRef(false) // penjaga langsung (state baru berubah setelah render)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sedangKirim.current) return
    setError('')

    const namaBersih = nama.trim()
    const stokAngka = bilanganBulat(stok)
    if (namaBersih === '') return setError('Nama sumber daya wajib diisi.')
    if (namaBersih.length > 50) return setError('Nama sumber daya maksimal 50 karakter.')
    if (stokAngka === null || stokAngka < 1) return setError('Stok harus bilangan bulat minimal 1.')

    sedangKirim.current = true
    setMenyimpan(true)
    try {
      const baru = await createSumberDaya({ nama: namaBersih, jenis, stok: stokAngka })
      onCreated(baru)
      setNama('')
      setJenis('ruang')
      setStok('')
    } catch (err) {
      setError(pesanError(err)) // isian tidak dikosongkan saat gagal
    } finally {
      sedangKirim.current = false
      setMenyimpan(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Tambah sumber daya</h2>
      <div>
        <label htmlFor="sd-nama">Nama sumber daya</label>
          <input id="sd-nama" type="text" value={nama} onChange={(e) => setNama(e.target.value)} />
      </div>
      <div>
        <label htmlFor="sd-jenis">Jenis</label>
          <select id="sd-jenis" value={jenis} onChange={(e) => setJenis(e.target.value as Jenis)}>
            <option value="ruang">ruang</option>
            <option value="alat">alat</option>
          </select>
      </div>
      <div>
        <label htmlFor="sd-stok">Stok</label>
          <input id="sd-stok" type="number" value={stok} onChange={(e) => setStok(e.target.value)} />
      </div>
      <button type="submit" disabled={menyimpan}>
        Simpan sumber daya
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
