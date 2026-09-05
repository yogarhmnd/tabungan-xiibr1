const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsonPath = path.join(rootDir, 'database', 'database_tabungan_xii_br1.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const targetDir = path.join(rootDir, 'assets', 'students');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Available source templates
const templates = [
    path.join(targetDir, '0085191456.jpg'),
    path.join(targetDir, '0085602576.jpg'),
    path.join(targetDir, '0092316992.jpg'),
    path.join(targetDir, 'media_1788438368256.jpg'),
    path.join(targetDir, 'media_1788438368257.jpg'),
    path.join(targetDir, 'media_1788438368259.jpg')
].filter(p => fs.existsSync(p));

if (templates.length === 0) {
    console.error('No template photo found!');
    process.exit(1);
}

console.log(`Found ${templates.length} template photos. Ensuring photos for ${data.students.length} students...`);

let createdCount = 0;
let existingCount = 0;

data.students.forEach((student, index) => {
    const filename = `${student.nisn}.jpg`;
    const filePath = path.join(targetDir, filename);

    if (!fs.existsSync(filePath)) {
        // Use circular template distribution
        const tpl = templates[index % templates.length];
        fs.copyFileSync(tpl, filePath);
        createdCount++;
        console.log(`Created: ${filename} for ${student.name}`);
    } else {
        existingCount++;
    }
});

console.log(`\nDone! Existing: ${existingCount}, Created: ${createdCount}, Total in folder: ${fs.readdirSync(targetDir).length}`);
