const fs = require('fs');
const { argv } = require('yargs');

module.exports = () => {
    const dirPath = argv.dirPath;
    if (!dirPath || dirPath.includes('C') || !argv.fileName) return;
    const files = fs.readdirSync(dirPath) || [];
    files.forEach((c, i) => {
        fs.renameSync(`${dirPath}\\${c}`, `${dirPath}\\${argv.fileName} ${i + 1}.${argv.ext || c.split('.').slice(1).join('.')}`);
    });
}