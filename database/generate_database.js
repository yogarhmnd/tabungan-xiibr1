const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// Extract INITIAL_TRANSACTIONS and OFFICIAL_STUDENTS
const txMatch = appContent.match(/const INITIAL_TRANSACTIONS = (\[[\s\S]*?\]);/);
const stuMatch = appContent.match(/const OFFICIAL_STUDENTS = (\[[\s\S]*?\]);/);

if (!txMatch || !stuMatch) {
    console.error('Failed to match transactions or students in app.js');
    process.exit(1);
}

const transactions = eval(txMatch[1]);
const students = eval(stuMatch[1]);

console.log('Successfully loaded:');
console.log(`- Students: ${students.length}`);
console.log(`- Transactions: ${transactions.length}`);

const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// 1. Generate database_tabungan_xii_br1.json
const fullDatabaseJson = {
    metadata: {
        database_name: 'db_tabungan_xii_br1',
        description: 'Database Sistem Tabungan Siswa XII Bisnis Ritel 1 (SMK PGRI 11 CILEDUG)',
        created_at: new Date().toISOString(),
        version: '1.0.0',
        author: 'Yoga Rahmanda, S.Pd. (Wali Kelas XII BR 1)',
        target_per_student: 2000000,
        total_students: students.length,
        total_transactions: transactions.length
    },
    admins: [
        {
            id: 'ADM-001',
            username: 'walikelas',
            name: 'Yoga Rahmanda, S.Pd.',
            role: 'Wali Kelas XII BR 1',
            password_hash: 'admin123',
            email: 'yogarahmanda@smkpgri11cld.sch.id'
        },
        {
            id: 'ADM-002',
            username: 'bendahara',
            name: 'Bendahara Tabungan BR 1',
            role: 'Bendahara Kelas',
            password_hash: 'bendahara123',
            email: 'bendahara.br1@smkpgri11cld.sch.id'
        }
    ],
    wa_settings: {
        api_url: 'http://localhost:3000/api/send-message',
        api_token: 'secret-token-pgri11-br1',
        sender_phone: '081234567890',
        is_active: 1,
        auto_notify: 1
    },
    students: students,
    transactions: transactions
};

fs.writeFileSync(path.join(dbDir, 'database_tabungan_xii_br1.json'), JSON.stringify(fullDatabaseJson, null, 2), 'utf8');
console.log('-> database_tabungan_xii_br1.json generated.');

// 2. Generate database_tabungan_xii_br1.sql
let sql = `-- =========================================================================
-- DATABASE SISTEM TABUNGAN SISWA KELAS XII BISNIS RITEL 1 (XII BR 1)
-- SMK PGRI 11 CILEDUG KOTA TANGERANG
-- Wali Kelas: Yoga Rahmanda, S.Pd.
-- Target Tabungan per Siswa: Rp 2.000.000 (Dua Juta Rupiah)
-- Tanggal Dibuat: 2026-09-05
-- Format: MySQL / MariaDB / PostgreSQL Compatible
-- =========================================================================

CREATE DATABASE IF NOT EXISTS \`db_tabungan_xii_br1\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`db_tabungan_xii_br1\`;

-- -------------------------------------------------------------------------
-- 1. TABEL ADMIN / PENGGUNA SISTEM (admins)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS \`admins\`;
CREATE TABLE \`admins\` (
    \`id\` VARCHAR(20) NOT NULL PRIMARY KEY,
    \`username\` VARCHAR(50) NOT NULL UNIQUE,
    \`name\` VARCHAR(100) NOT NULL,
    \`role\` VARCHAR(50) NOT NULL DEFAULT 'Wali Kelas',
    \`password_hash\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(100) DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`admins\` (\`id\`, \`username\`, \`name\`, \`role\`, \`password_hash\`, \`email\`) VALUES
('ADM-001', 'walikelas', 'Yoga Rahmanda, S.Pd.', 'Wali Kelas XII BR 1', 'admin123', 'yogarahmanda@smkpgri11cld.sch.id'),
('ADM-002', 'bendahara', 'Bendahara Tabungan BR 1', 'Bendahara Kelas', 'bendahara123', 'bendahara.br1@smkpgri11cld.sch.id');

-- -------------------------------------------------------------------------
-- 2. TABEL DATA SISWA (students) - 44 SISWA RESMI XII BR 1
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS \`students\`;
CREATE TABLE \`students\` (
    \`id\` VARCHAR(20) NOT NULL PRIMARY KEY,
    \`nisn\` VARCHAR(10) NOT NULL UNIQUE,
    \`name\` VARCHAR(100) NOT NULL,
    \`photo\` VARCHAR(255) DEFAULT 'assets/students/default.png',
    \`phone\` VARCHAR(20) NOT NULL,
    \`balance\` DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    \`target\` DECIMAL(14,2) NOT NULL DEFAULT 2000000.00,
    \`password\` VARCHAR(255) NOT NULL DEFAULT 'password123',
    \`status\` ENUM('aktif', 'lulus', 'mutasi') NOT NULL DEFAULT 'aktif',
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX \`idx_student_nisn\` (\`nisn\`),
    INDEX \`idx_student_name\` (\`name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`students\` (\`id\`, \`nisn\`, \`name\`, \`photo\`, \`phone\`, \`balance\`, \`target\`, \`password\`) VALUES\n`;

const studentValues = students.map(s => {
    const photo = s.photo ? s.photo.replace(/'/g, "\\'") : 'assets/students/default.png';
    const name = s.name.replace(/'/g, "\\'");
    return `('${s.id}', '${s.nisn}', '${name}', '${photo}', '${s.phone}', ${s.balance}, ${s.target || 2000000}, '${s.password || 'password123'}')`;
}).join(',\n');

sql += studentValues + ';\n\n';

sql += `-- -------------------------------------------------------------------------
-- 3. TABEL MUTASI TRANSAKSI TABUNGAN (transactions)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS \`transactions\`;
CREATE TABLE \`transactions\` (
    \`id\` VARCHAR(50) NOT NULL PRIMARY KEY,
    \`student_id\` VARCHAR(20) NOT NULL,
    \`student_name\` VARCHAR(100) NOT NULL,
    \`type\` ENUM('setor', 'tarik') NOT NULL DEFAULT 'setor',
    \`category\` VARCHAR(50) NOT NULL DEFAULT 'Tabungan Harian',
    \`amount\` DECIMAL(14,2) NOT NULL,
    \`date\` DATETIME NOT NULL,
    \`note\` TEXT DEFAULT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (\`student_id\`) REFERENCES \`students\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX \`idx_tx_student\` (\`student_id\`),
    INDEX \`idx_tx_date\` (\`date\`),
    INDEX \`idx_tx_type\` (\`type\`),
    INDEX \`idx_tx_category\` (\`category\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`transactions\` (\`id\`, \`student_id\`, \`student_name\`, \`type\`, \`category\`, \`amount\`, \`date\`, \`note\`) VALUES\n`;

const txValues = transactions.map(t => {
    const sName = t.studentName.replace(/'/g, "\\'");
    const note = t.note ? t.note.replace(/'/g, "\\'") : '';
    const dateFormatted = new Date(t.date).toISOString().replace('T', ' ').replace('.000Z', '');
    const cat = (t.category === 'Setoran Rutin' || !t.category) ? 'Tabungan Harian' : t.category;
    return `('${t.id}', '${t.studentId}', '${sName}', '${t.type}', '${cat}', ${t.amount}, '${dateFormatted}', '${note}')`;
}).join(',\n');

sql += txValues + ';\n\n';

sql += `-- -------------------------------------------------------------------------
-- 4. TABEL PENGATURAN WHATSAPP GATEWAY (wa_settings)
-- -------------------------------------------------------------------------
DROP TABLE IF EXISTS \`wa_settings\`;
CREATE TABLE \`wa_settings\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`api_url\` VARCHAR(255) NOT NULL DEFAULT 'http://localhost:3000/api/send-message',
    \`api_token\` VARCHAR(255) DEFAULT 'secret-token-pgri11-br1',
    \`sender_phone\` VARCHAR(20) DEFAULT '081234567890',
    \`is_active\` TINYINT(1) DEFAULT 1,
    \`auto_notify\` TINYINT(1) DEFAULT 1,
    \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`wa_settings\` (\`api_url\`, \`api_token\`, \`sender_phone\`, \`is_active\`, \`auto_notify\`) VALUES
('http://localhost:3000/api/send-message', 'secret-token-pgri11-br1', '081234567890', 1, 1);

-- -------------------------------------------------------------------------
-- 5. SQL VIEWS UNTUK REKAPITULASI OTOMATIS
-- -------------------------------------------------------------------------

-- A. View Rekap Harian
DROP VIEW IF EXISTS \`v_rekap_harian\`;
CREATE VIEW \`v_rekap_harian\` AS
SELECT 
    DATE(\`date\`) AS \`tanggal\`,
    COUNT(\`id\`) AS \`frekuensi_transaksi\`,
    COUNT(DISTINCT \`student_id\`) AS \`jumlah_siswa_menabung\`,
    SUM(CASE WHEN \`type\` = 'setor' THEN \`amount\` ELSE 0 END) AS \`total_setoran\`,
    SUM(CASE WHEN \`type\` = 'tarik' THEN \`amount\` ELSE 0 END) AS \`total_penarikan\`,
    SUM(CASE WHEN \`type\` = 'setor' THEN \`amount\` ELSE -\`amount\` END) AS \`net_kas_harian\`,
    AVG(\`amount\`) AS \`rata_rata_nominal\`
FROM \`transactions\`
GROUP BY DATE(\`date\`)
ORDER BY \`tanggal\` DESC;

-- B. View Rekap Bulanan
DROP VIEW IF EXISTS \`v_rekap_bulanan\`;
CREATE VIEW \`v_rekap_bulanan\` AS
SELECT 
    DATE_FORMAT(\`date\`, '%Y-%m') AS \`periode_bulan\`,
    COUNT(\`id\`) AS \`frekuensi_transaksi\`,
    COUNT(DISTINCT \`student_id\`) AS \`jumlah_siswa_aktif\`,
    SUM(CASE WHEN \`type\` = 'setor' THEN \`amount\` ELSE 0 END) AS \`total_setoran\`,
    SUM(CASE WHEN \`type\` = 'tarik' THEN \`amount\` ELSE 0 END) AS \`total_penarikan\`,
    SUM(CASE WHEN \`type\` = 'setor' THEN \`amount\` ELSE -\`amount\` END) AS \`surplus_defisit_kas\`
FROM \`transactions\`
GROUP BY DATE_FORMAT(\`date\`, '%Y-%m')
ORDER BY \`periode_bulan\` DESC;

-- C. View Capaian Siswa (Target Rp 2.000.000)
DROP VIEW IF EXISTS \`v_rekap_siswa\`;
CREATE VIEW \`v_rekap_siswa\` AS
SELECT 
    s.\`id\` AS \`student_id\`,
    s.\`nisn\`,
    s.\`name\`,
    s.\`phone\`,
    s.\`target\`,
    COALESCE(SUM(CASE WHEN t.\`type\` = 'setor' THEN t.\`amount\` ELSE 0 END), 0) AS \`total_setor\`,
    COALESCE(SUM(CASE WHEN t.\`type\` = 'tarik' THEN t.\`amount\` ELSE 0 END), 0) AS \`total_tarik\`,
    s.\`balance\` AS \`saldo_akhir\`,
    ROUND((s.\`balance\` / s.\`target\`) * 100, 2) AS \`persentase_capaian\`,
    CASE 
        WHEN s.\`balance\` >= s.\`target\` THEN 'Target Tercapai'
        ELSE 'Dalam Proses'
    END AS \`status_target\`
FROM \`students\` s
LEFT JOIN \`transactions\` t ON s.\`id\` = t.\`student_id\`
GROUP BY s.\`id\`, s.\`nisn\`, s.\`name\`, s.\`phone\`, s.\`target\`, s.\`balance\`
ORDER BY s.\`name\` ASC;
`;

fs.writeFileSync(path.join(dbDir, 'database_tabungan_xii_br1.sql'), sql, 'utf8');
console.log('-> database_tabungan_xii_br1.sql generated.');

// 3. Generate database_tabungan_xii_br1_sqlite.sql
let sqliteSql = `-- =========================================================================
-- DATABASE SISTEM TABUNGAN SISWA XII BR 1 (SQLITE COMPATIBLE)
-- SMK PGRI 11 CILEDUG KOTA TANGERANG
-- Wali Kelas: Yoga Rahmanda, S.Pd.
-- Target Tabungan: Rp 2.000.000 (Dua Juta Rupiah)
-- =========================================================================

PRAGMA foreign_keys = ON;

-- 1. Tabel Admins
DROP TABLE IF EXISTS admins;
CREATE TABLE admins (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Wali Kelas',
    password_hash TEXT NOT NULL,
    email TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (id, username, name, role, password_hash, email) VALUES
('ADM-001', 'walikelas', 'Yoga Rahmanda, S.Pd.', 'Wali Kelas XII BR 1', 'admin123', 'yogarahmanda@smkpgri11cld.sch.id'),
('ADM-002', 'bendahara', 'Bendahara Tabungan BR 1', 'Bendahara Kelas', 'bendahara123', 'bendahara.br1@smkpgri11cld.sch.id');

-- 2. Tabel Students (44 Siswa)
DROP TABLE IF EXISTS students;
CREATE TABLE students (
    id TEXT PRIMARY KEY,
    nisn TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    photo TEXT DEFAULT 'assets/students/default.png',
    phone TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0.0,
    target REAL NOT NULL DEFAULT 2000000.0,
    password TEXT NOT NULL DEFAULT 'password123',
    status TEXT NOT NULL DEFAULT 'aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (id, nisn, name, photo, phone, balance, target, password) VALUES
` + studentValues + `;\n\n` +
`-- 3. Tabel Transactions (Mutasi Tabungan)
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'setor',
    category TEXT NOT NULL DEFAULT 'Tabungan Harian',
    amount REAL NOT NULL,
    date DATETIME NOT NULL,
    note TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO transactions (id, student_id, student_name, type, category, amount, date, note) VALUES
` + txValues + `;\n\n` +
`-- 4. Tabel WA Settings
DROP TABLE IF EXISTS wa_settings;
CREATE TABLE wa_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    api_url TEXT NOT NULL DEFAULT 'http://localhost:3000/api/send-message',
    api_token TEXT DEFAULT 'secret-token-pgri11-br1',
    sender_phone TEXT DEFAULT '081234567890',
    is_active INTEGER DEFAULT 1,
    auto_notify INTEGER DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO wa_settings (api_url, api_token, sender_phone, is_active, auto_notify) VALUES
('http://localhost:3000/api/send-message', 'secret-token-pgri11-br1', '081234567890', 1, 1);

-- 5. Views Rekapitulasi SQLite
DROP VIEW IF EXISTS v_rekap_harian;
CREATE VIEW v_rekap_harian AS
SELECT 
    DATE(date) AS tanggal,
    COUNT(id) AS frekuensi_transaksi,
    COUNT(DISTINCT student_id) AS jumlah_siswa_menabung,
    SUM(CASE WHEN type = 'setor' THEN amount ELSE 0 END) AS total_setoran,
    SUM(CASE WHEN type = 'tarik' THEN amount ELSE 0 END) AS total_penarikan,
    SUM(CASE WHEN type = 'setor' THEN amount ELSE -amount END) AS net_kas_harian,
    AVG(amount) AS rata_rata_nominal
FROM transactions
GROUP BY DATE(date)
ORDER BY tanggal DESC;

DROP VIEW IF EXISTS v_rekap_bulanan;
CREATE VIEW v_rekap_bulanan AS
SELECT 
    strftime('%Y-%m', date) AS periode_bulan,
    COUNT(id) AS frekuensi_transaksi,
    COUNT(DISTINCT student_id) AS jumlah_siswa_aktif,
    SUM(CASE WHEN type = 'setor' THEN amount ELSE 0 END) AS total_setoran,
    SUM(CASE WHEN type = 'tarik' THEN amount ELSE 0 END) AS total_penarikan,
    SUM(CASE WHEN type = 'setor' THEN amount ELSE -amount END) AS surplus_defisit_kas
FROM transactions
GROUP BY strftime('%Y-%m', date)
ORDER BY periode_bulan DESC;

DROP VIEW IF EXISTS v_rekap_siswa;
CREATE VIEW v_rekap_siswa AS
SELECT 
    s.id AS student_id,
    s.nisn,
    s.name,
    s.phone,
    s.target,
    COALESCE(SUM(CASE WHEN t.type = 'setor' THEN t.amount ELSE 0 END), 0) AS total_setor,
    COALESCE(SUM(CASE WHEN t.type = 'tarik' THEN t.amount ELSE 0 END), 0) AS total_tarik,
    s.balance AS saldo_akhir,
    ROUND((s.balance / s.target) * 100, 2) AS persentase_capaian,
    CASE 
        WHEN s.balance >= s.target THEN 'Target Tercapai'
        ELSE 'Dalam Proses'
    END AS status_target
FROM students s
LEFT JOIN transactions t ON s.id = t.student_id
GROUP BY s.id, s.nisn, s.name, s.phone, s.target, s.balance
ORDER BY s.name ASC;
`;

fs.writeFileSync(path.join(dbDir, 'database_tabungan_xii_br1_sqlite.sql'), sqliteSql, 'utf8');
console.log('-> database_tabungan_xii_br1_sqlite.sql generated.');

