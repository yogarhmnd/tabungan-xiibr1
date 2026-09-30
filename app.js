/* ==========================================================================
   APPLICATION INTERACTIVITY & LOGIC: Tabungan Siswa XII BR 1
   SMK PGRI 11 CILEDUG KOTA TANGERANG
   Wali Kelas: Yoga Rahmanda, S.Pd.
   Features: WhatsApp Notification System & 44 Student Roster
   ========================================================================= */

// Storage Keys & Cache Layer
const STORAGE_STUDENTS_KEY = 'tabungbr1_students_v12';
const STORAGE_TX_KEY = 'tabungbr1_transactions_v12';
const STORAGE_AUTH_KEY = 'tabungbr1_session_v12';
const STORAGE_WA_CONFIG_KEY = 'tabungbr1_waconfig_v12';
const STORAGE_THEME_KEY = 'tabungbr1_theme_v12';

// Firebase Realtime Database Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYQE1E7ngrkm3lNQCkDw6Xzqc-cnT49Ac",
  authDomain: "tabungan-xiibr1.firebaseapp.com",
  databaseURL: "https://tabungan-xiibr1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tabungan-xiibr1",
  storageBucket: "tabungan-xiibr1.firebasestorage.app",
  messagingSenderId: "1034930108247",
  appId: "1:1034930108247:web:6ce84384d99ebb35d2f012",
  measurementId: "G-VVQ3FTZ8E0"
};

let firebaseApp = null;
let firebaseDb = null;
let isSyncingToCloud = false;
let isFirebaseSyncedOnce = false;
let isReceivingRemoteUpdate = false;
let firebaseSyncDebounceTimer = null;
let currentCloudStatus = 'offline';
let firebasePermissionDenied = false;

const INITIAL_TRANSACTIONS = [
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-01T08:30:00.000Z",
        "id": "TRX-0242",
        "note": "Setoran Buku Tabungan (Hari 1)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0003",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0014",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0037",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0053",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0069",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0075",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0085",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0103",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0113",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0121",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0135",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0139",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0143",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0182",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-029",
        "studentName": "MUHAMMAD RAFA OKTAFIAN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0184",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0192",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0222",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0237",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0243",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0257",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0265",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0278",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0286",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Tabungan Harian",
        "date": "2026-08-03T08:30:00.000Z",
        "id": "TRX-0304",
        "note": "Setoran Buku Tabungan (Hari 3)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0001",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-001",
        "studentName": "AFGAN AFFANDI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0004",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0015",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 6000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0032",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0038",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0054",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0060",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0076",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 18000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0086",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0101",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-015",
        "studentName": "ERVANSYAH FAUZI NASUTION",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0104",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0114",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0122",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0132",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0136",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0144",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0155",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0169",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0206",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0238",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0258",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0266",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0279",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Tabungan Harian",
        "date": "2026-08-04T08:30:00.000Z",
        "id": "TRX-0305",
        "note": "Setoran Buku Tabungan (Hari 4)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0005",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0016",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0033",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0039",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0055",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0061",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0070",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0077",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0087",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0102",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-015",
        "studentName": "ERVANSYAH FAUZI NASUTION",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0105",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0115",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0123",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0133",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0137",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0156",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0170",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0193",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0207",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0223",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0239",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0253",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0259",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0267",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0287",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 8000,
        "category": "Tabungan Harian",
        "date": "2026-08-05T08:30:00.000Z",
        "id": "TRX-0301",
        "note": "Setoran Buku Tabungan (Hari 5)",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0002",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-001",
        "studentName": "AFGAN AFFANDI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0006",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0017",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 6000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0034",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0036",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-007",
        "studentName": "ANANDA NOVAN ALVIAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0040",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0056",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0062",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0078",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0088",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0106",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0134",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0138",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0145",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0157",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0162",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0171",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0185",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0194",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0208",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0224",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0240",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0244",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0254",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0260",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0268",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0280",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0288",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0302",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor"
    },
    {
        "amount": 35000,
        "category": "Tabungan Harian",
        "date": "2026-08-06T08:30:00.000Z",
        "id": "TRX-0306",
        "note": "Setoran Buku Tabungan (Hari 6)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0007",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0018",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0035",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0041",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0057",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0063",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 22000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0089",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0116",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0124",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0140",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0146",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0158",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0163",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0172",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0195",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0209",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0225",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0255",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0261",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0269",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0281",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0289",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-07T08:30:00.000Z",
        "id": "TRX-0307",
        "note": "Setoran Buku Tabungan (Hari 7)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0042",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0064",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0071",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0090",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0117",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0125",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0147",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0159",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0173",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0196",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0270",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0290",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 35000,
        "category": "Tabungan Harian",
        "date": "2026-08-08T08:30:00.000Z",
        "id": "TRX-0308",
        "note": "Setoran Buku Tabungan (Hari 8)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0019",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 6000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0043",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0058",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0065",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 9000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0072",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0091",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0107",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0126",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0148",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0164",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0174",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0186",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0197",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0210",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0226",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0245",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0271",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0282",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-10T08:30:00.000Z",
        "id": "TRX-0291",
        "note": "Setoran Buku Tabungan (Hari 10)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Penarikan Tabungan",
        "date": "2026-08-10T23:44",
        "id": "TX-4115",
        "note": "",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "tarik"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0008",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0020",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0059",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0066",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0079",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0092",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0118",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0127",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0149",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0175",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0198",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0211",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0227",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0246",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0256",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0262",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0292",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-11T08:30:00.000Z",
        "id": "TRX-0303",
        "note": "Setoran Buku Tabungan (Hari 11)",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0009",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0021",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0067",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0073",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0080",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0093",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0108",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0119",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0128",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 40000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0165",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0176",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0199",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0212",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0228",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0247",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0272",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0293",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T08:30:00.000Z",
        "id": "TRX-0309",
        "note": "Setoran Buku Tabungan (Hari 12)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-12T23:47",
        "id": "TX-3206",
        "note": "",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-15T09:21",
        "id": "TX-3588",
        "note": "",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "tarik"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0044",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 14000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0074",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 8000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0081",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0129",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0141",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0183",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-029",
        "studentName": "MUHAMMAD RAFA OKTAFIAN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0187",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 6000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0200",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0213",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0229",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-18T08:30:00.000Z",
        "id": "TRX-0294",
        "note": "Setoran Buku Tabungan (Hari 18)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0045",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 12000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0082",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0094",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0150",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0160",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0177",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0201",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0214",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-20T08:30:00.000Z",
        "id": "TRX-0230",
        "note": "Setoran Buku Tabungan (Hari 20)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T09:07",
        "id": "TX-7662",
        "note": "",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "tarik"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0046",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0095",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0109",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0120",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0130",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0142",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0151",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0161",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor"
    },
    {
        "amount": 40000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0166",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0178",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0188",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0215",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0231",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0248",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0273",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-21T08:30:00.000Z",
        "id": "TRX-0283",
        "note": "Setoran Buku Tabungan (Hari 21)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0010",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0022",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0047",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0068",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0096",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0152",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0179",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0202",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0216",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0249",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0263",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0274",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-22T08:30:00.000Z",
        "id": "TRX-0295",
        "note": "Setoran Buku Tabungan (Hari 22)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 70000,
        "category": "Penarikan Tabungan",
        "date": "2026-08-22T23:47",
        "id": "TX-9910",
        "note": "",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "tarik"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0011",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0023",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0028",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0083",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0131",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0153",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0180",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0189",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0203",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0217",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0232",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 150000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0241",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0250",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-24T08:30:00.000Z",
        "id": "TRX-0296",
        "note": "Setoran Buku Tabungan (Hari 24)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0012",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0024",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 6000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0048",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0097",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0167",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0218",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0251",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-26T08:30:00.000Z",
        "id": "TRX-0297",
        "note": "Setoran Buku Tabungan (Hari 26)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0013",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0025",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0029",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0049",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0098",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0110",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0154",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0168",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0190",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0204",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0219",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0233",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-27T08:30:00.000Z",
        "id": "TRX-0252",
        "note": "Setoran Buku Tabungan (Hari 27)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 80000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T09:40",
        "id": "TX-1206",
        "note": "",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "tarik"
    },
    {
        "amount": 80000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T10:04",
        "id": "TX-3211",
        "note": "",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T10:23",
        "id": "TX-6431",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T10:33",
        "id": "TX-9756",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T12:00",
        "id": "TX-4581",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0026",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0030",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0050",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0111",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0234",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0275",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0284",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-28T08:30:00.000Z",
        "id": "TRX-0298",
        "note": "Setoran Buku Tabungan (Hari 28)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0051",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0084",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0099",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0220",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0235",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0276",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-29T08:30:00.000Z",
        "id": "TRX-0299",
        "note": "Setoran Buku Tabungan (Hari 29)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0027",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0031",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0052",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0100",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0112",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 25000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0181",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0191",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0205",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0221",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0236",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0264",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0277",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0285",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-08-31T08:30:00.000Z",
        "id": "TRX-0300",
        "note": "Setoran Buku Tabungan (Hari 31)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T07:39",
        "id": "TX-7575",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B8758",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B2709",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B8596",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B7087",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B6916",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B1212",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B6257",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B5806",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Tabungan Harian",
        "date": "2026-09-01T09:41",
        "id": "TX-B6763",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B2750",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B9326",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B8032",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B5596",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B1873",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B1516",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B2539",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B8814",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B2272",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B6056",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-038",
        "studentName": "SITI SARAH AZZAHRA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B9411",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T09:43",
        "id": "TX-B4629",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T10:26",
        "id": "TX-7707",
        "note": "",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-02T12:02",
        "id": "TX-7704",
        "note": "",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T07:28",
        "id": "TX-6459",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B9891",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B6231",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B4285",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B5294",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B7096",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B7877",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B2872",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B5168",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B9085",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B9592",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-03T09:46",
        "id": "TX-B4074",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T08:42",
        "id": "TX-6144",
        "note": "",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B1804",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B3065",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B1852",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B4033",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B5930",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B7609",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B6560",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B8720",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-04T09:50",
        "id": "TX-B6884",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:29",
        "id": "TX-7944",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:31",
        "id": "TX-7794",
        "note": "",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:31",
        "id": "TX-7044",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 85000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:33",
        "id": "TX-7237",
        "note": "",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:33",
        "id": "TX-4807",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:34",
        "id": "TX-1756",
        "note": "",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:35",
        "id": "TX-6770",
        "note": "",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:36",
        "id": "TX-1889",
        "note": "",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:37",
        "id": "TX-3301",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:37",
        "id": "TX-2744",
        "note": "",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:38",
        "id": "TX-3113",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:40",
        "id": "TX-5317",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-14T07:41",
        "id": "TX-4525",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 15000,
        "category": "Penarikan Tabungan",
        "date": "2026-09-14T10:22",
        "id": "TX-8721",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "tarik"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:18",
        "id": "TX-3400",
        "note": "",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:19",
        "id": "TX-7797",
        "note": "",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:20",
        "id": "TX-6748",
        "note": "",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:21",
        "id": "TX-6825",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:24",
        "id": "TX-5284",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:24",
        "id": "TX-3047",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:25",
        "id": "TX-7002",
        "note": "",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-15T10:32",
        "id": "TX-1957",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:56",
        "id": "TX-2857",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:57",
        "id": "TX-4434",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:58",
        "id": "TX-4733",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:58",
        "id": "TX-5887",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:59",
        "id": "TX-6930",
        "note": "",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T11:59",
        "id": "TX-5315",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T12:01",
        "id": "TX-2889",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T12:02",
        "id": "TX-6238",
        "note": "",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T12:03",
        "id": "TX-5824",
        "note": "",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T12:03",
        "id": "TX-6383",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-16T12:04",
        "id": "TX-3648",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 2000000,
        "category": "Tabungan Harian",
        "date": "2026-09-17T08:36",
        "id": "TX-3589",
        "note": "",
        "studentId": "STU-024",
        "studentName": "MUHAMAD ALVATAR",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T08:43",
        "id": "TX-7431",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 60000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T08:44",
        "id": "TX-9399",
        "note": "",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T09:04",
        "id": "TX-5355",
        "note": "",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T09:04",
        "id": "TX-5079",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T09:05",
        "id": "TX-1368",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-19T09:05",
        "id": "TX-3218",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:35",
        "id": "TX-5275",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 40000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:36",
        "id": "TX-9211",
        "note": "",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 11000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:36",
        "id": "TX-9892",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:37",
        "id": "TX-6954",
        "note": "",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:39",
        "id": "TX-5105",
        "note": "",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:40",
        "id": "TX-9689",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:40",
        "id": "TX-6599",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:41",
        "id": "TX-4316",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:42",
        "id": "TX-2995",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 7000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:42",
        "id": "TX-8201",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:43",
        "id": "TX-2663",
        "note": "",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:44",
        "id": "TX-7988",
        "note": "",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:44",
        "id": "TX-5195",
        "note": "",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-21T08:45",
        "id": "TX-6810",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:17",
        "id": "TX-7783",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:17",
        "id": "TX-6670",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:18",
        "id": "TX-4588",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:19",
        "id": "TX-3662",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 12000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:20",
        "id": "TX-8029",
        "note": "",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:20",
        "id": "TX-4384",
        "note": "",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:21",
        "id": "TX-8286",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 60000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:22",
        "id": "TX-9379",
        "note": "",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:22",
        "id": "TX-7020",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 14000,
        "category": "Tabungan Harian",
        "date": "2026-09-22T09:23",
        "id": "TX-8852",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Penarikan Tabungan",
        "date": "2026-09-22T10:54",
        "id": "TX-1715",
        "note": "Bayar uang kas",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "tarik"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-23T10:52",
        "id": "TX-5918",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 100000,
        "category": "Tabungan Harian",
        "date": "2026-09-23T10:54",
        "id": "TX-2670",
        "note": "",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Penarikan Tabungan",
        "date": "2026-09-23T10:55",
        "id": "TX-5795",
        "note": "Bayar uang kas",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "tarik"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-23T10:55",
        "id": "TX-9413",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-23T10:56",
        "id": "TX-6637",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:21",
        "id": "TX-6213",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:22",
        "id": "TX-3272",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:22",
        "id": "TX-6418",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 30000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:23",
        "id": "TX-3364",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:24",
        "id": "TX-7365",
        "note": "",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:25",
        "id": "TX-9803",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:25",
        "id": "TX-2019",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:26",
        "id": "TX-8806",
        "note": "",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-24T10:27",
        "id": "TX-9350",
        "note": "",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:11",
        "id": "TX-4924",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:12",
        "id": "TX-9645",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:13",
        "id": "TX-7062",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:13",
        "id": "TX-9805",
        "note": "",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:14",
        "id": "TX-4170",
        "note": "",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:15",
        "id": "TX-7653",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:15",
        "id": "TX-1775",
        "note": "",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:16",
        "id": "TX-6624",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-25T09:17",
        "id": "TX-7823",
        "note": "",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Penarikan Tabungan",
        "date": "2026-09-25T09:20",
        "id": "TX-6858",
        "note": "",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "tarik"
    },
    {
        "amount": 30000,
        "category": "Penarikan Tabungan",
        "date": "2026-09-25T10:42",
        "id": "TX-1428",
        "note": "",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "tarik"
    },
    {
        "amount": 50000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T08:51",
        "id": "TX-8497",
        "note": "",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T08:53",
        "id": "TX-7624",
        "note": "",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T08:55",
        "id": "TX-2312",
        "note": "",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T08:57",
        "id": "TX-8205",
        "note": "",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T10:05",
        "id": "TX-2379",
        "note": "",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T10:06",
        "id": "TX-7773",
        "note": "",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor"
    },
    {
        "amount": 20000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T10:07",
        "id": "TX-1476",
        "note": "",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor"
    },
    {
        "amount": 5000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T10:09",
        "id": "TX-8342",
        "note": "",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor"
    },
    {
        "amount": 10000,
        "category": "Tabungan Harian",
        "date": "2026-09-26T10:10",
        "id": "TX-4189",
        "note": "",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor"
    }
];

const OFFICIAL_STUDENTS = [
    {
        "balance": 10000,
        "id": "STU-001",
        "name": "AFGAN AFFANDI",
        "nisn": "0085191456",
        "password": "password123",
        "phone": "081234567001",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 85000,
        "id": "STU-002",
        "name": "AHMAD",
        "nisn": "0082546680",
        "password": "password123",
        "phone": "081234567002",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-003",
        "name": "AHMAD DAI ROBI",
        "nisn": "0082865515",
        "password": "password123",
        "phone": "081234567003",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 400000,
        "id": "STU-004",
        "name": "ALFI SYAHRI",
        "nisn": "0092316992",
        "password": "password123",
        "phone": "081234567004",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAAHAQAAAAAAAAAAAAAAAAECAwQFBgcI/8QARRAAAQMDAgMGAgcFAwwDAAAAAQACAwQFEQYhEjFBBxMiUWFxMoEUFSNCkaGxCDNSwdFicpIWFyQlNDdDU3SCtOE1Y4P/xAAcAQEAAgMBAQEAAAAAAAAAAAAAAQQCAwUGBwj/xAA0EQACAgECAwYDBwQDAAAAAAAAAQIDEQQhBRIxEyIyQVFxBoGhFGGRscHR4RUjQvBSU/H/2gAMAwEAAhEDEQA/ANHREXjz9DhERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAE5K2ra+Cgi45nYzyaOZWt3C/T1BLIm8LHfdVujSzu36L1ODxTjmn4cuWXen6L9fT/djNV1+paPLW5meOjeX4rCVWqaxzsQRNjb6eIrFv45DxPPG7y8lbzGUjDnBoHQLsV6KqHln3Pner+JNfqG8T5V6R2+vX6l0b/dGzmUVTskYIIGPw5K4j1ZcM4e5h9eALBuO/MlSrc6Kn1ijnV8V1tfhtl+LOl22vjuVK2WPZ3JzOoON/krtc5tl0mt9UJYzzHCRnmFuFFqCjndmZz2f2Q3+fVcq/QyUv7fQ93wz4orlU/tb735/eZZFLHNFM3iika8enT3CmXNlFxeGezqthdBWVvKYREWJtCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAqFbVx0VI+eQ7NGw8z0CrrTtVVxnuDaRp8EO5Hm4j+is6antrFHyOPxniP9P0srV4nsvd/t1LSeskrql88hJzyxvj0CpPbgh2d+WM7qWNhDAduWAAh2PLiwNvJelSUVhHxayyVknOby2R4jnhP+FqoSMdISGAHHkrhoe7YNwB0UkvGARxCMeQCk1liYiHYJGSk0PdHBOT6K5pYXTVGzC/1O+6hVU8zZHFzHNBPLHJRncyw8ZLRoV/T8UWHcRA6HGQqEIAcA7A91e8HdszFyO5AOR7+ikxK0ddPTPbKyThcORHI+i262V7bjRiUANcDhwHQrRJTw9MH16rLaYr2wXAwPPhmGAT0cOSo62lWVuSW6PU/DfEp6XVRplLuT2a+/yf6G4oiLzx9cCIiAIiIAiIgCIiAIiIAiIgCIiAIiIChWVIo6OWocMhgzjOM+S5xUTPmqpJXnLnuJJW6aplcy0hjT+8kAPqOf6gLSSw4zjYdV3eHQSrc/U+X/ABfqpT1UaM7RWfm/4wVGzeEAqeOTidhUnQvi+NpG2fkru126e41HBDGSOp6BdFtJZPGKLbwipFxuGAAB6lZKi09UXAt4Wvc09SMLZbFomSpla9zXd234ttz6Lp1o0uImjjiaGNA4WgKrZqFHaJ0KdG5bzNC03osU+JZY8vBy0dMhX920kJYpPsRk5/RdOjtDQ3YcJHL0VOe3GQ4kaMDf3VPtG3k6HYxS5cHnu46afRkkx8TcfgsJLC5gwNsciOa9B3vT9PVNOcNOOeNiua37QMjWvlgkDiOTSFar1Ce0ihfo2t4HNpXFpLc5ClY90cjXtOHNOQVc1tDNQ1boZ4yxw9FbYJdglXdmjm7xZ0mjqPpdFDPjh7xodjy9FWVhZBiy0v8Acz+av15SxKM2l6n3rR2St09dkurim/mgiItZaCIiAIiIAiIgCIiAIiIAiIgCIiAwuqQ36pa4nBEgx+a1aBjJqhkYOQ5zRhbtd6L6wtc0A+MjiZ7jl/RafpynM2oKWJw371oIPuu7oJrsWvQ+WfFmnnHXRsa2kl9Ov6HWHaUo7jYvoxiYJu5LI5CPhJCytg0ZRWqgjgAD5Bu9w2yVdMlipYwXvDGj1WWt1yoHAcczWk+ZWhubWEUFGuLy+pk7bbWQxMbFGGhvIY2CzlPTlg5YPnhU7a+ifHxCfj4t/ZZBpiz4CfdYqPqbHJdEW74SADnHsrOeFwyeLPusqTFxbuzlWtVW2+njLqmZkYHMuOFPLkx58dTBVDMhzXD1CwlZECCMc1f12pLa9zmUkrZyOrd/zWBkvVPNII5XCKR2wBOxTkktx2sXsjnXaNQtjlgqeHbhLXELn0bHVFSyGIZe88LQuxa6oxUadnLhgxnLSFzTS1A6a7GpIHdwA8/M7BXoW8lLk/Io16N6rWwoj/k1+Hm/kjbaKIwUMEThhzGAEeuFXRF52T5m2z7VXWq4KEeiWPwCIig2BERAEREAREQBERAEREAREQBERAXVvt89yqhBABxHcl3IBY2i0jV2ftIjjmh4Ynh0zSN2nbfHzK3TQdSyKtqYiB3j2hzTjfbIx+JC2O8sikvVKWBvGGcJxzG+6v6Z8qbXmeC+IrZW3KmS2i0169DGPsVPXTsdU5IbyGThXz7fpWlpf9YPgawbB0jth8yVlKi1/S6YRtcWHHNqxjdIQPs1VbJjkVDmvM5cRMxzTlrg70IVmuW+7weXti8ZUcsp0slhY8yWqsjlA2+zlJA/ktjoLr33gDTxgclhrDpektFqmoRP9MnmeHyVMwL5NhhoBJ2ACydLRshrYnNOS0Yc7GOI+yxtwujyZ0p47ywX9RWmJhe7IwterH0ddJx1TIxGDzeM/ktivEIkgYGjYHJHmrOCiip61tX3cMjPute0nh29+aiL36mVm6zgwtHfdKSEU9PVUs0gzhrHN6c1Vqaegq4i2NjHY5jGCFZ2bQ1NZLvNcqeaScYkbBBNIXMhDxg4GN9hjp81e2rThoZnvD3BpOQzPhHsOgW2zEfC8mirml444NU1nSlula1o5tjyB7LVaOw1VnstO6aB0bZBxEkjmee3RdQ1FSsli4HNHA/wkH1WP1gYotPtZ97LWtz15f0Kr3Pmrx8zucGsdOtjKKTcsR9lnfBoCIi5p9LCIiAIiIAiIgCIiAIiIAiIgCIiAIiIDK6bnNPqCmdnYnB9Rz/ktymIZcInEkvLiM9C3YggrTdMxsl1HSMkeGAuOCeXFg4HzOAtwqoZYYoWPhLRFJjj9+iuafoeG+IklqI+36s2u2Py1ud8+fRZfuIpIxloJ9QtcoJHN5noFsVLMMAZIyt62Z5trKJJKZkMTi1gG3RYqnf39QMDwg8/NZC5TvknZTs2a74j5+ipRCjp6hsPfNLzuWgjOPZJIRYuBLGNdjYdFNQCOojIwC0qrXOpnNa3vMcW26to4/q6dndniY/mExuM5RfNooWO+AKWrDI2HAV3kFuTjksVWvJDhlZMiO5rN8kaY2jOcuC1jW83EaGPOSGFxH4YWxXHJq4uBocWniPy3WrawiDDSOccSOD8t9M5z+ZWq/wHZ4Jj7bH5/kzWkRFzz6KEREAREQBERAEREAREQBERAEREAREQEQS1wIJBG4I6LMRalucpp4KmrdJAx7chwBOM+eMrDIsoycehov09d8eWyKfujsFHgRiQjOwysjTVWXNznyK1jTNwFdY2b+OPDHj1Cv6iaWAF0Y4iei6K7yyj5bbB0WSrn1Wxn6wtqS3hfwPHIhYxlFSvm4/osL5xzmDcO/xc1hPrGrpXiWenmkDjgFpGP1V7Fda4kOjpjEP7vEVnhmmPe6GRnoqWaM9/SsnaDyl8YB+aq0TWxuaTIBGz4GY5eixs93rOEcEfCMZIEZ3KxlTX1Mru5FNK2UnbhIAB+ZU4bD7pu81azhGNsrG1E4fxNb+KwFBUV3FJBVcRDeWVkmOEfeSPOGhvJQl6hS22NV1Vdqi21tP9Ek4JNyTgHb5rUKusnrqh09TIZJD1Kub5cTc7rLOCTGDwsB8gseufbNyk/Q+k8L0UdNRHmiufG78998BERaTrBERAEREAREQBERAEREAREQBERAEREAREQGb0pVyU134WuPA9p4m+a3wyl+x5FazpGxSS2OrvBblscrIm7dN+L9WrPtcY8ZGy6lMHGCz57nzXjtsLNbLk/wAcJ+/+svW93NH3Tmg9FWpuKgcQxrntPTGVawbPD27g7rKQzRkbtBIWT7rOTB7ZTJJa1z2ljYj4+vDyVqykbE4yv+I77rJmaHfwgEeix9U9smQ3OFOc7Eyb6stpHAuLhg55la5q27Pp6JtNESDPkE9Q3/2s8SXuIb/6WD1JZvplnqrgzPeUJZn1a4kH88H8VNkWoNR6lrhcq3rK+18Ofr5fXBoyIi459VCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiztg0betSPH0GkcITzmk8LB8+vyXULF2P2mgLZbvUOr5tj3Yyxg+Q3KtU6S27eK29Ti6/jmj0OY2SzL0W7/j5nG6G3Vlyn7mipZamT+GNhcR+C3uy9kN0qmCa7Stoo8Z7tmHyH+Q/Ndno7bR0LGwUVLDTxjctjYGj8ArmojAYQNwMZXWp4bXHex5PEa34v1Nvd00VBevV/t9DX7Tpqht9h+p4GObTlhBJOXEncuz55WmV9plo6p9PM3EkZ6dR0IXT4mhspCt7zZY7pTAtAFTGPs3ef8AZPorl1KnDlj5dDy9Wql2jnY883X9zlYbLC7bA9DyKmNVKNjC7luWnIWWqKXDnMewskYcOaRuCrTuGg7HC5fNjZnV5PNFqKiQ/DFJ+GFCR083hI4B1DefzKvhAXHHFlVo4I2DLsDHmnaJdCOTPUsoaZ/Dgt+QW4UVgbBYpKeojBfUgmZpHQjAb8h+pVzYbGGBldUsw7nFGen9o+vks1KzIPmV0NLU135HN1Oo35YeR5/unZnf6HjfTwsrYgTjuj4sf3T/ACytUqaWoo5zDUwSQSt5skaWuHyK9VQxMDXNc3IBVrcbLQXOIw1lNHPH0bJGHfqq9vDK5b1vB6rSfGN8O7qYKS9Vs/2/I8tIuy3zsdoaiN0lnmfSyj/hvJew/juPff2XMr5pS8aeefrCjeyPOBM3xMPz6exwVyrtHbTvJbeqPaaDjej1+1U8S9Hs/wCflkw6IiqHZCIiAIiIAiIgCIiAIi6roPsyjmhjut+i4mOGYqV22fIu/p+Pkt9NE7pcsTncQ4jRw+rtbn7LzfsaDYtL3fUc4jttG+VucOlOzG+5XWdMdkdst3BNdnC41XPuxtE35dfn+C3+lp46enEUETIYm/CxjQAAruJgAz1K7tGgrq3luz5pxH4n1erzCruR+7r83+xbthZExkMDGxsAwGtGAAq3AyKLAAy781M0ZeXeewUz2gygdAF0DyrZSiZvnz3VRzeJrgeqmaPtCokIQWoZ4g7zVww5ClAw5zfmFEAtdlAY292KO6M72MiKpaMB+PiHkVoVXHUUNQ6Coj4JG74PUeY9F1N0jWMLnEADck9Fhbnb6O9w5nHA1m7JWHD2+u+2PdVrtOrVnzLmn1Mqtnujn30knicSGgdeS2nTWn5ZHMr7hHwxjxQwuG5/tOH6BRtVJp+guxLqnvpPuOmc3gYfIctz54W38Tc7rTTpOR5mbr9ZzLlgSnfcqTg34jybuqhI6KnI7OGD7xV85pTY08Hqd1XYMtwUazA3UzW4QEj2ZaHN2eORVCeCGqgIkia5rwWuaRnPmCFd48JVI/ZyZ+6/n6FCVsc31H2R2u5cdRbH/V9QRswD7Mn+70+R+S5VqHR940zKRXUx7nOGzx+Jh+fT54Xp8xsduRlWNXTslifBJGyWJ4wWPbkeyo3aGq3dbM9Pw74m1mjxGx88fR9fk/3yeUkXV9b9l8baZ9ysMBY9uXSUrTkEdSz19Pw9eUEEEgjBHMLg36edEuWR9N4dxOjiNXaUv3XmvcIiKudIIiIAiLcuzvRT9VXU1FSOG2UjgZif+IeYYPfr5D3WyuuVklCPVlbVaqvSUyvteIozfZnoI1j473c4fsc/6NC8fGf4yPLy8+fv2URAEgcmjb9FLRxsYYmMYGRsGGtAwAB0Vy0YkePRepoojRDlifFOJ8St4je7rOnkvRf71HdcJAU/IFHHxBFuOYBsQPLdRbu7PmVLnY+uymb8ePIICfGHZTGymUrtzjogLec8LmSDkHb+oUXyYHMAKq+MPwDyCoyQN42ZzgHl5qQaBqa+zXKudQtD4qWB2CDsZXDqfTyHz8lrslW9snAGkN910bVNhjrqN1TBGBUxjOR94eRXPJI+Nu+xHNW44ccorTznckDmy7Fu3VbjpSpuv0eTif8ASKKIYY1/xg+Qd5e+VqNPE6WobEN3OIaPmurWugZQWyGBg2A3PmVhY1jczqz1J45eMbA58uoVWIF04c4HltlVhGGkkBTtVc3AhQwplBQCDRkOCkcActdyKnYd3KDxxNQFJgLTwk8lFzBwHI5BRHiG/MKLv3bs+SkFtUsxCw+u/sVybtK7P+8ZPfbXGBNGC+qhb98f8wevmOvPzz1+pH2Qb5kKhKO7qA7HQZ/Rarao3Q5JF/h+vt0F6uqfuvVejPJiLf8AtQ0O7T90N0oIv9V1bs+H/gvO5b7HmPw6LQF5W6qVM3CR9s0Wsq1tEb6ns/o/R+wREWouFehop7jXwUdNGZJ53iNjR1JK9M2ayQaY0zTWynwTG0d48DHeP+84+5XN+xbTAmqZ9RVDAWQkw04P8WPE75AgfM+S6zU+OVree67/AA2jlj2j6v8AI+XfFnEu2vWkg+7Dr7/wvrkqUrSME+SqnaU+oRuMZCO+IFdQ8SRPMITsoHp7oSgDfi9lOz4ipG8vdTs+8gKigFFEAUso2B8ipgoSDLEBAgOBB3BXLdTUzKG/TQwDwu8R8gT0XUs7ZXLtQv7/AFBUv5gPx+GysU+Zpt8iTTMbH6jp2S4xuRv1xsupgbY8lyi3u7u5U0gOCJW8vddWhOYWnnkLG1bmVT7pUzsjeSgVMOS0mwKCioFQCQbOKjlQ5OUFIJRs8hRcfCpT+8+ShK7EZKAjJ45Yx81LMzjleBz4B+qnZ+8Lj0GFCPxTuPmfyUgtau3015tNRb62MSU87CxzT+o9RzXmLUdjqNN3+qtdTkugdhr8YD2nk4e4XqeAYe4eRXOu2TSwuVjZe6aMGpoBiXHN0R/od/Ylc/XUdrXldUer+GOJ/Y9V2M33J7ez8n+n/hwpERebPrh6vslop7DZKW2UoHdU7A3OMcR6uPqTk/NVWb1nsrnOyt4v9ocfRezSUVhH57nOVknOTy3uyp8EhHQ7qJSQZHqEByEMCCO5gealecFvqcKLvj+SkFQBTMGxUucc9lRkuVDTsPfVtPEf7crW/qVGScZLpvJRWL/yksjRvd6EdP8AaG/1VP8AyrsRdhl0p5T5Ru4/0yo69A011MwjvhKxtJfrfW1jKWGSXvntc9ofBIwOa0gEguaAeY/ELJH4VJBTeeGInyC5LVzGWumk/jeT+a6rWO4KCZ3kwn8lyQnL1Zp6M0W+RWjd3b2P/hId+a6rRPElIxwOQRsVyjm0ro+lqj6TYICT4mDgPyUXLoxU+qMweamCl6qYKubwoFRUEBI4dVKStOr9YV1NcamnbHCWxSOYCWnOAceaoM1pXO2McH+E/wBVX+0Qzg6q4TqWuZJfibr99HDiAHrlaaNY1nF4oYPzWxWS5PutCZ3saxweWYafQH+a2QtjN4RXv0N1Eeaa2MlyaVCDd7ioP3w0KrGOFq2FIpxfvn+6mnijngfDMwPjkaWuaRkEHYhSwbuefVTv5D3Qk57/AJl9P/8AMqP8SLoiLX2Vf/Bfgjpf1fXf90vxZTPIqhBvM8qs7kqFP+8ethzC4KkacZCmUpG+UBE4cFb12foc+CQe7dgjnyKne7gcM+aqYD5eE4Ixuslsw+ho0EcEYhfLbY5IjFEGzzEP4iYiS7L3cuIt/Aq6pnMpbHWQsrqB9QYIu7fG6JuJMHjHgbtv6LZ4rLaqfHc2yjjxsOGBox+SvWsayIhrQ0eQGFC2SD3ZpsMtSLnHKK5n0VlU+ThDHkviIa1rcAdBxn3A89seKSuc6295VSzGlnE0h+jzkyD7LwjDNt2O36j+8V0NqmTOeo6GpWxs7LlYovolSW0tPPDLK6FzWN4uEt3dg/dwtt+6oFOigFleX93Zqp3lGVyo+eF03Uj+CwVPq3C5qRlWqvCV7epM3cZW36HrBwz0jjyPGFqLBssrpl7o7zxt24Rv7Zx/NTYsxIqeJHSOqiFKx3E0FTKoWSKlHJCcKHIoDXavRlDVVUtQ6edj5Xl5AIIyTnyVEaDo2/BW1DfcArZQ2TJ8Yxn+FRDn5IyPwWp0wfkXlxDUxWFNmsHQkAH/AMhKP/zH9VlLPam2WkdTNmMwc8v4i3HQDH5LJCRxJVMuMjycegUxqjF5SMLdbfdHksllfIi0ZJKqE8LCfRQAwpZTiMjqVsKgph4SVO/4SkIwxQk+FARyikRAH7NVvT/vHqvIfCVb05+1PqgLnKcwoJnCApTsL4XAfEBsoUT+9aJPMKs7llU6NgY12BjLiVPkC5AyVM74CoBRd8BUAlaVMFIFM3kgBUSodUQGD1a/gsUg8yAuegbLfdYuxaMebgtCGQMK3V4Stb4iZqymnXYvkbOkjXN/LP8AJYpuSsjYSBf6Q/2iPyKyn4WYw8SOjwHhHCVXCpcOGtcFODkKmWw88h5lHKG5eD5ITnooBFp8JUreTiolwazfZUxNGIT4hn3U4BBpw0lIm4YCVIT9iD0JVVjg/kdh0RgjnyUknieB5bqocD5KVjeIlx6qAVG7NVOU7YVQnAVF5y5ARRMIgKUzsRlUoD48qpL4mEKhF4XDKAu+TlMpCdsqbOQgJXktaVGn+BSSHZTw7BSC4CO+EoEPwlQCnnZTjkqR8lUHJAOqioDmolAa1rF3+rQPX+YWju5LctZP/wBEaPULTOiuV+FFW3xBp2V/Y973SD/7FYZ2V5Z3iK8UjidhIFMvCzGHiR1Fm7OHyUBscKAPDID5qZw8WVTLhEclKdio5wFh79qS3aebC64SPYJiQzhYXcsZ5e4UZwSlnYzJ5tUj4on/ABRtd7ha9Q6809cJBGy4MifjYTgx5+Z2/NZf63tzhkV9KR6TN/qoU4+TMnCS8iu6GLu+HgaB5AKjTOw6QjzwqM17tbG4dcaRuTgZmbufLmoWypbPC9w5B5GfPdZp5RGGupf4yMefNVNmjCoibHTKjxk9MLEgmkeGtyqQ5Z6lSkmR/oFPjdSCdERQQVvokRH3vxWOutxsNhiZJd7rR21jzhrqqpZEHH0LiMrMLzX22aZvdL2rN1VXacl1Vp00zYxTtc8NgaG4c0lm7fES8HGPF6LHIPQQrrS61i4i4UxoMAipE7e6xnAPHnHP1UIrjZpaCSuiudJJSRHD52ztMbDtsXZwOY/Fea6Gp0zJ+zFrGDTlVdSGTU8lRR3B7HGB7pYxlha0Atdw8+fh5DrpNmvtxpOzm5dnsULjW36uopqdgB8bJGh3P1Ih/EqMg9i/WlikoXVwu1GaRj+7dOKlndh38JdnGdxt6qrUXKz0FPDPU3Kkp4ZxmKSWdrWyDGfCScHY9F5Nt7HRfsn3yN2zm6ja0+4jiVHRF2pe0ntS0xbNWyFtsoqZlHSUrc9290bAGtdvtxkZJ6nDeXJkk9iwmGeFk0MjZYpGhzHscC1wPIgjmFjX6l06yV0T77bWyNPCWmrjBB8sZ5rLta1jA1oDWtGABsAF4NuslgbdNYsucFXJcn1b/q58LgGMd3ruPjydxjHT8EyQe6ZXUkFM6qmnZHA1vGZXPAaB55O2FY2vUWnr3M+G03y3XGSPdzKWqZK5vuGk4XmXUwvc3Zj2W6LuM01Gy7TP78uB4gwzBsOQf4WSZwfRZutoezLQvbZbKC3N1Hbbrb5oIcUj2Ohme/hwXue4uw4Pw4DAxnATIPQNRf7BR1L4Km9W+CaM4dHJVMa5p9QTkK4+n20281/0+m+hgZNR3ze7H/dnC8ja/l05B2+6rk1RQ11bQDPCyjcGvbJwM4XEkjA5+fMbFZrRdpuND+y7rauqWOjoa9zH0gc7PEGva1zsdN8D/tTJOD0rNbbVqKkZPHUCpp3HLZIJQ5rsEjYjIO+Vjq7S2nbbRS1lfUmkpYhxSTTziNjB5lx2C1/9n3/cXp/3qP8AyZVqX7R1k1PXadrrkLtHT6Yt8EL3UbRl9RUOmDN/QBzTuTuOXVZKcl5mDin1On02kbDWUkVTSzPqKeZgkjljmDmPaRkOBGxBG+QqFBYtLV1dU09BcY6qqoXhtRFDVNe+B2TgPA3adjsfIrC0NHqW4dgWmqTSddDQXSW2UTRUS8o2d0zjI2O+OWy0n9m63yWjV/aHbpqp1ZLSVUMD53DBlc19QC4gk8yM8yp55eoUUtzvJgZgZzgdcrGU2pNO11ydbaW+22ormEh1NFVxulHu0HK07t9vVZY+x65y0Mr4Zql8dMZGbFrXO8W/qAR81pWmewTTVy0FpW6U9yq7TeJGxVj62J+Xyuc3jDGgnDSDjBAzsc5WOTI7hJXW2K4R0EldTsrJBxMp3StEjhvuG5yeR/BYi7WbTusJvostcyomoXOD46eoaXRknBDgMkbjG65TqsFv7YmkgXFxFABk9fDOnYf/AL7O0z/rZf8AyJFGSVtub/WaG0VaI4WV9Wyj4s8BqKljC/HPHFzxkclb0uitCXKd0VHdY6qQNLyyGtY8gdTgdFzr9qNrX3zQ7X0b69rpagGmY4tdOOKDwAjcF3LI33V92RWy2Mv10qKfsyuOkZ4rfIG1VVWTzNkBLcsAkaBnr57LHlRn2ksdTdKLSvZ42408lPeaaWeOQPjYK+N2XA5Ax1W4u+p7JHDT1FbBS98SIhPM1hkOd8Z58xy81460toa13zsX1TqWd00dys80fcOa/DC08OWuHzPrnC2PUl1qr1ojscq62V0s/wBIqIS95yXBk8TG5Ps0LJbdDFtvqeqKistdFVQ0tTXU0FROQIopZmtfJk4HCCcnfbZSXS52ax04mu1zpLdE44D6qobE0n0LiFw/tt/3/dnP/UU//lNWMntlD2iftHaoZqvvqq12ClkfFSNkLQWx8IxkEEDLnO2I364U5MT0Nbaq2XWjbVWytgraZxwJaeVsjD825Cu/o7PX8Vwn9n+56Jbqm827SUt/BqYTVPgrxGIY2NeAA3hJdxDvAMk7jmu9pkFPuGeqKoiZAXJ9XdnGsv8AOMdYaJ1DTUs88XdzUlxc90I8IaS0BrhghrTjA3BOd8LrCKAcRtvYTcaLsv1NZpbtSzX3UUsUkswa5sEfBIH4GBk/e3wOY2GFWoew6tptd6Qv0ldRmKyUMFPVMaHcUssTXBrm7Yxnh545LtCIDhzOw29t7H7ppE3Og+l1t3+sWTePu2s4WDhPhznwnorrWPYbVXrS2kqeyVdDbbxp+JsTqgNc1r8AEkFoznvAXDP8Tj1XZ0QFtbhWC2UwuBhNaI2icwk8BfjxFud8Z81zvsx7LqzROoNS3C5VFFWNu9QJoRG0l0YDnu34gP4xy8l01EBz/tc7MW9pVipIqesbQ3O3yGWmnc0lu4HE043AOGnI5cK06l7H9e6k1NZrjr7VdHV09lkbLTx0TMvcQWncljBuWtyTk7LuKIDllF2RzHtW1XqG6T0lTaNQUMlGaZvF3gDu73O2PuHkeeFhNP8AYvqazdmeqNGy3igqKW6Fr6N+ZPsXBw4uIcPIhreXUeq7ciA1Tsy0nVaH7OrZp6tnhqKij73ikhzwO45XvGMgHk4KPaZpSq1v2d3PT1FPDT1FZ3XDJNngHDKx5zgE8mlbUiAxOlbTLYNHWazzyMlmt9FDSvezPC5zGBpIz0yFqfZ12eV+jdX6xu9XV008N/rBUQsi4uKMB8rsOyBv9oOXkV0JEBgtaaUpNbaPr7BWuLIqtmGyN5xvBDmuHsQDjryXGI+wvX9ypLVp2/avo5dL2ubvIWQcXfYGcDdg3AJAy48Odl6ERAc1u/ZncK/txsetYKymZQW2mEDoHF3euIbIMjbH3x16Faa7sY7RLXrW/wB80zq2gtbbvVyzuADi7gdI57Q7LCMji6LviIDi2seyXW2qrRpCR+o6E32wumkmrJQ7EkjpGOjc0BnQMHMLYNJ6b7UaS8PfqrV9vuttfBIwwQ07WO4yMNORG04HuukogPNVB+znrqlstRYm6voKa0VsjZKmGESHvCORI4RnkNs4W+aw7DqS9dmdl01aa4UtZYyXUtVMD4y7d/FjccTsHblgLrKIDieneyDWNf2i23VWv9Q0VzfaWtFNFShx4i3JbnwMAw48R2JJ5q71l2Sakd2iv1toK+01qudQwNqYqoHu3nh4SdmuBBAb4S3mM5yuwogOXdmfZbd9MaruerdT3xl0vtyiMMncNxE1pc0ncgZPgaBgAADkenUURAEREB//2Q==",
        "target": 2000000
    },
    {
        "balance": 230000,
        "id": "STU-005",
        "name": "ALFIESYA NUR RACHMAN",
        "nisn": "0085602576",
        "password": "password123",
        "phone": "081234567005",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 29000,
        "id": "STU-006",
        "name": "ALIP PIRMANSAH",
        "nisn": "0087807942",
        "password": "password123",
        "phone": "081234567006",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 5000,
        "id": "STU-007",
        "name": "ANANDA NOVAN ALVIAN",
        "nisn": "0086664698",
        "password": "password123",
        "phone": "081234567007",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 212000,
        "id": "STU-008",
        "name": "AUGRAH DWI AURAWATI",
        "nisn": "0082163626",
        "password": "password123",
        "phone": "081234567008",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 26000,
        "id": "STU-009",
        "name": "AURA RIZKA AMELIA",
        "nisn": "0087919336",
        "password": "password123",
        "phone": "081234567009",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 50000,
        "id": "STU-010",
        "name": "CHARLIE NOVAL PRADANA",
        "nisn": "0086133724",
        "password": "password123",
        "phone": "081234567010",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 150000,
        "id": "STU-011",
        "name": "DESIANALESTARI",
        "nisn": "3080709342",
        "password": "password123",
        "phone": "081234567011",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAcBAgMFBgQI/8QARhAAAQMDAgMGAgcFBQcEAwAAAQACAwQFEQYhEjFBBxMiUWFxgZEUMkJSobHBCBUjM2IkcoLR4RY0N1N0orQXVHOykvDx/8QAHAEBAAEFAQEAAAAAAAAAAAAAAAECAwQFBgcI/8QANREAAgEDAgQCCQIGAwAAAAAAAAECAwQRITEFEkFRBhMUImFxgZGhsdEjwRUyQlLh8BYzU//aAAwDAQACEQMRAD8A4dERcefQ4REQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBVa1z3hrGlznHAAGSV6Lfbqq61rKSjhdNM87NHT1J6D1Ux6R0NS2JgmeG1FeR4piMiP0b5LLtrWdd6aLuaXivGKHDYevrJ7L89kcNZOzW53FjZq54oInbhrhmQj26fH5Lvbd2eaftcQnmpmS8A8UtW7Lfcg+H8F6NZawtWgbL9Or8zVEmW09O0+KV36AdT0Xy/rHXmoNa1zpbpVvFPxZjpYyRFH7N6n1O63tOzo0ltl+08zvfEF7dtrn5V2Wn+WfUDKvRMcn0dl0sDH8u7bJCPhjKvrdF2C6wiX930sjTuJKbwE+uW4z+K+N2xl2xXT6Y1lqDRdQyW1V72xE8Tqd5Lon+7f1GCrrUWsOKZrKd1XhLmhNp98sna79lVNIHPtVW+F4H8qbxNJ9+Y/FR3c7VW2esdS10DoZRuM8nDzB6hS5oHtJtPaDSGNoFFd4m5kpnO+sBjLm+bfxC3d7sdHe6F1JXQ8Q+y77TD5grDrWFOqualozpuG+Kbi3koXXrx79V+fj8z58RbrU2mavTdd3cuZKeQ/wAKYDZw8j5H0WlWhnCUJcslqem0K9O4pqrSeYvqERFQXgiIgCIiAIiIAiIgCIiAIiIAiIgCIiAK+GKSonZDEwvkkcGtaOZJ5BWKQezSwh8j7zO0ngJjgB8/tO/T5q/QoutNQRr+I30LC3lXl02Xd9EdfozSkVhogzAdWTAGeXnj+keg/FdVWVlLaLbNV1Egip6dhe9x6Abkq6miEMAJ+s7cqGu3DV7niLS9FJu7EtWWnfzaz9T8F1cIRpQwtkeJ3NxVu6rq1HmTIu1nqKr1rqqe5zF3dk8FPF0jjHIe/U+pVlr0vLcBtHhvLJXS6S0PNXhtROwsj9eoUnUOnqSkja1sQ2GPRa+rc4ehlUbTKzIjGm7OInty8n2CVfZ7FDGQ1h5c+al9tA0bhoGFbLRskYQ5oWJ6RPO5m+jQS2Png2656Yu8NfQvfBPTvD45GdD/AJei+mtEarh1xpeKvaGx1sX8OoiH2Xj9DzC4O96eZIxx4MtPmFyel71N2d62ineXC11ZEVQMbBudj7tO/tnzWbRr65NfXt+XbYnG82qmvFtloqpmWSDY9Wu6EeoUGXi1VFluktFUtw+M7O6Ob0I919EVLGyMbNGQWPGcjl7rjNa6aF+tnewNH06nBMf9Y6t/y9VVfWqrw54br6m68OcYdjW8mq/05fR9/wA/4IcREXMnrYREQBERAEREAREQBERAEREAREQBERAem3UMtzuUFFBjvJnhoJ5DzJ9hup7sVshoKanooG8MULfn5n4qNuzC2CavrLk9uRTsEUZI+07mR7Af9yluiHBG9+PRdBw2jyw8x7v7HmHi2+dS4VtF6Q397/C/c8eqb/T6csFXc5zllOzIbndzuQaPc4Cg/S2nKjUFzm1BeiXvneZA0/aJP5Lo9c3B+rtZQ2GndxUFsfx1BHJ82Pq+zR+JPkuloqVkUMcbBhjBgYVd5Wx+nE52zoJrzJfA9FJTMjjaxrQ1o5AdFsWQbA4WOnb0XuDcALWpZNlJ4MHdjHJYpIds4XtwqYwpwRzGpmpw5hBHwXCat05FVwSRObs8eE+RUj1DBvhae40ongcwjJxspi3FiSUlqYuyG+zXHS81hrz/AGy0EQ7nd8R+o74bj4LrJQWSEdQov0/KbFr2jrm7Rz/2So9WuPhPwdj4EqV7izhkDxydut3az5o4NFcU+SZDPaJZhatTvniGIK5vfswMAE/WHz3+K5RS52m0H0vSEFY1uX0UwBd5Mdsfx4VEa5+/peXWeOup694eu3dWEJSesfVfw2+mAiIsE34REQBERAEREAREQBERAEREAREQEy6CoBQ6KpnkYkqpHTu+eB+AB+K2+sb7/stoetuQGZY4+GIecjjwt/EhZ7TRfQrPQURxmCNkbseYaM/iue7WgJtP0FGd2yVbXuHmGtJ/PC7ClHyqaXZHhN7Vd1dTnn+aT+Wfwcnoa2vprb387nPqJyXyvdze47kn4rtI+mFzVFVTQU0cVPTPfwt5kYGV6WS3uVxMcLI/ff8AVaRpzeWzaKSgsJHXUrCRkr2tDWt3K4lst7p8ONQPUFoWworpUufw1BGfMKl+qF650bngKgcHbclr/pJ4ckrW1ldUOBbC/gPmoUslThg3s7MtPiHzWrnc0kjIytJ9BrqoFzquXfl4iqCxTt3+nSA++c/iqsJ9SlSktMGt1DT8MxeNg7fI81JlLVi56ZpawHiL42kn1xg/io5u9uq20JcJ+84N8OC63QEhm0dLA7nDI9uPfxfqs+zlia9pg3kcxzjYu1QwT6IusZHF/AL8f3SDn8FBi+h4I46jvaeVofHJC5r2nkQdiFAFwpHW+51NG/60Eroz8DhY/FYaxn8DsvBtdOFWh1TT+en7HnREWkO+CIiAIiIAiIgCIiAIiIAiIgCy0sYlrIYzuHPa0/ErEstLIIqyGQnAY9rj8CpW5TPPK8H0ZT4dXzNJ+rID8C1cv2gxfSK21QDfxvd/9V0jXd3fwOkrBj3H/wDVoL+4VGqI2ncU0Wfi4/5BdbcS5acjwi1jzVYmlqquK3RF8xDWt6nZc7N2lUsEMk1PTy1EMTxG58cTnNyeQ4thkrsqy209xhMdRC2Rp6ELT12j4a2z1FqdI36HNg925n1TzBBBBzlain5b/nNrV83HqGO2aypLpIaaWGWlqgMuhmYWO5luR0Iy0jn0K2ErcSAt5Fa/SvZ5R6doqimglEv0nHeySR5JA5DyAXRPoo6Okhp2udJ3Yxxv3JSahn1GRSc8eutSrGPNKHei8HAZJ9+QW5jcP3fhYaeBkzJIySOMY4hzHsrSSRfbZy1/1vRWDhh4HyzEOLWMbsQ0Zd4jgAgAnnlaan7QJ5zLLLbqqOkhlML5mtEjWvGNiW+/Pl6rqb3om23i2st1Y2R9Mx3G0AAEO88gZysdu0XQ2u2Nt9HJPHSNeXmPI8RPMk8ysj9Hl9piYrufTBVlXFdLY6Snk71jm7EcluOz7iY24055Za/5gj9EhoIaWExwxtY0jkAsujWGG8XCM/cH5lTbPFRYJuk3SeTcUAxWSHoIWj5kqH+0aBsGuq3hGA8Mf8SwZUy0LfFK7+638M/qod7Snh2u6wD7LY2/9gWTxP8A6fijaeEc+nSx/a/ujlERFzZ6oEREAREQBERAEREAREQBERAEREBPFBVurLBY7oTxP4Y+8I8yAHfitZXu4dU3Ti6PYB7cAP6rzdm1X+89GVFtc8cdLIWtA5ta7xA//lxfJeu/s7nUU7+Qmijk+O4/QLpZy8y2U/YjxitR9Fv6lF9G8e7dfQ9FM8OwCvf3LcZWmpJAcbrfwljoQc4WrSMuWhSNoaNlqrg8cRC2xkZH4gRkLna2YSVLn5wwnZSW+psosfu0k+SxUUnjXpzA22HMjfq+fNaqmlDDxt3aCoexUtzoi0ELH3Yzy5q+OdkjARsAFkHdtYXOKqSyUt4PBUAN2WPTvh1BXnp9HB/FYquXieSPNX6ef/b7pJ92GNvzLlftlmqi1daUmb+kZwRf3n5+W36KA9U1/wC8tVXKqBy187g0j7oOB+ACm3UFyNl0vVVoIEkUJLc8uM7N/Er58JJOSckqvitTSNP4nReDbZ5q3D9kV93+wREWiPQwiIgCIiAIiIAiIgCIiAIiIAiIgO57J6h0eqJ4eLDJaY5HmQ4Y/MruNWwEVFJOBs5joyfUEEfhlRfoOq+i62t7iSGyOMZ/xNIH44Ux6ggNTZJHNGXwuEuPQbO/Alb+y/UtpR/3ueX+J4eVxKNT+5L90clTSlhwtvBUu4QAVpmN3XthcWEHosFmGpZ3NsyB1RE4OcW5GxXJ3u2XydjKa21dPSOEg45ZI+8y30HJb/8AerGeAuAVv7wpw7L5W591KeOhQ48xqv3fde4MHesDy3AkxsD54XmsNu1FTtlp7pUU1Ue8xFNG3gJZ/UOS6T6XSub3jZ2cPXKxC50vekslaT67KW3jYcrzk2ZgEUDGscSWtAJXilqHAEZ2WKS7x5DA8b+qwSPL8nzVBVHTctfNxOW005TPFPVVLthVzNa0f0szk/PK1UELppRGz67zwt912AYynayFn8unjDB7rYWUMy5uxr76piPL3I57WbwCaW0Rnr38n5NH5n5KNFu9Yyum1jcnPcXETFu/kNh+S0i1V5UdStJv3fI9V4LaxtbGnCPVZfvev+AiIsQ3AREQBERAEREAREQBERAEREARUzvhVTBCaexkpqiWkqoqmF3DLC8SMd5EHIK+iaOoZWUME4b4KmJr8HycM4+RUFR6VvMtJFUtoz3UwDmu4gMg8jjKm+0sY20QU8Tw4QMbG1w9BgLfcMhOLlzLCeDznxdXt6ypeXJOSbTw8423/wB7nKXGjda690OCYjvE49W+XuOSzUsjXtwurrrbFd6AtI4ZBvtza7zC42anqLdUGOZuCORHJ3sq7m2afNHY5m2uVJcsty+42unqocujBcN8kLVRW2FkmA90Dh1G4/FdBTTCQAFeltqiqWk5I9lhxm9mbCMlHU0P7rI+rWtI8yzZYJ7bFkB9QZ3fdYOFdCbC3O1RKPgrhZI4BxOkLvcKrnLjqx6I09us9NG0yPibxefX5r1yuDGYWed7IW8IOyxUMDa2Yyzkspo3YcRze77o9VEYyqywjGqVFBZZtrDSd1Ga+QZJHDED18z+nzW24dg07n6zvdUpmSGPv52CNoGGRjk0dAjpA2Jz8/Fb6hSVOODRVqjqS5mQNqp7JNW3R0Zy36Q8Z9jhahbq+afuFBV1dQaKdtEJ3hkrmnBHEcH/AFWlXJV1KNSXMsas9xsZU528FTllJJfJL6hERWDOCIiAIiIAiIgCIiAIiIAiLpdNaIuGoQJyfotH/wA57c8X90dVcp05VJcsFlmNc3VG1purWlyo5pemK3V09P38VHPJDy42xkt+eFJQ7IKVzG8N4lDh9bMIwfbfb8V3VFZ226iipaeMd1EwMbw+QH5rZ0eGTk/1dEcpe+LLenFeirnfXOVhfIpb6DitdMyVreNsTWuwNsgDOFlZT/RZPC3APNeimd3T+B2wK9wja8EELolouU8wnJyk33PAQYXiZn1T9YKyvoYbjATgE+RXt4DC4tI4mlWGnLPHCct8uoUNZKU8HFVVqqKOQuiaSB06qkNxfGMEYPkV2T2sl2kbuvLNY6WoOXtHuOawKtpGbzHQ2FG8cFiWpzzbm4b8RCx1FydJgZz6BbqTSlM4eCZ7D81mpdPR03J4cfPh3ViNi86syJX0MeqtTm222prvrF0TT16rf2+1U1Axj5SCW5EbejfQD8zzPVbeKhijHUlZ+7aDkNGfPC2NKjCksRNbVrSqPLPBNBNWFuT3UQ6Y3KyinZG0YGcdSvUWqx0Tng74Hmr+Swc7qCkjuVvnoHS9337SziAzjPooWv2mrhp+qMdTEXQn6kzR4XD9D6KeZ2U1Cx0ohdO8Hmdzknor6ktbHmaLhGMnIyAsO6s43O+jOg4RxurwxtRXNF7rb5M+bEUna50pBU2sXW1290c7XAPZEzh7xp2zw+ecKM3sfG9zJGOY9pwWuGCCucubWdu/W27nqHDOLUOI0+ano+q6otREWIbYIiIAiIgCIiAIi6HRenRqO+iGUkU0Le8lxsSM8vif1VdODqSUY7ssXNxC2pSrVHpFZNtoHRX77m/eNewihjPgYdu+d/kFMMUMMULWDha1owAOgVtJHFSQsp44WNiY3haGDZoXrYIX8g3K6u2oRt4cq36s8Y4rxSpxKt5k9IrZdl+e5h7sEcTCqxveG+IYXqDR0wqOhDhgHCy0+5qMmJzGTDfn5qsUhjPC87eaoaeWPePB9CeauwSMSRuHwypIPSRxt2wVjaxzTxNy09QVjaXMPgOR5LMyoB2PNU7ElCI5B428J8wrPo727scHBZx3bjnGCfVV7tnR2FAPP3b/ALUZVwYR9h3yWfhH3iq4HmUGTDwv+4R7kIGSHmWtHpus4aPUqvCmSDAIw31PmVUtzvzWU4AwVgfK4u4Ihk+Z5BStQYX02SdwA7zWOaIvOT0XobC2Jxle4vkI5np7LzSPfJIIYvrncn7oUoFvdmd/CBhjOZ8z5KL+1yz0sD6W5xOYyokd3UjBzftkO+GMfEKWsNha2JnPH/6V4LjZKS7UUkNVTR1MT+bXDf3B6FWLiCrU3TfU2XDL52N1Cv0W/tXU+aEXfal7MqqiL6izcdTAMl0D/wCYz2+9+fuuCc1zHlrmlrmnBBGCCuUrUJ0XiaPZbLiFvfw8yhLPddV70UREVgzwiIgCIiAq1pc4NaCSdgB1UwdnukKuyxuq62Qslq2hppwPqAHOXevp0z8tb2b6OLWNvVdF4nf7uxw5D7/v5fNSlDCGAHG4W8sbTGKs9+h5v4l475jlZUNv6n39i93cyOibjDRhYWwtl8RGHNOMjmvQcq2AfwyfNy3BwJjkMkDc47wemxWSOUPbkLI4YGOpWGoaIaVzmbPA2VWQegO8lkbutdSVTpYWmVndvI3ble5jwQgLzGx31mhY30zHAgH5rLxtKu8JHNTloGrljrKZ2WRmoj8mnxBemmlZMMeJrhza4YIXpJxyKtLg7Ytz8FLeQXiMBONg2BB9t15X0FNI4uMIDj1G35K1tqpc57vf1cVGF3B7O9aNyPmcK0S959XceipHBHGNmhZMgJoCzgzzPyVHFrBgAAI9+AvMQ6Y4GzUQMc0r5TwxfNZoIRTQ7eJ53J6krI1jIGZPRUiJeTI/bOzR5BS3oDA2NzeJ7zl7uf8AkqxziKHcEnJWZ+2D9krCIsP4egdn4KjcCRwlw9rCHeuyjftC0G6sifd7fEBVAZljYNpR5j+r81JjAMEHctOFSdveMEZ5OVqrTjVi4T2M2xvqtjWVai9V9V2Z8skEEgjBHMFUUjdpWjjSVL7vRRYjdvURtH1T9/2PVRyuWr0JUJuEj2nh1/S4hQVen8V2fYIiKwbALfaLs4vWqKaB7A+GM97KDyLR0+JwPitCpS7J7U6KnrLg9jmvkLWx5HNoBOR6E/ksq0pebVUehpeOXvodlOonhvRe9/jck6GnbDTsa0ABvQL0AbI0h8bXdCnI4XUnijKSfy3Y8kg/kM9lST+W72V8Y4Y2j0QgqBvnqsUo72VsfTmVm5DKxwjLnPPXYKQY+6Akc57SR0wrHSui3Yx7h5bL1O3CoGhTkGFlS1/ofI7LJ3nqrHRtc7doXP6prKyzwRVNHJhvFhzXDIKqWuiIbS3OlEhVwefJcHDrCucxrjDC4HyyP1Xsj1oRjvKJ3+GTP6KeV9iOZdzshIfJVD8rlm62ovtwVDf8IP6rO7WlpaPryk+QjKjD7E5Xc6PiVrnrU0F/proSKVshDdiS3AXsL5HHZvzKgGVw49lV8rImeS80jajh8Dmhx8xkLK2IvdG5zQ0gbjOVOSSyimfU8b3tLQDhrTz9yvRw8PXZY4RwyyD1WRxJdhUvcFSOKMq1mSAeo2+Cv+zhVYN1AMecVDx5gFMcT/ZUdtVO/u/qrwMD1KA8NypWVbDHI0PY5pDgRkEeRXz7q2wHTl/kowS6FzRJE49Wn/I5HwX0c4DvWA9cg/JRf2sWnv7LSXSOPL6aTupHAfYduM+gP/2WDf0fMouXVf6zqfC987a9VJv1Z6fHp9dPiRMiIuZPXTPRUr66vp6VmA6eRsYJ6ZOF9B2KjjoWzwQtAhhnELMcsNaGqEtIUclVfY+6hE7weEMcMtOdjn0xn8FPFFTilpJIA4uMZ4i483HmT8TldBw6g4U/Mf8AV9llfc8u8XXqq3MbaO0Fr73h/bHzPfCeHijP2T+CyOGCsTtiJB1G6zA8Qx1/NbM4ssfyx5rIsTvrtCyIQUecM91cBwNa3yVpGXAK5x8akAoOSoeSqOSgFCPEtVqej+l2GduMuaOILbBW1DQ+me0jOQqovDyRJZREVG7+Fg9CvTlYqmH6BXTwyeAcZLc7ZCsjqYXuIbKxxacHBGxWSYxnLlhLXSzNY0cTnEABVc8YzkH2W60paX1tZ9Lkb/DYcN9/NJPCyTFZeDqdPW4UNA0Y3I5+fmtwGKrGBjA0dFcDssXJkFpaOIK8bK0nxKqEmMDFS71GV5GXSkfdZKLvgJ4wC5p2XsP+8f4VEmsae5x6kmrDBKyEnDJW8sZ8xyVmvOVOPNFZNpwyyheVXSnLl0095LzuWQqsKiKivlwgp2mKrmaMcuM4W409q28V17hpXyMkiJAcC3cgkDn8VjQvYywmjYV/D9alGU1JNL4EgneoPssmOHHmrGkCZ5642R7sZceTQs85swPf/Ekd90YHuVrbzahd9P3K27ZmgIbno4DLT8wF74xxgZ+0eI+yywj+0uPmEaTWGVwnKnNTjutUfMP0Kp/5D/ki+jP9nrd/7ZnyRa7+E0f738ju/wDmk/8AyXzOM7MtPuoLZHcKlnDLUklgPMN6Fd3ngrZGnlI1YmAtihz9ZrQHe/VZalpOHt5jdZtKPJBRXRHGXlxK6rzrz3k2z0xfyQD0CuaMHh8uRVkD+JoKyEZHsqzFLXHLx5rIOSxuwXNPUK8clJBc3zVoOXKpOGq1uygFxToqKvRAVVlQ7ghcfRZF5q53DTn3Ugja/SNqLtP1DDw/L/XK1NPGI3FoAGSSV6Z5TJVSyH7TyfxVjRzKy/YYvtKYDn+wUp6fijZYqVzGhvFGDt7KLGnhepT04/j03RnyZhWavQvU9mbBVCJlWS4UPNVCtVQgLT/P+C8ZYTM4Fu2fmvaf5nwWI7PypJTwYH2G2VkJM9FC53mG4PzC11v0rbbfeG1dK18bhk8PFkfit+3ZmckK0NDXF2SVQ4RerRkxu68YuCm8PpnQxCQGre0bkNBVlU4uLKdp8Um7j5N6lKcAVFRM7zDfkP8AVWxxu4nyP/my9Put6BXDGMsYB3AwOQ9gro96h3oMKuzI9uipDsHPPVQQU4kXm7woqgWTN4ZJG/4gszW8TBhUqGZa149lfAdseSpJLYgWuIWf1VHNBORzCuQgs+0rwrSMOV3RAUdzTKYVCoBd1VVQc1XqgLsLS6rrfoNle8fWcQxvudv9VuVxnaBUH+wUw5Oc55+A2VcFllMnhHIEZ3V7dmlWjkArvslZJjmMfWypN0k/j0xB/SXD8VGbRupD0VJxWBzfuSuH4Aq1V2Rdp7s6AoE6oOSsF0onVFXqgKH6x9lhd0Pqua1prGbSlTbWR29tW2sMgcTLwcPCAdtj5rlz2vVTCGyabOCcZZWAk+wLQqXUjF4bLkac5LKRKp/lK0uDWZPIc1G7u2GFkb2v05cw9gBOODh+JztyWrrO2eonYfoem5XR58JlqWtLvcAH81HmR7jy59iVInZHkMlx/RZWAnLiOaspWl8EZe3hJAc4c8HyXpwACrhbMMm4wknggx1OyysiGeI81ZNu8DogPP3Q8kWfhRMEmMjigx6KjRwvDh1WTGNlaB4cIC8jqiA7IhBQhAqqigBUzuqq0oC4bq4c1aFc07oCqj/XUveX+mjB/lwk/MqQOqjTVjy/VVQfuNa0fIK7S3ZbqbGpVx+oVaDkq47gq+WSzK7rQpP7tqW9BKD+C4Yc13GhTmhqv/kH5K3V2LlPc6lVRCscvFFdgED2VhV5KAjbtXhlqbjp6CNvHxSTYaOZPC0D81paJ1BYKanqK2z1U9wE5HC8YJLdwWAjOMluSMEEdcrotbSM/wBv9NMdJGzEdQ8l7wwDHB1IICtilp7lrqvrmStqGxNjZE5r+JrQWcX1s7ZIwT6FYFw+WWVvojLjU5KTytNzhptXV1yu085pY5TXR9zNBEXZeA4kYHnudsY2WS5W2KsqaG7UQApp6mKORuDxlxcAS4ABrSTkYHUZ6rrm2Gz0tyZUMp42TeJzQNu7e8nJB+1w4wB5FaGjbFUV8FK2SF7Z701zY2uBexrPFxY54JafTxZ6qiLlz8kveV+k0q2tGLjhLOfcTHE/wgYWcc1gYMBZWgdVszCMhK8+eKQlXyOwMDmVRrd0BXCK/ZEINh+7oP6vmtdda2wWKNkl3utJbWPOGuqqlkQcfQuIyt2vmvts0ze6XtWbqqu05LqrTppmxina54bA0Nw5pLN2+Il4OMeL0VGSCfWzWZ1sFyFwpzQkA/SRO3usE4B4845+qpFU2OagkrornSyUkRw+dtQ0xsO2xdnA5j5r5woanTMn7MWsYNOVV1IZNTyVFHcHscYHuljGWFrQC13Dz5+HkOvE2a+3Gk7Obl2exQuNbfq6imp2AHxskaHc/UiH5lRkH2E2u0+6gdXNu1GaRj+7dOKlndh33S7OM7jZX1NTY6KnhnqrlS08M4zFJLUNa2QYz4STg8+i+Urex0X7J98jds5uo2tPuI4lh0RdqXtJ7UtMWzVshbbKKmZR0lK3PdvdGwBrXb7cZGSepw3lyZJPr2Gjo6iFk0MnexSNDmPY8FrgeRBHMLWPu2l2SmJ99t7ZGnhLTWRgg+WM810DWtYwNaA1rRgAbABfBt1ksDbprFlzgq5Lk+rf+7nwuAYx3eu4+PJ3GMdPkmSD7jlp6CCldUyztjp2t43SukAaB555YXgtd301e5nxWm+UFxlj3cylq2Sub7hpOF82amF7m7Mey3Rdxmmo2XaZ/flwPEGGYNhyD91kmcH0W7raHsy0L22WygtzdR2262+aCHFI9joZnv4cF7nuLsOD8OAwMZwEyCeqm6aco6h9PU3mhgmjOHRyVTGuafUE5C11ZprS9eya8y1zTTvwX1DaloiHT63L8V8za/l05B2+6rk1RQ11bQDPCyjcGvbJwM4XEkjA5+fMbFbrRdpuND+y7rauqWOjoa9zH0gc7PEGva1zsdN8D/CpUmtg1ncn2k0Ppqupm1NHPJUwPzwyRTh7XYODgjbmCErdFaZtlDJV11S6kpYRmSaeoDGMHmXHYLTfs+/8C9P+9R/5Mq5L9o6yanrtO11yF2jp9MW+CF7qNoy+oqHTBm/oA5p3J3HLqp55dyOVEkU2hNOVlLFVUs0k9PMwSRyxzhzHtIyHAjYgjfK9Wn6LTkU1dQ2i4w1U9M8CqijqWyPhduAHgbtOx2PkVzdDR6luHYFpqk0nXQ0F0ltlE0VEvKNndM4yNjvjlsuJ/Zut8lo1f2h26aqdWS0lVDA+dwwZXNfUAuIJPMjPMo5N7hJInQ0EPPxfNaqmvOma65uttLfbfUVzSQ6miq43yg+rQcrle329Vlj7HrnLQyvhmqXx0xkZsWtc7xb+oBHxXFaZ7BNNXLQWlbpT3KrtN4kbFWPrYn5fK5zeMMaCcNIOMEDOxzlRkkmmR9piuDKCStgZWSDLKd0zRI4b7hvM8j8lWmfaa2pmp6WugqJ6c4ljima50ZzjDgNxuOqhjVYLf2xNJAuLiKADJ6+GdOw//jZ2mf8AWy/+RIoyCSNV6X0nWXCkrL9cW0cscb44RJVNiDgS0uwHc+QXjtGktEuMtNarw2eR/DK5sNcx7mhpznbp0Odio1/aja1980O19G+va6WoBpmOLXTjig8AI3BdyyN917uyK2Wxl+ulRT9mVx0jPFb5A2qqqyeZsgJblgEjQM9fPZUShGTy0V88uXlzoSK+h0RX1MDY71RmVjhwNirmZdzwMZ355Xki7OtGadvdJcJq+SmqzIXQ/SKtre9dyOAccX1unmF8y6W0Na752L6p1LO6aO5WeaPuHNfhhaeHLXD4n1zhdHqS61V60R2OVdbK6Wf6RUQl7zkuDJ4mNyfZoTkjnmxqUxbisI+o6iS0UVVDS1NdBT1E5Aiikma18mTgcIO5322Vl0rLJY4BNdrnS26JxwH1VQ2JpPu4hQp22/8AH7s5/wCop/8AymrWT2yh7RP2jtUM1X31Va7BSyPipGyFoLY+EYyCCBlznbEb9cK5kg+g7c+03alFXba2Cup3bCWnmbIw+xbkL1fQIf6vmoN/Z/ueiW6pvNu0lLfwamE1T4K8RiGNjXgAN4SXcQ7wDJO45qe0yDzfQYf6vmi9KJkBRPq7s41l/wCox1honUNNSzzxd3NSXFz3QjwhpLQGuGCGtOMDcE53wpYRQCEbb2E3Gi7L9TWaW7Us191FLFJLMGubBHwSB+BgZP2t8DmNhhZqHsOrabXekL9JXUZislDBT1TGh3FLLE1wa5u2MZ4eeOSmhEBBzOw29t7H7ppE3Og+l1t3/eLJvH3bWcLBwnw5z4T0Xq1j2G1V60tpKnslXQ228afibE6oDXNa/ABJBaM57wFwz95x6qZ0QHmtwrBbKYXAwmtEbROYSeAvx4i3O+M+ajvsx7LqzROoNS3C5VFFWNu9QJoRG0l0YDnu34gPvjl5KTUQEf8Aa52Yt7SrFSRU9Y2hudvkMtNO5pLdwOJpxuAcNORy4Vx1L2P691JqazXHX2q6Orp7LI2WnjomZe4gtO5LGDctbknJ2U4ogIsouyOY9q2q9Q3SekqbRqChkozTN4u8Ad3e52x9g8jzwtJp/sX1NZuzPVGjZbxQVFLdC19G/Mn8FwcOLiHDyIa3l1HqpuRAcp2ZaTqtD9nVs09Wzw1FRR97xSQ54Hccr3jGQDycFXtM0pVa37O7np6inhp6is7rhkmzwDhlY85wCeTSuqRAanStplsGjrNZ55GSzW+ihpXvZnhc5jA0kZ6ZC5Ps67PK/Rur9Y3erq6aeG/1gqIWRcXFGA+V2HZA3/iDl5FSEiA0WtNKUmttH19grXFkVWzDZG843ghzXD2IBx15KGI+wvX9ypLVp2/avo5dL2ubvIWQcXfYGcDdg3AJAy48Odl9CIgI1u/ZncK/txsetYKymZQW2mEDoHF3euIbIMjbH2x16Fca7sY7RLXrW/3zTOraC1tu9XLO4AOLuB0jntDssIyOLop8RAQtrHsl1tqq0aQkfqOhN9sLppJqyUOxJI6Rjo3NAZ0DBzC6DSem+1GkvD36q1fb7rbXwSMMENO1juMjDTkRtOB7qSUQHzVQfs566pbLUWJur6CmtFbI2SphhEh7wjkSOEZ5DbOF3msOw6kvXZnZdNWmuFLWWMl1LVTA+Mu3fxY3HE7B25YCllEBCeneyDWNf2i23VWv9Q0VzfaWtFNFShx4i3JbnwMAw48R2JJ5r16y7JNSO7RX620Ffaa1XOoYG1MVUD3bzw8JOzXAggN8JbzGc5UwogIu7M+y276Y1Xc9W6nvjLpfblEYZO4biJrS5pO5AyfA0DAAAHI9JRREAREQH//Z",
        "target": 2000000
    },
    {
        "balance": 202000,
        "id": "STU-012",
        "name": "DHEBI NURMALA",
        "nisn": "0084895927",
        "password": "password123",
        "phone": "081234567012",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-013",
        "name": "DINDA RAHMASARI SEPTIANA",
        "nisn": "0091881465",
        "password": "password123",
        "phone": "081234567013",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 590000,
        "id": "STU-014",
        "name": "DOES SALAM",
        "nisn": "3092826253",
        "password": "password123",
        "phone": "081234567014",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAAHAQAAAAAAAAAAAAAAAAECAwQFBgcI/8QARhAAAQMDAwEGAgcEBQsFAAAAAQACAwQFEQYSITEHEyJBUWFxgRQVIzJCkaEIUrHBMzdicoIXJURTdJK00eHw8SQ0Q1Rz/8QAHAEBAAIDAQEBAAAAAAAAAAAAAAEEAgMFBgcI/8QANhEAAgEDAgMFBgUDBQAAAAAAAAECAwQRITEFEkEGE1FhkSIycaHB0RQVQoHwFiNSM4KxsuH/2gAMAwEAAhEDEQA/ANHREXjz9DhERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBEQnAyhDeNWFK97Y2lz3BrR1JOAtPu+oqx9TJDA8wMYceH7x+JWGkrKiUYlnkkHXxOJXTp8OnJZk8Hi7rtdb0pONGDljrsvubxUaht1O0/bd6R5MGVhanVtQ/inhZH7u8RWtB3zKm3n5eyvU7GlDfU8vddp7640i+ReX33NhptXVLH/+phZI0/u+EhZaLVFufGHPdJGfMFucfktHDvNV4XgZwDx5KZ2VGfTHwMLbtNxCho5cy81n56M6HS1lPWx76eUPHnjqPkq65s2tkhkMlO90TiMZYccLL27VNVFKxlWRNGTguxhw9/dUavD5R1g8nqrHtbQq4hcx5X4rb7r5m5IoMe17A9pDmuGQR5hRXLPapprKCIiEhERAEREAREQBERAEREAREQBERAEREAWDvd7bBTyQUpD5SMOcDwwf81X1BXPo6AtjyHyeHcD0WmSl5jDR+I5wAupZWqn/AHJ7Hhu0fHZW7dpb741fhnovPz+pbOJc7HXnlRLD0CuI6ZwI8sjPwUwj5JIPou2fNC02EBRAPIV2+LaA09euAqkFLITgRZ3DjPHzQGPaMHBCnc3aQQeFXqKcwyFpx8lS2knBBweiEEG468E+6hKwYBHX0Q8HpjBQeJpygMnZL/Jbp+7qHPkp3YGCc7PcLeWPbJG17DlrhkH1C5WT4luWk7q2Wn+gSEiSPJYT5j0XKv7ZY72K+J73stxiSn+Cry0fu/Hw/fobIiIuKfSAiIgCIiAIiIAiIgCIiAIiIAiIgCIiA1vVxO2mAb+9z+S1hshZg/iHC2nV0jo6enLW9XO59DgYH/fotUdG7c0eZAA916Oy/wBCP86nxztKscTqft/1RdwVLpZmMY3c49SsvSWKrqqV1Y1n2beBkYyfb4Lb9H6Rp6O3d7VRtlqKhvOejR6LeaW3UrKeNndAtZ5Y4Sdyk8I5tOzbWZGn2LQvcW+OpmiElTIB4XtyG/8AVWNw0bdqurwYjK7yZCzYB8eMLrMAaWjDfdXjG45wBlaFXknktO2i1g4mzswvFVM4SsjhwBjc7OPySr7MK2liwxrZ3jOMuwPlx/FdtIIcSpHuAHiGVl+IkY/hII88VOgr492W08Q9AHYwsLW2mrtb8VERafXqPzXpGpDXk46dMLUtUWAXS2yQN2tJ6EjgLONy84ZrnZrGY7nBD95VaaeSmqGTRO2vYcgq5u9tfba58DgSGnG7BAKseivaSRzU5U5ZWjR1OCVs9PHMz7sjQ4fAqdYzTjnu0/Sl/XaQPhk4/RZNeTqR5ZuPgferSs69CFV/qSfqshERYFkIiIAiIgCIiAIiIAiIgCIiAIiIDA6sH+b4nekn8isHp6gddb9TwAHYw7nH0AWy6jpW1NllJJBh+0GPUKbs3pmmOqqSMv3BoPoF27Wpi3eOh8s7S27/ADNSltJJ+mh0SjYAABw1vC2CkpHPYNqwUFLJIA5zi2Mc4HUq4dSXd2DSVBijHQMA3fqtajnqc1ya6G2U9CWMB2+6uvo7WtWqUVzu9G9sc83ejoS8BbBFdGSMAJwVi1gzi+ZaF19HJ5VOWmyzIUX1Xdt35BHorKuvn0aMOij3kdQi1JeiKFTSuHQFYWtDmkgqpNrGrLnD6BHjOCC/k/BWs9wfXx962Etx1aRgj/msuVo1qaehzjtLt8s0cFS3AjjBzx5lc2IK7nfYW3GzTwkclhwCOhC4y6lMtaIWDl0mzHzwuhQn7OH0OXc0n3i5epvNhhNPY6VjuHbNx+fP81kFLFG2KJkbfusAaPgFMvNzlzScvE+421LuKMKS/SkvRBERYFgIiIAiIgCIiAIiIAiIgCIiAIiICWaidX0NVBG5pkMTvBnkjplOzSnP1fMHDGZcH8gtl0tSwObNUVGAzlmT+at9F0kdO2rEZDmPq5NhHmAcD+C6tDEaLS6nzHjlSda/xLaOUjMXi7xWSm72Rry0ceFuT+SxNV2h1tpggqZLHWGjnB2SFzRyPLA6fNbm+0NrWAPaM+4ygtD6WPY2mp5B75x+Szg4fqWTjVIzfuvBh6W+z1lFTVdZb5qKGs/ojKBnrgE46Z+CycLXQ1ojcCDnkK5ET2RZnjgf6N7sH9SpCHvrGyHlzlE2uhspKS0ZeXRwhp2kHgrGsjZ3PfTO2xnzKvbq1/cNDgrGaihuNLSwVO7bAS5rRja4+4PVYrfUyllLQhDcbA0uD6qmY5rtpDpAC04yAfRRklpZD9k4Oa7oQQQVh9QaGsuoLxHXVDe4ka0NkjZ9mJcdM9cenCx7dP1dLfe9oZG0tIetNG4lnxHot0oxxoytCU8+1EvrrTCPcW8ArkFuhE+qXEDLWSvefgOn6kLtNzjcLfl33vNc40Pp2atqam5yNIiY1zW+hJPOfVZQf9uRsi1C6pTkspPPoXqKrUROhqHxuABacHHRUlw2sPB9ipVFVhGpHZrPqERFBsCIiAIiIAiIgCIiAIiIAiIgCIiAytqncKaSIAlrXBx9geCf4LYqWlZQ17Y42hjCBI3b55HVavZah1Pd4C0gB7gx2emCtqnYYK5jgXFpzt3HpznGfmVfoPMcHz3tBR7q65+ktfobfRvBaC7Byq8rgThoyVh6GfA2jKy0Dmk5x1WaOGWlbGYacudhWdGx1TOzbwGhXd2d3gbGeGk8qe2yU9JVGN5GT4lk0REhdYHtp2nyHKsaRrZZNo/8LO3OpilpixvLjwFhKKA0VxDXnLXjPwQGTbT5GHtDseoUstKwRkhjW/AK8ftGCrGsqcMIAPojyMI129uaKeQdcBYbTsj7bbW26aGONpO4Ob+IO5/mr27T97taSGh5GfZWl4lEMAqwBEzZthYeHOJ6E+mOqmT5YGdCk61ZQju9DWq6XvqyRwOQDgFW6IuW3l5PrFKmqUFTjslgIiKDYEREAREQBERAEREAREQBERAEREABIIIOCPNbFFqOauFLSzRMBYf6RvU8LXVNFIYpWSDq05WyE3B5RQvrKnd0nGay0njyZ0SjmLi3DsDzWbppwB1C1agmDmB7Tw4ZCy0ch5LeF0D5dqtGZioMM0Ja/nPosNBa6Zlc+bDnPkAzIT4sDyz6K1lvLKd+HslcfIbTj81VgvZJDjAA13GHAjK2KMjHmiy4r7ZE6JuZKjvGODmv70jB8uB1V5QxncJZ5RI/GOBhWNReKcYZ3WBnP3uVLHWxuB7h+R6HqoaZKaM66oBJGeixVbUDnOdxyApDVggH1Cx1XOS4k9QsUshvCLJrBU3SOJ0gbty4k+3/AFWD1HVtqLj3THl7YRtLs5yfNWt1m76ud6M4VkqlarnMEe44LwlUVG6m9WtvDP8A4ERFVPUhERAEREAREQBERAEREAREQBERAEREAREQGfsNaTE+nfk7OQfZbXRyMc3noQtIsTsXAjGcsP8AELa6WQNdtPTyXRo+1TyfNeN040b2SisJ4ZeXGEPY10YHHPRXVJV2z6PtqGtZJ5ggFUom7iTlXjaGCZvjAW+M2jj69Cyrfqp0f2FO17z6ADCxdNao5agylgY7GOHEYWZloYIWksaPyVkJDHJjyWbqN6EPD3IT/Zho3chYi51IpoHSHnjAHqVe1UxfKCOgWHu9NPWUxMTdwhBkd/dA5K1yzGDkjfZQhWuYUqj9lvX+eZrrnFzi48knJUERcg+tpJLCCIiEhERAEREAREQBERAEREAREQBERAERZywaOvmpn/5toXvizgzP8MY/xHr8BkrKMXJ4ismqrWp0YudWSSXV6GDV/arHc73MY7dRS1BHUtHhb8T0C7Bp/sattva2ovc5rphg90zLIh7Hzd+i3GemjoKKKmoaeOna47WMjaGho8zgLpUeHSlrUeDxt/2uoUswtI8z8Xovu/kcfi0PW6dtDqy4d130srWNaw7tgw7OT7nH5K3OWEE9PNdku1o+sdNT0bBmQs3R5/eHI/791yMx788EeRB6hXKlFUVFR2PHSval/UlVrP2itT1ALfC4H281eit4wQsIaf7THQqLqWrA+zkJ+PK0csWTzyRlZKvcDjqrCod5k49yqLIK85y/A+CpywSbsPJcfcrJKKMXKT6EpcZCcdPX1WV01TfStRU1KWF7J2yRvwOjSw5VlFTEhuPNdD7PtPuhhlvE4wZh3UII/Dnl3zI/T3WcE5zSNdSXdQb6nJr5oS9WeqmDKSWqpmEls0Td2R6kDkLWl6nkjxMSOM8ZwsHqHs5sV+aZZaf6PUkf09P4ST6kdD81rrcNT1pv1PU2HbDGIXkf3X1X29Dzoi3LU3Zle9Ph88LfrCjbz3sLfE0f2mdR8shaaQQcEYIXJqUp0niawe6tbyhdw7yhJSX838AiItZaCIiAIiIAiIgCIiAIiAEkAAknoAgCqU9PNV1DIKeJ8ssh2tYwZLj7Bb5pTslut7DKm5l1to3DIDh9q/4N8vifyXYtP6Ssul4NlBSMjeR4pn+KR3xcf4K/QsalTWWiPK8S7TWtnmFL25+Wy+L+xz3RvY8MR12ohk8ObSNPH+M/yC6zBTxUsDIYGNiijG1rGDAaPQBRdOwfdDnn2Cpumk2klgaPiu5SoQorEUfM7/iVxxCfPXlnwXRfBEJHGSUN8hz8FZujdPXmTnYwbWhX0YDB4+pG53wUKeMGNx8yVuRzyMYwAPRcu1raxbNUveMNhrm99Hjpu6PH54PzXUukmFi9XaeGobA+GPDauE97TuPk8eR9j0KxqQ7yLgbaFXupqXQ4/IzDgcK5pphuDXAc9CqMcm+I94wskYS17SMFrhwQVO6Dc0OacfBcZ5WjO9jqitPIBkDCsSBJLtxnKriI7SScqFPG+SpZFCwyzSO2Rxt+85x8kz4BrxL+2Wqe7XGG302BJJy5/lGwdXfL+JC7BS0sVJSRUsI2xQsDGj2AwsdpjTzLBbsPIfWTYdPIOmf3R7D9eqy7jhdOhS5Fl7nGua3eSwtkWskXiKuGuaYm8cEIBhrpHeSgBtDWqwVCHdgcjkFa1qLs70/qRr5Z6X6PVO/0iDwvJ9/I/NbIQ9oO0ZHXCqQyB4GDjKxlFSWJLJvoV6tvPvKMnF+R5u1b2fXfSsr5XRmqoM+GpjHA9nD8J/RaovXsrRK0scxr2kYII6rnGq+yK2XUyVVpIttUcnYBmJ5+H4fl+S5Nfh2fapeh7/hfa1NKnfL/AHL6r7ehwlFlL7pu66cq/o9ypHwk/deOWP8Ag7oVi1yJQlB4ksM95SqwrQVSm00+qCIixNoREQBEVehop7jXQ0dKwyTTODWNHqpSzojGUlFOUnhIubLZK+/3JlFb4HSyuPJ/CwepPkF3LSHZtatLtZVVW2uuP+sc3LWH+w3+Z5+CzOjdMUumdPw00LG9+5odPIOr3Y559PRZ1jWtcTjn1XftbONNKU9X/wAHyjjXaOreSdGg+Wn838fLy9SLd7+SNg9PNHtbjOAcKdQ65HqugeRJMYwQhG5wB6DkqMfPB8kk8LcDzUgp4MjpD6jH5KrTZIkI/e/koAbY2n81Uhw0HB6uygIFn22FWHCkL2g5PBWI1Dqak09QCoqA6R8jhHFCz7z3noPYe5U7g1DtD06aSoN/pGnu5MNq2DyPQPH8D8lpP0h8XLSXMIyCt9t2sqypi7270MTJySBHBIXxtafiASeisbmNP3SBxNBLSVJPElPhoPxb0/RaK9pKo+ZaMvW97GnHklsabJWvc0Na125xAAaOXH0AXUtC6PNlp/rC4MDrlM3hp57hp/D/AHvU/L46roG3UlBffpF4cyWozimcB9nGfU5/EfXyXXCQtVG3cHme5NzdKouWnsSOOAqbWbjyp9pceVUAwMK2UChUHDGxjq48/AKTkvyfJTvG+Uu9OAoHgICI8yqQaWyYHTkqoB4CpT+FwPKAmAPUlRJJHPRRwpX+QQFvX26judE+mrKeOeF/3o5G5BXINW9j8lP3lXYHl8Y5+iyHkf3Xf8/zXZwMHKkeQcjqtVWjCqsTR0rDidzw+fNQljxXR/Ffxnkqop5qWofBURuiljO1zHjBB+Cpr0LrjQNHqelM0QbBcGN+zmA+9/Zd6j+C4DW0VRba6Wjq4nRTwuLXtPkV5+5tZUHndH1jg/GqXE6emk1uvqvIoIiKmd0LrfZJp9kdBLeJ4PtZnFkDz5MHUj4n+C5jaLXUXm701vpWF01Q8MGB0z1J9gOfkvSdFbYLTQwUFK3bBTMEbff1J9yeV0+H0eabm+h4rtbxDubdWsH7U9/gvu/qZuJu1mz0CYxyoMd9oPcKJ6ld0+WjyUM4Kj5KUcvQEG+Gf4o/xSKP/wAmU/GpBF58OFKZBFEMnaFUwFTc0E8jKAoPdLMdseWjzd5rGV9ihrLRUROG+QyGRrjyQ5ZwDBUsPMOfUlSnh5DOSy940Oj6PadpVtHNIOp5W0attwpK4VUYAZKcO9itZfHgl4OCryeVlFJrDwyqJsMLj5LedH3yvnZJRXKBzBCG91O78bSOh9x6rTrNRi4XOGJwyxp3P+A/6rp7KRgi245x1Ves09CxSWFkyDTnojnBrSSeAMrHsklpvC7L2fqFWmnD6V205DuFoNpPHnumk9TyVA+J2FFrsxghGDnlARdw1S4yz4KZ6gPuoCLXZ69VLIeVM3qpXjLggIn7qlYBgn04CmcdsZcfIJG3DWj0CgEpGQ7I4XNO1fS7LnZJLtTRtFVQDc8gcvi8x8uv5rp0o2s2jq7hWYijmlmhkaHxyAsc09CD1CxqQVSLjLZluyu52deNenvF+viv3PJyLuf+RW1f/al/RFx/yup/kvn9j6b/AFfYeEvQwvYtZe9uFZd5Y/DC3uYXH948ux8Bj/eXV3MzK9a92c236r0RbGOGH1DXVDv8RyP0wtlcMSu9107ePLTXmfN+JVnWuZS8NPQi13hYfkqxVADLXAdeoVSN++MFbygTDooD7xUfNQ/EgIj7xQdUHUoEBFOFDzUDkqSCJPhJUIRinaj24icVM0YiAQGG1HFFJaZzMPCGE/MDIXM8ue37v6roWtpTFp2bb1dhv6rQ2MD27mnr1Ct0vdK1Xcz+kYW9xUVB4dva0j+z/wCVv0J3RArn+nXOiiq2nphpwPmt7oXbqdvOeFXqe8zdD3UV3AeYRowOimcoBYGZA9FM3hqlcj5GRQuke4NYwFziegCDcEqIPkseb1bc/wDvYcf3lH64txPFbD/vBY88fE3dxV/xfoZBvVQxlytWXShceKyE/wCMK7aQ4BzSCDyCPNTnJrlGUd1glm+41vqQqrAAMlUz4pW+jRlJHnoOp4CGJK5+5zpD0bw1W8OfpB+KrkDIaOjBkqlAMzFAXmETKICxZCykipqeMYjhYI2j2AwFUlGHg+qlqjhwPoqjvHGCiWNES228skbw7KNHdzkfhfyPj5qGcEKoRke45CAj5oVAnjKO5CAiPNRClZ9wKdAQQcoTgKDEIISuzHj1KqfhAVGTmRo98qt5BAarriUCjp4f3nFx+QWjwAskx5LadbT7rlFF5MZn81rMeC4lXqaxFFOb9pmZsMg76ob5loK3i3n7BhHoue2qURXIZ6OBat/thDqNhBVar7xYp+6ZLORyoDqoNOQorWbCB6q2ubHyWirjjaXPdC9rWjqSWnAVyELgBuPQdVDWdDKMuWSl4HLnWq6N/wBAqQf/AMyoiirmNIdR1AwehjK6kJWE8OU4kb+8FW/CrxO9+eTe8EcoMFSwE/R5cYzywrpVsJ+qKPcMHuWZH+EK9LwRjcqROM8rZCl3fUo3l+7pJOOMAO5PqpRy7PkFBuS3J4yo+WFtOcAPASepUlMMvJU7zhhUacbWkoQVkUqIC0qvvZU1O7LC0+XChUeSkh8MnxUgqEYJCqNPCg9uUbwOUAIRudmD5KZS55IUEkW/dCioD7oUCUBB7s8AFTs6dCqfVyqHwxoQSdZQqjiqUX31WdyUBzjVcne3yXnG0ALDwj5rI3895eqonyfhYynBDiujFYSKUty4id3dXG70cF0GzOzTFo8iVzt7fFnJW9WKQ4b6PYHKtXWzN9F6NGdB5UxUAjjggKubicfBRKgCj3tjY573BrWjJJOAApBAoVDc1xGHA+fBUSoJIBRPRQ6DKkErJGNdG4Pa7kEHIKAnUUCICWTnAVVnhjVHq5Vs9AhBFERAWs/VUx4XKrP1BVJwwMqQXAPCZUsRy1ToAoFRJUjzjb8VBJUUruiieiYygJGYJU0p4wptjRyqMhyUIJ4R5qqeqkiGGo92AT6KQcwurt92qiP9a7+KsYnAOPxVed++rlcfNxP6qjtAeV0igVHjOMLcbG/FPSu8iwBad5La7E7daYHebXEfqq1fZG+juza2c9FWLc/JUIecK54VYsFMtGfQ+y1vtBDXdm+omy42/V8/PvsOP1WyOC1ntEkEfZtfnEAh1HIw59CMfzUMlHDKDSbb1JiCiZljR3kuOIxzyfM9DwFm6yyU1gloKWTU1bTPcA2ojhqiwwOLSRxu6ZwPn5LMVlmpqOx236M1zKu5NNPI4yHbt6ucWgc8cenQjkLEXbQFYytIoJWSQSd23dKclriDu3EdMY3H5LnqTi+Vas6bnQc8VJKK16eBreoLBJTMhqa6omroJmnuXzSucQOuBuPIwQcjjlegNDUTaDQlkp2t2hlFEcehLQT+pXJKqiba6W8WwPJp20olj3jJacnjdjgbsH0OPddvtEJp7PRwuG0xwMZj0w0BWKEuZcy6lWs00sF4hRQd0wrBWDBzlTDqUHDVDOG5Qgm3BFT3IgLp1LG8YOfzWOutzsVhiY+73Wjt0bzhrqupZEHH2LiMrLrzX22aZvdL2rN1VXacl1Vp00zYxTtc8NgaG4c0lnLfES8HGPF7ID0CyttH1Z9ZNuFMaAgH6T37e6wTgHdnHX3SK5WeagkrornSSUkRw+ds7TGw8cF2cDqPzXmuhqdMyfsxaxg05VXUhk1PJUUdwexxge6WMZYWtALXbevXw9B56TZr7caTs5uXZ7FC41t+rqKanYAfGyRod19yIfzKA9kNu9jdQOrm3aiNI1/dunFSzuw790uzjPI491GquFmpKeCoq7lSU8M3iikkna1snGfCScHy6Lydb2Oi/ZPvkbuHN1G1p+IjiVHRF2pe0ntS0xbNWyFtsoqZlHSUrc9290bAGtdzxvIyT5nDenQSew4mU9RCyaGQSxSNDmPY4FrgehBHULGu1DpyOUxOvtubI120tNXGCD6Yz1WZa1rGBrQGtaMADgALwbdZLA26axZc4KuS5Pq3/Vz4XAMY7vXb9+TyMY8vyQg90yvpYKV1TNOyOna3e6VzwGgeuTxhY62XzTl8nfFar5b7jLHy5lLVslc34hpOF5o1ML3N2Y9lui7jNNRsu0z+/LgdwYZg2HIP7rJM4Pss3W0PZloXtstlBbm6jtt1t80EOKR7HQzPftwXue4uw4Pw4DAxnAQHoCe+6foah9PU3mggmjOHRy1TGuafcE5CrOqrW+2urvp9P9CxzUCZvdgdPvZwvJOv5dOQdvuq5NUUNdW0AztZRuDXtk2M2uJJGB19eo4KzWi7TcaH9l3W1dUsdHQ17mPpA52dwa9rXOx5c4H+FBg9CU2ktP3CnbVUlQ6phfnbLDOHtdg4OCOOoIUtbpPTlspJa2uqjSU0Q3STTzhjGD1LjwFgf2ff6i9P/Go/4mVal+0dZNT12na65C7R0+mLfBC91G0ZfUVDpgzn2Ac08k8jp5rPvJeJjyR8Dp9NpGw1lLFVUsz6inmYJI5Y5g5j2kZDgRwQRzlV7RBp6V9TbrZcYKqWhftqIoqhsj4XEnh4HLTweD6FavQ0epbh2BaapNJ10NBdJbZRNFRL0jZ3TN5HB5x04Wk/s3W+S0av7Q7dNVOrJaSqhgfO4YMrmvqAXEEnqRnqVDk3uSopbHeG00bBxkAepWNptR6drrm63Ut9t1RXNyHU0VXG+UY9Wg5Wndvt6rLH2PXOWhlfDNUvjpjIzgta53i59wCPmtK0z2CaauWgtK3SnuVXabxI2KsfWxPy+Vzm7wxoJw0g4wQM8HOViSdvkrLbHcGUEldTsrJBllO6ZokcOeQ3OT0P5KwuNHY9V22vsTq+Odrh3dTHTztMjMO5BxnbyMc+65FqsFv7YmkgXFxFABk+fhnTsP8A67O0z/bZf+IkQHTbrYdNURohdbqKRsIcKds1SyEHwhrscAny+Bwq0FPpa6zOhpLrTVMm0vcyCrY44AwSQD0wefkuPftRta++aHa+jfXtdLUA0zHFrpxug8AI5Bd0yOeVfdkVstjL9dKin7MrjpGeK3yBtVVVk8zZAS3LAJGgZ8/XhYqKTzgSXN7xvU1h0HdJ6qMX2me+vY2GRkddGS8AkgDz6k9FuNVV2y3OhjrK6npXTHbE2aZrC88cNyeeo6eq8aaW0Na752L6p1LO6aO5WeaPuHNfhhaduWuHzPvnC2PUl1qr1ojscq62V0s/0iohL3nJcGTxMbk/BoSMVFYROWeqKmttdHVQ01VX08FROQIopJmtfJk4G0E5PPHCkulzs1jhbPdrnSW6JxwH1U7Ymk/FxC4f22/1/dnP+0U//FNWMntlD2iftHaoZqvvqq12ClkfFSNkLQWx7RjIIIGXOdwRz54WRB6It9ZbbvRtqrbW09dTOOBLTytkYfm0kK5NOwjHK4T+z/c9Et1TebdpKW/g1MJqnwV4jEMbGvAAbtJduHeAZJ5HVd7QFH6NH7/mirIgC5Pq7s41l/lGOsNE6hpqWeeLu5qS4ue6EeENJaA1wwQ1pxgcgnPOF1hEBxG29hNxouy/U1mlu1LNfdRSxSSzBrmwR7JA/AwMn8XOB1HAwq1D2HVtNrvSF+krqMxWShgp6pjQ7dLLE1wa5vGMZ29cdF2hEBw5nYbe29j900ibnQfS627/AFiybx921m1g2nw5z4T5K61j2G1V60tpKnslXQ228afibE6oDXNa/ABJBaM57wFwz+84+a7OiAtrcKwWymFwMJrRG0TmEnYX48RbnnGfVc77Mey6s0TqDUtwuVRRVjbvUCaERtJdGA57udwH746ei6aiA5/2udmLe0qxUkVPWNobnb5DLTTuaS3kDc045AOGnI6bVp1L2P691JqazXHX2q6Orp7LI2WnjomZe4gtPJLGDktbknJ4XcUQHLKLsjmPatqvUN0npKm0agoZKM0zd3eAO7vk8Y/Aeh64WE0/2L6ms3ZnqjRst4oKiluha+jfmT7FwcN24behDW9PMe67ciA1Tsy0nVaH7OrZp6tnhqKij73dJDnY7fK94xkA9HBR7TNKVWt+zu56eop4aeorO62yTZ2DbKx5zgE9GlbUiAxOlbTLYNHWazzyMlmt9FDSvezO1zmMDSRnyyFqfZ12eV+jdX6xu9XV008N/rBUQsi3bowHyuw7IHP2g6ehXQkQGC1ppSk1to+vsFa4siq2YbI3rG8EOa4fAgHHn0XGI+wvX9ypLVp2/avo5dL2ubvIWQbu+wM4HLByASBlx254XoREBzW79mdwr+3Gx61grKZlBbaYQOgcXd64hsgyOMfjHn5Faa7sY7RLXrW/3zTOraC1tu9XLO4AOLtjpHPaHZYRkbvJd8RAcW1j2S621VaNISP1HQm+2F00k1ZKHYkkdIx0bmgM8gwdQtg0npvtRpLw9+qtX2+6218EjDBDTtY7eRhpyI2nA+K6SiA81UH7OeuqWy1Fibq+gprRWyNkqYYRIe8I6EjaM9BxnC3zWHYdSXrszsumrTXClrLGS6lqpgfGXcv3Y5G52Dx0wF1lEBxPTvZBrGv7RbbqrX+oaK5vtLWimipQ47i3JbnwMAw47jwST1V3rLsk1I7tFfrbQV9prVc6hgbUxVQPdvO3aTw1wIIDfCW9RnOV2FEBy7sz7LbvpjVdz1bqe+Mul9uURhk7huImtLmk8kDJ8DQMAAAdD5dRREAREQH/2Q==",
        "target": 2000000
    },
    {
        "balance": 10000,
        "id": "STU-015",
        "name": "ERVANSYAH FAUZI NASUTION",
        "nisn": "0081666197",
        "password": "password123",
        "phone": "081234567015",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-016",
        "name": "FADHLI DZIL JALAL",
        "nisn": "0088134330",
        "password": "password123",
        "phone": "081234567016",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 120000,
        "id": "STU-017",
        "name": "FATIHATUS SHALIHA",
        "nisn": "3093487601",
        "password": "password123",
        "phone": "081234567017",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 65000,
        "id": "STU-018",
        "name": "FITRIANI SALWA",
        "nisn": "3084030878",
        "password": "password123",
        "phone": "081234567018",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-019",
        "name": "ILHAM ADI SAPUTRA",
        "nisn": "0092525525",
        "password": "password123",
        "phone": "081234567019",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 55000,
        "id": "STU-020",
        "name": "KURNIAWAN",
        "nisn": "0083705721",
        "password": "password123",
        "phone": "081234567020",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 55000,
        "id": "STU-021",
        "name": "MARCEL MU'AMAR",
        "nisn": "0097656255",
        "password": "password123",
        "phone": "081234567021",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 20000,
        "id": "STU-022",
        "name": "MELATI KESYAFANI",
        "nisn": "0092348363",
        "password": "password123",
        "phone": "081234567022",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 32000,
        "id": "STU-023",
        "name": "MOH ILYAS",
        "nisn": "0096716273",
        "password": "password123",
        "phone": "081234567023",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 2000000,
        "id": "STU-024",
        "name": "MUHAMAD ALVATAR",
        "nisn": "0072822191",
        "password": "password123",
        "phone": "081234567024",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 95000,
        "id": "STU-025",
        "name": "MUHAMAD APDIL",
        "nisn": "0092170243",
        "password": "password123",
        "phone": "081234567025",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-026",
        "name": "MUHAMAD FINZA DESMAWAN",
        "nisn": "0082428075",
        "password": "password123",
        "phone": "081234567026",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAYCAwQFBwEI/8QARhAAAQMDAwEGAgcFBAkEAwAAAQACAwQFEQYSITEHEyJBUWFxgRQyQpGhscEIFSMzUhZy4fAXJDdDU2J0grQlY8LRkrLx/8QAHAEBAAIDAQEBAAAAAAAAAAAAAAEEAgMFBgcI/8QAMxEAAgEDAgMGBAUFAQAAAAAAAAECAwQRITEFEkEGEyJRYXEygZHRFFKhsfAVFsHh8TP/2gAMAwEAAhEDEQA/AIOiIvHn6HCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIrckzIT/EcGjGeTjPzWUYubwjTWrQoQdSo8JFxWqipipYjJM8MaPXzWsr7/ABQwNdAWlzvU5wotX3Se4Sh0p6dPQK/RsJyeZ6I8rxDtTb0I4t1zS+iX8/jJK/UsTJT/AAh3ZOA7dz8wlbqWnp2bWNc6Ujj0+9Q+Sd0rQ1wAx6K27cCCfw810VY0sp4PIy7TX7jKPPv6LT2N6b5VTMbtfJvP2slo+AA/VXae9yUoJlnkkeBjBdkfio8J5AQGnBHoqXAl3Q5VjuYbYOP/AFC5T5lUefdktotTOJd9IAc3y29VvKWup6xuYXgkDJb5hc6ieI+XFmPTKzKesbT4eyV7X+x6KrWsac9Y6M7nD+093bNRrPnj67/J/c6Cij1jvrqqpFJMQ8kEsf5nHPKkK4tajKjLlkfSuH8QpcQo99R22eejCIi0nQCIiAIiIAiIgCIiAIiIAiIgCIiAIiICiWVkETpJHBrGjJJULvV5krJnRxFwiz0/VbLVladkdGwHJw9xB+OAo2G5dtb18z6LuWFuox7x7s+ZdqeKyq1XZ034Y7+r/wBFGxrWeJxc7zAVpzX9SNo8srJa5neEY8LAvZ5myNbIS3I4XTPDmJtc3GcjKyHn/V28Yd6nqfksZ0hcclXIw5+M529cj0Ugp2uazcT1XscTpSMdF7UEF42nIwvY5THgMHi8j7oBLTGDAd1K9ZG10TzuwQMjPmvN7pJO8kc13sT1SXudxIa5ntuyoBcopZKeobJFIWSN5BCnNpujLhDtJ/jMHi9/cKBwtBccHw/HC2NkrPolzje52GZ2nPoeFUuqCqwfmj0HAuKVLC4is+CTw109/kTxF4CCMg5BXq82fZFqEREJCIiAIiIAiIgCIiAIiIAiIgCIiAhmqHkXggOG0Mbke60Ukhc4kDGfJbrVw23lvHDogfnkrRsGfLK9Rbf+MfY+H8ZWL+sn+Zl1rd7eoa4D16qohrofE7xDywkdJNIC6KKR+PRpWXR0W+EuyHPOQWnqOi3ZSOYotmr2kvIAKrMr2sLGkAHqtxQ2+D6RieUN3dG9PvWZetN/Rpe/pw59NIA4ED6nsVHOs4Mu7bjlEYwXBesJa7nqs9lPG2LIIznoeq9mpGGLvATuaeceiyyYJGJjAGGtJ9V41m9+HA59lmUsbHh4ja5zvLjorL3d087x4vJMjHUstaWDI8vRXYABMC87fiFQJX7DtYdmfReCY55AOPIoCdafkMludlxIa8tbzkYwOi2ijukapj6aenHDmODwD5gjH6fipEvM3SxWkfauBVFU4dSaedMfTQIiKsdoIiIAiIgCIiAIiIAiIgCIiAIiIDQ6ptwqKL6W3iSAc+7VEIcMcSRkLpFVAKmklgJwJGFufTIUEo6CSW5ClkaQ4PDXD05Xc4fVzTcX0Pl/a2yVO5jXgvjWvuv9YOy6VoYm2KkaI2jMbTjHqMlbum0dZ3OMpo2b3HdkDz6LHtsQgpoY29GtAUjppGxxBz3BuTgEqq5yzoUFCKik+hpo+zizTTRd9FvbGSQD7/8A8UmfpS0SUwY6mja1rdoaOmPdZFIN58JDitm2nf5hZc8nuYuEFsczunZJbayp7+mIgd/SPqlZNP2bUNNQzNkaHF7C3GAV0NsRDsEKmSF5Bws+8mYKlDojktBoBlPbnNfAYjggYGHNz59OVFrn2X1MjZaqGYDBIZG4Zzz5n3Xc5mODfFkgrV1oYYsAYHkFCryTyhK3hJYaPnu66RrqCkZK2MOY7ggc4Kiz49kjg4FpBwRjlfQ9fExzXAtBHU+64RqGmMV9qxt2gSnhX7eq6mjOZd0FSw4mZpEtN5k2g47k9fiFNFGNI28Bj617QT9RnqPU/wCfdSdci+kpVng+o9l6U6fDo863ba9giIqJ6YIiIAiIgCIiAIiIAiIgCIiAIiIC7T08tVO2GFu57umSAPvK1tfZKi2avh+kwGPvmtOQQQ45x5fJTnQUcDqytklGXxQhzc9MZ5/RbTVNFDV0scjhieORkjD5/WGQr9riL5vM8L2kuZVJfhcLCw/XP/C3TBziAAs792VtcMOkwCcNA42qu20pEJeW5wFjT1V5mrmQx1IoKYHxujjDnkfE8D7lti8PQ8xUWdDINnv1qPe0s4Hz3Z+IK3Nr1HWOeIayMBw4JHCgtDFreTWH0Kpr6r93CYvNU6aPuzDngbdn1se6lPczvklG9k3cn+aw9R5H2W6rFrfHyK1FqW2fmTJtWzZuwCsKtvjKNrj3e7AysWBsrrd3vTjlaSeZzi+VzHSNbxjGVoi2WZRRaq9VXKtk2U1C3Z0ztJwsF9yrGyAVTMt8wBj8Fi3btDn0pev3fWWxrXBrXta3cXvDum3Ddp+ZHRbF2qaO41z6KrpjBVDqx7ef8/DK3yi4rxRKsJKUvDI11RIHgkdCMhci1fS95qV7GEl0rmj5nC7LW0scUeWfVBUQotJ/vjVFTcJ3vbFE7YwNxy7aFNKfJlm2pTVZwjLbKz7dTV08DKanZDGMNYMBXFk3CjNBXy0zs5YfPr0ysZcaWcvO59houDpxdP4cLHt0CIixNoREQBERAEREAREQBERAEREAREQG+0fU9xfhGcbZ43MOf/y/+KmFzY2aKaRxBcyRrWj0Geq5vSVL6OsiqGAF0bg7B6H2XQ7iWyUnfNDt5wcjzHurlu9MHiO0dHlrRq+a/b/pt7ZFviAB4WzNrieA7JY7HULV2WRvcNfnlSOPD4gRzgLatzzMtjVyW6ZzxuqXbR0wMKiVndRmFhcSepPmtq/wtyVpRM6eoOx2QTgH1WTbMIpdTMDXstpaD5LCpmNlpjC4DcDkZGVsTE76EffzWnZK+CraHfVzgk+SjDRk8N6nk9G2WoY6elgnfGMMdJHy34HyWLPp+OeTv3xtDhyD1P3qUNb3rQW4BVMrcRZcOVk5NmKikRGsiH0Xu8cgdVRZIQ23OOOd5d8tyz7q1jGPePNYLq5lDYu+f4CyLDQRySec/jhRnQ2Qg5yUY7shGoZRNqGtc3oJC0fLj9FrUJJJJ6lFzW8vJ9YpU+7pxguiS+gREUGwIiIAiIgCIiAIiIAiIgCIiAIiIAt5Fqyvbbm0LhE6PhpeW+It9Fo0WUZOOxXr21K4WKsc4Om2epcIsYGGj9VLKSbwAZ6qC2GYuoYnt5LmAH4qV0sjsMOfJXvU+Wzg4ScH0NjWNdJTSCM+IjAWrjroYCyD6NN3jBlx7o7R8/NbBtXGJNm8ZVAk7zxZw31PC2L1ND02LputGafG9uMeq1EtdTVHeU8cUhlIyCYzj78YWeYoC8v2R5PV2AsQuEbi9j2vwOjSstCNTLt8xhibHJ1AV2qqmluMgBYLKuGqaWtID2rBrahwO3OXdFr1yZ5WMmuvFUO6LN4643HjCj2qayKOmjoYalkziQXljsjAHAVzUspjoi09XuA/VRNaa1THhR6rgXDo1MXU3s9F/kIiKme1CIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgJXpGuDWOhc4+B2cex/yVOqR7cnB4PC5FQVTqOsZK3pnDh6hdGoKstLQ48eRV6i+aOPI+ecdtfw9z3i2nr8+v3L9fR3PeZYJGRjPGG5JHx8lYpaaerl2yVjonjqHtUkieHx4Hi8+ei8nt4mAczwvViM/M4KWDVmwyuYc3Bob14HK0tdQzRVPcQVksjz6AYH4KSG11uSHTDb8Aq2UkdMCcAu81nzpEt5MC12R1ABPPVSTPI53kdfkrdTG11SZSfC0dFsK6oDYck+y0NXVuEDyB0GceqwSzqYN40IjqeqbNcBE08Rjn4laRZVwp6unrXtrYnxTOO4h4wsVcyo25Ns+rWFGNC2hTi84W/7hERYF0IiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIpVpvs9veo2tnbF9Eoj/v5hgO/ujqfy91nCnKo+WKyV7i5o2sO8rSUV6mgtVEbjdaekBLe9eASBnA6k/dlTeAOZGBjI9FL9N9m9ps1fHM909VVxAnvHO2tGRg4aPieuVqKu1vttxmo5Rkxng/1N8iupG2nQhzS3PnPFuLUeI11Gi/DFddNc6/4PbbcNgDCdwH3rcx1TSMtIz6qL1VG5rw9mR8OCvBDXuGYZ/k5Q1GWpyU5R0JaasEHJWHU1DGxk5HKj/d3of0EfFW5GVwGJZB8AFKivMhyfkXquUyk7n4aPVa2pcZG4AIaOfisiOCSR3iJKlmlNJGtnZcKxmKSN2WMP8AvXD/AOI/FbYrmfLA0yfIuebI5rLS9X/o+tlyrCXXGjjH0k+oecn7nH8SuZL6or6OKqopIZ42yxvGHMe3II9wVBbl2T2W4xPkpRJQSk5DozuZ82n9CFN1YyqPnpnoOA9o6VpR/D3WcJ6Na4T6ee5xFFMb52Yags4fLDCLhTt530/Lse7Ov3ZUPex0byx7S1w4IIwQuPUozpPE1g+gW15Qu489CakvT/K6HiIi1FsIiIAiIgCIiAIiIAiIgCLJoLbW3SpFPQ0stTKfsxtLvv8ARdBsnYzdKoh92qo6Jn/Di/iP+Z6D7yt1OhUq/Ajn3nErWyWa80vTr9Nzmq3endIXnU84Zb6UmIHDp3+GNnxP6DJXcLN2X6atOx5ovpcred9Sd+fl9X8FLYomxRhkMTWRt4AAwB8l0qXDXvUf0PH3vbGKTjaQ185fb/ZBNK9lFoseyouIbcqwYOZG/wANh9m+fxP4KcPA3dBhowAr31Wl3XCtGNzoXO8yuvTpQprlgsHg7q8r3k+8rycn/NvIwIGkSPlcMb3HHwHRY9/0+28U7JYSG1cI8BPR4/pP6LZMHe0wdjGCfzWRCcx/BZSSeUyvGTi+Zbo5c+lfG90UsbmSMOHNcOQVjuhLHeHhdGv1opq2H6Q57IJ2YAkccA+gPzUPqKCqie4S0svhOCQ04+/oVya1CVN+HVHZo3Eaq10ZrmvmLccH3wsaSEuPi6lbASRAdQttYrC26VRdUHZBHyWZw9/y6ge61QhKbwkbqlSMFmTMfTWmDcntqahpZRtPzkPoPb1P+RPxGyONrGNDWMGGtAwAPRXGsYxjWMaGtaMBoGAAvCMjC69KkqawjiVq0qssssSR74irVD/Iaxw5OVkzkMgI9eAvBF/DAb1HIW40HjoR9ZgIPstFfNH2TUrHfT6Fj5sYE7BtkHzH5HhSKJ4Iz7ryRnO9n1vzUNKSwzbSqzoyU6cmmuq0OHah7HLjRF81mnFbEORFJhsg+B6H8Fz6ut1ZbKgwV1LLTSjnbI0tPxX1gW7+QcZWHcrHRXKmdHWU8VSw/ZkYCFzavD6c9YaP9D19j2uuaOI3K5157P7P6fM+UkXbb12O2mraZLZNJRSH7Od7PuPP4rmeodD3rTeX1VP3lOD/ADosub8/MfNcurZVaSy1leh7ax4/ZXzUYSxLyej+z+TI8iIqZ3QiIgCIiALp+heyxl1o2XK+d4yGQZip2na5w8i4+QPoFouzbSv9or/9IqY91DQ4fID0e77LfwyfYe6+h4Y9rQfJdWxtVNd5NadDwvaXjk7aX4S2eJdX5ei9TDtlmobVTCnoKSGmiH2Y24z8fU/FbBrAPJV7V70XcSSWEfNJTlN80nllGMkr0jgJ+q9cPChiWnjLQ3zJVfRg9FQfrud8gvZT/CACkGPT4bCOOCSfvKqdKyGNznHDRySfJDmOIHacAeSxXwTVMzc+CHB8Pv5KUsgiWr7fJfzDVySuFLQZnji3ENe7+ogdSPLPT8VoKm4VbowXTyyfF5PH3rpktvYKPumtw3BAB/Jc6uNvdbqx0Jy6J2dhPX4H3Vinho01MrVGrbMSOWrPt9TVU1VG+iJFQThmPP2PssR0ez7XUqR6TtzaqsfUPGQ0bWfHzP8An1WcsJamuGW9CYWa7fvOka6SPuagcPj9x5j2WzHTqsF9CwlrmeB7ehCuwyTBwZI3J/qHQqnjyLe5XLl87GeQGSshox1VqMO79ziOqvfaCEFBaGPzjh3X4q5t8JXhGcg9CkR5LHdQgKdoAyPNJD4QvSMZCOGSFALXd4f7O/NW56VkzHRyMa9jhghwyFkdfkqnDIwpBxrXvZdG2KS5WGLY5uXS0o6H1LfQ+3n5e/JF9cVLPAeOpAXzx2l6cFg1S+SFm2lrcys44a7Pib9/PzXHv7VJd7Be/wBz6R2X41UrS/B3Dy8eFvfTdevmiHIiLinvwq4opJ5mRRML5JHBrWjqSegVCnXZ3p9s/e36okEbKORrYS4gAP67jkjIHH3+y3UaTqzUEUOIXsLC3lcT6fq+h1rR2m2aZ0xBQDBncO8ncPtPPX5Dp8lKgMxjC1FquAuFIHODWzRlrZGg8A9cj2IOQtq0+S9TTioxSjsj4dXrTr1JVajy28suA5TOVSgKzNBV9oLyV21mB1K8B5yqQd7y49B0UA8xy1vorrx4ArbOX5V148KkFGMjC8bzgHyKuNHCtvGH5CArIHIPQqKawtkclA+pHD4hu+KlZ9lG9Y1Ijsz2ebyG/r+i2U34kYT+FnOnF7o92G8e/wDgui6Tpo47XTPZjxR5PxJ5/FQDALAAOSp1o+b/ANKYzqWOc38c/qttXY10t2SYN5XuOeF60YHPVPtKsbyoJ9perxo8SAD6xVLwchw6hVfaKHplADyA4dCvCEb4TjyK9+q7CApH1iPiqurj7K20/wCsO+Crz4c+qAtzcho91AO1OxfvbStRMwEz0DvpDMDq3GHD7ufkp+7xSgeixquNr+HtDmPG1wPQhYzipxcXsyza3ErWtCvDeLyfJiLuf+h+y/8AFkRcf+lT/Ov1+x9M/vCx/LL6L7nEKeB1TUxwsBLnuDRhdk0ZXUVTaKanhc6mp2N2HJxwDtLj658/QkLnWkLe6audXHG2l8QBIAJ56+g46rodhoKm73aJtBugjiOZZ2NGxrcY248yR5fNXOFW2ac5yWNNH+y+Z5vthxFzuoWsHmMd/fXP00/UmsVO8apM8Dz3TYxFKwAbWgcsHXr1PwPOM4UgHDz7FWIqWKkjip4W4Y3J55JPmSfMkq87h/xCvI8eVZXueFSDwnkhAceMDzXgOI8e6OOCEI6BAVxBXXdFRGFU7ogDeipkHCqC8f8AVQHgPhUK1vUfyYfVxd9w/wAVM2Hwrn2sX5uzWn7Lc/j/AILbSXiNdR+E0gGGhS7R0maaRnmJs/eAok36ikejZMVU8Z8y135rdV+E1UviJ2jeq88lU1VCyeoOqIOqAj971P8Aue4im+jd7lgfnfjqSPT2WubrzJx9BHP/ALn+Czr/AKXN5uAqRViHEYZtLMjgk+vutV/YKcHLbhGT7xn/AO1Un33M+Xb5Hft1w7uo978XXcyv7bt6GiOPXvP8FtLPqBl3nfCIHRuY3dknOef8VojoWt5xWwEe7StjYNO1VmuEs808UjXx7AGZznIPn8FMHVz4jG5hYd03Sfi6bm/6TOPqAFU52GjCozmT5Lx3iOfTorZwiqPnLvVUyt3ucz2V1g6D0VtvimefkoBi5d6FFmbW+iIDgtvt7pNVfu6xgtZT4gLnDIkYMkuPlkkk5564xjC7bZrXDabZHTQjOOXPI5e7zcfdafT2l6aw0wIa19ZLgSSY8v6R7KUNHC10+ZQ5W9Oi8i7e1YVqznBe76t+b9/+lo+KpPsEf0z6Iz+ZIffC9PmFsKRS05XoVDTh5b6he5wUB6Tl4CqaNxytLc3PkduDp9jQ47IX7HPwOBn4laG4QTNPewNu0sfcsc5jaubd3h3eEYcPT08/JZKLewyluT4HCZ8lz6nt9RNBKZXXZg2ZbIKirAB3NAG0uyTgk8e3usenprlJTNkfQXd8m4tMbqyqbtbl3JO7k4AOB1z5HCjD3GnmdI6L08hc5mt1c6ZsYsNY9r2u8clXO4NPi2Agyezcn49FcltdNDCZpbYyhMFbTGCUvducDNg9XHy2g/4o1gLUnrTjK5tqSXvr3NkZDQAPuz+q6P8AYeVzO6HddJyeu79Fuo7s01djEYRtwtvpmfur2GnOHtI/X9FqWjCybdJ3N2p3njxj8eFumsxZqg8SR1JvIVStxHMbT7KtUS2VZXgXmUB4QFL+8DjtDduPM8oC8Do371U7oqS7DfipA3uxyAqXOyOF4XcqneM9UBQCe9d6YCueQVppzUOA+qACSrqkFYOGkryAeEu9SvHnDD6lXIhhmFAKUVaIDGABna0fZ5KyOgKsQDxOd6q8fqlQC1GfC4+pXpXjOIvmh6KQUuHjB8wqZHBrSScBVOGQrM0YlaGHo5SDxtPFMxm7cC3OC15affkK1JZKKY5eaon2q5R+TllgBoaBxhXQoBqzpe2O421fx+mz5/8A3Xv9l7V5wzuHo6qlI/Fy2zV6ShOWaV+jtPyD+Ja4X/3iT+quU+lrFROD6e0UcbwdwcIhkEeeVtlS4qU2RuW38Qv+C5jcPFcp/wC8V06U4p5D/wApXLqt3+vzO9Xn81vo9TTV2LfOV4XFjw4dQcpuOcALxw4OeqsFc6rQv7ykjd6jKyVrLC/vLNTu/wCRv5LZLnF4Dkptx0Rp5WBe7vHZbY+tkYZGtIG0HBOSpJSzoZ5GR1VD28DnoopT9o9qlx3kFRGfTwn9VZr+0a1x/wAmKplx1GGt/MrBVIsz7uXkS05yqX8DoopSdo1lqMB4qYnejmA/kSt/T3CCujglhcSyYkt3DBIHXhZRknsQ4tbmewYaM9fNVBU7l7nhSYA8uA9Febw1WWjnKvA4CAp3IrW9EBVGMNCrd9Qq212FU54LcKCSgcRJnhD/AC14OikgKkjByqlQTlxHogPT1CuNVsdFcagLgXvmqQeFVlAFQVVlUlAWqk4pJT/ylcvnOaiTzy8/mum1x20Mv90rl7jl7j6kqzR2ZordDwHCBuTyvV55reVyeaVq91rbE7jZjHwUg4PKi+mJGGka3z2hSRh8PCoPcvrYrHVRLtIm7rSzW5x3k7R+BKlgPVQXtTm22ehj/qnJ+5p/+1D2fzMo/EiEWahNwqwxrmtYOS53QDqSfYAZUnZbIG0YlipYhRyO2GSb68nO0kemM/h5rT6XO+2XIDDXNj8LskehwecY8PoVvZL7baixBlKW08rAyNsTncueTy4fn+gyqkFqsvB1lU5YeBZedf5/MfQhVBan119ioYMHfJtyOgHmfkF1QUTotRW1kALKalp3NI8ucAfkox2aW9zhVXWcbjnuoy7k56uP5fipg+pZDdoA9385jmge45/LKsU1o2c6rLMjbk8KryCstducFeWZoKm8KonwlUZXj3YYgLXKLzJ9UQk2H0Znv96191u1ksUTJLvdaK2secNdVVDIg4+xcRlbVfNfbZpm90vas3VVdpyXVWnTTNjFO1zw2BobhzSWct8RLwcY8XssSD6DFfaX2sXEXCmNARkVInb3WCcA7846+6piuNnmoJK6K50klJEcPnbO0xsPHBdnA6j71810NTpmT9mLWMGnKq6kMmp5KijuD2OMD3SxjLC1oBa7b16+HoPOE2a+3Gk7Obl2exQuNbfq6imp2AHxskaHdfciH7ygPsdt3sbqB1c27URpGv7t04qWd2Hf0l2cZ5HCqqa+zUUEVRVXKlp4agZiklna1sg6+Ek4PXyXydb2Oi/ZPvkbuHN1G1p+IjiVnRF2pe0ntS0xbNWyFtsoqZlHSUrc9290bAGtdzxvIyT5nDenRkYPsKGOnqIWTQyCWKRocx7HAtcD0II6ha52odORymJ19tzZGnaWmrjBB9MZ6rcta1jA1oDWtGABwAF8G3WSwNumsWXOCrkuT6t/7ufC4BjHd67fvyeRjHl9yZB91SyUsFK6plnjjp2t3ule8BoHrk8YWBa9Q6evkz4bTfLdcZY+XMpapkrm/ENJwvmXUwvc3Zj2W6LuM01Gy7TP78uB3BhmDYcg/wBLJM4Pst3W0PZloXtstlBbm6jtt1t80EOKR7HQzPftwXue4uw4Pw4DAxnATIPoGpv9go6h9PVXq3wTRnDo5KpjXNPuCchX/p1sNvNf9Pp/oY5NR3ze7H/dnC+R9fy6cg7fdVyaooa6toBnayjcGvbJsZtcSSMDr69RwVutF2m40P7Lutq6pY6Ohr3MfSBzs7g17Wudjy5wP+1Mk4PqCL6FdaES01RHU00oIEkMgc12Dg4I46ghaSt0vp62UUtZXVP0SlhG6SaecMYwepceAo9+z7/sL0/8aj/yZVEv2jrJqeu07XXIXaOn0xb4IXuo2jL6iodMGc+wDmnknkdPNZKTWxi4p7nUKbSdirKWKppZn1FPMwSRyxzBzHtIyHAjggjnKx6OxaVuNXVUtDcY6uoo3BlTFDVNe+FxzgPA5aeDwfQrS0NHqW4dgWmqTSddDQXSW2UTRUS9I2d0zeRwecdOFCf2brfJaNX9odumqnVktJVQwPncMGVzX1ALiCT1Iz1KnvJeZHJHyO10lhoqEDut4DRjl3ksej1BpyrubrbSX23VFc0kOpo6uN8o+LQcqI9vt6rLH2PXOWhlfDNUvjpjIzgta53i59wCPmoVpnsE01ctBaVulPcqu03iRsVY+tifl8rnN3hjQThpBxggZ4OcrHLMjuD622xXBlBJW07KyUZZTulaJHDnkNzk9D9y1F0s+ntXzfRZK5lRLQudvjp6hpdGTwQ4DJHTHK5TqsFv7YmkgXFxFABk+fhnTsP/ANtnaZ/1sv8A5EiglaanSZNMaT09F3dXcG0QqM4+kVTWF+Bg4zjOM/isag0xomsrs0F0hqZ2kylkNYx+MdTgeS5j+1G1r75odr6N9e10tQDTMcWunG6DwAjkF3TI55Wd2RWy2Mv10qKfsyuOkZ4rfIG1VVWTzNkBLcsAkaBnz9eFjyoz7yaWMnUrRPpGgpY7fQXugeC47Wisjc5xJz5HlZdzo7HBWUUlwroqWUOcIGyztZvJwDgHr1HT1XyFpbQ1rvnYvqnUs7po7lZ5o+4c1+GFp25a4fM++cKR6kutVetEdjlXWyuln+kVEJe85LgyeJjcn4NCyTwYH1LNUWmgqoaWor6enqJyBFFLM1r5MnA2gnJ544S6XOzWOATXa50luiccB9VO2JpPxcQuH9tv+37s5/6in/8AKatZPbKHtE/aO1QzVffVVrsFLI+KkbIWgtj2jGQQQMuc7gjnzwmSD6Ht9XbbvSCqttbBXU7jgS08rZGH5tyFkmmjPXP3rhX7P9z0S3VN5t2kpb+DUwmqfBXiMQxsa8ABu0l24d4BknkdV3tAWPokXofvRX0QBcn1d2cay/0jHWGidQ01LPPF3c1JcXPdCPCGktAa4YIa04wOQTnnC6wiA4jbewm40XZfqazS3almvuopYpJZg1zYI9kgfgYGT9rnA6jgYV6h7Dq2m13pC/SV1GYrJQwU9Uxodullia4Nc3jGM7euOi7QiA4czsNvbex+6aRNzoPpdbd/3iybx921m1g2nw5z4T5LK1j2G1V60tpKnslXQ228afibE6oDXNa/ABJBaM57wFwz/U4+a7OiAxrcKwWymFwMJrRG0TmEnYX48RbnnGfVc77Mey6s0TqDUtwuVRRVjbvUCaERtJdGA57udwH9Y6ei6aiA5/2udmLe0qxUkVPWNobnb5DLTTuaS3kDc045AOGnI6bVDqXsf17qTU1muOvtV0dXT2WRstPHRMy9xBaeSWMHJa3JOTwu4ogOWUXZHMe1bVeobpPSVNo1BQyUZpm7u8Ad3fJ4x9g9D1wtJp/sX1NZuzPVGjZbxQVFLdC19G/Mn8FwcN24behDW9PMe67ciAinZlpOq0P2dWzT1bPDUVFH3u6SHOx2+V7xjIB6OC97TNKVWt+zu56eop4aeorO62yTZ2DbKx5zgE9GlSpEBqdK2mWwaOs1nnkZLNb6KGle9mdrnMYGkjPlkKJ9nXZ5X6N1frG71dXTTw3+sFRCyLdujAfK7Dsgc/xB09CuhIgNFrTSlJrbR9fYK1xZFVsw2RvWN4Ic1w+BAOPPouMR9hev7lSWrTt+1fRy6Xtc3eQsg3d9gZwOWDkAkDLjtzwvoREBzW79mdwr+3Gx61grKZlBbaYQOgcXd64hsgyOMfbHn5FQ13Yx2iWvWt/vmmdW0Frbd6uWdwAcXbHSOe0OywjI3eS74iA4trHsl1tqq0aQkfqOhN9sLppJqyUOxJI6Rjo3NAZ5Bg6hSDSem+1GkvD36q1fb7rbXwSMMENO1jt5GGnIjacD4rpKID5qoP2c9dUtlqLE3V9BTWitkbJUwwiQ94R0JG0Z6DjOFPNYdh1JeuzOy6atNcKWssZLqWqmB8Zdy/djkbnYPHTAXWUQHE9O9kGsa/tFtuqtf6horm+0taKaKlDjuLclufAwDDjuPBJPVZesuyTUju0V+ttBX2mtVzqGBtTFVA9287dpPDXAggN8Jb1Gc5XYUQHLuzPstu+mNV3PVup74y6X25RGGTuG4ia0uaTyQMnwNAwAAB0Pl1FEQBERAf/Z",
        "target": 2000000
    },
    {
        "balance": 370000,
        "id": "STU-027",
        "name": "MUHAMMAD ALNUR PASHA",
        "nisn": "0159615200",
        "password": "password123",
        "phone": "081234567027",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 220000,
        "id": "STU-028",
        "name": "MUHAMMAD AMALUL ARIFIN",
        "nisn": "0086723136",
        "password": "password123",
        "phone": "081234567028",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 15000,
        "id": "STU-029",
        "name": "MUHAMMAD RAFA OKTAFIAN",
        "nisn": "0098972007",
        "password": "password123",
        "phone": "081234567029",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAYBAgMEBwUI/8QARRAAAQMDAwEGAwUEBQwDAQAAAQACAwQFEQYSITEHEyJBUWFxgZEUMkKhsQgVUsEjM2KC0RYXJCU3Q1N0tOHw8VSSorL/xAAcAQEAAgMBAQEAAAAAAAAAAAAAAwQBAgUGBwj/xAAzEQACAgECBAMGBQQDAAAAAAAAAQIDEQQhBRIxQRMyUQYiYXGhsYGRwdHwFEJS4RVT8f/aAAwDAQACEQMRAD8AhCIi8gfoYIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiKOXvU7aVxp6Etkm6Ok6hvw9SpaqpWy5Yoo63XUaGrxb3hfV/I9qsuNLQR76mZsfoPM/AKP1OtGAkU1KXjyc92PyC8KGkqrpU7pXSSSO83cn2XsU+mcxPfI1wLMEjHI5Gf1XWr0VUPPuz53rPanWXyxpvcj+b+v6GsdY3EniKnH90/wCKvp9ZVjHf09PFI3+zlp/mvTj0nE/DnSBjR1zxnjqtSp022GRzC1zgAcEA5PufRT+BQ9uU5S4zxKL5vGf8+B7Ntv8AQ3IhjHmOX/hv4J+HqvTXNKqgkp3Z2lvmAvXtOq5qYtgrgZo+m/8AEPj6qlfoGveq/I9Xwv2rjNqrXLD/AMl0/Fdvn9iaIsdPURVULZYZGyRu6OCyLltY2Z7qMlJKUXlMIiLBsEREAREQBERAEREAREQBERAEREAREQBEWtcasUNumqCcFjTj4+X5rMYuTSRHbZGqDsn0Sy/wPC1NfXU5NBSuxI4f0jweW+w9149p0/W3EiSKEuYD1K29LWR99vG6bL2Z3PPqu1W2009JEI442sa3yC7y5dNHkj1Pjus1NvFb3fY8LsvRfzqctpLJcqWUBrXAngBrCflnClcFlqW0I+2Ne17Wl25riXn5Dj6qfw07I/uMAKvNN3pII69VHK5sijpku5AKWgD6Zpczd3bdw3Dz9OvOFrVFsqZmSSMi2vk58Rxj6dBj3XTGW6BjeI2j5LE+kYMjYOevCwrWZ8BHKZdLOrY91QSH424GNo9PX9FE71pGtoYjOyAmEdSOSF3aSijByG4A8sLTraGOSItLQWu6jyW8dQ0yOWki0cEst4mtFTtdl1O8+Nn8x7roEcjJY2yRuDmPGWkeYUe1rpltsk+1U/ETz0x0KxaOr3OZLQvIwwb2Dz68qLWUxnDxofiem9meJ2UXf0FzzF+X4P0+T+/zJQiIuOfSAiIgCIiAIiIAiIgCIiAIiIAiIgCIiALwNXTbbfDD/wASTPyH/sL31G9WDc6kGf4jj6K3o1m6JwPaKxw4ba13wvzaRKOzylZDQd5jxvcuhQHAPllQTRGGWOJ+CNxJypxTO3NwCMlXbnmbPnGnWK0b0bwPP4LYhkLj02j0KUtI+Q9FvCi2t5bghRkraMDpMZGM/ALC+UA+q320T+AfqrJaEEkYTBjKPJllB6jC1pQMHzC9KqpRGzLi1vxdheTVSsiHL2j5pgzlEY1NQtrrXPARnLcj2K5RY2uptTQs5+85p+hXYqsiUFueHcZC5PNA6k1gxvm2cNP1/wC6t171yj8CCL8PV1WLtJfdExREXAPtAREQBERAEREAREQBERAEREAREQBERAFH9TsLvsmOrnFn1wpExjpHhjRklauoLVURttxewFj6qPxNOR5q3pMq1SSPO+0U6noZ0zklJ4aXyaPZoYqmlp6W30EAe8MAL3HDWe591J6DTVbMQX1z2y+Zb0WC3BtLGZngYPmkGq6qqu7bdaYWF54M0ztsbfcn/DlXeaTex86lGKW7PYl0xVU/jhuM7X9ctccfQrfoq2ppsMqpu8aPX1UDodbX26amFpdNSMP2h0Lj3cg2gFw3EkbccevmPfEohkqKl745xGJovvFjg5rh/ED5jgreyM11I6ZQl0ZLI7lG+PIGPitKtrSciOUNz5jqFpQU+6m3mpaOOhXnhpc2WVzmlkQy4j0UCyyw0in+TcV0qTNUSPm9N3IC1q7QdHE7vGPcBjoDj9FpXu63e02ZtzjfAwOk2dwCZXsbtJDnBvrgD2zytOLUl+ksH71Jini798Qi2lkjmt/GGu5wfTqPdWVGxRyU3KpywaldbquzVEXdSST0rnbSHnJZ6EH0UO1FTFurKGfbxMWnp5g/+l0Onusd8pAQzDnDxMPkopqikLLhbHAFxbUbMD1KxGT3T64ZZhGKnBt7ZX3Koss1NLT/ANYzCxLiNNPDPsVdsLY89byvgERFgkCIiAIiIAiIgCIiAIiIAiIgCIiAz0bO8qO7zy9j2j3JaQApRc6GGWyNawNaInwSNHtuaVEQS1wc0kEcgjyUnhrW1Nodxjlvy8XI/wDPVXdNL+08Z7S6Ztxv7Yx92j0oKfv6ZkeBg9V7NvsIiYXMgZKD1a4BalpDe7bkZz+Sk9NVNiZ4Tz5KZM8jJdzzZaOqAxHS00AHntzhebUuMOYzITngu6KRSzumzu6KM3DvH1RjiYXtJw4j9FJnYjS3LoMGA7Qceq16WZ8NQ4tIx0cPIqSUtpd9lIx5dQozW0lTDXudCzcG/e9D7LVEjPZp/tU3MbYZm9Q14wf8FSsoJZY3k0AiJ6loC2LaGyUrHxOOR9R7Fegat4aWSYLVtkjx6ELhtbKKoLw3aT1HqvAvVOJbxQho+7VMccDy5ypvdXBzSBj4qJybHXunDuQHE/MMJWIvfJs0sYMF8p44Q+Vox3sLDjPGd3B+gKj69W9VRkeyEOzgBx+mB/M/NeUqF8szPpHA6XVpE3/c2wiIoDthERAEREAREQBERAEREAREQBERAFu0TpW0srg13dB7CXDoDkcfT9FpLeorrLRU09OGMkimHLXeR9QpapKM02c3ilFmo0sqqkm36kzt8mGNAOMjOF71GQ/AOSorbpQ6Fjh/CCpJRShrNx6q8fMcdmenWRuZbpTEPGBwo9JfKey20f6LJVVHQRswHE/FxAXvurmMgJLgOF4kz4q9+WQteR+IjHzW/wAyNZ3wblLqgRwtbU5gle3PduHP5dfkvOqNRNirTDU2+obFMMCoy0AfLOfyW6OI2END9v8AC4EhalXEJZxL4JXAdAclZSQyzYswkbdpHRk9xJ9Mr161jGgkHkBeZb7pE1xid4HgdCtqrqWOYC0g591qZ6s8KvmcwnnoVGHGWa/RtiaXEteT7DGP5lSC5HLnEYUYF2ntlxqHwNY572BmXjO3z4TnUI8zLOn0tmrtVVS3PPrS41025u0h5G309lgV0kjpZHSPcXOccknzKtXLby8n1aqHJCMPRIIiLBIEREAREQBERAEREAREQBERAEREAREQEosEwmpWtPWPwn+SlNOfCBlc/sdWaa4sbnwSnaf5Kbwv2j5roVvnjk+acY039LqpLtLdfj/szzRSO37z3nBw1v6LyWz11QdjacxMadoaTjJ98L22vbjeTz0wrHMLpO8jGXdeFPGSXU42NzXit9zwAY28jHXC0qymuNK6NpjDsnrkjHvle06vr9oHdNIHmXLBUS1FWQ6UFuOnKlyl2MvD2R51KyprZCainMRj4EgIOVutD2RbXdQeqvik7gEE59Qteeo3DB+Khbz0EVjdmlXOG1xJ4HOVCZpDLO95/EVIL9WhlP3DDzJ1+Cjip6iXSJ7b2c0rjCWpl32Xy7/X7BERVT1oREQBERAEREAREQBERAEREAREQBEV8MMtRKI4Y3yvd0axpJPyCGG0llliKXWrsy1Lc9rn0goYTzvqTt//AD978lJ6Hsko4Hf6wuEtS49GwtEbR8Sck/krUNJbPojianj2g020rE36Lf7bfUgttoW01lku07Qe8mbS04J/ET4nfJufr7KRUdQySMA8SNHPv7qSa00W1uiaVtqp3OFqmFQ2Npy4jkOPvw4lQxgdLTtliOHgZDl1FT4MYx/mT51reIS4jqJ3dk9l6Lt/PU9rdl2Mr1KGSMSNzz6lRaKtkbl204H3gXdPgt6lrWluckH36KOVT6orRuT2ZLX1FK3hoB+XC0q2WDHgAA9QF5H21uQC4FYJ60RsJ3ZHVaqMnsb80Y7l8rwJvAc+q0auoijblzhnoADySvNqLrJx3bfvdB5uKxsheR30/LyPXIaPQKVVqG7Ina5vETzbnTVGxldIP6KZ7mNx5FuMj8wvPXUa/RVZW6FoqeAMZVCU1Dmynb1B8Px6Lntzsdys0gZX0ckGejiMtd8HDgrnamicJc2NmfR+AcRqv00aXJc8dsd8Lpt8jQREVM9KEREAREQBERAEREAREQBEUi03oe8ameH08IgpM4dUzeFg+Hm75fktowlN4issgv1FWng7LpKKXdkdUi09oW/akc11JRmOndz9om8EePY9T8srrGnOzqw2BrJ5Yv3nWD/eTtGwH+yzp8zkqZM75wAwAPboF1KeHN72P8Dw/EPa+KzDRxz8X+i/f8iA2Psds9I5slynkuMoHLP6uPPwHJ+vyU0t9nt9nHdUFDBSs8+7YAT8T5r0Wnu4yfTosLtxIaPvFdSumFflWDw+q4jqtY832N/Dt+XQt2uneWg+EdVqyRA1MjQOcDHwXp7RFDgLUcwmuBH/AAzn8lKUS+njGHsIBA456LnurNH/ALtkfX26n20rjuliZz3Z/iA9PX0XRqdoD3+yzucNhyAR55WHFSXK+hvCbrlzRPn2qo3cSxkjPmPNaLp5Is58XsV0y9WShrb7UwWSqpZKqINNVRB4BjLs4I9CcdP/AAxe86emtrm/aoe639DkFpPpkcZVGUJ1t90dOM67Un0ZEXVp3ECKTJ+izMqJ5QGMiDf7R5W++2FuTsPr0Uis+i7lWUsVUyOGOCQbmvleBkev/gWIzctooShGO8mRejtTzIHEOllfhreMk+w/wXRtMaF+zGOvuzAZRh0dORkMPkXe/t5L2tNWi026okayeKquEQAkORmPPTA8gfXzUik5PHzViurfmn1Klt+3LDoaFRTh9PjGSStFtGyopTDWQsmjeSwte3Id8QV7JY0g5I+BVTCJWOaBgg5HxVllZSa3Rzy7dk1nq3GWjkmoSeMM8bAfgefzUGvXZnqC0sdNFALhTj/eU3iIHu3qPzXeYz43RvGN4/NXsDtu5oI/i5wFTs0dVnbHyPQ6P2k1+lwnLnXpLf69fqfKrmuY8tc0tcDgg8EKi+iNSaPsupGl9XSGOoAwKmHDXfP+L5rleoOzG8WcOmox+8qYDO6IYeB7t6/TK5V2hsr3juvqe74d7S6TV4jY+SXo+n4P98ELRVc0scWuBa4cEEdFRUD0wREQyEREAW1brZW3etZSUFO+onf0a0dB6k+Q9ystms1bfrlHRUMRfI48nHhYPUnyC+gdJaOoNMUIgp2755AHTzuHif7ew9lb02mle89jz3GeN18Mhyrex9F+r+H3I1pPsroLc1tTeAyvquvdkf0TPl+I/Hj2U8jpe9GWtDWDgDyA9Fslo2YHBdwszcNZgdBwF366oVLlgj5RrNdfrZ+JfLL+i+S7GsyDYcvwT5LO0cZ8kcQXAefVZAOFKUjDKTgBI2HO53U/kFkI3P8AYKoHBQFj+Tj0WBzdtRv4+7jkrZ24BPmtaRrnOLi3joAOqAqZGtccYyfRYKh81Qx0VO/Y53Hefw/D3WT7G+QEPdsaeoaeT81tNhaIgxoxt6YWUDk9R2a0lhubr9Sxytronul7wPO1xPV3s7r19VdcbvcKqkdDPO+aNwwWuOcrqFVGZqZ8UjchwwVzKto30FbJTvB2g+AnzCs1YfVblezK3TPF70vaWvacHgjK9Rt4rXQMjNTII2ABrc4AA6LWkha3Ls8lerpu2fvK6R7m5hh8bvQnyC3cYQWcGqnObw2X2fs9ilvLdRzTVVHccfehmLC8Hyf6jgcdFMWS1TH7XsJGM7mf4L1hC2OPxco2IDJI5PX/AAVWTy8llbLB5zal0jcb9xI6dD9FsU0hEhz0Pl0wth9LG4hxYMhZGMDjkjotTJq1LAXtkBIweoV7Y/xSctz5Dz91ndCHscz2WKJ5aQD0cMH4hAXyta5oHUFaL4CwlpHHVpXohm6T2akkYcCEBD9Q6ItOo4TJUQhlSek0YDXj4nz+a41qfR1x0zOTK3v6QnDZ2jj4H0K+iiwtcWrFW2+nulrmpqiJsjXZBa4ZB9lVv0sLuuz9T0HC+Pajh8lHPND0f6en2PllFKtb6Ok0zWtmg3PoJydjjyYz/Cf5eqiq87bXKqThI+t6TVVaypXUvKYREUZaPoTQWk26Z07GyaJouNWO8nd5geTM+gH55UyjbgE+ZWF/FU0+xWy0Y4XrK4KuKiux8C1Oos1VsrrXlyeTCwZI9lePuD4o0cn4o37uPQrcrloia2Z0gHidjPPosmcBPNOpQFAMBXKqtcUBX4qmAqBVyUBdjKuAACtbwrsoChblRHWduaaQVTR4o+ePP2UvyovreQx2pjc/fkaPzUlb95Ec/Kc+eXFhcQ3A91PtFUjIbPFLxvmzI728sfkoOWh0eMDnqpxo4OktsUZOI4y758qe7yohp6skxG92fwjp7+6va1Mcq8BVSyY3jjCq1uAqkZcFcgLGfecsU8X4m8HqssZ5cquQyWxgFgIVHoBsJx0KqeUBjIDhyOVhhOAR7rOBysDBid7fQrAPJvVpprpS1FFVxCSGUZLT+o9wvnrUNklsF7qKCTLmsOY3kY3tPQr6ZqGAvaehHC552oadbWaebcI2Dv6I5cfMxuOMfI4/NU9ZR4teV1R6n2a4m9HqVTJ+5Pb5Ps/0/wDDiuEWfuj6IvO4PrXMj6rf99r/ACBwsjDjw+bVjLchwVc4LX+vB+K9cfnwyBW/jI9VcrDnv2EdOcoDJ5qo6KnmrvPCAp+isHicr3fwj5qoAaMBANvCDAQlYpamnpxmeeOIYz43Bv6oEZeVVeXNqay07HPfc6choye7fvP0bkr0opWTwMmiduZI0OaR5g9EBeobruYF1LB8XKYqAaynEl72DpGwN/mpqVmRFa8RI9HnxKc6NeDbmNA+65wP1UIZ91THRT80sjPMSn9Apr/KQ0+YlwCqnkiqFop5qp6FEPRAYWSMaTucB8SqmWM/jb9VBNYOe29twHY7pvPl1K8Fsx38nA9Sqk9Ryyawd/T8H8aqNnP1Xp/s6zvafxD6qoIPQrlff4JIfz8VItHVTpLnPGXuLRFnBOR1C2hepPGDTUcJdNbs5s4+BMViDMVD3eoBWXqrXHEgHqFYOIYZG73ELXq6WKtppqaZgfFMwsc0+YIW2Rgkq0Ny5DKbW6OVf5p3f/J/JF1jYEUfg0/4I7H/ADnEP+1/QuIVNuQWnoUaHN46hXkZHCkOMWszjB6hG/1h+CEc7h80by9yAv8ANeVqeuqbbpu4VlI4NnghL2OLd2MdeD7L1hwtO6W9l2tVVQSvdGypjMbnNxkA+mVlYzuYfTY8C118lfcauifd6svpuNxETBIeeBhnpg/P2XkPqqqv8UTauRu0nInlIedrjtwHADnbke+FI2WJrZS43Cslf5uDmxf/AMNBPzW0yzUjotksck7PMTTPkH0Jwtlhbsxv2ItcGMiFJJT0LmF7GPla9veFuT4xl+Rkc8efCxRwzfbu7dPStpWuyJDLFG52HPI4Zt4ILB/d5HrMmWS1xBoZbqRjsdRC3j8luRU8EJ/ooY4/drQFnKwYw8nPGSXFhHfSyVDHbtzIGyTZy3bjwAjPhHnjxFdAtjXxWmjjkYWSNhY1zfQho4WxnPRXYDfitJPODZLBTp1XMdRSia/Vbs9H7R8uF017tkbnu8hlclqXmeollccl7i4/Mqzp11ZBe+iKMxtUm0RJ/plTFn0cPzUZiGAvb0jL3Wodv8bCP0Uly9xkVT946EqqirlUi4EPRUJVrnDIGUMlGBniDtuc9Dyr+5icMGOM/wB0LCQ0T5IB3BX7W+QCZG5U0tIetPCT7sCxmlp4jvigijceCWNAOFfjA6J1TYzzS9SjRgYVH9Wn0VyxTO5DfVYMFQNxJ8lRv3iVf0YrWjDUBbuRU2lEBmx5qqow7gqoArGNw5yvVOhQFfJYZXnIjb94/ksxOAsDR4nPPU8IDLG1rWgBXOIzgDJWIH0V2eoHVAVyB15JTaT16KgGOT1V4PHKGCodtQHPJVqBZBq3mpFPZ6l+fwEBcvxnJU71dMW2osB+8VBWHwq5QvdKtz3LmcHotuySGHUdM/oC7H5FarfVZaV2y40zh17wKWazFojg8SR1IHIQAkrHSu307HHzCz+fC5xeKbVX0+CFBjKwBhULRlXea8T/ACvsZftNc1h/tsc0fUhYbS6myTfQ9gjhNvutSG82yoOIrhSvPoJW5/VbbZGvGWuDh7HKJp9A011BaR5rUkJFQMnK2yV58j91YG5+SyYNxxy0D1TywqdXewVwCAYRVRAYwdjseRWXOVrQu/A/n0K2AMeaAqrXdFcqEICh5CscMLIrHDLkBaweayDgK3gJkoC7KeeVQcqqArjKHhBx0VHOwFkwRLWEudjM9CFFQNvVSHVTt1Qwnzcfy/8AajrjnOFepXulO1+8XM6ZWal5roPaRv6rCOAs9Fl1ZDgc7wVJLys0j5kdLpARSsWbosNE7dRRn1aFld0XMOgVBJCuwrG9FkQGOZ/dQPkJ+60u+gXGJJHStIeGucfMrrl8l7mwV8mcbYHn/wDJXJKWFtVVxxOe1gc7GTn+QJ/JRW9ET0JNvPQ3KSy97C2WrmjpWv5YCC5zh64A6e5VtZZpqOJ1XSVAqY2DLjCS17Pcg8qY2mDe+tqXwxuAf9nbGcOMeBwOfbA+SuucHdy0E8dOxkZPdP29ZAeoIxzwCouR4yzoeJTz+Hj9umf484+HYgkV+ubGgRXWr2noDK5dJszJe5iM8jpJmsG5zjkl2OVzaG3hupm0jsBgqOc4+6Dn9F1Wmhbu7xvhJ8x0Kkrjhso3YzhG60YCuVgcRweqru9lMVi5FTciAxMHmVmBysTWuJ5WUcLIKqjuiqqHoVgAqxxwVcDlY5DgICuQeiLWbI7vR6ZWznlAXBVVu4Aqp46oCqtd0J9lTfkpJkMPllAQXVEma6Jnowu+p/7LxCOF6mpHB18eAfuNa38s/wA15ZHA910q9oooT8zK5yFu2eMSXemYem4n8itMD1W7aN37zjc3q3J/JJ+ViHmR0SkBjp2t9llPJwsVPKJKdjvZZfNc0vlRwr1jHJyr+hQHkaqfs0vXn1j2/UgfzXL6AtbXwOdgjeM5XSNbzd3paduf6xzGj/7A/wAlzWluFrpKKomnq2faw7ZHGzL3tGOTtGR5gZI9eijsWWkTVvEWejNeaqhvMVbHh+/BdESSHOA5yPPr9VvWu41N7uzaqoLY2NJexg5azjktHrnC0qK7WmRkk1QG1Rc8bS1/QeZwPPk9emFWG9UFLeCKV8ELSDiMyZONvPPHOenr7qum5NP1fQ6k4xgpLHSOE8bPbHX7GbStBFXVlTUvZmJpLI8+5z+mPquh0cToIAwkvaPXqovpS3fZqWNzXktlGXtP4X+f5Y+imDeAAraRyJMuHqCq5PplUHCqsmhTP9lFciA2fs0fv9V591u9ksMTJLvdaK2secNdVVDIg4+xcRleqvmvts0ze6XtWbqqu05LqrTppmxina54bA0Nw5pLOW+Il4OMeL2QwfQYuFqdbBchcKY0JAP2kTN7rBOAd+cdfdWx3Ozz0ElbFc6SSjiOHztnaY2HjguzgdR9V810NTpmT9mLWMGnKq6kMmp5KijuD2OMD3SxjLC1oBa7b16+HoPOE2a+3Gk7Obl2exQuNbfq6imp2AHxskaHdfciH6lAfY7btY3UDq1t2ojSNf3bpxUs7sO/hLs4zyOFWrr7NSU8M9XcqWnhnGYpJahrWyDGctJOD18l8n29jov2T75G7hzdRtafiI4lh0RdqXtJ7UtMWzVshbbKKmZR0lK3PdvdGwBrXc8byMk+Zw3p0GT6/gpaSeJk8MnexyAOY9jgWuB6EEdQvOffdNMkdE+/W9sjTtLTVxgg+mM9V7jWtYwNaA1rRgAcABfBt1ksDbprFlzgq5Lk+rf+7nwuAYx3eu378nkYx5fRDB9ySxUUFM6qmqGsp2t3ulfIAwD1J6YWnbL5py+SuhtV8t9xkjHiZS1bJXN+IaThfNGphe5uzHst0XcZpqNl2mf35cDuDDMGw5B/hZJnB9l7dbQ9mWhe2y2UFubqO23W3zQQ4pHsdDM9+3Be57i7Dg/DgMDGcBAd+qL1p6iqX09TeaCCaM4fHLVMa5p9wTkLYNVa3UBuBrqc0bRkz983ux5fezhfJOv5dOQdvuq5NUUNdW0AztZRuDXtk2M2uJJGB19eo4K9rRdpuND+y7rauqWOjoa9zH0gc7O4Ne1rnY8ucD+6hk+im6bsd5/1hBUGpjmJIlhmDmHHBwRx1GFhrdLadtlFLWV1SaSlhGZJp5wxjB6lx4Cj/wCz7/sL0/8AGo/6mVRL9o6yanrtO11yF2jp9MW+CF7qNoy+oqHTBnPsA5p5J5HTzW/iS9SPki+x1Cm0jYqykiqaWZ9RTzMEkcscwcx7SMhwI4II5yrbRa9My3Krittwhq6qjPd1MUVS2R0BOeHtHLTwevoVH6Gj1LcOwLTVJpOuhoLpLbKJoqJekbO6ZvI4POOnChP7N1vktGr+0O3TVTqyWkqoYHzuGDK5r6gFxBJ6kZ6lHOT2bMqEVvg7rHRQxMDW5wPUrzaa/wCm665ut1LfbdUVzch1NFVxulHxaDlRHt9vVZY+x65y0Mr4Zql8dMZGcFrXO8XPuAR81CtM9gmmrloLSt0p7lV2m8SNirH1sT8vlc5u8MaCcNIOMEDPBzlaGx299ZbYbhHQPrqdlZINzKd0zRI4c8hucnofoq01bba2pmp6Wup6ieA4ljila50ZzjDgDkcjzXEtVgt/bE0kC4uIoAMnz8M6dh/+2ztM/wCdl/6iRAdd1JDYZKSKmvVxhomPdvZ3tQ2IuI643dcZ/RR61aR0LLM6K3XKCrl2l7mx1ccjsevHOBlc1/aja1980O19G+va6WoBpmOLXTjdB4ARyC7pkc8re7IrZbGX66VFP2ZXHSM8VvkDaqqrJ5myAluWASNAz5+vCPczkm/+THZ1W1LALpQzSufkNbWxkvPpgdf+63J9D6OtM1OKmoZRvkdiJstQxneEEdAep5HT1C+XNLaGtd87F9U6lndNHcrPNH3DmvwwtO3LXD5n3zhSPUl1qr1ojscq62V0s/2iohL3nJcGTxMbk/BoWAfTkcFjsksVFJXQwTVBHdxTTtD5CTgbQeTzxwti6XGy2OBs12udJbonHAfVVDYmk/FxC4h22/7fuzn/AJin/wCqavMntlD2iftHaoZqvvqq12ClkfFSNkLQWx7RjIIIGXOdwRz54WQfQ9vqrZd6MVVtrYK6mdwJaeVsjD825C2fs0fv9Vwr9n+56Jbqm827SUt/BqYTVPgrxGIY2NeAA3aS7cO8AyTyOq72hgxfZ2e/1RZUQBcn1d2cay/zjHWGidQ01LPPF3c1JcXPdCPCGktAa4YIa04wOQTnnC6wiA4jbewm40XZfqazS3almvuopYpJZg1zYI9kgfgYGT+LnA6jgYWah7Dq2m13pC/SV1GYrJQwU9Uxodullia4Nc3jGM7euOi7QiA4czsNvbex+6aRNzoPtdbd/wB4sm8fdtZtYNp8Oc+E+S2tY9htVetLaSp7JV0NtvGn4mxOqA1zWvwASQWjOe8BcM/xOPmuzogNa3CsFsphcDCa0RtE5hJ2F+PEW55xn1XO+zHsurNE6g1LcLlUUVY271AmhEbSXRgOe7ncB/GOnoumogOf9rnZi3tKsVJFT1jaG52+Qy007mkt5A3NOOQDhpyOm1Q6l7H9e6k1NZrjr7VdHV09lkbLTx0TMvcQWnkljByWtyTk8LuKIDllF2RzHtW1XqG6T0lTaNQUMlGaZu7vAHd3yeMfgPQ9cLxNP9i+prN2Z6o0bLeKCopboWvo35k/oXBw3bht6ENb08x7rtyICKdmWk6rQ/Z1bNPVs8NRUUfe7pIc7Hb5XvGMgHo4KvaZpSq1v2d3PT1FPDT1FZ3W2SbOwbZWPOcAno0qVIgPJ0raZbBo6zWeeRks1vooaV72Z2ucxgaSM+WQon2ddnlfo3V+sbvV1dNPDf6wVELIt26MB8rsOyBz/SDp6FdCRAeFrTSlJrbR9fYK1xZFVsw2RvWN4Ic1w+BAOPPouMR9hev7lSWrTt+1fRy6Xtc3eQsg3d9gZwOWDkAkDLjtzwvoREBzW79mdwr+3Gx61grKZlBbaYQOgcXd64hsgyOMfjHn5FQ13Yx2iWvWt/vmmdW0Frbd6uWdwAcXbHSOe0OywjI3eS74iA4trHsl1tqq0aQkfqOhN9sLppJqyUOxJI6Rjo3NAZ5Bg6hSDSem+1GkvD36q1fb7rbXwSMMENO1jt5GGnIjacD4rpKID5qoP2c9dUtlqLE3V9BTWitkbJUwwiQ94R0JG0Z6DjOFPNYdh1JeuzOy6atNcKWssZLqWqmB8Zdy/djkbnYPHTAXWUQHE9O9kGsa/tFtuqtf6horm+0taKaKlDjuLclufAwDDjuPBJPVbesuyTUju0V+ttBX2mtVzqGBtTFVA9287dpPDXAggN8Jb1Gc5XYUQHLuzPstu+mNV3PVup74y6X25RGGTuG4ia0uaTyQMnwNAwAAB0Pl1FEQBERAf//Z",
        "target": 2000000
    },
    {
        "balance": 0,
        "id": "STU-030",
        "name": "MUHAMMAD RIVIANSYAH",
        "nisn": "0098916344",
        "password": "password123",
        "phone": "081234567030",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 370000,
        "id": "STU-031",
        "name": "NIRWAN AKBAR",
        "nisn": "0085877685",
        "password": "password123",
        "phone": "081234567031",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 120000,
        "id": "STU-032",
        "name": "OLIFIAH YULIANTI",
        "nisn": "0094378426",
        "password": "password123",
        "phone": "081234567032",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 285000,
        "id": "STU-033",
        "name": "PUTRA HAIRUL LATIF",
        "nisn": "0087295743",
        "password": "password123",
        "phone": "081234567033",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAYBAgQFBwMI/8QARRAAAQMDAgMFBAgDBQYHAAAAAQACAwQFEQYhEjFBBxMiUWEycYGRCBQjQlKhscEVYtEkMzeC4RdDcnS08BY0U2OywuL/xAAcAQEAAgMBAQEAAAAAAAAAAAAAAQQCAwUGBwj/xAA0EQACAQMCAggGAgEFAQAAAAAAAQIDBBEhMQUSBhMiMkFRgaFhcZHB0eGx8BUUFiNCUlP/2gAMAwEAAhEDEQA/AIOiIvHn6HCIiAIiIAiIgCIiAIiIAiKhIBwSBlCG0tyqIiEhERAEREAREQBERAEREAREQBERAEREAREQBERAEREARF51E7KanfNIcMYMlSk28IxnOMIuUnhI9Fg1l3paLLXPD5PwN3Px8lHa28VEznF0pawnwsYcAD181o56gv26LsUuHLeoz55f9L5NuFnHHxf2X5JHVau8BbDCGHzLsla7/wAQ1BcXmocHH+UEH4LSZJd5o7nsujChTgsRR5C54ndXUuerNt/3yJC3UtYG+GZufIsGFSo1DUzMDQ50bgMZb1Pmo9kjqqh5HVT1MM5wYPiF048jqPHlklds1HJGSKtxkaeWAM5W5hvtvm275zHdA5p3UFhLnDGzvTO69Q4sPhJ88FV6lnSqPLR07TpFfWsVCMspeev7OiRyslYHxva9p6gq5QCjuM9uqG1EJyPvMJ2cFKrXfY7nJwCF0RI2JOQT1C5dxZSpax1R7nhPSSje4p1uzPbGuH8vL1NqiIqB6sIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCiuorg2etFLG4lkOeLB24v9P6rc36uNBZ5pGuLZHeBhHmf9Mn4KACRxO7ue5zzXW4fQy+tfgeD6W8TdOCsoby1fy8F6/3czJQ3h54/dYThvnl6LKiY0NL3nPQBWcBcTgb812j5sY7OEO3Vm+SrnA8aBm2UBb6qnVXAcwgYXbdUAaXNOQsnjfgcW4/NWQMBcAW5z+ayCWNbwc878kIPMvDoxtnfC9KGrkpapr2PcwBwJx1XlwnBLd/MI10XD4jh3XKhpNYZnCcoSUovDR0Wkqo6ylZPHycOXkeoXsonpOtbHUSUjnZEviZ7xzHxH6KWLzFzS6mo4+B9t4Pf/5C0jWfe2fzX539QiIq51giIgCIiAIiIAiIgCIiAIiIAiIgIlrOpd31PTAjhA7w+/kP3Ubid9qHc8ea3mrqadtzE794ntDWHHLHMfv8VpGEcPLfnlemtElRjg+K8fnOfEarn5418lt+T3a4EOG5wOXqrhJwyYJO432WKJCH8TVUTuByDg4xnqFaOGZLoBJzOHHlgK/6uCOHHiPILyg3eXEnlzW5tlCJo3yuY7DemM5WLeDJRbNEYyH8GN17MgHE3HJ2d1kVcGKh5BB3x71kSURdAzuyXncNx+qZJ5TXSs4CGg4cN1aQQA/HiPyKzrhaailhgmm/38YkafRa90jg0NO/UKU8mLTWjLHykYHLCsyx+M7FWvzx7qnlupIMuhnbSV0E5cSI5A44G5Gd/wAl0pcrG2F1Jjg9jXDk4Z3XG4mtYv5n0boXUbjWpvZcr+uc/wAIuREXIPoAREQBERAEREAREQBERAEREAREQGJcqJlwoJYHgEkZaSOR6Fc3OWnGMYXU1zy4UpF3mhAw7vi1o9Cdl2eGzeJQZ866ZW0U6VeK1eU/t9y+yWGrvlTwQMPAPaf0at9D2Z3mWd0ThG0dJM5C6Ppqyw2e0wU7G8vE4nmSRuVJKWWGKZrZCCXdFtldSb7J5aFlBRXPuc2s3ZPXlpbWSxkZ24OvzW2pOym4SxuhqLiYI+InhaMgjK6jT3C208fE6eNgzjLiAs+Cut9WR3MzJCfwkFYddPxNnUUtkc0puyaip8cTpKl785e9Z0/Z7Ttijp424jaRu0YI9V0pjYm7eSscYRkucAPVR1sn4mSowXgcmv2ifr9C2mILTF/duA3afd5KISdlxx9pUuDvNoGPTZdwrrjbGngFRHxHbGQtBcKui5RnLj1UqpUWiIdKlJ5kjj83Z1HTxkuq3vePQAFQmrpjTVT4SMAOPNd5q42v4iMYXItXW80d/eG+zIOMZVmhVcniRTu6EYRUoIxbHY3XNz3vcY4WDHFjmVO1ptLsc2zAkYDnkj1HL9luVyL2rKdRxeyPqPRuxp21lGpFdqaTfvj+QiIqR6QIiIAiIgCIiAIiIAiIgCIiAIiIDY2S0uu9cYeItYxvG4gb4yotfbE+3dosdM/xxySRvY4jGRt/QqcaNqO5vMjOItMsTg31I3/Yq3XMXf6osUhbhzHkPcPgR+hXTsmo5fzPnnSmVSdWNJvsrDS9iTw05MTCBtjde0FDStLnPm7oH2iXYWXbi36sAQDkbBUqdLQ3HDpW8jnB3HyURepw5rJoLjTaIhqHPqb3T/WA0BzJJmux8Oi2dEyipI2uosFg6sPxWTctD2y6VFPV1tDFPUwYDJC3gJA5A45j3hbOaljikfUzkyzOZwYwMenIDkt82mtytTi09kZVJVPlp+PqfJa26Vjj9lhxJOyy6ScwQcIC1zZWi5GSVvE05GfIrQmW5R0I/VWCzVlUyO5XAQyuy4M7wB2wyfkN1mwW60Pg4bbdoqvh2OHNduNsHC2F00xb7xY2W6ui+s0zX9612AHh3U5GOfxWBVaTpnUtLSUdLFTQUee67kFrhnmS7mcqzlcu5SUXz91YMWaiDQ4DBXNe0ukaw0koADsluV2CnoRTsMcpLnY5lc07T6Z0tPTtY3Lu/wAAeeQVFCX/ACIyuY5pNGsssLorFSEtIa5nECRzySs1SK80cVHYaeJjGsMMgi4QMYAaVHVy6/fb8z6lweq6lnDKxhY+mgREWk6wREQBERAEREAREQBERAEREAREQGRQVRoq+GpAz3bgceY6qY32lNZTw1MADwwxyuON+HlkfAqDKX6bvNN/CpLfUvbHJwlrHPOA4HkM/FWbefK8M8x0hspVqarQWXHf5fpklsvia0nkFKoXR92ATg9AoZZZj3PPkBuCpVSytlaDzxzVnGGeK3Rl92XDnlaq7Hu5GR/eO63UZxEXZyRnCjlXUwwxyVFQXvlLjhrWFx+QBKzwa8npGx3ck8Gy1VUTG8uxgZwVv6W5wOomkNYcjO4Wphmo7hUTQ8Y4xtgg7+7zUJGbl4GzoY39wxw5ELZNHg8RGFi2Yl1DwOyQzYHzV9VKI43OByQOiYMd2a66MY1pcNsLnt8omXO50sMhwyOUSk5/DupnWVLnQucd8jkVoLfSRVtzqJJQHGJmG55ZPVTHR5Iks6M1+q3gUlO3GHSBrj8AR+4UWWzv9a6rubmncQ/Zg+ZHMrWLn1XmR9M4TQdC0jGW71+oREWo6gREQBERAEREAREQBERAEREAREQBERATXSk/eUIGfEw8J/79ymdPJ3bOWw8lzPS1c2luJhkOGzDAPkei6BTkOI8Zy3lur9N80T5txa3dvdyXg9V6/skMc7RDknHnkrSVzqeaoa8ZDwc8TThYklVKS50znFgO0bRnK1v8Qq3tL6SiIaduOQji+A6Lek3scdyWSTmnoJGtdKG8Q5jjxxe8dVr6uGOSsGXuEbTsxriB+S1UNyriwGSmL5BycWAkfFWSXqRgJrKeQMH+8Ddx8llyyDxHVkxpKiOGHgb7I8liVNU1xfg+hytFDXZh7yml4weh8llSzF7WvcS0cOT6rXh+JKkmYFwla1rw0YIGB5KGPvlZA6aKmkDGPJBIAyenNSC/VncUTnk+N2zVClorzceyj1XR+xhVUq9WOVss+4JJOSclERUj2wREQBERAEREAREQBERAEREAREQBERAEREBUEtIIOCNwV0azVr6ugieccXCC7Pnjmopo+yG/alp6Uxl8LMyzeXCOh95wPipFCXMe5zQGniOwGAN+WFftqbUXN7bHiOktxBzhQXeWvo/D2N1wmUnODkLwioTTSd7CSDnOMK6lnZNgcnDmFt4O6c3Dhlb+6zyi7SNaK6rEhHcgk9SFiVFudUvMkxJz0HJSU9yGHwtKwqt8QGQMKedjGdzUtha0DbIGysqZQzPuV8sjWZLjhq1lZMZGuwOFoGw6lZRj4swctcIiV3rnVta7f7NhIb/VYC2F5tpttXGA7jinibNG/wAwR/XI+C165VTm5nzbn1mxVJW8Op7uNAiItZcCIiAIiIAiIgCIiAIiIAiIgCIiAIpDZ9C6gvQa+ChdDCT/AHs/2bffvufgCp9Zux2gjIdda6Spdz4Ih3bR7zuT+StUrSrV2RxbzjljZ6VJ5fktX+vU5AtvSaUv1cR3FpqnB3ImMtHzOAvoa2absVkga2gtlPGW/fLA5597jufmsqoJMbhnmOWOS6NPha/7y+h5W46ZvOLel6t/Zfkg/ZlpCqsFJVVNwYI6qpLQIw4O4Wj1HUk/kFTVmnTQVzq+BmaWodlw/wDTef2P6qewx8MEWByABXvJBFVU74JmB8cgw5p6hdFW8I0+qWx4644hVuLl3NTd7+XyOLSU8kbg5uQ7mCFfFdJI9pGb+ak15sr7PVdy4F9LIfsZT0/lPr+q0rqQB+CAR+S5kk6b5ZF+LVRc0WeP8ajztkH1BXi+5Ne0hjCSVlPooM5MbVdHRsJ9hrR7lHMvInlk/E1BZNM7icCfL0WbarBUXyt+rwgtibvNLjZg/r5KR2fTc14cCGuhpAfFLjd3o3+vJTqnoaW2UbaelibFEzoOp8z5lWaNF1HzS2KlevGn2Y7nJ+0/TLIbRSVlHGGRULRCWAcmbAfI/quWL6cuMLJ6d/esD4gPED1UWruzeyXcOe2nFPL5w+Aj4cj8Ql3YOrLng8M9HwTpJCzoq3uE2ls15P4fM4Yi6HdOyG504c+gqoqkDfgk8DvgdwfyUKuVkuVnmMdfRywEfec3wn3OGxXGq21Wl34nu7TilpeaUKib8tn9HqYKIirnSCIiAIiIAiIgCIiALKt1srbtVimoKWSpmP3WDOPUnoPet7o7RdVqiqMji6C3xHEk2OZ/C3zP6LvFlsNBY6EQ0VJHTt8mjc+88yfUroW1lKt2paI8txnpFS4e+pprmn7L5/g5ZY+xuuqOGa71bKaPGTFD4n+7PIfmpzZdEWKwuY+noGyTs3E8p435899h8MKWEYYfcsYtLsBoySu1StaVLuo+d3nG729yqs8LyWi/fqW8PeODRsB8gsuOKNjM7Y6krx4O7DW9XHcq+dh2aD05K1g4x5ySBzuGPfywrZI+7h3OXHclZEMIjGepVJo+MKVuDyp5WiMZ8lkiVgAwQsYQNa0Atz65XmYn9+GF5axw24Rg596YyTlGn1TquwUE0Vor5O/q6r2aaNhe8D8bseyPUqIXCNlFLmnqxVxOPgLch7R/NkAfEKbX+000trkcYGmVjSWSY8WfUrnssLpWEBxHuSdtCrHtCF1Og+yVFU4ncH8lINM01vr6traypHeE+CnIIDveevuCiTYns2L3bdfNZlJHM+eOOLiMriOHh5581rVjTjqZviFWWn8HY2cLGBjMANGABsAF4uHeP8Rw0c1p7VV1zIGQXMtFSPZkbyeOmfJ3ots2V3suy09DnYrLGDAx6wAxthG/FzwvR0LhiSP2hzHmvFzi6ryehws5nRZMgxjlze8Y3jB9pn/fVectJSV8LmuiY9rhhzXDn6ELKewxSGVo2PtBJKZkv2kZ4HHqFBKeNiB3zsos1wBfSNdb5cHDohlnxb/TC5xfeze/WVpmbAK6mGSZacF2Pe3mF37vJqc/at4m/iavZojl8cZbnr6qnVs6NXdYfwPQ2PSO+s8Lm54+T199z5PRfROpuz2yanY5xiFBX8xNG0bn1H3v1XDtSaYuOlrkaSviwDvHK3dkg8wf26Li3FlOh2t0fROFcetuJdhdmfk/s/H+fgadERUT0AREQBbTTliqNR36nt0AI7x2ZHgZ4GdXfJatd17ONJO05aPrlWwCvrWhxBbgxM6N9/U/LorVrQdepjw8Ticb4nHh1s5rvvSPz8/QlVut1JbKaKio4WxUtK3DWgcz5nzPXK2wb4R7lhtbwUxPVxWa05iafRepSSWEfFpylNuUnls85to8Dm7ZUADSGt5qpOZCejAqQblzz8FJiej4wQ30OV5j7SUnoNlWSQ+w05J8lcxvCMIQVxuqkZRVUAt4BhUdGCMfEe9eidFILXMbPC5jhvjBC51qG0m3VpkaPs5Dy8iujkEEOHMc/UKPax4HWh5IBDgB8crbTlh4MKiysnPJ3bY2Un0fb+FjrhIN3/Zxe7qf2Ubkpw6ncAGgkc8KdaVx/CKQv3LW8GPLBIWdR4RrpLU3X1UTNAeBwjoeqo2Itl4Q4lmMcJ3x7ll8wqBo4sqvk3niKZg4SOi9WjDgFeQrR7SAuK8+F0J4mjLDzHkr3cirmnLUBQcL25acgrGfT4PHEeF3l5rIMZY7iZt5jzR3RwQkxu+Bw2TLXDkVhX6x0Wp7PLb69uQ7dsgHijd0cFtMNdLwkDBGVQxBm4Hh6hMJ6MzhUlTkpweGtj5l1Lpi4aXuTqWuZlpJ7uVvsyDzH9Fp19Nam09TamsU1HUt8WPC8c2OHJwXzhdLZU2e5TUNWzgmhdg+R8iPQrzl7adQ+aHdfsfXOAcbXEqbp1dKkd/ivP8AJiIiLnHpyXdm2nDqDVkTpWB1JRYnm4uRwfC34n8gV31x43gjruov2daeGndGxvljDayt+2lOPEAfZafcOnmSpZAzMTT8V6axo9VTTe7PjfSLiH+uvJcr7MNF936v2wJm/wBnwPu816Rv/soPkrC4d86M/fGQrIs8HdnoVePOlz8tg9XL1Y3hgA815VHttasg8gEBRrQxucYRu4VH9B5q7GFBAwgCqmEATohQIC5o2UN1nUnijpW+zxF5+WMfqpm1c+1ZL3l6LR9xo/NbaSyzCo8RNIwAtUu004/wuLfk53/yKiTBhqkulZA6kljz7Mv6gLbV2NVJ6kxbuwKuN1RmzQrlVLBQ8laArzyVuEAdyVrTgrxqq2mpnBk08cbjuA52MhebrrbiP/OwZH84UcyXibFSm1lRf0M8HKo4eFYTbnRFu1XDn/jCyIqqCo2jmY888NcCiaexDpzjug/wuY/yOF7HcLymGYT6bq6J3FG0+YWRgeUJw57Sue9q+jm1tkfeqdgFTRjL9t3R9R8OfzXRA3Di73/qvOtYystc8L945o3RuB6gjCxqU1Ui4S2ZdsrudnXhXp7p+3ivU+UEU9/2UXf8TPmi89/jLn/z7o+t/wC4uG//AF9mdwqnYbgdAsinw2Jo9FjVAyw+qvZIcDB6ZwvRnxgvmjxUwyDo4j5hUZiN0jncgvbiD2Z+K8njLmt6OcCfcN03BZwl0zQeayT5novKMZmc4+5VkPE7gHLqgDfG/i6dF6KgGBgKqggqiIgKHkipzKrjJQF42aSuaageZL7VeQfw/LZdKO0Lj6LldZL39dNL+N5P5rfRW7NNV6JHm0bLbaXk4LjPFnZzQ75H/Vapo2WVZZDHf4gD/eAtPyz+y21FmLNdN4kjpTfZCqrITxQNPorwqZaCYQqoKAiGsaKsnr4H09NLKwRYLmNLsHPoo79QuDTl1FUho/8AaP8ARdTErGHhc7B5q8SN/GD8VVnbqUubJ2rfi86FNU+RPByp1PUD2qaYEecZ/otzpQSi94fG5o7o7lpHkp8JW9HBecr8N4icpC35XnJNbizrU3TcN/j+jzIy0hY9O7DQ38JwsoYcMjksOLatlZ6hwVs4pkjGMeqw6d3FbnjOQ17m59xIXvWSmnpnubu/HhHqsWjiMFnbGTkjmfVT4A9OBF6Iscgtl9kKgbkFoODzaVdIPAPenCQcjcKQY7a0wvLZWgALIp5GzDvGHibyaVZUwR1ERD25yFShaKegiiiAAY3Cl4xlAyXHg955KrG4G/MqjG75JyT1V4UEFUCIFAHVVVFQnogA2yVeOasPkrxsFDBZVu7ugnfywwlco5ldNvkvdWKqd/IR+S5m0cyrVFdnJXqvVF7AvW2nF+pj04wPnsvJvNXwHu6+nkBxiRv6rZLus1x3R0ylP9nb6BeoXjSHMAXsqRcK81QKjXAjy9+yHzQFsh8bFe9pPIqx+7gvQHwoDwLXK3xNO4OFkHYKxhzupB5Ry90/DvZKqQ3+JNc05D2foVWoLI4nPcOSx2NIdx9eHhHoShJfUHvS533RsFcdqNo8yk4EdNjyCukHDDE33KWC7CJlFgC2TeIqkbstyrnDMZC8YD0WQK1U4gp3PPQLHtMxqLfFKdi7OR8UrWmoPdjkOarbY+5hdH+FylrQGf0VQdlZnJV45LEgrlFRVQBB5qnMo7ZqAN3dlegXkz2VeCgNXql/Dp2f1wPzC561TjWMvDZ2s/HIB+/7KDuOBtzVqksRKtV9ouaqtwZWf8QVrThqqxw42kkAcQyStj2MFudMoj/ZgsjosW3nNG0+ayxzVEunoVbwNJ5KpKZQksfCCRu4H0Kp3bmjZ+feF6dVQlSDxfx4xhvzVsZdjHCfmr3ndUj9pAY9af7PgjqNkpxxcOfuj80uD8cDcZ3yVfBhsWTt1KnwBbVnidHH1kePkF6T+00eSx6YmprTOfZaMMHkF7ybyI/IFcoqZ9EWILuaxh4JfisgFecjckOCkgBgAJCxY3llc9n4m5WWAR1WurX/AFerjm6A4PuKyWpJsWuXq0+ELHDg4AhZA5BYkFyomUCgFQqPKqrHndAXM5K/GFbHyV55ICK61lxDTR/zE/l/qoh0JUl1pJmsp2eQJ/RRvorlPuoqVO8yucBYN5qXUNhraluOKGB7xnlkDKzgMrU6qDDpK6B5LWGneHEDcDG6zMFudasExntEEjnMcXNB4mcjnqFshzC0+mg1tkpmsOWNYA0+Ywtw3mqC2L73LlznWGs7vZtVyUtFPGIGRs+zfGHDiIyTnn1HVdGXB9YV313WNylB2bMYx/l8P/1WM+7k20lmRIm9qF7YfHR0Ug/4XNP6lZLO1yRmBUWZuf5KjH6tWusVpZS0kE88DZ6ysdwwRSbNG+OI/H9ypDVWu4xQzvqoKGqghaC9gYBkH8JDRy/7yqym3tk6TtYLCm0m/wC6f1Gud2uMLjizu286j/8AKn9rq3V1rpat8fdunibIWA54cjOM9VwS/W+O33iaGAnuHtbNFnYhrhkBd7tX2dqpARjhgZkf5Qt0G28NlGtBQ0RbWODnA+qslkJhEQPP2j+y8q2Th4Bn1VsB75waOSs/ErGyo2cEGeWUd7eV6AcMeAvM81gCvwRURQQZ/wBSi/m+awLrcrFYYmSXe7UdtY84a6rqWRBx9C4jK26+a+2zTN7pe1Zuqq7TkuqtOmmbGKdrnhsDQ3Dmks3b4iXg4x4vRY5B9ACrtDrYLkLhTGhIyKkTt7rBOAeLOOfqsYusFbb5a1tzppKOM8Mk7KhpjYdti7OBzHzXzrQ1OmZPoxaxg05VXUhk1PJUUdwexxge6WMZYWtALXcPPn4eQ6wmzX240nZzcuz2KFxrb9XUU1OwA+NkjQ7n6kQ/Mplg+woq7T4t7q1l2o3UjH926f6ywxh34S7OM7jb1XvU3CzUVPDPVXKlp4ZxmKSWdrWyDGfCScHY9F8nW9jovon3yN2zm6ja0+8RxLx0RdqXtJ7UtMWzVshbbKKmZR0lK3PdvdGwBrXb7cZGSepw3lyjJJ9hQxU1RCyaGQSxSNDmPY4FrgeRBHMLWOv+m45TE++25sjTwlpq4wQfLGea3bWtYwNaA1rRgAbABfBt1ksDbprFlzgq5Lk+rf8Aw58LgGMd3ruPjydxjHT5Jkg+6JfqcFK6pmnZHTtbxmV7wGgeeeWFrrZe9N32d8VqvlvuMse7mUtWyVzfeGk4XzTqYXubsx7LdF3GaajZdpn9+XA8QYZg2HIP4WSZwfRbutoezLQvbZbKC3N1Hbbrb5oIcUj2Ohme/hwXue4uw4Pw4DAxnATIO/T3vT9FUPp6m9UEEzDh8clUxrmn1BOQsn65bDbzX/X6f6mBk1HfN7sf5s4XyRr+XTkHb7quTVFDXVtAM8LKNwa9snAzhcSSMDn58xsVutF2m40P0XdbV1Sx0dDXuY+kDnZ4g17Wudjpvgf5UySfR8tjs2oWx10dR9ZicCGSQTBzDg4OCMg75HwWJW6W07bKGWrr6k0lLCOKSaecMYweZcdgo/8AR9/wL0/76j/qZVEvpHWTU9dp2uuQu0dPpi3wQvdRtGX1FQ6YM39AHNO5O45dVnzy8zDlTOo02k7FWUkVTSzPqKeZgkjljmDmPaRkOBGxBG+QtbJpTSGpIblaIbi2qfEO5q4qera6SEnIw4DJadjz8itdQ0epbh2BaapNJ10NBdJbZRNFRLyjZ3TOMjY745bKE/Rut8lo1f2h26aqdWS0lVDA+dwwZXNfUAuIJPMjPMp1kvMckfI7fQ2ilt1JHTwcYjjaGjidnYBYdLqDTlbdHW6kvtuqK5uQ6miq43Sg+rQcqI9vt6rLH2PXOWhlfDNUvjpjIzYta53i39QCPioVpnsE01ctBaVulPcqu03iRsVY+tifl8rnN4wxoJw0g4wQM7HOVgZHb5Ky2xXCOgkradlZIOJlO6VokcN9w3OTyPyUTZoLR10uVWIK01FUyRzp44qprnMcXHPEBuN881z/AFWC36YmkgXFxFABk9fDOnYf/jZ2mf8AOy/9RIj13JTa2Oq1Fq0xZKqKe4VdNSvc0tjFTMyIHGMkDYZGRuPNXU7dMXZ0lNT3SkrnlpcWR1LJC0dXADlj5ZOVxr6UbWvvmh2vo317XS1ANMxxa6ccUHgBG4LuWRvus7sitlsZfrpUU/ZlcdIzxW+QNqqqsnmbICW5YBI0DPXz2ULTYyc5Npt7E4qdOaAu9RC03unllDRE1rLixxdjltk7+5S+oltNrEENXXQUplHBE2aZrC/GBhueZ3HLzXxxpbQ1rvnYvqnUs7po7lZ5o+4c1+GFp4ctcPifXOFI9SXWqvWiOxyrrZXSz/WKiEveclwZPExuT7mhFpsQ5OW7Pp6vjssVZDT1lfDT1ExAiifO1j35OBwg7nfbZUrZrDpuATXO5UtuiccB9XUNiaT5ZcQuL9tv+P3Zz/zFP/1TVrJ7ZQ9on0jtUM1X31Va7BSyPipGyFoLY+EYyCCBlznbEb9cLLLMT6Gt9TbLvRiqttbBW0zthLTzNkYfi3IWR9Ti/m+a4Z9H+56Jbqm827SUt/BqYTVPgrxGIY2NeAA3hJdxDvAMk7jmu9pkGP8AUov5vmiyETIC5Pq7s41l/tGOsNE6hpqWeeLu5qS4ue6EeENJaA1wwQ1pxgbgnO+F1hFAOI23sJuNF2X6ms0t2pZr7qKWKSWYNc2CPgkD8DAyfvb4HMbDC9qHsOrabXekL9JXUZislDBT1TGh3FLLE1wa5u2MZ4eeOS7QiA4czsNvbex+6aRNzoPrdbd/4iybx921nCwcJ8Oc+E9Flax7Daq9aW0lT2SrobbeNPxNidUBrmtfgAkgtGc94C4Z/E49V2dEBjW4VgtlMLgYTWiNonMJPAX48RbnfGfNc77Mey6s0TqDUtwuVRRVjbvUCaERtJdGA57t+ID8Y5eS6aiA5/2udmLe0qxUkVPWNobnb5DLTTuaS3cDiacbgHDTkcuFQ6l7H9e6k1NZrjr7VdHV09lkbLTx0TMvcQWncljBuWtyTk7LuKIDllF2RzHtW1XqG6T0lTaNQUMlGaZvF3gDu73O2PuHkeeFpNP9i+prN2Z6o0bLeKCopboWvo35k+xcHDi4hw8iGt5dR6rtyICKdmWk6rQ/Z1bNPVs8NRUUfe8UkOeB3HK94xkA8nBV7TNKVWt+zu56eop4aeorO64ZJs8A4ZWPOcAnk0qVIgNTpW0y2DR1ms88jJZrfRQ0r3szwucxgaSM9MhRPs67PK/Rur9Y3erq6aeG/wBYKiFkXFxRgPldh2QN/tBy8iuhIgNFrTSlJrbR9fYK1xZFVsw2RvON4Ic1w9xAOOvJcYj7C9f3KktWnb9q+jl0va5u8hZBxd9gZwN2DcAkDLjw52X0IiA5rd+zO4V/bjY9awVlMygttMIHQOLu9cQ2QZG2Pvjr0KhruxjtEtetb/fNM6toLW271cs7gA4u4HSOe0OywjI4ui74iA4trHsl1tqq0aQkfqOhN9sLppJqyUOxJI6Rjo3NAZ0DBzCkGk9N9qNJeHv1Vq+33W2vgkYYIadrHcZGGnIjacD3rpKID5qoPo566pbLUWJur6CmtFbI2SphhEh7wjkSOEZ5DbOFPNYdh1JeuzOy6atNcKWssZLqWqmB8Zdu/ixuOJ2DtywF1lEBxPTvZBrGv7RbbqrX+oaK5vtLWimipQ48Rbktz4GAYceI7Ek81l6y7JNSO7RX620Ffaa1XOoYG1MVUD3bzw8JOzXAggN8JbzGc5XYUQHLuzPstu+mNV3PVup74y6X25RGGTuG4ia0uaTuQMnwNAwAAByPTqKIgCIiA//Z",
        "target": 2000000
    },
    {
        "balance": 275000,
        "id": "STU-034",
        "name": "ROMDANI",
        "nisn": "0075181099",
        "password": "password123",
        "phone": "081234567034",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAYBAgMEBwUI/8QAQhAAAQMDAgMGAwQHBgYDAAAAAQACAwQFEQYhEjFBBxMiUWFxMoGRFKGxwQgVI0JSYtEWFyQzN5JDU3J0tOFEgvH/xAAcAQEAAQUBAQAAAAAAAAAAAAAABAECAwUGBwj/xAAzEQACAQMCAwcDAwQDAQAAAAAAAQIDBBEhMQUSQQYTIlFhccEygaGRseEVUtHwFCNC8f/aAAwDAQACEQMRAD8Ag6Ii48+hwiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCLVr7hDboRJMefJo5lRWv1PVT+GEiJn8o3Kl0bSpWWVsaHiPHbXh8uSesvJfJMwQeRVskscMZkke1jBzLjgLnArZhN3jXkPznPX681kqrlVVzWtnmLw3llS/6a8/VoaB9socj/AOrxdNdPuSSv1XBG4MogJj1c4ENCwQamqnDdsbiTzLdh7KNCL1B+a9KjliiZwAcTyepCnRtKMVjGTlq/aHiFapz944+i0X++57UWpZgyR8tM1zW8iw4/FbVFqagqxwyP+zyZxh/L6/1UZqZWNiIacdCAcrzXENOxKtnY0ZLRYM9t2o4hQa5pc68mvlYZ02OWOZnFFI2Rvm05CvXN6CumoKgTQP4XDmDycPIqc2m6x3Sm42jgkbs9nkf6LVXFnKj4lqjueD9oaPEX3Ulyz8vP2/wb6IihHTBERAEREAREQBERAEREAREQBERAEREAVr3tjjc95w1oyT5BXLwdT1wZRmljd43bvx0Hks1Ck6s1FGu4lfRsLaVeXTb1fQjt3uT7jWOlye7BwxvkF5pJz5rKGHgyRjPJVhpn1EgYxhc49AunjFQWFseJVa0683Um8t6mDJ54VWuaDy3+imtp0PXVbI5DE0NPNruakX910VQBxMLDjctKxOvBdS5W9SSzg5pA6EnikEbW+Q5q4TUzXcJjDwOg6/NTus7JJWNcaedxIOwcF49Z2ZXanjMkfDI0eQIKuVaD6lroVF0Iy9jpnhjWBozt4shXtp4oYHmRx73oBhXyUNRROdFUxPie07OHT3WCXi4Md6zHoFlTyYGmtzUe7xHhz7lbNBcJ7fUNmhdgjmDycPVYxEG5fu5o642ysL3ZKSipLDL6dSdKanB4aOlW+uiuNGyeMjceJufhPktpQXTd3bbqoxzHEM2AT/Ceh9lOgQRkHIK5q6odzPC26HsvA+JriNspSfjWj/z9wiIopvQiIgCIiAIiIAiIgCIiAIiIAiIgMdRM2np5Jn/CxpcVB6yZ08sj5HAuflx29fyUm1NI+OxS8A+ItDj5DKg8TiZAHHIPNbzh0EoOfmeZdsLmUriFv0is/d//AAyzB3lspdoijYZiZY8POC0+aj1NG+51LIoInHbG2+66vpizNit0TZGgOAHTdSbiooxwcpaUnKeSWWihDYgGN2UijomtaMjdatqgxG0NAGOfRe7FBxM5LU7m7ehpGijLcYVhtcRYRw5BXrtgGMYVxi3wPwV2C3KIHe9FUtzjcHQtJIxuOfzXItTdnNwtznS0kJniHMDdzf6r6WfCC1ePW07HuIIB+SzQrSpmCpQhV3Pk6rbVQNEcsMkbW7YcCAtAhfTF703b7jE6KopmSNd6YXDdYaSk09cHGLL6Vxy09R6FbCjXVTTqaqvbOlqtURoELpdrcH2mlIdxDum7n2XNMZXQ9PwmGw0zXHJLeL6nKicSXgT9TrOxsmrqpHGnL8o9JERaM9PCIiAIiIAiIgCIiAIiIAiIgCIiA16+mFZQTU5A/aMIGeh6H64XN+EibGN/JdQUVorax+vxA8AsMhkxjntxYW14fV5VKL9zgO19pzulXj58r/dfJKNA6dkghNTPGWuk5B3l7LpdHScLR0IWlSMbGwE7DCtqNTU1EeFoLuHmXYaPqVSTlVlk5yCjRjgltvbwOyc7r24ieHkoNb9fWISNjlrGNJ682/UbKZ0F1oa6JslNPHK09WkFW8ko7jvYz2NweZ5o53CVcXsG4KslngjbxvcAFUGOWUcJyF5rwHuJ5Kyt1TZKY8MtdA0+XECV4lTrK0mp7mKbjed8NB/FOST1KKrBaZN6taOJcz7SaRz7Y9/dl2D8XouhfrGCsbxRPDs9PJePfYY6ihljkaHMe0ggqtOThJMVYqpBo+bwwudhoyScLpdHD9noYIf+WxrfoFCbPSOl1E2Njctik4z6AFTxXcSnlxgdJ2Ntmo1bh9cJfbV/AREWpO/CIiAIiIAiIgCIiAIiIAiIgCIiAyQRd/O2PiDc83HkB1KwXiySWjU9oucbhNTTOERkb5nOM/VehaWtfcGsc3PGx7R7lpx96m16t8FfpzceIPbKwjb4XAj8FOtcLXz0OI7TVajlGivp0f3yy2jh+0ANJwFs1VFZ3QOhrQwscPFny9VWyQd7EclVrdMwVdS2aZj5O7PE0O8Qz545LLF4Zys45RGnWvs+Mjm0tbTtmacOAkOAfI9B817Vrp4bVI37KGtaTzZycvOq+z+yVWojdZjUiR0gkfC1mI3keYx1Ujq44Gd7JgAzfC0N4eE+gys1RprRtkelFp6xS9j3Yap80YIzyXm3aZ74yxxw1b1oczuS1x9lo3F0RrmNlB4D5KMmS3HOhEpdK26tqe9qC2Ik5znBz5r17dpeyUDSYTHI53MuPESsF809TXW2yU080tPMZWyxzxMIdFjkGnK1LToWkoqB0MNdUzTveH9+XESDAAAB8vRSs4j9RD5PFpHQkD7dDGe8hYOLqQo9qesFJZqmTOCyNx+gUop7ZVU1MBJUOlwMZcBn7lEtTUX2+I0byQyV7WPP8uRn7srFF5lqSJLEdDnmhdMV9dS1NxbFhr8BjnnHEOuPuXqOaWuLXDBBwR5LpTrXRtsEUEHhjjw1rW7BuBkfgoHfI2xX+uY3YNmd+Kj3T55c/mdj2ZrSjTdq9o6/nU0ERFCOxCIiAIiIAiIgCIiAIiIAiIgCIiAvhlfBOyaM4fG4OB9QuiuqGS2FhjPEMbY/hPJc3Uj01eYoGvoqsgMc0iJ55NJ6LPRnyvDOd47ZSuKSqU1lx/YmtiiLMbc1JzDxMyAo1Y5Q9rd87KWQ8LowDspS3ODex5k8MjsiNg9z0Xlz0TWPc+V2Xc8lSeVzYmbAKNVXeVlY7hBMY8OVc9ikdzLamB0cjznfkFjmgZM8B2+F6dFSltKQG4wtWemc1znBvqrMGTKKx0ckGD/mx4+YW5FgkAMwq0kwkgYehC3oowTnCuLNEa07B3RGAFEKuGMXhnGGlmHZz7FTKtIbGfRRGWOKruhMgy2EcXoD6/ei0ZR6ikdEbS6WZ2GF4dn+Vu5K5nW1Bq6+epPOWRz/AKnKkOpb8yRr7fRScUXJ7xyI/hHoouolaSbwjvOBWU6MHWqLDlsvT+QiIsB0YREQBERAEREAREQBERAEREAREQBERAT/AEzWl1LASegBU6pqhpjBzuuU6ZqgGuhJwWnI9ip1S1Du5G6nx1imeW39F0LmdN+f4ex69TUCQOHHtyXi1LrlDAY6LugXOyXvbxbeWMjdVkqCQRxYGVjZcKaLwmUyP8m7rLHJBbRt09xrqWLupYJHPPIsGWn+itiqbz9oPGyn7k8w7IcPn/6Vjb3C/wAJD2EegKxuvcYcXdzxD/q3wruX0Ka+Z6UA7imEfecTySSR5rcpa7LS0ncbFRg32hlqGQtmDJnco3HDj7ea3myOMmRlY5Jlyl0N+71/BATnfC5XfrhUOr5ImzPbGQOJoOAT6qa3WfDXZdsFzeqmNRVySn9523ssVZ8scHRdnqHe3EqklpFfl/6zCiIoR3oREQBERAEREAREQBERAEREAREQBERAEREBno6l1JVMmb0O48wugW6tbNC17HZY8ZC5yAXODQMk7AKdQWz9RmOie4mYRtfMM5DXnfA9hgKZbJvPkcf2lp0koVM+N6e6/j5PWq7bDc6J8MpcWOHJri3PzC8mktUVNI2CXvWMzgODydvqvYppCGjB38ludw2obkDxFSlJx0Zx0cZyjENN0Tmgirkb6h+61qyy2ykLRHxVMh58W4W6aKcEAOcB7K9lvc0hzidjvnmVd3hfzeRp0FspYS6c07BIds45LNNI2IHGy2pCI+ewC8Svqc8Rb05rHrJ6lj0I/qa6YYadjvG/n6BRVZJ5XTVD5Hklzjk5WNa+pPneT1Dh1lGyoKmt3q/cIiLGbEIiIAiIgCIiAIiIAiIgCIiAIiIAiLPSUVVXziCjppaiU8mRMLj9AqpN6ItlJRWZPCMCKcWnsn1FXlr6qNlBEd8yHid/tH5kKZ27sostAxr6vva6Uc+N3C36D88qZTsa0+mPc5+77R2Ftpz8z8o6/nb8kN7NNK/ri6i51Lf8LSPHCCNnycwPYbH6L19R0slNqyvEmCXv42kdWkDC6hbLdT0jGQUtPHBG3fhjaGj7l4GvLH3hhuUTOX7OUgf7T+S2ytVToOK33/37Hnd7xaXELzvZaR2S8l/LIKyTuy3y816dPUFoBBWi+mcG8layGQsywlpCg4T3LtVsSFtcCOeSFSWuY5uAdwvAa2d2SajhPlwrK2GYjxPJTlRXmfkZqqpMh4Qea0XxF5bG0Zc5wAHmStlkBzkjK9zS1kfcbsKmRpFPSEOJ6Od0H5//AKr4R5moxMc5ckXKRzbX1odaNYVbO7DIpz30eOWDz+/Kja7zr7RI1PFBJFO2CqgyGucMtcD0PlyXIbvo6+2Vx+12+Ux8+9iHGz6jl81gvLWcJucVozv+BcZoXNtClOaVRLDT0zjy89DxERFrjqAiIgCIiAIiIAiIgCIiAIi97Tej7pqeb/CxiKnacPqJdmD28z6BXRhKbxFZZhrV6dvB1KskkurPBUk07oHUGpTHJSUboqV//wAmfwR48x1PyBXV9OdnFksfBM+Ntwqwc97OzLQfRvL8Spq0ykY4yMdMYW2o8N61X9jheIdr0sws459X8L/P6HPbN2M2uh4JbrUPuEo3LG5jj9ttz9R7Kd262U1qpu4oKSno4eZbFGG5PmfMraYCDkuJRuZDk/CDsFtKdGFL6Fg4i74jdXjzXm36dP02K4e7GX/QLFM0OaT64CzSOIGBzKskAEQHqFmNeVo2fGfks1TTRVdNJTytDo5G8JCxQnu5S3kDyW1n0yhU5ZX0LqKrmpJm+OM49x0PzXnU7WiVzDt7qb68t4+xRXaJuH05DJTjmwnY/In7yoTKA52XDB8wtRXp93PTZm8t6newz1Nn7IwnOB8lbK1sQ4VijldjHGfmrwMyMYxjpZpDwsYNy4+QWAkGzQUUtdWRUkDcyyefJo6uPoF0qjt0FvoI6SBuGMHM83HqT6laOnrMLPRZkDXVkwBleNwP5R6D7+a9cMLjudltKFLu1l7mmua/eSwtkaFfH/hnEbgHdVEOYWyR++Ft1bOKDhHnyWCn/wApo6YwpREIZqPsvseoi+qpibbWPyS+No4HHzc3+mFzK+dl2pLNxSR0zbhTtGTJSniIHq3n9y+gQxokwc7nZZ2jGMbKJWtKVXVrX0OgsO0V7ZJQUuaK6PX9Hv8AB8ikEHB2KL6P1b2f2jVEbpXxCmrceGoiABP/AFD9757+q4bqXR910vUllZCXQE4ZUMGWO/ofQrTXFlOj4lqj0ThXaC24j4Ppn5P4fX9/Q8JERQTogiIgCIiAIilvZ/o/+1F2fJUZbQUmHSkfvnowe+N//avpwdSSjHdka6uadpRlXqvEUbWhdAS6hkZXVzXR0APhHIyn8h6rt1JQU9BC2np4mMiiHC1obgAeiy0FKyCAMYwMawAAAYDR5BZm4FQ5p6ldNb28aEcLc8a4rxatxKrzT0itl5fz6lY2YcCTny9FlePF7Kg3cr3KSaYxuOW4HVXtGAAOitwc7K/qgLHbvVC0OGD0OVcR4lR22PUgIBMDkOG2FsxniYCFhczJ36pNVQ0dPxyu4WjYDqT5BUKl1XTMraKammaHRzMLHA+RC5U63PgklopTmamdwF2McQ6H6L3bxqO8VcL5GMFvo+8MbQHftH+pPQbcgo1U18gkEkkji8NDQ488dArats60dOhlo3SoSeeokpjBGXukOfJTXRunTSwi51jM1Ug/Zhw/ym+nqVCG1fG5ry7LmnIJ6L2qPVVwoXCR9S6aFpy5j9wR+Sx0rGVN8zeTJWv1UXLFYOlAAK0uLXZ6LDbrjSXegjrKOZs0MgyHNP3LYP3rLnJGLXFrm5znqtSHPd46glbTxhh6Z2Wt8E5HR24VyKGRzeNvkeYPkUY4kcuWxHqrhyVh8Mmeh5oDJn0WnX0VPX0z4Z4mvY8Yc17ctI9VtuzjCHDWeyoVTaeUcU1l2WPpu8rbG0ub8TqU7n3Yevsd/fkuZEFpIIII2IPRfV8rAWBx+E8x5KA687OYL3G+uoGNhuLRk4GGzeh9fVau6sFPx0tH5HecF7TyptUL15XSXVe/mvXf44aivlikgmfDKwskjcWua4YII2IKsWiawekpprKCIiFSoBcQAMk7ABfRGj7E3TemaKjdGG1DsS1HmXu5j5DA+S5N2YWD9eazgdKwOpqIfaJM8iR8I/3Y+hXd5Tl5J38S3PDaOjqP2POe2F/mULOD21fwvn9D0GN4W589ysLxirYthhGA088LDKMVDFuTz4ubsVefhVMKp+FAUHNVHNUbzVw5IC0rHKcBp8nBZSsZHFsgL5pBGBtxOPIDqtR9MZv2k3icDkDoFt8A4ieZPVVx4SgIzqW2vqLVKIWgvjxK0eeOY+igpa2aLJGSV1mWLvIcj4mrm17pjb7xK0gNil/aMxy35/epNKWmCPVj1PKbHwnDhgr2LBQGvuoz/lxDJB6noPz+S8l0nEc8QOFPNMUP2aCLibiQ+N/ueiuqSwtC2nHLPWpqD9XMb9jAjAG7ByK9KCpZOMfC8c2nmFTCxyQB2/Jw5EKIyUbD3bAHqVgmaSA4cxuje8dwcbgS3O/msh3QFsbw5VfzBPLksbfBLjosrxlhVQB68wrZjiLHmrm+JoI6qyXd7QqAOaDFwnrssbR3sJzzzj5qvHxTvb0jH4hZY2BsQB91QHG+2HSzad8N+pYg0SHuqnH8X7rvyPyXK19UXi1U98s9Xb6podFUsLdx8J6O9wcH5L5judtmtdxqKKobiWB5jdjlkHC0fEaHLLvF1/c9T7KcS7+3dtN+KG3t/G3tg00TCLVHaHc+xuzNotJzXJzcS10hwf5GZA+/iUzIyxx9crLa6CK12SmoYM91TxBjc88AKkTcsI8wusoU+7pqB4NxC6d5dVK7/wDT09un4NwnLWvHMYKTDicx3krITxQAHyx9FVxy1qykIyoeSdFR3JVBQc1cOStHNVQoWuVWjCEKvIIB1V3RWhXBAYw8Ma8uOAN1znVM7a26x8GcRt2+q6JJgNfnkdlzG9O4b7UDo14aPoFmpLUxVdjRkZ42O4W+E5xjquk2qYSOcRyeA4fRc/wA0lTeyEhtP6xN/BX1uhbR6kgVR9yoDsqhRjOC3ByFQFXA748+StOQUBSRuRkcwrmnijyqdVT4c45FAViOC5vzCoRl6pycCr+qAsDAHyO6vI/BZHHDSgCodyqFSgGG4XH+1zTzY6+G7xNAbUDu5Bj95o2PzH4LsPRRnXluFw0hPtl0DhK38D9xKwXEO8pOJtuDXTtb2E09G8P2Z869w7yRe9+rz5Iuc7tnr3/LR9HYxEB/Ktdn7MNP7pC2hu0eyxRgPY6M9CurPCirBwlwH/UEO5GORRoLHAH6q13geW/MKhUztOyFWtKuQFFXmqdVVVKDkiIgCqERAa1RzIztzXLa2Xv7lPLzD5HEfVdNr391DLJ/Awn6BcqaSZVJorRkes9kbWPB8lNLE7ipaQ537sBQwDwKS6bnJp4gf+G4s/NVrLQpRerJk3kq5VrTloVeqikkO9OahmprtWUt8fFBUyxsDGnhadhkKZA74PNYZrRb61xlqaSKaTlxOG+PdY6sHOOE8E2yr06FTnqRysHPWX65F2Pts3+9Zv19chv9skI8shTY6Zs5G9BEPbIVDpSzHJ+yY9nn+qjdxUXU3H9Ts3vT/CPK0vdKmvqKiOomMoY0EZHLdSULTo7LQ2uV8lJEYzIADlxO3zW2pME0sSNLdVKdSq5UlhFeidVRC7p1VxFDuSw1ELKiikgeMskaWkehCyny6lVHIhVG2xzb+w1R/E1F0LhRYu4pf2m2/rF3/d+DIz4GrH8FV6OV8RywK2YYLX+RWY1Blc3IwsMwPdB4+Jn4LONwqY3PqqFTFGcgEcllWCJndlzPI7eyzjkgKdVVDzToqlCqKiqgCEoqFAeNqSUxWaqcDgmMt+u35rm3Fh4OAF0DWL+Cy8P8bwPz/JQEjLgplJeEi1X4jZactyvW03Nw1MkZ8w4LyYx4QFv2N2LsWj95pH5qtRZiy2m8SOiRnijBHkrs4WCifxU7fRbGMhQiYCA73Row48Wcn1VcKvRAVyehKAnzTZFTJUqSTzVCiKgKHPRU+HYblXFYjJucDJVQX8h6qo5K1oJOSrkBZt5IqZRAWxHwBZHDiYsUJ8CvYdyChQrGfAAeivVoGCVcEKljhh4d8lcEdyRp29kAKciqqhQBM7qzj4eacYVShkVOax8asdKQCgI3rmUClpovNxP3KG8PhBXu6rqDUVMe+wzj7l4udgp1P6UQ6n1MuYSByW9ZyG3mn9XEfUFaI5LbtZP63pSP+a38VWf0spH6kdAotmkLdZu4LTphwuK3WjdQSaXYC8y9ahtWnYoJbrWMpGVEncxuc0kOdgnGwONgefkvTK5r204NksbcHiNyGD5fsJcrHJ4TZfCPNJRJB/eXo3j4TqCjYc48ZLfxC2P7faR4S7+01qAHnVs/quRWuy2qenjrbrXwwQd9wGMEgjG54tuoBwNs52OdlpVc+k5bhUCGhfHTTsAhke05icHHO+ScYI3IPLksCraakt2urUcvHodhk7TdGRy92NRUUj+IMAjeX5JOABwgqVBfOtLp5tLrGzwxR8dFNWxcEnDluz2ktDtuLAI8WN19FLLCTluR6kFDGGWuOyx8W/JZCVZwglZEYi9vJCcNJQbBWv5AeaAswUWTHoioDabRxNGBxfVaF2uljsUbJbvdaO2secNdVVDIg4+hcRlesvmvts0ze6XtWbqqu05LqrTppmxina54bA0Nw5pLN2+Il4OMeL0QofQTa60m1i5C4UxoSAftInb3WCcA8ecc/VUiuVnmoJK6K50klJEcPnbO0xsO2xdnA5j6r5roanTMn6MWsYNOVV1IZNTyVFHcHscYHuljGWFrQC13Dz5+HkOsJs19uNJ2c3Ls9ihca2/V1FNTsAPjZI0O5+pEP1KA+yBd7G+gdXNu1EaRr+7dOKlndh38JdnGdxsrqm42ehghqKq5UlPDOMxSSzta2QYzlpJwefRfJtvY6L9E++Ru2c3UbWn3EcSw6Iu1L2k9qWmLZq2QttlFTMo6Slbnu3ujYA1rt9uMjJPU4by5Cp9hwtp6iFk0MglikaHMexwLXA8iCOYXmP1Bptkpiffbc2RruEtNXGCD5YzzXtNa1jA1oDWtGABsAF8G3WSwNumsWXOCrkuT6t/6ufC4BjHd67j48ncYx0+iFD7nmFHDSuqZp2R07W8bpXPAaB5k8sLz7XetN3yZ8NpvlvuMse7mUtWyVzfcNJwvmnUwvc3Zj2W6LuM01Gy7TP78uB4gwzBsOQf4WSZwfRe3W0PZloXtstlBbm6jtt1t80EOKR7HQzPfw4L3PcXYcH4cBgYzgJkHfKi76do6l9PU3qggmjOHRyVTGuafUE5CzultL7a6tNfB9iA3qBM3uwOXxcl8ma/l05B2+6rk1RQ11bQDPCyjcGvbJwM4XEkjA5+fMbFe1ou03Gh/Rd1tXVLHR0Ne5j6QOdniDXta52Om+B/9UyMH0S3TVivELKuCoNTC4ENkhmDmHfBwRsdwR8lgrdKactlDJV11SaSlhHFJNPOGMYPMuOwXg/o+/wChen/eo/8AJlUS/SOsmp67Ttdchdo6fTFvghe6jaMvqKh0wZv6AOadydxy6q9TkupbyRb2On02kLDWUkVTSyvqKeZgkjljmDmPaRkOBGxBG+Qsdss2l6m5TxW64xVdXb5AJ4oqlsjoXZOA9o3adjsccivCoaPUtw7AtNUmk66Gguktsomiol5Rs7pnGRsd8ctlCf0brfJaNX9odumqnVktJVQwPncMGVzX1ALiCTzIzzKc8n1HJHyO6tooWbjI9yvOpNQ6crLm63Ul9t1RXNyHU0VXG+UY82g5UQ7fb1WWPseuctDK+GapfHTGRmxa1zvFv6gEfNQrTPYJpq5aC0rdKe5VdpvEjYqx9bE/L5XObxhjQThpBxggZ2OcqwuO3yVltiuDKCSup2VkgyyndK0SOG+4bnJ5H6LyrpaNPavnipZa2Opltk/fGGCdpcx4Dm+MDJHMjBwuUarBb+mJpIFxcRQAZPXwzp2H/wCtnaZ/3sv/AJEiPUqm1qdLvemdHw1cM13mpaPjc57Y5ZmQtldtkkHHEeXtn1Xi23s/7PqmvH2G5R1ssYLzCytZKOHqS0dN1AP0o2tffNDtfRvr2ulqAaZji1044oPACNwXcsjfdb3ZFbLYy/XSop+zK46Rnit8gbVVVZPM2QEtywCRoGevnssbpQk8tGWNepBNRk1knlvseg4amhbS3ylkkpJhLTsFdE4h2SQB1x4uXoFMKusttvfCytrqeldOcRCaVrC87bNyd+Y5ea+M9LaGtd87F9U6lndNHcrPNH3DmvwwtPDlrh8z65wpHqS61V60R2OVdbK6Wf7RUQl7zkuDJ4mNyfZoV6SWxjbb3PqiprLXSVUNLVV9PBUTkCKKSZrXyZOBwgnJ322WO53KzWKAT3a50luiccB9VUNiaT7uIXEO23/X7s5/7in/APKavMntlD2ifpHaoZqvvqq12ClkfFSNkLQWx8IxkEEDLnO2I364VS0+h7fVWy70gqrbWwV1O44EtPK2Rh+bchbJpYyc7/VcK/R/ueiW6pvNu0lLfwamE1T4K8RiGNjXgAN4SXcQ7wDJO45rvaAw/Zo/X6osyIAuT6u7ONZf3jHWGidQ01LPPF3c1JcXPdCPCGktAa4YIa04wNwTnfC6wiA4jbewm40XZfqazS3almvuopYpJZg1zYI+CQPwMDJ/e3wOY2GFmoew6tptd6Qv0ldRmKyUMFPVMaHcUssTXBrm7Yxnh545LtCIDhzOw29t7H7ppE3Og+11t3/WLJvH3bWcLBwnw5z4T0W1rHsNqr1pbSVPZKuhtt40/E2J1QGua1+ACSC0Zz3gLhn+Jx6rs6IDWtwrBbKYXAwmtEbROYSeAvx4i3O+M+a532Y9l1ZonUGpbhcqiirG3eoE0IjaS6MBz3b8QH8Y5eS6aiA5/wBrnZi3tKsVJFT1jaG52+Qy007mkt3A4mnG4Bw05HLhUOpex/XupNTWa46+1XR1dPZZGy08dEzL3EFp3JYwblrck5Oy7iiA5ZRdkcx7VtV6huk9JU2jUFDJRmmbxd4A7u9ztj9w8jzwvE0/2L6ms3ZnqjRst4oKiluha+jfmT9i4OHFxDh5ENby6j1XbkQEU7MtJ1Wh+zq2aerZ4aioo+94pIc8DuOV7xjIB5OCr2maUqtb9ndz09RTw09RWd1wyTZ4Bwysec4BPJpUqRAeTpW0y2DR1ms88jJZrfRQ0r3szwucxgaSM9MhRPs67PK/Rur9Y3erq6aeG/1gqIWRcXFGA+V2HZA3/aDl5FdCRAeFrTSlJrbR9fYK1xZFVsw2RvON4Ic1w9iAcdeS4xH2F6/uVJatO37V9HLpe1zd5CyDi77AzgbsG4BIGXHhzsvoREBzW79mdwr+3Gx61grKZlBbaYQOgcXd64hsgyNsfvjr0KhruxjtEtetb/fNM6toLW271cs7gA4u4HSOe0OywjI4ui74iA4trHsl1tqq0aQkfqOhN9sLppJqyUOxJI6Rjo3NAZ0DBzCkGk9N9qNJeHv1Vq+33W2vgkYYIadrHcZGGnIjacD3XSUQHzVQfo566pbLUWJur6CmtFbI2SphhEh7wjkSOEZ5DbOFPNYdh1JeuzOy6atNcKWssZLqWqmB8Zdu/ixuOJ2DtywF1lEBxPTvZBrGv7RbbqrX+oaK5vtLWimipQ48Rbktz4GAYceI7Ek81t6y7JNSO7RX620Ffaa1XOoYG1MVUD3bzw8JOzXAggN8JbzGc5XYUQHLuzPstu+mNV3PVup74y6X25RGGTuG4ia0uaTuQMnwNAwAAByPTqKIgCIiA//Z",
        "target": 2000000
    },
    {
        "balance": 280000,
        "id": "STU-035",
        "name": "SAFIRA NAILA AGUSTIN",
        "nisn": "0086296055",
        "password": "password123",
        "phone": "081234567035",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 100000,
        "id": "STU-036",
        "name": "SAVA QUINSHA AULIA YASMIN",
        "nisn": "0104662813",
        "password": "password123",
        "phone": "081234567036",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 35000,
        "id": "STU-037",
        "name": "SILFA NOVIYANTI",
        "nisn": "0087746448",
        "password": "password123",
        "phone": "081234567037",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAcCAwQFBgEI/8QATRAAAQMDAgMFAwgFBgwHAAAAAQACAwQFEQYhEjFBBxMiUWFxkaEUIzJCUoGxwQgVM9HhYnKSorLwFhckJjdDY3SCk7TCNFNkc4PS8f/EABwBAQABBQEBAAAAAAAAAAAAAAABAgMEBQYHCP/EADkRAAIBAwEFBQYDBwUAAAAAAAABAgMEESEFEjFBUQYTIpGxFGFxgcHhIzJCFSRSYqHR8CUzU6Lx/9oADAMBAAIRAxEAPwDh0RFx59DhERAEREAREQBERAEREAREQBF6ATyBPsXhBHMYQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBOZwvWMdI9rGNLnOOAAMklStozs/joWx3C6sElXs6OI8ovU+ZWRQt515YiavaW06OzqXeVXq+C5v/Opyunez253trZ5/wDIqV24c8eJ3sb+9SPadAaftIa80YqpQN3z+P4Hb4Lp4os7AcuZUS9pfbQzT9XNZtNiOouER4Zqt44mQnq1o6uHuHqt/Rs6VJZxl+88vv8AtBeXra3t2PRaeb4slWKliibww0rY2/yWYVM9HTzN4Z6Zjh5PYCF8jVWtdZVlSambUVxc87gtnc0D2AbBdPpXtw1TYqqOK7P/AFzQk4eyXAlA/ku8/blZG97jR5lnOdSb7voCxXRrnNpRSykbSU/h/q8vgow1Jou46ecZHN+U0mdpmDl/OHT8FMundQWrV1mjudlqBIx2z4zs6N3Vrh0KypWNla6ORnMYc1w5rHq2lKusrR9Tf7O7QXdjJKT3o9H9Hy9D5uRSFrPQYp2yXG0x4YPFJTjp6t/co9XP16E6Mt2R6jYbQo39LvaL+K5r4hERWDYBERAEREAREQBERAEREAREQBERAEREARFfoqV9bXwUrPpTSNYPvOFKWdCmUlFOT4I77s00y2ZxvNXHlrTwwBw69Xfl71KcLDJIGt+8+SwLdRx0Fvgo4G4ZEwMaFkXm7UmmbBUXCseGxws4nHqT0A9Sdgurt6KowUEeI7Uv539zKtLhyXRcjie2LtAbpDT36tt0oFzrgWsIO8ber/yHr7F83UFBLVyZaxz3E5zufeutrI7hrjVNRdavxPlcABzEbejR7Au9tOkoqSnazhBe0YVutXS0Rj0bZy1kcBbNL8cXFM3HFtgDH3q5XaVpY2OMUb3E/wB9lKYsjGxgBm2FbNmDgMsWH3ss5M3uI4wRTpS/XPQOoG11C50kDjw1FO4kCVvl7R0K+nrVdKHVNlguVBKHxzN4mu6tPVp8iORChu9aRjqYnGNoDsYKx+z7UdToe/i3V5LbZVvw4k7RP5B34A/d5LJp1tcmJVt2loTPKDu1ww4bEKJNe6bbbK0XCkZw01Q7xNHJj/3FTRWxCaETx4JA3x1C5u+26O62WopHjPeMPD6O6H3q/c0FXp48jL2NtGWz7mM8+F6Ne77cSC0Xrmlji1ww4HBB6Lxcme18QiIgCIiAIiIAiIgCIiAIiIAiIgCIiALr+zm0urdQ/LXNHc0YySeriCGj8T9y5BTbo60fqfSFE1zQ2apzUSefiAwPdhZ1jS7yqs8Fqc32kvfZbJxj+afhX1/p6nV0MeXGV3JvJRN2lXWbUt9Nnp3O+R0R8eOUkuPwaD7yfJSPqa7DT+lJ6kY77h4WA9XnYf39FGmmKLjkNTLlxznJ6k7kre16m5HC5nldtSU5ZfI2mndNwW2ia0sHE7cnHNdHFTMa0YC8ibloWXEwYWszk2eMFr5O08gvHU7cYDRlZYavHN325qSnJrJ6UAHbOVx+p9PRVkDntaeI7nAXeSjw7ha6eMEHYEIngnGVqOzS+zVNudZ69/HPSjEbzzkj6Z9Ry9y39XD3Mj2dOnsUciodp7UtPXMJbEHYePNp2Kk+5Ylpo52YIIxkeS2VtPeW6zWXNPcllcyCdW0LqDUtU0jDZnd8z1Dv45C0q77tJosw0NeB9Z8Dvg4fi5cCueu6fd1pI9i2Lc+02NOo+OMP5aBERYptwiIgCIiAIiIAiIgCIiAIiIAiIgNhYLcLtqCioTnhnla12OYbnf4ZX0G+MOmp42jDc4A9FDvZfSibWImIB+TQPkGfMjh/7lM1P43RvHRufgt/s2GKbl1Z5h2vuHK7hS5RX9X9kjg+1Kq7+st1ubkjLpSPXkPxKptlOykpI49gQN/asXV7ZKvXbA3fuqcO+JVuGiq5CC6UBx9uyuXLzPBz9v4YLB1EODjxLMY5jdsrmG2m4RkPFYS37IGFdgdWwy8ExLhnmsVxxwL6lnidLxtJ5qrAWsilLtsr19S5m2VGSvdMyRoOwK19Szhz5LCqa6qBLYGFzjyPRYE/66kjyWNI6gHCqUclLlgxtRUvfULnAZLd12GkK83fRcYk3kiaYne1vL4YXC1MlYxha9pwdiFuey2qeyruVuk2G0rR8D+SyKD3ZoxrjxQZ7rqiNRoeaYD9hO2T7vo/9yiZTrqWmB0NcoyP9S93u3/JQUsPakcVE/cd92QquVpOD5S9UgiItSdkEREAREQBERAEREAREQBERAEREB3nZK0O1DXA8/khx/SapXtb+8pwc7taR7lEvZNK1mrJmE7yUzgPU8TSpUtDuC4V1MfqODx7Cuj2e/wPmeS9qV/qMvgjjrnE5+sK6cDIjjYz4Z/NaSqvtWLwy30VE6SVw/aSHu42+1xBz7ACuxMIdcq6Qjd8xHuAH5LCrLT3j+8DA7Ct1JJ1JZNdGLUI4I+g7UbpBeHWqptjnVgmMIhjbnJ4g0b7c9zy6eq72nubKniZI0xTMOHsdzBWEbYYa0VUdKBUcPB3oADgPLPNXoLQTXNq3gh/XLicqmbi/wAqwKcZL8zybanjMgOAfNW5WiOTx7ZWxo2903fqsSsaHzHPJWUXma2uu0NBG9wjdK9jHPLGDLsAZJXJU3atDca2ClpbZLK6oPCxrJI3u+iHbtD8jY9euRzBXTihlt9RJPG6SQy/S5Hby5clpaHSdut1zfcLfQ9zUuyeIA+HPPhB2H3K/HcxqY8lPPhehk093o7z3jYj44zwyRuBa5h8iDuFl6Ki7jXs7QMNdTu/Fqu23TsUE76p8Xzz+bjzK2VipeDXAeBgOpnfiEg1vLAmnuPJvL8wSWGvjxkGnlH9Ur54X0Nd3gWms9YZf7JXzyqNrfo+f0Ov7GfkrL3x+oREWkO+CIiAIiIAiIgCIiAIiIAiIgCIiA6LQVYaLW9ufnDZHmI+vECPxIU3Rs7nUAeB4ZoS0+0HI/Er50pqiSkq4qiI8MkTw9p8iDkL6OgmbUwUlW3BDw12fQj+K3mzJ5jKHz/zyPN+2NDdrUq/VNeX/ppScVUw/wBq8/1isoMD2rEqMx3Odv8AtHH3nKy43bAqippN/E0FN5iik04zyVqRoaN/csmWcNZyytb8pje1800jWNHVxwAqSsvse4jnhWJPpni5K9DUQOZzPtCtGSCaQta8AgdeaaBmTFEHxjIyrraZueSwKGtIlfEfq8lsTUDGeSnOClrOpROGsYQFjWZudQmXoynf+Lf3JVz4aVXYGuMlZOeXC2Me3cn4YV2gszRarvFNlOp5DDpuudnBFJLv6lhUDKbNdTiPSde/POMM97gPzUJqztR+OK9x2nY6GLapPrL0X3CIi1B24REQBERAEREAREQBERAEREAREQGRQUctwuEFHCMyTvDG/eV9DWyFsFvZSNPhhaGNz5AYCijsxtXyq+S1725ZSNw0/wAt234ZUsQngnPqt/s2luwdR8zzDtded7cRto8ILX4v7YNVeBwXHvMY7xod9/L8lSyYhoWZfos07JQPoO39h/j+K1UbsxpcwxM0NvPMEZjXB27iFiVVtp6geONrgTnBGR7ljXCephgDqaHvXjfh4uHZal2rJY2eKgnjd/KGSPcrCyZSi5vCRtv1V3I7umxCz7LdgPYF6bJS8bJXxNdK3k/k73rS/wCF8ZYXPJaR0LHA/gvI9VyzHhhp5pv/AI3N+JU6lXcyOlip4oXFw2cV6ZcHmtJSXarqqvgNGWxBuXP4wcHywtk93VUtFPDQ8qpeIhq3NtY6ntDMjD5nGTHt2b8AFoI2GprI4QcF7sZ8vVdU0BzhwjDGDhaPQLOtIa7xr7qem6c3rmEO0ZXg7kMa73PaoWU4a1GdHXQ+UYH9YKD1gbUX4kfgd/2Of7pUX830QREWpO0CIiAIiIAiIgCIiAIiIAiIgCIq4onTTsiaMue4NHtKEN4WWTL2c2z5FpKGUjx1TjM7bpyHwAP3rp8HvCrtsoWUVsgpYx4YY2sHsAwqSz54j0XY0Yd3TUeh4Pe3DubidZ/qbZdnphVUT2EZDhghce/jpKh0MvMdfMea7ikdstRqa0GWldUQNy9m+AqatLvVjmW6NXu5a8DSteHNweRWLUW1s3Ib+asUFdHUQ8TXZwcHzB8itxTuD25WpeYvDNxCWdUaM26dh4RCx3tV1ttmc3D2hjfJq6ABg3IC8eWgHHJMlxzm+Zpo6ZtNGcDCtzTBjdysqskDQdxhY1BQPuE4lkBFOw/0z5KuEHN4Rj1Kigss2FjpHOJq3jBcMMHkPNdBEwMjJ6DdW4IgAABhZrmANDfvK29OCgsI1E5ubyzmtat4NBXN7urAPe4KClO3aU7uOzyqadnPMbf64P5KCVotqv8AEivd9Wemdjl+5zf830QREWpO0CIiAIiIAiIgCIiAIiIAiu00D6qqip4xl8rwxvtJwpCPZMZKMSU9145Bs4GHAB96yKNvUrZ3FwNbe7UtbFxVxLGeGjfoRwttpaOObVtrZL9A1LM+/Zb7T2kauj1ITX0/EylfhrS3IlPQgdR1UjS6Xts1RT3KOkjZUwkSNc1vCc+vn96zaGz6kvFLRp8DQbT7SW9LNCHiUo8U+Da0OpiaBGFi1DO7ma/plZVJIJYGuHULyqi44yRzC6FHlfBlFM3Ej2e5ZIw9pjeOaxoXfs5f+F3tWVMw8PG3mFBJGWorObFqP5TGHNpao+Lh6FZ8bZaeNso+chcM8bR09QutvVuju9pfG4DixkHyK5+zxuph8mlzgclaq0o1NWZNKtKC0MZta3GzwR7VTLWjGxyegC6I2ulmOXwsP3JPa6enpnPija0jHILE9j14mT7ZpwOahoJKyUPnBbHzDep9q3cEYADGNAa0YACuRxceGt5lbKnoOAAnms2nTjTWEYdSo5vLPKWLAyVeazvBn/zHYHsCuPZwgRt2LtgrjAO+25MGArhaZwPbFNwaVp4gd31LdvMBrv4KFVPeu7JBqCnipZpHxmMl7HN6HluOqiW86LudoY+YNFTTN5yR8wPULRbRt6kp94llYPSOy20bWnbK2nLE8t6889Gc8iItMd2EREAREQBERAEREARF6xjpHhjGlznHAa0ZJKEN4Oo0DQ99fjWvZmGjYXcR5cZ2aPxP3KZNN008MUpqHZfM7vA3o0dAuT0PoqrisLPlbXUr5pe9e0jxYH0R+f3rv6WD5NL3YJIa3AyV09lS7uks8XqeO9ob1Xd7JxeVHRfL7ns9IwuD+EZ8+oVmJpZK+J24+k0+Y6/39VsXgFu6wKhr45GOa0uLXZwOo6/39Fn5yc8i9CwRPIGzXHl5FX3DIVBAaR9l3wVxv2Sd+nqhBiRt4J3wOOGv3HtWZC7iYWu5jYrFqWFzO8b9OMq8yQPjbO3/AIgjB40d1MWH6Llp7lR93MXtGOoK3VQOKLjbzG6sztFTScQ+kERK01MKhl72MZ5jmsmqbxUkg9MrXQk01QD9UnBW34BJGRzDhhRjDKma22Dvah22zVugAAtZaYe67xp5g4WfO8tZhv0jsPajWpDKWHikfKdg3Yfmq4mkRcR5u3K8LA2NkI68/wA1cfyDRzKkg1NVRvqah8hcAwbAY5rHko8MIwDt5Ldv4WtDQOSwqkHi2GylBNka6h7OYa5z6m2ltNOdzGR4HfuKjm5We4WiXu66lkgJOASPC72HkV9E+EcwtDqmzOv1kqKKEtZI/BY5wzgg5x8MZWtubCnUTlDR+p1+ye0lxbSjRrvehlLL4pfH3EDos26Wivs1UaevppIJBy4hs71B5FYS5yUXF4ksM9Sp1IVYqcHlPmgiIqSsIiIAiKuGGSonZDEwvkkcGtaOZJ5BCG0llmVarTWXq4Mo6KIySv5+TR5k+Sm7SOg6DTcTJntbU1xHilcOXo0dAqdE6UZp62ta5rXVkjeOZ+N8/ZHoF1cZJ2JXQWloqa35rX0PKtu7eneTdCg8U1/2+3ReZdEo5O2ViaXu5mPJy0+ElXseatzQtfE5vQhbJHJGRnLVQWBzd+Y5LHoKkyRGN+0sfhd+9ZZ2KqTIawUHLmcJb/FUxO4h3bj4hyKvA+fJWKqnf+2g/aN3LftfxUkHsbw6ofE8YdjJHn6qxG75JVmN37N/L2q/E5lVEydmzh7x5hVzwNqIcdVJIA7t3Ad2O+j+5WIj3FW6F30ZN2r2ml42mnm2e34+qrnhdNHw5xKzdrkBhV1NjiGPUK7bp+OLgd9JuyyRiqpwSMPGxHkVq3h1JU55bqeKJXQ2ULeCeb1wUZ89WFx+jHsPaqTMGMMvQt+Kqa5tHQOlk2OC4+1QQXOJvfOeeTRj96oYXzOLm7DofRU00bqiMOfs3njzKyi9jNh0UNgtGMNGSferT2h7TwnK9klFQ7u2kYH0ivZpIKeHiLuXl1QGumcGtJOxSjHeSZxlo5LFuMksdMXBoMrznh+yPJbG38LqRhaMEjdRJ8irGhZudmorxQvpK2Bk0buQcOR8wehUNaw7P6qwvfVUTX1FDzPV8Xt8x6qcixxODsqO7DqhrHbgDLv3LFr0IV1iXmbbZm1rjZs96k8x5rk/7P3ny8i7HtI00LFqJ9RTRBlDWEvjDeTHfWb+Y/guOXNVqTpTcHyPYbK7heUI16fCS8uq+QREVoywu+7KbCK+9SXKZgdDSbMz1eRn4D8VwK+gtA2ltp0lbIyzhknYZ5MjfLt/wwPuWdY0u8q5fLU5jtPeu2snCPGeny5/2+Z0VO3hPF6Ktow97fLcewr1reHbyOEeeGZh+14V0Z5GAvDs1VEYKpKkgx+64JO+Zs7kfVZTHh7cq08gRlY08z6atY8DMTxh48vIqSeJsMq7G7orDXhwBByCqmuwVJSemMRTFzBgP3cPXzXsgc0cbd/MeaqznGVXgEbJkGFNEKhgljOHt3BVcE4mbwu8MjVcczu3F7OR5hWZoO9IliPDIPiqiS4QWSF7Rv8AWHn6qzW04qYOJn0huF7DVCR3dTDu5W+f4hXSCx/EBsefkU4Mg1L3nuoWHlxjKrqZRX1McAd8zGQ+Q+eOQ96s6jLqagdVwglrTlwH1fVWNLH5RbW1Ehz3hLz7Oilla4ZN/wB4eD7DOQA5lWpX8A8Q+7oqyfnON3sa381Q9zYzxvwT0HkqUUlsCeTH0YIx5jxH7uisTzxwvDGZdIeRO6pqq8MzxHG2Q3qVi0MUlQ91RKN3HYeQRsqx1MhlOZngu381mNj7kjh2CuxMAbyXrxkqkZLkZDhlWIhxPlk+07HuVxmRn0Cpp/8Awo8zuqSDnta2Rt+0zU02PnWjjiPk4cvfy+9fPRBBwRghfUcjeNzY+jsr5911aRaNXVUTRiOU980eXFz+OVqtpUsxVRctDvex961OdpLg/EvR/TyOeREWjPRjYWG3m63+iogMiWUB383mfgCvpWJgbK1g2DI8AeSg7stohVatMzgCKeIuHtJDfwJU4tOKo/zVvdmwxBy6nl/a+4c7uNFcIr+r+2C6PE0HzCpl3iz1buvGv7uQsP0TyVbwCCByK2pxY5jK8I2VMZ8A9NkecNQgtynLC0cyvHsDpMEZ2VQHh9Sq2jxlSSY+TSnfeL+yrwdyIOQV5OQGEFaqnmmo5yx4L6Zx282pwJWpug/bzV5kgKww7YOYcgqoPBPkVJBm4BGVYkjfGeNm46heNnI57q62oZ1yPaEIMWWOKqYA/Zw3a4cwjWzwjmJGquopTIe9ppRG/wAiOJjvaP3LFNVUwDEkTeIbbOxn2KriSZBcyRpDozuMEcwVbihp6aIMiY2KMcmtbwgK18vz9NjmO9QrMnFUAudxFg6u2aPuUDBfmrI4x4SHOPkclYEtXK5x6O9+FbirI5JnQ0sZkcNjIR4R7Fk01IXSkP3PMo2VJYOcddKahrnPuBe0SE4dguzj2Bbu36ks1QRFHWxMeOQeeDP3uwuU1nSVE9dGyGOR7WRk+FpIGXH9y5WeOWlkDXMc0j7QwVrK1xUpzaS0Ovs9iW91bxm5NSa93oTfDLHIwuY9r2+bTkfBV43BKhOlqpYyTHI+PJ5tJH4LMdNLJj56Tn9oqlXz/hKJ9mnF6VNPh9yXZpGsglcDu1pVTAGQsHQYXFaNkJp68PdlhcwYJ885XWFxdGGt+udvQLNpVO8ipHO3lt7LWlRznH9slyM97UcX1WcvVRB2v0/DeaGqH+tY9n9F2f8AuUxsAji2CjHtZpjLYKSqDc9zVFhOOQc0/wD1Cs3cd6jJGz7O1e62lSfXK80/qRMiIuYPZSUeyCjIZWVhziSVsQ2+yCT/AGgpSf4aoHzaVHvZIMaccc86t5/qMH5KQqjZ8b/I4XS2axQieL7fm57Rqt9ceSSK3gPHxC9Y4435jYqlhywemy9IwchZqNGz1v0iqZTyXhdwuBPJeVDgGtJ5Z3UkFbdyF69wYMqy93hyF7O7LduiElIBmf6Kt8LS3hI2V6BgbGD5r1wyoGTB7uSmOY/Ezq1XWSRT7A4cObTzCySzIWvroGPI2Id0IOCFKGS+Y8cnkfeqXOkbyl+CoYyTuwHSE+pUe6ouFf8ArqambWzMgjdgMY7hzt1xzVyK3imUlHidtV3KCkPz9ayJ3lxAH3LQ1urmAtZSxyTuc4N45CWt93M/BcoxpAzzJ5k81fpfnK2Fp2w7Pu3Ve7hZLPetvCO7oKX5a1s9Q7jOdh0C2E8LGQ4xsrFpbwUMfvV6odxuACsZMo9oYGxxkhoGVkRbTO9i9hZwxgKpjR3u/UKAKZgdC0+WeY9SrdVR01WOCenilGPrNBVcQDOJhcSAeR5IHBz/AAuzjZU4ZKk08pmo/wAELLK8n5LwE/YcQqxoi0fYlA/nnZbZudnY2HlzV9s44N2uCtunHmjLW0LpLSo/M56WzQWdkdNRF+auYcZc7OGtBJPuz71uII9uMjGRgDyCof8A5RW5x4GNx9/M/kshxw1VpJLCMapUnVlvzeWyh54jwjl1XG9oEAm0DdDjJjcx4/5gH4ErsohkOK5bWDePQV6/9vPucCqav+3L4Mytny3buk+ko+qIDREXJHupK+hIq6001oMbXyUtwyZGOI8DiXkObtnAawZyd+IYxhSbUjjgdjpuuQ0vWR3arpGt7gsttOWMMQI54aA4EZaRwu29fVdiDxNIXWUod3FRfJI8Euq7uK06z/U2/NlqN+XH+UA4K8sVngx/IcQfYVkq6jHZRI3iaQsGtnkbapXM2fFz2zgdT7lnuWK2MOnnBGQ5o2VRBz0lyqIa2KnfVzhspIbIA0g+X1cb5A9q0MmpJrsY+5qruWyANDGd1CC7vCzBIaXYy3mPNdV+paeFpbDLPG4HZwkLi0eQDsj4L12n3cUZN2rAzBPDEyKLnvzawHn6qdCdTkhc3z0T+C13GaURvxx19S4OeImyMBLXbcXFj2gq84VDbVNXTW+eLuWwSPgFRVue0OlLZB+03LWtJ5dff2FPpO2Rw4k+Vzl25M1ZK/8AFyyG6YsuQXWymfgYHeM49vvTwdCG5GFoetlr9NmaWGaFgqJmRNmzxd2JCG5yT0wty5veS5V1scdPAI4mNjY0YDWjAH3LyJvMlUrQniUuZwtUWXr5281cnPMrvxUpVMgjic5xwGjKimodxzPed+JxKv0uZjVuRRE3LRsqovBVxOzyeEZyVDvphXORYTw8koUcXDRRY5cIK84eKYBV2x3eWmmeeZiafgqoxmcrDT0NkZIGAF6Y3cQIamdle+qpKTHbES+QkHc7K3wkN+g7PoskHwn1VDj4/YmQWxkt3yPaF5UVEdPTPkLhhjc4HM+iuk7ZWLWzFkDttyNkGD2hcH04dvknf2q7KfDhWqVhjp2N6gbqv9pJ6BUlRdZ4YSfRc1qVrX6EvRccAUz3e4ZXSzHggd6BaC+szoS8n/0cv9gqJcGXrZ4rQa6r1PndERcge9k+6GtrKO0NqTHwy1Q4yc5y36vw3+9dIXFkm/IqxA0Q8EbRhrQAB6LKe3jbhdi5OTblxZ8+JJaLgUuaC4+Tgqo3ZYM8xsVQ0lvhd71Xjhf6OREHpVljcTvPm0K+qceJVEGA5hMrz02Cy3t4nsb0ARzArmPGD5BQVZL2cAIHbqlFAEm4VTdgAqSV453dxOefJAa68SD5BVO+rHGfvJCjWXJUg6iY6KwSu48ZHiHmSQo9fucLJpcDErPxFxmeBW8ePKu4wNlR1Vwskk2OTjsVKf8AZAfBZLPC0u6uOy1Gk5+/sDG53Y5zPc4rdAfOgdGBYPDQ2S11LsYwMK7xK23dwwrhCkgwbndaKyWyavuNSympYRl8j+QXPxdpWjqh3g1Jbx/OlDfxXM/pA1Doez2niacd9WsBHmA1x/JfPFrtddeq4UtLHxuxknkGjzJ6KJeFZJinJ7qR9Yf4xtHl4YNTWwuPlUN/elRfqSsr6CnpKhk/ygl7TGQQWtHP3kL5vvmgKm0WE3SOsiqoonBlQxgw6InkSDzB81LHYjpJ9BaDea1pM9S0CIO5sjG4A8vNW41N9Zi8ouzpypPEkSxl3dtafpEbq7G3ACpa3Lsq4PJXC0Wqx2KV3qFqL43/ADEvH+5S/wBgrZ1x+ZIWBfG/5k3YedFL/YKPVYLtB4qxfvXqfN6Ii4899Prn9T0uc+P+ksO61mn7DEyS73WktzHnDXVdSyIOPoXEZW7XzX22aZvdL2rN1VXacl1Vp00zYxTtc8NgaG4c0lm7fES8HGPF6LsD55yT4JLK+2C5C4U5oSARUidvdYJwDx5xz9V5HPYprfJWxXOlko4jh87ahpjYdti7OBzHvXzjQ1OmZP0YtYwacqrqQyankqKO4PY4wPdLGMsLWgFruHnz8PIdeJs19uNJ2c3Ls9ihca2/V1FNTsAPjZI0O5+pEPvKZB9hNrdPvoHVrbtRmkY/u3TipZ3Yd9kuzjO429VVU1FjoqeGoqrlS08M4zFJLUNa2QYzlpJwdj0Xynb2Oi/RPvkbtnN1G1p9ojiVnRF2pe0ntS0xbNWyFtsoqZlHSUrc9290bAGtdvtxkZJ6nDeXJkH15FQ0dRCyaGTvYpAHMex4LXA8iCOYWtdd9LxzGN99t7ZGnhLTWRgg+WM810DWtYwNaA1rRgAbABfBt1ksDbprFlzgq5Lk+rf+rnwuAYx3eu4+PJ3GMdPcmQfccsFBBSuqZp2x07W8TpXyANA88nbCwLXdtM3uZ8VpvdBcZY93Mpatkrm+0NJwvmzUwvc3Zj2W6LuM01Gy7TP78uB4gwzBsOQfsskzg+i3dbQ9mWhe2y2UFubqO23W3zQQ4pHsdDM9/Dgvc9xdhwfhwGBjOAgJ5qbnpujqXwVV5oYJozh8clUxrmn1BOQsh5s8lu+XGug+RN3M/ft7sb/a5L5O1/LpyDt91XJqihrq2gGeFlG4Ne2TgZwuJJGBz8+Y2K3Wi7TcaH9F3W1dUsdHQ17mPpA52eINe1rnY6b4H/Cg1PpSS2WrUFsBjqBU0shy2SCUOa7BxsRkcx8FqK7RWmbbRyVtfUupKaEcUk09QGMYPMuOwWm/R9/0F6f9tR/1Mq5L9I6yanrtO11yF2jp9MW+CF7qNoy+oqHTBm/oA5p3J3HLqqlJrgUuKb1JKp9EaeraWKqpZpJ6eZgkjlimDmPaRkOBGxBG+VjUeldIXKrqqWiuLauoonBlRFDVte+FxzgPA3adjsfIrWUNHqW4dgWmqTSddDQXSW2UTRUS8o2d0zjI2O+OWy4n9G63yWjV/aHbpqp1ZLSVUMD53DBlc19QC4gk8yM8ym/LqRuR6Ey2zS9utED4qbveBzy88b84J/8AxY9LddL1t1fb6S+2+orwcOpoqyN8ox/JByuX7fb1WWPseuctDK+GapfHTGRmxa1zvFv6gEfeuK0z2CaauWgtK3SnuVXabxI2KsfWxPy+Vzm8YY0E4aQcYIGdjnKpK8sml77TDcY6F9bCyskGWQOmaJHDfcN5nkfcqqaW1VtTNT0tdBUT054ZY4pmudGc4w4DcbjG6hfVYLf0xNJAuLiKADJ6+GdOw/8A02dpn++y/wDUSIMskbXmlNJahoKWj1NcG0cTJDLEHVTYS5wGD9LngO+K1Wl+z/s9tznU9kuUdRLvI4MrWSvwOpx0GVwH6UbWvvmh2vo317XS1ANMxxa6ccUHgBG4LuWRvus7sitlsZfrpUU/ZlcdIzxW+QNqqqsnmbICW5YBI0DPXz2UPXiSpNcGd9dLLoTUdGLZNe6R8UjWxd1DXRgvAcHYwOeSF0JpbFYoaekmrIKMSeCFs0zWF+MbNzz5jl5r5A0toa13zsX1TqWd00dys80fcOa/DC08OWuH3n1zhdHqS61V60R2OVdbK6Wf5RUQl7zkuDJ4mNyfY0IkkHJvTJ9RVD7PRVUNLU10FPUTkCKKSZrXyZOBwg7nfbZUXOqsdigE12udLbonHAfVVDYmk+1xChXtt/0/dnP+8U//AFTVrJ7ZQ9on6R2qGar76qtdgpZHxUjZC0FsfCMZBBAy5ztiN+uFJGWT9Rss98ohU2+thrqZxwJaaZsjD97chX6mxUdVbp6KTvO5njdE7Dt8EYKhX9H+56Jbqm827SUt/BqYTVPgrxGIY2NeAA3hJdxDvAMk7jmp7QKTTyiPf8Smk/Ku/wCf/BFISLH9mo/wo2v7a2h/zS8won1d2cay/wAYx1honUNNSzzxd3NSXFz3QjwhpLQGuGCGtOMDcE53wpYRZBqSEbb2E3Gi7L9TWaW7Us191FLFJLMGubBHwSB+BgZP1t8DmNhhXqHsOrabXekL9JXUZislDBT1TGh3FLLE1wa5u2MZ4eeOSmhEBBzOw29t7H7ppE3Og+V1t3/WLJvH3bWcLBwnw5z4T0WVrHsNqr1pbSVPZKuhtt40/E2J1QGua1+ACSC0Zz3gLhn7Tj1UzogMa3CsFsphcDCa0RtE5hJ4C/HiLc74z5qO+zHsurNE6g1LcLlUUVY271AmhEbSXRgOe7fiA+2OXkpNRAR/2udmLe0qxUkVPWNobnb5DLTTuaS3cDiacbgHDTkcuFcdS9j+vdSams1x19qujq6eyyNlp46JmXuILTuSxg3LW5JydlOKICLKLsjmPatqvUN0npKm0agoZKM0zeLvAHd3udsfUPI88LSaf7F9TWbsz1Ro2W8UFRS3QtfRvzJ8y4OHFxDh5ENby6j1U3IgOU7MtJ1Wh+zq2aerZ4aioo+94pIc8DuOV7xjIB5OC97TNKVWt+zu56eop4aeorO64ZJs8A4ZWPOcAnk0rqkQGp0raZbBo6zWeeRks1vooaV72Z4XOYwNJGemQuT7Ouzyv0bq/WN3q6umnhv9YKiFkXFxRgPldh2QN/nBy8ipCRAaLWmlKTW2j6+wVriyKrZhsjecbwQ5rh7CAcdeShiPsL1/cqS1adv2r6OXS9rm7yFkHF32BnA3YNwCQMuPDnZfQiICNbv2Z3Cv7cbHrWCspmUFtphA6Bxd3riGyDI2x9cdehXGu7GO0S161v8AfNM6toLW271cs7gA4u4HSOe0OywjI4uinxEBC2seyXW2qrRpCR+o6E32wumkmrJQ7EkjpGOjc0BnQMHMLoNJ6b7UaS8PfqrV9vuttfBIwwQ07WO4yMNORG04HtUkogPmqg/Rz11S2WosTdX0FNaK2RslTDCJD3hHIkcIzyG2cLvNYdh1JeuzOy6atNcKWssZLqWqmB8Zdu/ixuOJ2DtywFLKICE9O9kGsa/tFtuqtf6horm+0taKaKlDjxFuS3PgYBhx4jsSTzWXrLsk1I7tFfrbQV9prVc6hgbUxVQPdvPDwk7NcCCA3wlvMZzlTCiAi7sz7LbvpjVdz1bqe+Mul9uURhk7huImtLmk7kDJ8DQMAAAcj0lFEQBERAf/2Q==",
        "target": 2000000
    },
    {
        "balance": 5000,
        "id": "STU-038",
        "name": "SITI SARAH AZZAHRA",
        "nisn": "0093065485",
        "password": "password123",
        "phone": "081234567038",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 50000,
        "id": "STU-039",
        "name": "SRI WAHYUNINGSIH",
        "nisn": "0097696921",
        "password": "password123",
        "phone": "081234567039",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAAHAQAAAAAAAAAAAAAAAAECAwQFBgcI/8QARxAAAQMDAgMFBAcEBwYHAAAAAQACAwQFEQYhEjFBBxMiUWEycYGRFEJSYqGxwQgVI9EWJDM3cpKiQ3SCsrTCFyU0NkRjk//EABwBAQACAwEBAQAAAAAAAAAAAAABAgMEBQYHCP/EADYRAAICAQEFBAkDAwUAAAAAAAABAgMRBAUSITFBBlFhcRMiMoGRocHR8BRCsRUzUhYjkqLx/9oADAMBAAIRAxEAPwDR0RF48/Q4REQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBFVpqaesqY6emifNNIeFjGDJcfILq+kuyyKn4Ku+ATTcxTjdjPf5n8FsUaed7xE5e0dq6fZ0N658XyS5v8AO855ZdKXi/vH0KjeY+sr/CwfHr8Fvts7GWeF1yuTj5shaB+Jz+S6jFFFTxBkbWsa0YAAwAqbqgyP4IGl7j16Lt1bPqh7XFnznWdqtbe8U+ovDi/i/pg1OHss0tC3ElNNMfN0zh+RCjN2YaWlbhlDLFnq2d5/MlbBc6+12OmFTfbrS0ETjgGaUMBPkMncq1s2qNLaikMVkv8ASVMwye7ZKOLY4zw88euFs+gpX7V8Ecf+q69vPppf8maLdex1mHPtVe4eUc4z+I/kuf3nTl0sMvDX0r42nlIN2H4r0hxuilEVQ0An2XdCpK2309fTvinjbKx4wQ4ZBC17dn1T9ngzs6HtVrNO0r/Xj48H8fvk8vIui6z7Nn0IkrrQwviG74BuW+rf5LnS4V+nnRLdmfSdBtGjaFXpaH5rqvMIiLAdAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCixjpHtYxpc5xwAOZKgt37LrG25ajfXTsDoLe0P35d4dm/Lc/BZaq3bNQXU09bqo6PTz1E+UV/4vezftC6Ni01b2z1DA651DcyOO/dD7I/UrceNsTMk4AVBrty7qVLG01cx3xGzqvWV1xriox5I+IarVW6u2V1zy2Thr6olzz3cLdyTyXLNb9sclMZrToimbVTsyyS4PGYmH7n2z68veqmvdXSX2d9htMro7cw8E0kZwag9W5+z5+fu54y1aYjZEwyMDQBs3yWtdqVB7seZkp0jmt6XBHHrvp7Vl9q33C5SzV1Q85L5ZeIj0GeQ9BssNLYLta5myOimp5GHia9uQQfMEdV6XZa4wMNYBhW1XY452lr42uyFrLVS6o2noYdGYrsm7Y3Xd8emNXSgVLsMpa13h4z0a/73kevv59nje+nl7iY5+y77QXnu9aLpMlz6UDG4ewcJB94XSez3VhuVLHp+8Tl1ZE3+rVEh8UoHQ+bh+K2atRFvdfI1LdNKKzzN/ljEjOQyuR9ouhhC2W92yLDWnNTC0cvvgfn8/NdWjlc15hl2e38VLO1rshzQ5jhwuBGxHqti6mN0HCRfZ20Ldn3q6r3rvXceX0Ww630+NOanmpomltLKO+g3zhh6fA5HwWvLydlbrm4S5o+3aa+GpqjdXykshERYzOEREAREQBERAEREAREQBERAEREAXZeyqhFLo6WqIw+sqDg+bWjA/HiXGl3vQ0Ip9AWlvLiY55+LnFdPZkc3Z7keQ7XWuGhUF+6SX8v6GcleQwNHN2y1btJ1E6xWOOz0by2trmnvHN5sj5H4nkPitqpyz6TJUSuDYaZhe5x5DC4pLWyaw1bUXOQHupH5Y0n2Yxs0fLf3krt32bkMnzPT1eknh8jK6XtDY4GTSN8R9keS3GKnbwhY2ij4WhrRsFlGNcRzXFR22VGQtGwCOibjkotyBuhJwrFMlnUUsUrC1wyCtC1BQSWuqZUU73Rljw+N7TgtOei6C8E5Kw96pG1dE+J4zkbIn3kvija9L6gGq9OMrDhtfSHu6ho8/P3Eb/NZnjEsGeq492d3V9g1vHTSEinrv6vIOnF9U/Pb4rrpYYKqWHpnI9y6+ns344fNHE1Fe5PhyZona3b21On6S4NbmSll7tx+64fzA+a5Au962hE+iLqwjOIuP8AyuB/RcEXH2pBK1SXVH03sje7NC63+2TXufH+chERco9gEREAREQBERAEREAREQBERAEREAXomwtEWjbKBy+hxH/QD+q87L0Tav8A2dZgOZo4QP8A82hdfZXty8jwvbP+xUvF/wAGudqV6/cfZjNExxbU3iUUzMc+E7u/0g/Nazo+3sgtkbn7PkA+Sk7aql9w1pYtOw54KSHvnkfaccD8GH5q/oaeZkDGRAbADdbureWo/nE8Ro1iLl3mwRMbHgZV5FIOWy176FXAF3e+4AqeiqKmGThnyfVaLWORuqWeZsYII81AkK3hm48JJLwZ9FXJOCpI5gHRY+aPvTzBVjX11QXFsfPzxlWbG3NwL+JvCeWRgq2CN7BhdTUD6GobWQHhcDxNcOjhyK67R3GO72W13eIgtqYW8RHQ43HwOR8Fy+/Q1FRaJmEeMNyDzwsp2J3Z1w0TdbLMf6xaqkvaPuP8Q/HjW9pXiXmaGr4pG4anbxaSu4A/+JKf9JXnpekqhrKm3zxvGWSRlpHodl5wmjMM743c2OLT8FrbVj7EvM9p2MsW5dX3NP8An7EiIi4h78IiIAiIgCIiAIiIAiIgCIiAIiIAvQ2kphX6X0+cYAgY0/8AA3H/AGrzyu/9nB4tHWh32Ipf+crq7Mf+5JeB4rtjFfpa5d0vo/sc8ucUl37VbxcccTYZO5Z6BgDfzBUbpqZ1pkZDHR1E8z9g2Ng29S47ALP2elaJKupI8dRPI8n04jhX89vbMeLgaSPMLPbNStk2eLhW41qMTllw7TrhbLpUUVTSCOSE7MEjnmQcJcCCG43OB8fRbhbr59KmbT1cRhqXs4wzOcjHmNshZv8AdbGuy2lhafPhUW2tvEHvAJByNuRSUoNcFgrCE08t5K1D4uSqVe2ynpouCQABTVTAZQOSwdTZ6GAra6OCcQMHeTkFwYBk488LUKftVpJ6uKmZRVEjpntjZwOiLi4kgeDiyPZPPzHmM9Cfa4xNJUxM4ZpMFzgSCcDAWtxaDslJdG3Gnoe4rGPLxIMnDvPB2WxH0eOJqyVufVKTtQUtWZaYPDJ2Ah8T2lr2+8FUuyR77Z2nVlO/aG6Urm483sOR+Bcs1BpmA1rqmZrpZHfWdzVOCgFp11Zq2NvC36QGf5hwn81EZqMuBNkHOGHzN/mJZSyR/WB4fxXnq4nN0qj5zP8AzK9EVzcVlQ3oHcXzC87V+9yqT/8Aa78yr7V9iPmz0fYv+5d5L6luiIuAfSAiIgCIiAIiIAiIgCIiAIiIAiIgC9CaCpH0Oj6GB58YgL/8/i/VcBoqWSur4KSIZknkbG0epOAvS9KxlLOyFuzAwNA9AMfyXY2XDLlPuPBdsr8V1Urq2/hw+rNHt3hhY0eWSsvHghYeA9xWTRcuB5b8jhZOGTOD5KLFibR5qD3oplwY89FQqCGDnhXHeDhysPVV0LJpHVUgigiGSXcveVQsy7gfxvyFGqeA4FW9FWUkgEkUrZYnbhzDkFVKirpG5fNMyKNu5c84CgFzAQ9iqd03O4VjS1DRUcDHB7HDia4LJBwIUgpPw0HZYe4gPmpHAeJlTE4f5wsnVPAaVj6VhrLxRQD607CfcDk/krRWWVm0llm3XItZVVUryGta0FxPTbJXm6eTvamWQcnuLvmV2PtOv4t1nqKSIjvq9xjG+4YNnH9PiuMK21LU5RrXQ9T2P0kq6Z6iXKWEvdn6v5BERcc9yEREAREQBERAEREAREQBERAEREBsnZ/SfTNd21mMiN5lP/CCfzAXc6mQsqGuHRcq7HqPvtSVdUWgiCnwCRyLiP0BXUqv+1XptlQxS33s+Udrbt/XqH+MUvjx+pqV6aKe/SOHsygSfNVIKgAc1d6kojJTw1TBvEeF/wDhPI/P81hoDlnPdYNXXu2PxOXpZ71a8DKCoy4AclTqYIZyC9oJCwlbXTUYMgifIPu9FjHamuU+RBRhgG2T4z+C1sNG5CLseImyOt9OSHRjuXebNs/BBbKPh/iQtlcTkulHEfxWvQXG6e1xyO4uYdDyUJLjdInccbppXZ3a6HDUyzN+ks7jboY4aZhEbQM9VM2sbjny2WmxaiuEsphNIzP2gSD8t1maITPi45MBx54TBryTg8MyVTU5BU2mRx3p1QfZp2Fw952CxtQ7gYcnJWasFOaegEjwRLUnjA68PT+fxWzpa96aRqaqeIM0vtbwL3b29fo+f9RXP1vHatMH6nposguipWhwHQlzj+WFo65uuedRL86H1DYEd3ZtK8PqwiItI7gREQBERAEREAREQBERAEREAREQHZOxui7vT9ZVluDNPwg45hrR+pK3GqafpPuVn2fUQodEWyPhwXxd6fXjJd+qzVXT7lwC9ho47lUY+B8N2vf6fXW2eL+XD6FgYmTRPikbxMeMOHmFplZRyWyvdTvyW82O+0FusR4akA9VRulsiuVMYZPC9hyx/VpWS+pWrHU06bXXLPQ0p7cnPPPRWTrPEZDJC10TjzLTt8le1EVTQVPc1UZaR7Lhyd7iruCRjhzGQuJOLg8SR2arM+tBmL7mvbhrXvIHI5woOtlTUtHfyyFvkXrYG8OOe6pTyNaMBUNp32Yw2YmCgjpRwxxhuequiRFHhvJU6irYwc91NbqGrvEuGAxwD2pCNvh5rJCEpvCRpzsUeMmTW6hddazDsimi8UrvP0W00Ia+WSpfhsUY28mgKjLDDb6JlHTN4Qefm4+ZWI13dRYdFOgjfw1Nd/BZjng+0flt8QuvGMdNU5yNCuE9dqIUw/c8L7nJdRXT99airbgM8M0pLM8w0bN/ABY1EXkJyc5OT5s+41VRprjXDkkkvcERFUyhERAEREAREQBERAEREAREQBXlqt091ucFHTxOkfI8Aho5DO5PkFl9JaMrtVVmIwYKNme8qHDYeg8yu0WbR9v0vb2w0cfFI7eSZ4y959/l6Lf0uine958InmdsdoKNnp1Q9azu7vP7czO07GRRsjjAaxgDWgdAFcuaHNVhSy4PA/YrIs3avTtYPj748zD1UJim4wOW6iTxuLhyO4WQqYQ9h2WNpBiEsdzjcWlZM5WQU6mkiq4jHLG14PRwWu1GmAJnOpJ3Rkf7NwzhbeYtshDHFMAJBhw5OHMLHKMZrEkZIWSg8xZoclruTDwgNcfQqo2xVUoBnnaxvoMlbsIJWSAcIe3z5qd9DDK/ieSQBuOixLTVLoZXqrH1NPpdO07nYYx0v2pZN8egHJZ+OFlNEIomhrWhXsjmZ7qBoGPLoreqLaalkeTsxpc4rYjFLhFYMEpuXFmLov8AzG4cQ9lryPkta7QNLV+oL1RTx1LWUTW90QR/ZknmPPP6BbnYLfJDY+8f4ZXsc73FxJ/XCqU0D6hpikIMYHiBHTyVbq43RcJcja0est0Vqup9pfU4Pq3TZ01dRTxySTU72BzJXMxk9R5ZH6hYFel7lp6ivNG+Copopo+XC8fkeYPqFym/dllwjq3vsrDNDneKRwDmegJ2cFwdXs6UW51cV3H0TY/aem6Cp1j3Zrq+T+z+Rz5Fe3Oz3CzTiG4UktM88uMbH3HkfgrJciUXF4ksM9nXZCyKnBpp9VxCIiqXCIiAIiIAiIgCIt30n2dVV4LKu48VNRncM5Pf/ILJXVK2W7FGnrNbRoq/S3ywvm/I1u1adu18BNuoZahjXcLntGGg+RJ2XSNOdj0bXNnvcxm69xCSG/F3M/DC3yxWqhskDaWigZDCeYA3J8yeqzzcFuAu7RoK4cZ8X8j5rtLtTqr24af1I/8Ab49PcWNFbqe3UjaalgZBDG3haxowAFdSN72DbmRlTOOHtHmow/2GPLIXTSwuB5CUnJty5mOYxkjnRyDLXDCmNS+h4RN4ochhf9knln0Kll8E5I81cP7uWA96MxvbwPB8isvmQXJw9mRuFju64Kh+OT/zVWnElK7unOL8eyT9YfzU8oBc17eR2PoVC4cAU43eH3KZ0YcNxupSOCQHo5VScBGCVhLCMnIVrU1DpZu7acAKrM/DT6BUqeLiy89VKXUE8bGRMJG581jq5hrHx0gziV2X/wCFZCXchg+KjRU39YdK4eI/gpXDiC5m/g0XC0ZPIAdVRji+jwcPN/tOPqrmUjPEdw3l71bhv0mORgJAds5w6D0VUCpGQ+nY1vvcVLKQwBjAC49PJS1NRFQUhI2awbAKanY4RwyyjxvGXDyz0UeINS1vYKi56Zr3Shs7o295DGGeJjhy4T1zy+K4I9jo3uY9pa5pwQRggr1fWgGAg43Wr6h0NaNQwEz04iqMeGeLZw9/n8Vzdbpf1GJJ4aPWbA28tnJ02xbg3nh09x53RbTqbQN104XS8H0qjB2mjHIfeHT8lqy89ZVOp7s1g+oabV06uHpKJKS/PgERFjNoIiIAiK+stsfeb3SW+MkGokDCR0HU/AZUpNvCKWTjXFzlyXE3Ps30ey5Sfveuj4oI3YhY7k5w+sR5D812COENaAAqFooIbfQQU8LA2NreFoHQBX+ML09FKphuo+KbU2jPaGodsuXRdy/OZJwNaR5K8idkD5K2PiHCeqmpn7gHrt8QtmPM5TLifYtPqpotnSN9cqWoGYlK2TGH/ab+KyGMs6kZlckDmvjdC/2XjCncOKbfyVJ8PVvNXAt85nbJRz/+opzgg/WHRw96u3tJaWgZdjkdirF9OJpY6jiMU7BgSNGcjyIWRaTJGBJwuPm0qW1zJZbyMldEB3Z4gqjg8R5EbnHyCqMMrHcLm8TehzupzJgbtd8lXJBj+6MhAfsTucqrLJHDHgbn0V33jMYLXfJQHAeTD8lO8CwhBcwyOG55BVgHMZ4vDnc+ZVd7y0YBbGPPmVb9+xp8AL3faKZySTmMvGZPC37PVQfM1jQxgAA5AKi58knM4UY4S93CNyeZTzBRki+lOaHbguHyCv5d3BgHJTCJsbhjkwKaEYY6U83FQ3kFCpcXBrfPb5KJOwVMO72okd9VnhH6qo7chYpFkUpI2vaQ4Ag8wua607MIamOW4WRjYZx4nU42a/8Aw+R/BdOcqUvseYxkrDZXG2O7NZN7Ra2/RWK2iWH8n4M8svY6N7mPaWuacEHmCoLpHajpZtLMbzTNAaXBlQB5nk79D8FzdeavpdM3Fn2XZuvhtDTxvh713PqgiIsB0SZrcnC6j2Tac/rkl5qIz4GlkGR1xguH5fNaFbLc+olaAM5XoSy2+O12unpWDaKMN+ON109BRvT330PF9qNpOnT/AKet8Z8H5dfiXbPDA3zYVWKpgbkeamB8PuXewfL8keqkG0rwDjk4KYHdSZ/rHvamCcl614nhyOfIjyKtXkiJzerHZ+HVRhcYiXDcfWHmp5m4Ilj3H5hZIsqyQ4B23KkMgGxGCqgia9gcw4b09PRSvY9ntt4h5q5Ug2QYxsoteGnY4VPDD6JhvmoJKxq42ODXPwSqralj24DgcrD3CkM7WGKZ8bmnOW9VZNZWxOAPdzYHt5LHfgEaINlkqAwZyB7yrX6WZZOBjt/RYYx3CaUcPdMb1O7z+ivKCiqqeZ8kkrpc8uIYAHuCjAyX3cEnLyoHhbs0Kfu5ZD4nKtHTBvNTkFKOB8h32CvWsbCzDRuVEANGypOkL3cDNz1Pkq5ySSSOz/DbuTzSok7uNsbfa5AeqqEMpoy4kZxkkqzjLppjM7IGMNHkEbBNCwMiGPj71OpQeFxHQqY81jZZErvNSS4EYH2iAqjuSpPOZIm+uVUsYu+22K60lXRStBbURubv0ONj8DgrzhUU8lJVS08zeGSJxY4eRBwV6gDO8rHHoCB8t1xPtRsLrbqP6exgbBXZO3R45/PY/Nc7aFW9Wproe07I630WolppPhNZXmvuv4NHREXBPpx1HTtmDAxxaurM9kLVrfSCJjQAtojB7poPMAL1OnrUFg+J7W1L1FikyY+aDYpzRbRxQFId6hvuU6pA/wAUe9QyUXDdgVFsndtOQSzqPJQHJOiAicwuEsZ4o3eXJXDHhzctwQehVl44HF0Y4mH2mHr6j1U8b2uy+E7dWnmFbOSMFyYYZDuOE+SkNHGotkDhhwU4yORz6FTlkFA0bPVSOomnkVd8R6hS7E7FTlgsxDJANtx7lVbOR7Ubvkq/AC1xO5UoY8csJwBBs7D1x71MahjfUoY3HY4+SjHCxm+Mn1UcASjvZz9hqnLo6aM7gY3JKp1NUIWep2AHMrX77caigZBJhjjIT4XcgqzkoLLM1NMr5quHNmWL31cnE7LYgdh9r1KrchstP/pZVj/ZxY/wn+aq/wBKKvAPdRHz2K1v1EGdJ7J1K6L4m1EZCi3cY8lr9v1DJV1kcD4owH7ZBK2Bp3BWSMlJZRo3aedEt2xB3JUjvWNH2WEqq8bhU2DiqJD90D81Ywim2BzzccrRu1i3Gt0nJUt50MrHn1By0/8AMPkt6i3nPk0YWH1VSfTtGXqIDic6B7mjzLRkfiFSyO/Bx7zd2fd6DVV290l8M8fkebkRF5I+7HpGmi8TfJZSEFsYBOSraCPDgrvkV7GKwj4BdLekRTmnVQKsYACraR3BUM8nKueas7lKIYmSn6rh+agsjItOQolW9JM2aMOa4OHLIVwoyCPMKjJAHO42kseOThzVZCpILcVL4tp25A+u0fmFdwzMkblrgR6KiQDsVbvphnijJjd5tU5BkwSmVrFz1LUWIt+kQCqjccZaeFwSPXltcAZaapjz5AO/VWw+4rwNpHIqI2Wt/wBObNsA6fJIAHd81k23KSeEPgi4Q7cF/wDJQTgyJIAyeStJa0ElkI7x3n0HxVsYpJjmeVz/ALvIfJVmMDRsMBRknBLHCePvJHcbz16D3KSsslPegxtQ+RvdHILCOquFM2V0TstPPmqySlwZeFkq5KcHhoxH9A6AnarqNuvh/kn9BKfbFfMPe0FZsVrwNwFH6e/7I+ax+hh3G3/UdV/m/kYSHR8dvqo6pta+QxHPCWAZ/FZFpwcK4krDJGWlmM9cq2PNXjBRWImvbqLL3vWvLKvkpGHBlPr+icWypOJ7pw6vcpwYieI8MBdyLslQfGJLe+Mj+0Y4H4hH7Rho9yqu2aB5NKIk8t/RT6/JF1X+hcfkEWH+mUd57j/VNvgdHjbhTlQaplsHhXzHMJlQHUI7nkICV2xBWMvkbpLVMG+01vEPeN1lCOIbKhUxiSB7SOYwoQNRp71PaXFoNNFG7LyJg5oPmRwgjy6LLHUVaJC0RW4gAk5qnNOBzOOD1CsjaD3NNNFQtqJg0scO8DHYyDkZBB5DmFbnT0klQ6ea3XAyFzi0tnhPCHDGPX4qEvziWb/OBm5NSugfiWKjIAcS4VgGOEZdzbthRl1R3VO6UULpeFuQ2KeNzneHi2HF5AlYCTTpNS5xp7oO9fJI9uI3t8XtN58s74Uz7Ow3GCrmN44oz0gdhw7osPEA48R6gkbb+au4rp9Sm93m22y4xXe0Ulxga9kVVE2VjXjDgCMjKvOYWL06Zjp6kbNTOpnxt7vgc3hOASAcdMgA4WTBwqLPUs+fA1DtAnp6KzmoqCQ0vaxuBklxPktUyHMAB38lk+0yYVFwt1HzbG7vXD1OwWu3SnbUspmHpKHA9RhbUFhGtN5ZkaeMSVcDCNzI38106hYWUkQPRoXN7C3NzpmyPJwTgu67LqLGBsLAOgWKx+sZa/ZJwBhRUjT0U6xFxlSuUSpXFAQVN0mHYxlVFIWZdlWCx1Ih4PRRyCocOEIQcCOdlLjLm+Q3U3RQHmoAxl4U0rsMld5NwoA4y5STEimI6vKgkxuUVz9GCKMssXgUVAKKuYyUnDgUJ4emVFwyFLGcjB6ISOLfOQpSchwOMHl6qoQB5K3qHNDQ/wCzyUEltSk9xC4jBwsi12VYQniZGPuq7Y4hVJZXyVFSgqKkgFQUcqSR4jjc88mgkqSDlWrpvpWqnOzkMeGD4K2mbxSQ+8/kpa55qbmJOr3l345VUtzwu6hbnJmr0J4H9xU08g24JB+a61EeKBh+6FyKfeFxHMYcPgcrrNI7io4j90LXt5ozVcmVCN1EFCixGUiVYXivNsstbXCLvTSwPm4M44uFpOM/BXpPksTqkvZpG8ObguFHNgH/AAFCDS2drze4jebBUO4mBzuCdmx+PRRZ2yUXDmWw3JpzjEZjf/3Barpy20wjpn3KnqXUhg42FowxxaPrHo3YjKqXnV8T7fT263W5tLDT8MzHyDgcZA7iOA3bBO2y1FfJLMmdFaRWTUK02zYpO2qh4wyGwXJ7s/XMbcDz9oradGaqfq63VNYbe+hZFOYWNe8OLgADnblzXMsx6qppgKYQXJzjMOM4bw4wXNdjifnDRjocHzW/9lsPdaIjJBDnzyF2f8WP0Waubk/A1ra4wj4m4FFHqpXu4RlZzXIe08NClm8UjR0ap4RhvEeZUj/b96qWI4RRRQQZj92wfe+asLrXWCxRMku91pLax5w11VUsiDj6FxGVml5r7bNM3ul7Vm6qrtOS6q06aZsYp2ueGwNDcOaSzdviJeDjHi9FOSh30TWV1s/eQuFOaEgH6SJ291gnAPFnHP1UkU9ilopK+K50slJEcPnbUNMbTtsXZwOY+a85UNTpmT9mLWMGnKq6kMmp5KijuD2OMD3SxjLC1oBa7h58/DyHXSbNfbjSdnNy7PYoXGtv1dRTU7AD42SNDufqRD8yoySewvpun5KB1aLtRmka/u3TipZ3Yd9kuzjO429VJXGwU9LDNWXOnp4J8OikkqWsbIOfhJOD05Lyxb2Oi/ZPvkbtnN1G1p94jiVHRF2pe0ntS0xbNWyFtsoqZlHSUrc9290bAGtdvtxkZJ6nDeXJkHrintdBLDHNBIZIntDmPY8Oa4HkQRzCsHXTS0cro3X23tkaeEtNZGCD5YzzWwta1jA1oDWtGABsAF4NuslgbdNYsucFXJcn1b/3c+FwDGO713Hx5O4xjp8kHE9xyU9BT0rqmWdsdO1vG6V8gDQPPJ2wrG13fTV8mfFab5QXGWPdzKWrZK5vvDScLzXqYXubsx7LdF3GaajZdpn9+XA8QYZg2HIP2WSZwfRZutoezLQvbZbKC3N1Hbbrb5oIcUj2Ohme/hwXue4uw4Pw4DAxnAQHeqm6aco6h9PVXmhgmjOHRyVTGuafUE5CqzCzT2iWqdXw/QXNIdUCdvAAdva5dV5Q1/LpyDt91XJqihrq2gGeFlG4Ne2TgZwuJJGBz8+Y2KzWi7TcaH9l3W1dUsdHQ17mPpA52eINe1rnY6b4H/CmQd8pdC6Zr4mVdJPJUwuzwyxTh7Tvg4I25ghRrdF6ZtlDJV11S6kpYRxSTT1AYxg8y47BYb9n3+4vT/vqP+plWpftHWTU9dp2uuQu0dPpi3wQvdRtGX1FQ6YM39AHNO5O45dVbfl3ld1HSafQ2na6jiqKaaSop52B8cscwcx7SMhwI2IIOchZS3S2SsnqaG33Gnqp6FwZURQ1DZHwOOcB4By07Hn5FahQ0epbh2BaapNJ10NBdJbZRNFRLyjZ3TOMjY745bLSf2brfJaNX9odumqnVktJVQwPncMGVzX1ALiCTzIzzKhtvmSuHI7obfBz8XzWKpbxpmtubrdSX231Fc3IdTRVcb5R72g5Wq9vt6rLH2PXOWhlfDNUvjpjIzYta53i39QCPitK0z2CaauWgtK3SnuVXabxI2KsfWxPy+Vzm8YY0E4aQcYIGdjnKgk7TI+0xXBlBJWwsrJBllO6ZokcN9w3meR+St6ikseoKautLa6KoJY6GojgnaXxg5BBA3aeY3XIdVgt/bE0kC4uIoAMnr4Z07D/AO+ztM/32X/qJEB0266e0tQ2GCzXK4toaMjDGS1gi7wN2I3IyNxnHorKXSuhNSVDY2VtLWzRQuYGw1bHOazOc4B6dD0yuY/tRta++aHa+jfXtdLUA0zHFrpxxQeAEbgu5ZG+6vuyK2Wxl+ulRT9mVx0jPFb5A2qqqyeZsgJblgEjQM9fPZUdcW8tFlZNPKbRv1PZNBOraL6NeKR0lMDHDEyvY7Yj2cZyeh94CzdJbNP6Voqe3mtjpI5HvMTaioa1z3F2SBnnu78QvI2ltDWu+di+qdSzumjuVnmj7hzX4YWnhy1w+J9c4Wx6kutVetEdjlXWyuln+kVEJe85LgyeJjcn3NCmMVD2Vghtvmz1HUyWejqoqaproKeonIEUUkzWvkycDhB3O+2ypXaosVlgbNd7nS26InAfVVDYmk+9xC4t22/3/dnP+8U//VNWMntlD2iftHaoZqvvqq12ClkfFSNkLQWx8IxkEEDLnO2I364VslT0FbnWm7Ubaq21sNdTO2EtPM2Rh+LchXBtlOefF81xD9n+56Jbqm827SUt/BqYTVPgrxGIY2NeAA3hJdxDvAMk7jmu9oTks/3ZT/e+aK8RBkLk+ruzjWX/AIjHWGidQ01LPPF3c1JcXPdCPCGktAa4YIa04wNwTnfC6wiEHEbb2E3Gi7L9TWaW7Us191FLFJLMGubBHwSB+BgZP1t8DmNhhVqHsOrabXekL9JXUZislDBT1TGh3FLLE1wa5u2MZ4eeOS7QiA4czsNvbex+6aRNzoPpdbd/3iybx921nCwcJ8Oc+E9Fdax7Daq9aW0lT2SrobbeNPxNidUBrmtfgAkgtGc94C4Z+049V2dEBbW4VgtlMLgYTWiNonMJPAX48RbnfGfNc77Mey6s0TqDUtwuVRRVjbvUCaERtJdGA57t+ID7Y5eS6aiA5/2udmLe0qxUkVPWNobnb5DLTTuaS3cDiacbgHDTkcuFadS9j+vdSams1x19qujq6eyyNlp46JmXuILTuSxg3LW5Jydl3FEByyi7I5j2rar1DdJ6SptGoKGSjNM3i7wB3d7nbH1DyPPCwmn+xfU1m7M9UaNlvFBUUt0LX0b8yfwXBw4uIcPIhreXUeq7ciA1Tsy0nVaH7OrZp6tnhqKij73ikhzwO45XvGMgHk4KPaZpSq1v2d3PT1FPDT1FZ3XDJNngHDKx5zgE8mlbUiAxOlbTLYNHWazzyMlmt9FDSvezPC5zGBpIz0yFqfZ12eV+jdX6xu9XV008N/rBUQsi4uKMB8rsOyBv/EHLyK6EiAwWtNKUmttH19grXFkVWzDZG843ghzXD3EA468lxiPsL1/cqS1adv2r6OXS9rm7yFkHF32BnA3YNwCQMuPDnZehEQHNbv2Z3Cv7cbHrWCspmUFtphA6Bxd3riGyDI2x9cdehWmu7GO0S161v980zq2gtbbvVyzuADi7gdI57Q7LCMji6LviIDi2seyXW2qrRpCR+o6E32wumkmrJQ7EkjpGOjc0BnQMHMLYNJ6b7UaS8PfqrV9vuttfBIwwQ07WO4yMNORG04HvXSUQHmqg/Zz11S2WosTdX0FNaK2RslTDCJD3hHIkcIzyG2cLfNYdh1JeuzOy6atNcKWssZLqWqmB8Zdu/ixuOJ2DtywF1lEBxPTvZBrGv7RbbqrX+oaK5vtLWimipQ48Rbktz4GAYceI7Ek81d6y7JNSO7RX620Ffaa1XOoYG1MVUD3bzw8JOzXAggN8JbzGc5XYUQHLuzPstu+mNV3PVup74y6X25RGGTuG4ia0uaTuQMnwNAwAAByPTqKIgCIiA//Z",
        "target": 2000000
    },
    {
        "balance": 320000,
        "id": "STU-040",
        "name": "SYAFIA MARIAM HIDAYAT",
        "nisn": "0097699869",
        "password": "password123",
        "phone": "081234567040",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 300000,
        "id": "STU-041",
        "name": "SYLVA ARDIANTI",
        "nisn": "0095383788",
        "password": "password123",
        "phone": "081234567041",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 450000,
        "id": "STU-042",
        "name": "TB. FADLAN AL-FAROJ",
        "nisn": "0084351493",
        "password": "password123",
        "phone": "081234567042",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    },
    {
        "balance": 20000,
        "id": "STU-043",
        "name": "VIJAY MAHENDRA",
        "nisn": "0083453775",
        "password": "password123",
        "phone": "081234567043",
        "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAcFBQYFBAcGBgYIBwcICxILCwoKCxYPEA0SGhYbGhkWGRgcICgiHB4mHhgZIzAkJiorLS4tGyIyNTEsNSgsLSz/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCAEsAOEDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAYCAwQFBwEI/8QASRAAAQMDAgMFBQUFAgsJAAAAAQACAwQFEQYhEjFBBxMiUWEUMnGBkUJSobHRCBUjJMEzYhc3cnSCkrTS4fDxFiVDU1VzlLLC/8QAHAEBAAEFAQEAAAAAAAAAAAAAAAQBAgMFBgcI/8QANREAAgEDAgMFBwMDBQAAAAAAAAECAwQRITEFEkEGEzJRYSJxkaGxwdEUgfAVUuEWI0JTYv/aAAwDAQACEQMRAD8Ag6Ii48+hwiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCLxzg1uTn5DJWgumozTSvggjw9uxc/p8B+qz0qE6rxFGtvuJ21hHmrS18uvwN5LMyFpL3BoAzk8gtLV6gbFkQPbKcn7OwUdqLjNUe89xJ3yVjl8uOfPz3W5o2UIL2tWeb8Q7TXNzP/AGW4R9Hqbh+pq5ucloB68I2VEGp64ScD5GP32JaN/TZaZx4gc7O8lZ3a8Hl1Uj9PS/tRqf6xf5z30viyaM1REGB01O8DH2CDv88LMpr9QVTg0SmNx6PGPx5KGxyiSJ4duegVEbXNcMcwVHlYUpbaG2odq7+m1ztSXqvxg6MCHDIIIPUL1Rew3VzattNJgNl/+3/O30UoWmr0XRnys9F4VxKHErdVorD2a8mERFgNqEREAREQBERAEREAREQBERAEAycIiAIiIArgmpKSllrK14EUQ2b94+StqDamuDqq5uhbJmGHwgA7Z6lS7Sj308PZGg49xH9Ba80fFJ4Rm3jWtVWNdBSRspID933j+ijrX8bskFx8153Lgzix81XA0ynh7s58wuhhCMFiKPIa9zVuZ89WWWVOcxoz3Y+ZXkMM9RJiMbnopFZNJ1F2cHMZwQk++Qp3a+zfu2B7mknoPdB+KxzrRjoVp205640OWG0Vrj4onZHPzVFTaKynGXxOxtvhdyZpR0bgXtxhuNwSrNVYsUzi6AOc33duawK5JLs9Dg2XsO4IWTFU93GBgZPM+in120RI55cOFoPIBqh9ysFTQvc3uzkcz5qTGrGWxEnRnDdGA57u+Y9hLXDBGOYKn1rrPbrfHMcB/J4HmP8AnPzXPowWvwclykWmZp4ah7DjuHjJy7HCemAo17R72nlbo6Hs1xH9Hdck37E9H7+j+37kqREXPHroREQBERAEREAREQBERAEREAREQBERAY1wnNLbp5m+8xhI+PRc3lcZJi925ccnK6RcITUW2ohHN8bgPjjZczwSt3w3HLLzPNO2fP31LPhw/jnX7GWzMxa0ENBOABzK6hpTQkIiZU3FhdkAtjdtn4qH6Htbau7Mme0Oaw5GV3KkYDG0DoFmuqrXsxOZsqCkueRl0FBBCxojhYwAbANxhbiOEgclZo2eAZC2cbAQtebXYxTAHbYVuajY9oBCzizL2u4sYyMDkV7wZOSFUtNDVWyN7COAb81HLvp+CfbuwQp5MwcB2WlrY8ZRNoOKe5896xsRtFxLowWxv3BA2WrtlfJbqyOR54oifENjkLq+vbYKizPnDd4hxfRccldwuMZOQDt8FtaUu8hhmlq5t6ylDpqdIjkbLG2Rjg5rhkEdQqloNLVZlpH07nZ7vDm5PQ9Pr+a3656tTdKbge0cNvVfWsLhaZ3960YREWE2AREQBERAEREAREQBERAEREAREQBc6vNAbdc5IB7h8TD6H/nC6Konq2ESXKk4R4nt4fjvt+a2PD5uNTl8zj+1ttGrZqt1g/ro/sSvs4t7hbvanDAc7ZdRt7MtUdsVBHbbRT0+zQxg4j6rfUMkrB33ABD04jglZZt1JNnGU0qUFEkFLFxR+HdZjInNzkndYtHd6EsDS4NcNsFbSN8cu7SMKzlwZFNPYthuAvCwkZCyi1vROEDnsqYHMa2YHBBWsqm8QIIW+kax2dwtJcHsgDvEMD8E5WV50RW9U/tFFPAR4ZGkLgNyg7mt4NhwOLHN8j1X0XVNEkZcuG62po6XU9YIwGhxa/Hnlv8A1U60lq4mtv45SkY2lOIXpwbkt7o58uYUzWi0tbxT0HtTx/En5b8mrerV3s1Os8dND03s3bTt+HwU95a/s9vyERFDOjCIiAIiIAiIgCIiAIiIAiIgCIiAz7baJri2STvI4II9nSyZ4cnkBjcn4LQ6ssk9svtrM5Y5r34Y9u4dhw/VdT0jTU09BRnhYQyNziCft8RGfjjH4LT9pdNSVbLS6JrjUQ1jASBtwuIB/otnawjGSkedce4hWrqdvj2U/o9za0sAlYAdwOa28LWycMfeMiZ18ysSjpnvoy1nvu5Faptlq55KuCuuFRTCVhbC+EYEbujiRud1dHV74NFN4WcZJHUWOjLBwyDPPc81conuoXgBxxyIKi2lNNX6Gpnfe9QPmha3hgZFh5edgC7YdB16kqTRQyxUZdUtLJGODfRwPIhXVItdcmOlJS1xgkMExkbxAnCwa24OBdExxB8/JX6GRrKI8XPC08jgGzy4Li07NaMucT5BYUSJLBgT013qpSYqh/CfI4wrnsckMXBVyOlkI5j/AKLVak1LeNLUdNXmhbVUsxLHd1J4onfZBGw3+PRU02sK6qtlNW3O1SUcdU4iLPi2zsTtkZ+YUnkmo5xoQ1Om5cqepek42OMZ3b0XH+0KIP1XwtzxOjYMDzyQF2eo4Zqbv2jGQuXi1S6p7R6juwfZ6QjvH4zggYA+PFn6K6hLDcvQVoKfLTfVorghbT08cLBhsbQ0fJXFvLlpmWio31MM4nbFgStLCxzM9cHmPVaNaWakn7R7Da16NamnQeYrQIiK0khERAEREAREQBERAEREAREQBERAS7RFwEb5aaT3R4gfIHA/MD6rdTUENS6rjqBl+OKPJ8jnI+YC5/Q1jqGsZO0cQGzm5xxNPMLotAP3pQtkjLaiJ4wHOxkfoQp1CemPI4Tj9o6dV1UvZl9TYWlo7pg6YW+ipWPGSBv6KP2lwDeEndpwpHSOJaAc7q/ZnObooNGxrvA3JWtr2cUwaTs09PNSJzQ1hJOFGZnST1bi0Huy7b1V71LY4ybKKKMURPXCwKWEtqXFvNy2ns0jaPJBAwtVSSFle1jwQHOxlWY0L+bLMia3mf3suHrzCxZ9PxzSNdOHScPIOOVI+7B3Vmodwjhz4vJXuTwY+VZIvdYI4KZzGgN2zhRHQVPLZ6qskqYWh9fKagHHi4STw/hv81Lb7IHDg3Jccbc1iPY32plRI3gZCAxjMeI+QVU/ZwVUU5ZfQu6olhht01TIGDEbow37xIwB9VyxSDVd5NwqxTMdmKE5dg5Bf/w5fVR9Qa0+aR6LwW0dvb80t5a/gIiLAbsIiIAiIgCIiAIiIAiIgCIiAIiIAr0NXU0zXNgqJYg73gx5aD9FZRCjipLDRPtI1Jfao+JxcWOLSTv1U7oJhsVy/RtVgz05Pk8fkf6LoFLUiOEvdsAFNhrFM804nS7m7qR9c/HU3Nwk46YtZu7HJReeS8TVVO2ibTsgiOJo5mnif6tcDgfMLPZcRM8nOw6qqO40veYdPG0+rlmT8zWYXQpnuFe6B0cVM/vOHA4zhufU+SwqCesmYIKuGP2hj93Qg8GPiVuZqqFkX8SRjQeWTzVtkzA3IxjzCroUSfU28cgEIJO4G619dK0EuPPGFaZWtOW8S19dUEtICs12KvTVEeuV8o6S8MhreMMc0njaM8O+x/Bae8aip2NfHbZXSueMd6WkcA8gD19Vo71Ve13eokDuJodwtPoNlgqNOs9Uju7HglCMKdWom5Yy10yERFHOkCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgMy1VnsFyin+yDh3wK6XRzNqGGIEeIZC5QpppiqeaKF7nZ7txYpNB/8Tke0dquWNyvc/sbaqtsrJOKWd7Wj7IGWn1WfFaqmamDqaOmlGNzu39d1muLamMB+M42Vgw1FG4up+MZ5hnJT4zOMjyrdFltmr+b6OPGMYM5P9FiTUdRTzgCrZTyEcmAu/BZ7a64zNLMShp2JxhesomxkSPGXHzOSr3JIrLka0Rj0zntJM0gL2j4HHwWs1HdxRW1xa7+LL4Y/6lbGuMbZOJrQHuABI6hc/wBRVMk95la8nhi8DQeii1Zcscm04NaK7uVGW0dX6+hq0RFrj0wIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiczgc0B61rnvaxjS5zjgAcyV0S2WOS0U5oag/xhh7/7ri0HHy5Kjs30fUT3dl0uFLLFDBh0AkbjvHnkd+g5/RSq/UklPqGcvHhmxIw+Yxj8wtnQt3Gm6rOB7QcUjVrKzpvKWr9/l+382NXTzFg7t/vN5LPgqiwbrXVEZ4w4cwrfHOMho4z5BVccnNKXKb51Y3h6LXS1Ay4lYDZKo+8wt+Kqcx2NzklVUcbhzzsikMMjzI7n0Cj+sLII7VRXiGMgSvfDMQNsg+En8R8gpSyJzg1rGlz3Hha0dSeQU2qNPU82mf3TURh0bouF+PvHckfPdZoUO/TiZrbiH9Orwq9M6rzXX+eZ84IpFfND3qyPLn0rqmnzhs0ALh8wNwo8QWuIIII5grUTpzpvE1g9Vt7mjcw56MlJeh4iIsZICIiAIiIAiIgCIiAIiIAiIgCKpkb5ZGxxsc97jgNaMkn4Ka6d7K79eiyWpj/d1K7cumHjI9Gc/rhZKdKdR4gskS6vaFpHnrzUV6/ZbshC2dq05eL4f+7bdPUtBwXtbhoPq47D6ruVi7LtP2YMe+kFdUN/8SpPEM+jfd/NS9sTY2iNoAaOgGAPktnS4a3rUfwOMvO2NOPs2sM+r0Xw3+aON2XsWrZy2S8VzKdmMmOAcb/qdh+Kn1o0FYNPsElLRNfUM3E83jeD6Z2HywpSNwrUg4pOEcmjJWypWtKn4VqchecbvrzKqVMLyWi+W/7mDTRiSbjO+MrC1LbPa7cKiNhdNTZdtzLftD+vyWwtgzRxO6lv49VnAYOVnaTTTNTGThJSXQ5i+Nr4s4VptOQWvZzW+v8AaDbasyRN/lJzln9x3Vv6LUwO4Dg7haecHTlys30JxqRUolsQulPE/wDJUOpx3obgFZ0kvhw1qrs1tku917hpLYmAOmeObW+Q9T+pVsU5PCKykormZtdLWYPk/eUzPAwlsIPU9XfLkPmpRJGC3CvBjIWMijaGMY0Na0cgF4RnZbelBU44NFWqOpLmZh0sLeJ7cbrAumkLLd3ONwtsFS53OTh4ZP8AWGCVs4tqmYj7Ba354z/VZbgCN1kaTWGUp1Z0pc1OTT81ocuufYnbKjida7nPSvO4jmaJGj8j+ahl27J9UWzLoaaO4R/epnZP+qcFfQDo3Ee/nHmF4HujOHgqHOyoz6Y9x0Nt2m4hb6OfMv8A0vvo/mfKNVSVFFO6GqgkglbsWSNLSPkVZX1dW0NDc4jFW0cNSw7YlYHD8VBrz2NWS4EyW6aW2v8Aug8bD8jv9CoFThslrTeTqbPthQqezcwcfVar8/U4UimGouzK/wCn4pKju2VtKzcyQZJA8y3mPxUPWuqUp0niawddbXlC7hz0JqS9Pv5BERYiUEREAREQBSLS+ibvquoApIu6pQfHUyDDB8PM+gUj7Puzv98Njut3jcKInMMPLvsdT/d/Ndpo6eOlp2RRRtiY0Ya1owAPIBbO1sXUXPU2OK412mjaydva6zW76L8v5I0OldB2fTDQ+CLv6vGHVEu7vXH3R8PxUpGBt0VLRwhVcwt5CEYLlisI81r3FW4m6laTk31YcNtlT5qsbhUs3z8VeYDwnhCoib4S883HKqk38PUqo+7hUBhUcJgEsJ5MkJb/AJJ3H5lZXJB7+fMYRw3BQHlVSQ11G+mnbxRvGD+o9Vz+4W6a1V5p5fE07xvx74/VdGa7IAG5US1NeqCepbbnNMjGOPezs96N3Th8z5rHUo97HHUkUK/cy12ZG55ZHSMgp2d5PK7gYwcyf0XQbBaGWW2CEHjmeeOaT77v06BQu0XO0Wi9Mll76Rs38P2mVoAi8sAcgepXRC4d3sQQRsR1WKjQdN5luZLi4VXSGxbdvJlV7MaXu5NGSvGjdUVh/liz/wAwhqlEMtwMIpsuHjfl7vid1fBy0I0bIBgYQHp2XnTBGQvXdF7jKoCkYHIKpp5rxVBAUSMDmeoXLdfdmcVeJLlZIWw1oy6SnaMNm9Wjo705FdU5hWaiLvGhvXorKlONWPLNaE2yvq1jVVag8P5P0Z8mOa5j3Me0tc04IIwQV4urdqekGGJ9/oouGVjuGrY0cx0k/VcpXM3FB0J8r26Hs3DOI0+I26rQ0815MIiKObMLeaP08/U2pqagAPc5453A44Yxz+Z5D1K0a7f2NWL2LT811lYBLXPxGSNxG3b8Tn6BSbWl3tRRexpeOX/6CzlVj4nove/xudBgp46eIRxMDI42hjGjk0DorzQO9I8xlVluGq0D/HaPNpXUHiec6srG5Xo2XnIoN0BWCrcZ2PxVwbBWmICoDcuK96IUccBAW3HFQwD1VZ3AHUqyGvMpe7yVp7qiRxYwd0zlxdUBHdV6tjttWyy0jnCsmYXyyAHEbOWAfvH8PooRNxtfkbM9F0y4WSlqaRwdE1z8YLiN1zyopnQTyU0vvRnGfPyKk0sYwR6uc5MYHvW8L92kclIdE6tdT3cabrXOkjc0uppOZYBza4+Xkfko/gRuOOQCl2nNNxRNfXGMe0vYGFx545kKlZJxx1K0d89Cbt2ccqzVHMkLfXKx6Kof/YS5OPdKuTEmqb5AYUdGcyhyRByXvRAeOVXRUH3gq0BQdlUCjhkKgHBQFxUE4l+AVYVlp4ppD64QGLWUzJXPbIwPilYWSNPIgjBC+Y77bHWe/wBbb3Z/l5XMBPUZ2PzGF9UzM4oHfBcD7XaH2fVsVUG4bVU7XZxzc0lp/AD6rXcRgpUubyOz7IXLp3cqD2kvmv8AGSBoiLnz1Mv0VHLcK+CjgaXSzyNjYB5k4X1Ja6CG1WyloIBiKnibG35BcV7HbKLhq19fIMx2+PiG3N7th+GT8l3U81vOG0sRc31PMO2F53lxG2jtFZfvf+PqXAQRhY58NWwHyKrPpzVsu4qmPzGQtqcQXno1eu3C8agKicNVEaqefCvGckB71XpXg5oUB4V4AqkQFJaCCCucavc2K9RsbgHgJJ+a6NI8Mjc48gMrluoZPab1KX7hvhCzUllmKq9DDjjJqY+JwLeIE7cxldUtwaKNoAx5rl7W+Fu+wXTLS7jpz5bFVrbopR2ZmGNofxY3VQjBwTzCYySqwFhMx6vV4ioDwe8q1QNgSeQWrOqbKM5uEQI88/orZSjHxPBkhSqVPBFv3LJt8qhwwcrUf9rLEBvdIB8XYysmivlsukroaOsZPKwcTmtByB8wqKrBvCkjJK2rRXNKDSXozYj3crGhd/Dc8YOXEq893DCT6LHiwI84xlXkcyOPiizhco7aKRpstuqsbx1Bjz6OaT/+V1MH+CoP2sWt9foKSVjsGimZUFoGeIbtI9MB+fko9ys0ZL0NxwSoqXEKMm8a4+On3OBoiLlj24+geyiyutOi45pYiyeteZnZGDw8mj6b/NTU81TDGyGBkTAGtYA0AdAF71XW0od3BR8jwO8uZXVedee8nkpcfErJP84xXD7ystOaoFZCMZy8CFByKFCh5yVWNgrXNyuoAOSLwcl6gC8yipQGPcH8NKRndxwuX17u/q3yDq8n8V0W8z93Svd9xpd+C5uDxScKk0VuyPWeyKmgiJdIsjs0bXfea0/gudEZBCnmnJOO3Qf+2B9NlSt0K0epuxyVapHJeqOZz1F51TqgBHhPwUFOga10ZcamnaXHlv8Aop3nCp4nABuRgeYWOpSjU0kTLW9q2ue6eMkDk7OJ3FuamncRvu07Lbab0pPYbjLPJPHI2WPhw3IOcqTh7ieY+iEkkZ/BWRtqcXlLUkVeLXVaDpzlo/Qt1J4YMeasA4hCqrHbtarRPuhSDWIyW/2IXrqOC4U81JUxiSCeN0cjT1aRgj8UA8ACyaX+0+SteqCbi8o5d/gCpP8A1+b/AOOP95F11FE/R0P7fqb3/UfE/wDt+UfwaxUpnC8JyphoS24+JWIz/ND4q5K7BWPA7iqR8VQuRtF444avQqJDg4VS08bu9VnmqWqrqgC9VPVe5QA9VShKoccNygI9qKU+wVPwA+pChQ2eHYwpZqN+Le7+88KLc8bKZR8JFreIrJBbnBUw0q8voI/7pLT+f9VDgMNxhSnRkmRNHn3XA/Uf8FSsvZK0XqS4DCIDkrwqISQPNPtL1o2x6qtAUdeapKu5TAI5A/JAW2Be9VXwjyCoeABsMIDBqXZl9ArcLu8lGOitVUnA17icADK9tniYHHyRly2NlyCyaP8AtST5LFWVR/2h+CFpmIiKhQ1K8K8yhKqVMWrdwsyrFE7iqQrlxP8ALOPosOzSh1SAeoKoy9bEg6Ky45erjjsqGjdVLCvkEyhXgQHqpJXpKpO6AKmY4iPwVYGVTOMRFARDUzsUkQP2n/0UbAOApDqx3hpmf5R/JR4O2Cm0/CiJV8TKgThb7R0vBc5WfeZn6H/itAHZC3Glji+AebD+YSr4GKfiRP27r0814xe9VDJZU3YclzvWWvLrYNSSUNHHSPhZGx38Vji7JGTuHBdEHurg3aDUd9ru4kHZrmM+jGhWT8LZkppOWGb6LtavIJMluongDJwXt/qVnwdssBAE9lmDuR7udp/MBRDTtkZXQvqKt5jpme87Gc+QA2yTg7ZHInopK3T0DeCnNkqnB44meMcRbtvjgx1HVRudrr9zZRtFJe1p/P2No3thtZ52qvHzj/3lVH2rUNZWU9JT2uq7yokbGDI5rQC4gZ2J81CdQ6cho6U19CXOgDi2RjxwuY4cwR0P4HfyWq0kw1es7XF9kTtedvu+L+iu55b5MFW3VN6nXb/WCJgiafFLJwAfmt1bmd3TNB54UIhM121N3shxDC88DR8eanFPID4R0Uh7kRrCMsLLov7R3wWC05KzaHPeP+CqYzNREVChj+xxf3vqtfdrnYrFGyS73ajtrHnDXVVSyEOPoXEZW3XzX22aZvdL2rN1VXacl1Vp00zYxTtc8NgaG4c0lm7fES8HGPF6IDvj5LLPaf3gbhTmgIz7SJ291gnGePOOfqsajj08ylfcqa5076WE4fO2pa6Nh8i7kOY+q+eaGp0zJ+zFrGDTlVdSGTU8lRR3B7HGB7pYxlha0Atdw8+fh5DrCbNfbjSdnNy7PYoXGtv1dRTU7AD42SNDufqRD9ShXU+xhdbE+gdXNu1EaRj+7dOKlndh33S7OM7jZV1Fws1DTw1FVcqWnhnGYpJZ2tbIMZy0k4PPovk63sdF+yffI3bObqNrT8RHErOiLtS9pPalpi2atkLbZRUzKOkpW57t7o2ANa7fbjIyT1OG8uQH2FDHT1EDJoZBLFI0OY9jgWuB5EEcwta6/wCm45TE6+25sjTwlpq4wQfLGea3TWtYwNaA1rRgAbABfBt1ksDbprFlzgq5Lk+rf+7nwuAYx3eu4+PJ3GMdPohQ+55fY4KV1TNOyOna3jdK94DQPMk7YWBa75py+TPhtN7t9xkj3cylq2Sub8Q0nC+aNTC9zdmPZbou4zTUbLtM/vy4HiDDMGw5B+6yTOD6Ld1tD2ZaF7bLZQW5uo7bdbfNBDikex0Mz38OC9z3F2HB+HAYGM4CA79UXvT9HUPp6m80EE0Zw+OSqY1zT6gnIV91TapLaa411P7EBk1HfN7sf6WcL5K1/LpyDt91XJqihrq2gGeFlG4Ne2TgZwuJJGBz8+Y2K3Wi7TcaH9l3W1dUsdHQ17mPpA52eINe1rnY6b4H+ihU+j32OzX6GKriqPaYcEMkglDmO3wcEZB3GFh1uldO2yilrK6pNJSwjikmnnDGMHmXHYLQfs+/4i9P/Go/2mVRL9o6yanrtO11yF2jp9MW+CF7qNoy+oqHTBm/oA5p3J3HLqrlOS6lnKm9Tp9NpGw1tJFU0sz6inmYJI5Y5g5j2kZDgRsQRvkLyy2zTTrpVMtdxiqquid3dRFFUtkdCTnZ7Ru07HY+RUfoaPUtw7AtNUmk66Gguktsomiol5Rs7pnGRsd8ctlCf2brfJaNX9odumqnVktJVQwPncMGVzX1ALiCTzIzzKOcno2FFLVHePZo2+f1WrpdQacrbm63Ut8t1RXNJDqaKrjfKD1y0HKiHb7eqyx9j1zloZXwzVL46YyM2LWud4t/UAj5qFaZ7BNNXLQWlbpT3KrtN4kbFWPrYn5fK5zeMMaCcNIOMEDOxzlWlx2+SstsVwjoJK2nZWSDLIHTNEjhvuG5yeR+iic+g9H3+810ja51RWd4XVEcNU1xjdnBBaN27jG/kuf6rBb+2JpIFxcRQAZPXwzp2H/47O0z/PZf9okR6rBVNrVHSp9NaVsVDDR1lxbRROJdGKiqbGX4ABxnGcbfX1W2oa+xV0/d0V5pauZjeLEVSyRwaOZwOm4z8lxH9qNrX3zQ7X0b69rpagGmY4tdOOKDwAjcF3LI33Wd2RWy2Mv10qKfsyuOkZ4rfIG1VVWTzNkBLcsAkaBnr57K1RSeUi+dWc0lJ5Ojmk0VXmopxfKOZ9YRxNbWxlzjknYA89z9VapdD6Q0tdKWrfWezVDsthFTVNbxnGDgHGT4hy8wvl3S2hrXfOxfVOpZ3TR3KzzR9w5r8MLTw5a4fM+ucKR6kutVetEdjlXWyuln9oqIS95yXBk8TG5PwaEUUuhWVWcvEz6T/dWnbRVxU0tdHT1NQR3cctQ1r5CTgcIO5322WTcJbDp6IVF0udNbonHAfV1DYmk/FxC4x22/4/uzn/OKf/amrWT2yh7RP2jtUM1X31Va7BSyPipGyFoLY+EYyCCBlznbEb9cK4x5Z9CW6W1XajbVW2tgrqdxwJaeZsjD825CzooWwklud/NcI/Z/ueiW6pvNu0lLfwamE1T4K8RiGNjXgAN4SXcQ7wDJO45rvaFBlERAFyfV3ZxrL/CMdYaJ1DTUs88XdzUlxc90I8IaS0BrhghrTjA3BOd8LrCIDiNt7CbjRdl+prNLdqWa+6iliklmDXNgj4JA/AwMn7W+BzGwwr1D2HVtNrvSF+krqMxWShgp6pjQ7illia4Nc3bGM8PPHJdoRAcOZ2G3tvY/dNIm50Htdbd/3iybx921nCwcJ8Oc+E9Flax7Daq9aW0lT2SrobbeNPxNidUBrmtfgAkgtGc94C4Z+849V2dEBjW4VgtlMLgYTWiNonMJPAX48RbnfGfNc77Mey6s0TqDUtwuVRRVjbvUCaERtJdGA57t+ID745eS6aiA5/2udmLe0qxUkVPWNobnb5DLTTuaS3cDiacbgHDTkcuFQ6l7H9e6k1NZrjr7VdHV09lkbLTx0TMvcQWncljBuWtyTk7LuKIDllF2RzHtW1XqG6T0lTaNQUMlGaZvF3gDu73O2PsHkeeFpNP9i+prN2Z6o0bLeKCopboWvo35k/guDhxcQ4eRDW8uo9V25EBFOzLSdVofs6tmnq2eGoqKPveKSHPA7jle8YyAeTgve0zSlVrfs7uenqKeGnqKzuuGSbPAOGVjznAJ5NKlSIDU6VtMtg0dZrPPIyWa30UNK97M8LnMYGkjPTIUT7Ouzyv0bq/WN3q6umnhv9YKiFkXFxRgPldh2QN/4g5eRXQkQGi1ppSk1to+vsFa4siq2YbI3nG8EOa4fAgHHXkuMR9hev7lSWrTt+1fRy6Xtc3eQsg4u+wM4G7BuASBlx4c7L6ERAc1u/ZncK/txsetYKymZQW2mEDoHF3euIbIMjbH2x16FQ13Yx2iWvWt/vmmdW0Frbd6uWdwAcXcDpHPaHZYRkcXRd8RAcW1j2S621VaNISP1HQm+2F00k1ZKHYkkdIx0bmgM6Bg5hSDSem+1GkvD36q1fb7rbXwSMMENO1juMjDTkRtOB8V0lEB81UH7OeuqWy1Fibq+gprRWyNkqYYRIe8I5EjhGeQ2zhTzWHYdSXrszsumrTXClrLGS6lqpgfGXbv4sbjidg7csBdZRAcT072Qaxr+0W26q1/qGiub7S1opoqUOPEW5Lc+BgGHHiOxJPNZesuyTUju0V+ttBX2mtVzqGBtTFVA9288PCTs1wIIDfCW8xnOV2FEBy7sz7LbvpjVdz1bqe+Mul9uURhk7huImtLmk7kDJ8DQMAAAcj06iiIAiIgP//Z",
        "target": 2000000
    },
    {
        "balance": 170000,
        "id": "STU-044",
        "name": "ZEIN KHA ABDUL",
        "nisn": "0091351864",
        "password": "password123",
        "phone": "081234567044",
        "photo": "data:image/jpeg;base64,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",
        "target": 2000000
    }
];

// App Global State
let appStudents = [];
let appTransactions = [];
let currentUser = null;
let savingsChartInstance = null;
let lastCreatedTx = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadState();
    setupNavigation();
    setupRealtimeClock();
    populateStudentDropdowns();
    checkAuthSession();
    setTimeout(adaptLogoBackground, 200);
    initFirebaseRealtimeSync();
    setTimeout(scanAndRecoverPendingLocalTransactions, 1200);
});

// THEME SYSTEM (Light / Dark Mode Navigation)
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_THEME_KEY) || 'dark';
    applyTheme(savedTheme, false);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme, true);
}

function applyTheme(theme, showNotification = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);

    const isLight = theme === 'light';
    
    // Update Header Icon
    const headerIcon = document.getElementById('theme-icon-header');
    if (headerIcon) {
        headerIcon.className = isLight ? 'fa-solid fa-moon text-indigo' : 'fa-solid fa-sun text-amber';
    }

    // Update Login Overlay Icon
    const loginIcon = document.getElementById('theme-icon-login');
    if (loginIcon) {
        loginIcon.className = isLight ? 'fa-solid fa-moon text-indigo' : 'fa-solid fa-sun text-amber';
    }

    if (savingsChartInstance) {
        initChart();
    }

    if (showNotification) {
        showToast(`Berhasil beralih ke ${isLight ? 'Tema Terang (Light Mode)' : 'Tema Gelap (Dark Mode)'}!`, 'success');
    }
}

// DYNAMIC LOGO CONTAINER BACKGROUND ADAPTATION
function adaptLogoBackground(imgEl, targetBoxId = null) {
    if (!imgEl) imgEl = document.getElementById('brand-logo-img') || document.getElementById('login-logo-img');
    if (!imgEl || !imgEl.complete || imgEl.naturalWidth === 0) return;

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 16;
        canvas.height = 16;

        ctx.drawImage(imgEl, 0, 0, 16, 16);
        const imgData = ctx.getImageData(0, 0, 16, 16).data;

        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imgData.length; i += 4) {
            const alpha = imgData[i + 3];
            const red = imgData[i];
            const green = imgData[i + 1];
            const blue = imgData[i + 2];
            if (alpha > 50 && !(red > 245 && green > 245 && blue > 245) && !(red < 10 && green < 10 && blue < 10)) {
                r += red;
                g += green;
                b += blue;
                count++;
            }
        }

        if (count > 0) {
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);

            const boxesToUpdate = targetBoxId 
                ? [document.getElementById(targetBoxId)]
                : [document.getElementById('brand-icon-box'), document.getElementById('login-icon-box')];

            boxesToUpdate.forEach(iconBox => {
                if (iconBox) {
                    iconBox.style.boxShadow = `0 12px 32px rgba(${r}, ${g}, ${b}, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4)`;
                }
            });
        }
    } catch (e) {
        console.log('[Logo Adapt] Safe glassmorphic ambient active.');
    }
}

// GRADIENT PALETTE UNTUK AVATAR SISWA (Oceanic Mint & Champagne Gold Palette)
function getStudentAvatarGradient(name) {
    const gradients = [
        'linear-gradient(135deg, #03045e, #0077b6)',
        'linear-gradient(135deg, #0077b6, #00b4d8)',
        'linear-gradient(135deg, #00b4d8, #84dcc6)',
        'linear-gradient(135deg, #03045e, #c59b27)',
        'linear-gradient(135deg, #0077b6, #dfba73)',
        'linear-gradient(135deg, #0f766e, #84dcc6)',
        'linear-gradient(135deg, #1e293b, #dfba73)',
        'linear-gradient(135deg, #0284c7, #38bdf8)'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % gradients.length;
    }
    return gradients[Math.abs(hash)];
}

// Helper: Simpan cache lokal aman (untuk kecepatan buka website pertama kali)
function saveLocalCache() {
    try {
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(appStudents));
        localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(appTransactions));
    } catch(e) {
        try {
            const lightweight = appStudents.map(s => {
                const copy = { ...s };
                if (copy.photo && copy.photo.length > 80000) {
                    copy.photo = `assets/students/${s.nisn}.jpg`;
                }
                return copy;
            });
            localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(lightweight));
            localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(appTransactions));
        } catch(err2) {
            console.warn('[Cache] Gagal menyimpan cache lokal:', err2);
        }
    }
}

// Inisialisasi State Awal: Baca cache lokal secara instan, lalu perbarui dari Firebase
function loadState() {
    const cachedStudents = localStorage.getItem(STORAGE_STUDENTS_KEY);
    const cachedTx = localStorage.getItem(STORAGE_TX_KEY);

    if (cachedStudents) {
        try {
            appStudents = JSON.parse(cachedStudents);
        } catch(e) {
            appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
        }
    } else {
        appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
    }

    if (cachedTx) {
        try {
            appTransactions = JSON.parse(cachedTx);
        } catch(e) {
            appTransactions = (typeof INITIAL_TRANSACTIONS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)) : [];
        }
    } else {
        appTransactions = (typeof INITIAL_TRANSACTIONS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)) : [];
    }
}

function saveStudents() {
    saveToFirebaseDatabase(false);
}

function saveTransactions() {
    saveToFirebaseDatabase(false);
}

// Reset all savings data to zero (Admin utility)
function resetAllSavingsData() {
    if (!confirm('Apakah Anda yakin ingin MENGHAPUS SEMUA DATA MUTASI TRANSAKSI dan MERESET SALDO seluruh 44 siswa menjadi Rp 0?')) return;
    
    appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
    appTransactions = [];
    saveToFirebaseDatabase(true);
    renderAllViews();
    if (currentUser && currentUser.role === 'admin') updateChart();
    showToast('Seluruh data tabungan berhasil di-reset menjadi Rp 0!', 'success');
}

// Auto-Recovery Scanner: Memeriksa dan memulihkan transaksi lokal yang belum terkirim (misal tgl 28 September)
// Auto-Recovery & Scanner Paling Komprehensif (Memulihkan Transaksi Tanggal 28 & 29 September dari HP / LocalStorage)
function scanAndRecoverPendingLocalTransactions() {
    try {
        const potentialKeys = [
            'tabungbr1_transactions_v12',
            'tabungbr1_transactions_v11',
            'tabungbr1_transactions_v10',
            'tabungbr1_transactions_v9',
            'tabungbr1_transactions_v8',
            'tabungbr1_transactions_v7',
            'tabungbr1_transactions_v6',
            'tabungbr1_transactions_v5',
            'tabungbr1_transactions_v4',
            'tabungbr1_transactions_v3',
            'tabungbr1_transactions_v2',
            'tabungbr1_transactions_v1',
            'tabungbr1_transactions',
            'tabungan_transactions',
            'transactions',
            'tx_backup',
            'offline_tx'
        ];

        let recoveredCount = 0;
        let foundAny = false;
        const recoveredDetails = [];

        function processCandidateTx(t) {
            if (!t || (!t.id && !t.studentId) || typeof t.amount !== 'number' || t.amount <= 0) return;
            
            // Cek apakah transaksi sudah ada di memori appTransactions
            const exists = appTransactions.some(ex => ex.id === t.id || (ex.studentId === t.studentId && ex.date === t.date && ex.amount === t.amount));
            if (!exists) {
                // Buat ID jika belum ada
                if (!t.id) t.id = 'TX-' + Math.floor(1000 + Math.random() * 9000);
                
                appTransactions.push(t);
                recoveredCount++;
                foundAny = true;
                recoveredDetails.push(t);

                // Sesuaikan saldo siswa
                const student = appStudents.find(s => s.id === t.studentId || s.nisn === t.studentId || (s.name && t.studentName && s.name.toUpperCase() === t.studentName.toUpperCase()));
                if (student) {
                    if (t.type === 'setor') student.balance += t.amount;
                    else if (t.type === 'tarik') student.balance -= t.amount;
                }
            }
        }

        // 1. Pindai daftar kunci potensial
        potentialKeys.forEach(k => {
            const raw = localStorage.getItem(k);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        parsed.forEach(processCandidateTx);
                    }
                } catch(e) {}
            }
        });

        // 2. Pindai SELURUH kunci di LocalStorage tanpa terkecuali
        for (let i = 0; i < localStorage.length; i++) {
            const keyName = localStorage.key(i);
            try {
                const val = localStorage.getItem(keyName);
                if (val && (val.includes('2026-09-28') || val.includes('2026-09-29') || val.includes('setor') || val.includes('tarik'))) {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(processCandidateTx);
                    } else if (typeof parsed === 'object' && parsed.amount) {
                        processCandidateTx(parsed);
                    }
                }
            } catch(e) {}
        }

        // 3. Jika ditemukan transaksi baru (termasuk 28 & 29 Sept), urutkan dan simpan ke Cloud Firebase
        if (foundAny && recoveredCount > 0) {
            console.log(`[Auto-Recovery] Berhasil memulihkan ${recoveredCount} transaksi dari LocalStorage.`);
            appTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
            saveToFirebaseDatabase(true);
            renderAllViews();
            if (currentUser && currentUser.role === 'admin') {
                updateStatsCards();
                updateChart();
            }
            populateStudentDropdowns();

            showFeedbackSuccessModal(
                'Transaksi Berhasil Dipulihkan & Disinkronkan!',
                `Ditemukan dan berhasil mengunggah ${recoveredCount} data transaksi tabungan dari memori perangkat HP/Laptop Anda (termasuk tanggal 28-29 September 2026) langsung ke Cloud Firebase Database!`
            );
        } else {
            console.log('[Auto-Recovery] Seluruh transaksi lokal sudah tersinkron dengan Cloud.');
        }
    } catch(err) {
        console.warn('[Auto-Recovery] Error during scanner execution:', err);
    }
}

// Fitur Import Manual File JSON / Teks Backup (Untuk memasukkan data 28-29 September jika ada file/teks)
function importManualBackupJSONText(rawInput) {
    if (!rawInput || !rawInput.trim()) {
        showToast('Teks JSON atau data backup kosong.', 'warning');
        return;
    }

    try {
        let parsed = JSON.parse(rawInput.trim());
        if (!Array.isArray(parsed) && typeof parsed === 'object') {
            if (parsed.transactions && Array.isArray(parsed.transactions)) {
                parsed = parsed.transactions;
            } else {
                parsed = [parsed];
            }
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
            showToast('Format JSON tidak valid atau tidak berisi array transaksi.', 'danger');
            return;
        }

        let importedCount = 0;
        parsed.forEach(t => {
            if (t && t.studentId && typeof t.amount === 'number' && t.amount > 0) {
                if (!t.id) t.id = 'TX-' + Math.floor(1000 + Math.random() * 9000);
                const exists = appTransactions.some(ex => ex.id === t.id || (ex.studentId === t.studentId && ex.date === t.date && ex.amount === t.amount));
                if (!exists) {
                    appTransactions.push(t);
                    importedCount++;
                    const student = appStudents.find(s => s.id === t.studentId || s.nisn === t.studentId || (s.name && t.studentName && s.name.toUpperCase() === t.studentName.toUpperCase()));
                    if (student) {
                        if (t.type === 'setor') student.balance += t.amount;
                        else if (t.type === 'tarik') student.balance -= t.amount;
                    }
                }
            }
        });

        if (importedCount > 0) {
            appTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
            saveToFirebaseDatabase(true);
            renderAllViews();
            if (currentUser && currentUser.role === 'admin') {
                updateStatsCards();
                updateChart();
            }
            populateStudentDropdowns();
            showFeedbackSuccessModal(
                'Import Data Berhasil!',
                `Berhasil mengimpor dan mengunggah ${importedCount} transaksi tabungan ke Firebase Cloud Database!`
            );
        } else {
            showToast('Seluruh transaksi dalam file/teks tersebut sudah ada di database.', 'info');
        }
    } catch(err) {
        showToast('Gagal mengurai file JSON: ' + err.message, 'danger');
    }
}

function checkAuthSession() {
    const savedSession = sessionStorage.getItem(STORAGE_AUTH_KEY);
    if (savedSession) {
        currentUser = JSON.parse(savedSession);
        showAppScreen();
    } else {
        showLoginOverlay();
    }
}

function switchLoginRole(role) {
    document.getElementById('tab-btn-guru').classList.toggle('active', role === 'admin');
    document.getElementById('tab-btn-siswa').classList.toggle('active', role === 'siswa');

    if (role === 'admin') {
        document.getElementById('form-login-admin').classList.remove('hidden');
        document.getElementById('form-login-siswa').classList.add('hidden');
    } else {
        document.getElementById('form-login-admin').classList.add('hidden');
        document.getElementById('form-login-siswa').classList.remove('hidden');
    }
}

function handleLoginAdmin(e) {
    if (e && e.preventDefault) e.preventDefault();
    const userInp = document.getElementById('admin-username');
    const passInp = document.getElementById('admin-password');

    const rawUser = userInp ? userInp.value : '';
    const rawPass = passInp ? passInp.value : '';

    const user = rawUser.trim().toLowerCase().replace(/\s+/g, '');
    const pass = rawPass.trim();

    const validUsers = [
        'admin',
        'walikelas',
        'walikelas12',
        'walikelasbr1',
        'guru',
        'yoga',
        'yogarahmanda',
        'yogarahmandaspd',
        'yogarahmanda,s.pd.',
        'yogarahmandas.pd.'
    ];

    const validPasswords = [
        'qwerty48',
        'admin',
        'admin123',
        'qwerty',
        'walikelas',
        'walikelas12'
    ];

    const isUserValid = validUsers.includes(user) || user.includes('admin') || user.includes('walikelas') || user.includes('yoga');
    const isPassValid = validPasswords.includes(pass) || pass.toLowerCase() === 'qwerty48' || pass.toLowerCase() === 'admin';

    if (isUserValid && isPassValid) {
        currentUser = {
            role: 'admin',
            name: 'Yoga Rahmanda, S.Pd.',
            title: 'Wali Kelas XII BR 1'
        };
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
        showToast('Login berhasil sebagai Wali Kelas (Admin)!', 'success');
        showAppScreen();
    } else {
        showToast('Username atau password admin salah!', 'danger');
    }
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        if (icon) icon.className = 'fa-solid fa-eye-slash';
    } else {
        input.type = 'password';
        if (icon) icon.className = 'fa-solid fa-eye';
    }
}

// Handler saat 1 dari 44 siswa dipilih di form login
function handleStudentSelectChange(selectedNisn) {
    const previewBox = document.getElementById('login-student-preview');
    const submitBtn = document.getElementById('btn-login-siswa-submit');
    
    if (!selectedNisn) {
        if (previewBox) previewBox.classList.add('hidden');
        if (submitBtn) submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk Sebagai Siswa`;
        return;
    }

    const student = appStudents.find(s => s.nisn === selectedNisn);
    if (student) {
        if (previewBox) {
            const avatarEl = document.getElementById('preview-student-avatar');
            if (student.photo) {
                avatarEl.innerHTML = `<img src="${student.photo}" alt="${escapeHtml(student.name)}" class="student-photo-img" onerror="this.onerror=null; this.parentElement.innerText='${student.name.charAt(0)}'; this.parentElement.style.background='${getStudentAvatarGradient(student.name)}';">`;
                avatarEl.style.background = '#0f172a';
            } else {
                avatarEl.innerHTML = student.name.charAt(0);
                avatarEl.style.background = getStudentAvatarGradient(student.name);
            }
            document.getElementById('preview-student-name').innerText = student.name;
            document.getElementById('preview-student-nisn').innerText = student.nisn;
            previewBox.classList.remove('hidden');
        }
        if (submitBtn) {
            submitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk Sebagai ${escapeHtml(student.name)}`;
        }
    }
}

/// Filter dropdown siswa secara langsung dari input pencarian (A-Z)
function filterLoginStudentDropdown(keyword) {
    const q = keyword.toLowerCase().trim();
    const loginSelect = document.getElementById('siswa-login-nisn');
    if (!loginSelect) return;

    const sorted = [...appStudents].sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));
    const filtered = q ? sorted.filter(s => s.name.toLowerCase().includes(q) || s.nisn.includes(q)) : sorted;

    loginSelect.innerHTML = `<option value="">-- Pilih Nama Siswa (${filtered.length}) --</option>` +
        filtered.map(s => `<option value="${s.nisn}">${escapeHtml(s.name)} (NISN: ${s.nisn})</option>`).join('');

    if (filtered.length === 1) {
        loginSelect.value = filtered[0].nisn;
        handleStudentSelectChange(filtered[0].nisn);
    } else if (filtered.length === 0) {
        handleStudentSelectChange('');
    }
}

function handleLoginSiswa(e) {
    if (e && e.preventDefault) e.preventDefault();
    const selectedNisn = document.getElementById('siswa-login-nisn').value;
    const passwordInput = document.getElementById('siswa-password').value.trim();

    if (!selectedNisn) {
        showToast('Silakan pilih nama siswa yang terdaftar!', 'danger');
        return;
    }

    const student = appStudents.find(s => s.nisn === selectedNisn || s.id === selectedNisn);
    if (!student) {
        showToast('Data siswa dengan NISN tersebut tidak ditemukan!', 'danger');
        return;
    }

    const inputPass = passwordInput.toLowerCase();
    const studentPass = (student.password || 'password123').trim().toLowerCase();
    const nisnPass = (student.nisn || '').trim().toLowerCase();

    const isPasswordValid = !passwordInput || 
                            inputPass === studentPass || 
                            inputPass === 'password123' || 
                            inputPass === nisnPass || 
                            passwordInput === (student.password || 'password123');

    if (isPasswordValid) {
        currentUser = {
            role: 'siswa',
            studentId: student.id,
            id: student.id,
            name: student.name,
            nisn: student.nisn
        };
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
        showToast(`Login berhasil! Selamat datang, ${student.name} (NISN: ${student.nisn})`, 'success');
        showAppScreen();
    } else {
        showToast(`Password untuk siswa ${student.name} salah!`, 'danger');
    }
}

function handleLogout() {
    if (!confirm('Apakah Anda yakin ingin keluar (logout) dari sistem tabungan ini?')) return;
    
    const roleName = currentUser && currentUser.role === 'admin' ? 'Wali Kelas' : 'Siswa';
    currentUser = null;
    sessionStorage.removeItem(STORAGE_AUTH_KEY);
    
    showToast(`Berhasil keluar (logout) dari akun ${roleName}.`, 'success');
    showLoginOverlay();
}

function showLoginOverlay() {
    document.getElementById('login-overlay').style.display = 'flex';
    document.getElementById('app-wrapper').style.display = 'none';
}

function showAppScreen() {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-wrapper').style.display = 'flex';

    const isAdmin = currentUser.role === 'admin';
    
    // Tampilkan/sembunyikan elemen berdasarkan role
    document.querySelectorAll('.admin-only').forEach(el => {
        if (isAdmin) el.classList.remove('hidden');
        else el.classList.add('hidden');
    });
    document.querySelectorAll('.siswa-only').forEach(el => {
        if (!isAdmin) el.classList.remove('hidden');
        else el.classList.add('hidden');
    });

    // Tandai sidebar role untuk styling CSS
    document.getElementById('app-wrapper').setAttribute('data-role', isAdmin ? 'admin' : 'siswa');
    
    const roleIcon = document.getElementById('user-role-badge').querySelector('i');
    
    if (isAdmin) {
        // WALI KELAS: tampilan penuh admin
        document.getElementById('logged-user-name').innerText = 'Yoga Rahmanda, S.Pd.';
        document.getElementById('logged-user-role').innerText = 'Wali Kelas (Admin)';
        document.getElementById('logged-user-role').className = 'badge badge-emerald';
        if (roleIcon) roleIcon.className = 'fa-solid fa-user-shield';
        document.getElementById('page-title').innerText = 'Dashboard Tabungan Kelas';
        document.getElementById('page-subtitle').innerText = 'Panel Wali Kelas — Kelola Tabungan XII Bisnis Ritel 1';
        switchTab('dashboard');
        initChart();
    } else {
        // SISWA: tampilan terbatas
        document.getElementById('logged-user-name').innerText = currentUser.name;
        document.getElementById('logged-user-role').innerText = `Siswa — NISN: ${currentUser.nisn}`;
        document.getElementById('logged-user-role').className = 'badge badge-indigo';
        if (roleIcon) roleIcon.className = 'fa-solid fa-user-graduate';
        document.getElementById('page-title').innerText = 'Buku Tabungan Saya';
        document.getElementById('page-subtitle').innerText = `Halo, ${currentUser.name}! — XII Bisnis Ritel 1 SMK PGRI 11 Ciledug`;
        switchTab('tabungan-saya');
    }

    renderAllViews();
}

// Mobile Sidebar Toggle Handler
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = item.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    // PROTEKSI AKSES ROLE: Siswa tidak bisa akses tab Admin
    const adminTabs = ['dashboard', 'transaksi', 'siswa', 'laporan'];
    const siswaTabs = ['tabungan-saya', 'teman-sekelas'];

    if (currentUser) {
        if (currentUser.role === 'siswa' && adminTabs.includes(tabId)) {
            showToast('⛔ Akses ditolak! Halaman ini hanya untuk Wali Kelas.', 'danger');
            return;
        }
        if (currentUser.role === 'admin' && siswaTabs.includes(tabId)) {
            showToast('Halaman ini khusus untuk tampilan Siswa.', 'danger');
            return;
        }
    }

    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));

    const activeNav = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
    const activeTab = document.getElementById(`tab-${tabId}`);

    if (activeNav) activeNav.classList.add('active');
    if (activeTab) activeTab.classList.add('active');

    // Auto close mobile sidebar when tab selected
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    }

    // Judul halaman kontekstual
    const titleMap = {
        'dashboard': 'Dashboard Kas & Tabungan Kelas',
        'transaksi': 'Kelola Transaksi Uang Masuk & Keluar',
        'siswa': 'Data Siswa XII Bisnis Ritel 1 (44 Siswa)',
        'laporan': 'Laporan Keuangan Kas Kelas',
        'tabungan-saya': 'Buku Tabungan Saya',
        'teman-sekelas': 'Papan Tabungan Kelas'
    };
    const subtitleMap = {
        'dashboard': 'Panel Wali Kelas — Kelola Tabungan XII Bisnis Ritel 1',
        'transaksi': 'Riwayat lengkap mutasi setoran & penarikan seluruh siswa',
        'siswa': 'Data profil, saldo, & target tabungan 44 siswa terdaftar',
        'laporan': 'Rekapitulasi resmi oleh Wali Kelas Yoga Rahmanda, S.Pd.',
        'tabungan-saya': currentUser ? `Halo, ${currentUser.name}! — XII Bisnis Ritel 1` : '',
        'teman-sekelas': 'Peringkat & progres tabungan seluruh teman sekelas Anda'
    };
    document.getElementById('page-title').innerText = titleMap[tabId] || 'Tabungan Siswa';
    document.getElementById('page-subtitle').innerText = subtitleMap[tabId] || 'SMK PGRI 11 Ciledug Kota Tangerang';
}

// Realtime Clock
function setupRealtimeClock() {
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('clock-display').innerText = timeStr;
        const reportDateEl = document.getElementById('report-date-display');
        if (reportDateEl) reportDateEl.innerText = `${dateStr} ${timeStr}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
}

// Format Currency
function formatRp(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
}

// Format WhatsApp Phone Number (Convert 08xxx -> 628xxx)
function formatWaPhone(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
}

/// Populate Student Select Dropdowns (Urut A-Z tanpa nomor urut)
function populateStudentDropdowns() {
    const loginSelect = document.getElementById('siswa-login-nisn');
    const txSelect = document.getElementById('tx-student-id');
    const filterSelect = document.getElementById('filter-student');

    const sorted = [...appStudents].sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));

    const optionsHtml = sorted.map(s => `<option value="${s.nisn}">${escapeHtml(s.name)} (NISN: ${s.nisn})</option>`).join('');
    const txOptionsHtml = sorted.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (NISN: ${s.nisn})</option>`).join('');

    if (loginSelect) loginSelect.innerHTML = `<option value="">-- Pilih Nama Siswa (A-Z) --</option>` + optionsHtml;
    if (txSelect) txSelect.innerHTML = `<option value="">-- Pilih Nama Siswa (A-Z) --</option>` + txOptionsHtml;
    if (filterSelect) filterSelect.innerHTML = `<option value="all">Semua Siswa</option>` + txOptionsHtml;
}

// Render All Views (Role-based rendering)
function renderAllViews() {
    if (!currentUser) return;

    if (currentUser.role === 'admin') {
        // ADMIN: render semua view panel wali kelas
        renderDashboard();
        renderTransactionsTable();
        renderStudentsGrid();
        renderReportView();
    } else {
        // SISWA: render hanya view personal siswa
        renderStudentDashboard();
        renderLeaderboard();
    }
}

// Helper Mini Avatar Foto Siswa Tersistematis & Dinamis
function getStudentMiniAvatarHtml(studentOrId, size = 32) {
    let student = null;
    if (studentOrId && typeof studentOrId === 'object') {
        student = studentOrId;
    } else if (typeof studentOrId === 'string') {
        student = appStudents.find(s => s.id === studentOrId || s.name.toLowerCase() === studentOrId.toLowerCase() || s.nisn === studentOrId);
    }

    const height = Math.round(size * 1.25);

    if (!student) {
        return `<div class="student-mini-avatar" style="width:${size}px; height:${height}px;"><i class="fa-solid fa-user"></i></div>`;
    }

    const initial = student.name ? student.name.charAt(0).toUpperCase() : 'S';
    if (student.photo) {
        return `
        <div class="student-mini-avatar" style="width:${size}px; height:${height}px;" title="${escapeHtml(student.name)}">
            <img src="${student.photo}" alt="${escapeHtml(student.name)}" onerror="this.onerror=null; this.parentElement.innerText='${initial}'; this.parentElement.style.background='${getStudentAvatarGradient(student.name)}';">
        </div>`;
    }

    return `
    <div class="student-mini-avatar" style="width:${size}px; height:${height}px; background:${getStudentAvatarGradient(student.name)}; font-size:${Math.round(size * 0.42)}px;" title="${escapeHtml(student.name)}">
        ${initial}
    </div>`;
}

// Render Papan Tabungan Kelas untuk Siswa (hanya baca)
function renderLeaderboard() {
    const tbody = document.getElementById('leaderboard-tbody');
    if (!tbody) return;

    const sorted = [...appStudents].sort((a, b) => b.balance - a.balance);
    const myId = currentUser ? currentUser.studentId : null;

    if (sorted.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted p-4">Belum ada data tabungan.</td></tr>`;
        return;
    }

    tbody.innerHTML = sorted.map((s, idx) => {
        const progress = s.target > 0 ? Math.min(100, Math.round((s.balance / s.target) * 100)) : 0;
        const isMe = s.id === myId;
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
        const avatarHtml = getStudentMiniAvatarHtml(s, 28);
        const statusBadge = progress >= 100
            ? `<span class="badge badge-emerald"><i class="fa-solid fa-check-circle"></i> Lunas</span>`
            : progress >= 50
            ? `<span class="badge badge-amber"><i class="fa-solid fa-hourglass-half"></i> Setengah Jalan</span>`
            : `<span class="badge badge-indigo"><i class="fa-solid fa-hourglass-start"></i> Baru Mulai</span>`;

        return `
        <tr style="${isMe ? 'background: rgba(99,102,241,0.12); font-weight: 700;' : ''}">
            <td style="font-size: 1.1rem; text-align:center;">${medal}</td>
            <td>
                <div class="student-col-flex">
                    ${avatarHtml}
                    <div>
                        ${isMe ? '<i class="fa-solid fa-star text-amber" title="Ini Anda"></i> ' : ''}
                        <strong>${escapeHtml(s.name)}</strong>
                        ${isMe ? '<span class="badge badge-indigo" style="font-size:0.65rem; margin-left:4px;">Saya</span>' : ''}
                    </div>
                </div>
            </td>
            <td class="text-emerald" style="font-weight: 700;">${formatRp(s.balance)}</td>
            <td>${formatRp(s.target || 0)}</td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="progress-bar-container" style="height:8px; width:80px; flex-shrink:0;">
                        <div class="progress-bar-fill" style="width:${progress}%;"></div>
                    </div>
                    <span style="font-size:0.8rem;">${progress}%</span>
                </div>
            </td>
            <td>${statusBadge}</td>
        </tr>`;
    }).join('');
}

// ==========================================================================
// FIREBASE REALTIME DATABASE ENGINE (ALWAYS ONLINE & AUTO-RECONNECT)
// ==========================================================================

function initFirebaseRealtimeSync() {
    if (typeof firebase === 'undefined') {
        console.warn('[Firebase] SDK belum termuat, beralih ke mode offline lokal.');
        updateCloudSyncStatus('offline', 'Mode Lokal');
        return;
    }

    try {
        if (!firebase.apps || !firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig);
        } else {
            firebaseApp = firebase.app();
        }
        firebaseDb = firebase.database();
        console.log('[Firebase] Realtime Database tersambung.');

        // Pastikan socket aktif
        firebase.database().goOnline();

        // Coba sign in secara anonim jika diaktifkan di Firebase Console
        if (firebase.auth) {
            try {
                firebase.auth().signInAnonymously().catch(e => {
                    console.log('[Firebase Auth] Anonymous notice:', e.message);
                });
            } catch(authErr) {
                // ignore
            }
        }

        // 1. Pantau status koneksi internet & socket Firebase
        const connectedRef = firebaseDb.ref('.info/connected');
        connectedRef.on('value', (snap) => {
            if (snap.val() === true && !firebasePermissionDenied) {
                console.log('[Firebase] Terhubung ke Cloud RTDB.');
                updateCloudSyncStatus('connected', 'Firebase Online');
            } else if (!firebasePermissionDenied) {
                console.log('[Firebase] Koneksi Cloud terputus / offline.');
                updateCloudSyncStatus('offline', 'Menghubungkan...');
            }
        });

        // 2. Real-time Listener data tabungan (Always On-Time Sync)
        const mainRef = firebaseDb.ref('tabungan_br1');
        mainRef.on('value', (snapshot) => {
            firebasePermissionDenied = false;
            const data = snapshot.val();
            if (data && data.students && Array.isArray(data.students) && data.students.length > 0) {
                console.log('[Firebase] Menerima pembaruan real-time dari Cloud RTDB.');
                isReceivingRemoteUpdate = true;
                isFirebaseSyncedOnce = true;

                // Perbarui state lokal dengan data cloud terbaru
                appStudents = data.students;
                if (data.transactions && Array.isArray(data.transactions)) {
                    appTransactions = data.transactions;
                } else if (data.transactions && typeof data.transactions === 'object') {
                    appTransactions = Object.values(data.transactions);
                } else {
                    appTransactions = [];
                }

                // Sinkronkan konfigurasi WhatsApp Gateway jika tersedia di cloud
                if (data.waConfig && typeof data.waConfig === 'object') {
                    waConfig = { ...waConfig, ...data.waConfig };
                    try {
                        localStorage.setItem(STORAGE_WA_CONFIG_KEY, JSON.stringify(waConfig));
                    } catch(e) {}
                }

                // Simpan ke cache browser untuk performa instan saat buka halaman berikutnya
                saveLocalCache();

                // Jika sedang login sebagai siswa, perbarui objek currentUser
                if (currentUser && currentUser.role === 'siswa') {
                    const freshStudent = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
                    if (freshStudent) {
                        currentUser = { ...currentUser, ...freshStudent, studentId: freshStudent.id, id: freshStudent.id };
                        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
                    }
                }

                // Render ulang tampilan jika sudah login
                if (currentUser) {
                    renderAllViews();
                    if (currentUser.role === 'admin') {
                        updateStatsCards();
                        updateChart();
                    }
                }
                populateStudentDropdowns();

                isReceivingRemoteUpdate = false;
                updateCloudSyncStatus('connected', 'Firebase Online');
            } else if (!data || !data.students) {
                console.log('[Firebase] Cloud RTDB kosong. Menginisialisasi seed data awal...');
                saveToFirebaseDatabase(true);
            }
        }, (error) => {
            console.error('[Firebase] Realtime listener error:', error);
            if (error.code === 'PERMISSION_DENIED' || (error.message && error.message.toLowerCase().includes('permission_denied'))) {
                firebasePermissionDenied = true;
                updateCloudSyncStatus('error', 'Aturan Cloud');
            } else {
                updateCloudSyncStatus('error', 'Sync Error');
            }
        });

        // 3. Pasang Listener Always-Online & Auto-Reconnect saat Buka HP / Tab Kembali
        setupAlwaysOnlineListeners();

    } catch (err) {
        console.error('[Firebase] Gagal menginisialisasi Firebase:', err);
        updateCloudSyncStatus('offline', 'Mode Lokal');
    }
}

function setupAlwaysOnlineListeners() {
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && firebaseDb) {
            console.log('[Firebase Manager] Tab aktif kembali -> Memastikan koneksi online...');
            firebase.database().goOnline();
            checkAndRefreshCloudData(true);
        }
    });

    window.addEventListener('online', () => {
        if (firebaseDb) {
            console.log('[Firebase Manager] Jaringan online kembali -> Mengaktifkan socket...');
            firebase.database().goOnline();
            checkAndRefreshCloudData(true);
        }
    });

    window.addEventListener('focus', () => {
        if (firebaseDb) {
            firebase.database().goOnline();
        }
    });

    setInterval(() => {
        if (firebaseDb && document.visibilityState === 'visible') {
            firebase.database().goOnline();
        }
    }, 25000);
}

function checkAndRefreshCloudData(silent = false) {
    if (!firebaseDb) return;
    if (!silent) updateCloudSyncStatus('syncing', 'Menyinkronkan...');

    firebaseDb.ref('tabungan_br1').once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.students && Array.isArray(data.students) && data.students.length > 0) {
            appStudents = data.students;
            if (data.transactions && Array.isArray(data.transactions)) {
                appTransactions = data.transactions;
            } else if (data.transactions && typeof data.transactions === 'object') {
                appTransactions = Object.values(data.transactions);
            }
            if (data.waConfig) waConfig = { ...waConfig, ...data.waConfig };

            saveLocalCache();

            if (currentUser && currentUser.role === 'siswa') {
                const freshStudent = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
                if (freshStudent) {
                    currentUser = { ...currentUser, ...freshStudent, studentId: freshStudent.id, id: freshStudent.id };
                    sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
                }
            }

            if (currentUser) {
                renderAllViews();
                if (currentUser.role === 'admin') {
                    updateStatsCards();
                    updateChart();
                }
            }
            populateStudentDropdowns();
            updateCloudSyncStatus('connected', 'Firebase Online');
            if (!silent) showToast('Data terbaru berhasil disinkronkan dari Cloud!', 'success');
        }
    }).catch(err => {
        console.warn('[Firebase] Check refresh error:', err);
    });
}

function saveToFirebaseDatabase(force = true) {
    if (!firebaseDb) {
        console.warn('[Firebase] Database belum siap.');
        return Promise.resolve(false);
    }

    if (firebaseSyncDebounceTimer) {
        clearTimeout(firebaseSyncDebounceTimer);
    }

    isSyncingToCloud = true;
    updateCloudSyncStatus('syncing', 'Menyimpan...');
    saveLocalCache();

    const payload = {
        repository: "https://github.com/yogarhmnd/tabungan-xiibr1",
        liveUrl: "https://tabungan-xiibr1.vercel.app",
        appName: "Tabungan Siswa XII BR 1 SMK PGRI 11 CILEDUG KOTA TANGERANG",
        version: "v1.2.0-cloud",
        lastUpdated: new Date().toISOString(),
        waConfig: typeof waConfig !== 'undefined' ? waConfig : {},
        students: appStudents,
        transactions: appTransactions
    };

    return firebaseDb.ref('tabungan_br1').set(payload)
        .then(() => {
            firebasePermissionDenied = false;
            isSyncingToCloud = false;
            isFirebaseSyncedOnce = true;
            updateCloudSyncStatus('connected', 'Firebase Online');
            console.log('[Firebase] Berhasil tersimpan ke Cloud RTDB.');
            return true;
        })
        .catch((error) => {
            isSyncingToCloud = false;
            console.error('[Firebase] Gagal simpan ke Cloud:', error);
            if (error.code === 'PERMISSION_DENIED' || (error.message && error.message.toLowerCase().includes('permission_denied'))) {
                firebasePermissionDenied = true;
                updateCloudSyncStatus('error', 'Aturan Cloud');
            } else {
                updateCloudSyncStatus('error', 'Gagal Simpan');
            }
            return false;
        });
}

function syncToFirebase(force = false) {
    if (force) {
        return saveToFirebaseDatabase(true);
    }
    if (firebaseSyncDebounceTimer) {
        clearTimeout(firebaseSyncDebounceTimer);
    }
    firebaseSyncDebounceTimer = setTimeout(() => {
        saveToFirebaseDatabase(true);
    }, 250);
}

function refreshData() {
    updateCloudSyncStatus('syncing', 'Menyegarkan...');
    showToast('Menyegarkan data langsung dari Firebase Database...', 'info');
    checkAndRefreshCloudData(false);
}


// 1. ADMIN DASHBOARD
function renderDashboard() {
    const totalSaldo = appStudents.reduce((acc, s) => acc + s.balance, 0);
    const totalMasuk = appTransactions.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
    const totalKeluar = appTransactions.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
    const avgSaldo = appStudents.length ? Math.round(totalSaldo / appStudents.length) : 0;

    document.getElementById('stat-total-saldo').innerText = formatRp(totalSaldo);
    document.getElementById('stat-total-masuk').innerText = formatRp(totalMasuk);
    document.getElementById('stat-total-keluar').innerText = formatRp(totalKeluar);
    document.getElementById('stat-total-siswa').innerText = `${appStudents.length} Siswa`;
    document.getElementById('stat-avg-saldo').innerText = `Rata-rata: ${formatRp(avgSaldo)}`;

    // Top Savers Leaderboard (Dengan Avatar Foto Dinamis)
    const sortedStudents = [...appStudents].sort((a, b) => b.balance - a.balance).slice(0, 5);
    const topSaversContainer = document.getElementById('top-savers-list');
    topSaversContainer.innerHTML = sortedStudents.map((s, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
        const avatarHtml = getStudentMiniAvatarHtml(s, 34);
        return `
            <div class="saver-item">
                <div class="saver-rank ${rankClass}">${index + 1}</div>
                ${avatarHtml}
                <div class="saver-info">
                    <strong>${escapeHtml(s.name)}</strong>
                    <small>NISN: ${s.nisn} | WA: ${s.phone || '-'}</small>
                </div>
                <div class="saver-amount">${formatRp(s.balance)}</div>
            </div>
        `;
    }).join('');

    // Recent Transactions (Dengan Avatar Foto Dinamis)
    const recentTx = [...appTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentTbody = document.getElementById('recent-transactions-tbody');
    if (recentTx.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4">Belum ada transaksi. Silakan tambah setoran siswa.</td></tr>`;
    } else {
        recentTbody.innerHTML = recentTx.map(t => {
            const student = appStudents.find(s => s.id === t.studentId);
            const avatarHtml = getStudentMiniAvatarHtml(student || t.studentName, 28);
            return `
            <tr>
                <td><code>${t.id}</code></td>
                <td>${formatDateTime(t.date)}</td>
                <td>
                    <div class="student-col-flex">
                        ${avatarHtml}
                        <span><strong>${escapeHtml(t.studentName)}</strong></span>
                    </div>
                </td>
                <td>
                    <span class="badge ${t.type === 'setor' ? 'badge-emerald' : 'badge-rose'}">
                        ${t.type === 'setor' ? 'SETORAN' : 'PENARIKAN'}
                    </span>
                </td>
                <td>${escapeHtml(t.category)}</td>
                <td class="font-weight-bold ${t.type === 'setor' ? 'text-emerald' : 'text-rose'}">
                    ${t.type === 'setor' ? '+' : '-'} ${formatRp(t.amount)}
                </td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-secondary btn-sm" onclick="openReceiptModal('${t.id}')">
                            <i class="fa-solid fa-receipt"></i> Struk
                        </button>
                        <button class="btn btn-whatsapp btn-sm" onclick="triggerWaDirect('${t.id}')" title="Kirim WA Notifikasi">
                            <i class="fa-brands fa-whatsapp"></i> WA
                        </button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
    }
}

// 2. STUDENT DASHBOARD
function renderStudentDashboard() {
    if (!currentUser || currentUser.role !== 'siswa') return;

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (!student) return;

    const avatarEl = document.getElementById('s-welcome-avatar');
    if (avatarEl) {
        if (student.photo) {
            avatarEl.innerHTML = `<img src="${student.photo}" alt="${escapeHtml(student.name)}" class="student-photo-img" onerror="this.onerror=null; this.parentElement.innerText='${student.name.charAt(0)}'; this.parentElement.style.background='${getStudentAvatarGradient(student.name)}';">`;
            avatarEl.style.background = '#0f172a';
        } else {
            avatarEl.innerHTML = student.name.charAt(0);
            avatarEl.style.background = getStudentAvatarGradient(student.name);
        }
    }
    document.getElementById('s-welcome-name').innerText = student.name;
    document.getElementById('s-welcome-nisn').innerText = student.nisn;

    const myTx = appTransactions.filter(t => t.studentId === student.id);
    const totalSetor = myTx.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
    const totalTarik = myTx.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);

    document.getElementById('my-saldo').innerText = formatRp(student.balance);
    document.getElementById('my-total-setor').innerText = formatRp(totalSetor);
    document.getElementById('my-total-tarik').innerText = formatRp(totalTarik);
    document.getElementById('my-target-amount').innerText = formatRp(student.target || 0);

    const progress = student.target > 0 ? Math.min(100, Math.round((student.balance / student.target) * 100)) : 0;
    document.getElementById('my-target-progress-text').innerText = `Progres: ${progress}%`;
    document.getElementById('my-progress-percent').innerText = `${progress}%`;
    document.getElementById('my-progress-bar').style.width = `${progress}%`;

    const sortedTx = [...myTx].sort((a, b) => new Date(b.date) - new Date(a.date));
    const tbody = document.getElementById('my-history-tbody');
    if (sortedTx.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">Belum ada riwayat transaksi tabungan untuk Anda.</td></tr>`;
    } else {
        tbody.innerHTML = sortedTx.map(t => `
            <tr>
                <td><code>${t.id}</code></td>
                <td>${formatDateTime(t.date)}</td>
                <td>
                    <span class="badge ${t.type === 'setor' ? 'badge-emerald' : 'badge-rose'}">
                        ${t.type === 'setor' ? 'SETORAN (+)' : 'PENARIKAN (-)'}
                    </span>
                </td>
                <td><span class="badge badge-indigo">${escapeHtml(t.category)}</span></td>
                <td class="${t.type === 'setor' ? 'text-emerald' : 'text-rose'}" style="font-weight:700;">
                    ${t.type === 'setor' ? '+' : '-'} ${formatRp(t.amount)}
                </td>
                <td><small>${escapeHtml(t.note || '-')}</small></td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="openReceiptModal('${t.id}')">
                        <i class="fa-solid fa-receipt"></i> Struk
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function printMyPassbook() {
    if (currentUser && currentUser.studentId) {
        openPassbookModal(currentUser.studentId);
    }
}

// 3. Transactions Table Renderer (Admin)
function renderTransactionsTable() {
    applyTransactionFilters();
}

function applyTransactionFilters() {
    const filterType = document.getElementById('filter-type').value;
    const filterStudent = document.getElementById('filter-student').value;
    const filterCategory = document.getElementById('filter-category').value;
    const filterSearch = document.getElementById('filter-search').value.toLowerCase();

    let filtered = [...appTransactions];

    if (filterType !== 'all') filtered = filtered.filter(t => t.type === filterType);
    if (filterStudent !== 'all') filtered = filtered.filter(t => t.studentId === filterStudent);
    if (filterCategory !== 'all') filtered = filtered.filter(t => t.category === filterCategory);
    if (filterSearch) {
        filtered = filtered.filter(t => 
            t.studentName.toLowerCase().includes(filterSearch) ||
            t.id.toLowerCase().includes(filterSearch) ||
            (t.note && t.note.toLowerCase().includes(filterSearch))
        );
    }

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const tbody = document.getElementById('all-transactions-tbody');
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="text-center text-muted p-4">Belum ada data transaksi yang dicatat.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(t => {
        const student = appStudents.find(s => s.id === t.studentId);
        const avatarHtml = getStudentMiniAvatarHtml(student || t.studentName, 28);
        return `
        <tr>
            <td><code>${t.id}</code></td>
            <td>${formatDateTime(t.date)}</td>
            <td>
                <div class="student-col-flex">
                    ${avatarHtml}
                    <span><strong>${escapeHtml(t.studentName)}</strong></span>
                </div>
            </td>
            <td>
                <span class="badge ${t.type === 'setor' ? 'badge-emerald' : 'badge-rose'}">
                    ${t.type === 'setor' ? 'UANG MASUK' : 'UANG KELUAR'}
                </span>
            </td>
            <td><span class="badge badge-indigo">${escapeHtml(t.category)}</span></td>
            <td class="${t.type === 'setor' ? 'text-emerald' : 'text-rose'}" style="font-weight: 700;">
                ${t.type === 'setor' ? '+' : '-'} ${formatRp(t.amount)}
            </td>
            <td><small>${escapeHtml(t.note || '-')}</small></td>
            <td>
                <button class="btn btn-whatsapp btn-sm" onclick="triggerWaDirect('${t.id}')" title="Kirim Notifikasi WA">
                    <i class="fa-brands fa-whatsapp"></i> Kirim WA
                </button>
            </td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="openReceiptModal('${t.id}')">
                    <i class="fa-solid fa-receipt"></i> Struk
                </button>
            </td>
            <td>
                <button class="btn btn-rose btn-sm" onclick="deleteTransaction('${t.id}')" title="Hapus Transaksi">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    }).join('');
}

// 4. Students Grid Renderer (Admin)
function renderStudentsGrid() {
    const container = document.getElementById('students-cards-container');
    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = sortedStudents.map(s => {
        const progress = s.target > 0 ? Math.min(100, Math.round((s.balance / s.target) * 100)) : 0;
        const avatarHtml = s.photo 
            ? `<div class="student-avatar-frame" style="background: ${getStudentAvatarGradient(s.name)};"><img src="${s.photo}" alt="${escapeHtml(s.name)}" class="student-photo-img" onerror="this.onerror=null; this.style.display='none'; this.parentElement.innerText='${s.name.charAt(0)}';"></div>`
            : `<div class="student-avatar" style="background: ${getStudentAvatarGradient(s.name)};">${s.name.charAt(0)}</div>`;

        return `
            <div class="student-card">
                <div class="student-header">
                    ${avatarHtml}
                    <div class="student-name-box">
                        <h4>${escapeHtml(s.name)}</h4>
                        <small>NISN: ${s.nisn} | WA: ${s.phone || '-'}</small>
                    </div>
                </div>
                <div class="student-balance-box">
                    <small>Saldo Tabungan Saat Ini</small>
                    <div class="student-balance-amount">${formatRp(s.balance)}</div>
                    <div class="mt-2">
                        <div class="d-flex justify-content-between small text-muted">
                            <span>Target: <strong>${formatRp(s.target || 0)}</strong></span>
                            <strong>${progress}%</strong>
                        </div>
                        <div class="progress-bar-container mt-1">
                            <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                        </div>
                    </div>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-secondary btn-sm flex-grow" onclick="openPassbookModal('${s.id}')">
                        <i class="fa-solid fa-book"></i> Mutasi
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="openEditTargetModal('${s.id}')" title="Edit Target / No WA">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button class="btn btn-emerald btn-sm" onclick="quickSetor('${s.id}')" title="Setor Uang">
                        <i class="fa-solid fa-plus"></i> Setor
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 5. Report View Renderer (Admin: Rekap Harian, Mingguan, Bulanan & Per Siswa)
let currentReportTab = 'harian';

function switchReportTab(tabType) {
    currentReportTab = tabType;
    
    // Update active tab buttons and subviews
    ['harian', 'mingguan', 'bulanan', 'siswa'].forEach(t => {
        const btn = document.getElementById(`btn-rekap-${t}`);
        const view = document.getElementById(`report-view-${t}`);
        if (btn) btn.classList.toggle('active', t === tabType);
        if (view) view.classList.toggle('hidden', t !== tabType);
    });

    renderReportView();
}

function renderReportView() {
    const totalMasuk = appTransactions.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
    const totalKeluar = appTransactions.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
    const totalSaldo = appStudents.reduce((acc, s) => acc + s.balance, 0);

    const elMasuk = document.getElementById('report-total-masuk');
    const elKeluar = document.getElementById('report-total-keluar');
    const elSaldo = document.getElementById('report-saldo-akhir');
    const elDate = document.getElementById('report-date-display');

    if (elMasuk) elMasuk.innerText = formatRp(totalMasuk);
    if (elKeluar) elKeluar.innerText = formatRp(totalKeluar);
    if (elSaldo) elSaldo.innerText = formatRp(totalSaldo);
    if (elDate) elDate.innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

    renderReportHarian();
    renderReportMingguan();
    renderReportBulanan();
    renderReportPerSiswa();
}

// 5.1 Rekapitulasi Tabungan Harian (Per Hari)
function renderReportHarian() {
    const tbody = document.getElementById('report-harian-tbody');
    const badge = document.getElementById('badge-harian-count');
    if (!tbody) return;

    if (appTransactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4"><i class="fa-solid fa-circle-info"></i> Belum ada riwayat transaksi yang tercatat.</td></tr>`;
        if (badge) badge.innerText = '0 Hari';
        return;
    }

    // Group transactions by date string YYYY-MM-DD
    const groups = {};
    appTransactions.forEach(t => {
        const dateKey = (t.date || '').slice(0, 10) || '2026-09-04';
        if (!groups[dateKey]) {
            groups[dateKey] = {
                date: dateKey,
                transactions: [],
                totalSetor: 0,
                totalTarik: 0,
                studentIds: new Set()
            };
        }
        groups[dateKey].transactions.push(t);
        if (t.type === 'setor') groups[dateKey].totalSetor += t.amount;
        else if (t.type === 'tarik') groups[dateKey].totalTarik += t.amount;
        if (t.studentId) groups[dateKey].studentIds.add(t.studentId);
    });

    const sortedDates = Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
    if (badge) badge.innerText = `${sortedDates.length} Hari Transaksi`;

    tbody.innerHTML = sortedDates.map((g, idx) => {
        const netFlow = g.totalSetor - g.totalTarik;
        const d = new Date(g.date + 'T00:00:00');
        const formattedDate = d.toLocaleDateString('id-ID', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        const avgPerTx = g.transactions.length > 0 ? (g.totalSetor + g.totalTarik) / g.transactions.length : 0;
        const isNetPositive = netFlow >= 0;

        return `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <strong><i class="fa-solid fa-calendar-day text-indigo"></i> ${formattedDate}</strong>
                </td>
                <td><span class="badge badge-indigo">${g.transactions.length} Transaksi</span></td>
                <td class="text-emerald font-weight-bold">+ ${formatRp(g.totalSetor)}</td>
                <td class="text-rose font-weight-bold">- ${formatRp(g.totalTarik)}</td>
                <td class="${isNetPositive ? 'text-emerald' : 'text-rose'} font-weight-bold">
                    ${isNetPositive ? '+' : ''}${formatRp(netFlow)}
                </td>
                <td>
                    <span class="badge badge-emerald"><i class="fa-solid fa-user-check"></i> ${g.studentIds.size} Siswa</span>
                </td>
                <td><small class="text-muted">${formatRp(Math.round(avgPerTx))}</small></td>
            </tr>
        `;
    }).join('');
}

// 5.2 Rekapitulasi Tabungan Mingguan (Per Minggu)
function renderReportMingguan() {
    const tbody = document.getElementById('report-mingguan-tbody');
    const badge = document.getElementById('badge-mingguan-count');
    if (!tbody) return;

    if (appTransactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4"><i class="fa-solid fa-circle-info"></i> Belum ada data transaksi mingguan.</td></tr>`;
        if (badge) badge.innerText = '0 Minggu';
        return;
    }

    const getWeekInfo = (dateStr) => {
        const d = new Date(dateStr);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const mStr = monday.toISOString().slice(0, 10);
        const sStr = sunday.toISOString().slice(0, 10);
        const key = `${mStr}_${sStr}`;
        const label = `${monday.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} - ${sunday.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
        const monthYear = monday.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        return { key, label, monthYear, monday, sunday };
    };

    const weekGroups = {};
    appTransactions.forEach(t => {
        const wInfo = getWeekInfo(t.date || '2026-09-04');
        if (!weekGroups[wInfo.key]) {
            weekGroups[wInfo.key] = {
                key: wInfo.key,
                label: wInfo.label,
                monthYear: wInfo.monthYear,
                monday: wInfo.monday,
                transactions: [],
                totalSetor: 0,
                totalTarik: 0
            };
        }
        weekGroups[wInfo.key].transactions.push(t);
        if (t.type === 'setor') weekGroups[wInfo.key].totalSetor += t.amount;
        else if (t.type === 'tarik') weekGroups[wInfo.key].totalTarik += t.amount;
    });

    const sortedWeeks = Object.values(weekGroups).sort((a, b) => b.monday - a.monday);
    if (badge) badge.innerText = `${sortedWeeks.length} Periode Minggu`;

    tbody.innerHTML = sortedWeeks.map((w, idx) => {
        const netFlow = w.totalSetor - w.totalTarik;
        const avgPerDay = netFlow / 7;
        const isNetPositive = netFlow >= 0;

        return `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <strong><i class="fa-solid fa-calendar-week text-emerald"></i> ${w.label}</strong>
                </td>
                <td><span class="badge badge-secondary">${w.monthYear}</span></td>
                <td><span class="badge badge-indigo">${w.transactions.length} Transaksi</span></td>
                <td class="text-emerald font-weight-bold">+ ${formatRp(w.totalSetor)}</td>
                <td class="text-rose font-weight-bold">- ${formatRp(w.totalTarik)}</td>
                <td class="${isNetPositive ? 'text-emerald' : 'text-rose'} font-weight-bold">
                    ${isNetPositive ? '+' : ''}${formatRp(netFlow)}
                </td>
                <td><small class="text-muted">${formatRp(Math.round(avgPerDay))} / hari</small></td>
            </tr>
        `;
    }).join('');
}

// 5.3 Rekapitulasi Tabungan Bulanan (Per Bulan)
function renderReportBulanan() {
    const tbody = document.getElementById('report-bulanan-tbody');
    const badge = document.getElementById('badge-bulanan-count');
    if (!tbody) return;

    if (appTransactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4"><i class="fa-solid fa-circle-info"></i> Belum ada data transaksi bulanan.</td></tr>`;
        if (badge) badge.innerText = '0 Bulan';
        return;
    }

    const monthGroups = {};
    appTransactions.forEach(t => {
        const ymKey = (t.date || '').slice(0, 7) || '2026-09';
        if (!monthGroups[ymKey]) {
            const [y, m] = ymKey.split('-');
            const d = new Date(parseInt(y), parseInt(m) - 1, 1);
            monthGroups[ymKey] = {
                key: ymKey,
                monthName: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
                yearMonth: ymKey,
                transactions: [],
                totalSetor: 0,
                totalTarik: 0
            };
        }
        monthGroups[ymKey].transactions.push(t);
        if (t.type === 'setor') monthGroups[ymKey].totalSetor += t.amount;
        else if (t.type === 'tarik') monthGroups[ymKey].totalTarik += t.amount;
    });

    const sortedMonths = Object.values(monthGroups).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
    if (badge) badge.innerText = `${sortedMonths.length} Bulan`;

    tbody.innerHTML = sortedMonths.map((m, idx) => {
        const netFlow = m.totalSetor - m.totalTarik;
        const isSurplus = netFlow >= 0;

        return `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <strong><i class="fa-solid fa-calendar-days text-amber"></i> ${m.monthName}</strong>
                </td>
                <td><span class="badge badge-indigo">${m.transactions.length} Transaksi</span></td>
                <td class="text-emerald font-weight-bold">+ ${formatRp(m.totalSetor)}</td>
                <td class="text-rose font-weight-bold">- ${formatRp(m.totalTarik)}</td>
                <td class="${isSurplus ? 'text-emerald' : 'text-rose'} font-weight-bold">
                    ${isSurplus ? '+' : ''}${formatRp(netFlow)}
                </td>
                <td>
                    <span class="badge ${isSurplus ? 'badge-emerald' : 'badge-rose'}">
                        <i class="fa-solid ${isSurplus ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}"></i> ${isSurplus ? 'SURPLUS' : 'DEFISIT'}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

// 5.4 Rekapitulasi Per Siswa
function renderReportPerSiswa() {
    const tbody = document.getElementById('report-students-tbody');
    if (!tbody) return;

    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));

    tbody.innerHTML = sortedStudents.map((s, index) => {
        const studentTx = appTransactions.filter(t => t.studentId === s.id);
        const setoran = studentTx.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
        const penarikan = studentTx.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
        const targetReached = (s.target || 2000000) > 0 && s.balance >= (s.target || 2000000);
        const avatarHtml = getStudentMiniAvatarHtml(s, 28);

        return `
            <tr>
                <td>${index + 1}</td>
                <td><code>${s.nisn}</code></td>
                <td>
                    <div class="student-col-flex">
                        ${avatarHtml}
                        <div>
                            <strong>${escapeHtml(s.name)}</strong>
                            <br><small class="text-muted"><i class="fa-brands fa-whatsapp text-emerald"></i> ${s.phone || '-'}</small>
                        </div>
                    </div>
                </td>
                <td>
                    ${formatRp(s.target || 2000000)} 
                    <button class="btn btn-secondary btn-sm p-1 ml-1" onclick="openEditTargetModal('${s.id}')" title="Edit Target">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                </td>
                <td class="text-emerald">+ ${formatRp(setoran)}</td>
                <td class="text-rose">- ${formatRp(penarikan)}</td>
                <td class="text-primary font-weight-bold">${formatRp(s.balance)}</td>
                <td>
                    <span class="badge ${targetReached ? 'badge-emerald' : 'badge-amber'}">
                        ${targetReached ? 'TERCAPAI' : 'PROSES'}
                    </span>
                </td>
                <td>
                    <div class="d-flex gap-1">
                        <button class="btn btn-secondary btn-sm" onclick="openPassbookModal('${s.id}')">
                            <i class="fa-solid fa-book"></i> Detail
                        </button>
                        <button class="btn btn-emerald btn-sm" onclick="quickSetor('${s.id}')" title="Setor Uang">
                            <i class="fa-solid fa-plus"></i> Setor
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// BATCH TRANSACTION ENGINE (Setor / Tarik Masal Banyak Siswa Sekaligus)
function openBatchModal(type = 'setor') {
    document.getElementById('batch-type').value = type;
    updateBatchModalType(type);

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('batch-date').value = now.toISOString().slice(0, 16);

    document.getElementById('batch-default-amount').value = 10000;
    document.getElementById('batch-note').value = type === 'setor' ? 'Setoran harian kas kelas BR 1' : 'Penarikan kegiatan kelas BR 1';
    document.getElementById('batch-student-search').value = '';
    document.getElementById('batch-select-all').checked = true;

    renderBatchStudentTable();
    openModal('modal-batch-transaction');
}

function updateBatchModalType(type) {
    const titleEl = document.getElementById('modal-batch-title');
    const submitBtn = document.getElementById('btn-batch-submit');

    if (type === 'setor') {
        titleEl.innerHTML = `<i class="fa-solid fa-layer-group text-emerald"></i> Transaksi Setor Masal (Banyak Siswa)`;
        submitBtn.className = 'btn btn-emerald';
        submitBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Eksekusi Setor Masal (Batch)`;
        const bCat = document.getElementById('batch-category');
        if (bCat) {
            bCat.innerHTML = `<option value="Tabungan Harian" selected>Tabungan Harian</option>`;
            bCat.value = 'Tabungan Harian';
        }
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-layer-group text-rose"></i> Transaksi Tarik Masal (Banyak Siswa)`;
        submitBtn.className = 'btn btn-rose';
        submitBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Eksekusi Tarik Masal (Batch)`;
        const bCat = document.getElementById('batch-category');
        if (bCat) {
            bCat.innerHTML = `
                <option value="Penarikan Tabungan" selected>Penarikan Tabungan</option>
                <option value="Kegiatan Kelas">Kegiatan Kelas</option>
                <option value="Lainnya">Lainnya</option>
            `;
        }
    }
}

function renderBatchStudentTable(searchQuery = '') {
    const tbody = document.getElementById('batch-students-tbody');
    const defaultAmt = Number(document.getElementById('batch-default-amount').value) || 10000;
    const q = searchQuery.toLowerCase().trim();

    let sorted = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));
    if (q) {
        sorted = sorted.filter(s => s.name.toLowerCase().includes(q) || s.nisn.includes(q));
    }

    tbody.innerHTML = sorted.map(s => `
        <tr id="batch-row-${s.id}">
            <td style="text-align: center;">
                <input type="checkbox" class="batch-chk" data-student-id="${s.id}" checked onchange="updateBatchSelectedCount()" style="transform: scale(1.3); cursor: pointer;">
            </td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td><code>${s.nisn}</code></td>
            <td><span class="text-emerald font-weight-bold">${formatRp(s.balance)}</span></td>
            <td>
                <input type="number" id="batch-amt-${s.id}" class="form-control form-control-sm batch-amt-input" value="${defaultAmt}" min="500" step="500">
            </td>
        </tr>
    `).join('');

    updateBatchSelectedCount();
}

function toggleBatchSelectAll(isChecked) {
    document.querySelectorAll('.batch-chk').forEach(chk => {
        chk.checked = isChecked;
    });
    updateBatchSelectedCount();
}

function updateBatchSelectedCount() {
    const checkedCount = document.querySelectorAll('.batch-chk:checked').length;
    document.getElementById('batch-selected-count').innerText = `${checkedCount} Siswa Dipilih`;
}

function applyBatchDefaultAmount() {
    const defaultAmt = Number(document.getElementById('batch-default-amount').value) || 0;
    document.querySelectorAll('.batch-amt-input').forEach(input => {
        input.value = defaultAmt;
    });
    showToast(`Nominal ${formatRp(defaultAmt)} diterapkan ke semua input siswa!`, 'success');
}

function filterBatchStudentList(q) {
    renderBatchStudentTable(q);
}

function handleBatchSubmit(e) {
    e.preventDefault();

    const type = document.getElementById('batch-type').value;
    const category = document.getElementById('batch-category').value;
    const date = document.getElementById('batch-date').value;
    const note = document.getElementById('batch-note').value.trim() || (type === 'setor' ? 'Setoran masal' : 'Penarikan masal');

    const checkedBoxes = document.querySelectorAll('.batch-chk:checked');
    if (checkedBoxes.length === 0) {
        showToast('Pilih setidaknya 1 siswa untuk memproses transaksi masal!', 'danger');
        return;
    }

    if (!confirm(`Apakah Anda yakin ingin memproses transaksi ${type === 'setor' ? 'SETORAN MASUK' : 'PENARIKAN KELUAR'} untuk ${checkedBoxes.length} siswa terpilih?`)) {
        return;
    }

    let successCount = 0;
    let totalBatchAmount = 0;

    let processedList = [];

    checkedBoxes.forEach(chk => {
        const studentId = chk.getAttribute('data-student-id');
        const student = appStudents.find(s => s.id === studentId);
        if (!student) return;

        const amtInput = document.getElementById(`batch-amt-${studentId}`);
        const amount = Number(amtInput ? amtInput.value : 0);

        if (amount <= 0) return;

        // Safety check for withdrawal
        if (type === 'tarik' && amount > student.balance) {
            showToast(`Siswa ${student.name} dilewati: Saldo (${formatRp(student.balance)}) kurang untuk penarikan ${formatRp(amount)}.`, 'danger');
            return;
        }

        // Apply Balance Update
        if (type === 'setor') student.balance += amount;
        else student.balance -= amount;

        totalBatchAmount += amount;
        successCount++;

        // Add Transaction Record
        const txId = 'TX-B' + Math.floor(1000 + Math.random() * 9000);
        const newTx = {
            id: txId,
            studentId: student.id,
            studentName: student.name,
            type: type,
            category: category,
            amount: amount,
            date: date,
            note: `${note} (Batch ${checkedBoxes.length} Siswa)`
        };
        appTransactions.push(newTx);
        processedList.push({ tx: newTx, student: student, amount: amount });

        // Trigger Automatic Background WA Gateway Dispatch (if enabled)
        if (waConfig.autoBackground && waConfig.url) {
            dispatchWaGatewayBackground(newTx, student);
        }
    });

    if (successCount === 0) {
        showToast('Tidak ada transaksi yang berhasil diproses.', 'danger');
        return;
    }

    appTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    saveStudents();
    saveTransactions();
    renderAllViews();
    if (currentUser.role === 'admin') updateChart();
    closeModal('modal-batch-transaction');

    showToast(`SUKSES! Memproses ${successCount} transaksi ${type === 'setor' ? 'setoran' : 'penarikan'} masal (Total: ${formatRp(totalBatchAmount)})!`, 'success');

    // Build Class Broadcast WA Summary Text & Prompt Modal
    openBatchWaSummaryModal(type, category, date, note, processedList, totalBatchAmount);
}

// WA GATEWAY BACKGROUND ENGINE & CONFIG
let waConfig = {
    provider: 'custom',
    url: 'http://localhost:3000/send-message',
    token: '',
    autoBackground: true
};

function loadWaConfig() {
    const saved = localStorage.getItem(STORAGE_WA_CONFIG_KEY);
    if (saved) {
        try { waConfig = JSON.parse(saved); } catch(e) {}
    }
}

function saveWaConfigState() {
    localStorage.setItem(STORAGE_WA_CONFIG_KEY, JSON.stringify(waConfig));
}

function openWaConfigModal() {
    loadWaConfig();
    document.getElementById('wa-provider').value = waConfig.provider || 'custom';
    document.getElementById('wa-api-url').value = waConfig.url || 'http://localhost:3000/send-message';
    document.getElementById('wa-api-token').value = waConfig.token || '';
    document.getElementById('wa-auto-background').checked = waConfig.autoBackground !== false;
    openModal('modal-wa-config');
}

function saveWaConfig(e) {
    e.preventDefault();
    waConfig.provider = document.getElementById('wa-provider').value;
    waConfig.url = document.getElementById('wa-api-url').value.trim();
    waConfig.token = document.getElementById('wa-api-token').value.trim();
    waConfig.autoBackground = document.getElementById('wa-auto-background').checked;

    saveWaConfigState();
    closeModal('modal-wa-config');
    showToast('Pengaturan WA Gateway API berhasil disimpan!', 'success');
}

// Async Background WA Gateway Dispatch (No Third Party Browser Apps/Tabs Required!)
async function dispatchWaGatewayBackground(tx, student) {
    if (!waConfig.url || !student.phone) return false;

    const formattedPhone = formatWaPhone(student.phone);
    const messageText = buildWaMessageText(tx, student);

    try {
        const formData = new FormData();
        formData.append('target', formattedPhone);
        formData.append('message', messageText);
        if (waConfig.token) formData.append('token', waConfig.token);

        const response = await fetch(waConfig.url, {
            method: 'POST',
            headers: waConfig.token ? { 'Authorization': waConfig.token } : {},
            body: formData
        });

        const result = await response.json().catch(() => ({ status: true }));
        console.log(`[WA Background Gateway] Notifikasi terkirim ke ${student.name} (${formattedPhone}):`, result);
        return true;
    } catch (err) {
        console.warn(`[WA Background Gateway] Attempt logged for ${student.name}:`, err);
        return false;
    }
}

// BATCH WA CLASS BROADCAST SUMMARY MODAL
function openBatchWaSummaryModal(type, category, date, note, processedList, totalAmount) {
    const isSetor = type === 'setor';
    const txLabel = isSetor ? 'SETORAN MASUK (+)' : 'PENARIKAN KELUAR (-)';
    const emoji = isSetor ? '📥' : '📤';

    document.getElementById('batch-wa-summary-title').innerText = `${processedList.length} Transaksi ${isSetor ? 'Setoran' : 'Penarikan'} Masal Berhasil`;
    document.getElementById('batch-wa-total-amount').innerText = formatRp(totalAmount);
    
    const waStatusText = (waConfig.autoBackground && waConfig.url && waConfig.token) 
        ? 'OTOMATIS TERKIRIM DI BACKGROUND (WA Gateway Active)' 
        : 'Standby (Siap Diposting Ke Grup WA)';
    document.getElementById('batch-wa-dispatch-status').innerText = waStatusText;

    let bText = `*${emoji} REKAPITULASI TRANSAKSI MASAL (BATCH)*\n`;
    bText += `*SMK PGRI 11 CILEDUG KOTA TANGERANG*\n`;
    bText += `Kelas: XII Bisnis Ritel 1 (BR 1)\n`;
    bText += `-------------------------------------------\n`;
    bText += `📌 *Jenis Transaksi:* ${txLabel}\n`;
    bText += `🏷️ *Kategori:* ${category}\n`;
    bText += `🕒 *Waktu Transaksi:* ${formatDateTime(date)}\n`;
    bText += `📝 *Catatan:* ${note}\n`;
    bText += `👥 *Total Siswa Diproses:* ${processedList.length} Siswa\n`;
    bText += `💰 *TOTAL NOMINAL MASAL:* *${formatRp(totalAmount)}*\n`;
    bText += `-------------------------------------------\n\n`;
    bText += `*RINCIAN PER SISWA:*\n`;

    processedList.forEach((item, idx) => {
        bText += `${idx + 1}. *${item.student.name}* (NISN: ${item.student.nisn})\n`;
        bText += `   ↳ ${isSetor ? 'Setor' : 'Tarik'}: ${formatRp(item.amount)} | Saldo Akhir: *${formatRp(item.student.balance)}*\n`;
    });

    bText += `\n-------------------------------------------\n`;
    bText += `Wali Kelas: *Yoga Rahmanda, S.Pd.*\n`;
    bText += `_Laporan kas dan tabungan resmi XII BR 1 SMK PGRI 11 Ciledug._`;

    document.getElementById('batch-wa-broadcast-text').value = bText;
    openModal('modal-batch-wa-summary');
}

function copyBatchWaSummaryText() {
    const txtArea = document.getElementById('batch-wa-broadcast-text');
    txtArea.select();
    document.execCommand('copy');
    showToast('Teks Rekap Broadcast WA berhasil disalin ke Clipboard!', 'success');
}

// Modal System
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// EDIT PROFIL, PASFOTO & TARGET TABUNGAN MODAL
function openEditTargetModal(studentId) {
    const student = appStudents.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('target-student-id').value = student.id;
    document.getElementById('target-student-name').value = `${student.name} (NISN: ${student.nisn})`;
    document.getElementById('target-student-phone').value = student.phone || '';
    document.getElementById('target-amount-input').value = student.target || 2000000;
    document.getElementById('target-student-photo-val').value = student.photo || '';

    updateEditSinglePhotoDisplay(student.photo, student.name);

    openModal('modal-edit-target');
}

function updateEditSinglePhotoDisplay(photoUrl, studentName) {
    const imgEl = document.getElementById('edit-single-photo-img');
    const fallbackEl = document.getElementById('edit-single-photo-fallback');
    const name = studentName || 'S';

    if (photoUrl && photoUrl.trim()) {
        imgEl.src = photoUrl;
        imgEl.style.display = 'block';
        fallbackEl.style.display = 'none';
    } else {
        imgEl.style.display = 'none';
        fallbackEl.style.display = 'flex';
        fallbackEl.innerText = name.charAt(0).toUpperCase();
        fallbackEl.style.background = getStudentAvatarGradient(name);
    }
}

function triggerEditSinglePhotoUpload() {
    const inp = document.getElementById('edit-single-photo-file');
    if (inp) inp.click();
}

async function handleEditSinglePhotoFile(file) {
    if (!file) return;
    showToast('Mengompres dan menyimpan pasfoto siswa...', 'info');

    const base64 = await compressImageFile(file, 240, 300, 0.78);
    if (!base64) {
        showToast('Gagal memproses file foto.', 'danger');
        return;
    }

    const photoVal = document.getElementById('target-student-photo-val');
    if (photoVal) photoVal.value = base64;

    const studentId = document.getElementById('target-student-id').value;
    const student = appStudents.find(s => s.id === studentId);
    if (student) {
        student.photo = base64;
        updateEditSinglePhotoDisplay(base64, student.name);
        await saveToFirebaseDatabase(true);
        renderAllViews();
        showToast(`Pasfoto ${student.name} LANGSUNG TERSIMPAN ke Firebase!`, 'success');
    }
}

function promptEditSinglePhotoUrl() {
    const photoVal = document.getElementById('target-student-photo-val');
    const current = photoVal ? photoVal.value : '';
    const url = prompt('Masukkan URL foto online (https://...) atau path lokal (assets/students/...):', current);
    if (url === null) return;

    const trimmed = url.trim();
    if (photoVal) photoVal.value = trimmed;

    const studentId = document.getElementById('target-student-id').value;
    const student = appStudents.find(s => s.id === studentId);
    if (student) {
        student.photo = trimmed || null;
        updateEditSinglePhotoDisplay(trimmed, student.name);
        saveToFirebaseDatabase(true);
        renderAllViews();
        showToast('URL foto berhasil diterapkan & LANGSUNG TERSIMPAN ke Firebase!', 'success');
    }
}

function removeEditSinglePhoto() {
    const photoVal = document.getElementById('target-student-photo-val');
    if (photoVal) photoVal.value = '';

    const studentId = document.getElementById('target-student-id').value;
    const student = appStudents.find(s => s.id === studentId);
    if (student) {
        student.photo = null;
        updateEditSinglePhotoDisplay('', student.name);
        saveToFirebaseDatabase(true);
        renderAllViews();
        showToast('Foto siswa dihapus & LANGSUNG TERSIMPAN ke Firebase.', 'info');
    }
}

function handleTargetSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('target-student-id').value;
    const newTarget = Number(document.getElementById('target-amount-input').value) || 2000000;
    const newPhone = document.getElementById('target-student-phone').value.trim();
    const newPhoto = document.getElementById('target-student-photo-val').value.trim() || null;

    const studentIndex = appStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        const student = appStudents[studentIndex];
        student.target = newTarget;
        student.phone = newPhone;
        student.photo = newPhoto;

        saveStudents();
        renderAllViews();
        closeModal('modal-edit-target');

        showFeedbackSuccessModal(
            'Data & Pasfoto Siswa Berhasil Diperbarui!',
            `Profil, pasfoto, target tabungan ${student.name} (${formatRp(newTarget)}), dan no WhatsApp berhasil diperbarui secara permanen.`
        );
    }
}

// Open Transaction Modal
function openTransactionModal(type = 'setor', studentId = '') {
    document.getElementById('tx-type').value = type;
    const titleEl = document.getElementById('modal-tx-title');
    const submitBtn = document.getElementById('btn-tx-submit');

    if (type === 'setor') {
        titleEl.innerHTML = `<i class="fa-solid fa-circle-plus text-emerald"></i> Catat Setoran Uang Masuk`;
        submitBtn.className = 'btn btn-emerald';
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Setoran & Notifikasi WA`;
        const catSelect = document.getElementById('tx-category');
        if (catSelect) {
            catSelect.innerHTML = `<option value="Tabungan Harian" selected>Tabungan Harian</option>`;
            catSelect.value = 'Tabungan Harian';
        }
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-circle-minus text-rose"></i> Catat Penarikan Uang Keluar`;
        submitBtn.className = 'btn btn-rose';
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Penarikan & Notifikasi WA`;
        const catSelect = document.getElementById('tx-category');
        if (catSelect) {
            catSelect.innerHTML = `
                <option value="Penarikan Tabungan" selected>Penarikan Tabungan</option>
                <option value="Keperluan Ujian/Praktik">Keperluan Ujian/Praktik</option>
                <option value="Pengembalian Sisa Kas">Pengembalian Sisa Kas</option>
                <option value="Lainnya">Lainnya</option>
            `;
        }
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('tx-date').value = now.toISOString().slice(0, 16);

    document.getElementById('tx-amount').value = '';
    document.getElementById('tx-note').value = '';

    if (studentId) {
        document.getElementById('tx-student-id').value = studentId;
        updateModalStudentInfo(studentId);
    } else {
        document.getElementById('tx-student-id').value = '';
        document.getElementById('modal-student-banner').classList.add('hidden');
    }

    openModal('modal-transaction');
}

function quickSetor(studentId) {
    openTransactionModal('setor', studentId);
}

function updateModalStudentInfo(studentId) {
    const banner = document.getElementById('modal-student-banner');
    if (!studentId) {
        banner.classList.add('hidden');
        return;
    }
    const student = appStudents.find(s => s.id === studentId);
    if (student) {
        document.getElementById('banner-student-name').innerText = student.name;
        document.getElementById('banner-student-balance').innerText = formatRp(student.balance);
        banner.classList.remove('hidden');
    }
}

// Submit Transaction & Trigger WhatsApp Notification Modal
function handleTransactionSubmit(e) {
    e.preventDefault();

    const studentId = document.getElementById('tx-student-id').value;
    const type = document.getElementById('tx-type').value;
    const amount = Number(document.getElementById('tx-amount').value);
    const category = document.getElementById('tx-category').value;
    const date = document.getElementById('tx-date').value;
    const note = document.getElementById('tx-note').value;

    const studentIndex = appStudents.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
        showToast('Siswa tidak ditemukan!', 'danger');
        return;
    }

    const student = appStudents[studentIndex];

    if (type === 'tarik' && amount > student.balance) {
        showToast(`Penarikan gagal! Saldo ${student.name} (${formatRp(student.balance)}) tidak mencukupi untuk penarikan ${formatRp(amount)}.`, 'danger');
        return;
    }

    if (type === 'setor') student.balance += amount;
    else student.balance -= amount;

    const txId = 'TX-' + Math.floor(1000 + Math.random() * 9000);
    const newTx = {
        id: txId,
        studentId: student.id,
        studentName: student.name,
        type: type,
        category: category,
        amount: amount,
        date: date,
        note: note
    };

    appTransactions.push(newTx);
    appTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    lastCreatedTx = newTx;

    saveStudents();
    saveTransactions();
    renderAllViews();
    if (currentUser.role === 'admin') updateChart();
    closeModal('modal-transaction');

    showToast(`Transaksi ${type === 'setor' ? 'Setoran' : 'Penarikan'} ${formatRp(amount)} berhasil disimpan!`, 'success');

    // Prompt WhatsApp Notification Modal for Admin
    openWaPromptModal(newTx, student);
}

// WHATSAPP NOTIFICATION ENGINE & FORMATTERS
function formatWaDate(dtStr) {
    if (!dtStr) return '-';
    const d = new Date(dtStr);
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

function formatWaTime(dtStr) {
    if (!dtStr) return '-';
    const d = new Date(dtStr);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes}`;
}

function formatWaRp(amount) {
    return 'Rp' + Number(amount || 0).toLocaleString('id-ID');
}

function buildWaMessageText(tx, student) {
    const isSetor = tx.type === 'setor';
    const txTypeStr = isSetor ? 'setoran tabungan siswa' : 'penarikan tabungan siswa';
    const txJenisStr = isSetor ? 'Setoran Tabungan' : 'Penarikan Tabungan';
    const txNominalLabel = isSetor ? 'Nominal Setoran' : 'Nominal Penarikan';
    const concludingSentence = isSetor 
        ? 'Setoran tersebut telah dicatat dan diperbarui pada administrasi tabungan kelas.' 
        : 'Penarikan tersebut telah dicatat dan diperbarui pada administrasi tabungan kelas.';

    const formattedDate = formatWaDate(tx.date);
    const formattedTime = `${formatWaTime(tx.date)} WIB`;
    const nominalFormatted = formatWaRp(tx.amount);
    const saldoFormatted = formatWaRp(student.balance);
    const targetFormatted = formatWaRp(student.target || 1000000);
    const keterangan = tx.note && tx.note.trim() ? tx.note.trim() : (isSetor ? 'Setoran harian kas kelas BR 1' : 'Penarikan kas kelas BR 1');
    const kategori = tx.category || (isSetor ? 'Tabungan Harian' : 'Penarikan Tabungan');

    let msg = `*PEMBERITAHUAN TRANSAKSI TABUNGAN SISWA*\n`;
    msg += `*SMK PGRI 11 CILEDUG KOTA TANGERANG*\n\n`;
    msg += `Yth. Bapak/Ibu Orang Tua/Wali Siswa\n`;
    msg += `serta Siswa Kelas XII Bisnis Ritel 1,\n\n`;
    msg += `Dengan hormat, kami menyampaikan bahwa telah tercatat transaksi *${txTypeStr}* dengan rincian sebagai berikut:\n\n`;
    msg += `*DATA SISWA*\n`;
    msg += `Nama        : *${student.name}*\n`;
    msg += `NISN        : ${student.nisn || '-'}\n`;
    msg += `Kelas       : XII Bisnis Ritel 1 (BR 1)\n\n`;
    msg += `*DETAIL TRANSAKSI*\n`;
    msg += `Jenis Transaksi : *${txJenisStr}*\n`;
    msg += `Kategori        : ${kategori}\n`;
    msg += `${txNominalLabel} : *${nominalFormatted}*\n`;
    msg += `Tanggal         : ${formattedDate}\n`;
    msg += `Waktu           : ${formattedTime}\n`;
    msg += `Keterangan      : ${keterangan}\n\n`;
    msg += `*INFORMASI TABUNGAN*\n`;
    msg += `Saldo Saat Ini  : *${saldoFormatted}*\n`;
    msg += `Target Tabungan : *${targetFormatted}*\n\n`;
    msg += `${concludingSentence}\n\n`;
    msg += `Demikian pemberitahuan ini disampaikan sebagai informasi kepada siswa dan orang tua/wali. Terima kasih atas perhatian dan kerja sama yang baik.\n\n`;
    msg += `Hormat kami,\n\n`;
    msg += `*Wali Kelas XII Bisnis Ritel 1*\n`;
    msg += `*Yoga Rahmanda, S.Pd.*\n\n`;
    msg += `--- \n\n`;
    msg += `*Pesan ini dikirim secara otomatis oleh Sistem Administrasi Tabungan Kelas XII BR 1 SMK PGRI 11 Ciledug.*\n`;
    msg += `*Mohon tidak membalas pesan ini.*`;

    return msg;
}

function openWaPromptModal(tx, student) {
    const waPhone = formatWaPhone(student.phone);
    const msgText = buildWaMessageText(tx, student);

    document.getElementById('wa-student-name').innerText = student.name;
    document.getElementById('wa-student-phone').innerText = student.phone || 'Belum Diisi';
    document.getElementById('wa-tx-summary').innerText = `${tx.type === 'setor' ? 'Setoran +' : 'Penarikan -'} ${formatRp(tx.amount)} (Saldo: ${formatRp(student.balance)})`;
    document.getElementById('wa-message-preview').value = msgText;

    const waLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(msgText)}`;
    document.getElementById('btn-send-wa-now').onclick = () => {
        window.open(waLink, '_blank');
        closeModal('modal-wa-prompt');
    };

    openModal('modal-wa-prompt');
}

function triggerWaDirect(txId) {
    const tx = appTransactions.find(t => t.id === txId);
    if (!tx) return;

    const student = appStudents.find(s => s.id === tx.studentId);
    if (!student) return;

    openWaPromptModal(tx, student);
}

// Add Student Modal
function openAddStudentModal() {
    document.getElementById('form-student').reset();
    openModal('modal-student');
}

function handleStudentSubmit(e) {
    e.preventDefault();
    const nisn = document.getElementById('student-nisn').value.trim();
    const name = document.getElementById('student-name').value.trim().toUpperCase();
    const phone = document.getElementById('student-phone').value.trim() || '081234567890';
    const password = document.getElementById('student-password').value.trim() || 'password123';
    const target = Number(document.getElementById('student-target').value) || 1000000;

    const exists = appStudents.some(s => s.nisn === nisn);
    if (exists) {
        showToast(`Gagal! Siswa dengan NISN ${nisn} sudah terdaftar.`, 'danger');
        return;
    }

    const newStudent = {
        id: 'STU-' + String(appStudents.length + 1).padStart(3, '0'),
        nisn: nisn,
        name: name,
        phone: phone,
        balance: 0,
        target: target,
        password: password
    };

    appStudents.push(newStudent);
    saveStudents();
    populateStudentDropdowns();
    renderAllViews();
    closeModal('modal-student');
    showToast(`Siswa ${name} berhasil ditambahkan ke daftar!`, 'success');
}

// Delete Transaction
function deleteTransaction(txId) {
    if (!confirm(`Apakah Anda yakin ingin menghapus catatan transaksi ${txId}? Saldo siswa akan disesuaikan kembali.`)) return;

    const txIndex = appTransactions.findIndex(t => t.id === txId);
    if (txIndex === -1) return;

    const tx = appTransactions[txIndex];
    const student = appStudents.find(s => s.id === tx.studentId);

    if (student) {
        if (tx.type === 'setor') student.balance -= tx.amount;
        else student.balance += tx.amount;
        saveStudents();
    }

    appTransactions.splice(txIndex, 1);
    saveTransactions();
    renderAllViews();
    if (currentUser.role === 'admin') updateChart();
    showToast(`Transaksi ${txId} berhasil dihapus.`, 'success');
}

// Passbook Modal
function openPassbookModal(studentId) {
    const student = appStudents.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('pb-nisn').innerText = `NISN: ${student.nisn}`;
    document.getElementById('pb-student-name').innerText = student.name;
    document.getElementById('pb-target').innerText = formatRp(student.target || 0);
    document.getElementById('pb-saldo').innerText = formatRp(student.balance);

    const photoContainer = document.getElementById('pb-photo-container');
    if (photoContainer) {
        if (student.photo) {
            photoContainer.innerHTML = `<img src="${student.photo}" alt="${escapeHtml(student.name)}" class="student-photo-img" onerror="this.onerror=null; this.parentElement.innerText='${student.name.charAt(0)}'; this.parentElement.style.background='${getStudentAvatarGradient(student.name)}';">`;
            photoContainer.style.background = '#0f172a';
        } else {
            photoContainer.innerHTML = student.name.charAt(0);
            photoContainer.style.background = getStudentAvatarGradient(student.name);
        }
    }

    const progress = student.target > 0 ? Math.min(100, Math.round((student.balance / student.target) * 100)) : 0;
    document.getElementById('pb-progress-text').innerText = `${progress}%`;
    document.getElementById('pb-progress-bar').style.width = `${progress}%`;

    const studentTx = appTransactions.filter(t => t.studentId === studentId).sort((a, b) => new Date(a.date) - new Date(b.date));

    let runningBalance = 0;
    const tbody = document.getElementById('pb-history-tbody');
    if (studentTx.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">Belum ada mutasi transaksi untuk siswa ini.</td></tr>`;
    } else {
        tbody.innerHTML = studentTx.map((t, idx) => {
            if (t.type === 'setor') runningBalance += t.amount;
            else runningBalance -= t.amount;

            return `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${formatDateTime(t.date)}</td>
                    <td>${escapeHtml(t.category)}</td>
                    <td>${escapeHtml(t.note || '-')}</td>
                    <td class="text-emerald">${t.type === 'setor' ? '+' + formatRp(t.amount) : '-'}</td>
                    <td class="text-rose">${t.type === 'tarik' ? '-' + formatRp(t.amount) : '-'}</td>
                    <td class="font-weight-bold">${formatRp(runningBalance)}</td>
                </tr>
            `;
        }).join('');
    }

    openModal('modal-passbook');
}

function printPassbook() {
    window.print();
}

// Receipt Modal
function openReceiptModal(txId) {
    const tx = appTransactions.find(t => t.id === txId);
    if (!tx) return;

    const student = appStudents.find(s => s.id === tx.studentId);

    document.getElementById('rc-code').innerText = tx.id;
    document.getElementById('rc-date').innerText = formatDateTime(tx.date);
    document.getElementById('rc-name').innerText = tx.studentName;
    document.getElementById('rc-type').innerText = tx.type === 'setor' ? 'SETORAN (MASUK)' : 'PENARIKAN (KELUAR)';
    document.getElementById('rc-type').className = `badge ${tx.type === 'setor' ? 'badge-emerald' : 'badge-rose'}`;
    document.getElementById('rc-category').innerText = tx.category;
    document.getElementById('rc-amount').innerText = formatRp(tx.amount);
    document.getElementById('rc-note').innerText = tx.note || '-';
    document.getElementById('rc-balance').innerText = student ? formatRp(student.balance) : '-';

    openModal('modal-receipt');
}

function printReceipt() {
    window.print();
}

// Global Search
function handleGlobalSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;

    switchTab('transaksi');
    document.getElementById('filter-search').value = q;
    applyTransactionFilters();
}

// Export CSV (Laporan Lengkap Rekap Harian, Mingguan, Bulanan & Per Siswa)
function exportToCSV() {
    let csvContent = "\uFEFF";
    csvContent += "=========================================================================\n";
    csvContent += "REKAPITULASI & LAPORAN RESMI TABUNGAN SISWA XII BISNIS RITEL 1\n";
    csvContent += "SMK PGRI 11 CILEDUG KOTA TANGERANG\n";
    csvContent += "Wali Kelas: Yoga Rahmanda, S.Pd. | Target Tabungan: Rp 2.000.000\n";
    csvContent += `Tanggal Cetak: ${new Date().toLocaleString('id-ID')}\n`;
    csvContent += "=========================================================================\n\n";

    // 1. REKAP HARIAN
    csvContent += "1. REKAPITULASI TABUNGAN HARIAN (PER HARI)\n";
    csvContent += "No,Tanggal,Jumlah Transaksi,Total Setoran (+),Total Penarikan (-),Arus Kas Bersih (Net),Rata-rata/TX\n";

    const dailyGroups = {};
    appTransactions.forEach(t => {
        const dKey = (t.date || '').slice(0, 10) || '2026-09-04';
        if (!dailyGroups[dKey]) dailyGroups[dKey] = { date: dKey, count: 0, setor: 0, tarik: 0 };
        dailyGroups[dKey].count++;
        if (t.type === 'setor') dailyGroups[dKey].setor += t.amount;
        else if (t.type === 'tarik') dailyGroups[dKey].tarik += t.amount;
    });

    const sortedDaily = Object.values(dailyGroups).sort((a, b) => new Date(b.date) - new Date(a.date));
    sortedDaily.forEach((d, idx) => {
        const net = d.setor - d.tarik;
        const avg = d.count > 0 ? (d.setor + d.tarik) / d.count : 0;
        csvContent += `"${idx + 1}","${d.date}","${d.count}","${d.setor}","${d.tarik}","${net}","${Math.round(avg)}"\n`;
    });

    // 2. REKAP BULANAN
    csvContent += "\n\n2. REKAPITULASI TABUNGAN BULANAN (PER BULAN)\n";
    csvContent += "No,Bulan & Tahun,Frekuensi Transaksi,Total Setoran (+),Total Penarikan (-),Surplus/Defisit Kas,Status\n";

    const monthlyGroups = {};
    appTransactions.forEach(t => {
        const mKey = (t.date || '').slice(0, 7) || '2026-09';
        if (!monthlyGroups[mKey]) monthlyGroups[mKey] = { ym: mKey, count: 0, setor: 0, tarik: 0 };
        monthlyGroups[mKey].count++;
        if (t.type === 'setor') monthlyGroups[mKey].setor += t.amount;
        else if (t.type === 'tarik') monthlyGroups[mKey].tarik += t.amount;
    });

    const sortedMonthly = Object.values(monthlyGroups).sort((a, b) => b.ym.localeCompare(a.ym));
    sortedMonthly.forEach((m, idx) => {
        const net = m.setor - m.tarik;
        csvContent += `"${idx + 1}","${m.ym}","${m.count}","${m.setor}","${m.tarik}","${net}","${net >= 0 ? 'SURPLUS' : 'DEFISIT'}"\n`;
    });

    // 3. REKAP PER SISWA
    csvContent += "\n\n3. DATA TABUNGAN 44 SISWA (TARGET: RP 2.000.000)\n";
    csvContent += "No,NISN,Nama Siswa,No WhatsApp,Target Tabungan,Total Setoran,Total Penarikan,Saldo Akhir,Status Target\n";

    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));
    sortedStudents.forEach((s, idx) => {
        const studentTx = appTransactions.filter(t => t.studentId === s.id);
        const setoran = studentTx.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
        const penarikan = studentTx.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
        const status = s.balance >= (s.target || 2000000) ? 'TERCAPAI' : 'PROSES';
        csvContent += `"${idx + 1}","'${s.nisn}","${s.name}","'${s.phone || ''}","${s.target || 2000000}","${setoran}","${penarikan}","${s.balance}","${status}"\n`;
    });

    // 4. RIWAYAT TRANSAKSI
    csvContent += "\n\n4. RIWAYAT LENGKAP MUTASI TRANSAKSI\n";
    csvContent += "Kode TX,Waktu Transaksi,NISN,Nama Siswa,Jenis,Kategori,Nominal,Catatan\n";

    const sortedTx = [...appTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedTx.forEach(t => {
        const student = appStudents.find(s => s.id === t.studentId);
        csvContent += `"${t.id}","${t.date}","'${student ? student.nisn : ''}","${t.studentName}","${t.type}","${t.category}","${t.amount}","${t.note || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Lengkap_Tabungan_SMK_PGRI_11_XII_BR1_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File Rekap Lengkap Excel/CSV (Harian, Bulanan & Siswa) berhasil diunduh!', 'success');
}

// Chart.js Graph
function initChart() {
    const chartEl = document.getElementById('savingsChart');
    if (!chartEl) return;
    const ctx = chartEl.getContext('2d');

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const setorData = new Array(12).fill(0);
    const tarikData = new Array(12).fill(0);

    appTransactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === 2026) {
            const m = d.getMonth();
            if (t.type === 'setor') setorData[m] += t.amount;
            else tarikData[m] += t.amount;
        }
    });

    if (savingsChartInstance) {
        savingsChartInstance.destroy();
    }

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const textColor = isLight ? '#334155' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.05)';

    savingsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Pemasukan (Setoran)',
                    data: setorData,
                    backgroundColor: 'rgba(16, 185, 129, 0.85)',
                    borderRadius: 4
                },
                {
                    label: 'Pengeluaran (Penarikan)',
                    data: tarikData,
                    backgroundColor: 'rgba(244, 63, 94, 0.85)',
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor, font: { family: 'Plus Jakarta Sans', weight: '600' } } }
            },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
                y: { ticks: { color: textColor }, grid: { color: gridColor } }
            }
        }
    });
}

function updateChart() {
    if (!savingsChartInstance) return;

    const setorData = new Array(12).fill(0);
    const tarikData = new Array(12).fill(0);

    appTransactions.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === 2026) {
            const m = d.getMonth();
            if (t.type === 'setor') setorData[m] += t.amount;
            else tarikData[m] += t.amount;
        }
    });

    savingsChartInstance.data.datasets[0].data = setorData;
    savingsChartInstance.data.datasets[1].data = tarikData;
    savingsChartInstance.update();
}

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const normalizedType = (type === 'danger' || type === 'error') ? 'danger' : type;
    toast.className = `toast toast-${normalizedType}`;

    let iconClass = 'fa-circle-check text-emerald';
    if (normalizedType === 'danger') {
        iconClass = 'fa-circle-xmark text-rose';
    } else if (normalizedType === 'warning') {
        iconClass = 'fa-triangle-exclamation text-amber';
    } else if (normalizedType === 'info') {
        iconClass = 'fa-circle-info text-primary';
    }

    toast.innerHTML = `
        <i class="fa-solid ${iconClass}"></i>
        <span>${escapeHtml(message)}</span>
        <button type="button" class="toast-close-btn" onclick="this.parentElement.remove()" title="Tutup Notifikasi">&times;</button>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, 4500);
}

// Helpers
function formatDateTime(dtStr) {
    if (!dtStr) return '-';
    const d = new Date(dtStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// ==========================================================================
// SISTEM BATCH EDIT DATA SISWA (SPREADSHEET-STYLE MASS EDITOR)
// ==========================================================================

let initialBatchSnapshot = [];

function openBatchEditStudentsModal() {
    if (currentUser && currentUser.role !== 'admin') {
        showToast('Akses ditolak: Menu ini khusus Wali Kelas / Admin.', 'error');
        return;
    }

    // Rekam snapshot awal sebelum terjadi pengeditan
    initialBatchSnapshot = JSON.parse(JSON.stringify(appStudents));

    renderBatchEditStudentRows();
    const searchInput = document.getElementById('batch-edit-search');
    if (searchInput) searchInput.value = '';
    
    const importPanel = document.getElementById('batch-import-panel');
    if (importPanel) importPanel.classList.add('hidden');

    openModal('modal-batch-edit-students');
}

function renderBatchEditStudentRows(studentsList = null) {
    const tbody = document.getElementById('batch-edit-students-tbody');
    if (!tbody) return;

    const list = studentsList || [...appStudents].sort((a, b) => a.name.localeCompare(b.name));
    const badge = document.getElementById('batch-edit-count-badge');
    if (badge) badge.innerText = `${list.length} Siswa Ditampilkan (Total: ${appStudents.length})`;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4">Tidak ada data siswa yang cocok dengan pencarian.</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map((s, idx) => {
        const thumbImg = s.photo 
            ? `<img src="${s.photo}" alt="${escapeHtml(s.name)}" id="batch-thumb-img-${s.id}">`
            : `<div id="batch-thumb-img-${s.id}" class="d-flex align-items-center justify-content-center w-100 h-100 font-weight-bold" style="background: ${getStudentAvatarGradient(s.name)}; font-size: 1.1rem; color: #fff;">${s.name.charAt(0)}</div>`;

        return `
        <tr data-student-id="${s.id}" class="batch-student-row">
            <td style="text-align: center;">
                <span class="small font-weight-bold text-muted">${idx + 1}</span>
            </td>
            <td>
                <div class="batch-photo-cell">
                    <div class="batch-thumb-container" onclick="triggerSingleStudentPhotoSelect('${s.id}')" title="Klik untuk upload/ganti file foto siswa">
                        <div class="batch-student-thumb" id="batch-thumb-box-${s.id}" style="margin-right: 0;">
                            ${thumbImg}
                        </div>
                        <div class="batch-thumb-overlay">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                    </div>
                    <div class="batch-photo-actions-btn">
                        <input type="file" id="batch-file-${s.id}" accept="image/*" style="display: none;" onchange="handleSingleStudentPhotoFile('${s.id}', this.files[0])">
                        <button type="button" class="batch-photo-btn-sm" onclick="triggerSingleStudentPhotoSelect('${s.id}')" title="Pilih File Foto">
                            <i class="fa-solid fa-upload"></i> Upload
                        </button>
                        <button type="button" class="batch-photo-btn-sm" onclick="promptStudentPhotoUrl('${s.id}')" title="Tempel Link URL / Path Foto">
                            <i class="fa-solid fa-link"></i> URL
                        </button>
                        <button type="button" class="batch-photo-btn-sm btn-remove-photo" id="batch-btn-remove-${s.id}" onclick="removeStudentPhoto('${s.id}')" title="Hapus Foto" style="${s.photo ? '' : 'display: none;'}">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <input type="hidden" class="batch-inp-photo" data-id="${s.id}" value="${escapeHtml(s.photo || '')}">
                </div>
            </td>
            <td>
                <input type="text" class="form-control batch-inp-name" value="${escapeHtml(s.name)}" required placeholder="Nama Siswa" data-id="${s.id}">
            </td>
            <td>
                <input type="text" class="form-control batch-inp-nisn font-monospace" value="${escapeHtml(s.nisn)}" required placeholder="NISN" data-id="${s.id}">
            </td>
            <td>
                <input type="text" class="form-control batch-inp-phone font-monospace" value="${escapeHtml(s.phone || '')}" placeholder="08xxxxxxxxxx" data-id="${s.id}">
            </td>
            <td>
                <input type="number" class="form-control batch-inp-target font-weight-bold" value="${s.target || 2000000}" step="10000" min="0" placeholder="Target" data-id="${s.id}">
            </td>
            <td>
                <input type="text" class="form-control batch-inp-password font-monospace" value="${escapeHtml(s.password || 'password123')}" required placeholder="Password" data-id="${s.id}">
            </td>
            <td style="text-align: right;">
                <span class="badge badge-emerald font-weight-bold">${formatRp(s.balance || 0)}</span>
            </td>
        </tr>
        `;
    }).join('');
}

function triggerSingleStudentPhotoSelect(studentId) {
    const fileInput = document.getElementById(`batch-file-${studentId}`);
    if (fileInput) fileInput.click();
}

// Client-side lightweight image compressor (Mencegah quota exceeded localStorage)
function compressImageFile(file, maxWidth = 280, maxHeight = 350, quality = 0.8) {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith('image/')) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = function() {
                resolve(e.target.result);
            };
            img.src = e.target.result;
        };
        reader.onerror = function() {
            resolve(null);
        };
        reader.readAsDataURL(file);
    });
}

async function handleSingleStudentPhotoFile(studentId, file) {
    if (!file) return;
    showToast('Memproses & menyimpan foto siswa...', 'info');

    const base64 = await compressImageFile(file, 240, 300, 0.78);
    if (!base64) {
        showToast('Gagal memproses file foto.', 'error');
        return;
    }

    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (row) {
        const photoInp = row.querySelector('.batch-inp-photo');
        if (photoInp) photoInp.value = base64;

        const previewBox = row.querySelector('.batch-photo-preview-box');
        if (previewBox) {
            previewBox.innerHTML = `<img src="${base64}" alt="Foto" class="batch-preview-img">`;
        }
    }

    const student = appStudents.find(s => s.id === studentId);
    if (student) {
        student.photo = base64;
        await saveToFirebaseDatabase(true);
        renderAllViews();
        showToast(`Foto ${student.name} LANGSUNG TERSIMPAN ke Firebase!`, 'success');
    }
}

function promptStudentPhotoUrl(studentId) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    const currentVal = row ? (row.querySelector('.batch-inp-photo').value || '') : '';
    const newUrl = prompt('Masukkan URL foto online (https://...) atau path lokal foto (assets/students/...):', currentVal);
    if (newUrl === null) return;

    const trimmed = newUrl.trim();
    if (row) {
        const photoInp = row.querySelector('.batch-inp-photo');
        if (photoInp) photoInp.value = trimmed;

        const student = appStudents.find(s => s.id === studentId);
        const name = student ? student.name : 'Siswa';
        const thumbBox = document.getElementById(`batch-thumb-box-${studentId}`);
        const removeBtn = document.getElementById(`batch-btn-remove-${studentId}`);

        if (trimmed) {
            if (thumbBox) thumbBox.innerHTML = `<img src="${trimmed}" alt="${escapeHtml(name)}" id="batch-thumb-img-${studentId}">`;
            if (removeBtn) removeBtn.style.display = 'inline-flex';
            if (student) student.photo = trimmed;
            showToast('URL foto berhasil diterapkan!', 'success');
        } else {
            removeStudentPhoto(studentId);
        }
    }
}

function removeStudentPhoto(studentId) {
    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (row) {
        const photoInp = row.querySelector('.batch-inp-photo');
        if (photoInp) photoInp.value = '';

        const nameInp = row.querySelector('.batch-inp-name');
        const name = nameInp ? nameInp.value : 'S';
        const thumbBox = document.getElementById(`batch-thumb-box-${studentId}`);
        if (thumbBox) {
            thumbBox.innerHTML = `<div id="batch-thumb-img-${studentId}" class="d-flex align-items-center justify-content-center w-100 h-100 font-weight-bold" style="background: ${getStudentAvatarGradient(name)}; font-size: 1.1rem; color: #fff;">${name.charAt(0)}</div>`;
        }

        const removeBtn = document.getElementById(`batch-btn-remove-${studentId}`);
        if (removeBtn) removeBtn.style.display = 'none';

        const student = appStudents.find(s => s.id === studentId);
        if (student) student.photo = null;

        showToast('Foto siswa dihapus (kembali ke avatar inisial).', 'info');
    }
}

async function handleBatchMultiPhotoUpload(files) {
    if (!files || files.length === 0) return;

    showToast(`Memproses ${files.length} foto sekaligus & menyimpan ke Firebase...`, 'info');
    let matchedCount = 0;
    let unmatched = [];

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const rawFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        const cleanName = rawFileName.trim().toLowerCase();

        // Cari berdasarkan NISN atau Nama
        const student = appStudents.find(s => {
            const sNisn = (s.nisn || '').toLowerCase();
            const sName = (s.name || '').toLowerCase();
            return cleanName === sNisn || cleanName === sName || sName.includes(cleanName) || cleanName.includes(sName);
        });

        if (student) {
            const base64 = await compressImageFile(file, 240, 300, 0.78);
            if (base64) {
                student.photo = base64;
                const row = document.querySelector(`tr[data-student-id="${student.id}"]`);
                if (row) {
                    const photoInp = row.querySelector('.batch-inp-photo');
                    if (photoInp) photoInp.value = base64;
                    const previewBox = row.querySelector('.batch-photo-preview-box');
                    if (previewBox) {
                        previewBox.innerHTML = `<img src="${base64}" alt="${escapeHtml(student.name)}" class="batch-preview-img">`;
                    }
                }
                matchedCount++;
            }
        } else {
            unmatched.push(file.name);
        }
    }

    if (matchedCount > 0) {
        await saveToFirebaseDatabase(true);
        renderAllViews();
        showFeedbackSuccessModal(
            'Upload Foto Massal Berhasil!',
            `${matchedCount} foto siswa berhasil dicocokkan dan LANGSUNG TERSIMPAN ke Firebase Cloud!` +
            (unmatched.length > 0 ? `\n\n(${unmatched.length} foto tidak cocok dengan nama/NISN: ${unmatched.slice(0, 3).join(', ')}...)` : '')
        );
    } else {
        showToast('Tidak ada foto yang cocok dengan nama siswa atau NISN.', 'warning');
    }
}

// Simpan data dari DOM ke in-memory appStudents sebelum filtering
function syncBatchTableInputsToMemory() {
    const rows = document.querySelectorAll('.batch-student-row');
    rows.forEach(row => {
        const studentId = row.getAttribute('data-student-id');
        const student = appStudents.find(s => s.id === studentId);
        if (!student) return;

        const nameInp = row.querySelector('.batch-inp-name');
        const nisnInp = row.querySelector('.batch-inp-nisn');
        const phoneInp = row.querySelector('.batch-inp-phone');
        const targetInp = row.querySelector('.batch-inp-target');
        const passInp = row.querySelector('.batch-inp-password');
        const photoInp = row.querySelector('.batch-inp-photo');

        if (nameInp && nameInp.value.trim()) student.name = nameInp.value.trim();
        if (nisnInp && nisnInp.value.trim()) student.nisn = nisnInp.value.trim();
        if (phoneInp) student.phone = phoneInp.value.trim();
        if (targetInp && !isNaN(parseInt(targetInp.value, 10))) student.target = parseInt(targetInp.value, 10);
        if (passInp && passInp.value.trim()) student.password = passInp.value.trim();
        if (photoInp) student.photo = photoInp.value.trim() || null;
    });
}

function filterBatchEditStudentRows(query) {
    syncBatchTableInputsToMemory();

    const q = (query || '').toLowerCase().trim();
    if (!q) {
        renderBatchEditStudentRows();
        return;
    }

    const filtered = appStudents.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.nisn.includes(q) ||
        (s.phone && s.phone.includes(q))
    ).sort((a, b) => a.name.localeCompare(b.name));

    renderBatchEditStudentRows(filtered);
}

function applyBatchTargetToAll() {
    const massTargetInp = document.getElementById('mass-target-input');
    const val = parseInt(massTargetInp.value, 10);
    if (isNaN(val) || val < 0) {
        showToast('Masukkan nominal target yang valid terlebih dahulu!', 'error');
        return;
    }

    const inputs = document.querySelectorAll('.batch-inp-target');
    inputs.forEach(inp => {
        inp.value = val;
    });

    appStudents.forEach(s => s.target = val);

    showToast(`Target Rp ${val.toLocaleString('id-ID')} berhasil diterapkan ke seluruh kolom siswa!`, 'success');
}

function applyBatchPasswordToAll() {
    const newPass = prompt('Masukkan password baru untuk SEMUA siswa:', 'password123');
    if (newPass === null) return;
    if (!newPass.trim()) {
        showToast('Password tidak boleh kosong!', 'error');
        return;
    }

    const inputs = document.querySelectorAll('.batch-inp-password');
    inputs.forEach(inp => {
        inp.value = newPass.trim();
    });

    appStudents.forEach(s => s.password = newPass.trim());

    showToast(`Password massal '${newPass.trim()}' berhasil diterapkan ke seluruh kolom siswa!`, 'success');
}

function toggleBatchImportBox() {
    const panel = document.getElementById('batch-import-panel');
    if (panel) panel.classList.toggle('hidden');
}

function processBatchImportText() {
    const textarea = document.getElementById('batch-import-textarea');
    if (!textarea || !textarea.value.trim()) {
        showToast('Silakan tempel teks spreadsheet data siswa terlebih dahulu!', 'error');
        return;
    }

    const lines = textarea.value.trim().split('\n').map(l => l.trim()).filter(Boolean);
    let updatedCount = 0;

    lines.forEach(line => {
        // Support tab-delimited or comma-delimited
        const parts = line.includes('\t') ? line.split('\t') : line.split(',');
        if (parts.length < 2) return;

        const name = parts[0].trim();
        const nisn = parts[1].trim();
        const phone = parts[2] ? parts[2].trim() : '';
        const target = parts[3] ? parseInt(parts[3].replace(/[^\d]/g, ''), 10) : null;
        const pass = parts[4] ? parts[4].trim() : '';
        const photo = parts[5] ? parts[5].trim() : '';

        // Match with existing rows
        const nameInp = Array.from(document.querySelectorAll('.batch-inp-name')).find(inp => 
            inp.value.toLowerCase().trim() === name.toLowerCase()
        );

        if (nameInp) {
            const studentId = nameInp.dataset.id;
            const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
            if (row) {
                if (nisn) row.querySelector('.batch-inp-nisn').value = nisn;
                if (phone) row.querySelector('.batch-inp-phone').value = phone;
                if (target !== null && !isNaN(target)) row.querySelector('.batch-inp-target').value = target;
                if (pass) row.querySelector('.batch-inp-password').value = pass;
                if (photo) {
                    const photoInp = row.querySelector('.batch-inp-photo');
                    if (photoInp) photoInp.value = photo;
                    const thumbBox = document.getElementById(`batch-thumb-box-${studentId}`);
                    if (thumbBox) thumbBox.innerHTML = `<img src="${photo}" alt="${escapeHtml(name)}" id="batch-thumb-img-${studentId}">`;
                }
                updatedCount++;
            }
        }
    });

    showToast(`Berhasil mencocokkan & mengisi ${updatedCount} baris data siswa dari spreadsheet!`, 'success');
    toggleBatchImportBox();
}

function exportStudentsToCSV() {
    syncBatchTableInputsToMemory();

    const headers = ['ID', 'Nama Lengkap', 'NISN', 'No. WhatsApp', 'Saldo Tabungan', 'Target Tabungan', 'Password Siswa', 'URL Foto'];
    const rows = appStudents.map(s => [
        s.id,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.nisn}"`,
        `"${s.phone || ''}"`,
        s.balance || 0,
        s.target || 2000000,
        `"${s.password || 'password123'}"`,
        `"${s.photo || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_siswa_xii_br1_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File CSV Data Siswa berhasil diunduh!', 'success');
}

function detectBatchChanges() {
    syncBatchTableInputsToMemory();
    const changes = [];

    appStudents.forEach(curr => {
        const init = initialBatchSnapshot.find(s => s.id === curr.id);
        if (!init) return;

        const studentDiffs = [];
        if (init.name !== curr.name) {
            studentDiffs.push({ field: 'name', label: 'Nama', oldVal: init.name, newVal: curr.name, tagClass: 'tag-name' });
        }
        if (init.nisn !== curr.nisn) {
            studentDiffs.push({ field: 'nisn', label: 'NISN', oldVal: init.nisn, newVal: curr.nisn, tagClass: 'tag-nisn' });
        }
        if ((init.phone || '') !== (curr.phone || '')) {
            studentDiffs.push({ field: 'phone', label: 'WhatsApp', oldVal: init.phone || '-', newVal: curr.phone || '-', tagClass: 'tag-phone' });
        }
        if ((init.target || 2000000) !== (curr.target || 2000000)) {
            studentDiffs.push({ field: 'target', label: 'Target', oldVal: formatRp(init.target || 2000000), newVal: formatRp(curr.target || 2000000), tagClass: 'tag-target' });
        }
        if ((init.password || 'password123') !== (curr.password || 'password123')) {
            studentDiffs.push({ field: 'password', label: 'Password', oldVal: '******', newVal: curr.password, tagClass: 'tag-pass' });
        }
        if ((init.photo || '') !== (curr.photo || '')) {
            studentDiffs.push({ field: 'photo', label: 'Pasfoto', oldVal: init.photo ? 'Foto Lama' : 'Inisial', newVal: curr.photo ? 'Foto Baru Diperbarui' : 'Dihapus', tagClass: 'tag-photo' });
        }

        if (studentDiffs.length > 0) {
            changes.push({
                student: curr,
                diffs: studentDiffs
            });
        }
    });

    return changes;
}

function handleSaveBatchEditStudents(event) {
    if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
    }

    // Sinkronkan input tabel ke memori
    syncBatchTableInputsToMemory();

    // Validasi dasar
    const invalidStudent = appStudents.find(s => !s.name || !s.nisn);
    if (invalidStudent) {
        showToast(`Nama dan NISN tidak boleh kosong untuk ID: ${invalidStudent.id}`, 'error');
        return;
    }

    // Deteksi perubahan
    const changes = detectBatchChanges();

    if (changes.length === 0) {
        showToast('Tidak ada perubahan data yang terdeteksi. Semua data sudah sesuai.', 'info');
        closeModal('modal-batch-edit-students');
        return;
    }

    // Tampilkan Pop-up Ringkasan Konfirmasi Perubahan
    const countBadge = document.getElementById('confirm-changes-count-badge');
    if (countBadge) countBadge.innerText = `${changes.length} Siswa Mengalami Perubahan Data`;

    const listContainer = document.getElementById('confirm-changes-list-container');
    if (listContainer) {
        listContainer.innerHTML = changes.map(item => {
            const s = item.student;
            const thumbHtml = s.photo 
                ? `<img src="${s.photo}" alt="${escapeHtml(s.name)}">`
                : `<div class="d-flex align-items-center justify-content-center w-100 h-100 font-weight-bold" style="background: ${getStudentAvatarGradient(s.name)}; font-size: 1.1rem; color: #fff;">${s.name.charAt(0)}</div>`;

            const diffTagsHtml = item.diffs.map(d => {
                if (d.field === 'photo') {
                    return `<span class="change-tag tag-photo"><i class="fa-solid fa-camera"></i> ${d.newVal}</span>`;
                }
                if (d.field === 'target') {
                    return `<span class="change-tag tag-target"><i class="fa-solid fa-bullseye"></i> Target: ${d.newVal}</span>`;
                }
                if (d.field === 'password') {
                    return `<span class="change-tag tag-pass"><i class="fa-solid fa-key"></i> Password diubah</span>`;
                }
                return `<span class="change-tag"><i class="fa-solid fa-pen"></i> ${d.label}: <strong>${escapeHtml(d.newVal)}</strong></span>`;
            }).join('');

            return `
            <div class="change-diff-card">
                <div class="change-diff-thumb">
                    ${thumbHtml}
                </div>
                <div class="change-diff-info">
                    <div class="change-diff-name">${escapeHtml(s.name)} <span class="badge badge-emerald small" style="font-size: 0.7rem;">NISN: ${s.nisn}</span></div>
                    <div class="change-diff-tags">
                        ${diffTagsHtml}
                    </div>
                </div>
            </div>
            `;
        }).join('');
    }

    openModal('modal-confirm-changes');
}

function executeBatchSaveConfirmed() {
    try {
        // Sinkronkan nama siswa ke riwayat mutasi transaksi
        appStudents.forEach(s => {
            appTransactions.forEach(t => {
                if (t.studentId === s.id) {
                    t.studentName = s.name;
                }
            });
        });

        // Simpan ke storage dan perbarui seluruh tampilan
        saveStudents();
        saveTransactions();
        populateStudentDropdowns();
        renderAllViews();
        if (typeof updateStatsCards === 'function') updateStatsCards();
        if (typeof updateChart === 'function') updateChart();

        // Update snapshot baru
        initialBatchSnapshot = JSON.parse(JSON.stringify(appStudents));

        closeModal('modal-confirm-changes');
        closeModal('modal-batch-edit-students');

        // Tampilkan Pop-up Sukses yang Mewah & Interaktif
        showFeedbackSuccessModal(
            'Perubahan Data Siswa Berhasil Disimpan!',
            `Data untuk ${appStudents.length} siswa kelas XII Bisnis Ritel 1 telah berhasil diperbarui dan disinkronkan secara permanen ke sistem.`
        );
    } catch (err) {
        console.error('Error saat menyimpan batch siswa:', err);
        showToast('Terjadi kendala saat menyimpan. Perubahan tetap dicoba disimpan.', 'error');
    }
}

function attemptCloseBatchEditModal() {
    const changes = detectBatchChanges();
    if (changes.length === 0) {
        closeModal('modal-batch-edit-students');
    } else {
        openModal('modal-unsaved-warning');
    }
}

function forceCloseBatchEditModal() {
    // Revert in-memory appStudents to snapshot
    if (initialBatchSnapshot && initialBatchSnapshot.length > 0) {
        appStudents = JSON.parse(JSON.stringify(initialBatchSnapshot));
    }
    closeModal('modal-unsaved-warning');
    closeModal('modal-batch-edit-students');
    renderBatchEditStudentRows();
    showToast('Perubahan dibatalkan.', 'info');
}

function showFeedbackSuccessModal(title, description) {
    const titleEl = document.getElementById('pop-success-title');
    const descEl = document.getElementById('pop-success-desc');
    if (titleEl) titleEl.innerText = title || 'Perubahan Berhasil Disimpan!';
    if (descEl) descEl.innerText = description || 'Data berhasil diperbarui ke seluruh sistem.';
    openModal('modal-feedback-success');
}

// ==========================================================================
// DATABASE EXPORT, BACKUP & VERCEL SEED SYNC HELPERS
// ==========================================================================

function getFullDatabaseExportObject() {
    const cleanedStudents = appStudents.map(s => {
        const copy = Object.assign({}, s);
        if (copy.photo && copy.photo.startsWith('data:image')) {
            copy.photo = `assets/students/${s.nisn}.jpg`;
        }
        return copy;
    });

    return {
        metadata: {
            database_name: 'db_tabungan_xii_br1',
            exported_at: new Date().toISOString(),
            total_students: appStudents.length,
            total_transactions: appTransactions.length,
            total_setor: appTransactions.filter(t => t.type === 'setor').reduce((a, b) => a + b.amount, 0),
            total_tarik: appTransactions.filter(t => t.type === 'tarik').reduce((a, b) => a + b.amount, 0),
            total_saldo: appTransactions.filter(t => t.type === 'setor').reduce((a, b) => a + b.amount, 0) - appTransactions.filter(t => t.type === 'tarik').reduce((a, b) => a + b.amount, 0)
        },
        students: cleanedStudents,
        transactions: appTransactions
    };
}

function exportFullDatabaseJSON() {
    const data = getFullDatabaseExportObject();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Database_Tabungan_XII_BR1_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File Backup Database JSON berhasil diunduh!', 'success');
}

function copySeedDataToClipboard() {
    const data = getFullDatabaseExportObject();
    const jsonStr = JSON.stringify(data, null, 2);
    const textarea = document.getElementById('db-sync-json-textarea');
    if (textarea) textarea.value = jsonStr;
    openModal('modal-db-sync');
}

function copySeedTextareaToClipboard() {
    const textarea = document.getElementById('db-sync-json-textarea');
    if (!textarea) return;
    textarea.select();
    navigator.clipboard.writeText(textarea.value).then(() => {
        showToast('Data JSON berhasil disalin ke Clipboard!', 'success');
    }).catch(() => {
        document.execCommand('copy');
        showToast('Data JSON berhasil disalin ke Clipboard!', 'success');
    });
}

// ==========================================================================
// STUDENT SELF PHOTO SETTINGS (Ubah Pasfoto Mandiri Siswa)
// ==========================================================================

function openStudentSelfPhotoModal() {
    if (!currentUser || currentUser.role !== 'siswa' || !currentUser.studentId) {
        showToast('Fitur ini khusus untuk akun siswa yang sedang login.', 'warning');
        return;
    }

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (!student) {
        showToast('Data akun siswa tidak ditemukan.', 'danger');
        return;
    }

    const photoVal = document.getElementById('self-photo-val');
    if (photoVal) photoVal.value = student.photo || '';

    const descEl = document.getElementById('self-photo-student-desc');
    if (descEl) descEl.innerText = `${student.name} (NISN: ${student.nisn})`;

    updateSelfPhotoPreviewDisplay(student.photo, student.name);
    openModal('modal-student-self-photo');
}

function updateSelfPhotoPreviewDisplay(photoUrl, studentName) {
    const imgEl = document.getElementById('self-photo-img');
    const fallbackEl = document.getElementById('self-photo-fallback');
    const name = studentName || (currentUser ? currentUser.name : 'S');

    if (photoUrl && photoUrl.trim()) {
        if (imgEl) {
            imgEl.src = photoUrl;
            imgEl.style.display = 'block';
        }
        if (fallbackEl) fallbackEl.style.display = 'none';
    } else {
        if (imgEl) imgEl.style.display = 'none';
        if (fallbackEl) {
            fallbackEl.style.display = 'flex';
            fallbackEl.innerText = name.charAt(0).toUpperCase();
            fallbackEl.style.background = getStudentAvatarGradient(name);
        }
    }
}

function triggerSelfPhotoUpload() {
    const inp = document.getElementById('self-photo-file-inp');
    if (inp) inp.click();
}

async function handleSelfPhotoFile(file) {
    if (!file) return;
    showToast('Mengompres dan menyimpan pasfoto profil...', 'info');

    const base64 = await compressImageFile(file, 240, 300, 0.78);
    if (!base64) {
        showToast('Gagal memproses file foto.', 'danger');
        return;
    }

    const photoVal = document.getElementById('self-photo-val');
    if (photoVal) photoVal.value = base64;

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (student) {
        student.photo = base64;
        currentUser.photo = base64;
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
        updateSelfPhotoPreviewDisplay(base64, student.name);
        await saveToFirebaseDatabase(true);
        renderAllViews();
        showToast('Pasfoto profil berhasil LANGSUNG TERSIMPAN ke Firebase!', 'success');
    }
}

function promptSelfPhotoUrl() {
    const photoVal = document.getElementById('self-photo-val');
    const current = photoVal ? photoVal.value : '';
    const url = prompt('Masukkan URL foto online (https://...) atau path lokal (assets/students/...):', current);
    if (url === null) return;

    const trimmed = url.trim();
    if (photoVal) photoVal.value = trimmed;

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (student) {
        student.photo = trimmed || null;
        currentUser.photo = trimmed || null;
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
        updateSelfPhotoPreviewDisplay(trimmed, student.name);
        saveToFirebaseDatabase(true);
        renderAllViews();
        showToast('URL pasfoto berhasil diterapkan & LANGSUNG TERSIMPAN ke Firebase!', 'success');
    }
}

function removeSelfPhoto() {
    const photoVal = document.getElementById('self-photo-val');
    if (photoVal) photoVal.value = '';

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (student) {
        student.photo = null;
        currentUser.photo = null;
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(currentUser));
        updateSelfPhotoPreviewDisplay('', student.name);
        saveToFirebaseDatabase(true);
        renderAllViews();
        showToast('Foto profil dihapus & LANGSUNG TERSIMPAN ke Firebase.', 'info');
    }
}

function handleStudentSelfPhotoSubmit(e) {
    e.preventDefault();
    if (!currentUser || !currentUser.studentId) return;

    const photoVal = document.getElementById('self-photo-val');
    const newPhoto = photoVal ? (photoVal.value.trim() || null) : null;

    const student = appStudents.find(s => s.id === currentUser.studentId || s.id === currentUser.id || s.nisn === currentUser.nisn);
    if (student) {
        student.photo = newPhoto;
        saveStudents();
        renderAllViews();
        closeModal('modal-student-self-photo');

        showFeedbackSuccessModal(
            'Pasfoto Berhasil Diperbarui!',
            `Pasfoto profil tabungan Anda (${student.name}) telah berhasil disimpan dan disinkronkan ke seluruh sistem.`
        );
    }
}


// Backup & Unduh Data Input LocalStorage Tanggal 28-29 September 2026
function downloadLocalStorageBackupSept28_29() {
    const potentialKeys = [
        'tabungbr1_transactions_v12',
        'tabungbr1_transactions_v11',
        'tabungbr1_transactions_v10',
        'tabungbr1_transactions_v9',
        'tabungbr1_transactions_v8',
        'tabungbr1_transactions_v7',
        'tabungbr1_transactions_v6',
        'tabungbr1_transactions_v5',
        'tabungbr1_transactions_v4',
        'tabungbr1_transactions_v3',
        'tabungbr1_transactions_v2',
        'tabungbr1_transactions_v1',
        'tabungbr1_transactions',
        'tabungan_transactions',
        'transactions'
    ];

    let foundTx = [];
    const seenIds = new Set();

    function checkAndAdd(t) {
        if (!t || (!t.id && !t.studentId)) return;
        const d = String(t.date || '');
        if (d.includes('2026-09-28') || d.includes('2026-09-29') || d.includes('2026-09-30')) {
            const idKey = t.id || (t.studentId + '_' + t.date + '_' + t.amount);
            if (!seenIds.has(idKey)) {
                seenIds.add(idKey);
                foundTx.push(t);
            }
        }
    }

    if (Array.isArray(appTransactions)) {
        appTransactions.forEach(checkAndAdd);
    }

    potentialKeys.forEach(k => {
        const raw = localStorage.getItem(k);
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    parsed.forEach(checkAndAdd);
                }
            } catch(e) {}
        }
    });

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        try {
            const val = localStorage.getItem(key);
            if (val && (val.includes('2026-09-28') || val.includes('2026-09-29'))) {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                    parsed.forEach(checkAndAdd);
                } else if (typeof parsed === 'object') {
                    checkAndAdd(parsed);
                }
            }
        } catch(e) {}
    }

    if (foundTx.length === 0) {
        let allLocalTx = [];
        potentialKeys.forEach(k => {
            const raw = localStorage.getItem(k);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(t => {
                            if (t && t.id && !seenIds.has(t.id)) {
                                seenIds.add(t.id);
                                allLocalTx.push(t);
                            }
                        });
                    }
                } catch(e) {}
            }
        });
        foundTx = allLocalTx;
    }

    if (foundTx.length === 0) {
        showToast('Tidak ditemukan data transaksi lokal di memori browser ini.', 'warning');
        return;
    }

    foundTx.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Create JSON Blob Download
    const jsonStr = JSON.stringify(foundTx, null, 2);
    const blobJson = new Blob([jsonStr], { type: 'application/json' });
    const urlJson = URL.createObjectURL(blobJson);
    const aJson = document.createElement('a');
    aJson.href = urlJson;
    aJson.download = 'backup_tabungan_28-29_september_2026.json';
    document.body.appendChild(aJson);
    aJson.click();
    document.body.removeChild(aJson);
    URL.revokeObjectURL(urlJson);

    // Sync to memory & Firebase if missing
    let addedCount = 0;
    foundTx.forEach(t => {
        const exists = appTransactions.some(ex => ex.id === t.id || (ex.studentId === t.studentId && ex.date === t.date && ex.amount === t.amount));
        if (!exists) {
            appTransactions.push(t);
            addedCount++;
            const student = appStudents.find(s => s.id === t.studentId);
            if (student) {
                if (t.type === 'setor') student.balance += t.amount;
                else if (t.type === 'tarik') student.balance -= t.amount;
            }
        }
    });

    if (addedCount > 0) {
        appTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        saveToFirebaseDatabase(true);
        renderAllViews();
    }

    showToast(`Berhasil mem-backup & mengunduh ${foundTx.length} transaksi (${addedCount} data disinkronkan ke Cloud)! `, 'success');
}
