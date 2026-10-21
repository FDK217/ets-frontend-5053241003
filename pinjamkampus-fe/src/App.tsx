import { useEffect, useRef, useState } from 'react'
import { deletePeminjaman, getPeminjamanList, getSumberDaya, pesanError } from './api/pinjam'
import DetailPeminjaman from './components/DetailPeminjaman'
import FilterPeminjaman from './components/FilterPeminjaman'
import PeminjamanForm from './components/PeminjamanForm'
import PeminjamanList from './components/PeminjamanList'
import SumberDayaForm from './components/SumberDayaForm'
import SumberDayaList from './components/SumberDayaList'
import { FILTER_KOSONG } from './types'
import type { Peminjaman, SumberDaya } from './types'

// Persona yang diundi: D (Panitia acara)
export default function App() {
  const [sumberDaya, setSumberDaya] = useState<SumberDaya[]>([])
  const [peminjaman, setPeminjaman] = useState<Peminjaman[]>([])
  const [filter, setFilter] = useState(FILTER_KOSONG)
  const [muatSd, setMuatSd] = useState(true)
  const [muatPm, setMuatPm] = useState(true)
  const [errorSd, setErrorSd] = useState('')
  const [errorPm, setErrorPm] = useState('')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [reload, setReload] = useState(0) // dinaikkan untuk memaksa ambil ulang daftar peminjaman
  const [diedit, setDiedit] = useState<Peminjaman | null>(null) // null = form dalam mode buat
  const [formKey, setFormKey] = useState(0) // berubah => form dibuat ulang dengan isian baru
  const [menghapus, setMenghapus] = useState<number[]>([])
  const [errorAksi, setErrorAksi] = useState('')
  const hapusBerjalan = useRef<Set<number>>(new Set()) // penjaga klik ganda pada Hapus

  // Ambil daftar sumber daya sekali saat halaman dibuka
  useEffect(() => {
    let batal = false
    getSumberDaya()
      .then((data) => {
        if (!batal) setSumberDaya(data)
      })
      .catch((err) => {
        if (!batal) setErrorSd(pesanError(err))
      })
      .finally(() => {
        if (!batal) setMuatSd(false)
      })
    return () => {
      batal = true
    }
  }, [])

  // Ambil peminjaman; ulangi setiap filter berubah atau reload dinaikkan.
  // Filter diproses SERVER lewat query string.
  useEffect(() => {
    let batal = false
    setMuatPm(true)
    setErrorPm('')
    getPeminjamanList(filter)
      .then((data) => {
        if (!batal) setPeminjaman(data)
      })
      .catch((err) => {
        if (!batal) setErrorPm(pesanError(err))
      })
      .finally(() => {
        if (!batal) setMuatPm(false)
      })
    return () => {
      batal = true
    }
  }, [filter, reload])

  function handleSumberDayaBaru(baru: SumberDaya) {
    setSumberDaya((lama) => [...lama, baru]) // array baru, tidak memutasi
  }

  function muatUlang() {
    setReload((n) => n + 1)
  }

  function keluarModeEdit() {
    setDiedit(null)
    setFormKey((n) => n + 1)
  }

  function handleEdit(p: Peminjaman) {
    setErrorAksi('')
    setDiedit(p)
    setFormKey((n) => n + 1)
  }

  function handleSaved() {
    setErrorAksi('')
    keluarModeEdit()
    muatUlang()
  }

  async function handleHapus(id: number) {
    if (hapusBerjalan.current.has(id)) return
    hapusBerjalan.current.add(id)
    setMenghapus((lama) => [...lama, id])
    setErrorAksi('')
    try {
      await deletePeminjaman(id)
      if (detailId === id) setDetailId(null)
      if (diedit?.id === id) keluarModeEdit()
    } catch (err) {
      setErrorAksi(pesanError(err))
    } finally {
      hapusBerjalan.current.delete(id)
      setMenghapus((lama) => lama.filter((x) => x !== id))
      muatUlang() // berhasil atau gagal (mis. 404): samakan dengan server
    }
  }

  return (
    <main>
      <h1>PinjamKampus</h1>
      {(muatSd || muatPm) && <p>Memuat...</p>}
      {(errorSd || errorPm) && <p role="alert">{errorSd || errorPm}</p>}

      <SumberDayaForm onCreated={handleSumberDayaBaru} />
      <SumberDayaList items={sumberDaya} />

      <PeminjamanForm
        key={formKey}
        sumberDaya={sumberDaya}
        awal={diedit}
        onSaved={handleSaved}
        onBatalEdit={keluarModeEdit}
      />

      <h2>Daftar peminjaman</h2>
      <FilterPeminjaman filter={filter} sumberDaya={sumberDaya} onChange={setFilter} />
      {errorAksi && <p role="alert">{errorAksi}</p>}
      <PeminjamanList
        items={peminjaman}
        sumberDaya={sumberDaya}
        menghapus={menghapus}
        onDetail={setDetailId}
        onEdit={handleEdit}
        onHapus={handleHapus}
      />
      {detailId !== null && <DetailPeminjaman id={detailId} versi={reload} sumberDaya={sumberDaya} />}
    </main>
  )
}
