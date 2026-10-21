import { STATUS_MENAHAN_SLOT } from '../types'
import type { Peminjaman, SumberDaya } from '../types'

interface Props {
  items: Peminjaman[]
  sumberDaya: SumberDaya[]
  menghapus: number[] // id yang sedang dihapus (tombolnya dinonaktifkan)
  onDetail: (id: number) => void
  onEdit: (p: Peminjaman) => void
  onHapus: (id: number) => void
}

export default function PeminjamanList({ items, sumberDaya, menghapus, onDetail, onEdit, onHapus }: Props) {
  function namaSumberDaya(id: number): string {
    return sumberDaya.find((sd) => sd.id === id)?.nama ?? `#${id}`
  }

  return (
    <section>
      <h2>Peminjaman ({items.length})</h2>
      <ul aria-label="Daftar peminjaman">
        {items.map((p) => (
          <li key={p.id}>
            <strong>{p.peminjam}</strong> <span>{namaSumberDaya(p.sumber_daya_id)}</span>{' '}
            <span>{p.tanggal}</span> <span>Slot {p.slot_mulai}-{p.slot_selesai}</span>{' '}
            <span>{p.jumlah}</span> <span>{p.status}</span>{' '}
            <button type="button" onClick={() => onDetail(p.id)}>
              Detail
            </button>
            {STATUS_MENAHAN_SLOT.includes(p.status) && (
              <button type="button" onClick={() => onEdit(p)}>
                Edit
              </button>
            )}
            <button type="button" onClick={() => onHapus(p.id)} disabled={menghapus.includes(p.id)}>
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
