# AI-LOG

Catat setiap penggunaan AI yang menghasilkan kode. Jika tidak memakai AI sama sekali, tulis satu baris: **tidak memakai AI**.

Log yang jujur tidak mengurangi nilai, sebanyak apa pun AI dipakai. Yang mengurangi nilai adalah log yang tidak sesuai dengan kode, atau isi log yang tidak bisa kamu jelaskan.

## Tipe data, lapisan API, dan validasi (F1-F3)
- Prompt: "Kerjakan F1-F3 ETS PinjamKampus persona D dari scratch dengan React + TypeScript, tanpa library terlarang, lalu buat tutorial bertahap." (Claude)
- Dipakai: `src/types.ts` (tipe `SumberDaya`, `Peminjaman`, `*Input`, `FilterPeminjaman`), `src/api/pinjam.ts` (`request<T>`, `ApiError`, `pesanError`, fungsi GET/POST), `src/validasi.ts` (`bilanganBulat`, `tanggalValid`).
- Diubah: tidak ada revisi setelah pengujian di browser. Pesan kegagalan jaringan sengaja memuat kata "error" dan "gagal" sesuai aturan F4.

## F1 Kelola sumber daya
- Prompt: sama dengan entri di atas (bagian F1).
- Dipakai: `SumberDayaForm.tsx` (form terkendali, validasi, POST) dan `SumberDayaList.tsx`.
- Diubah: kolom isian semula dibungkus `<label>`; setelah ditinjau diganti `<label htmlFor>` + `id` sebagai pencegahan, karena label yang membungkus `<select>` ikut membawa teks opsi sehingga pencarian elemen berdasarkan teks label bisa tidak cocok.

## F2 Buat peminjaman
- Prompt: sama dengan entri di atas (bagian F2).
- Dipakai: `PeminjamanForm.tsx` (objek state `form`, fungsi `ubah`, validasi berurutan, POST, kosongkan form hanya setelah berhasil).
- Diubah: pola `<label htmlFor>` seperti F1. Pengujian otomatis dengan tanggal `2026-02-30` ditolak browser sebelum sampai ke validasi, jadi `tanggalValid` dipertahankan untuk kasus lain dan pesannya digabung ("wajib diisi dengan tanggal yang valid").

## F3 Daftar peminjaman, filter, detail
- Prompt: sama dengan entri di atas (bagian F3).
- Dipakai: `App.tsx` (dua `useEffect`: sekali untuk sumber daya, dan `[filter, reload]` untuk peminjaman), `FilterPeminjaman.tsx`, `PeminjamanList.tsx`, `DetailPeminjaman.tsx` (dengan flag `batal` pada cleanup).
- Diubah: saat server mati semula muncul dua `role="alert"` identik (satu per pengambilan data); digabung menjadi satu (`errorSd || errorPm`).