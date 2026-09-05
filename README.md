# 🏦 SISTEM ADMINISTRASI TABUNGAN SISWA XII BISNIS RITEL 1 (XII BR 1)
### 🏫 SMK PGRI 11 CILEDUG KOTA TANGERANG
**Wali Kelas:** Yoga Rahmanda, S.Pd.  
**Target Tabungan per Siswa:** Rp 2.000.000 (*Dua Juta Rupiah*)

---

## 🌟 Fitur Utama Sistem

1. **👥 Roster 44 Siswa Resmi & Foto Profil Otomatis**
   - Terhubung langsung dengan 44 data siswa kelas XII Bisnis Ritel 1 (BR 1 / PM 1).
   - Dilengkapi foto profil siswa berbingkai rapi (kepala hingga setengah badan).
   - Target tabungan standar diseragamkan sebesar **Rp 2.000.000** per siswa.

2. **📊 Rekapitulasi Kas Lengkap (Harian, Mingguan, Bulanan & Per Siswa)**
   - **Rekap Harian:** Rincian mutasi harian, jumlah siswa aktif menabung, net kas, dan rata-rata transaksi.
   - **Rekap Mingguan:** Akumulasi per pekan (Senin s/d Minggu) dengan ringkasan arus kas.
   - **Rekap Bulanan:** Evaluasi berkala bulanan dan surplus/defisit tabungan.
   - **Rekap Per Siswa:** Pantau persentase capaian target tabungan masing-masing 44 siswa.

3. **💰 Manajemen Transaksi Terstandar**
   - Kategori uang masuk dikunci ke satu kategori tunggal: **`Tabungan Harian`**.
   - Fitur **Batch Transaksi** untuk mencatat setoran banyak siswa sekaligus secara instan.
   - Fitur **Batch Edit Siswa** untuk mengubah data, target, atau nomor telepon secara massal.

4. **📲 Sistem Notifikasi WhatsApp Otomatis**
   - Format pesan resmi dan sopan yang mencantumkan rincian setoran, NISN, nominal, saldo terkini, dan progres target tabungan.
   - Terintegrasi dengan server WhatsApp Gateway lokal maupun API eksternal.

5. **🗄️ Database Relasional Siap Pakai (`/database/`)**
   - `database_tabungan_xii_br1.sql` (MySQL / phpMyAdmin / XAMPP / Laragon).
   - `database_tabungan_xii_br1_sqlite.sql` (SQLite 3).
   - `database_tabungan_xii_br1.json` (JSON Database format).
   - Panduan lengkap import di `database/PANDUAN_DATABASE.md`.

6. **🎨 Antarmuka Modern & Elegan (Responsive Design)**
   - Batas panel tegas (*sharp border UI*) yang kontras dan bersih.
   - Dukungan penuh **Tema Terang (*Light Mode*)** dan **Tema Gelap (*Dark Mode*)**.
   - Navigasi khusus perangkat bergerak (*Mobile Sidebar Navigation Drawer*).
   - Ekspor data mutasi ke berkas CSV / Excel.

---

## 📊 Statistik Data Terkini

- **Total Siswa Terdaftar:** 44 Siswa
- **Target Capaian per Siswa:** Rp 2.000.000
- **Total Transaksi Mutasi:** 356 Transaksi
- **Total Kas Masuk:** Rp 4.367.000
- **Total Kas Keluar:** Rp 250.000
- **Saldo Net Kas Kelas:** Rp 4.117.000

---

## 🚀 Panduan Menjalankan Aplikasi

### Opsi 1: Menjalankan Langsung di Browser
Buka berkas `index.html` langsung menggunakan peramban (Google Chrome, Microsoft Edge, Firefox, atau Safari).

### Opsi 2: Menggunakan Local Server (Node.js)
```bash
# Install serve (opsional)
npm install -g serve

# Jalankan server lokal
serve .
```
Buka URL `http://localhost:3000` pada browser Anda.

---

## 📂 Struktur Direktori Proyek

```text
tabungan-xiipm1/
├── assets/
│   └── students/               # 44 Berkas foto resmi siswa
├── database/
│   ├── database_tabungan_xii_br1.sql          # Dump SQL MySQL/MariaDB
│   ├── database_tabungan_xii_br1_sqlite.sql   # Dump SQL SQLite
│   ├── database_tabungan_xii_br1.json         # Dump format JSON
│   ├── generate_database.js                   # Skrip pembuat database
│   ├── verify_sync.js                         # Skrip verifikasi saldo
│   └── PANDUAN_DATABASE.md                    # Panduan database
├── app.js                      # Logika aplikasi, state, kalkulasi, & UI handling
├── index.html                  # Struktur halaman web & modal
├── style.css                   # Desain antarmuka & dark/light theme
├── logo.svg                    # Vektor logo resmi
├── PGRI.png                    # Logo SMK PGRI 11 CILEDUG
├── package.json                # Konfigurasi npm
└── README.md                   # Dokumentasi resmi proyek
```

---

## 👨‍🏫 Administrator & Penanggung Jawab
- **Wali Kelas:** Yoga Rahmanda, S.Pd.
- **Instansi:** SMK PGRI 11 CILEDUG KOTA TANGERANG
- **Kelas:** XII Bisnis Ritel 1 (XII BR 1)
