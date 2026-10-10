# Library Loan API


**Responsi Praktikum Pemrograman Perangkat Bergerak, Modul 1 (API), Kelompok 18 Shift 03**

REST API sederhana untuk mencatat peminjaman buku perpustakaan oleh anggota. Dibuat dengan Node.js, Express.js, dan Supabase (PostgreSQL), lalu di-deploy ke Vercel.
## Link

| | URL |
|---|---|
| Repository GitHub | https://github.com/hafiyyandimas/Responsi_Mod1_PrakPBB_Kel18 |
| Base URL (Vercel) | https://responsimodul1kel18.vercel.app |
| Contoh endpoint | https://responsimodul1kel18.vercel.app/loans |

## Deskripsi dan Tujuan

Proyek ini menyediakan layanan backend untuk pencatatan peminjaman buku. Setiap data peminjaman menyimpan siapa anggota yang meminjam, judul buku, tanggal pinjam, batas pengembalian, tanggal kembali, dan status peminjaman.

Tujuan proyek:
- Menerapkan arsitektur RESTful API dengan operasi CRUD (Create, Read, Update, Delete).
- Menyediakan filter data melalui query string, misalnya `GET /loans?status=Terlambat`.
- Menghubungkan Express.js dengan database Supabase.
- Memisahkan kode ke dalam model, controller, dan route.
- Men-deploy API agar dapat diakses publik melalui Vercel.

## Teknologi

- Node.js dan Express.js
- Supabase (PostgreSQL) sebagai database
- Vercel untuk deployment
- Postman untuk pengujian

## Struktur Proyek

```
.
├── sql/
│   └── schema.sql              # query pembuatan tabel
├── src/
│   ├── config/supabaseClient.js
│   ├── models/loanModel.js         # akses database
│   ├── controllers/loanController.js  # validasi dan logika request
│   ├── routes/loanRoutes.js        # pemetaan URL ke controller
│   └── index.js                    # entry point server
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

## Struktur Data

Tabel `loans`:

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | uuid | Primary key, dibuat otomatis |
| `member_name` | text | Nama anggota peminjam (wajib) |
| `book_title` | text | Judul buku (wajib) |
| `loan_date` | date | Tanggal pinjam, default hari ini |
| `due_date` | date | Batas pengembalian (wajib) |
| `return_date` | date | Tanggal buku dikembalikan, boleh kosong |
| `status` | text | `Dipinjam` (default), `Dikembalikan`, atau `Terlambat` |
| `created_at` | timestamptz | Waktu data dibuat, otomatis |

Format tanggal: `YYYY-MM-DD`.

## Daftar Endpoint

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/` | Cek API berjalan |
| GET | `/loans` | Ambil semua data peminjaman |
| GET | `/loans?status=Terlambat` | Filter berdasarkan status |
| GET | `/loans?member_name=siti` | Cari berdasarkan nama anggota |
| GET | `/loans?book_title=basis` | Cari berdasarkan judul buku |
| GET | `/loans/:id` | Ambil satu data berdasarkan id |
| POST | `/loans` | Tambah data peminjaman |
| PUT | `/loans/:id` | Ubah data peminjaman |
| DELETE | `/loans/:id` | Hapus data peminjaman |

Query filter bisa digabung, contohnya `/loans?status=Terlambat&member_name=siti`.

## Contoh Request dan Response

### 1. Tambah peminjaman

`POST /loans`

Request body:
```json
{
  "member_name": "Hafiyyan Dimas",
  "book_title": "Pemrograman Perangkat Bergerak",
  "due_date": "2026-10-20"
}
```

Response `201 Created`:
```json
{
  "id": "5ac0f46f-75a2-436b-9d88-e64e6390597c",
  "member_name": "Hafiyyan Dimas",
  "book_title": "Pemrograman Perangkat Bergerak",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-20",
  "return_date": null,
  "status": "Dipinjam",
  "created_at": "2026-10-10T15:30:00.000Z"
}
```

### 2. Ambil semua peminjaman

`GET /loans`

Response `200 OK`:
```json
[
  {
    "id": "5ac0f46f-75a2-436b-9d88-e64e6390597c",
    "member_name": "Hafiyyan Dimas",
    "book_title": "Pemrograman Perangkat Bergerak",
    "loan_date": "2026-10-10",
    "due_date": "2026-10-20",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-10T15:30:00.000Z"
  }
]
```

### 3. Filter berdasarkan status

`GET /loans?status=Terlambat`

Response `200 OK`:
```json
[
  {
    "id": "08fc92db-c397-41ec-974f-ea40b024f32c",
    "member_name": "Siti Aminah",
    "book_title": "Basis Data Lanjut",
    "loan_date": "2026-09-20",
    "due_date": "2026-09-27",
    "return_date": null,
    "status": "Terlambat",
    "created_at": "2026-10-10T15:31:00.000Z"
  }
]
```

### 4. Ambil satu peminjaman

`GET /loans/5ac0f46f-75a2-436b-9d88-e64e6390597c`

Response `200 OK`: satu objek data seperti pada contoh di atas.

### 5. Ubah peminjaman

`PUT /loans/5ac0f46f-75a2-436b-9d88-e64e6390597c`

Request body (boleh sebagian field):
```json
{
  "status": "Dikembalikan",
  "return_date": "2026-10-12"
}
```

Response `200 OK`:
```json
{
  "id": "5ac0f46f-75a2-436b-9d88-e64e6390597c",
  "member_name": "Hafiyyan Dimas",
  "book_title": "Pemrograman Perangkat Bergerak",
  "loan_date": "2026-10-10",
  "due_date": "2026-10-20",
  "return_date": "2026-10-12",
  "status": "Dikembalikan",
  "created_at": "2026-10-10T15:30:00.000Z"
}
```

### 6. Hapus peminjaman

`DELETE /loans/5ac0f46f-75a2-436b-9d88-e64e6390597c`

Response `200 OK`:
```json
{
  "message": "Data peminjaman berhasil dihapus"
}
```

### Contoh response error

| Kondisi | Status | Response |
|---|---|---|
| Field wajib tidak diisi | 400 | `{"error": "Field 'book_title' wajib diisi"}` |
| Status tidak valid | 400 | `{"error": "Status harus salah satu dari: Dipinjam, Dikembalikan, Terlambat"}` |
| Format tanggal salah | 400 | `{"error": "Field 'due_date' harus berformat YYYY-MM-DD"}` |
| Id tidak ditemukan | 404 | `{"error": "Data peminjaman tidak ditemukan"}` |
| Endpoint tidak ada | 404 | `{"error": "Endpoint tidak ditemukan"}` |

## Instalasi dan Menjalankan Secara Lokal

### Prasyarat
- Node.js 18 atau lebih baru
- Akun Supabase (https://supabase.com)

### Langkah

1. Clone repository:
```bash
   git clone https://github.com/hafiyyandimas/Responsi_Mod1_PrakPBB_Kel18.git
   cd Responsi_Mod1_PrakPBB_Kel18
```

2. Install dependensi:
```bash
   npm install
```

3. Buat project di Supabase, lalu buka **SQL Editor**, **New query**, tempel isi file `sql/schema.sql`, dan klik **RUN**. Tabel `loans` akan terbentuk.

4. Ambil kredensial Supabase dari **Project Settings**: `Project URL` (menu Data API) dan API key (menu API Keys).

5. Salin `.env.example` menjadi `.env` lalu isi:
```
   SUPABASE_URL=<Project URL Supabase>
   SUPABASE_KEY=<API key Supabase>
   PORT=3000
```
   File `.env` sudah masuk `.gitignore`, jangan di-commit.

6. Jalankan server:
```bash
   npm run dev     # mode development (nodemon)
   npm start       # mode biasa
```
   Jika berhasil akan muncul pesan `Server running on port 3000`.

7. Uji di Postman atau browser, misalnya `http://localhost:3000/loans`.

## Deployment (Vercel)

1. Push proyek ke GitHub.
2. Di https://vercel.com, pilih **Add New**, **Project**, lalu import repository ini.
3. Pada **Environment Variables**, tambahkan `SUPABASE_URL` dan `SUPABASE_KEY`.
4. Klik **Deploy**.
5. API dapat diakses di: **https://responsimodul1kel18.vercel.app/loans**

Konfigurasi build ada di `vercel.json` (memakai `@vercel/node` dengan entry point `src/index.js`).
