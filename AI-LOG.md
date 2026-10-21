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

## F4 dan F5 Validasi, error server, dan bentrok 409
- Prompt: "Lanjutkan ke F4-F7 (kartu persona D sudah dilampirkan)." (Claude)
- Dipakai: validasi berurutan dengan `role="alert"` di `SumberDayaForm`/`PeminjamanForm`, `request<T>()` yang membaca `{"error": ...}` dan melempar `ApiError`, pesan "error ... gagal menghubungi server", form dikosongkan hanya setelah sukses.
- Diubah: tidak ada perubahan kode baru untuk F4/F5 pada tahap ini; yang ada dari F1-F3 diperiksa ulang dengan pengujian di browser (409 pada POST dan PUT menampilkan pesan server, isian tetap, daftar tidak berubah).

## F6 Ubah dan hapus
- Prompt: sama dengan entri di atas (bagian F6).
- Dipakai: `updatePeminjaman` (PUT) dan `deletePeminjaman` (DELETE) di `src/api/pinjam.ts`; prop `awal` pada `PeminjamanForm` untuk mode edit dengan `key={formKey}` di `App`; tombol Edit/Hapus di `PeminjamanList`; `handleEdit`, `handleSaved`, `handleHapus` di `App.tsx`; konstanta `STATUS_MENAHAN_SLOT` di `types.ts`.
- Diubah: dalam rancangan AI, setelah hapus detail yang sedang terbuka dibiarkan menampilkan 404; diubah supaya detail ditutup (`setDetailId(null)`) dan mode edit dibatalkan jika item yang dihapus sedang dibuka. Ditambah tombol "Batal edit" agar pengguna bisa keluar dari mode edit tanpa menyimpan.

## F7 Aman klik ganda dan data konsisten
- Prompt: sama dengan entri di atas (bagian F7).
- Dipakai: `useRef` (`sedangKirim`, `hapusBerjalan`) ditambah state `menyimpan`/`menghapus` untuk menonaktifkan tombol; `reload` dan prop `versi` pada `DetailPeminjaman` supaya daftar dan detail diambil ulang dari server setelah setiap aksi; `handleHapus` memanggil `muatUlang()` di `finally` (juga saat 404).
- Diubah: tidak ada revisi setelah pengujian. Pengujian di browser dengan `dblclick` pada Simpan sumber daya, Simpan peminjaman, Simpan perubahan, dan Hapus masing-masing hanya menghasilkan satu permintaan.