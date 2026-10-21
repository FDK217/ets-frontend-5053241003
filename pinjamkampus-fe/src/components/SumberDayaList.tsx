import type { SumberDaya } from '../types'

interface Props {
  items: SumberDaya[]
}

export default function SumberDayaList({ items }: Props) {
  return (
    <section>
      <h2>Sumber daya ({items.length})</h2>
      <ul aria-label="Daftar sumber daya">
        {items.map((sd) => (
          <li key={sd.id}>
            <strong>{sd.nama}</strong> <span>{sd.jenis}</span> <span>stok {sd.stok}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
