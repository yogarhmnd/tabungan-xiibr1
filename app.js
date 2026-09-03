/* ==========================================================================
   APPLICATION INTERACTIVITY & LOGIC: Tabungan Siswa XII BR 1
   SMK PGRI 11 CILEDUG KOTA TANGERANG
   Wali Kelas: Yoga Rahmanda, S.Pd.
   Features: WhatsApp Notification System & 44 Student Roster
   ========================================================================= */

// Storage Keys (Auto-seeded with 44 Official Students)
const STORAGE_STUDENTS_KEY = 'tabungbr1_students_v6';
const STORAGE_TX_KEY = 'tabungbr1_transactions_v6';
const STORAGE_AUTH_KEY = 'tabungbr1_session_v6';
const STORAGE_WA_CONFIG_KEY = 'tabungbr1_waconfig_v6';
const STORAGE_THEME_KEY = 'tabungbr1_theme_v6';

// Official Class List for XII Bisnis Ritel 1 (44 Students with Registered WhatsApp Phone Numbers)
const OFFICIAL_STUDENTS = [
    { id: 'STU-001', nisn: '0085191456', name: 'AFGAN AFFANDI', phone: '081234567001', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-002', nisn: '0082546680', name: 'AHMAD', phone: '081234567002', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-003', nisn: '0082865515', name: 'AHMAD DAI ROBI', phone: '081234567003', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-004', nisn: '0092316992', name: 'ALFI SYAHRI', phone: '081234567004', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-005', nisn: '0085602576', name: 'ALFIESYA NUR RACHMAN', phone: '081234567005', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-006', nisn: '0087807942', name: 'ALIP PIRMANSAH', phone: '081234567006', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-007', nisn: '0086664698', name: 'ANANDA NOVAN ALVIAN', phone: '081234567007', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-008', nisn: '0082163626', name: 'AUGRAH DWI AURAWATI', phone: '081234567008', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-009', nisn: '0087919336', name: 'AURA RIZKA AMELIA', phone: '081234567009', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-010', nisn: '0086133724', name: 'CHARLIE NOVAL PRADANA', phone: '081234567010', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-011', nisn: '3080709342', name: 'DESIANALESTARI', phone: '081234567011', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-012', nisn: '0084895927', name: 'DHEBI NURMALA', phone: '081234567012', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-013', nisn: '0091881465', name: 'DINDA RAHMASARI SEPTIANA', phone: '081234567013', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-014', nisn: '3092826253', name: 'DOES SALAM', phone: '081234567014', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-015', nisn: '0081666197', name: 'ERVANSYAH FAUZI NASUTION', phone: '081234567015', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-016', nisn: '0088134330', name: 'FADHLI DZIL JALAL', phone: '081234567016', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-017', nisn: '3093487601', name: 'FATIHATUS SHALIHA', phone: '081234567017', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-018', nisn: '3084030878', name: 'FITRIANI SALWA', phone: '081234567018', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-019', nisn: '0092525525', name: 'ILHAM ADI SAPUTRA', phone: '081234567019', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-020', nisn: '0083705721', name: 'KURNIAWAN', phone: '081234567020', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-021', nisn: '0097656255', name: 'MARCEL MU\'AMAR', phone: '081234567021', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-022', nisn: '0092348363', name: 'MELATI KESYAFANI', phone: '081234567022', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-023', nisn: '0096716273', name: 'MOH ILYAS', phone: '081234567023', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-024', nisn: '0072822191', name: 'MUHAMAD ALVATAR', phone: '081234567024', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-025', nisn: '0092170243', name: 'MUHAMAD APDIL', phone: '081234567025', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-026', nisn: '0082428075', name: 'MUHAMAD FINZA DESMAWAN', phone: '081234567026', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-027', nisn: '0159615200', name: 'MUHAMMAD ALNUR PASHA', phone: '081234567027', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-028', nisn: '0086723136', name: 'MUHAMMAD AMALUL ARIFIN', phone: '081234567028', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-029', nisn: '0098972007', name: 'MUHAMMAD RAFA OKTAFIAN', phone: '081234567029', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-030', nisn: '0098916344', name: 'MUHAMMAD RIVIANSYAH', phone: '081234567030', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-031', nisn: '0085877685', name: 'NIRWAN AKBAR', phone: '081234567031', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-032', nisn: '0094378426', name: 'OLIFIAH YULIANTI', phone: '081234567032', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-033', nisn: '0087295743', name: 'PUTRA HAIRUL LATIF', phone: '081234567033', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-034', nisn: '0075181099', name: 'ROMDANI', phone: '081234567034', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-035', nisn: '0086296055', name: 'SAFIRA NAILA AGUSTIN', phone: '081234567035', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-036', nisn: '0104662813', name: 'SAVA QUINSHA AULIA YASMIN', phone: '081234567036', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-037', nisn: '0087746448', name: 'SILFA NOVIYANTI', phone: '081234567037', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-038', nisn: '0093065485', name: 'SITI SARAH AZZAHRA', phone: '081234567038', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-039', nisn: '0097696921', name: 'SRI WAHYUNINGSIH', phone: '081234567039', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-040', nisn: '0097699869', name: 'SYAFIA MARIAM HIDAYAT', phone: '081234567040', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-041', nisn: '0095383788', name: 'SYLVA ARDIANTI', phone: '081234567041', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-042', nisn: '0084351493', name: 'TB. FADLAN AL-FAROJ', phone: '081234567042', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-043', nisn: '0083453775', name: 'VIJAY MAHENDRA', phone: '081234567043', balance: 0, target: 1000000, password: 'password123' },
    { id: 'STU-044', nisn: '0091351864', name: 'ZEIN KHA ABDUL', phone: '081234567044', balance: 0, target: 1000000, password: 'password123' }
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

// Load State from LocalStorage (Otomatis memuat seluruh 44 siswa resmi)
function loadState() {
    let savedStudents = localStorage.getItem(STORAGE_STUDENTS_KEY);
    let savedTx = localStorage.getItem(STORAGE_TX_KEY);

    // Cek migrasi dari storage versi sebelumnya jika ada
    if (!savedStudents) {
        savedStudents = localStorage.getItem('tabungbr1_students_v5') || localStorage.getItem('tabungbr1_students_v4');
    }
    if (!savedTx) {
        savedTx = localStorage.getItem('tabungbr1_transactions_v5') || localStorage.getItem('tabungbr1_transactions_v4');
    }

    if (savedStudents) {
        try {
            const parsed = JSON.parse(savedStudents);
            // Salin data 44 siswa resmi dan satukan dengan data balance/target jika ada
            appStudents = OFFICIAL_STUDENTS.map((official, idx) => {
                const found = parsed.find(s => s.nisn === official.nisn || s.id === official.id || s.name.toUpperCase() === official.name.toUpperCase());
                return {
                    id: official.id,
                    nisn: official.nisn,
                    name: official.name,
                    phone: (found && found.phone) ? found.phone : official.phone,
                    balance: (found && typeof found.balance === 'number') ? found.balance : 0,
                    target: (found && typeof found.target === 'number') ? found.target : 1000000,
                    password: official.password || 'password123'
                };
            });
            saveStudents();
        } catch(e) {
            appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
            saveStudents();
        }
    } else {
        // Inisialisasi awal: Otomatis memuat 44 siswa resmi tanpa input manual admin
        appStudents = JSON.parse(JSON.stringify(OFFICIAL_STUDENTS));
        saveStudents();
    }

    if (savedTx) {
        try {
            appTransactions = JSON.parse(savedTx);
        } catch(e) {
            appTransactions = [];
        }
    } else {
        appTransactions = [];
        saveTransactions();
    }
}

function saveStudents() {
    localStorage.setItem(STORAGE_STUDENTS_KEY, JSON.stringify(appStudents));
}

function saveTransactions() {
    localStorage.setItem(STORAGE_TX_KEY, JSON.stringify(appTransactions));
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
            avatarEl.innerText = student.name.charAt(0);
            avatarEl.style.background = getStudentAvatarGradient(student.name);
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
        const statusBadge = progress >= 100
            ? `<span class="badge badge-emerald"><i class="fa-solid fa-check-circle"></i> Lunas</span>`
            : progress >= 50
            ? `<span class="badge badge-amber"><i class="fa-solid fa-hourglass-half"></i> Setengah Jalan</span>`
            : `<span class="badge badge-indigo"><i class="fa-solid fa-hourglass-start"></i> Baru Mulai</span>`;

        return `
        <tr style="${isMe ? 'background: rgba(99,102,241,0.12); font-weight: 700;' : ''}">
            <td style="font-size: 1.1rem; text-align:center;">${medal}</td>
            <td>
                ${isMe ? '<i class="fa-solid fa-star text-amber" title="Ini Anda"></i> ' : ''}
                ${escapeHtml(s.name)}
                ${isMe ? '<span class="badge badge-indigo" style="font-size:0.65rem; margin-left:4px;">Saya</span>' : ''}
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

    // Top Savers
    const sortedStudents = [...appStudents].sort((a, b) => b.balance - a.balance).slice(0, 5);
    const topSaversContainer = document.getElementById('top-savers-list');
    topSaversContainer.innerHTML = sortedStudents.map((s, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';
        return `
            <div class="saver-item">
                <div class="saver-rank ${rankClass}">${index + 1}</div>
                <div class="saver-info">
                    <strong>${escapeHtml(s.name)}</strong>
                    <small>NISN: ${s.nisn} | WA: ${s.phone || '-'}</small>
                </div>
                <div class="saver-amount">${formatRp(s.balance)}</div>
            </div>
        `;
    }).join('');

    // Recent Transactions
    const recentTx = [...appTransactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    const recentTbody = document.getElementById('recent-transactions-tbody');
    if (recentTx.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted p-4">Belum ada transaksi. Silakan tambah setoran siswa.</td></tr>`;
    } else {
        recentTbody.innerHTML = recentTx.map(t => `
            <tr>
                <td><code>${t.id}</code></td>
                <td>${formatDateTime(t.date)}</td>
                <td><strong>${escapeHtml(t.studentName)}</strong></td>
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
        `).join('');
    }
}

// 2. STUDENT DASHBOARD
function renderStudentDashboard() {
    if (!currentUser || currentUser.role !== 'siswa') return;

    const student = appStudents.find(s => s.id === currentUser.studentId);
    if (!student) return;

    const avatarEl = document.getElementById('s-welcome-avatar');
    if (avatarEl) {
        avatarEl.innerText = student.name.charAt(0);
        avatarEl.style.background = getStudentAvatarGradient(student.name);
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

    tbody.innerHTML = filtered.map(t => `
        <tr>
            <td><code>${t.id}</code></td>
            <td>${formatDateTime(t.date)}</td>
            <td><strong>${escapeHtml(t.studentName)}</strong></td>
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
    `).join('');
}

// 4. Students Grid Renderer (Admin)
function renderStudentsGrid() {
    const container = document.getElementById('students-cards-container');
    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));

    container.innerHTML = sortedStudents.map(s => {
        const progress = s.target > 0 ? Math.min(100, Math.round((s.balance / s.target) * 100)) : 0;
        return `
            <div class="student-card">
                <div class="student-header">
                    <div class="student-avatar" style="background: ${getStudentAvatarGradient(s.name)};">${s.name.charAt(0)}</div>
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

// 5. Report View Renderer (Admin)
function renderReportView() {
    const totalMasuk = appTransactions.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
    const totalKeluar = appTransactions.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
    const totalSaldo = appStudents.reduce((acc, s) => acc + s.balance, 0);

    document.getElementById('report-total-masuk').innerText = formatRp(totalMasuk);
    document.getElementById('report-total-keluar').innerText = formatRp(totalKeluar);
    document.getElementById('report-saldo-akhir').innerText = formatRp(totalSaldo);

    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));
    const tbody = document.getElementById('report-students-tbody');

    tbody.innerHTML = sortedStudents.map((s, index) => {
        const studentTx = appTransactions.filter(t => t.studentId === s.id);
        const setoran = studentTx.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
        const penarikan = studentTx.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
        const targetReached = s.target > 0 && s.balance >= s.target;

        return `
            <tr>
                <td>${index + 1}</td>
                <td><code>${s.nisn}</code></td>
                <td>
                    <strong>${escapeHtml(s.name)}</strong>
                    <br><small class="text-muted"><i class="fa-brands fa-whatsapp text-emerald"></i> ${s.phone || '-'}</small>
                </td>
                <td>
                    ${formatRp(s.target || 0)} 
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
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-layer-group text-rose"></i> Transaksi Tarik Masal (Banyak Siswa)`;
        submitBtn.className = 'btn btn-rose';
        submitBtn.innerHTML = `<i class="fa-solid fa-layer-group"></i> Eksekusi Tarik Masal (Batch)`;
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
    document.getElementById('target-amount-input').value = student.target || 1000000;

    openModal('modal-edit-target');
}

function handleTargetSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('target-student-id').value;
    const newTarget = Number(document.getElementById('target-amount-input').value) || 0;
    const newPhone = document.getElementById('target-student-phone').value.trim();

    const studentIndex = appStudents.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        appStudents[studentIndex].target = newTarget;
        appStudents[studentIndex].phone = newPhone;
        saveStudents();
        renderAllViews();
        closeModal('modal-edit-target');
        showToast(`Data & No WA ${appStudents[studentIndex].name} berhasil diperbarui!`, 'success');
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
    } else {
        titleEl.innerHTML = `<i class="fa-solid fa-circle-minus text-rose"></i> Catat Penarikan Uang Keluar`;
        submitBtn.className = 'btn btn-rose';
        submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Penarikan & Notifikasi WA`;
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

// WHATSAPP NOTIFICATION ENGINE
function buildWaMessageText(tx, student) {
    const isSetor = tx.type === 'setor';
    const txLabel = isSetor ? 'SETORAN TABUNGAN (UANG MASUK)' : 'PENARIKAN TABUNGAN (UANG KELUAR)';
    const emojiHeader = isSetor ? '📥' : '📤';

    let msg = `*${emojiHeader} NOTIFIKASI TABUNGAN SISWA*\n`;
    msg += `*SMK PGRI 11 CILEDUG KOTA TANGERANG*\n`;
    msg += `-------------------------------------------\n\n`;
    msg += `Yth. Orang Tua / Siswa:\n`;
    msg += `👤 *Nama:* ${student.name}\n`;
    msg += `🆔 *NISN:* ${student.nisn}\n`;
    msg += `🏫 *Kelas:* XII Bisnis Ritel 1 (BR 1)\n\n`;
    msg += `*Rincian Transaksi:* \n`;
    msg += `📌 *Jenis:* ${txLabel}\n`;
    msg += `🏷️ *Kategori:* ${tx.category}\n`;
    msg += `💰 *Nominal:* *${isSetor ? '+' : '-'} ${formatRp(tx.amount)}*\n`;
    msg += `🕒 *Waktu:* ${formatDateTime(tx.date)}\n`;
    msg += `📝 *Keterangan:* ${tx.note || '-'}\n\n`;
    msg += `-------------------------------------------\n`;
    msg += `💳 *SALDO TABUNGAN SAAT INI:* *${formatRp(student.balance)}*\n`;
    msg += `🎯 *Target Tabungan:* ${formatRp(student.target || 0)}\n`;
    msg += `-------------------------------------------\n\n`;
    msg += `_Pesan ini dikirim otomatis oleh Sistem Tabungan Kelas XII BR 1 SMK PGRI 11 Ciledug._\n`;
    msg += `Wali Kelas: *Yoga Rahmanda, S.Pd.*`;

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

// Export CSV
function exportToCSV() {
    let csvContent = "\uFEFF";
    csvContent += "REKAPITULASI TABUNGAN SISWA - SMK PGRI 11 CILEDUG KOTA TANGERANG\n";
    csvContent += "KELAS XII BISNIS RITEL 1 (WALI KELAS: YOGA RAHMANDA, S.Pd.)\n";
    csvContent += `Tanggal Cetak: ${new Date().toLocaleString('id-ID')}\n\n`;

    csvContent += "DATA SISWA & SALDO TABUNGAN (44 SISWA)\n";
    csvContent += "No,NISN,Nama Siswa,No WhatsApp,Target Tabungan,Total Setoran,Total Penarikan,Saldo Akhir\n";

    const sortedStudents = [...appStudents].sort((a, b) => a.name.localeCompare(b.name));

    sortedStudents.forEach((s, idx) => {
        const studentTx = appTransactions.filter(t => t.studentId === s.id);
        const setoran = studentTx.filter(t => t.type === 'setor').reduce((acc, t) => acc + t.amount, 0);
        const penarikan = studentTx.filter(t => t.type === 'tarik').reduce((acc, t) => acc + t.amount, 0);
        csvContent += `"${idx + 1}","'${s.nisn}","${s.name}","'${s.phone || ''}","${s.target}","${setoran}","${penarikan}","${s.balance}"\n`;
    });

    csvContent += "\n\nRIWAYAT TRANSAKSI DILAKUKAN\n";
    csvContent += "Kode TX,Waktu,NISN,Nama Siswa,Jenis,Kategori,Nominal,Catatan\n";

    const sortedTx = [...appTransactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedTx.forEach(t => {
        const student = appStudents.find(s => s.id === t.studentId);
        csvContent += `"${t.id}","${t.date}","'${student ? student.nisn : ''}","${t.studentName}","${t.type}","${t.category}","${t.amount}","${t.note || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Rekap_Tabungan_SMK_PGRI_11_XII_BR1_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('File Laporan Excel/CSV 44 Siswa berhasil diunduh!', 'success');
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

// Toast System
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald' : 'fa-circle-exclamation text-rose'}"></i>
        <span>${escapeHtml(message)}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 4000);
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
