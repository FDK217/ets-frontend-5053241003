# PROSES

## 1. Persona dan masalahnya
Saya mengerjakan persona D, panitia acara. Panitia butuh aula, proyektor, dan sound system sekaligus untuk satu acara; kalau salah satunya sudah dipinjam orang lain, acaranya tidak bisa jalan. Fitur khasnya (peminjaman paket) dibuat supaya semua item dipesan dalam satu permintaan: semuanya berhasil atau tidak ada yang tercatat, jadi ruang tidak terlanjur terpesan sementara alatnya tidak ada.

## 2. Rancangan komponen dan state
Seluruh aplikasi berada di satu halaman. `App` memegang data yang dipakai bersama dan yang menentukan pengambilan data; setiap form memegang isiannya sendiri.

```
App 
├── SumberDayaForm      
├── SumberDayaList                                               
├── PeminjamanForm  
├── FilterPeminjaman                                             
├── PeminjamanList                                               
└── DetailPeminjaman    
```

| State | Disimpan di | Alasan |
|---|---|---|
| `sumberDaya[]` | `App` | dipakai daftar, form peminjaman, filter, dan daftar peminjaman (menampilkan nama) |
| `peminjaman[]`, `filter` | `App` | filter menentukan isi daftar dan memicu pengambilan data lewat `useEffect` |
| `muatSd`, `muatPm`, `errorSd`, `errorPm` | `App` | status pengambilan data awal dan ulang |
| `detailId` | `App` | tombol Detail di daftar menyetel, `DetailPeminjaman` membaca |
| isian form dan `error` form | di form masing-masing | hanya relevan untuk form itu |
| `data`, `error` detail | `DetailPeminjaman` | hasil GET detail hanya dipakai di situ |

Semua `fetch` ada di `src/api/pinjam.ts`; komponen hanya memanggil fungsinya. Validasi murni ada di `src/validasi.ts`.

## 3. Satu keputusan desain
Setelah peminjaman berhasil dibuat, daftar peminjaman diambil ulang dari server (`setReload(n => n + 1)` memicu `useEffect`), bukan sekadar menambahkan objek ke state. Pilihan lain adalah `setPeminjaman([...lama, baru])`. Saya memilih ambil ulang karena filter bisa sedang aktif: item baru yang tidak cocok dengan filter tidak boleh muncul, dan hanya server yang tahu itu. Dengan begitu tampilan selalu sama dengan data server. Harganya satu permintaan tambahan. Untuk sumber daya saya memakai `[...lama, baru]` dengan objek yang dikembalikan server, karena daftar itu tidak punya filter.

## 4. Bug atau kendala (minimal dua)
### Bug 1
- Gejala: saat server dimatikan lalu halaman dimuat ulang, muncul dua pesan error yang sama persis.
- Cara menemukan: menguji dengan server mati dan membaca semua elemen `role="alert"`.
- Penyebab dan solusi: pengambilan sumber daya dan pengambilan peminjaman punya state error masing-masing dan masing-masing dirender sebagai `<p role="alert">`. Saya render satu saja: `errorSd || errorPm`.

### Bug 2
- Gejala: mengisi Tanggal dengan `2026-02-30` lewat otomatisasi browser langsung gagal dengan "Malformed value", bukan memunculkan pesan validasi saya.
- Cara menemukan: uji otomatis di browser memasukkan tanggal itu ke `<input type="date">`.
- Penyebab dan solusi: browser sendiri menolak nilai tanggal yang tidak ada, sehingga input tetap kosong dan validasi saya melihat tanggal kosong. Fungsi `tanggalValid` tetap saya pertahankan (nilai bisa datang dari sumber lain), dan pesannya mencakup dua kasus: "Tanggal wajib diisi dengan tanggal yang valid."

## 5. Change request
(Belum diterima.)