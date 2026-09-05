# 🗄️ PANDUAN LENGKAP DATABASE SISTEM TABUNGAN SISWA XII BR 1
### SMK PGRI 11 CILEDUG KOTA TANGERANG
**Wali Kelas:** Yoga Rahmanda, S.Pd.  
**Target Tabungan per Siswa:** Rp 2.000.000 (Dua Juta Rupiah)

---

## 📁 Berkas Database yang Tersedia

Di dalam folder `/database/`, telah disediakan berkas database siap pakai:

1. **`database_tabungan_xii_br1.sql`**  
   - Format: **MySQL / MariaDB / phpMyAdmin / Laragon / XAMPP**.
   - Berisi pembuatan database `db_tabungan_xii_br1`, tabel `admins`, `students` (44 Siswa XII BR 1), `transactions` (309+ mutasi), `wa_settings`, serta **SQL Views** rekapitulasi harian, bulanan, dan siswa.
2. **`database_tabungan_xii_br1_sqlite.sql`**  
   - Format: **SQLite 3**.
   - Kompatibel untuk aplikasi lokal, Python, Android, atau server ringan tanpa instalasi MySQL server.
3. **`database_tabungan_xii_br1.json`**  
   - Format: **JSON Structured Data**.
   - Cocok untuk REST API (Node.js Express / Python FastAPI), Firebase, MongoDB, atau backup pertukaran data.
4. **`generate_database.js`**  
   - Generator otomatis untuk meregenerasi seluruh file SQL & JSON jika data siswa atau transaksi di aplikasi diperbarui.

---

## 🚀 Cara Import ke MySQL / phpMyAdmin (XAMPP / Laragon)

### Opsi A: Melalui phpMyAdmin (Antarmuka Web)
1. Buka browser dan masuk ke `http://localhost/phpmyadmin`.
2. Klik tab **Import** pada menu navigasi atas.
3. Klik tombol **Choose File / Browse** dan pilih file:  
   `tabungan-xii-br1/database/database_tabungan_xii_br1.sql`
4. Gulir ke bawah dan klik tombol **Import / Go**.
5. Database `db_tabungan_xii_br1` beserta seluruh 44 data siswa dan transaksi otomatis terisi dan siap digunakan.

### Opsi B: Melalui Terminal / Command Prompt MySQL
```bash
# Masuk ke MySQL dan import langsung
mysql -u root -p < database/database_tabungan_xii_br1.sql
```

---

## 📱 Cara Menggunakan dengan SQLite

Jika ingin membuat file database lokal `tabungan.db`:
```bash
# Menggunakan CLI SQLite3
sqlite3 tabungan.db < database/database_tabungan_xii_br1_sqlite.sql
```

---

## 📊 Struktur Tabel & Relasi Data

### 1. Tabel `students` (Data Siswa)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | VARCHAR(20) PK | ID unik siswa (`STU-001` s/d `STU-044`) |
| `nisn` | VARCHAR(10) UNIQUE | Nomor Induk Siswa Nasional |
| `name` | VARCHAR(100) | Nama lengkap 44 siswa resmi |
| `photo` | VARCHAR(255) | Path berkas foto profil siswa |
| `phone` | VARCHAR(20) | Nomor WhatsApp terdaftar |
| `balance` | DECIMAL(14,2) | Saldo tabungan terkini |
| `target` | DECIMAL(14,2) | Target tabungan (**Rp 2.000.000**) |
| `password` | VARCHAR(255) | Kata sandi akun siswa |
| `status` | ENUM | Status siswa (`aktif`, `lulus`, `mutasi`) |

### 2. Tabel `transactions` (Mutasi Tabungan)
| Kolom | Tipe Data | Keterangan |
|---|---|---|
| `id` | VARCHAR(50) PK | ID unik transaksi (`TRX-XXXX`) |
| `student_id` | VARCHAR(20) FK | Relasi ke `students.id` |
| `student_name` | VARCHAR(100) | Nama siswa bersangkutan |
| `type` | ENUM | Jenis (`setor` atau `tarik`) |
| `category` | VARCHAR(50) | Kategori (**`Tabungan Harian`**, `Penarikan Tabungan`, dll.) |
| `amount` | DECIMAL(14,2) | Nominal uang masuk/keluar |
| `date` | DATETIME | Tanggal dan jam transaksi |
| `note` | TEXT | Catatan/keterangan mutasi |

### 3. Tabel `admins` (Hak Akses Pengelola)
- `ADM-001` (Username: `walikelas`): **Yoga Rahmanda, S.Pd.** (Wali Kelas XII BR 1)
- `ADM-002` (Username: `bendahara`): **Bendahara Tabungan BR 1**

### 4. Tabel `wa_settings` (Konfigurasi Notifikasi WhatsApp Gateway)
- Endpoint Server, API Token, No Pengirim, Status Auto Notifikasi.

---

## 📈 SQL Views untuk Rekapitulasi Otomatis

Anda dapat langsung menjalankan query rekapitulasi data secara instan:

1. **Rekap Harian:**
   ```sql
   SELECT * FROM v_rekap_harian;
   ```
2. **Rekap Bulanan:**
   ```sql
   SELECT * FROM v_rekap_bulanan;
   ```
3. **Rekap Siswa (Capaian Target Rp 2.000.000):**
   ```sql
   SELECT * FROM v_rekap_siswa;
   ```
