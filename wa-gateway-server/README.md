# Custom Node.js Baileys WhatsApp Gateway Server
**Website Tabungan Siswa XII Bisnis Ritel 1 (BR 1) - SMK PGRI 11 CILEDUG KOTA TANGERANG**
*Wali Kelas: Yoga Rahmanda, S.Pd.*

Server ini adalah WhatsApp Gateway lokal berbasis **Node.js & Baileys** yang dirancang khusus untuk mengirimkan notifikasi setoran/penarikan tabungan siswa secara otomatis (*silent background dispatch*) tanpa memerlukan tab browser tambahan atau aplikasi pihak ketiga berbayar.

---

## 🚀 Cara Menjalankan Server WA Gateway (3 Langkah Mudah)

### Langkah 1: Buka Terminal / Command Prompt
Buka terminal di folder server:
```bash
cd C:\Users\yogar\.gemini\antigravity\scratch\tabungan-xii-br1\wa-gateway-server
```

### Langkah 2: Install Dependensi (Hanya Sekali)
Jalankan perintah berikut untuk mengunduh pustaka Node.js:
```bash
npm install
```

### Langkah 3: Jalankan Server
Jalankan perintah berikut untuk memulai server:
```bash
npm start
```

---

## 📲 Menghubungkan Ke WhatsApp Anda

1. Saat server pertama kali berjalan, **QR Code** akan muncul langsung di terminal (atau buka browser ke `http://localhost:3000`).
2. Buka aplikasi **WhatsApp di HP Anda** -> Pilih menu **Perangkat Tertaut (Linked Devices)** -> **Tautkan Perangkat (Link a Device)**.
3. Scan QR Code yang tampil.
4. Setelah terhubung, akan muncul status `✅ BERHASIL TERHUBUNG KE WHATSAPP!`.

---

## 🌐 Pengaturan di Website Tabungan Siswa (`index.html`)

1. Buka website `index.html`.
2. Klik tombol **`WA Gateway`** di bagian kanan atas.
3. Pilih Penyedia WA Gateway: **Custom Node.js / Baileys API**.
4. Isi API Endpoint URL: `http://localhost:3000/send-message`.
5. Centang **`Otomatis Kirim WA Background saat Transaksi Batch`**.
6. Klik **`Simpan Pengaturan`**.

Selesai! Setiap kali Anda memproses transaksi **Setor Masal / Tarik Masal (Batch)** untuk 44 siswa, notifikasi WhatsApp akan langsung terkirim otomatis di background secara instan! 🚀✨
