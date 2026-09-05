const fs = require('fs');
const path = require('path');

const dbJsonPath = path.join(__dirname, 'database_tabungan_xii_br1.json');
const data = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

console.log('Syncing data to app.js and database scripts...');
console.log(`- Students: ${data.students.length}`);
console.log(`- Transactions: ${data.transactions.length}`);

// Ensure categories on all transactions are proper
data.transactions.forEach(t => {
    if (t.type === 'setor') {
        t.category = 'Tabungan Harian';
    }
});

const appJsPath = path.join(__dirname, '..', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Update storage keys to v10
appJsContent = appJsContent.replace(/tabungbr1_students_v\d+/g, 'tabungbr1_students_v10');
appJsContent = appJsContent.replace(/tabungbr1_transactions_v\d+/g, 'tabungbr1_transactions_v10');
appJsContent = appJsContent.replace(/tabungbr1_session_v\d+/g, 'tabungbr1_session_v10');
appJsContent = appJsContent.replace(/tabungbr1_waconfig_v\d+/g, 'tabungbr1_waconfig_v10');
appJsContent = appJsContent.replace(/tabungbr1_theme_v\d+/g, 'tabungbr1_theme_v10');

// Replace INITIAL_TRANSACTIONS
const txJsonStr = JSON.stringify(data.transactions, null, 4);
const stuJsonStr = JSON.stringify(data.students, null, 4);

appJsContent = appJsContent.replace(/const INITIAL_TRANSACTIONS = \[[\s\S]*?\];/m, `const INITIAL_TRANSACTIONS = ${txJsonStr};`);
appJsContent = appJsContent.replace(/const OFFICIAL_STUDENTS = \[[\s\S]*?\];/m, `const OFFICIAL_STUDENTS = ${stuJsonStr};`);

fs.writeFileSync(appJsPath, appJsContent, 'utf8');
console.log('-> app.js updated successfully.');

// Write back cleaned json
fs.writeFileSync(dbJsonPath, JSON.stringify(data, null, 2), 'utf8');

// Regenerate SQL files
require('./generate_database.js');
