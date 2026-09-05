const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const txMatch = appContent.match(/const INITIAL_TRANSACTIONS = (\[[\s\S]*?\]);/);
const stuMatch = appContent.match(/const OFFICIAL_STUDENTS = (\[[\s\S]*?\]);/);

const transactions = eval(txMatch[1]);
const students = eval(stuMatch[1]);

console.log('Total Students:', students.length);
console.log('Total Transactions:', transactions.length);

let totalDeposits = 0;
let totalWithdrawals = 0;
const studentCalculatedBalances = {};

students.forEach(s => {
    studentCalculatedBalances[s.id] = {
        id: s.id,
        nisn: s.nisn,
        name: s.name,
        statedBalance: s.balance,
        calculatedBalance: 0,
        txCount: 0
    };
});

transactions.forEach(t => {
    if (t.type === 'setor') {
        totalDeposits += t.amount;
        if (studentCalculatedBalances[t.studentId]) {
            studentCalculatedBalances[t.studentId].calculatedBalance += t.amount;
            studentCalculatedBalances[t.studentId].txCount++;
        }
    } else if (t.type === 'tarik') {
        totalWithdrawals += t.amount;
        if (studentCalculatedBalances[t.studentId]) {
            studentCalculatedBalances[t.studentId].calculatedBalance -= t.amount;
            studentCalculatedBalances[t.studentId].txCount++;
        }
    }
});

console.log('Total Kas Masuk (Setoran): Rp', totalDeposits.toLocaleString('id-ID'));
console.log('Total Kas Keluar (Penarikan): Rp', totalWithdrawals.toLocaleString('id-ID'));
console.log('Net Kas Tabungan Kelas: Rp', (totalDeposits - totalWithdrawals).toLocaleString('id-ID'));

let mismatches = [];
students.forEach(s => {
    const calc = studentCalculatedBalances[s.id];
    if (s.balance !== calc.calculatedBalance) {
        mismatches.push({
            id: s.id,
            name: s.name,
            stated: s.balance,
            calculated: calc.calculatedBalance,
            diff: calc.calculatedBalance - s.balance
        });
    }
});

if (mismatches.length === 0) {
    console.log('✅ ALL STUDENT BALANCES MATCH EXACTLY WITH TRANSACTION SUMS (100% ACCURATE)');
} else {
    console.log(`⚠️ Found ${mismatches.length} balance discrepancies:`, mismatches);
}
