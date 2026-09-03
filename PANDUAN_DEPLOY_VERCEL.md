# 🚀 Panduan Hosting Website di Vercel (Gratis & Online 24 Jam)

Sistem Tabungan Siswa XII Bisnis Ritel 1 (SMK PGRI 11 CILEDUG) siap dihosting di **Vercel** agar bisa diakses oleh seluruh siswa dan wali kelas melalui internet melalui HP, laptop, atau komputer dari mana saja.

---

## 🌟 Cara 1: Deploy Lewat GitHub (Sangat Direkomendasikan & Otomatis)

1. **Buat Repository di GitHub**:
   - Buka [github.com](https://github.com) dan login.
   - Klik tombol **New Repository**, beri nama misalnya: 	abungan-xii-br1.
2. **Unggah File Proyek ke GitHub**:
   - Unggah seluruh file yang ada di folder ini:
     - index.html
     - style.css
     - pp.js
     - PGRI.png
     - logo.svg
     - ercel.json
     - package.json
3. **Hubungkan ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
   - Klik tombol **Add New...** -> **Project**.
   - Pilih repository 	abungan-xii-br1 yang baru Anda buat, lalu klik **Import**.
   - Pada bagian *Framework Preset*, biarkan default (**Other**).
   - Klik tombol **Deploy**.
4. **Selesai!**
   - Dalam waktu 10-20 detik, website Anda langsung aktif dengan domain gratis berakhiran .vercel.app (contoh: https://tabungan-xii-br1.vercel.app).

---

## ⚡ Cara 2: Deploy Cepat Lewat Vercel CLI (Dari Terminal / CMD)

Jika Anda memiliki Node.js terpasang:

1. Buka PowerShell atau Command Prompt di folder ini:
   `ash
   cd C:\Users\yogar\.gemini\antigravity\scratch\tabungan-xii-br1
   `
2. Jalankan perintah instalasi Vercel CLI:
   `ash
   npm install -g vercel
   `
3. Lakukan deploy:
   `ash
   vercel
   `
4. Ikuti petunjuk di terminal (Login akun Vercel, konfirmasi nama project).
5. Untuk deploy langsung ke production domain utama:
   `ash
   vercel --prod
   `

---

## 📱 Keuntungan Hosting di Vercel:
- ✅ **Gratis 100% Selamanya** (Hobby Plan).
- ✅ **HTTPS / SSL Otomatis** (Aman dan gembok hijau aktif).
- ✅ **Kecepatan Global CDN Ultra Cepat** (Server tersebar di seluruh dunia).
- ✅ **Bisa Custom Domain** (Bisa dipasang domain sekolah seperti 	abungan.smkpgri11ciledug.sch.id).
- ✅ **Responsif di Seluruh Perangkat** (HP Android/iPhone, Tablet, & Komputer).
