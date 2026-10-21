import type { FilterPeminjaman as Filter, SumberDaya } from '../types'

interface Props {
  filter: Filter
  sumberDaya: SumberDaya[]
  onChange: (filter: Filter) => void
}

const STATUS_PERSONA_D = ['aktif', 'dibatalkan']

export default function FilterPeminjaman({ filter, sumberDaya, onChange }: Props) {
  return (
    <div>
      <label htmlFor="f-sd">Filter sumber daya</label>
        <select id="f-sd"
          value={filter.sumber_daya_id}
          onChange={(e) => onChange({ ...filter, sumber_daya_id: e.target.value })}
        >
          <option value="">Semua</option>
          {sumberDaya.map((sd) => (
            <option key={sd.id} value={sd.id}>
              {sd.nama}
            </option>
          ))}
        </select>
      <label htmlFor="f-tanggal">Filter tanggal</label>
        <input id="f-tanggal"
          type="date"
          value={filter.tanggal}
          onChange={(e) => onChange({ ...filter, tanggal: e.target.value })}
        />
      <label htmlFor="f-status">Filter status</label>
        <select id="f-status" value={filter.status} onChange={(e) => onChange({ ...filter, status: e.target.value })}>
          <option value="">Semua</option>
          {STATUS_PERSONA_D.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
    </div>
  )
}
