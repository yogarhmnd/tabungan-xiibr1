/* ==========================================================================
   APPLICATION INTERACTIVITY & LOGIC: Tabungan Siswa XII BR 1
   SMK PGRI 11 CILEDUG KOTA TANGERANG
   Wali Kelas: Yoga Rahmanda, S.Pd.
   Features: WhatsApp Notification System & 44 Student Roster
   ========================================================================= */

// Storage Keys (Auto-seeded with 44 Official Students - Target Rp 2.000.000)
const STORAGE_STUDENTS_KEY = 'tabungbr1_students_v10';
const STORAGE_TX_KEY = 'tabungbr1_transactions_v10';
const STORAGE_AUTH_KEY = 'tabungbr1_session_v10';
const STORAGE_WA_CONFIG_KEY = 'tabungbr1_waconfig_v10';
const STORAGE_THEME_KEY = 'tabungbr1_theme_v10';

// Official Class List for XII Bisnis Ritel 1 (44 Students with Registered WhatsApp Phone Numbers)
const INITIAL_TRANSACTIONS = [
    {
        "id": "TRX-0242",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-01T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 1)"
    },
    {
        "id": "TRX-0003",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0014",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0037",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0053",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0069",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0075",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0085",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0103",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0113",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0121",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0135",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0139",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0143",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0182",
        "studentId": "STU-029",
        "studentName": "MUHAMMAD RAFA OKTAFIAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0184",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0192",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0222",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0237",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0243",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0257",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0265",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0278",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0286",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0304",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 30000,
        "date": "2026-08-03T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 3)"
    },
    {
        "id": "TRX-0001",
        "studentId": "STU-001",
        "studentName": "AFGAN AFFANDI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0004",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0015",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0032",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 6000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0038",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0054",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0060",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0076",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0086",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 18000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0101",
        "studentId": "STU-015",
        "studentName": "ERVANSYAH FAUZI NASUTION",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0104",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0114",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0122",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0132",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0136",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0144",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0155",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0169",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0206",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0238",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0258",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0266",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0279",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0305",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 30000,
        "date": "2026-08-04T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 4)"
    },
    {
        "id": "TRX-0005",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0016",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0033",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0039",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0055",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0061",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0070",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0077",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0087",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0102",
        "studentId": "STU-015",
        "studentName": "ERVANSYAH FAUZI NASUTION",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0105",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0115",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0123",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0133",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0137",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0156",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0170",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0193",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0207",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0223",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0239",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0253",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0259",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0267",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0287",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0301",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 8000,
        "date": "2026-08-05T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 5)"
    },
    {
        "id": "TRX-0002",
        "studentId": "STU-001",
        "studentName": "AFGAN AFFANDI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0006",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0017",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0034",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 6000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0036",
        "studentId": "STU-007",
        "studentName": "ANANDA NOVAN ALVIAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0040",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0056",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0062",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0078",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0088",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0106",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0134",
        "studentId": "STU-021",
        "studentName": "MARCEL MU'AMAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0138",
        "studentId": "STU-022",
        "studentName": "MELATI KESYAFANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0145",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0157",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0162",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0171",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0185",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0194",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0208",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0224",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0240",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0244",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0254",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0260",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0268",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0280",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0288",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0302",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0306",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 35000,
        "date": "2026-08-06T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 6)"
    },
    {
        "id": "TRX-0007",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0018",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0035",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0041",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0057",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0063",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0089",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 22000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0116",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0124",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0140",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0146",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0158",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0163",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0172",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0195",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0209",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0225",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0255",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0261",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0269",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0281",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0289",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0307",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-07T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 7)"
    },
    {
        "id": "TRX-0042",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0064",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0071",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0090",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0117",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0125",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0147",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0159",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0173",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0196",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0270",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0290",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0308",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 35000,
        "date": "2026-08-08T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 8)"
    },
    {
        "id": "TRX-0019",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0043",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 6000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0058",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0065",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0072",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 9000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0091",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0107",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0126",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0148",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0164",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0174",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0186",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0197",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0210",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0226",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0245",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0271",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0282",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0291",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-10T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 10)"
    },
    {
        "id": "TRX-0008",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0020",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0059",
        "studentId": "STU-009",
        "studentName": "AURA RIZKA AMELIA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0066",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0079",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0092",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0118",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0127",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0149",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0175",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0198",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0211",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0227",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0246",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0256",
        "studentId": "STU-037",
        "studentName": "SILFA NOVIYANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0262",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0292",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0303",
        "studentId": "STU-043",
        "studentName": "VIJAY MAHENDRA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-11T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 11)"
    },
    {
        "id": "TRX-0009",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0021",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0067",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0073",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0080",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0093",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0108",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0119",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0128",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0165",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 40000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0176",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0199",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0212",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0228",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0247",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0272",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0293",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TRX-0309",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-12T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 12)"
    },
    {
        "id": "TX-3588",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "tarik",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-15T09:21",
        "note": ""
    },
    {
        "id": "TRX-0044",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0074",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 14000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0081",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 8000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0129",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0141",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0183",
        "studentId": "STU-029",
        "studentName": "MUHAMMAD RAFA OKTAFIAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0187",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0200",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 6000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0213",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0229",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TRX-0294",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-18T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 18)"
    },
    {
        "id": "TX-1984",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "tarik",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-20T09:17",
        "note": ""
    },
    {
        "id": "TRX-0045",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0082",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 12000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0094",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0150",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0160",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0177",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0201",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0214",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TRX-0230",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-20T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 20)"
    },
    {
        "id": "TX-7662",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "tarik",
        "category": "Tabungan Harian",
        "amount": 100000,
        "date": "2026-08-21T09:07",
        "note": ""
    },
    {
        "id": "TRX-0046",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0095",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0109",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0120",
        "studentId": "STU-018",
        "studentName": "FITRIANI SALWA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0130",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0142",
        "studentId": "STU-023",
        "studentName": "MOH ILYAS",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0151",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0161",
        "studentId": "STU-026",
        "studentName": "MUHAMAD FINZA DESMAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0166",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 40000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0178",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0188",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0215",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0231",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0248",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0273",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0283",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-21T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 21)"
    },
    {
        "id": "TRX-0010",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0022",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0047",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0068",
        "studentId": "STU-010",
        "studentName": "CHARLIE NOVAL PRADANA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0096",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0152",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0179",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0202",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 7000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0216",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0249",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0263",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0274",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0295",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-22T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 22)"
    },
    {
        "id": "TRX-0011",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0023",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0028",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0083",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0131",
        "studentId": "STU-020",
        "studentName": "KURNIAWAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0153",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0180",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0189",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0203",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0217",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0232",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0241",
        "studentId": "STU-035",
        "studentName": "SAFIRA NAILA AGUSTIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 150000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0250",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0296",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-24T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 24)"
    },
    {
        "id": "TRX-0012",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0024",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0048",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 6000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0097",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0167",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0218",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0251",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0297",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-26T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 26)"
    },
    {
        "id": "TRX-0013",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0025",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0029",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0049",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0098",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0110",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0154",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0168",
        "studentId": "STU-027",
        "studentName": "MUHAMMAD ALNUR PASHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0190",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0204",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0219",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0233",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TRX-0252",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-27T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 27)"
    },
    {
        "id": "TX-1206",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "tarik",
        "category": "Tabungan Harian",
        "amount": 80000,
        "date": "2026-08-28T09:40",
        "note": ""
    },
    {
        "id": "TX-3211",
        "studentId": "STU-025",
        "studentName": "MUHAMAD APDIL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 80000,
        "date": "2026-08-28T10:04",
        "note": ""
    },
    {
        "id": "TRX-0026",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0030",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0050",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0111",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0234",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0275",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0284",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0298",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-28T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 28)"
    },
    {
        "id": "TRX-0051",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0084",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0099",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0220",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0235",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0276",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0299",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-29T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 29)"
    },
    {
        "id": "TRX-0027",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 15000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0031",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0052",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0100",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0112",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0181",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 25000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0191",
        "studentId": "STU-031",
        "studentName": "NIRWAN AKBAR",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0205",
        "studentId": "STU-032",
        "studentName": "OLIFIAH YULIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0221",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0236",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0264",
        "studentId": "STU-039",
        "studentName": "SRI WAHYUNINGSIH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0277",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0285",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TRX-0300",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-08-31T08:30:00.000Z",
        "note": "Setoran Buku Tabungan (Hari 31)"
    },
    {
        "id": "TX-B8758",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B2709",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B8596",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B7087",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B6916",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B1212",
        "studentId": "STU-036",
        "studentName": "SAVA QUINSHA AULIA YASMIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B6257",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B5806",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B6763",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 30000,
        "date": "2026-09-01T09:41",
        "note": "Setoran harian kas kelas BR 1 (Batch 9 Siswa)"
    },
    {
        "id": "TX-B2750",
        "studentId": "STU-002",
        "studentName": "AHMAD",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B9326",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B8032",
        "studentId": "STU-006",
        "studentName": "ALIP PIRMANSAH",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B5596",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B1873",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B1516",
        "studentId": "STU-017",
        "studentName": "FATIHATUS SHALIHA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B2539",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B8814",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B2272",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B6056",
        "studentId": "STU-038",
        "studentName": "SITI SARAH AZZAHRA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B9411",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B4629",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-02T09:43",
        "note": "Setoran harian kas kelas BR 1 (Batch 12 Siswa)"
    },
    {
        "id": "TX-B9891",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B6231",
        "studentId": "STU-005",
        "studentName": "ALFIESYA NUR RACHMAN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B4285",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B5294",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B7096",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B7877",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B2872",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B5168",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B9085",
        "studentId": "STU-040",
        "studentName": "SYAFIA MARIAM HIDAYAT",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B9592",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-B4074",
        "studentId": "STU-044",
        "studentName": "ZEIN KHA ABDUL",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-03T09:46",
        "note": "Setoran harian kas kelas BR 1 (Batch 11 Siswa)"
    },
    {
        "id": "TX-6144",
        "studentId": "STU-011",
        "studentName": "DESIANALESTARI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 50000,
        "date": "2026-09-04T08:42",
        "note": ""
    },
    {
        "id": "TX-B1804",
        "studentId": "STU-004",
        "studentName": "ALFI SYAHRI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B3065",
        "studentId": "STU-008",
        "studentName": "AUGRAH DWI AURAWATI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B1852",
        "studentId": "STU-012",
        "studentName": "DHEBI NURMALA",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B4033",
        "studentId": "STU-014",
        "studentName": "DOES SALAM",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B5930",
        "studentId": "STU-028",
        "studentName": "MUHAMMAD AMALUL ARIFIN",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 5000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B7609",
        "studentId": "STU-033",
        "studentName": "PUTRA HAIRUL LATIF",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B6560",
        "studentId": "STU-034",
        "studentName": "ROMDANI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 10000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B8720",
        "studentId": "STU-041",
        "studentName": "SYLVA ARDIANTI",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 100000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    },
    {
        "id": "TX-B6884",
        "studentId": "STU-042",
        "studentName": "TB. FADLAN AL-FAROJ",
        "type": "setor",
        "category": "Tabungan Harian",
        "amount": 20000,
        "date": "2026-09-04T09:50",
        "note": "Setoran harian kas kelas BR 1 (Batch 10 Siswa)"
    }
];

const OFFICIAL_STUDENTS = [
    {
        "id": "STU-001",
        "nisn": "0085191456",
        "name": "AFGAN AFFANDI",
        "photo": "assets/students/0085191456.jpg",
        "phone": "081234567001",
        "balance": 10000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-002",
        "nisn": "0082546680",
        "name": "AHMAD",
        "photo": "assets/students/0082546680.jpg",
        "phone": "081234567002",
        "balance": 65000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-003",
        "nisn": "0082865515",
        "name": "AHMAD DAI ROBI",
        "photo": "assets/students/0082865515.jpg",
        "phone": "081234567003",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-004",
        "nisn": "0092316992",
        "name": "ALFI SYAHRI",
        "photo": "assets/students/0092316992.jpg",
        "phone": "081234567004",
        "balance": 240000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-005",
        "nisn": "0085602576",
        "name": "ALFIESYA NUR RACHMAN",
        "photo": "assets/students/0085602576.jpg",
        "phone": "081234567005",
        "balance": 120000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-006",
        "nisn": "0087807942",
        "name": "ALIP PIRMANSAH",
        "photo": "assets/students/0087807942.jpg",
        "phone": "081234567006",
        "balance": 29000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-007",
        "nisn": "0086664698",
        "name": "ANANDA NOVAN ALVIAN",
        "photo": "assets/students/0086664698.jpg",
        "phone": "081234567007",
        "balance": 5000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-008",
        "nisn": "0082163626",
        "name": "AUGRAH DWI AURAWATI",
        "photo": "assets/students/0082163626.jpg",
        "phone": "081234567008",
        "balance": 182000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-009",
        "nisn": "0087919336",
        "name": "AURA RIZKA AMELIA",
        "photo": "assets/students/0087919336.jpg",
        "phone": "081234567009",
        "balance": 46000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-010",
        "nisn": "0086133724",
        "name": "CHARLIE NOVAL PRADANA",
        "photo": "assets/students/0086133724.jpg",
        "phone": "081234567010",
        "balance": 50000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-011",
        "nisn": "3080709342",
        "name": "DESIANALESTARI",
        "photo": "assets/students/3080709342.jpg",
        "phone": "081234567011",
        "balance": 150000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-012",
        "nisn": "0084895927",
        "name": "DHEBI NURMALA",
        "photo": "assets/students/0084895927.jpg",
        "phone": "081234567012",
        "balance": 150000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-013",
        "nisn": "0091881465",
        "name": "DINDA RAHMASARI SEPTIANA",
        "photo": "assets/students/0091881465.jpg",
        "phone": "081234567013",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-014",
        "nisn": "3092826253",
        "name": "DOES SALAM",
        "photo": "assets/students/3092826253.jpg",
        "phone": "081234567014",
        "balance": 400000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-015",
        "nisn": "0081666197",
        "name": "ERVANSYAH FAUZI NASUTION",
        "photo": "assets/students/0081666197.jpg",
        "phone": "081234567015",
        "balance": 10000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-016",
        "nisn": "0088134330",
        "name": "FADHLI DZIL JALAL",
        "photo": "assets/students/0088134330.jpg",
        "phone": "081234567016",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-017",
        "nisn": "3093487601",
        "name": "FATIHATUS SHALIHA",
        "photo": "assets/students/3093487601.jpg",
        "phone": "081234567017",
        "balance": 100000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-018",
        "nisn": "3084030878",
        "name": "FITRIANI SALWA",
        "photo": "assets/students/3084030878.jpg",
        "phone": "081234567018",
        "balance": 65000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-019",
        "nisn": "0092525525",
        "name": "ILHAM ADI SAPUTRA",
        "photo": "assets/students/0092525525.jpg",
        "phone": "081234567019",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-020",
        "nisn": "0083705721",
        "name": "KURNIAWAN",
        "photo": "assets/students/0083705721.jpg",
        "phone": "081234567020",
        "balance": 55000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-021",
        "nisn": "0097656255",
        "name": "MARCEL MU'AMAR",
        "photo": "assets/students/0097656255.jpg",
        "phone": "081234567021",
        "balance": 25000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-022",
        "nisn": "0092348363",
        "name": "MELATI KESYAFANI",
        "photo": "assets/students/0092348363.jpg",
        "phone": "081234567022",
        "balance": 20000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-023",
        "nisn": "0096716273",
        "name": "MOH ILYAS",
        "photo": "assets/students/0096716273.jpg",
        "phone": "081234567023",
        "balance": 32000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-024",
        "nisn": "0072822191",
        "name": "MUHAMAD ALVATAR",
        "photo": "assets/students/0072822191.jpg",
        "phone": "081234567024",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-025",
        "nisn": "0092170243",
        "name": "MUHAMAD APDIL",
        "photo": "assets/students/0092170243.jpg",
        "phone": "081234567025",
        "balance": 100000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-026",
        "nisn": "0082428075",
        "name": "MUHAMAD FINZA DESMAWAN",
        "photo": "assets/students/0082428075.jpg",
        "phone": "081234567026",
        "balance": 50000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-027",
        "nisn": "0159615200",
        "name": "MUHAMMAD ALNUR PASHA",
        "photo": "assets/students/0159615200.jpg",
        "phone": "081234567027",
        "balance": 160000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-028",
        "nisn": "0086723136",
        "name": "MUHAMMAD AMALUL ARIFIN",
        "photo": "assets/students/0086723136.jpg",
        "phone": "081234567028",
        "balance": 155000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-029",
        "nisn": "0098972007",
        "name": "MUHAMMAD RAFA OKTAFIAN",
        "photo": "assets/students/0098972007.jpg",
        "phone": "081234567029",
        "balance": 15000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-030",
        "nisn": "0098916344",
        "name": "MUHAMMAD RIVIANSYAH",
        "photo": "assets/students/0098916344.jpg",
        "phone": "081234567030",
        "balance": 0,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-031",
        "nisn": "0085877685",
        "name": "NIRWAN AKBAR",
        "photo": "assets/students/0085877685.jpg",
        "phone": "081234567031",
        "balance": 190000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-032",
        "nisn": "0094378426",
        "name": "OLIFIAH YULIANTI",
        "photo": "assets/students/0094378426.jpg",
        "phone": "081234567032",
        "balance": 88000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-033",
        "nisn": "0087295743",
        "name": "PUTRA HAIRUL LATIF",
        "photo": "assets/students/0087295743.jpg",
        "phone": "081234567033",
        "balance": 180000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-034",
        "nisn": "0075181099",
        "name": "ROMDANI",
        "photo": "assets/students/0075181099.jpg",
        "phone": "081234567034",
        "balance": 195000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-035",
        "nisn": "0086296055",
        "name": "SAFIRA NAILA AGUSTIN",
        "photo": "assets/students/0086296055.jpg",
        "phone": "081234567035",
        "balance": 170000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-036",
        "nisn": "0104662813",
        "name": "SAVA QUINSHA AULIA YASMIN",
        "photo": "assets/students/0104662813.jpg",
        "phone": "081234567036",
        "balance": 75000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-037",
        "nisn": "0087746448",
        "name": "SILFA NOVIYANTI",
        "photo": "assets/students/0087746448.jpg",
        "phone": "081234567037",
        "balance": 35000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-038",
        "nisn": "0093065485",
        "name": "SITI SARAH AZZAHRA",
        "photo": "assets/students/0093065485.jpg",
        "phone": "081234567038",
        "balance": 5000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-039",
        "nisn": "0097696921",
        "name": "SRI WAHYUNINGSIH",
        "photo": "assets/students/0097696921.jpg",
        "phone": "081234567039",
        "balance": 50000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-040",
        "nisn": "0097699869",
        "name": "SYAFIA MARIAM HIDAYAT",
        "photo": "assets/students/0097699869.jpg",
        "phone": "081234567040",
        "balance": 220000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-041",
        "nisn": "0095383788",
        "name": "SYLVA ARDIANTI",
        "photo": "assets/students/0095383788.jpg",
        "phone": "081234567041",
        "balance": 215000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-042",
        "nisn": "0084351493",
        "name": "TB. FADLAN AL-FAROJ",
        "photo": "assets/students/0084351493.jpg",
        "phone": "081234567042",
        "balance": 270000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-043",
        "nisn": "0083453775",
        "name": "VIJAY MAHENDRA",
        "photo": "assets/students/0083453775.jpg",
        "phone": "081234567043",
        "balance": 20000,
        "target": 2000000,
        "password": "password123"
    },
    {
        "id": "STU-044",
        "nisn": "0091351864",
        "name": "ZEIN KHA ABDUL",
        "photo": "assets/students/0091351864.jpg",
        "phone": "081234567044",
        "balance": 170000,
        "target": 2000000,
        "password": "password123"
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

    // Update Login Overlay Icon & Text
    const loginIcon = document.getElementById('theme-icon-login');
    const loginText = document.getElementById('theme-text-login');
    if (loginIcon) {
        loginIcon.className = isLight ? 'fa-solid fa-moon text-indigo' : 'fa-solid fa-sun text-amber';
    }
    if (loginText) {
        loginText.innerText = isLight ? 'Mode Gelap' : 'Mode Terang';
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
            // Saring pixel transparan atau putih/hitam polos agar warna utama logo terdeteksi tajam
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

// GRADIENT PALETTE UNTUK AVATAR SISWA (Modern & Dinamis)
function getStudentAvatarGradient(name) {
    const gradients = [
        'linear-gradient(135deg, #6366f1, #a855f7)', // Indigo - Purple
        'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyan - Blue
        'linear-gradient(135deg, #10b981, #059669)', // Emerald - Green
        'linear-gradient(135deg, #f59e0b, #d97706)', // Amber - Orange
        'linear-gradient(135deg, #ec4899, #8b5cf6)', // Pink - Violet
        'linear-gradient(135deg, #14b8a6, #0284c7)', // Teal - Sky
        'linear-gradient(135deg, #f43f5e, #be123c)', // Rose - Crimson
        'linear-gradient(135deg, #8b5cf6, #6366f1)'  // Purple - Indigo
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) % gradients.length;
    }
    return gradients[Math.abs(hash)];
}

// Load State from LocalStorage (Otomatis memuat seluruh 44 siswa resmi dengan target Rp 2.000.000)
function loadState() {
    let savedStudents = localStorage.getItem(STORAGE_STUDENTS_KEY);
    let savedTx = localStorage.getItem(STORAGE_TX_KEY);

    // Cek migrasi dari storage versi sebelumnya jika ada
    if (!savedStudents) {
        savedStudents = localStorage.getItem('tabungbr1_students_v10') || localStorage.getItem('tabungbr1_students_v10');
    }
    if (!savedTx) {
        savedTx = localStorage.getItem('tabungbr1_transactions_v10') || localStorage.getItem('tabungbr1_transactions_v10');
    }

    if (savedStudents) {
        try {
            const parsed = JSON.parse(savedStudents);
            // Salin data 44 siswa resmi dan tetapkan target tabungan ke Rp 2.000.000
            appStudents = OFFICIAL_STUDENTS.map((official) => {
                const found = parsed.find(s => s.nisn === official.nisn || s.id === official.id || s.name.toUpperCase() === official.name.toUpperCase());
                return {
                    id: official.id,
                    nisn: official.nisn,
                    name: official.name,
                    photo: (found && found.photo) ? found.photo : (official.photo || null),
                    phone: (found && found.phone) ? found.phone : official.phone,
                    balance: (found && typeof found.balance === 'number') ? found.balance : official.balance,
                    target: 2000000, // Target resmi Rp 2.000.000 seluruh siswa
                    password: official.password || 'password123'
                };
            });
            saveStudents();
        } catch(e) {
            appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
            saveStudents();
        }
    } else {
        // Inisialisasi awal: Otomatis memuat 44 siswa resmi dengan saldo dan target Rp 2.000.000
        appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
        saveStudents();
    }

    if (savedTx) {
        try {
            appTransactions = JSON.parse(savedTx);
        } catch(e) {
            appTransactions = (typeof INITIAL_TRANSACTIONS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)) : [];
        }
    } else {
        appTransactions = (typeof INITIAL_TRANSACTIONS !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS)) : [];
        saveTransactions();
    }
}

function saveStudents() {
    try {
        localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(appStudents));
    } catch (e) {
        console.warn('LocalStorage saveStudents error (quota exceeded):', e);
        // Jika kuota penuh karena foto terlalu besar, simpan data tanpa string gambar yang overload
        try {
            const lightweight = appStudents.map(s => {
                const copy = { ...s };
                if (copy.photo && copy.photo.length > 50000) {
                    // Foto lebih dari 50KB dipotong ke path lokal atau fallback
                    copy.photo = copy.photo.startsWith('data:') ? null : copy.photo;
                }
                return copy;
            });
            localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(lightweight));
        } catch (err2) {
            console.error('Gagal menyimpan ke LocalStorage:', err2);
        }
    }
}

function saveTransactions() {
    try {
        localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(appTransactions));
    } catch (e) {
        console.error('LocalStorage saveTransactions error:', e);
    }
}

// Reset all savings data to zero (Admin utility)
function resetAllSavingsData() {
    if (!confirm('Apakah Anda yakin ingin MENGHAPUS SEMUA DATA MUTASI TRANSAKSI dan MERESET SALDO seluruh 44 siswa menjadi Rp 0?')) return;
    
    appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
    appTransactions = [];
    saveStudents();
    saveTransactions();
    renderAllViews();
    if (currentUser && currentUser.role === 'admin') updateChart();
    showToast('Seluruh data tabungan berhasil di-reset menjadi Rp 0!', 'success');
}

// AUTH & ROLE SYSTEM
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
    e.preventDefault();
    const user = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();

    if (user === 'admin' && pass === 'admin123') {
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

// Filter dropdown 44 siswa secara langsung dari input pencarian
function filterLoginStudentDropdown(keyword) {
    const q = keyword.toLowerCase().trim();
    const loginSelect = document.getElementById('siswa-login-nisn');
    if (!loginSelect) return;

    const sorted = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));
    const filtered = q ? sorted.filter(s => s.name.toLowerCase().includes(q) || s.nisn.includes(q)) : sorted;

    loginSelect.innerHTML = `<option value="">-- Pilih 1 dari ${filtered.length} Siswa --</option>` +
        filtered.map((s, idx) => `<option value="${s.nisn}">${idx + 1}. ${s.name} (NISN: ${s.nisn})</option>`).join('');

    if (filtered.length === 1) {
        loginSelect.value = filtered[0].nisn;
        handleStudentSelectChange(filtered[0].nisn);
    } else if (filtered.length === 0) {
        handleStudentSelectChange('');
    }
}

function handleLoginSiswa(e) {
    e.preventDefault();
    const selectedNisn = document.getElementById('siswa-login-nisn').value;
    const passwordInput = document.getElementById('siswa-password').value.trim();

    if (!selectedNisn) {
        showToast('Silakan pilih salah satu dari 44 nama siswa terdaftar!', 'danger');
        return;
    }

    const student = appStudents.find(s => s.nisn === selectedNisn);
    if (!student) {
        showToast('Data siswa dengan NISN tersebut tidak ditemukan!', 'danger');
        return;
    }

    if (passwordInput === (student.password || 'password123')) {
        currentUser = {
            role: 'siswa',
            studentId: student.id,
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

// Populate Student Select Dropdowns (44 Students sorted)
function populateStudentDropdowns() {
    const loginSelect = document.getElementById('siswa-login-nisn');
    const txSelect = document.getElementById('tx-student-id');
    const filterSelect = document.getElementById('filter-student');

    const sorted = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));

    const optionsHtml = sorted.map((s, idx) => `<option value="${s.nisn}">${idx + 1}. ${s.name} (NISN: ${s.nisn})</option>`).join('');
    const txOptionsHtml = sorted.map((s, idx) => `<option value="${s.id}">${idx + 1}. ${s.name} (NISN: ${s.nisn})</option>`).join('');

    if (loginSelect) loginSelect.innerHTML = `<option value="">-- Pilih 1 dari ${sorted.length} Siswa Terdaftar --</option>` + optionsHtml;
    if (txSelect) txSelect.innerHTML = `<option value="">-- Pilih Siswa --</option>` + txOptionsHtml;
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

function refreshData() {
    loadState();
    renderAllViews();
    if (currentUser && currentUser.role === 'admin') updateChart();
    showToast('Data berhasil diperbarui!', 'success');
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

    const student = appStudents.find(s => s.id === currentUser.studentId);
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

// EDIT TARGET TABUNGAN MODAL
function openEditTargetModal(studentId) {
    const student = appStudents.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('target-student-id').value = student.id;
    document.getElementById('target-student-name').value = `${student.name} (${student.nisn})`;
    document.getElementById('target-student-phone').value = student.phone || '';
    document.getElementById('target-amount-input').value = student.target || 2000000;

    openModal('modal-edit-target');
}

function handleTargetSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('target-student-id').value;
    const newTarget = Number(document.getElementById('target-amount-input').value) || 2000000;
    const newPhone = document.getElementById('target-student-phone').value.trim();

    const studentIndex = appStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        const student = appStudents[studentIndex];
        const oldTarget = student.target;
        const oldPhone = student.phone;

        student.target = newTarget;
        student.phone = newPhone;
        saveStudents();
        renderAllViews();
        closeModal('modal-edit-target');

        showFeedbackSuccessModal(
            'Data Siswa Berhasil Diperbarui!',
            `Target tabungan siswa ${student.name} berhasil diatur ke ${formatRp(newTarget)} dan nomor WhatsApp berhasil disimpan.`
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
    showToast('Memproses & mengompres foto siswa...', 'info');

    const base64 = await compressImageFile(file);
    if (!base64) {
        showToast('Gagal memproses file foto.', 'error');
        return;
    }

    const row = document.querySelector(`tr[data-student-id="${studentId}"]`);
    if (row) {
        const photoInp = row.querySelector('.batch-inp-photo');
        if (photoInp) photoInp.value = base64;

        const thumbBox = document.getElementById(`batch-thumb-box-${studentId}`);
        if (thumbBox) {
            thumbBox.innerHTML = `<img src="${base64}" alt="Foto Siswa" id="batch-thumb-img-${studentId}">`;
        }

        const removeBtn = document.getElementById(`batch-btn-remove-${studentId}`);
        if (removeBtn) removeBtn.style.display = 'inline-flex';
    }

    // Update langsung in-memory state
    const student = appStudents.find(s => s.id === studentId);
    if (student) student.photo = base64;

    showToast('Foto berhasil dimuat! Klik "Simpan Semua Perubahan" untuk menyimpan.', 'success');
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

    showToast(`Memproses ${files.length} file foto...`, 'info');
    let matchedCount = 0;

    for (const file of Array.from(files)) {
        const rawFileName = file.name.toLowerCase();
        const baseName = rawFileName.substring(0, rawFileName.lastIndexOf('.')) || rawFileName;

        // Cocokkan berdasarkan NISN atau Nama Siswa
        const student = appStudents.find(s => {
            const nisn = s.nisn.toLowerCase();
            const sName = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanBase = baseName.replace(/[^a-z0-9]/g, '');
            return cleanBase.includes(nisn) || nisn.includes(cleanBase) || cleanBase === sName || sName.includes(cleanBase) || cleanBase.includes(sName);
        });

        if (student) {
            const base64 = await compressImageFile(file);
            if (base64) {
                student.photo = base64;
                const row = document.querySelector(`tr[data-student-id="${student.id}"]`);
                if (row) {
                    const photoInp = row.querySelector('.batch-inp-photo');
                    if (photoInp) photoInp.value = base64;

                    const thumbBox = document.getElementById(`batch-thumb-box-${student.id}`);
                    if (thumbBox) thumbBox.innerHTML = `<img src="${base64}" alt="${escapeHtml(student.name)}" id="batch-thumb-img-${student.id}">`;

                    const removeBtn = document.getElementById(`batch-btn-remove-${student.id}`);
                    if (removeBtn) removeBtn.style.display = 'inline-flex';
                }
                matchedCount++;
            }
        }
    }

    showToast(`Berhasil mencocokkan ${matchedCount} foto siswa! Klik "Simpan Semua Perubahan" untuk menyimpan permanen.`, 'success');
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

