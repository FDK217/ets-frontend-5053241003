import { useEffect, useState } from 'react'
import { getPeminjaman, pesanError } from '../api/pinjam'
import type { Peminjaman, SumberDaya } from '../types'

interface Props {
  id: number
  versi: number // naik setiap data berubah, memicu ambil ulang detail
  sumberDaya: SumberDaya[]
}

export default function DetailPeminjaman({ id, versi, sumberDaya }: Props) {
  const [data, setData] = useState<Peminjaman | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let batal = false // mencegah respons lama menimpa pilihan yang lebih baru
    setData(null)
    setError('')
    getPeminjaman(id)
      .then((hasil) => {
        if (!batal) setData(hasil)
      })
      .catch((err) => {
        if (!batal) setError(pesanError(err))
      })
    return () => {
      batal = true
    }
  }, [id, versi])

  const namaSd = data ? (sumberDaya.find((s) => s.id === data.sumber_daya_id)?.nama ?? `#${data.sumber_daya_id}`) : ''

  return (
    <section aria-label="Detail peminjaman">
      <h2>Detail</h2>
      {error && <p role="alert">{error}</p>}
      {!data && !error && <p>Memuat detail...</p>}
      {data && (
        <dl>
          <dt>Peminjam</dt>
          <dd>{data.peminjam}</dd>
          <dt>Sumber daya</dt>
          <dd>{namaSd}</dd>
          <dt>Tanggal</dt>
          <dd>{data.tanggal}</dd>
          <dt>Slot</dt>
          <dd>
            Slot {data.slot_mulai}-{data.slot_selesai}
          </dd>
          <dt>Jumlah</dt>
          <dd>{data.jumlah}</dd>
          <dt>Status</dt>
          <dd>{data.status}</dd>
        </dl>
      )}
    </section>
  )
}
